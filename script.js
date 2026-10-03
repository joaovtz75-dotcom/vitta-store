// VITTA STORE — produtos, cores, carrinho e checkout
const WHATSAPP = "5577999076670";

// Para boleto REAL, configure um backend/gateway.
// Exemplo esperado: POST /api/create-boleto
// O backend deve criar o boleto no gateway e devolver:
// { boletoUrl, barcode, dueDate, orderId }
const BOLETO_ENDPOINT = "/api/create-boleto";

const products = [
  {id:1,name:"Camiseta Overshirt Black",category:"camisas",price:89.90,oldPrice:119.90,image:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=85",description:"Camiseta preta versátil com tecido confortável e acabamento premium.",sizes:["P","M","G","GG"],colors:["Preto","Branco","Marrom","Cinza"]},
  {id:2,name:"Camiseta Premium White",category:"camisas",price:79.90,oldPrice:99.90,image:"https://images.unsplash.com/photo-1583743814966-8936f37f3846?auto=format&fit=crop&w=800&q=85",description:"Camiseta branca básica premium para combinações minimalistas.",sizes:["P","M","G","GG"],colors:["Branco","Preto","Bege","Cinza"]},
  {id:3,name:"Camiseta Street Brown",category:"camisas",price:94.90,oldPrice:null,image:"https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=85",description:"Modelo marrom moderno inspirado no estilo streetwear.",sizes:["P","M","G","GG"],colors:["Marrom","Preto","Off-white","Verde"]},
  {id:4,name:"Calça Cargo Urban",category:"calcas",price:149.90,oldPrice:179.90,image:"https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85",description:"Calça cargo com modelagem moderna e bolsos funcionais.",sizes:["38","40","42","44"],colors:["Preto","Bege","Verde Militar","Cinza"]},
  {id:5,name:"Calça Jeans Black",category:"calcas",price:159.90,oldPrice:null,image:"https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=85",description:"Jeans preto com corte moderno para usar em diversas ocasiões.",sizes:["38","40","42","44"],colors:["Preto","Azul Jeans","Cinza"]},
  {id:6,name:"Bermuda Casual Bege",category:"bermudas",price:79.90,oldPrice:99.90,image:"https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=800&q=85",description:"Bermuda bege leve e confortável para dias quentes.",sizes:["P","M","G","GG"],colors:["Bege","Preto","Marrom","Verde"]},
  {id:7,name:"Bermuda Street Black",category:"bermudas",price:84.90,oldPrice:null,image:"https://images.unsplash.com/photo-1565084888279-aca607ecce0c?auto=format&fit=crop&w=800&q=85",description:"Bermuda preta com visual urbano e versátil.",sizes:["P","M","G","GG"],colors:["Preto","Cinza","Bege"]},
  {id:8,name:"Boné Vitta Black",category:"acessorios",price:59.90,oldPrice:null,image:"https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=800&q=85",description:"Boné preto minimalista com logo Vitta.",sizes:["Único"],colors:["Preto","Branco","Bege","Verde"]}
];

let cart = loadCart();
let selectedProduct = null;
let selectedSize = null;
let selectedColor = null;
let selectedQuantity = 1;

const $ = id => document.getElementById(id);
const productsGrid = $("productsGrid");
const cartElement = $("cart");
const cartOverlay = $("cartOverlay");
const cartItems = $("cartItems");
const cartTotal = $("cartTotal");
const cartCount = $("cartCount");

function formatPrice(v){return v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});}
function loadCart(){try{return JSON.parse(localStorage.getItem("vitta-cart")||"[]")}catch{return []}}
function saveCart(){localStorage.setItem("vitta-cart",JSON.stringify(cart));}

function renderProducts(list=products){
  if(!productsGrid)return;
  productsGrid.innerHTML="";
  if(!list.length){productsGrid.innerHTML='<p style="grid-column:1/-1;text-align:center;padding:50px">Nenhum produto encontrado.</p>';return;}
  list.forEach(p=>{
    const card=document.createElement("article");
    card.className="product-card";
    card.innerHTML=`
      <img class="product-image" src="${p.image}" alt="${p.name}" loading="lazy">
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <strong class="product-price">${formatPrice(p.price)}</strong>
        ${p.oldPrice?`<span class="product-old-price">${formatPrice(p.oldPrice)}</span>`:""}
        <div class="product-buttons">
          <button class="view-button" onclick="openProductModal(${p.id})">Ver opções</button>
          <button class="add-button" onclick="quickAdd(${p.id})">Comprar</button>
        </div>
      </div>`;
    productsGrid.appendChild(card);
  });
}

function quickAdd(id){
  const p=products.find(x=>x.id===id);
  addToCart(id,p?.sizes?.[0]||"Único",p?.colors?.[0]||"Única",1);
}

