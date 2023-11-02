// Öncelikle, products adında bir ürün listesi oluşturun (data.js dosyasından alabilirsiniz).
import { products } from "./data.js";

const productContainer = document.querySelector(".product-container");
const cartContainer = document.querySelector(".cart-container");
const totalPrice = document.querySelector(".total-price");
let cart = []; // Alışveriş sepeti verilerini burada saklayacağız

// Ürünleri ana sayfada görüntüleme
products.forEach((product) => {
    let { id, name, price, imgSrc } = product;
    let productCard = generateProductCard(id, name, price, imgSrc);
    productContainer.innerHTML += productCard;
});

// Yardımcı işlev: Ürün kartları oluştur
function generateProductCard(id, name, price, imgSrc) {
    let productCard = `
        <div class="col">
            <div class="card" style="width: 18rem;">
                <img src="./images/${imgSrc}" class="card-img-top" alt="${name}">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <p class="card-text">Price: $${price}</p>
                    <button data-id=${id} class="btn btn-primary add-to-cart-btn">Add to cart</button>
                </div>
            </div>
        </div>`;
    return productCard;
}

// Tüm "Add to cart" düğmelerini alın ve sepete eklemek için işlevsellik ekleyin
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
    btn.onclick = (e) => {
        let id = e.target.getAttribute("data-id");
        let product = products.find((p) => p.id == id);

        if (product) {
            // Ürünü sepete ekleyin veya adetini artırın
            let cartItem = cart.find((item) => item.id == id);
            if (cartItem) {
                cartItem.quantity++;
            } else {
                cart.push({ id, product, quantity: 1 });
            }

            // Sepeti güncelleyin
            renderCart();
            updateCartCount();
        }
    };
});

// Alışveriş sepetini görüntülemek için işlev
function renderCart() {
    // Sepeti temizleyin
    cartContainer.innerHTML = "";
    let total = 0;

    // Sepetteki ürünleri görüntüle
    cart.forEach((cartItem) => {
        let { id, product, quantity } = cartItem;
        let cartItemHTML = `
        <div class="col d-flex gap-3">
            <p>${product.name}</p>
            <span>(${product.price})</span>
            <div class="d-flex">
                <button class="btn btn-light cart-btn decrease-btn" data-id=${id}>-</button>
                <div class="cart-count">${quantity}</div>
                <button class="btn btn-light cart-btn increase-btn" data-id=${id}>+</button>
            </div>
            <span class="delete-cart-item"><i class="bi bi-x delete-btn" data-id=${id}></i></span>
            <span>$${product.price * quantity}</span>
        </div>`;
        cartContainer.innerHTML += cartItemHTML;

        total += product.price * quantity;
    });

    // Toplam fiyatı güncelleyin
    totalPrice.innerHTML = "Total price: $" + total;
}

cartContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('increase-btn')) {
        const id = target.getAttribute('data-id');
        const cartItem = cart.find((item) => item.id == id);
        if (cartItem) {
            cartItem.quantity++;
            renderCart();
        }
    } else if (target.classList.contains('decrease-btn')) {
        const id = target.getAttribute('data-id');
        const cartItem = cart.find((item) => item.id == id);
        if (cartItem && cartItem.quantity > 1) {
            cartItem.quantity--;
            renderCart();
        }
    } else if (target.classList.contains('delete-btn')) {
        const id = target.getAttribute('data-id');
        cart = cart.filter((item) => item.id != id);
        renderCart();
    }
});
function updateCartCount() {
    const cartCountElement = document.getElementById("cart-count");
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCountElement.textContent = count;
}

// Add event listener for the "Clear Cart" button
document.getElementById("clear-cart-btn").addEventListener("click", () => {
    // Clear the cart by resetting the cart array
    cart = [];
    
    // Update the cart container and total price
    renderCart();
    updateCartCount();
});


