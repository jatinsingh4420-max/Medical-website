/* -----------------------------------
   MAIN SITE ENGINE - app.js
   Health Hub Pharmacy (TATA 1mg style)
------------------------------------ */

// ------------------------------
// GLOBAL CART STORAGE
// ------------------------------
let CART = JSON.parse(localStorage.getItem("CART") || "[]");

// Save cart
function saveCart() {
    localStorage.setItem("CART", JSON.stringify(CART));
}

// Add item to cart
function addToCart(item) {
    let exist = CART.find(x => x.id === item.id);
    if (exist) exist.qty += 1;
    else CART.push({ ...item, qty: 1 });

    saveCart();
    alert("Added to cart!");
}

// ------------------------------
// LOAD FEATURED PRODUCTS
// ------------------------------
async function loadFeatured() {
    let res = await fetch("products/generic.json");
    let data = await res.json();

    let box = document.getElementById("home-products");

    data.slice(0, 8).forEach(p => {
        box.innerHTML += `
            <div class="product-card" onclick="openProduct('${p.id}','generic')">
                <img src="${p.image}" />
                <h3>${p.name}</h3>
                <p class="price">₹${p.price}</p>
            </div>
        `;
    });
}

// ------------------------------
// OPEN PRODUCT PAGE
// ------------------------------
function openProduct(id, cat) {
    window.location.href = `product.html?id=${id}&cat=${cat}`;
}

// ------------------------------
// SEARCH ON HOME PAGE
// ------------------------------
async function searchHome() {
    let q = document.getElementById("search").value.toLowerCase();

    let box = document.getElementById("home-products");
    box.innerHTML = "";

    let files = [
        "generic.json",
        "ethical.json",
        "otc.json",
        "ayurvedic.json",
        "daily.json"
    ];

    let allProducts = [];

    for (let f of files) {
        let res = await fetch("products/" + f);
        let data = await res.json();
        allProducts = allProducts.concat(data);
    }

    let filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(q)
    );

    filtered.forEach(p => {
        box.innerHTML += `
            <div class="product-card" onclick="openProduct('${p.id}','mixed')">
                <img src="${p.image}" />
                <h3>${p.name}</h3>
                <p class="price">₹${p.price}</p>
            </div>
        `;
    });
}

// ------------------------------
// LOAD CATEGORY PAGE
// ------------------------------
async function loadCategory(cat) {
    let res = await fetch(`products/${cat}.json`);
    let data = await res.json();

    let box = document.getElementById("category-products");

    data.forEach(p => {
        box.innerHTML += `
            <div class="product-card" onclick="openProduct('${p.id}','${cat}')">
                <img src="${p.image}" />
                <h3>${p.name}</h3>
                <p class="price">₹${p.price}</p>
            </div>
        `;
    });
}

// ------------------------------
// CART COUNT BADGE
// ------------------------------
function updateCartBadge() {
    let count = CART.reduce((a, b) => a + b.qty, 0);
    let icon = document.querySelector(".cart-btn");
    if (icon) icon.innerHTML = "🛒 (" + count + ")";
}

updateCartBadge();
