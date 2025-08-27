const videos = [
  {
    title: "Instagram Reel – Cafe Promo",
    category: "Short-form Videos",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumb:
      "https://th.bing.com/th/id/OIP.FqTxKZCq-NjAkxRoZB3nTAHaE8?w=243&h=180&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
  },
  {
    title: "Tech Product Unboxing",
    category: "Long-form Videos",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumb:
      "https://static.vecteezy.com/system/resources/thumbnails/034/839/667/original/content-creator-holding-chroma-key-product-being-sponsored-by-tech-brand-to-film-unboxing-review-bipoc-influencer-showing-mockup-screen-phone-recommendation-to-viewers-video.jpg",
  },
  {
    title: "Mobile Gaming Montage",
    category: "Gaming Videos",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumb: "https://i.ytimg.com/vi/rXM4m_vqWf0/maxresdefault.jpg",
  },
  {
    title: "Epic Football Highlights",
    category: "Football Edits",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumb:
      "https://footballhighlights.top/wp-content/uploads/2024/12/bannerfootballhighlights.jpg",
  },
  {
    title: "Summer Dress Ad – eCommerce",
    category: "eCommerce Ads",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumb:
      "https://img.freepik.com/psd-premium/modelo-de-banner-para-venda-de-moda-online_23-2148585403.jpg?w=2000",
  },
  {
    title: "City Life Documentary",
    category: "Documentary Style",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumb:
      "https://tse2.mm.bing.net/th/id/OIP._kh-M_JvNLdyeyC4wVYgxAHaHa?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    title: "Colorful Nature Clip",
    category: "Color Grading",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumb:
      "https://png.pngtree.com/thumb_back/fw800/background/20230612/pngtree-colorful-spring-nature-amazing-sunset-image_3099554.jpg",
  },
  {
    title: "Anime OP/ED Highlights",
    category: "Anime Videos",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumb:
      "https://www.anime-planet.com/images/lists/memeworthy-anime-oped-dance-sequences-671767.jpg",
  },
  {
    title: "Product Launch – Animated Ad",
    category: "Ads",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumb:
      "https://th.bing.com/th/id/OIP.4AT8eb0BhJm4b_4kqzlIZwHaD8?w=342&h=182&c=7&r=0&o=7&dpr=1.5&pid=1.7&rm=3",
  },
];

// Create unique categories for filter buttons
const categories = [...new Set(videos.map((v) => v.category))];
const filtersEl = document.getElementById("filters");
let currentFilter = "All";
filtersEl.innerHTML =
  `<button class="filter-btn active">All</button>` +
  categories
    .map((cat) => `<button class="filter-btn">${cat}</button>`)
    .join("");

// Filter selection logic
filtersEl.addEventListener("click", function (e) {
  if (!e.target.classList.contains("filter-btn")) return;
  [...filtersEl.children].forEach((btn) => btn.classList.remove("active"));
  e.target.classList.add("active");
  currentFilter = e.target.textContent;
  renderPortfolio();
});

// Render portfolio items
function renderPortfolio() {
  const portfolioEl = document.getElementById("portfolio");
  let filtered =
    currentFilter === "All"
      ? videos
      : videos.filter((v) => v.category === currentFilter);
  if (filtered.length === 0) {
    portfolioEl.innerHTML = `<div style="text-align:center;color:#f857a6;font-size:1.2em;padding:28px;">No videos found in '${currentFilter}' category.</div>`;
    return;
  }
  portfolioEl.innerHTML = filtered
    .map(
      (v, i) => `
        <div class="portfolio-item" data-index="${videos.indexOf(
          v
        )}" tabindex="0" title="Preview video">
          <img src="${v.thumb}" alt="Preview" class="portfolio-thumb">
          <div class="portfolio-title">${v.title}</div>
          <div class="portfolio-category">${v.category}</div>
        </div>
      `
    )
    .join("");
}
renderPortfolio();

// Lightbox logic with fade & keyboard controls
const portfolioEl = document.getElementById("portfolio");
const lightbox = document.getElementById("lightbox");
const lightboxVideo = document.getElementById("lightboxVideo");
const lightboxClose = document.getElementById("lightboxClose");

portfolioEl.addEventListener("click", function (e) {
  let item = e.target.closest(".portfolio-item");
  if (!item) return;
  let idx = item.dataset.index;
  let video = videos[idx];
  lightboxVideo.src = video.src;
  lightbox.classList.add("active");
  lightboxVideo.play();
});
portfolioEl.addEventListener("keyup", function (e) {
  if (e.key === "Enter" && e.target.classList.contains("portfolio-item")) {
    let idx = e.target.dataset.index;
    let video = videos[idx];
    lightboxVideo.src = video.src;
    lightbox.classList.add("active");
    lightboxVideo.play();
  }
});

lightboxClose.onclick = function () {
  lightbox.classList.remove("active");
  lightboxVideo.pause();
  lightboxVideo.src = "";
};
// Hide lightbox if background clicked
lightbox.onclick = function (e) {
  if (e.target === lightbox) {
    lightboxClose.onclick();
  }
};
// Keyboard close (Esc)
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && lightbox.classList.contains("active")) {
    lightboxClose.onclick();
  }
});
