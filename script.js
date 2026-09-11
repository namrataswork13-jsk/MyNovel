document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.getElementById("book");

  const pageFlip = new St.PageFlip(bookElement, {
    width: 420,
    height: 620,
    size: "stretch",
    minWidth: 300,
    maxWidth: 540,
    minHeight: 440,
    maxHeight: 800,
    showCover: true,
    mobileScrollSupport: false,   // we control scroll on mobile via buttons
    maxShadowOpacity: 0.55,
    drawShadow: true,
    flippingTime: 900,
    usePortrait: true,
    startZIndex: 0,
    autoSize: true,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  });

  pageFlip.loadFromHTML(document.querySelectorAll(".page"));

  // ====== Add page numbers to all non-cover / non-blank pages ======
  const pages = document.querySelectorAll(".page");
  let num = 1;
  pages.forEach((page, index) => {
    const isCover = index === 0 || index === pages.length - 1;
    const isBlank = page.querySelector(".page-content.blank");
    if (isCover || isBlank) return;

    const numberEl = document.createElement("div");
    numberEl.className = "page-number";
    numberEl.textContent = num;
    page.querySelector(".page-content").appendChild(numberEl);
    num++;
  });

  // ====== Nav buttons ======
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function updateButtons() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();
    prevBtn.disabled = current <= 0;
    nextBtn.disabled = current >= total - 1;
  }

  prevBtn.addEventListener("click", () => {
    pageFlip.flipPrev();
    setTimeout(updateButtons, 950);
  });
  nextBtn.addEventListener("click", () => {
    pageFlip.flipNext();
    setTimeout(updateButtons, 950);
  });

  pageFlip.on("flip", () => updateButtons());
  pageFlip.on("changeState", () => updateButtons());
  updateButtons();

  // ====== Keyboard navigation ======
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { pageFlip.flipPrev(); setTimeout(updateButtons, 950); }
    if (e.key === "ArrowRight") { pageFlip.flipNext(); setTimeout(updateButtons, 950); }
  });

  // ====== On mobile portrait, hide side-by-side spine shading ======
  function handlePortrait() {
    const isPortrait = window.innerWidth < 700;
    document.body.classList.toggle("portrait-mode", isPortrait);
  }
  window.addEventListener("resize", handlePortrait);
  handlePortrait();
});
