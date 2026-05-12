const CART_KEY = 'kk_cart';

function getCart() {
    const cart = localstorage.getItem(CART_KEY);

    if (!cart) {
        return [];
    }
    return JSON.parse(cart);
}

function saveCart() {
    localstorage.setItem(CART_KEY, JSON.stringify(cart));
}

function clearCart() {
    localStorage.removeItem(CART_KEY);
}

function addToCart(product) {
    const cart = getCart();
    const existingProduct = cart.find((item) => item.slug === product.slug);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            slug: product.slug,
            title: product.title,
            artist: product.artist,
            price: product.price,
            quantity: 1,
            image: product.image[0]
        });
    }

    saveCart(cart);
}

function removeFromCart(slug) {
    const cart = getCart().filter((item) => item.slug !== slug);
    saveCart(cart);
}

function updateQuantity(slug, quantity) {
    const cart = getCart();
    const product = cart.find((item) => item.slug === slug);

    if (!product) {
        return;
    }

    product.quantity = quantity;

    if (product.quantity <= 0) {
        removeFromCart(slug);
        return;
    }

    saveCart(cart);
}

function getCartSubtotal() {
    return getCart().reduce((total, item) => {
        return total + item.price * item.quantity;
    }, 0);

    function getShippinhPrice() {
        const cart = getCart();
        if (cart.length === 0) {
            return 0;
        }
        return 0; //gratis fragt for nu
    }

    function getCartTotal() {
        return getCartSubtotal() + getShippinhPrice();
    }
}