function addToCart(id,size,color,quantity=1){
  const p=products.find(x=>x.id===id); if(!p)return;
  const key=`${id}|${size}|${color}`;
  const found=cart.find(x=>x.key===key);
  if(found)found.quantity+=Math.max(1,Number(quantity)||1);
  else cart.push({key,id,name:p.name,price:p.price,image:p.image,size,color,quantity:Math.max(1,Number(quantity)||1)});
  saveCart();updateCart();openCart();
}

function changeCartQuantity(key,delta){
  const item=cart.find(x=>x.key===key);if(!item)return;
  item.quantity+=delta;
  if(item.quantity<=0)cart=cart.filter(x=>x.key!==key);
  saveCart();updateCart();
}
function removeFromCart(key){cart=cart.filter(x=>x.key!==key);saveCart();updateCart();}

function updateCart(){
  if(!cartItems)return;
  cartItems.innerHTML="";
  let total=0,count=0;
  if(!cart.length)cartItems.innerHTML='<p class="empty-cart">Seu carrinho está vazio.</p>';
  cart.forEach(item=>{
    const subtotal=item.price*item.quantity;total+=subtotal;count+=item.quantity;
    const div=document.createElement("div");div.className="cart-item";
    div.innerHTML=`
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>Tamanho: ${item.size} · Cor: ${item.color}</p>
        <strong>${formatPrice(subtotal)}</strong>
        <div class="cart-quantity">
          <button onclick="changeCartQuantity('${item.key}',-1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeCartQuantity('${item.key}',1)">+</button>
        </div>
        <button class="remove-item" onclick="removeFromCart('${item.key}')">Remover</button>
      </div>`;
    cartItems.appendChild(div);
  });
  if(cartTotal)cartTotal.textContent=formatPrice(total);
  if(cartCount)cartCount.textContent=count;
}

function openCart(){cartElement?.classList.add("active");cartOverlay?.classList.add("active");}
function closeCart(){cartElement?.classList.remove("active");cartOverlay?.classList.remove("active");}

