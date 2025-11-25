// ========== CONFIG - EDIT THESE ==========
const SHOP_WHATSAPP = "919413604420"; // your number (countrycode + number, no +)
const FORM_BASE = ""; // optional Google Form base prefill URL (leave empty to disable form submit)
// map if you want programmatic entries: ENTRY_PRODUCT, ENTRY_QTY... (leave blank if unused)
const ENTRY_PRODUCT = ""; const ENTRY_QTY = ""; const ENTRY_NAME = ""; const ENTRY_ADDRESS = ""; const ENTRY_PHONE = "";
// =========================================

const YEAR_EL = document.getElementById("year");
if (YEAR_EL) YEAR_EL.innerText = new Date().getFullYear();
document.getElementById("shop-phone").innerText = SHOP_WHATSAPP.replace(/^91/,"");

// state
let PRODUCTS = [];
let CART = {}; // {productId: qty}

// helpers
const $ = (sel)=>document.querySelector(sel);
const $$ = (sel)=>Array.from(document.querySelectorAll(sel));

function fetchProducts(){
  fetch('products.json').then(r=>r.json()).then(data=>{
    PRODUCTS = data;
    renderProducts(PRODUCTS);
    updateCartCount();
  }).catch(err=>{
    console.error(err);
    document.getElementById('product-list').innerHTML = "<p style='color:#b00'>Error loading products.json</p>";
  });
}

function renderProducts(list){
  const container = document.getElementById('product-list');
  container.innerHTML = '';
  list.forEach(p=>{
    const el = document.createElement('article');
    el.className = 'card';
    el.innerHTML = `
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x300?text=Medicine'"/>
      <h4>${p.name}</h4>
      <p>${p.description}</p>
      <div class="row">
        <div>
          <span class="price">₹${p.price}</span>
          ${p.offer? `<span class="offer">${p.offer}% OFF</span>` : ''}
        </div>
        <div class="cat-tag">${p.category}</div>
      </div>
      <div class="actions">
        <button class="btn btn-add" data-id="${p.id}">Add to Cart</button>
        <button class="btn btn-ws" data-id="${p.id}">Buy (WhatsApp)</button>
        <button class="btn btn-form" data-id="${p.id}">Order (Form)</button>
      </div>
    `;
    container.appendChild(el);
  });

  // attach listeners
  $$('.btn-add').forEach(b=>b.onclick = e=>{ addToCart(e.target.dataset.id, 1); });
  $$('.btn-ws').forEach(b=>b.onclick = e=>{ buyViaWhatsApp(e.target.dataset.id); });
  $$('.btn-form').forEach(b=>b.onclick = e=>{ orderViaForm(e.target.dataset.id); });
}

// CART functions
function addToCart(pid, qty=1){
  CART[pid] = (CART[pid] || 0) + qty;
  saveCart();
  updateCartCount();
  toast("Added to cart");
}
function removeFromCart(pid){ delete CART[pid]; saveCart(); renderCart(); updateCartCount(); }
function changeQty(pid, q){ if(q<=0) removeFromCart(pid); else { CART[pid]=q; saveCart(); renderCart(); updateCartCount(); } }
function saveCart(){ localStorage.setItem('hh_cart', JSON.stringify(CART)); }
function loadCart(){ try{ CART = JSON.parse(localStorage.getItem('hh_cart')||'{}'); }catch(e){ CART={}; } }
function updateCartCount(){ const c = Object.values(CART).reduce((s,n)=>s+Number(n),0); document.getElementById('cart-count').innerText = c; }

// Modal & cart UI
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
document.getElementById('close-modal').onclick = ()=>closeModal();

function openModal(){ modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }
function closeModal(){ modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }

// render cart
function renderCart(){
  loadCart();
  const items = Object.keys(CART).map(id=>{
    const prod = PRODUCTS.find(p=>p.id===id);
    return { ...prod, qty: CART[id] };
  });
  let html = `<h2>Your Cart</h2>`;
  if(!items.length){ html += '<p>Cart is empty</p>'; html += `<div style="text-align:right"><button id="close-cart" class="btn">Close</button></div>`; modalBody.innerHTML = html; openModal(); document.getElementById('close-cart').onclick=closeModal; return; }

  html += `<div class="cart-list">`;
  items.forEach(it=>{
    html += `<div class="cart-item">
      <img src="${it.image}" onerror="this.src='https://via.placeholder.com/80x80?text=Img'"/>
      <div style="flex:1">
        <div style="font-weight:700">${it.name}</div>
        <div class="qty">
          <button class="btn" data-act="dec" data-id="${it.id}">-</button>
          <span style="min-width:28px;text-align:center">${it.qty}</span>
          <button class="btn" data-act="inc" data-id="${it.id}">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>₹${it.price * it.qty}</div>
        <button class="btn" data-act="remove" data-id="${it.id}">Remove</button>
      </div>
    </div>`;
  });
  html += `</div>`;

  // Total & checkout
  const total = items.reduce((s,it)=>s+it.price*it.qty,0);
  html += `<div style="text-align:right;font-weight:800">Total: ₹${total}</div>`;
  html += `<div style="display:flex;gap:8px;margin-top:12px;justify-content:flex-end">
    <button id="checkout-form" class="btn btn-form">Checkout (Form)</button>
    <button id="checkout-ws" class="btn btn-ws">Checkout (WhatsApp)</button>
    <button id="close-cart" class="btn">Close</button>
  </div>`;

  modalBody.innerHTML = html;
  openModal();

  // events
  $$('.cart-item button[data-act]').forEach(b=>{
    b.onclick = (e)=>{
      const id = e.target.dataset.id; const act = e.target.dataset.act;
      if(act==='inc') changeQty(id, CART[id]+1);
      if(act==='dec') changeQty(id, CART[id]-1);
      if(act==='remove') removeFromCart(id);
      renderCart();
    };
  });
  document.getElementById('close-cart').onclick = closeModal;
  document.getElementById('checkout-ws').onclick = ()=>checkoutViaWhatsApp(items);
  document.getElementById('checkout-form').onclick = ()=>checkoutViaForm(items);
}

