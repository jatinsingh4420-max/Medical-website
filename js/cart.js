/* -----------------------------------
    CART LOGIC  -  cart.js
------------------------------------ */

let CART = JSON.parse(localStorage.getItem("CART") || "[]");

// Save cart
function updateCart() {
    localStorage.setItem("CART", JSON.stringify(CART));
    loadCart();
}

// Load Cart Items on cart.html
function loadCart() {
    let box = document.getElementById("cart-box");
    let totalBox = document.getElementById("total-box");

    if (!CART.length) {
        box.innerHTML = "<h3>Your cart is empty 🛒</h3>";
        totalBox.innerHTML = "Total: ₹0";
        return;
    }

    box.innerHTML = "";
    let total = 0;

    CART.forEach((item, i) => {
        let itemTotal = item.qty * item.price;
        total += itemTotal;

        box.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                <div style="flex:1;">
                    <h3>${item.name}</h3>
                    <p class="price">₹${item.price}</p>

                    <div class="qty-box">
                        <button onclick="decQty(${i})">-</button>
                        <span>${item.qty}</span>
                        <button onclick="incQty(${i})">+</button>
                    </div>
                </div>

                <button onclick="removeItem(${i})" 
                    style="background:red;color:white;border:none;padding:6px;border-radius:6px;">
                    Remove
                </button>
            </div>
        `;
    });

    totalBox.innerHTML = "Total: ₹" + total;
}

// Increase qty
function incQty(i) {
    CART[i].qty++;
    updateCart();
}

// Decrease qty
function decQty(i) {
    if (CART[i].qty > 1) CART[i].qty--;
    else CART.splice(i, 1);
    updateCart();
}

// Remove item
function removeItem(i) {
    CART.splice(i, 1);
    updateCart();
}

// Go to Checkout
function goCheckout() {
    if (CART.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    window.location.href = "checkout.html";
}

loadCart();
