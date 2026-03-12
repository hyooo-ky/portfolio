document.addEventListener("DOMContentLoaded", () => {

  /* -----------------------------
  Works Data
  ----------------------------- */

  const works = [
    {
        title:"SHIGATSUSHA",
        category:"RECRUIT SITE / WordPress",
        url:"https://www.shigatsusya.jp/",
        img:"img/work-01.jpg"
    },
    {title:"SMBC CONSUMER FINANCE",category:"WEB DESIGN / RECRUIT SITE",url:"https://www.smbc-cf-recruit.jp/",img:"img/dummy.jpg"},
    {title:"KINTETSU MIYAKO HOTELS",category:"WEB DESIGN / RECRUIT SITE",url:"https://www.miyakohotels-recruiting.com/newgraduate.html",img:"img/dummy.jpg"},
    {title:"ACCESS PROGRESS",category:"WEB DESIGN / CORPORATE SITE",url:"https://www.access-t.co.jp/pg/",img:"img/dummy.jpg"},
    {title:"SUNTORY LOGISTICS",category:"WEB DESIGN / RECRUIT SITE",url:"https://www.suntorylogistics.co.jp/recruit/",img:"img/dummy.jpg"},
    {title:"KINEEL",category:"WEB DESIGN / ONLINE SHOP",url:"https://www.kineel.jp/f/shop/",img:"img/dummy.jpg"},
    {title:"SOWAKA",category:"WEB DESIGN / OFFICIAL SITE",url:"https://sowaka.com/",img:"img/dummy.jpg"},
    {title:"YUIKUEN",category:"WEB DESIGN / OFFICIAL SITE",url:"https://yuikuen.com/",img:"img/dummy.jpg"}
  ];

  const grid = document.getElementById("worksGrid");

  if (grid) {
    const fragment = document.createDocumentFragment();

    works.forEach(work => {

      const article = document.createElement("article");
      article.className = "work-item";

      article.innerHTML = `
        <a href="${work.url}" target="_blank" rel="noopener noreferrer" class="work-link">
          <div class="work-image-container">
            <div class="work-image-placeholder">
              <img src="${work.img}" alt="${work.title}" loading="lazy">
            </div>
            <div class="work-overlay">
              <span class="view-more">View</span>
            </div>
          </div>
          <div class="work-info">
            <p class="work-category">${work.category}</p>
            <h3 class="work-title">${work.title}</h3>
          </div>
        </a>
      `;

      fragment.appendChild(article);
    });

    grid.appendChild(fragment);
  }

  /* -----------------------------
  Custom Cursor
  ----------------------------- */

  const cursor = document.getElementById("cursor-follower");

  if (cursor && window.matchMedia("(pointer: fine)").matches) {

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

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      observer.unobserve(entry.target);
    }
  });
}, {
  rootMargin: "0px 0px -200px 0px",
  threshold: 0
});

document.querySelectorAll("section").forEach(section => {
  observer.observe(section);
});

});