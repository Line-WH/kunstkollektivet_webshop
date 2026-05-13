document.addEventListener("DOMContentLoaded", () => {
    renderConfirmationOrder();

    if (window.CartStorage) {
        window.CartStorage.clearCart();
        window.CartStorage.updateCartCount();
    }
});

function renderConfirmationOrder() {
    const orderItemsElement = document.querySelector("#confirmation-order-items");
    const subtotalElement = document.querySelector("#confirmation-subtotal");
    const shippingElement = document.querySelector("#confirmation-shipping");
    const totalElement = document.querySelector("#confirmation-total");

    if (!orderItemsElement || !subtotalElement || !shippingElement || !totalElement) {
        console.error("Confirmation elements were not found.");
        return;
    }

    const order = getLatestOrder();

    if (!order || !Array.isArray(order.items) || order.items.length === 0) {
        renderMissingOrder(orderItemsElement, subtotalElement, shippingElement, totalElement);
        return;
    }

    orderItemsElement.innerHTML = order.items
        .map((item) => createConfirmationOrderItemMarkup(item))
        .join("");

    subtotalElement.textContent = formatPrice(order.subtotal || 0);
    shippingElement.textContent = order.shipping === 0 ? "gratis" : formatPrice(order.shipping || 0);
    totalElement.textContent = formatPrice(order.total || 0);
}

function getLatestOrder() {
    const order = sessionStorage.getItem("kunstkollektivet_latest_order");

    if (!order) {
        return null;
    }

    try {
        return JSON.parse(order);
    } catch (error) {
        console.error("Ordren kunne ikke læses:", error);
        return null;
    }
}

function createConfirmationOrderItemMarkup(item) {
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

function renderMissingOrder(orderItemsElement, subtotalElement, shippingElement, totalElement) {
    orderItemsElement.innerHTML = `
        <div class="checkout-order__empty">
            <p>Vi kunne ikke finde en aktiv ordre.</p>
        </div>
    `;

    subtotalElement.textContent = formatPrice(0);
    shippingElement.textContent = "gratis";
    totalElement.textContent = formatPrice(0);
}

function formatPrice(price) {
    return `${price.toLocaleString("da-DK")} kr.`;
}