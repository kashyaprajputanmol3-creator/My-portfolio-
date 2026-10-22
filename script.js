/*
  ANMOL KASHYAP portfolio
  Firebase setup:
  1) Create a Firebase project and register a Web app.
  2) Paste its web config into FIREBASE_CONFIG below (these values are public identifiers).
  3) Enable Firestore, deploy firebase/firestore.rules, and optionally enable App Check.
  4) Replace social links in PORTFOLIO_CONFIG.
  Never put service-account credentials or private API secrets in this file.
*/
const PORTFOLIO_CONFIG = {
  name: "Anmol Kashyap",
  social: {
    linkedin: "https://www.linkedin.com/", // Replace with your real profile URL
    github: "https://github.com/",         // Replace with your real profile URL
    instagram: "https://www.instagram.com/"// Replace with your real profile URL
  }
};

// Replace placeholder strings with your Firebase project's web-app configuration.
// Firebase web config is not a server secret; Firestore Security Rules are the security boundary.
const FIREBASE_CONFIG = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "PASTE_YOUR_MESSAGING_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Current year
$("#year").textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $("#menuToggle");
const mainNav = $("#mainNav");
menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mainNav.classList.toggle("open", !isOpen);
});
$$(".nav-link").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}));

// Reveal sections only when visible; no animation work is needed when reduced motion is enabled.
if ("IntersectionObserver" in window && !reducedMotion) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => revealObserver.observe(el));
} else {
  $$(".reveal").forEach(el => el.classList.add("is-visible"));
}

// Highlight the current navigation section.
if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$(".nav-link").forEach(link => {
        const active = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });
  $$("main section[id]").forEach(section => sectionObserver.observe(section));
}

// Interactive chrome monogram: mouse movement and touch drag rotate the CSS object.
// It is intentionally lightweight and does not require WebGL.
const monogram = $("#monogram");
let rotationX = -8, rotationY = 12, dragState = null;
function paintMonogram() {
  monogram.style.transform = `rotateX(${rotationX}deg) rotateY(${rotationY}deg) translateZ(0)`;
}
paintMonogram();
monogram.addEventListener("pointerdown", event => {
  dragState = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  if (monogram.setPointerCapture) monogram.setPointerCapture(event.pointerId);
});
monogram.addEventListener("pointermove", event => {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const dx = event.clientX - dragState.x;
  const dy = event.clientY - dragState.y;
  rotationY += dx * 0.75;
  rotationX = Math.max(-35, Math.min(35, rotationX - dy * 0.45));
  dragState.x = event.clientX; dragState.y = event.clientY;
  paintMonogram();
});
function stopDragging() { dragState = null; }
monogram.addEventListener("pointerup", stopDragging);
monogram.addEventListener("pointercancel", stopDragging);
monogram.addEventListener("lostpointercapture", stopDragging);
monogram.addEventListener("click", event => {
  // A tap/click provides a deliberate spin; a drag already changes orientation.
  if (event.detail === 0 || !reducedMotion) {
    rotationY += 28;
    rotationX = Math.max(-30, Math.min(30, rotationX - 5));
    paintMonogram();
    playUiSound("tap");
  }
});
const heroArt = $(".hero-art");
heroArt.addEventListener("pointermove", event => {
  if (dragState || event.pointerType !== "mouse" || reducedMotion) return;
  const rect = heroArt.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  monogram.style.translate = `${x * 9}px ${y * 9}px`;
});
heroArt.addEventListener("pointerleave", () => { monogram.style.translate = "0 0"; });

// Optional sound. OFF by default. Browser audio is created only after explicit user action.
let soundEnabled = false;
let audioContext = null;
const soundToggle = $("#soundToggle");
const soundLabel = $("#soundLabel");
function playUiSound(kind = "tap") {
  if (!soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext ||= new AudioCtx();
    if (audioContext.state === "suspended") audioContext.resume();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const now = audioContext.currentTime;
    oscillator.type = kind === "whoosh" ? "sine" : "triangle";
    oscillator.frequency.setValueAtTime(kind === "whoosh" ? 280 : 520, now);
    oscillator.frequency.exponentialRampToValueAtTime(kind === "whoosh" ? 120 : 360, now + 0.09);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.035, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(now); oscillator.stop(now + 0.14);
  } catch (error) {
    // Sound is optional; audio failure must never interrupt the site.
    console.info("Optional UI sound unavailable.", error);
  }
}
soundToggle.addEventListener("click", async () => {
  soundEnabled = !soundEnabled;
  soundToggle.setAttribute("aria-pressed", String(soundEnabled));
  soundLabel.textContent = soundEnabled ? "SOUND ON" : "SOUND OFF";
  if (soundEnabled) {
    playUiSound("tap");
    playUiSound("whoosh");
  } else if (audioContext && audioContext.state !== "closed") {
    // Leave the AudioContext available for the next explicit opt-in, but no sound is scheduled.
  }
});

