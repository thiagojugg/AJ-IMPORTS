(()=>{
const PHONE="5598988482474";
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(n)||0);
let catalog=[],refreshTimer=null;
const normalize=value=>String(value||"").normalize("NFD").replace(/[\\u0300-\\u036f]/g,"").toUpperCase().trim();
function getCart(){try{return JSON.parse(localStorage.getItem("aj-cart")||"[]")}catch(e){return[]}}
function renderCart(){
 const cart=getCart(),count=$("count");
 if(count)count.textContent=cart.reduce((n,p)=>n+(+p.qty||0),0);
 const items=$("cartItems");
 if(items)items.innerHTML=cart.length?cart.map((p,i)=>'<div class="cartline">'+(p.image?'<img class="cart-thumb" src="'+p.image+'" alt="'+p.name+'">':'')+'<div class="cartline-info"><b>'+p.name+'</b><br>Variedade: '+(p.variant||"Única")+(p.size?' · Tamanho: '+p.size:'')+' · Qtd: '+p.qty+'<br>'+money((+p.price||0)*(+p.qty||0))+'</div><button data-del="'+i+'">REMOVER ×</button></div>').join(""):'<p class="empty">Sua sacola está vazia.</p>';
 const total=$("total");if(total)total.textContent=money(cart.reduce((n,p)=>n+(+p.price||0)*(+p.qty||0),0));
}
async function refreshCatalog(){
 try{const response=await fetch("data/products.json?updated="+Date.now(),{cache:"no-store"});if(!response.ok)throw new Error("catalog");const data=await response.json();catalog=Array.isArray(data)?data:[];renderResults();}
 catch(e){const results=$("headerSearchResults");if(results&&!catalog.length)results.innerHTML='<p class="search-empty">Não foi possível carregar os produtos agora.</p>';}
}
function renderResults(){
 const input=$("searchInput"),results=$("headerSearchResults");if(!input||!results)return;
 const q=normalize(input.value);
 if(!q){results.innerHTML='<p class="search-hint">Digite o nome, categoria ou característica de um produto.</p>';return;}
 const found=catalog.filter(p=>{
  const variantText=(p.variants||[]).map(v=>v.name+" "+(v.description||"")).join(" ");
  const searchable=[p.name,p.category,p.description,p.id,...(p.tags||[]),variantText].join(" ");
  return normalize(searchable).includes(q);
 });
 results.innerHTML=found.length?found.map(p=>'<a class="search-result" href="produto.html?id='+encodeURIComponent(p.id)+'">'+(p.image?'<img src="'+p.image+'" alt="">':'<span class="search-result-placeholder">AJ</span>')+'<span class="search-result-info"><strong>'+p.name+'</strong><small>'+(p.category||"AJ IMPORTS")+'</small></span><strong class="search-result-price">'+money(p.price)+'</strong><span class="search-result-arrow">↗</span></a>').join(""):'<p class="search-empty">Nenhum produto encontrado.</p>';
}
document.addEventListener("DOMContentLoaded",()=>{
 const search=$("search"),drawer=$("drawer"),shade=$("shade"),input=$("searchInput");
 const openSearch=()=>{search?.classList.add("open");refreshCatalog();input?.focus({preventScroll:true});if(refreshTimer)clearInterval(refreshTimer);refreshTimer=setInterval(()=>{if(search?.classList.contains("open"))refreshCatalog();else{clearInterval(refreshTimer);refreshTimer=null}},30000);};
 const closeSearch=()=>{search?.classList.remove("open");if(refreshTimer){clearInterval(refreshTimer);refreshTimer=null;}};
 const closeBag=()=>{drawer?.classList.remove("open");shade?.classList.remove("open")};
 $("searchBtn")?.addEventListener("click",openSearch);
 $("closeSearch")?.addEventListener("click",closeSearch);
 input?.addEventListener("input",renderResults);
 $("bagBtn")?.addEventListener("click",()=>{renderCart();drawer?.classList.add("open");shade?.classList.add("open")});
 $("closeBag")?.addEventListener("click",closeBag);shade?.addEventListener("click",closeBag);
 $("cartItems")?.addEventListener("click",e=>{const b=e.target.closest("[data-del]");if(!b)return;const cart=getCart();cart.splice(+b.dataset.del,1);localStorage.setItem("aj-cart",JSON.stringify(cart));renderCart()});
 $("checkout")?.addEventListener("click",()=>{
  const cart=getCart();if(!cart.length)return;
  const msg="Olá! Quero finalizar meu pedido na AJ IMPORTS:\\n\\n"+cart.map(p=>p.name+" | "+(p.variant||"Única")+" | "+(p.size||"Sem tamanho")+" | Qtd "+p.qty+" | "+money(p.price*p.qty)+(p.image?"\\nFoto do produto: "+new URL(p.image,location.href).href:"")).join("\\n\\n")+"\\n\\nTOTAL: "+money(cart.reduce((n,p)=>n+p.price*p.qty,0));
  window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(msg),"_blank");
 });
 input?.addEventListener("keydown",e=>{if(e.key==="Escape")closeSearch()});
 const applyCoupon=$("applyCoupon"),couponCode=$("couponCode"),couponMessage=$("couponMessage");
 applyCoupon?.addEventListener("click",()=>{if(couponMessage)couponMessage.textContent="Nenhum cupom ativo no momento. Tente novamente mais tarde."});
 couponCode?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();applyCoupon?.click()}});
 renderCart();refreshCatalog();
});
})();