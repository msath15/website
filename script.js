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

  photo.src = `${siteBase()}assets/profile.jpg?v=27`;
}

function initYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
}

function initBlockGame() {
  const game = document.getElementById("block-game");
  const reveal = document.getElementById("block-reveal");
  if (!game || !reveal) return;

  const showFact = (text, activeEl) => {
    game.querySelectorAll(".q-block.is-hit").forEach((el) => {
      if (el !== activeEl) el.classList.remove("is-hit");
    });

    if (activeEl) activeEl.classList.add("is-hit");
    reveal.hidden = false;
    reveal.textContent = text;
  };

  game.querySelectorAll(".q-block[data-fact]").forEach((block) => {
    block.addEventListener("click", () => {
      showFact(block.dataset.fact || "", block);
    });
  });

  const coin = game.querySelector(".q-block--coin");
  if (coin) {
    coin.addEventListener("click", (event) => {
    showFact("Coin get! Email: sathvika@bluearcus.com", coin);
      // Let mailto open; brief visual feedback only
      if (event.metaKey || event.ctrlKey) return;
    });
  }
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
initBlockGame();

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  initReveal();
}
