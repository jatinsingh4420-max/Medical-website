// load products.json and render
const API = "products.json"; // local file in repo root
let PRODUCTS = [];

const list = document.getElementById("product-list");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");
const modalClose = document.getElementById("modal-close");

modalClose.onclick = ()=>modal.classList.add("hidden");

function fetchProducts(){
  fetch(API).then(r=>r.json()).then(data=>{
    PRODUCTS = data;
    renderProducts(PRODUCTS);
  }).catch(err=>{
    list.innerHTML = "<p style='color:#b00'>Error loading products.json. Make sure file exists in repo root.</p>";
  });
}

function renderProducts(arr){
  list.innerHTML = "";
  if(!arr.length){ list.innerHTML = "<p>No products found.</p>"; return; }
  arr.forEach(p=>{
    const el = document.createElement("div");
    el.className = "card";
    el.innerHTML = `
      <h3>${p.name}</h3>
      <p>${p.desc || ""}</p>
      <div><span class="price">₹${p.price}</span> ${p.offer? `<span class="offer">${p.offer}% OFF</span>` : ""}</div>
      <div class="actions">
        <button class="btn primary order-now" data-id="${p.id}">Order</button>
        <button class="btn" data-id="${p.id}" onclick="addToCart('${p.id}')">Add to cart</button>
      </div>`;
    list.appendChild(el);
  });

  document.querySelectorAll(".order-now").forEach(b=>{
    b.addEventListener("click", e=>{
      openOrderModal(e.target.dataset.id);
    });
  });
}

function addToCart(id){
  alert("Added to cart (demo). Use Order to place recent order via WhatsApp or form.");
}

// search & sort
document.getElementById("search-btn").onclick = applyFilters;
searchInput.onkeyup = (e)=>{ if(e.key === "Enter") applyFilters(); };
sortSelect.onchange = applyFilters;

function applyFilters(){
  const q = searchInput.value.trim().toLowerCase();
  let filtered = PRODUCTS.filter(p=>{
    return p.name.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q)) || String(p.price).includes(q);
  });
  const sort = sortSelect.value;
  if(sort === "price-asc") filtered.sort((a,b)=>a.price-b.price);
  if(sort === "price-desc") filtered.sort((a,b)=>b.price-a.price);
  renderProducts(filtered);
}

// modal order
function openOrderModal(pid){
  const p = PRODUCTS.find(x=>x.id===pid);
  modalBody.innerHTML = `
    <h3>Order: ${p.name}</h3>
    <label>Qty: <input id="mqty" type="number" value="1" min="1"/></label><br><br>
    <label>Name: <input id="mname" type="text"/></label><br><br>
    <label>Phone: <input id="mphone" type="text"/></label><br><br>
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
    const base = "https://docs.google.com/forms/d/e/1FAIpQLSfI-oVq-HHuqNOYqR_SXlM56MsiBW_30Fpum5h3MTkEqHlSTQ/viewform?usp=pp_url";
    const params = new URLSearchParams();
    params.set("entry.1967942519", p.name);
    params.set("entry.1010592062", document.getElementById("mqty").value);
    params.set("entry.1724801920", document.getElementById("mname").value);
    params.set("entry.682598387", document.getElementById("mphone").value);
    params.set("entry.951409499", document.getElementById("maddr").value);
    window.open(base + "&" + params.toString(), "_blank");
    modal.classList.add("hidden");
  };
}

// upload prescription (opens modal with quick WA flow)
document.getElementById("upload-prescription").onclick = ()=>{
  modalBody.innerHTML = `<h3>Upload Prescription</h3>
    <p>From phone: click WhatsApp button & attach your photo. Or use Google Form to upload file (if form has file upload).</p>
    <label>Your phone: <input id="pres-phone" type="text" /></label><br><br>
    <button id="send-pres" class="btn primary">Open WhatsApp (attach file)</button>`;
  document.getElementById("send-pres").onclick = ()=>{
    const phone = document.getElementById("pres-phone").value || "";
    const msg = `Hello, I want to upload prescription. Contact: ${phone}`;
    window.open(`https://wa.me/919413604420?text=${encodeURIComponent(msg)}`,"_blank");
    modal.classList.add("hidden");
  };
  modal.classList.remove("hidden");
};

// floating order btn
document.getElementById("floating-order-btn").onclick = ()=>{
  modalBody.innerHTML = `<h3>Quick Order</h3><p>Use product Order button or click WhatsApp to place order.</p><a class="btn primary" href="https://wa.me/919413604420" target="_blank">Order on WhatsApp</a>`;
  modal.classList.remove("hidden");
};

document.getElementById("year").innerText = new Date().getFullYear();

fetchProducts();
