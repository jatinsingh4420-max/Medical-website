const orderFormBtn = document.getElementById("order-form");

orderFormBtn.addEventListener("click", ()=>{
  openOrderForm(currentProduct.name);
});// ====== CONFIG - edit products or phone here ======
const MY_WHATSAPP_NUMBER = "919413604420"; // use full number with country code (91...)
const PRODUCTS = [
  { id: "p1", name: "Paracetamol 500mg (10)", price: 30, desc: "Fever reducer", offer: 20 },
  { id: "p2", name: "Cough Syrup 100ml", price: 90, desc: "Cough relief", offer: 10 },
  { id: "p3", name: "Vitamin C 500mg (10)", price: 120, desc: "Immunity booster", offer: 0 },
];

// ====== render UI ======
document.getElementById("year").innerText = new Date().getFullYear();
document.getElementById("phone").innerText = "9413604420";
const waLinkEl = document.getElementById("wa-link");
waLinkEl.href = `https://wa.me/${MY_WHATSAPP_NUMBER}`;

const productList = document.getElementById("product-list");

function renderProducts(){
  productList.innerHTML = "";
  PRODUCTS.forEach(p=>{
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="row">
        <div><span class="price">₹${p.price}</span> ${p.offer ? `<span class="offer">${p.offer}% OFF</span>` : ""}</div>
        <div>
          <button class="btn btn-order" data-id="${p.id}">Order</button>
        </div>
      </div>
    `;
    productList.appendChild(card);
  });

  // attach listeners
  document.querySelectorAll(".btn-order").forEach(b=>{
    b.addEventListener("click", (e)=>{
      openOrderModal(e.target.dataset.id);
    });
  });
}
renderProducts();

// ====== order modal logic ======
const modal = document.getElementById("order-modal");
const modalClose = document.getElementById("modal-close");
const modalProductName = document.getElementById("modal-product-name");
const qtyInput = document.getElementById("order-qty");
const nameInput = document.getElementById("order-name");
const addrInput = document.getElementById("order-address");
const orderWaBtn = document.getElementById("order-whatsapp");
const orderSaveBtn = document.getElementById("order-save");

let currentProduct = null;

function openOrderModal(productId){
  currentProduct = PRODUCTS.find(x=>x.id===productId);
  modalProductName.innerText = `Order: ${currentProduct.name}`;
  qtyInput.value = 1;
  nameInput.value = "";
  addrInput.value = "";
  modal.classList.remove("hidden");
  modal.setAttribute("aria-hidden","false");
}
modalClose.addEventListener("click", ()=> { closeModal(); });
function closeModal(){ modal.classList.add("hidden"); modal.setAttribute("aria-hidden","true");}

// build whatsapp text and open
orderWaBtn.addEventListener("click", ()=>{
  const qty = qtyInput.value || 1;
  const customer = nameInput.value || "Customer";
  const addr = addrInput.value || "";
  const text = `Hello, I want to order *${currentProduct.name}*.\nQty: ${qty}\nName: ${customer}\nAddress: ${addr}\nPlease confirm price & delivery.`;
  const url = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
  closeModal();
});

// save locally (in browser)
orderSaveBtn.addEventListener("click", ()=>{
  const qty = qtyInput.value || 1;
  const customer = nameInput.value || "Customer";
  const addr = addrInput.value || "";
  const order = {
    id: "ord_" + Date.now(),
    product: currentProduct.name,
    qty, customer, addr, ts: new Date().toISOString()
  };

  const list = JSON.parse(localStorage.getItem("hh_orders") || "[]");
  list.push(order);
  localStorage.setItem("hh_orders", JSON.stringify(list));
  alert("Order saved locally on this phone. You can share it via WhatsApp or check saved orders later.");
  closeModal();
});

// quick WA CTA (top button) - open a blank message
document.getElementById("whatsapp-cta").href = `https://wa.me/${MY_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hello, I want to order. Please help.")}`;
