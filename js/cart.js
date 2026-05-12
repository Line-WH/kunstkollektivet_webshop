document.addEventListener('DOMContentLoaded', (event) => {
    renderCart();
});

function renderCart() {
    const cartItemsContainer = document.querySelector('#cart-items');
    const cartEmpty = document.querySelector('#cart-empty');
    const cartActions = document.querySelector('.cart-action');

    const cart = getCart();

    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartEmpty.classList.remove('d-none');
        cartActions.classList.add('d-none');
        return;
    }

    cartEmpty.classList.add('d-none');
    cartActions.classList.remove('d-none');

    cart.forEach(item => {
        const cartItem = createCartItem(item);
        cartItemsContainer.appendChild(cartItem);
    });
}

function createCartItem(item) {
    const wrapper = document.createElement('article');
    wrapper.className = "cart-item card border-0";

    wrapper.innerHTML = `
        <div class="card-body p-3">
                <div class="row g-3 align-items-center">
                    <div class="col-4">
                        <img
                            src="${item.image.src}"
                            alt="${item.image.alt}"
                            class="img-fluid rounded cart-item__image"
                        >
                    </div>
    
                    <div class="col-8">
                        <div class="d-flex justify-content-between gap-2">
                            <div>
                                <h2 class="h6 mb-1">${item.title}</h2>
                                <p class="small mb-2">${item.artist}</p>
                            </div>
    
                            <button
                                class="btn btn-sm border-0"
                                type="button"
                                aria-label="Fjern ${item.title} fra kurven"
                                data-remove="${item.slug}"
                            >
                                ×
                            </button>
                        </div>
    
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center gap-2">
                                <button
                                    class="btn btn-sm btn-outline-primary rounded-circle"
                                    type="button"
                                    data-decrease="${item.slug}"
                                    aria-label="Fjern én ${item.title}"
                                >
                                    -
                                </button>
    
                                <span>${item.quantity}</span>
    
                                <button
                                    class="btn btn-sm btn-outline-primary rounded-circle"
                                    type="button"
                                    data-increase="${item.slug}"
                                    aria-label="Tilføj én ${item.title}"
                                >
                                    +
                                </button>
                            </div>
    
                            <p class="mb-0 fw-bold">${item.price * item.quantity} kr.</p>
                        </div>
                    </div>
                </div>
            </div>
    `;
    wrapper.querySelector("[data-remove]").addEventListener("click", () => {
        removeFromCart(item.slug);
        renderCart();
    });

    wrapper.querySelector("[data-decrease]").addEventListener("click", () => {
        updateQuantity(item.slug, item.quantity - 1);
        renderCart();
    });

    wrapper.querySelector("[data-increase]").addEventListener("click", () => {
        updateQuantity(item.slug, item.quantity + 1);
        renderCart();
    });

    return wrapper;
}