const PHONE="5598988482474";
let p,variant=null,size=null;
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(n);

function gallery(){
  const imgs=variant&&variant.images&&variant.images.length?variant.images:(p.images||[p.image]).filter(Boolean);
  $("gallery").innerHTML=imgs.length?imgs.map((src,i)=>'<img class="gimg '+(!i?"current":"")+'" src="'+src+'" alt="'+p.name+'" loading="'+(i?"lazy":"eager")+'">').join(""):'<div class="placeholder">FOTOS DO PRODUTO SERÃO ADICIONADAS</div>';

}

document.addEventListener("DOMContentLoaded",async()=>{
  try{
    const list=await(await fetch("data/products.json")).json();
    p=list.find(x=>String(x.id)===new URLSearchParams(location.search).get("id"));
  }catch(e){}
  if(!p){$("name").textContent="Produto não encontrado";return;}

  $("name").textContent=p.name;
  $("price").textContent=money(+p.price);
  $("description").textContent=p.description||"";
  const variants=p.variants||[{name:"Única",images:p.images||[]}];
  variant=variants[0];
  $("variants").innerHTML=variants.map((v,i)=>'<button type="button" data-v="'+i+'" class="'+(!i?"chosen":"")+'">'+v.name+'</button>').join("");
  const current=$("variant-current");
  if(current)current.textContent=variant.name;
  $("variants").onclick=e=>{
    const b=e.target.closest("[data-v]");if(!b)return;
    variant=variants[+b.dataset.v];
    $("variants").querySelectorAll("button").forEach(x=>x.classList.toggle("chosen",x===b));
    if(current)current.textContent=variant.name;
    gallery();
  };

  const sizeSection=$("sizes").closest(".detail-option");
  const isWatch=String(p.category||"").toUpperCase().includes("RELÓGIO") || (p.tags||[]).includes("relógio");
  const sizes=Array.isArray(p.sizes)?p.sizes.filter(s=>String(s).trim()):[];
  const hasSizes=p.hasSizes!==false && !isWatch && sizes.length>0;
  if(sizeSection)sizeSection.hidden=!hasSizes;
  size=hasSizes&&sizes.length===1?sizes[0]:null;
  $("sizes").innerHTML=sizes.map(s=>'<button type="button" data-s="'+s+'" class="'+(sizes.length===1?"chosen":"")+'">'+s+'</button>').join("");
  $("sizes").onclick=e=>{
    const b=e.target.closest("[data-s]");if(!b)return;
    size=b.dataset.s;
    $("sizes").querySelectorAll("button").forEach(x=>x.classList.toggle("chosen",x===b));
  };

  gallery();
  const saved=JSON.parse(localStorage.getItem("aj-cart")||"[]");
  const counter=$("count");
  if(counter)counter.textContent=saved.reduce((n,x)=>n+x.qty,0);

  let touchX=0;
  $("gallery").addEventListener("touchstart",e=>{touchX=e.changedTouches[0].screenX;},{passive:true});
  $("gallery").addEventListener("touchend",e=>{
    const dx=e.changedTouches[0].screenX-touchX;
    const imgs=[...document.querySelectorAll(".gimg")];
    if(imgs.length<2||Math.abs(dx)<35)return;
    const currentIndex=imgs.findIndex(im=>im.classList.contains("current"));
    const next=(currentIndex+(dx<0?1:-1)+imgs.length)%imgs.length;
    imgs.forEach((im,i)=>im.classList.toggle("current",i===next));

  },{passive:true});

  function valid(){if(hasSizes&&!size){alert("Selecione um tamanho.");return false;}return true;}
  function order(){return{id:p.id,name:p.name,price:+p.price,variant:variant.name,size:hasSizes?size:null,qty:Math.max(1,+$("qty").value||1),image:(variant.images||[])[0]||p.image||""};}
  $("add").onclick=()=>{
    if(!valid())return;
    const cart=JSON.parse(localStorage.getItem("aj-cart")||"[]");
    cart.push(order());localStorage.setItem("aj-cart",JSON.stringify(cart));
    alert("Adicionado à sacola! Volte à página inicial para visualizar.");
  };
  $("buy").onclick=()=>{
    if(!valid())return;
    const o=order();
    const msg="Olá! Quero comprar na AJ IMPORTS:\nProduto: "+o.name+"\nVariedade: "+o.variant+(o.size?"\nTamanho: "+o.size:"")+"\nQuantidade: "+o.qty+"\nValor: "+money(o.price)+(o.image?"\nFoto da opção escolhida: "+new URL(o.image,window.location.href).href:"");
    window.open("https://wa.me/"+PHONE+"?text="+encodeURIComponent(msg),"_blank");
  };
});