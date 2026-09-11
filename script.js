document.addEventListener("DOMContentLoaded", () => {
  const bookElement = document.getElementById("book");

  const pageFlip = new St.PageFlip(bookElement, {
    width: 420,           // single page width
    height: 620,          // single page height
    size: "stretch",      // auto-fit to screen
    minWidth: 300,
    maxWidth: 520,
    minHeight: 440,
    maxHeight: 780,
    showCover: true,      // cover opens like a real book
    mobileScrollSupport: true,
    maxShadowOpacity: 0.5,
    drawShadow: true,
    flippingTime: 900,
    usePortrait: true,    // single page on mobile
    startZIndex: 0,
    autoSize: true,
    clickEventForward: true,
    useMouseEvents: true,
    swipeDistance: 30,
    showPageCorners: true,
    disableFlipByClick: false,
  });

  pageFlip.loadFromHTML(document.querySelectorAll(".page"));

  // ==== Keyboard navigation ====
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") pageFlip.flipPrev();
    if (e.key === "ArrowRight") pageFlip.flipNext();
    if (e.key === "Escape") pageFlip.turnToPage(0);
  });

  // ==== Optional: log page turns for debugging ====
  pageFlip.on("flip", (e) => {
    // console.log("Flipped to page:", e.data);
  });
});