// Project category filters
$$("[data-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    $$("[data-filter]").forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    $$(".project-card").forEach(card => {
      const categories = card.dataset.category.split(/\s+/);
      card.hidden = filter !== "all" && !categories.includes(filter);
    });
    playUiSound("tap");
  });
});

// Creative gallery filters
$$("[data-art-filter]").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.artFilter;
    $$("[data-art-filter]").forEach(item => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    $$(".art-card").forEach(card => {
      card.hidden = filter !== "all" && card.dataset.artCategory !== filter;
    });
    playUiSound("tap");
  });
});

// Accessible native dialogs for project and artwork details.
const detailDialog = $("#detailDialog");
$$(".project-details").forEach(button => button.addEventListener("click", () => {
  $("#dialogTitle").textContent = button.dataset.title;
  $("#dialogText").textContent = button.dataset.detail;
  if (typeof detailDialog.showModal === "function") detailDialog.showModal();
  else alert(`${button.dataset.title}\n\n${button.dataset.detail}`);
}));
$("#dialogClose").addEventListener("click", () => detailDialog.close());
$("#dialogDone").addEventListener("click", () => detailDialog.close());
detailDialog.addEventListener("click", event => {
  if (event.target === detailDialog) detailDialog.close();
});
const artDialog = $("#artDialog");
$$(".art-card").forEach(card => card.addEventListener("click", () => {
  $("#artDialogTitle").textContent = card.dataset.artTitle;
  $("#artDialogText").textContent = card.dataset.artDescription;
  if (typeof artDialog.showModal === "function") artDialog.showModal();
  else alert(`${card.dataset.artTitle}\n\n${card.dataset.artDescription}`);
}));
$("#artDialogClose").addEventListener("click", () => artDialog.close());
artDialog.addEventListener("click", event => {
  if (event.target === artDialog) artDialog.close();
});

// Apply social URLs from one central config object.
const socialAnchors = $$("#socialLinks a");
const socialKeys = ["linkedin", "github", "instagram"];
socialAnchors.forEach((anchor, index) => {
  const url = PORTFOLIO_CONFIG.social[socialKeys[index]];
  if (url) anchor.href = url;
});

// Firebase contact form. Dynamic import keeps the page usable before Firebase is configured.
const contactForm = $("#contactForm");
const formStatus = $("#formStatus");
const submitButton = $("#submitButton");
const firebaseConfigured = FIREBASE_CONFIG.apiKey !== "PASTE_YOUR_FIREBASE_API_KEY"
  && FIREBASE_CONFIG.projectId !== "PASTE_YOUR_PROJECT_ID"
  && FIREBASE_CONFIG.appId !== "PASTE_YOUR_APP_ID";

function showFormStatus(message, type = "") {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`.trim();
}
function validateForm(name, email, message) {
  if (name.length < 2) return "Please enter a name with at least 2 characters.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Please enter a valid email address.";
  if (message.length < 10) return "Please write a message with at least 10 characters.";
  return "";
}
contactForm.addEventListener("submit", async event => {
  event.preventDefault();
  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();
  const validationError = validateForm(name, email, message);
  if (validationError) {
    showFormStatus(validationError, "error");
    (name.length < 2 ? $("#name") : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? $("#email") : $("#message")).focus();
    return;
  }
  if (!firebaseConfigured) {
    showFormStatus("Firebase is not configured yet. Add your Firebase web config in script.js and deploy the Firestore rules before submitting.", "error");
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending…";
  showFormStatus("Submitting your message…");
  try {
    const { initializeApp, getApps, getApp } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js");
    const { getFirestore, collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js");
    const app = getApps().length ? getApp() : initializeApp(FIREBASE_CONFIG);
    const db = getFirestore(app);
    await addDoc(collection(db, "portfolioMessages"), {
      name, email, message,
      createdAt: serverTimestamp(),
      source: "portfolio"
    });
    contactForm.reset();
    showFormStatus("Message submitted successfully. Thank you for reaching out.", "success");
  } catch (error) {
    console.error("Contact form submission failed:", error);
    if (error && error.code === "permission-denied") {
      showFormStatus("Firebase denied this request. Check that Firestore is enabled and the provided security rules are deployed.", "error");
    } else {
      showFormStatus("The message could not be sent. Check your connection and Firebase setup, then try again.", "error");
    }
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = 'Send message <span aria-hidden="true">↗</span>';
  }
});

// Avoid accidental browser horizontal scrolling due to pointer interaction; no custom cursor needed.
