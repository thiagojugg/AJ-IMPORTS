document.addEventListener("DOMContentLoaded", async () => {
  const category = new URLSearchParams(location.search).get("categoria") || "";
  const norm = value => String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/\s+/g, " ")
    .toUpperCase();

  const currentCategory = norm(category);
  document.title = (category || "Categoria") + " — AJ IMPORTS";
  document.getElementById("title").textContent = category;

  let products = [];
  try {
    const response = await fetch("data/products.json?v=3", { cache: "no-store" });
    if (!response.ok) throw new Error("Não foi possível carregar os produtos");
    products = await response.json();
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }

  // A categoria cadastrada no produto é a única fonte de classificação.
  // Não misturar camisetas, bermudas ou linhas fitness por palavras do nome.
  products = products
    .filter(product => norm(product.category) === currentCategory)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const money = value => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);

  const card = product => {
    const variants = Array.isArray(product.variants) ? product.variants : [];
    const count = variants.length || 1;
    return '<a class="card" href="produto.html?id=' + encodeURIComponent(product.id) + '" aria-label="Ver ' + product.name + '">' +
      '<div class="card-media">' +
        (product.image ? '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy">' : '<div class="placeholder">AJ IMPORTS</div>') +
        '<span class="card-category">' + (product.category || "AJ IMPORTS") + '</span>' +
        '<span class="card-arrow" aria-hidden="true">↗</span>' +
      '</div>' +
      '<div class="card-info">' +
        '<div class="card-heading">' +
          '<h3>' + product.name + '</h3>' +
          '<span class="card-variants">' + count + (count === 1 ? " VARIEDADE" : " VARIEDADES") + '</span>' +
        '</div>' +
        '<div class="card-bottom">' +
          '<div><small>PREÇO</small><strong class="price">' + money(product.price) + '</strong></div>' +
          '<span class="card-link">VER PRODUTO <b>↗</b></span>' +
        '</div>' +
      '</div>' +
    '</a>';
  };

  document.getElementById("items").innerHTML = products.length
    ? products.map(card).join("")
    : '<p class="empty">Ainda não há produtos nesta categoria.</p>';
});