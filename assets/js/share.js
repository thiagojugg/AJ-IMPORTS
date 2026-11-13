(()=>{
 let catalog;
 const getCatalog=()=>catalog||(catalog=fetch(new URL("data/products.json",document.baseURI)).then(r=>r.json()));
 const base="https://thiagojugg.github.io/AJ-IMPORTS/";
 const icon=(type)=>type==="whatsapp"?'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.2A8.5 8.5 0 1 1 20 11.5Z"></path><path d="M8.5 8.2c.4 2.4 2 4 4.4 4.8l1.2-1.1 2 .9c.2.1.3.3.2.5-.3 1-1.2 1.6-2.2 1.6-3.7-.2-7.7-4.1-7.8-7.7 0-1 .6-1.9 1.6-2.2.2-.1.4 0 .5.2l.9 2-1.1 1Z"></path></svg>':'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8h3V4h-3c-3 0-5 2-5 5v2H6v4h3v5h4v-5h3l1-4h-4V9c0-.7.3-1 1-1Z"></path></svg>';
 function close(){document.querySelector(".share-menu")?.remove();document.removeEventListener("click",outside,true)}
 function outside(e){if(!e.target.closest(".share-menu")&&!e.target.closest(".share-product"))close()}
 document.addEventListener("click",async e=>{
  const btn=e.target.closest(".share-product");if(!btn)return;
  e.preventDefault();e.stopPropagation();close();
  try{const list=await getCatalog();const p=list.find(x=>String(x.id)===btn.dataset.shareProduct);if(!p)return;
   const url=base+"compartilhar/"+encodeURIComponent(p.id)+"/";
   const photo=new URL(p.image,base).href;\n   const message=[p.name,p.description||"Confira este produto na AJ IMPORTS.","Foto do produto: "+photo,"Ver produto: "+url].join("\\n");
   const menu=document.createElement("div");menu.className="share-menu";
   menu.innerHTML='<a target="_blank" rel="noopener noreferrer" href="https://wa.me/?text='+encodeURIComponent(message)+'">'+icon("whatsapp")+'WHATSAPP</a><a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u='+encodeURIComponent(url)+'">'+icon("facebook")+'FACEBOOK</a>';
   document.body.append(menu);const r=btn.getBoundingClientRect();menu.style.left=Math.max(10,Math.min(innerWidth-205,r.right-195))+"px";menu.style.top=Math.max(10,Math.min(innerHeight-125,r.bottom+8))+"px";setTimeout(()=>document.addEventListener("click",outside,true),0);
  }catch(err){console.error("Não foi possível preparar o compartilhamento",err)}
 },true);
})();