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

// cursor-following thumbnail preview on work rows
const thumb = document.getElementById("cursorThumb");
const thumbImg = document.getElementById("cursorThumbImg");
const rows = document.querySelectorAll(".work-row");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (thumb && !reduceMotion) {
  rows.forEach((row) => {
    row.addEventListener("mouseenter", () => {
      thumbImg.src = row.dataset.img;
      thumb.classList.add("is-active");
    });
    row.addEventListener("mousemove", (e) => {
      thumb.style.left = `${e.clientX}px`;
      thumb.style.top = `${e.clientY}px`;
    });
    row.addEventListener("mouseleave", () => {
      thumb.classList.remove("is-active");
    });
  });

  window.addEventListener("scroll", () => thumb.classList.remove("is-active"), { passive: true });
}
