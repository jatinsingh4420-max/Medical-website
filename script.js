  // ====== YOUR WHATSAPP NUMBER ======
const MY_WHATSAPP_NUMBER = "919413604420";

// ====== YOUR PRODUCTS LIST ======
const PRODUCTS = [
  { id: "p1", name: "Paracetamol 500mg (10)", price: 30, desc: "Fever reducer", offer: 20 },
  { id: "p2", name: "Cough Syrup 100ml", price: 90, desc: "Cough relief", offer: 10 },
  { id: "p3", name: "Vitamin C 500mg (10)", price: 120, desc: "Immunity booster", offer: 0 },
];

// ====== GOOGLE FORM CONFIG (FROM YOUR PREFILLED LINK) ======
const FORM_BASE = "https://docs.google.com/forms/d/e/1FAIpQLSfI-oVq-HHuqNOYqR_SXlM56MsiBW_30Fpum5h3MTkEqHlSTQ/viewform?usp=pp_url";
const ENTRY_QTY     = "entry.1010592062";  // quantity
const ENTRY_PRODUCT = "entry.1967942519";  // product
const ENTRY_NAME    = "entry.1724801920";  // customer name
const ENTRY_ADDRESS = "entry.951409499";   // address
const ENTRY_PHONE   = "entry.682598387";   // phone
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
  // reset inputs
  document.getElementById("order-qty").value = 1;
  document.getElementById("order-name").value = "";
  document.getElementById("order-address").value = "";
  document.getElementById("order-phone").value = "";
  modal.classList.remove("hidden");
}

// ====== WHATSAPP ORDER ======
document.getElementById("order-whatsapp").onclick = ()=>{
  const qty = document.getElementById("order-qty").value;
  const name = document.getElementById("order-name").value || "Customer";
  const addr = document.getElementById("order-address").value || "";
  const phone = document.getElementById("order-phone").value || "";

  const msg =
`Order Request:
Product: ${currentProduct.name}
Qty: ${qty}
Name: ${name}
Address: ${addr}
Phone: ${phone}`;

  window.open(`https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  modal.classList.add("hidden");
};

// ====== GOOGLE FORM ORDER ======
document.getElementById("order-form").onclick = ()=>{
  const qty = document.getElementById("order-qty").value || 1;
  const name = document.getElementById("order-name").value || "";
  const addr = document.getElementById("order-address").value || "";
  const phone = document.getElementById("order-phone").value || "";

  const params = new URLSearchParams();
  params.set(ENTRY_PRODUCT, currentProduct.name);
  params.set(ENTRY_QTY, qty);
  params.set(ENTRY_NAME, name);
  params.set(ENTRY_ADDRESS, addr);
  params.set(ENTRY_PHONE, phone);

  const url = FORM_BASE + "&" + params.toString();
  window.open(url, "_blank");
  modal.classList.add("hidden");
};

// ====== SAVE LOCALLY ======
document.getElementById("order-save").onclick = ()=>{
  const qty = document.getElementById("order-qty").value || 1;
  const name = document.getElementById("order-name").value || "Customer";
  const addr = document.getElementById("order-address").value || "";
  const phone = document.getElementById("order-phone").value || "";

  const order = { id: "ord_" + Date.now(), product: currentProduct.name, qty, name, addr, phone, ts: new Date().toISOString() };
  const list = JSON.parse(localStorage.getItem("hh_orders") || "[]");
  list.push(order);
  localStorage.setItem("hh_orders", JSON.stringify(list));
  alert("Order saved locally on this phone. You can share it later from browser storage.");
  modal.classList.add("hidden");
};
