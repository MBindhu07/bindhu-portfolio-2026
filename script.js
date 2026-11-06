/**
 * M BINDHU - PROFESSIONAL PORTFOLIO SCRIPT
 * High-performance interactive UI, dynamic simulators, canvas particles,
 * skill filtering, project modals, and theme management.
 */

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initParticleCanvas();
  initTypingEffect();
  initNavbarScroll();
  initMobileMenu();
  initSkillsFilter();
  initProjectsFilter();
  initAiPlayground();
  initModals();
  initContactForm();
  initCopyButtons();
  initBackToTop();
  initAnimatedCounters();
});

/* ==========================================================================
   1. THEME SWITCHER (Dark/Light with localStorage)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById("theme-toggle");
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem("bindhu-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  toggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("bindhu-theme", newTheme);
    showToast(`Switched to ${newTheme} theme`);
  });
}

/* ==========================================================================
   2. INTERACTIVE PARTICLE CANVAS BACKGROUND
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById("particle-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);

  const mouse = {
    x: null,
    y: null,
    radius: 120
  };

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 2.5;
          this.y -= (dy / dist) * force * 2.5;
        }
      }
    }

    draw() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = isLight ? "rgba(37, 99, 235, 0.4)" : "rgba(56, 189, 248, 0.4)";
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isLight = document.documentElement.getAttribute("data-theme") === "light";
    const lineColor = isLight ? "rgba(37, 99, 235, " : "rgba(56, 189, 248, ";

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          const opacity = (1 - dist / 110) * 0.22;
          ctx.beginPath();
          ctx.strokeStyle = lineColor + opacity + ")";
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   3. HERO TYPING EFFECT
   ========================================================================== */
