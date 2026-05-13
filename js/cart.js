document.addEventListener("DOMContentLoaded", () => {
    renderCart();

    if (window.CartStorage) {
        window.CartStorage.updateCartCount();
    }
});

function renderCart() {
    const cartItemsElement = document.querySelector("#cart-items");
    const cartTotalElement = document.querySelector("#cart-total");

    if (!cartItemsElement || !cartTotalElement) {
        console.error("Cart elements were not found in cart.html");
        return;
    }

    if (!window.CartStorage) {
        console.error("CartStorage is not loaded");
        return;
    }

    const cart = window.CartStorage.getCart();

    if (cart.length === 0) {
        cartItemsElement.innerHTML = `
            <div class="text-center py-5">
                <h2 class="h5">Din kurv er tom</h2>
                <p>Find et print du elsker, og læg det i kurven.</p>
                <a href="shop.html" class="btn btn-is rounded-5">
                    Gå til shoppen
                </a>
            </div>
        `;

        cartTotalElement.textContent = formatPrice(0);
        return;
    }

    cartItemsElement.innerHTML = cart
        .map((item) => createCartItemMarkup(item))
        .join("");

    cartTotalElement.textContent = formatPrice(window.CartStorage.getCartTotal());

    setupCartActions();
}

function createCartItemMarkup(item) {
    const lineTotal = item.price * item.quantity;

    return `
        <article class="card mb-3">
            <div class="row g-0 align-items-center">
                <div class="col-4 col-md-2">
                    <img
                        src="${item.image}"
                        alt="${item.imageAlt}"
                        class="img-fluid rounded-start"
                    >
                </div>

                <div class="col-8 col-md-10">
                    <div class="card-body">
                        <div class="d-flex justify-content-between gap-3">
                            <div>
                                <h2 class="h5 mb-1">${item.title}</h2>
                                <p class="mb-1">${item.artist}</p>

                                <p class="small mb-1">
                                    Størrelse: ${item.size}
                                </p>

                                <p class="small mb-1">
                                    Papir: ${item.paper}
                                </p>

                                <p class="small mb-2">
                                    Ramme: ${item.frame}
                                </p>

                                <p class="mb-1">
                                    Pris pr. stk.: ${formatPrice(item.price)}
                                </p>

                                <p class="fw-bold mb-0">
                                    I alt: ${formatPrice(lineTotal)}
                                </p>
                            </div>

                            <button
                                type="button"
                                class="btn btn-sm btn-outline-danger align-self-start"
                                data-remove-item="${item.id}"
                            >
                                Fjern
                            </button>
                        </div>

                        <div class="mt-3">
                            <label class="form-label">
                                Antal
                            </label>

                            <input
                                type="number"
                                class="form-control"
                                min="1"
                                value="${item.quantity}"
                                data-update-quantity="${item.id}"
                                style="max-width: 100px;"
                            >
                        </div>
                    </div>
                </div>
            </div>
        </article>
    `;
}

function setupCartActions() {
    const removeButtons = document.querySelectorAll("[data-remove-item]");
    const quantityInputs = document.querySelectorAll("[data-update-quantity]");

    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = button.dataset.removeItem;

            window.CartStorage.removeItem(id);
            renderCart();
        });
    });

    quantityInputs.forEach((input) => {
        input.addEventListener("change", () => {
            const id = input.dataset.updateQuantity;
            const quantity = Number(input.value);

            window.CartStorage.updateQuantity(id, quantity);
            renderCart();
        });
    });
}

function formatPrice(price) {
    return `${price.toLocaleString("da-DK")} kr.`;
}