// Quick toast
function toast(msg){ const el = document.createElement('div'); el.style = 'position:fixed;right:18px;bottom:18px;background:#222;color:#fff;padding:10px;border-radius:8px;z-index:9999'; el.innerText = msg; document.body.appendChild(el); setTimeout(()=>el.remove(),1500); }

// Buy single item via whatsapp
function buyViaWhatsApp(pid){
  const p = PRODUCTS.find(x=>x.id===pid);
  const msg = `Hello, I'd like to buy:\n${p.name}\nQty: 1\nPrice: ₹${p.price}\nPlease confirm availability and delivery.\n- Health Hub Pharmacy`;
  window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(msg)}`,'_blank');
}

// Order single via form (prefill)
function orderViaForm(pid){
  const p = PRODUCTS.find(x=>x.id===pid);
  if(!FORM_BASE){ // fallback to open modal quick-order
    openQuickOrderModal(p);
    return;
  }
  // if FORM_BASE & ENTRY_* configured, open prefilled URL
  const params = new URLSearchParams();
  if(ENTRY_PRODUCT) params.set(ENTRY_PRODUCT, p.name);
  if(ENTRY_QTY) params.set(ENTRY_QTY, 1);
  // Other entries left empty for customer to fill
  window.open(FORM_BASE + '&' + params.toString(),'_blank');
}

// Checkout via WhatsApp (cart)
function checkoutViaWhatsApp(items){
  let text = `New Order from Website:%0A`;
  items.forEach(it=> text += `${it.name} x ${it.qty} = ₹${it.price * it.qty}%0A`);
  const total = items.reduce((s,it)=>s+it.price*it.qty,0);
  text += `Total: ₹${total}%0APlease confirm availability & delivery.`;
  window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${text}`,'_blank');
  closeModal();
}

// Checkout via Google Form (cart)
function checkoutViaForm(items){
  if(!FORM_BASE){ openQuickOrderModal(null, items); return; }
  // Build a prefill for form if ENTRY_* set. We'll append product details into a text field (if available).
  let productList = items.map(it=> `${it.name} x ${it.qty}`).join('; ');
  const params = new URLSearchParams();
  if(ENTRY_PRODUCT) params.set(ENTRY_PRODUCT, productList);
  if(ENTRY_QTY) params.set(ENTRY_QTY, items.reduce((s,it)=>s+it.qty,0));
  window.open(FORM_BASE + '&' + params.toString(), '_blank');
  closeModal();
}

// Quick order modal (single or cart) to collect customer name/address when FORM not configured
function openQuickOrderModal(product=null, items=null){
  let html = `<h3>Place Order</h3>`;
  if(product) html += `<div style="font-weight:700">${product.name} - ₹${product.price}</div><br>`;
  else if(items) html += `<div style="font-weight:700">Cart Items: ${items.length}</div><br>`;
  html += `<label>Your name <input id="co-name" /></label><br><label>Phone <input id="co-phone" /></label><br><label>Address <textarea id="co-address"></textarea></label><br>`;
  html += `<div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px">
    <button id="co-ws" class="btn btn-ws">Send via WhatsApp</button>
    <button id="co-close" class="btn">Cancel</button>
  </div>`;
  modalBody.innerHTML = html; openModal();
  document.getElementById('co-close').onclick = closeModal;
  document.getElementById('co-ws').onclick = ()=>{
    const name = document.getElementById('co-name').value || 'Customer';
    const phone = document.getElementById('co-phone').value || '';
    const addr = document.getElementById('co-address').value || '';
    let text = `Order from ${name}%0APhone: ${phone}%0AAddress: ${addr}%0A`;
    if(product) text += `${product.name} x1 = ₹${product.price}%0A`;
    else if(items) items.forEach(it=> text += `${it.name} x${it.qty} = ₹${it.price*it.qty}%0A`);
    window.open(`https://wa.me/${SHOP_WHATSAPP}?text=${encodeURIComponent(text)}`,'_blank');
    closeModal();
  };
}

// SEARCH / FILTER / SORT
function applyControls(){
  const q = (document.getElementById('search').value || '').toLowerCase().trim();
  const cat = document.getElementById('filter-cat').value;
  const sort = document.getElementById('sort-select').value;
  let filtered = PRODUCTS.filter(p=>{
    if(cat !== 'all' && p.category !== cat) return false;
    if(!q) return true;
    return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
  });
  if(sort === 'price-asc') filtered.sort((a,b)=>a.price-b.price);
  if(sort === 'price-desc') filtered.sort((a,b)=>b.price-a.price);
  renderProducts(filtered);
}

// attach controls
document.getElementById('search').addEventListener('input', applyControls);
document.getElementById('filter-cat').addEventListener('change', applyControls);
document.getElementById('sort-select').addEventListener('change', applyControls);
$$('.cat').forEach(el=> el.onclick = (e)=>{ $$('.cat').forEach(x=>x.classList.remove('active')); e.target.classList.add('active'); document.getElementById('filter-cat').value = e.target.dataset.cat; applyControls(); });
document.getElementById('view-cart').onclick = renderCart;
document.getElementById('show-offers').onclick = ()=> renderProducts(PRODUCTS.filter(p=>p.offer && p.offer>0));

// load cart & products
loadCart();
fetchProducts();
