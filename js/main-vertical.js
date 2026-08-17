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
const content = document.getElementById("smooth-content");
const parallaxImgs = document.querySelectorAll(".panel__img, .hero__grid img");

if (wrapper && content && !reduceMotion) {
  document.documentElement.classList.add("smooth-active");

  let current = window.scrollY;

  const setBodyHeight = () => {
    document.body.style.height = `${content.getBoundingClientRect().height}px`;
  };
  setBodyHeight();
  window.addEventListener("resize", setBodyHeight);
  content.querySelectorAll("img").forEach((img) => {
    if (!img.complete) img.addEventListener("load", setBodyHeight, { once: true });
  });

  const tick = () => {
    const target = window.scrollY;
    current += (target - current) * 0.085;
    if (Math.abs(target - current) < 0.05) current = target;
    content.style.transform = `translateY(${-current}px)`;

    const vh = window.innerHeight;
    parallaxImgs.forEach((img) => {
      const rect = img.parentElement.parentElement.getBoundingClientRect();
      const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
      img.style.transform = `translateY(${progress * -40}px)`;
    });

    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
