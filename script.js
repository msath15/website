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

  photo.src = `${siteBase()}assets/profile.jpg?v=9`;
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initReveal() {
  const sections = document.querySelectorAll(".section, .hero");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  sections.forEach((section) => {
    section.classList.add("reveal");
    observer.observe(section);
  });
}

initProfilePhoto();
initYear();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initReveal();
}
