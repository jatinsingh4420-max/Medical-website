// basic product data (same as before)
const PRODUCTS = [
  { id:"p1", name:"Paracetamol 500mg (10)", price:30, desc:"Fever reducer", offer:20 },
  { id:"p2", name:"Cough Syrup 100ml", price:90, desc:"Cough relief", offer:10 },
  { id:"p3", name:"Vitamin C 500mg (10)", price:120, desc:"Immunity booster", offer:0 }
];

// render products
const list = document.getElementById("product-list");
PRODUCTS.forEach(p=>{
  const el = document.createElement("div");
  el.className = "card";
  el.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p><div><span class="price">₹${p.price}</span> ${p.offer? `<span class="offer">${p.offer}% OFF</span>` : ''}</div>
    <div style="margin-top:10px;">
      <button class="btn primary order-now" data-id="${p.id}">Order</button>
    </div>`;
  list.appendChild(el);
});

document.querySelectorAll(".order-now").forEach(b=>{
  b.addEventListener("click", e=>{
    const id = e.target.dataset.id;
    openOrderModal(id);
  })
});

// modal helpers
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");
modalClose.onclick = ()=>modal.classList.add("hidden");

function openOrderModal(pid){
  const p = PRODUCTS.find(x=>x.id===pid);
  modalBody.innerHTML = `
    <h3>Order ${p.name}</h3>
    <label>Quantity: <input id="mqty" type="number" value="1" min="1" /></label><br><br>
    <label>Name: <input id="mname" type="text" /></label><br><br>
    <label>Phone: <input id="mphone" type="text" /></label><br><br>
    <label>Address: <textarea id="maddr"></textarea></label><br><br>
    <div style="display:flex;gap:8px;">
      <button id="mwh" class="btn primary">Order on WhatsApp</button>
      <button id="mform" class="btn">Order via Google Form</button>
    </div>`;
  modal.classList.remove("hidden");

  document.getElementById("mwh").onclick = ()=>{
    const msg = `Order: ${p.name}\nQty: ${document.getElementById("mqty").value}\nName: ${document.getElementById("mname").value}\nPhone: ${document.getElementById("mphone").value}\nAddress: ${document.getElementById("maddr").value}`;
    window.open(`https://wa.me/919413604420?text=${encodeURIComponent(msg)}`,"_blank");
    modal.classList.add("hidden");
  };

  document.getElementById("mform").onclick = ()=>{
    // example prefill form link (change to your own form entries)
    const base = "https://docs.google.com/forms/d/e/1FAIpQLSfI-oVq-HHuqNOYqR_SXlM56MsiBW_30Fpum5h3MTkEqHlSTQ/viewform?usp=pp_url";
    const params = new URLSearchParams();
    params.set("entry.1967942519", p.name); // product
    params.set("entry.1010592062", document.getElementById("mqty").value); // qty
    params.set("entry.1724801920", document.getElementById("mname").value); // name
    params.set("entry.682598387", document.getElementById("mphone").value); // phone
    params.set("entry.951409499", document.getElementById("maddr").value); // address
    window.open(base + "&" + params.toString(), "_blank");
    modal.classList.add("hidden");
  };
}

// Upload prescription button
document.getElementById("upload-prescription").onclick = ()=>{
  modalBody.innerHTML = `<h3>Upload Prescription</h3>
    <input id="pres-file" type="file" accept="image/*,application/pdf" /><br><br>
    <label>Your phone: <input id="pres-phone" type="text" /></label><br><br>
    <button id="send-pres" class="btn primary">Send via WhatsApp (quick)</button>`;
  document.getElementById("send-pres")?.addEventListener("click", ()=>{
    const phone = document.getElementById("pres-phone").value || "9413604420";
    // we cannot auto-upload from static site — so open whatsapp with message asking user to attach file
    const msg = `Hi, I want to place an order. My contact: ${phone}. I will attach prescription.`;
    window.open(`https://wa.me/919413604420?text=${encodeURIComponent(msg)}`,"_blank");
    modal.classList.add("hidden");
  });
  modal.classList.remove("hidden");
};

// floating order btn
document.getElementById("floating-order-btn").onclick = ()=> {
  // open product list modal or generic order modal
  modalBody.innerHTML = `<h3>Quick Order</h3>
    <p>Select product from main page then click order — or use WhatsApp below.</p>
    <a class="btn primary" href="https://wa.me/919413604420" target="_blank">Order on WhatsApp</a>`;
  modal.classList.remove("hidden");
};

// year
document.getElementById("year").innerText = new Date().getFullYear();
