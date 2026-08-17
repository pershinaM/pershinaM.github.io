// scroll reveal
const revealEls = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach((el) => io.observe(el));

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const wrapper = document.getElementById("smooth-wrapper");
const panels = document.querySelectorAll(".panel");
const scrollCue = document.querySelector(".scroll-cue");
const progressBar = document.getElementById("progressBar");

// split each panel title into words, each wrapped for a clip + slide-up
// reveal (see .panel__title .word in style.css)
panels.forEach((panel) => {
  const title = panel.querySelector(".panel__title");
  if (!title || title.dataset.split) return;
  const words = title.textContent.trim().split(/\s+/);
  title.innerHTML = words
    .map((w, i) => `<span class="word-wrap"><span class="word" style="--i:${i}">${w}</span></span>`)
    .join(" ");
  title.dataset.split = "true";
});

// scrubbed directly off each panel's own scroll position — the photo drifts
// one way, the big statement text drifts the other, for a layered depth
// that responds to every pixel of scroll rather than snapping at a threshold
const updateParallax = () => {
  const vw = window.innerWidth;
  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const progress = (rect.left + rect.width / 2 - vw / 2) / vw;
    const img = panel.querySelector(".panel__img");
    const statement = panel.querySelector(".panel__statement");
    if (img) img.style.transform = `translateX(${progress * -60}px) scale(${1 + Math.abs(progress) * 0.08})`;
    if (statement) statement.style.transform = `translateX(${progress * 90}px)`;
  });
};

const updateActivePanel = () => {
  const vw = window.innerWidth;
  let closest = null;
  let closestDist = Infinity;
  panels.forEach((panel) => {
    const rect = panel.getBoundingClientRect();
    const dist = Math.abs(rect.left + rect.width / 2 - vw / 2);
    if (dist < closestDist) {
      closestDist = dist;
      closest = panel;
    }
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel === closest && closestDist < vw * 0.4);
  });
  if (progressBar && closest && closestDist < vw * 0.4) {
    progressBar.style.setProperty("--progress-color", closest.style.getPropertyValue("--tint"));
  }
};

const updateScrollCue = (pos, max) => {
  if (!scrollCue) return;
  scrollCue.classList.toggle("is-hidden", pos > max - 200);
};

const updateProgressBar = (pos, max) => {
  if (!progressBar) return;
  progressBar.style.width = `${max > 0 ? (pos / max) * 100 : 0}%`;
};

if (wrapper && !reduceMotion) {
  // Vertical wheel input (and horizontal trackpad swipe) accumulates into a
  // target scrollLeft; each frame eases the real scrollLeft toward it for
  // the inertia feel, then syncs the parallax to the new positions.
  let target = wrapper.scrollLeft;
  let current = target;

  const maxScroll = () => wrapper.scrollWidth - wrapper.clientWidth;

  wrapper.addEventListener("wheel", (e) => {
    e.preventDefault();
    target = Math.max(0, Math.min(target + e.deltaY + e.deltaX, maxScroll()));
  }, { passive: false });

  window.addEventListener("resize", () => {
    target = Math.min(target, maxScroll());
  });

  const tick = () => {
    current += (target - current) * 0.085;
    if (Math.abs(target - current) < 0.05) current = target;
    wrapper.scrollLeft = current;
    updateParallax();
    updateActivePanel();
    updateScrollCue(current, maxScroll());
    updateProgressBar(current, maxScroll());
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
} else if (wrapper) {
  const onScroll = () => {
    updateParallax();
    updateActivePanel();
    updateScrollCue(wrapper.scrollLeft, wrapper.scrollWidth - wrapper.clientWidth);
    updateProgressBar(wrapper.scrollLeft, wrapper.scrollWidth - wrapper.clientWidth);
  };
  wrapper.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}
