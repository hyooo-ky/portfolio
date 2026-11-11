document.addEventListener("DOMContentLoaded", () => {
  const preview = document.getElementById("workPreview");
  if (preview && typeof preview.showModal === "function") {
    const image = preview.querySelector(".work-preview-image");
    const scroll = preview.querySelector(".work-preview-scroll");
    let opener;
    document.addEventListener("click", event => {
      const link = event.target.closest("a[data-preview-image]");
      if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      image.src = link.dataset.previewImage;
      image.alt = `${link.dataset.previewTitle} 旧サイトの全体画像`;
      preview.setAttribute("aria-label", `${link.dataset.previewTitle}の画像プレビュー`);
      opener = link;
      preview.showModal();
      event.preventDefault();
      scroll.scrollTop = 0;
      document.documentElement.classList.add("preview-open");
    });
    preview.querySelector(".work-preview-close").addEventListener("click", () => preview.close());
    preview.addEventListener("click", event => {
      if (event.target !== preview) return;
      const rect = preview.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) preview.close();
    });
    preview.addEventListener("close", () => {
      document.documentElement.classList.remove("preview-open");
      image.removeAttribute("src");
      opener?.focus({ preventScroll: true });
    });
  }


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
