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
const panelImgs = document.querySelectorAll(".panel__img");
const scrollCue = document.querySelector(".scroll-cue");

const updateParallax = () => {
  const vw = window.innerWidth;
  panelImgs.forEach((img) => {
    const rect = img.parentElement.parentElement.getBoundingClientRect();
    const progress = (rect.left + rect.width / 2 - vw / 2) / vw;
    img.style.transform = `translateX(${progress * -40}px)`;
  });
};

const updateScrollCue = (pos, max) => {
  if (!scrollCue) return;
  scrollCue.classList.toggle("is-hidden", pos > max - 200);
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
    updateScrollCue(current, maxScroll());
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
} else if (wrapper) {
  wrapper.addEventListener("scroll", () => {
    updateParallax();
    updateScrollCue(wrapper.scrollLeft, wrapper.scrollWidth - wrapper.clientWidth);
  }, { passive: true });
  updateParallax();
}
