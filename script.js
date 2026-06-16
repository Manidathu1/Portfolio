const projects = {
  etl: {
    meta: "Enterprise ETL",
    title: "Banking ETL Command Grid",
    summary: "Designed and delivered regulated banking pipelines that move millions of transactions through reusable transformations, delta loads, and SCD handling with production-grade accuracy.",
    tags: ["25+ pipelines", "8M+ daily transactions", "99.5% accuracy"],
    bullets: [
      "Built mappings, sessions, workflows, and reusable transformations in Informatica PowerCenter and IICS.",
      "Processed data across 12+ enterprise source systems with sub-30s SLA requirements.",
      "Used validation and error-handling logic to keep financial data auditable and trustworthy."
    ]
  },
  snowflake: {
    meta: "Cloud Migration",
    title: "Snowflake Migration Sprint",
    summary: "Moved critical pipelines from on-premises Oracle to Snowflake, then tuned the new estate for speed, cost, and repeatable analytics performance.",
    tags: ["15 critical pipelines", "65% faster queries", "77% batch improvement"],
    bullets: [
      "Reduced query execution time with advanced partitioning and materialized views.",
      "Optimized Oracle PL/SQL stored procedures using index tuning and execution plan analysis.",
      "Cut batch processing from 2.5 hours to 35 minutes for high-impact workloads."
    ]
  },
  governance: {
    meta: "Data Governance",
    title: "Governance Atlas",
    summary: "Created a governance layer across data retention, lineage, sensitivity classification, and compliance controls for regulated financial environments.",
    tags: ["180+ governed assets", "35+ metadata mappings", "100% audit readiness"],
    bullets: [
      "Managed Data Retention lifecycle work through Informatica EDC and Informatica AXON.",
      "Built a 4-level sensitivity classification framework aligned with PDPL, NDMO, SAMA, and NCA.",
      "Reduced audit preparation time by 35% through complete lineage and dependency traceability."
    ]
  },
  weather: {
    meta: "Machine Learning",
    title: "Weather Uncertainty Lab",
    summary: "Built a probabilistic forecasting workflow that compares classical ML models with a Bayesian Neural Network and exposes uncertainty through interactive dashboards.",
    tags: ["96.93% test accuracy", "Bayesian NN", "Plotly dashboards"],
    bullets: [
      "Trained Decision Tree, Gradient Boosting Classifier, and Bayesian Neural Network models with Python, Pandas, and NumPy.",
      "Used EDA, label encoding, train-test splitting, confusion matrices, and loss-epoch curves.",
      "Visualized predictions and uncertainty levels for stakeholders in weather-sensitive domains."
    ]
  }
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const doc = document.documentElement;
const body = document.body;

function initReveals() {
  const revealItems = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });

  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 5, 4) * 70}ms`;
    observer.observe(item);
  });
}

function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  const seen = new WeakSet();

  const run = (counter) => {
    if (seen.has(counter)) return;
    seen.add(counter);

    const target = Number(counter.dataset.count);
    const decimals = Number(counter.dataset.decimals || 0);
    const duration = prefersReducedMotion ? 1 : 1150;
    const started = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - started) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(run);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) run(entry.target);
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => observer.observe(counter));
}

function initProjectLab() {
  const buttons = document.querySelectorAll(".project-card");
  const meta = document.getElementById("projectMeta");
  const title = document.getElementById("projectTitle");
  const summary = document.getElementById("projectSummary");
  const tags = document.getElementById("projectTags");
  const bullets = document.getElementById("projectBullets");
  const stage = document.querySelector(".project-stage");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const project = projects[button.dataset.project];
      if (!project) return;

      buttons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-selected", String(active));
      });

      stage.animate([
        { opacity: 0.45, transform: "translateY(10px) scale(0.99)" },
        { opacity: 1, transform: "translateY(0) scale(1)" }
      ], {
        duration: prefersReducedMotion ? 1 : 300,
        easing: "cubic-bezier(.2,.85,.2,1)"
      });

      meta.textContent = project.meta;
      title.textContent = project.title;
      summary.textContent = project.summary;
      tags.replaceChildren(...project.tags.map((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        return span;
      }));
      bullets.replaceChildren(...project.bullets.map((text) => {
        const li = document.createElement("li");
        li.textContent = text;
        return li;
      }));
    });
  });
}

function initSkillFilters() {
  const tabs = document.querySelectorAll(".skill-tabs button");
  const chips = document.querySelectorAll(".skill-chip");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;
      tabs.forEach((button) => button.classList.toggle("active", button === tab));

      chips.forEach((chip) => {
        const matches = filter === "all" || chip.dataset.skill.split(" ").includes(filter);
        chip.classList.toggle("dimmed", !matches);
      });
    });
  });
}

function initActiveNav() {
  const sections = document.querySelectorAll("[data-section]");
  const links = document.querySelectorAll(".site-nav a");
  const linkById = new Map([...links].map((link) => [link.getAttribute("href").slice(1), link]));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((link) => link.classList.remove("active"));
      const link = linkById.get(entry.target.id);
      if (link) link.classList.add("active");
    });
  }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.02 });

  sections.forEach((section) => observer.observe(section));
}

function initScrollProgress() {
  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable <= 0 ? 0 : (window.scrollY / scrollable) * 100;
    doc.style.setProperty("--progress", `${progress}%`);
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
}

function initCursor() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const core = document.querySelector(".cursor-core");
  const ring = document.querySelector(".cursor-ring");
  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let ringX = x;
  let ringY = y;

  window.addEventListener("pointermove", (event) => {
    x = event.clientX;
    y = event.clientY;
    body.classList.add("cursor-ready");
    core.style.transform = `translate3d(${x - 4}px, ${y - 4}px, 0)`;
  }, { passive: true });

  const loop = () => {
    ringX += (x - ringX) * 0.17;
    ringY += (y - ringY) * 0.17;
    ring.style.transform = `translate3d(${ringX - 20}px, ${ringY - 20}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();

  document.querySelectorAll("a, button, .metric-card, .mode-card, .credential-card").forEach((item) => {
    item.addEventListener("pointerenter", () => body.classList.add("cursor-active"));
    item.addEventListener("pointerleave", () => body.classList.remove("cursor-active"));
  });
}

