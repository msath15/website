function siteBase() {
  if (location.hostname.endsWith("github.io")) {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return segment ? `/${segment}/` : "/";
  }

  return "/";
}

function initProfilePhoto() {
  const photo = document.getElementById("profile-photo");
  if (!photo) return;

  photo.src = `${siteBase()}assets/profile.jpg?v=14`;
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initReveal() {
  const sections = document.querySelectorAll(".section, .hero");

  const showSection = (section) => section.classList.add("is-visible");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          showSection(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px 80px 0px" }
  );

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });

  // Sections at the bottom (like contact) can miss the observer — show if already on screen
  requestAnimationFrame(() => {
    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        showSection(section);
      }
    });
  });

  if (location.hash) {
    const target = document.querySelector(location.hash);
    if (target) showSection(target);
  }
}

initProfilePhoto();
initYear();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initReveal();
}