function initTypingEffect() {
  const textElement = document.getElementById("typing-text");
  if (!textElement) return;

  const roles = [
    "Full-Stack Web Developer",
    "AI & Deep Learning Engineer",
    "Computer Science & Design Undergrad",
    "Cloud & Backend Architect",
    "Computer Graphics Enthusiast"
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deletingSpeed = 45;
  const pauseEnd = 1600;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      textElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      textElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      speed = pauseEnd;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      speed = 350;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ==========================================================================
   4. NAVBAR SCROLL & ACTIVE LINK SPY
   ========================================================================== */
function initNavbarScroll() {
  const header = document.querySelector(".site-header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  window.addEventListener("scroll", () => {
    // Header glass background on scroll
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    // Scroll spy
    let currentId = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${currentId}`) {
        link.classList.add("active");
      }
    });
  });
}

/* ==========================================================================
   5. MOBILE MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const navLinks = document.getElementById("nav-links");
  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
    });
  });
}

/* ==========================================================================
   6. SKILLS MATRIX FILTER & SEARCH
   ========================================================================== */
function initSkillsFilter() {
  const chips = document.querySelectorAll(".skills-controls .filter-chip");
  const skillCards = document.querySelectorAll(".skill-card");
  const searchInput = document.getElementById("skill-search");

  if (!chips.length || !skillCards.length) return;

  function filterSkills() {
    const activeChip = document.querySelector(".skills-controls .filter-chip.active");
    const activeCategory = activeChip ? activeChip.getAttribute("data-category") : "all";
    const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : "";

    skillCards.forEach((card) => {
      const category = card.getAttribute("data-category") || "";
      const skillName = card.querySelector(".skill-name")?.textContent.toLowerCase() || "";
      const skillContext = card.querySelector(".skill-context")?.textContent.toLowerCase() || "";

      const matchesCategory = activeCategory === "all" || category.includes(activeCategory);
      const matchesSearch = !searchTerm || skillName.includes(searchTerm) || skillContext.includes(searchTerm);

      if (matchesCategory && matchesSearch) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      filterSkills();
    });
  });

  if (searchInput) {
    searchInput.addEventListener("input", filterSkills);
  }
}

/* ==========================================================================
   7. PROJECTS FILTER
   ========================================================================== */
function initProjectsFilter() {
  const chips = document.querySelectorAll(".projects-controls .filter-chip");
  const projectCards = document.querySelectorAll(".project-card");
  if (!chips.length || !projectCards.length) return;

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const category = chip.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category") || "";
        if (category === "all" || cardCategory.includes(category)) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
}

/* ==========================================================================
   8. INTERACTIVE AI PLAYGROUND SIMULATOR
   ========================================================================== */
function initAiPlayground() {
  // Tab switching between Multimodal Detector and SafeAI Drive
  const tabs = document.querySelectorAll(".demo-tab-btn");
  const panels = document.querySelectorAll(".demo-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-target");
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add("active");
    });
  });

  // Multimodal Detector Presets
  const attackPresets = {
    phishing: {
      text: 96,
      audio: 42,
      image: 88,
      overall: 94,
      verdict: "CRITICAL: AI Attack Detected",
      subtext: "High adversarial probability across LLM text generation and synthetic branding logo.",
      color: "var(--accent-rose)"
    },
    voiceclone: {
      text: 35,
      audio: 98,
      image: 12,
      overall: 91,
      verdict: "ALERT: Deepfake Voice Clone",
      subtext: "Acoustic frequency anomalies and spectral artifact match neural TTS synthetic waveform.",
      color: "var(--accent-amber)"
    },
    ganimage: {
      text: 20,
      audio: 15,
      image: 97,
      overall: 89,
      verdict: "ALERT: Diffusion GAN Generated Media",
      subtext: "High-frequency latent noise and unnatural Fourier transforms identified.",
      color: "var(--accent-purple)"
    },
    benign: {
      text: 8,
      audio: 5,
      image: 11,
      overall: 7,
      verdict: "VERIFIED: Authentic Human Origin",
      subtext: "Natural semantic entropy, human vocal tract formant transitions, and unmanipulated EXIF.",
      color: "var(--accent-emerald)"
    }
  };

  const presetBtns = document.querySelectorAll(".attack-preset-btn");
  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      presetBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const key = btn.getAttribute("data-preset");
      const data = attackPresets[key];
      if (!data) return;

      document.getElementById("bar-text").style.width = `${data.text}%`;
      document.getElementById("val-text").textContent = `${data.text}%`;

      document.getElementById("bar-audio").style.width = `${data.audio}%`;
      document.getElementById("val-audio").textContent = `${data.audio}%`;

      document.getElementById("bar-image").style.width = `${data.image}%`;
      document.getElementById("val-image").textContent = `${data.image}%`;

      document.getElementById("bar-overall").style.width = `${data.overall}%`;
      document.getElementById("val-overall").textContent = `${data.overall}%`;

      const verdictEl = document.getElementById("attack-verdict-title");
      const subEl = document.getElementById("attack-verdict-sub");
      verdictEl.textContent = data.verdict;
      verdictEl.style.color = data.color;
      subEl.textContent = data.subtext;
    });
  });

  // SafeAI Drive Presets
  const drivePresets = {
    highway: {
      speed: "65 km/h",
      distract: 6,
      drowsy: 8,
      risk: 10,
      status: "SAFE: Optimal Driver Attention",
      sub: "Gaze vector aligned with road. Eye aspect ratio normal (0.34).",
      color: "var(--accent-emerald)"
    },
    phone: {
      speed: "58 km/h",
      distract: 89,
      drowsy: 24,
      risk: 86,
      status: "WARNING: Handheld Device Distraction",
      sub: "Object detector identified mobile phone in driver hand. Head tilt > 28°.",
      color: "var(--accent-rose)"
    },
    drowsy: {
      speed: "72 km/h",
      distract: 32,
      drowsy: 94,
      risk: 92,
      status: "CRITICAL: Severe Driver Fatigue Alert",
      sub: "Prolonged PERCLOS detected (> 2.8s eyelid closure). Auditory alert sounded.",
      color: "var(--accent-rose)"
    },
    weave: {
      speed: "84 km/h",
      distract: 65,
      drowsy: 40,
      risk: 78,
      status: "WARNING: Risky Driving Maneuvers",
      sub: "Rapid lateral lane deviation and unstable throttle modulation detected.",
      color: "var(--accent-amber)"
    }
  };

  const driveBtns = document.querySelectorAll(".drive-preset-btn");
  driveBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      driveBtns.forEach((b) => b.classList.remove("selected"));
      btn.classList.add("selected");

      const key = btn.getAttribute("data-preset");
      const data = drivePresets[key];
      if (!data) return;

      document.getElementById("drive-val-speed").textContent = data.speed;

      document.getElementById("drive-bar-distract").style.width = `${data.distract}%`;
      document.getElementById("drive-val-distract").textContent = `${data.distract}%`;

      document.getElementById("drive-bar-drowsy").style.width = `${data.drowsy}%`;
      document.getElementById("drive-val-drowsy").textContent = `${data.drowsy}%`;

      document.getElementById("drive-bar-risk").style.width = `${data.risk}%`;
      document.getElementById("drive-val-risk").textContent = `${data.risk}%`;

      const verdictEl = document.getElementById("drive-verdict-title");
      const subEl = document.getElementById("drive-verdict-sub");
      verdictEl.textContent = data.status;
      verdictEl.style.color = data.color;
      subEl.textContent = data.sub;
    });
  });
}

/* ==========================================================================
   9. MODALS (Project Details & Resume)
   ========================================================================== */
function initModals() {
  const projectDetails = {
    multimodal: {
      title: "Multimodal Deep Learning AI-Generated Attack Detection",
      subtitle: "Cybersecurity Analysis System across Text, Audio, and Image Modalities",
      date: "September 2025",
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="background: rgba(6, 182, 212, 0.08); border-left: 3px solid var(--accent-cyan); padding: 1rem; border-radius: 4px;">
            <strong style="color:var(--text-main);">Project Overview:</strong>
            <p style="margin-top:0.35rem;">As generative AI models (LLMs, neural voice cloning, and diffusion models) proliferated, adversarial cyberattacks gained the capability to simultaneously spoof text, cloned voice instructions, and deepfake imagery to bypass conventional security checks.</p>
          </div>

          <h4 style="color:var(--text-main); font-size:1.1rem;">Architectural Highlights:</h4>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>Text Analysis Pipeline:</strong> Employs fine-tuned transformer representations to examine perplexity distributions, burstiness, and semantic coherence indicative of synthetic LLM generation.</li>
            <li><strong>Audio Spectrogram Pipeline:</strong> Extracts mel-frequency cepstral coefficients (MFCCs) and spectral roll-off to identify robotic artifacts and synthetic vocal tract formants characteristic of text-to-speech vocoders.</li>
            <li><strong>Computer Vision Pipeline:</strong> Leverages deep convolutional feature maps to detect Fourier frequency artifacts, color-space anomalies, and synthetic blending boundaries in facial/document imagery.</li>
            <li><strong>Unified Fusion Classifier:</strong> Incorporates an attention-weighted late-fusion classifier that aggregates the confidence vectors from all 3 pipelines into a single robust cybersecurity threat score.</li>
          </ul>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: 8px;">
            <h5 style="color:var(--accent-cyan); margin-bottom:0.5rem; text-transform:uppercase; font-size:0.8rem;">Core Technologies</h5>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              <span class="tag-badge">Python</span>
              <span class="tag-badge">PyTorch</span>
              <span class="tag-badge">Computer Vision</span>
              <span class="tag-badge">Audio Signal Processing</span>
              <span class="tag-badge">Deep Learning</span>
              <span class="tag-badge">Multimodal Classification</span>
              <span class="tag-badge">Cybersecurity</span>
            </div>
          </div>
        </div>
      `
    },
    safeai: {
      title: "SafeAI Drive – AI-Powered Road Safety & Accident Prevention System",
      subtitle: "Real-Time Driver Behavior Detection & Predictive Accident Risk Modeling",
      date: "August 2025",
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="background: rgba(16, 185, 129, 0.08); border-left: 3px solid var(--accent-emerald); padding: 1rem; border-radius: 4px;">
            <strong style="color:var(--text-main);">Project Overview:</strong>
            <p style="margin-top:0.35rem;">Designed to dramatically reduce vehicular road accidents caused by driver drowsiness, distraction (e.g. mobile phone usage), and erratic maneuvering through low-latency edge computer vision and proactive accident prediction.</p>
          </div>

          <h4 style="color:var(--text-main); font-size:1.1rem;">Key Subsystems & Engineering:</h4>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li><strong>Facial Landmark & Eye Aspect Ratio (EAR):</strong> Tracks 68 facial landmarks in real time using OpenCV to compute eyelid closure duration (PERCLOS) and head pose yaw/pitch/roll angles.</li>
            <li><strong>Object Detection for Distractions:</strong> Real-time detection of mobile devices, food/beverage containers, and off-wheel hand gestures near the steering wheel.</li>
            <li><strong>Accident Risk Prediction Model:</strong> Combines real-time telemetry (speed variance, steering angle rate) with driver state signals to forecast incident risk probabilities.</li>
            <li><strong>Zero-Latency Audio-Visual Warning Engine:</strong> Dispatches multi-level audio-visual alerts before potential collision hazards occur.</li>
          </ul>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: 8px;">
            <h5 style="color:var(--accent-emerald); margin-bottom:0.5rem; text-transform:uppercase; font-size:0.8rem;">Core Technologies</h5>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              <span class="tag-badge">Python</span>
              <span class="tag-badge">OpenCV</span>
              <span class="tag-badge">Computer Vision</span>
              <span class="tag-badge">Machine Learning</span>
              <span class="tag-badge">Edge AI</span>
              <span class="tag-badge">Real-Time Alerting</span>
            </div>
          </div>
        </div>
      `
    },
    rotaract: {
      title: "Full-Stack MERN Platform & OpenGL Graphics Engine",
      subtitle: "Rotaract Club of Atria I.T. Internship Project",
      date: "March 2025 – June 2025",
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="background: rgba(139, 92, 246, 0.08); border-left: 3px solid var(--accent-purple); padding: 1rem; border-radius: 4px;">
            <strong style="color:var(--text-main);">Program Summary:</strong>
            <p style="margin-top:0.35rem;">Completed an intensive 9-week program combining full-stack web application engineering on the MERN stack with native 2D and 3D computer graphics development in OpenGL.</p>
          </div>

          <h4 style="color:var(--text-main); font-size:1.1rem;">Engineering Highlights:</h4>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li>Built scalable REST services and authenticated dashboards with Node.js, Express.js, MySQL, and MongoDB.</li>
            <li>Programmed real-time interactive 2D/3D graphics in OpenGL leveraging 4 fundamental techniques: custom rendering loops, affine geometric transformations (scaling, rotation, translation), Phong lighting models, and texture mapping.</li>
          </ul>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: 8px;">
            <h5 style="color:var(--accent-purple); margin-bottom:0.5rem; text-transform:uppercase; font-size:0.8rem;">Core Technologies</h5>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              <span class="tag-badge">OpenGL</span>
              <span class="tag-badge">C++</span>
              <span class="tag-badge">Node.js</span>
              <span class="tag-badge">Express.js</span>
              <span class="tag-badge">React</span>
              <span class="tag-badge">MongoDB</span>
              <span class="tag-badge">MySQL</span>
            </div>
          </div>
        </div>
      `
    },
    onestop: {
      title: "Enterprise Booking & Workflow REST Backend",
      subtitle: "1Stop Web Development Internship Project",
      date: "September 2025 – November 2025",
      content: `
        <div style="display:flex; flex-direction:column; gap:1.25rem;">
          <div style="background: rgba(59, 130, 246, 0.08); border-left: 3px solid var(--accent-blue); padding: 1rem; border-radius: 4px;">
            <strong style="color:var(--text-main);">Project Overview:</strong>
            <p style="margin-top:0.35rem;">Engineered backend REST APIs with Laravel and MySQL to manage multi-step user booking request workflows, transaction states, and administrative reporting.</p>
          </div>

          <h4 style="color:var(--text-main); font-size:1.1rem;">Key Achievements:</h4>
          <ul style="padding-left:1.25rem; display:flex; flex-direction:column; gap:0.5rem;">
            <li>Designed normalized relational database schemas in MySQL with foreign key constraints, indexes, and optimized query execution plans.</li>
            <li>Implemented robust backend authentication, role-based authorization, and request validation middleware in PHP.</li>
            <li>Integrated automated webhooks and status notification services for seamless client-server sync.</li>
          </ul>

          <div style="background: var(--bg-card); border: 1px solid var(--border-subtle); padding: 1.25rem; border-radius: 8px;">
            <h5 style="color:var(--accent-blue); margin-bottom:0.5rem; text-transform:uppercase; font-size:0.8rem;">Core Technologies</h5>
            <div style="display:flex; flex-wrap:wrap; gap:0.4rem;">
              <span class="tag-badge">PHP</span>
              <span class="tag-badge">Laravel</span>
              <span class="tag-badge">MySQL</span>
              <span class="tag-badge">REST APIs</span>
              <span class="tag-badge">Database Design</span>
            </div>
          </div>
        </div>
      `
    }
  };

  const projectModal = document.getElementById("project-modal");
  const projectModalTitle = document.getElementById("project-modal-title");
  const projectModalBody = document.getElementById("project-modal-body");

  // Open Project Details
  document.querySelectorAll(".open-project-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const projectKey = btn.getAttribute("data-project");
      const data = projectDetails[projectKey];
      if (!data) return;

      projectModalTitle.textContent = data.title;
      projectModalBody.innerHTML = `
        <div style="margin-bottom:1rem; font-size:0.85rem; color:var(--accent-cyan); font-weight:600;">
          ${data.subtitle} &bull; ${data.date}
        </div>
        ${data.content}
      `;

      projectModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Resume Modal
  const resumeModal = document.getElementById("resume-modal");
  const resumeBtns = document.querySelectorAll(".open-resume-btn");
  resumeBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      resumeModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Print Resume
  const printResumeBtn = document.getElementById("print-resume-btn");
  if (printResumeBtn) {
    printResumeBtn.addEventListener("click", () => {
      window.print();
    });
  }

  // Close modals
  document.querySelectorAll(".modal-close-btn, .modal-backdrop").forEach((el) => {
    el.addEventListener("click", (e) => {
      if (e.target === el || el.classList.contains("modal-close-btn")) {
        document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("active"));
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("active"));
      document.body.style.overflow = "";
    }
  });
}

/* ==========================================================================
   10. CONTACT FORM HANDLING
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = form.querySelector("#contact-name").value.trim();
    const email = form.querySelector("#contact-email").value.trim();
    const subject = form.querySelector("#contact-subject").value.trim();
    const message = form.querySelector("#contact-message").value.trim();

    if (!name || !email || !message) {
      showToast("Please fill in all required fields.", true);
      return;
    }

    // Compose mailto fallback link as direct backup
    const mailtoUrl = `mailto:bindhu07062005@gmail.com?subject=${encodeURIComponent(
      subject || "Portfolio Contact from " + name
    )}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;

    showToast("Message sent! Opening your mail client...", false);
    form.reset();

    setTimeout(() => {
      window.location.href = mailtoUrl;
    }, 800);
  });
}

/* ==========================================================================
   11. ONE-CLICK COPY BUTTONS
   ========================================================================== */
function initCopyButtons() {
  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const textToCopy = btn.getAttribute("data-copy");
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg> Copied!
        `;
        showToast(`Copied to clipboard: ${textToCopy}`);
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        showToast("Could not copy automatically. Text: " + textToCopy);
      });
    });
  });
}

/* ==========================================================================
   12. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById("back-to-top");
  if (!backToTopBtn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add("visible");
    } else {
      backToTopBtn.classList.remove("visible");
    }
  });

  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}

/* ==========================================================================
   13. ANIMATED COUNTERS
   ========================================================================== */
function initAnimatedCounters() {
  const counters = document.querySelectorAll(".stat-number[data-target]");
  if (!counters.length) return;

  let hasAnimated = false;
  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        hasAnimated = true;
        counters.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          const suffix = counter.getAttribute("data-suffix") || "";
          let count = 0;
          const duration = 1500;
          const stepTime = 30;
          const increment = Math.ceil(target / (duration / stepTime));

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              counter.textContent = target + suffix;
              clearInterval(timer);
            } else {
              counter.textContent = count + suffix;
            }
          }, stepTime);
        });
      }
    },
    { threshold: 0.3 }
  );

  const statsStrip = document.querySelector(".stats-strip");
  if (statsStrip) observer.observe(statsStrip);
}

/* ==========================================================================
   14. TOAST NOTIFICATION UTILITY
   ========================================================================== */
function showToast(message, isError = false) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  if (isError) {
    toast.style.borderColor = "var(--accent-rose)";
  }

  toast.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="${
      isError ? "var(--accent-rose)" : "var(--accent-cyan)"
    }" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${
        isError
          ? '<circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line>'
          : '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>'
      }
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add("show"));

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}
