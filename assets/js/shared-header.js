(()=>{
const PHONE="5598988482474";
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(Number(n)||0);
let catalog=[];
function getCart(){try{return JSON.parse(localStorage.getItem("aj-cart")||"[]")}catch(e){return[]}}
function saveCart(cart){localStorage.setItem("aj-cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 const cart=getCart(), count=$("count");
 if(count)count.textContent=cart.reduce((n,p)=>n+(+p.qty||0),0);
 const items=$("cartItems");
 if(items)items.innerHTML=cart.length?cart.map((p,i)=>'<div class="cartline">'+(p.image?'<img class="cart-thumb" src="'+p.image+'" alt="'+p.name+'">' : '')+'<div class="cartline-info"><b>'+p.name+'</b><br>Variedade: '+(p.variant||"Única")+(p.size?' · Tamanho: '+p.size:'')+' · Qtd: '+p.qty+'<br>'+money((+p.price||0)*(+p.qty||0))+'</div><button data-del="'+i+'">REMOVER ×</button></div>').join(""):'<p class="empty">Sua sacola está vazia.</p>';
 const total=$("total");if(total)total.textContent=money(cart.reduce((n,p)=>n+(+p.price||0)*(+p.qty||0),0));
}
document.addEventListener("DOMContentLoaded",async()=>{
 const search=$("search"),drawer=$("drawer"),shade=$("shade");
 const openSearch=()=>{search?.classList.add("open");$("searchInput")?.focus()};
 const closeBag=()=>{drawer?.classList.remove("open");shade?.classList.remove("open")};
 $("searchBtn")?.addEventListener("click",openSearch);
 $("closeSearch")?.addEventListener("click",()=>search?.classList.remove("open"));
 $("bagBtn")?.addEventListener("click",()=>{renderCart();drawer?.classList.add("open");shade?.classList.add("open")});
 $("closeBag")?.addEventListener("click",closeBag);shade?.addEventListener("click",closeBag);
 $("cartItems")?.addEventListener("click",e=>{const b=e.target.closest("[data-del]");if(!b)return;const c=getCart();c.splice(+b.dataset.del,1);saveCart(c)});
 $("checkout")?.addEventListener("click",()=>{
  const c=getCart();if(!c.length)return;
  const msg="Olá! Quero finalizar meu pedido na AJ IMPORTS:\n\n"+c.map(p=>p.name+" | "+(p.variant||"Única")+" | "+(p.size||"Sem tamanho")+" | Qtd "+p.qty+" | "+money(p.price*p.qty)+(p.image?"\nImagem: "+p.image:"")).join("\n\n")+"\n\nTOTAL: "+money(c.reduce((n,p)=>n+p.price*p.qty,0));
  window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(msg),"_blank");
 });
 try{catalog=await(await fetch("data/products.json")).json()}catch(e){catalog=[]}
 const input=$("searchInput"),results=$("headerSearchResults");
 input?.addEventListener("input",()=>{
  const q=(input.value||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().trim();
  const found=q?catalog.filter(p=>(p.name+" "+p.category+" "+(p.tags||[]).join(" ")).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase().includes(q)): [];
  if(results)results.innerHTML=found.slice(0,8).map(p=>'<a href="produto.html?id='+encodeURIComponent(p.id)+'">'+p.name+' <span>'+money(p.price)+'</span></a>').join("")+(q&&!found.length?'<p class="empty">Nenhum produto encontrado.</p>':"");
 });
 const applyCoupon=$("applyCoupon"),couponCode=$("couponCode"),couponMessage=$("couponMessage");
 applyCoupon?.addEventListener("click",()=>{if(couponMessage)couponMessage.textContent="Nenhum cupom ativo no momento. Tente novamente mais tarde."});
 couponCode?.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();applyCoupon?.click()}});
 renderCart();
});

})();
