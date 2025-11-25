/* -----------------------------------
    PRODUCT DETAILS PAGE - product.js
------------------------------------ */

let CART = JSON.parse(localStorage.getItem("CART") || "[]");

function saveCart(){
    localStorage.setItem("CART", JSON.stringify(CART));
}

// GET URL PARAMS
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");
const category = urlParams.get("cat");

// Load product detail
async function loadProduct() {
    let file = "";

    if (category === "generic") file = "products/generic.json";
    else if (category === "ethical") file = "products/ethical.json";
    else if (category === "otc") file = "products/otc.json";
    else if (category === "ayurvedic") file = "products/ayurvedic.json";
    else if (category === "daily") file = "products/daily.json";
    else file = "products/generic.json";

    let res = await fetch(file);
    let data = await res.json();

    let p = data.find(x => x.id === productId);

    if (!p) {
        document.getElementById("product-box").innerHTML =
            "<h2>Product not found</h2>";
        return;
    }

    document.getElementById("product-box").innerHTML = `
        <img src="${p.image}" style="width:100%;border-radius:10px;margin-bottom:15px;">

        <h2>${p.name}</h2>

        <p class="price">₹${p.price}</p>

        <p style="margin:12px 0;">${p.description}</p>

        <button onclick="addProdToCart('${p.id}','${category}')" 
            style="padding:10px;width:100%;background:#007bff;border:none;color:white;border-radius:8px;">
            Add to Cart
        </button>

        <button onclick="buyNow('${p.name}',${p.price})"
            style="padding:10px;width:100%;background:green;border:none;color:white;border-radius:8px;margin-top:10px;">
            Buy Now on WhatsApp
        </button>
    `;
}

// Add product to cart
async function addProdToCart(id, cat) {

    let file = `products/${cat}.json`;
    let res = await fetch(file);
    let data = await res.json();
    let prod = data.find(x => x.id === id);

    let exist = CART.find(x => x.id === id);

    if (exist) exist.qty += 1;
    else CART.push({ ...prod, qty: 1 });

    saveCart();
    alert("Added to cart!");
}

// Buy Now (WhatsApp)
function buyNow(name, price){
    window.location.href =
        `https://wa.me/919413604420?text=I want to order: ${name} - ₹${price}`;
}

loadProduct();
