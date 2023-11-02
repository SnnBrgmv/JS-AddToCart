import { products } from "./data.js";

const productContainer = document.querySelector(".product-container");
const cartContainer = document.querySelector(".cart-container");
const totalPrice = document.querySelector(".total-price");
let cart = [];

// Create product cards for each product
products.forEach((product) => {
    let { id, name, price, imgSrc } = product;
    let productCard = generateProductCard(id, name, price, imgSrc);
    productContainer.innerHTML += productCard;
});

// Function to generate a product card HTML
function generateProductCard(id, name, price, imgSrc) {
    let productCard = `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="./images/${imgSrc}" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text fs-6">Price: $${price}</p>
                    <button data-id=${id} class="btn btn-primary add-to-cart-btn">Add to cart</button>
                </div>
            </div>
        </div>`;
    return productCard;
}

// Load the cart from localStorage when the page is loaded
window.addEventListener('load', () => {
    const storedCart = JSON.parse(localStorage.getItem('cart'));
    if (storedCart) {
        cart = storedCart;
        renderCart();
        updateCartCount();
    }
});

// Function to update the cart in localStorage
function updateLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Add-to-cart button click event listeners
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.onclick = (e) => {
        let id = e.target.getAttribute("data-id");
        let product = products.find((p) => p.id == id);

        if (product) {

            let cartItem = cart.find((item) => item.id == id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ id, product, quantity: 1 });
            }

            renderCart();
            updateCartCount();
            updateLocalStorage();
        }
    };
});

// Function to render the cart
function renderCart() {

    cartContainer.innerHTML = "";
    let total = 0;


    cart.forEach((cartItem) => {
        let { id, product, quantity } = cartItem;
        let cartItemHTML = `
        <div class="col w-100 d-flex gap-3 justify-content-between">
            <div class="product-name d-flex justify-content-center align-items-center fs-6"><span>${product.name}</span></div>
            <div class="product-price d-flex justify-content-center align-items-center"><span>(${product.price})</span></div>
            <div class="product-quantity d-flex justify-content-center align-items-center">
                <button class="btn btn-light cart-btn decrease-btn" data-id=${id}>-</button>
                <div class="cart-count">${quantity}</div>
                <button class="btn btn-light cart-btn increase-btn" data-id=${id}>+</button>
            </div>
            <div class="product-delete d-flex justify-content-center align-items-center"><span class="delete-cart-item p-3"><i class="bi bi-x delete-btn" data-id=${id}></i></span></div>
            <div class="product-total d-flex justify-content-center align-items-center"><span>$${(product.price * quantity).toFixed(2)}</span></div>
        </div>`;
        cartContainer.innerHTML += cartItemHTML;

        total += product.price * quantity;
    });

    totalPrice.innerHTML = `Total price: <span class="fw-normal">$${total.toFixed(2)}</span>`;
}

// Click event listener for the cart items
cartContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('increase-btn')) {
        const id = target.getAttribute('data-id');
        const cartItem = cart.find((item) => item.id == id);
        if (cartItem) {
            cartItem.quantity++;
            renderCart();
        }
        updateCartCount();
    } else if (target.classList.contains('decrease-btn')) {
        const id = target.getAttribute('data-id');
        const cartItem = cart.find((item) => item.id == id);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            renderCart();
        }
        updateCartCount();
    } else if (target.classList.contains('delete-btn')) {
        const id = target.getAttribute('data-id');
        cart = cart.filter((item) => item.id != id);
        renderCart();
        updateCartCount();
    }
});

// Function to update the cart count
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
}

// Click event listener for clearing the cart
document.getElementById("clear-cart-btn").addEventListener("click", () => {
    cart = [];
    renderCart();
    updateCartCount();
    updateLocalStorage();
});


