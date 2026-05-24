document.addEventListener("DOMContentLoaded", () => {
    renderCheckoutOrder();
    setupCheckoutForm();

    if (window.CartStorage) {
        window.CartStorage.updateCartCount();
    }
});

function renderCheckoutOrder() {
    const orderItemsElement = document.querySelector("#checkout-order-items");
    const subtotalElement = document.querySelector("#checkout-subtotal");
    const shippingElement = document.querySelector("#checkout-shipping");
    const totalElement = document.querySelector("#checkout-total");

    if (!orderItemsElement || !subtotalElement || !shippingElement || !totalElement) {
        console.error("Checkout order elements were not found.");
        return;
    }

    if (!window.CartStorage) {
        console.error("CartStorage is not loaded.");
        return;
    }

    const cart = window.CartStorage.getCart();

    if (cart.length === 0) {
        orderItemsElement.innerHTML = `
            <div class="checkout-order__empty">
                <p>Din kurv er tom.</p>
                <a href="shop.html" class="btn btn-is text-rust rounded-5">
                    Gå til shoppen
                </a>
            </div>
        `;

        subtotalElement.textContent = formatPrice(0);
        shippingElement.textContent = "gratis";
        totalElement.textContent = formatPrice(0);

        disableCheckoutForm();

        return;
    }

    orderItemsElement.innerHTML = cart
        .map((item) => createCheckoutOrderItemMarkup(item))
        .join("");

    const subtotal = window.CartStorage.getCartTotal();
    const shipping = 0;
    const total = subtotal + shipping;

    subtotalElement.textContent = formatPrice(subtotal);
    shippingElement.textContent = shipping === 0 ? "gratis" : formatPrice(shipping);
    totalElement.textContent = formatPrice(total);
}

function createCheckoutOrderItemMarkup(item) {
    const lineTotal = item.price * item.quantity;

    return `
        <article class="checkout-order__item">
            <div>
                <h3 class="checkout-order__item-title">
                    ${item.title}
                </h3>

                <p class="checkout-order__item-meta">
                    Antal: ${item.quantity}
                </p>
            </div>

            <p class="checkout-order__item-price">
                ${formatPrice(lineTotal)}
            </p>
        </article>
    `;
}

function setupCheckoutForm() {
    const checkoutForm = document.querySelector("#checkout-form");
    const feedbackElement = document.querySelector("#checkout-feedback");

    if (!checkoutForm) {
        return;
    }

    checkoutForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!checkoutForm.checkValidity()) {
            checkoutForm.reportValidity();
            return;
        }

        if (!window.CartStorage || window.CartStorage.getCart().length === 0) {
            showCheckoutFeedback(feedbackElement, "Din kurv er tom.");
            return;
        }

        const order = createFakeOrder();

        sessionStorage.setItem("kunstkollektivet_latest_order", JSON.stringify(order));

        window.location.href = "confirmation.html";
    });
}

function createFakeOrder() {
    return {
        orderNumber: createOrderNumber(),
        createdAt: new Date().toISOString(),
        items: window.CartStorage.getCart(),
        subtotal: window.CartStorage.getCartTotal(),
        shipping: 0,
        total: window.CartStorage.getCartTotal()
    };
}

function createOrderNumber() {
    const randomNumber = Math.floor(100000 + Math.random() * 900000);
    return `KK-${randomNumber}`;
}

function disableCheckoutForm() {
    const checkoutForm = document.querySelector("#checkout-form");

    if (!checkoutForm) {
        return;
    }

    const fields = checkoutForm.querySelectorAll("input, select, textarea, button");

    fields.forEach((field) => {
        field.disabled = true;
    });
}

function showCheckoutFeedback(feedbackElement, message) {
    if (!feedbackElement) {
        return;
    }

    feedbackElement.textContent = message;
    feedbackElement.classList.remove("d-none");
}

function formatPrice(price) {
    return `${price.toLocaleString("da-DK")} kr.`;
}