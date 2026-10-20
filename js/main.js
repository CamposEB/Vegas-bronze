(() => {
  const NUM = "5521972507824";
  const NOTE = " A disponibilidade depende de confirmação.";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // WhatsApp: mensagem codificada, nova aba e confirmação de disponibilidade
  $$("[data-wa]").forEach((a) => {
    a.href = `https://wa.me/${NUM}?text=${encodeURIComponent(a.dataset.wa + NOTE)}`;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  });

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Menu mobile: aria-expanded e nome acessível refletem o estado real
  const burger = $(".burger"), nav = $("#nav");
  if (burger && nav) {
    const set = (open) => {
      nav.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", String(open));
      burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    };
    burger.addEventListener("click", () => set(!nav.classList.contains("open")));
    nav.addEventListener("click", (e) => e.target.closest("a") && set(false));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && nav.classList.contains("open")) { set(false); burger.focus(); }
    });
  }

  // Entrada suave ao rolar (sem JS ou com movimento reduzido, tudo fica visível)
  const items = $$(".card,.box,.moon,.grid4 li,.gallery button,.sec h2");
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion:reduce)").matches) {
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { threshold: 0.1 });
    items.forEach((el) => { el.classList.add("rv"); io.observe(el); });
  }

  // Mapa: carrega só quando estiver perto da tela
  const map = $("iframe[data-src]");
  if (map) {
    const load = () => { map.src = map.dataset.src; };
    if ("IntersectionObserver" in window) {
      const mo = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { load(); mo.disconnect(); }
      }, { rootMargin: "300px" });
      mo.observe(map);
    } else load();
  }

  // Galeria ampliada: mostra a imagem real, ou o espaço reservado enquanto não há foto
  const lb = $("#lb"), body = $("#lb-body");
  if (lb && body) {
    $$(".gallery button").forEach((b) => b.addEventListener("click", () => {
      const im = $("img", b);
      if (im) {
        const big = new Image();
        big.src = im.currentSrc || im.src;
        big.alt = im.alt;
        body.replaceChildren(big);
      } else {
        body.replaceChildren(...[...b.childNodes].map((n) => n.cloneNode(true)));
      }
      lb.showModal();
    }));
    const x = $(".x", lb);
    if (x) x.addEventListener("click", () => lb.close());
    lb.addEventListener("click", (e) => e.target === lb && lb.close());
  }
})();