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

  photo.src = `${siteBase()}assets/profile.jpg?v=3`;
}

function updateClock() {
  const el = document.getElementById("local-time");
  if (!el) return;

  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/New_York",
  });

  el.textContent = formatter.format(new Date());
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
updateClock();
setInterval(updateClock, 30_000);
initYear();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initReveal();
}