function initMagnetics() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  document.querySelectorAll(".magnetic").forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      item.style.setProperty("--mag-x", `${x * 0.12}px`);
      item.style.setProperty("--mag-y", `${y * 0.18}px`);
    });

    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--mag-x", "0px");
      item.style.setProperty("--mag-y", "0px");
    });
  });
}

function initHeroTilt() {
  if (prefersReducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

  const hero = document.querySelector(".hero");
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    hero.style.setProperty("--tilt-x", `${x * 2.2}deg`);
    hero.style.setProperty("--tilt-y", `${y * -1.6}deg`);
  }, { passive: true });

  hero.addEventListener("pointerleave", () => {
    hero.style.setProperty("--tilt-x", "0deg");
    hero.style.setProperty("--tilt-y", "0deg");
  });
}

function initKineticName() {
  if (prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const name = document.querySelector(".kinetic-name");
  if (!name) return;

  const letters = name.querySelectorAll(".name-row span");
  letters.forEach((letter, index) => {
    letter.style.setProperty("--i", index);
  });

  name.addEventListener("pointermove", (event) => {
    const rect = name.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const moveX = (event.clientX - centerX) / rect.width;
    const moveY = (event.clientY - centerY) / rect.height;

    letters.forEach((letter, index) => {
      const offset = (index - letters.length / 2) * 0.55;
      letter.style.setProperty("--name-x", `${moveX * 18 + offset}px`);
      letter.style.setProperty("--name-y", `${moveY * 16}px`);
      letter.style.setProperty("--name-rx", `${moveY * -28}deg`);
      letter.style.setProperty("--name-ry", `${moveX * 34}deg`);
    });
  });

  name.addEventListener("pointerleave", () => {
    letters.forEach((letter) => {
      letter.style.setProperty("--name-x", "0px");
      letter.style.setProperty("--name-y", "0px");
      letter.style.setProperty("--name-rx", "0deg");
      letter.style.setProperty("--name-ry", "0deg");
    });
  });
}

function initParticleField() {
  const canvas = document.getElementById("field");
  const ctx = canvas.getContext("2d");
  const pointer = { x: -9999, y: -9999 };
  let particles = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  const colors = ["20, 228, 210", "73, 189, 245", "241, 92, 255", "255, 190, 88", "99, 240, 166"];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(96, Math.max(42, Math.floor(width * height / 18000)));
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      size: 1 + Math.random() * 1.8,
      color: colors[index % colors.length]
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      const dx = pointer.x - p.x;
      const dy = pointer.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 120) {
        p.x -= dx * 0.006;
        p.y -= dy * 0.006;
      }

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const distance = Math.hypot(p.x - q.x, p.y - q.y);
        if (distance < 118) {
          ctx.strokeStyle = `rgba(${p.color}, ${0.16 * (1 - distance / 118)})`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      ctx.fillStyle = `rgba(${p.color}, 0.74)`;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  window.addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    pointer.x = -9999;
    pointer.y = -9999;
  });

  resize();
  if (!prefersReducedMotion) draw();
}

initReveals();
initCounters();
initProjectLab();
initSkillFilters();
initActiveNav();
initScrollProgress();
initCursor();
initMagnetics();
initHeroTilt();
initKineticName();
initParticleField();