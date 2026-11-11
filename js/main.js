document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
  Custom Cursor
  ----------------------------- */

  const cursor = document.getElementById("cursor-follower");
  if (cursor && window.matchMedia("(pointer: fine)").matches && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    cursor.style.display = "block";
    document.addEventListener("mousemove", e => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    });
    document.addEventListener("mouseover", e => {
      if (e.target.closest("a,button")) {
        cursor.classList.add("cursor-hover");
      }
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest("a,button")) {
        cursor.classList.remove("cursor-hover");
      }
    });
  }

  /* -----------------------------
  Scroll Animation
  ----------------------------- */

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reducedMotion && "IntersectionObserver" in window) {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      }, { rootMargin: "0px 0px -80px 0px", threshold: 0 });

      document.querySelectorAll("section").forEach(section => {
        // Only enhance offscreen content; the default HTML stays visible.
        if (section.getBoundingClientRect().top >= window.innerHeight) {
          observer.observe(section);
          section.classList.add("reveal-pending");
        }
      });
    } catch {
      document.querySelectorAll(".reveal-pending").forEach(section => {
        section.classList.remove("reveal-pending");
      });
    }
  }
});
