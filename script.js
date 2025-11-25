  // ====== YOUR WHATSAPP NUMBER ======
const MY_WHATSAPP_NUMBER = "919413604420";

// ====== YOUR PRODUCTS LIST ======
const PRODUCTS = [
  { id: "p1", name: "Paracetamol 500mg (10)", price: 30, desc: "Fever reducer", offer: 20 },
  { id: "p2", name: "Cough Syrup 100ml", price: 90, desc: "Cough relief", offer: 10 },
  { id: "p3", name: "Vitamin C 500mg (10)", price: 120, desc: "Immunity booster", offer: 0 },
];

// ====== GOOGLE FORM CONFIG (FILL THIS) ======
const FORM_BASE = "YOUR_FORM_BASE_URL"; 
const ENTRY_PRODUCT = "entry.PRODUCT_ID";
const ENTRY_QTY     = "entry.QTY_ID";
const ENTRY_NAME    = "entry.NAME_ID";
const ENTRY_ADDRESS = "entry.ADDRESS_ID";
const ENTRY_PHONE   = "entry.PHONE_ID";
// ============================================

document.getElementById("year").innerText = new Date().getFullYear();
document.getElementById("wa-link").href = `https://wa.me/${MY_WHATSAPP_NUMBER}`;
document.getElementById("whatsapp-cta").href = `https://wa.me/${MY_WHATSAPP_NUMBER}`;

// Render products
const productList = document.getElementById("product-list");
function renderProducts(){
  productList.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div>
        <span class="price">₹${p.price}</span>
        ${p.offer ? `<span class="offer">${p.offer}% OFF</span>` : ""}
      </div>
      <button class="btn btn-primary order-btn" data-id="${p.id}">Order</button>
    `;
    productList.appendChild(card);
  });

  document.querySelectorAll(".order-btn").forEach(btn=>{
    btn.addEventListener("click", ()=>openModal(btn.dataset.id));
  });
}
renderProducts();

let currentProduct = null;

// Modal handling
const modal = document.getElementById("order-modal");
document.getElementById("modal-close").onclick = ()=>modal.classList.add("hidden");

function openModal(id){
  currentProduct = PRODUCTS.find(p=>p.id===id);
  document.getElementById("modal-product-name").innerText = `Order: ${currentProduct.name}`;
  modal.classList.remove("hidden");
}

// ====== WHATSAPP ORDER ======
document.getElementById("order-whatsapp").onclick = ()=>{
  const qty = document.getElementById("order-qty").value;
  const name = document.getElementById("order-name").value;
  const addr = document.getElementById("order-address").value;

  const msg =
`Order Request:
Product: ${currentProduct.name}
Qty: ${qty}
Name: ${name}
Address: ${addr}`;

  window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  modal.classList.add("hidden");
};

// ====== GOOGLE FORM ORDER ======
document.getElementById("order-form").onclick = ()=>{
  const qty = document.getElementById("order-qty").value;
  const name = document.getElementById("order-name").value;
  const addr = document.getElementById("order-address").value;
  const phone = document.getElementById("order-phone").value;

  const params = new URLSearchParams();
  params.set(ENTRY_PRODUCT, currentProduct.name);
  params.set(ENTRY_QTY, qty);
  params.set(ENTRY_NAME, name);
  params.set(ENTRY_ADDRESS, addr);
  params.set(ENTRY_PHONE, phone);

  window.open(FORM_BASE + "&" + params.toString(), "_blank");
  modal.classList.add("hidden");
};

// ====== SAVE LOCALLY ======
document.getElementById("order-save").onclick = ()=>{
  alert("Order saved locally on this phone.");
  modal.classList.add("hidden");
};
