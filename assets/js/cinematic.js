/* AJ IMPORTS — movimento cinematográfico global, leve e responsivo */
(() => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("aj-cinematic");
  if (reduce) return;

  const revealSelector = [
    "main > section",
    ".detail-visual",
    ".detail-content",
    ".site-footer",
    ".products .card",
    ".categories .cat",
    ".statement"
  ].join(",");

  const reveal = element => {
    if (!(element instanceof Element) || element.dataset.cinematicSeen) return;
    element.dataset.cinematicSeen = "1";
    element.classList.add("cinematic-reveal");
    if (!("IntersectionObserver" in window)) {
      element.classList.add("cinematic-visible");
      return;
    }
    observer.observe(element);
  };

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("cinematic-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -45px 0px" })
    : null;

  const scan = root => {
    if (root.matches && root.matches(revealSelector)) reveal(root);
    root.querySelectorAll?.(revealSelector).forEach(reveal);
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("cinematic-enter");
    scan(document);
    const main = document.querySelector("main");
    if (main && "MutationObserver" in window) {
      const mutations = new MutationObserver(records => {
        records.forEach(record => record.addedNodes.forEach(node => {
          if (node.nodeType === 1) scan(node);
        }));
      });
      mutations.observe(main, { childList: true, subtree: true });
    }
    window.setTimeout(() => document.body.classList.add("cinematic-settled"), 900);
  });
})();
