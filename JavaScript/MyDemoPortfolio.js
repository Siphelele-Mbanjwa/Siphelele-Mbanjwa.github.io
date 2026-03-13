// ─── Constants ───────────────────────────────────────────────────────────────
const TIMING = {
  fadeDelay:     150,   // stagger delay between fade-in elements (ms)
  fadeDuration:  600,   // fade-in transition duration (ms)
  toastDuration: 3500,  // how long toasts stay on screen (ms)
  skillDelay:    200,   // stagger delay between skill bar animations (ms)
};


// ─── Toast Notification ───────────────────────────────────────────────────────
// Replaces intrusive alert() with a non-blocking toast in the corner
function injectToastStyles() {
  if (document.getElementById("toast-styles")) return;
  const style = document.createElement("style");
  style.id = "toast-styles";
  style.textContent = `
    #toast-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      z-index: 9999;
    }
    .toast {
      background: #2c3e50;
      color: #ecf0f1;
      padding: 14px 20px;
      border-radius: 10px;
      border-left: 4px solid #307ecc;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      font-family: 'DM Sans', sans-serif;
      font-size: 14px;
      max-width: 320px;
      opacity: 0;
      transform: translateY(12px);
      transition: opacity 0.35s ease, transform 0.35s ease;
    }
    .toast.show {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

function showToast(message) {
  injectToastStyles();

  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("show"));
  });

  setTimeout(() => {
    toast.classList.remove("show");
    toast.addEventListener("transitionend", () => toast.remove(), { once: true });
  }, TIMING.toastDuration);
}


// ─── Welcome Toast (index.html only) ─────────────────────────────────────────
// Shows a welcome message only on the home page
function initWelcome() {
  const isHomePage = document.title.includes("Portfolio") &&
                     document.querySelector(".hero");
  if (isHomePage) {
    setTimeout(() => showToast("👋 Welcome to my portfolio!"), 1200);
  }
}


// ─── Active Nav Link Highlight ────────────────────────────────────────────────
// Automatically marks the correct nav link as active based on current page
function initActiveNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll("nav a");
  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}


// ─── Scroll-triggered Fade-in (IntersectionObserver) ─────────────────────────
// Animates elements with class .fade-in as they scroll into view
function initFadeIn() {
  const fadeElements = document.querySelectorAll(".fade-in");
  if (!fadeElements.length) return;

  fadeElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
    el.style.transition = `opacity ${TIMING.fadeDuration}ms ease-out, transform ${TIMING.fadeDuration}ms ease-out`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * TIMING.fadeDelay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeElements.forEach((el) => observer.observe(el));
}


// ─── Skill Bar Animations (about.html) ───────────────────────────────────────
// Animates the skill progress bars when they scroll into view
function initSkillBars() {
  const skillFills = document.querySelectorAll(".skill-fill");
  if (!skillFills.length) return;

  // Store target widths then reset to 0
  skillFills.forEach((bar) => {
    bar.dataset.targetWidth = bar.style.width;
    bar.style.width = "0%";
    bar.style.transition = `width 1s ease`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll(".skill-fill");
          fills.forEach((bar, index) => {
            setTimeout(() => {
              bar.style.width = bar.dataset.targetWidth;
            }, index * TIMING.skillDelay);
          });
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  const skillsGrid = document.querySelector(".skills-grid");
  if (skillsGrid) observer.observe(skillsGrid);
}


// ─── Project Card Hover Sound Effect (projects.html) ─────────────────────────
// Adds a subtle hover interaction to project cards
function initProjectCards() {
  const cards = document.querySelectorAll(".project-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.style.cursor = "pointer";
    });

    // Show toast with project tech stack on click
    card.addEventListener("click", () => {
      const name = card.querySelector(".project-name")?.textContent;
      const tags = [...card.querySelectorAll(".tag")].map((t) => t.textContent).join(", ");
      if (name && tags) {
        showToast(`🚀 ${name} — Built with: ${tags}`);
      }
    });
  });
}


// ─── Contact Channel Click Feedback (contact.html) ───────────────────────────
// Shows a helpful toast when user clicks a contact channel
function initContactChannels() {
  const emailCard = document.querySelector(".channel-card.email");
  const githubCard = document.querySelector(".channel-card.github");

  if (emailCard) {
    emailCard.addEventListener("click", () => {
      showToast("📧 Opening your email client...");
    });
  }

  if (githubCard) {
    githubCard.addEventListener("click", () => {
      showToast("💻 Opening GitHub profile...");
    });
  }
}


// ─── Navbar Scroll Behaviour ──────────────────────────────────────────────────
// Adds a shadow to the navbar when the user scrolls down
function initNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      nav.style.boxShadow = "0 8px 32px rgba(0,0,0,0.12)";
    } else {
      nav.style.boxShadow = "none";
    }
  }, { passive: true });
}


// ─── Smooth Scroll for anchor links ──────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });
}


// ─── Copy Email to Clipboard ──────────────────────────────────────────────────
// On the contact page, right-clicking the email card copies the address
function initCopyEmail() {
  const emailCard = document.querySelector(".channel-card.email");
  if (!emailCard) return;

  emailCard.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const email = "siphelelembanjwa850@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
      showToast("📋 Email address copied to clipboard!");
    }).catch(() => {
      showToast("📧 siphelelembanjwa850@gmail.com");
    });
  });
}


// ─── Init — runs everything on page load ─────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  initWelcome();
  initActiveNav();
  initFadeIn();
  initSkillBars();
  initProjectCards();
  initContactChannels();
  initNavScroll();
  initSmoothScroll();
  initCopyEmail();
});