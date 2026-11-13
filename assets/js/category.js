document.addEventListener("DOMContentLoaded",async()=>{
  const category=new URLSearchParams(location.search).get("categoria")||"";
  const norm=s=>(s||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toUpperCase();
  document.title=category+" — AJ IMPORTS";
  document.getElementById("title").textContent=category;

  let products=[];
  try{
    products=await(await fetch("data/products.json")).json();
  }catch(e){}

  products=products
    .filter(p=>{
      const isShirtCategory=norm(category).includes("CAMISETA");
      const isBermuda=p.id==="bermudas-jeans-ff2" || norm(p.category).includes("BERMUDA");
      return norm(p.category)===norm(category) && !(isShirtCategory && isBermuda);
    })
    .sort((a,b)=>new Date(b.createdAt||0)-new Date(a.createdAt||0));

  const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(n)||0);
  const card=p=>{
    const variants=Array.isArray(p.variants)?p.variants:[];
    const variantCount=variants.length||1;
    return '<a class="card" href="produto.html?id='+encodeURIComponent(p.id)+'" aria-label="Ver '+p.name+'">'+
      '<div class="card-media">'+
        (p.image?'<img src="'+p.image+'" alt="'+p.name+'" loading="lazy">':'<div class="placeholder">AJ IMPORTS</div>')+
        '<span class="card-category">'+(p.category||"AJ IMPORTS")+'</span>'+
        '<span class="card-arrow" aria-hidden="true">↗</span>'+
      '</div>'+
      '<div class="card-info">'+
        '<div class="card-heading">'+
          '<h3>'+p.name+'</h3>'+
          '<span class="card-variants">'+variantCount+(variantCount===1?" VARIEDADE":" VARIEDADES")+'</span>'+
        '</div>'+
        '<div class="card-bottom">'+
          '<div><small>PREÇO</small><strong class="price">'+money(p.price)+'</strong></div>'+
          '<span class="card-link">VER PRODUTO <b>↗</b></span>'+
        '</div>'+
      '</div>'+
    '</a>';
  };

  document.getElementById("items").innerHTML=products.length
    ?products.map(card).join("")
    :'<p class="empty">Ainda não há produtos nesta categoria.</p>';
});