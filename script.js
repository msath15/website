function siteBase() {
  if (location.hostname.endsWith("github.io")) {
    const segment = location.pathname.split("/").filter(Boolean)[0];
    return segment ? `/${segment}/` : "/";
  }

  return "/";
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

async function initPhotography() {
  const gallery = document.getElementById("photo-gallery");
  const empty = document.getElementById("photo-gallery-empty");
  if (!gallery || !empty) return;

  const base = siteBase();
  const manifestUrl = `${base}assets/photography/manifest.json?v=61`;

  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error("manifest missing");
    const photos = await response.json();
    if (!Array.isArray(photos) || photos.length === 0) {
      empty.hidden = false;
      gallery.setAttribute("aria-busy", "false");
      return;
    }

    const fragment = document.createDocumentFragment();
    photos.forEach((photo) => {
      if (!photo?.file) return;
      const figure = document.createElement("figure");
      figure.className = "photo-card photo-postcard";

      const img = document.createElement("img");
      img.src = `${base}assets/photography/${encodeURIComponent(photo.file)}?v=61`;
      img.alt = photo.alt || photo.caption || "Photography by Sathvika Mallavarapu";
      img.loading = "lazy";
      img.decoding = "async";

      figure.appendChild(img);

      if (photo.caption) {
        const caption = document.createElement("figcaption");
        caption.className = "photo-caption";
        caption.innerHTML = `<span class="photo-pin" aria-hidden="true">📍</span> ${photo.caption}`;
        figure.appendChild(caption);
      }

      fragment.appendChild(figure);
    });

    gallery.appendChild(fragment);
    empty.hidden = true;
  } catch {
    empty.hidden = false;
  } finally {
    gallery.setAttribute("aria-busy", "false");
  }
}

function initReveal() {
  const sections = document.querySelectorAll(".section, .hero, .discovery");

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
    { threshold: 0.06, rootMargin: "0px 0px 10% 0px" }
  );

  const directions = ["reveal--from-left", "reveal--from-right", "reveal--from-up"];

  sections.forEach((section, index) => {
    section.classList.add("reveal", directions[index % directions.length]);
    observer.observe(section);
  });

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

async function initPostcards() {
  const gallery = document.getElementById("postcard-gallery");
  const placeholders = document.getElementById("postcard-placeholders");
  const empty = document.getElementById("postcard-gallery-empty");
  if (!gallery || !placeholders) return;

  function showEmptyMessage() {
    if (empty) empty.hidden = false;
  }

  function hideEmptyMessage() {
    if (empty) empty.hidden = true;
  }

  const base = siteBase();
  const manifestUrl = `${base}assets/postcards/manifest.json?v=61`;

  function showPlaceholders() {
    placeholders.hidden = false;
    placeholders.removeAttribute("hidden");
  }

  function hidePlaceholders() {
    placeholders.hidden = true;
    placeholders.setAttribute("hidden", "");
  }

  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error("manifest missing");
    const cards = await response.json();
    if (!Array.isArray(cards) || cards.length === 0) {
      showPlaceholders();
      showEmptyMessage();
      gallery.setAttribute("aria-busy", "false");
      return;
    }

    const fragment = document.createDocumentFragment();
    cards.forEach((card) => {
      if (!card?.file) return;
      const article = document.createElement("article");
      article.className = "postcard-flip";

      const front = document.createElement("div");
      front.className = "postcard-face postcard-face--front";

      const img = document.createElement("img");
      img.src = `${base}assets/postcards/${encodeURIComponent(card.file)}?v=61`;
      img.alt = card.alt || card.place || "Postcard";
      img.loading = "lazy";
      img.decoding = "async";
      front.appendChild(img);

      if (card.place) {
        const place = document.createElement("p");
        place.className = "postcard-place";
        place.textContent = card.place;
        front.appendChild(place);
      }

      const note = document.createElement("p");
      note.className = "postcard-note";
      note.textContent = card.note || "";

      article.appendChild(front);
      if (card.note) article.appendChild(note);
      fragment.appendChild(article);
    });

    gallery.appendChild(fragment);
    hidePlaceholders();
    hideEmptyMessage();
  } catch {
    showPlaceholders();
    showEmptyMessage();
  } finally {
    gallery.setAttribute("aria-busy", "false");
  }
}

initYear();
initPhotography();
initPostcards();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initReveal();
}
