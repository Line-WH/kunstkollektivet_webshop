window.CartStorage = (() => {
    const CART_KEY = "kunstkollektivet_cart";

    function getCart() {
        const cart = sessionStorage.getItem(CART_KEY);

        if (!cart) {
            return [];
        }

        try {
            return JSON.parse(cart);
        } catch (error) {
            console.error("Kurven kunne ikke læses:", error);
            return [];
        }
    }

    function saveCart(cart) {
        sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
        updateCartCount();
    }

    function addItem(item) {
        const cart = getCart();

        const existingItem = cart.find((cartItem) => {
            return cartItem.id === item.id;
        });

        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            cart.push(item);
        }

        saveCart(cart);
    }

    function removeItem(id) {
        const updatedCart = getCart().filter((item) => {
            return item.id !== id;
        });

        saveCart(updatedCart);
    }

    function updateQuantity(id, quantity) {
        const cart = getCart();

        const item = cart.find((cartItem) => {
            return cartItem.id === id;
        });

        if (!item) {
            return;
        }

        item.quantity = quantity;

        if (item.quantity <= 0) {
            removeItem(id);
            return;
        }

        saveCart(cart);
    }

    function clearCart() {
        saveCart([]);
    }

    function getCartTotal() {
        return getCart().reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }

    function getCartCount() {
        return getCart().reduce((total, item) => {
            return total + item.quantity;
        }, 0);
    }

    function updateCartCount() {
        const cartCountElement = document.querySelector("#cart-count");

        if (!cartCountElement) {
            return;
        }

        const count = getCartCount();

        cartCountElement.textContent = count;
        cartCountElement.classList.toggle("d-none", count === 0);
    }

    return {
        getCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        updateCartCount
    };
})();