document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.getElementById("book");
  const wrapper = document.querySelector(".book-wrapper");

  // -------- Compute page size from the wrapper --------
  // We want 2 pages side by side. So the wrapper must fit:
  //   (2 * pageWidth) + a small gap
  // We pick a base ratio: 0.68 (portrait), then clamp.
function computeSize() {
  const wrapperWidth  = wrapper.clientWidth - 20;
  const wrapperHeight = window.innerHeight - 150;

  // Broader ratio = wider pages, less tall (real open-book feel)
  const ratio = 1.28;

  // Two-page spread: each page = half the available width
  let pageWidth  = Math.floor(wrapperWidth / 2);
  let pageHeight = Math.floor(pageWidth * ratio);

  // If too tall for screen, scale down by height
  if (pageHeight > wrapperHeight) {
    pageHeight = wrapperHeight;
    pageWidth  = Math.floor(pageHeight / ratio);
  }

  // Allow bigger pages on desktop
  pageWidth  = Math.max(320, Math.min(pageWidth,  720));
  pageHeight = Math.max(420, Math.min(pageHeight, 920));

  return { pageWidth, pageHeight };
}
  const size = computeSize();

  const pageFlip = new St.PageFlip(bookElement, {
    width: size.pageWidth,
    height: size.pageHeight,
    size: "fixed",            // ← KEY: use fixed size, we control it
    minWidth: 320,
    maxWidth: 720,
    minHeight: 420,
    maxHeight: 920,
    showCover: true,
    mobileScrollSupport: false,
    maxShadowOpacity: 0.55,
    drawShadow: true,
    flippingTime: 900,
    usePortrait: false,       // ← KEY: NEVER drop to single-page
    startZIndex: 0,
    autoSize: false,          // ← we handle resize ourselves
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  });

  pageFlip.loadFromHTML(document.querySelectorAll(".page"));

  // -------- Add page numbers --------
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

  // -------- Navigation buttons --------
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  function updateButtons() {
    const current = pageFlip.getCurrentPageIndex();
    const total = pageFlip.getPageCount();
    if (prevBtn) prevBtn.disabled = current <= 0;
    if (nextBtn) nextBtn.disabled = current >= total - 1;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => {
    pageFlip.flipPrev();
    setTimeout(updateButtons, 950);
  });
  if (nextBtn) nextBtn.addEventListener("click", () => {
    pageFlip.flipNext();
    setTimeout(updateButtons, 950);
  });

  pageFlip.on("flip", updateButtons);
  pageFlip.on("changeState", updateButtons);
  updateButtons();

  // -------- Keyboard nav --------
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { pageFlip.flipPrev(); setTimeout(updateButtons, 950); }
    if (e.key === "ArrowRight") { pageFlip.flipNext(); setTimeout(updateButtons, 950); }
  });

  // -------- On resize, recompute and re-draw --------
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const newSize = computeSize();
      // Destroy and recreate to re-apply the new fixed size
      // (the library doesn't have a clean updateSize on older builds)
      const state = pageFlip.getCurrentPageIndex();
      pageFlip.destroy();
      // Rebuild
      const flip = new St.PageFlip(bookElement, {
        width: newSize.pageWidth,
        height: newSize.pageHeight,
        size: "fixed",
        minWidth: 260, maxWidth: 480,
        minHeight: 380, maxHeight: 720,
        showCover: true,
        mobileScrollSupport: false,
        maxShadowOpacity: 0.55,
        drawShadow: true,
        flippingTime: 900,
        usePortrait: false,
        startZIndex: 0,
        autoSize: false,
        clickEventForward: true,
        useMouseEvents: true,
        swipeDistance: 30,
        showPageCorners: true,
        disableFlipByClick: false,
      });
      flip.loadFromHTML(document.querySelectorAll(".page"));
      flip.turnToPage(state);
      flip.on("flip", updateButtons);
      // Re-bind buttons
      if (prevBtn) {
        prevBtn.onclick = () => { flip.flipPrev(); setTimeout(updateButtons, 950); };
      }
      if (nextBtn) {
        nextBtn.onclick = () => { flip.flipNext(); setTimeout(updateButtons, 950); };
      }
      window.__pageFlip = flip;
    }, 250);
  });
});