function openProductModal(id){
  const p=products.find(x=>x.id===id);if(!p)return;
  selectedProduct=p;selectedSize=p.sizes[0]||"Único";selectedColor=p.colors[0]||"Única";selectedQuantity=1;

  const modal=$("productModal"); if(!modal)return;
  const image=$("modalImage"),name=$("modalName"),desc=$("modalDescription"),price=$("modalPrice"),cat=$("modalCategory");
  if(image){image.src=p.image;image.alt=p.name}
  if(name)name.textContent=p.name;if(desc)desc.textContent=p.description;if(price)price.textContent=formatPrice(p.price);if(cat)cat.textContent=p.category;

  let options=modal.querySelector(".product-options");
  if(!options){
    options=document.createElement("div");options.className="product-options";
    const target=modal.querySelector(".modal-content")||modal.firstElementChild;target?.appendChild(options);
  }
  options.innerHTML=`
    <div class="option-group"><span>Tamanho</span><div class="option-list size-list">${p.sizes.map((x,i)=>`<button class="${i===0?"selected":""}" data-value="${x}">${x}</button>`).join("")}</div></div>
    <div class="option-group"><span>Cor</span><div class="option-list color-list">${p.colors.map((x,i)=>`<button class="${i===0?"selected":""}" data-value="${x}">${x}</button>`).join("")}</div></div>
    <div class="option-group"><span>Quantidade</span><div class="quantity-picker"><button id="qtyMinus">−</button><strong id="modalQty">1</strong><button id="qtyPlus">+</button></div></div>`;

  options.querySelectorAll(".size-list button").forEach(b=>b.onclick=()=>{options.querySelectorAll(".size-list button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedSize=b.dataset.value});
  options.querySelectorAll(".color-list button").forEach(b=>b.onclick=()=>{options.querySelectorAll(".color-list button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");selectedColor=b.dataset.value});
  options.querySelector("#qtyMinus").onclick=()=>{selectedQuantity=Math.max(1,selectedQuantity-1);options.querySelector("#modalQty").textContent=selectedQuantity};
  options.querySelector("#qtyPlus").onclick=()=>{selectedQuantity++;options.querySelector("#modalQty").textContent=selectedQuantity};

  modal.classList.add("active");
}
function closeProductModal(){$("productModal")?.classList.remove("active");selectedProduct=null;}

function injectCheckout(){
  if($("vittaCheckout"))return;
  const el=document.createElement("div");el.id="vittaCheckout";el.className="vitta-checkout";
  el.innerHTML=`
    <div class="checkout-card">
      <button class="checkout-close" id="checkoutClose">×</button>
      <div id="checkoutStepCustomer">
        <span class="checkout-kicker">VITTA STORE</span>
        <h2>Finalizar pedido</h2>
        <p>Preencha seus dados para gerar o boleto.</p>
        <div class="checkout-summary" id="checkoutSummary"></div>
        <form id="checkoutForm">
          <input required name="name" placeholder="Nome completo">
          <input required name="cpf" inputmode="numeric" placeholder="CPF">
          <input required name="email" type="email" placeholder="E-mail">
          <input required name="phone" inputmode="tel" placeholder="Celular">
          <input required name="cep" inputmode="numeric" placeholder="CEP">
          <input required name="address" placeholder="Endereço e número">
          <button class="checkout-pay" type="submit">Gerar boleto</button>
        </form>
        <small>Se o gateway não estiver configurado, a loja exibirá um aviso em vez de fingir que o boleto foi criado.</small>
      </div>
      <div id="checkoutResult" hidden></div>
    </div>`;
  document.body.appendChild(el);
  $("checkoutClose").onclick=()=>el.classList.remove("active");
  $("checkoutForm").onsubmit=createBoleto;
}

function openCheckout(){
  if(!cart.length){alert("Seu carrinho está vazio.");return;}
  injectCheckout();
  let total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
  $("checkoutSummary").innerHTML=cart.map(x=>`<div>${x.quantity}x ${x.name} · ${x.color} · ${x.size}</div>`).join("")+`<strong>Total: ${formatPrice(total)}</strong>`;
  $("vittaCheckout").classList.add("active");
}

async function createBoleto(e){
  e.preventDefault();
  const form=new FormData(e.target);
  const customer=Object.fromEntries(form.entries());
  const total=cart.reduce((s,x)=>s+x.price*x.quantity,0);
  const button=e.target.querySelector("button[type=submit]");
  button.disabled=true;button.textContent="Gerando boleto…";
  try{
    const response=await fetch(BOLETO_ENDPOINT,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({customer,items:cart,total})});
    if(!response.ok)throw new Error("endpoint");
    const data=await response.json();
    if(!data.boletoUrl)throw new Error("boleto");
    $("checkoutStepCustomer").hidden=true;
    $("checkoutResult").hidden=false;
    $("checkoutResult").innerHTML=`
      <span class="checkout-kicker">PEDIDO ${data.orderId||""}</span>
      <h2>Boleto gerado</h2>
      <p>Vencimento: ${data.dueDate||"consulte no boleto"}</p>
      <p class="barcode">${data.barcode||""}</p>
      <a class="checkout-pay" href="${data.boletoUrl}" target="_blank" rel="noopener">Abrir boleto</a>`;
  }catch(err){
    alert("O boleto ainda não pode ser gerado: o gateway de pagamento precisa ser conectado ao backend da loja.");
  }finally{
    button.disabled=false;button.textContent="Gerar boleto";
  }
}

function checkoutWhatsApp(){
  if(!cart.length)return;
  let total=0;
  const lines=cart.map(x=>{const s=x.price*x.quantity;total+=s;return`• ${x.name} | ${x.color} | Tam. ${x.size} | ${x.quantity}x | ${formatPrice(s)}`});
  const msg=["Olá! Quero fazer um pedido na Vitta Store.","",...lines,"",`Total: ${formatPrice(total)}`].join("\n");
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`,"_blank","noopener,noreferrer");
}

// Botões existentes
$("cartButton")?.addEventListener("click",openCart);
$("closeCart")?.addEventListener("click",closeCart);
cartOverlay?.addEventListener("click",closeCart);
$("checkoutButton")?.addEventListener("click",openCheckout);
$("modalAdd")?.addEventListener("click",()=>{if(selectedProduct){addToCart(selectedProduct.id,selectedSize,selectedColor,selectedQuantity);closeProductModal();}});
document.querySelector(".modal-close")?.addEventListener("click",closeProductModal);
$("productModal")?.addEventListener("click",e=>{if(e.target===$("productModal"))closeProductModal();});

$("searchButton")?.addEventListener("click",()=>{$("searchBox")?.classList.toggle("active");$("searchInput")?.focus()});
$("searchInput")?.addEventListener("input",e=>{const q=e.target.value.toLowerCase().trim();renderProducts(products.filter(p=>(p.name+" "+p.category+" "+p.description+" "+p.colors.join(" ")).toLowerCase().includes(q)))});

document.querySelectorAll(".category-buttons button").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".category-buttons button").forEach(x=>x.classList.remove("active"));b.classList.add("active");const c=b.dataset.category;renderProducts(c==="todos"?products:products.filter(p=>p.category===c))}));

$("sortProducts")?.addEventListener("change",e=>{const a=[...products];if(e.target.value==="lowest")a.sort((x,y)=>x.price-y.price);if(e.target.value==="highest")a.sort((x,y)=>y.price-x.price);renderProducts(a)});

document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeProductModal();closeCart();$("vittaCheckout")?.classList.remove("active")}});

renderProducts();updateCart();
