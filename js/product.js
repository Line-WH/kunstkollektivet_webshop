document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");

    const product = products.find((item) => item.slug === slug);

    if (!product) {
        showProductNotFound();
        return;
    }

    renderProduct(product);
    setupPriceUpdater();
    setupCarouselVideoPause();
    updatePrice();

    setupAddToCart(product);
    if (window.CartStorage) {
        window.CartStorage.updateCartCount();
    }
});

function renderProduct(product) {
    document.title = `${product.title} | KunstKollektivet`;

    document.querySelector("#product-category").textContent = product.category;
    document.querySelector("#product-title").textContent = product.title;
    document.querySelector("#product-artist").textContent = product.artist;
    document.querySelector("#product-description").textContent = product.description;
    document.querySelector("#product-artist-description").textContent = product.artistDescription;

    const materialsElement = document.querySelector("#product-materials");

    if (materialsElement) {
        materialsElement.textContent = product.materials;
    }

    renderGallery(product);
}

function renderGallery(product) {
    const carouselInner = document.querySelector("#product-carousel-inner");
    const carouselIndicators = document.querySelector("#product-carousel-indicators");

    if (!carouselInner || !carouselIndicators) {
        return;
    }

    const mediaItems = [];

    const videos = Array.isArray(product.videos)
        ? product.videos
        : product.video
            ? [product.video]
            : [];

    videos.forEach((video) => {
        mediaItems.push({
            type: "video",
            src: video.src,
            mimeType: video.type || "video/mp4",
            alt: video.label || `${product.title} video`
        });
    });

    (product.images || []).forEach((image) => {
        mediaItems.push({
            type: "image",
            src: image.src,
            alt: image.alt
        });
    });

    carouselInner.innerHTML = "";
    carouselIndicators.innerHTML = "";

    if (mediaItems.length === 0) {
        carouselInner.innerHTML = `
            <div class="carousel-item active">
                <div class="product-carousel__placeholder">
                    Billede mangler
                </div>
            </div>
        `;

        return;
    }

    mediaItems.forEach((mediaItem, index) => {
        const isActive = index === 0 ? "active" : "";
        const ariaCurrent = index === 0 ? `aria-current="true"` : "";

        carouselIndicators.innerHTML += `
            <button
                type="button"
                data-bs-target="#productMediaCarousel"
                data-bs-slide-to="${index}"
                class="${isActive}"
                ${ariaCurrent}
                aria-label="Vis medie ${index + 1}"
            ></button>
        `;

        if (mediaItem.type === "video") {
            carouselInner.innerHTML += `
        <div class="carousel-item ${isActive}">
            <video
                class="product-carousel__media"
                controls
                muted
                playsinline
                preload="metadata"
            >
                <source src="${mediaItem.src}" type="${mediaItem.mimeType}">
                Din browser understøtter ikke video.
            </video>
        </div>
    `;
        } else {
            carouselInner.innerHTML += `
                <div class="carousel-item ${isActive}">
                    <img
                        src="${mediaItem.src}"
                        class="product-carousel__media"
                        alt="${mediaItem.alt}"
                    >
                </div>
            `;
        }
    });
}

function setupCarouselVideoPause() {
    const productCarousel = document.querySelector("#productMediaCarousel");

    if (!productCarousel) {
        return;
    }

    productCarousel.addEventListener("slide.bs.carousel", () => {
        const videos = productCarousel.querySelectorAll("video");

        videos.forEach((video) => {
            video.pause();
        });
    });
}

function setupPriceUpdater() {
    const sizeSelect = document.querySelector("#product-size");
    const frameSelect = document.querySelector("#product-frame");

    if (!sizeSelect || !frameSelect) {
        return;
    }

    sizeSelect.addEventListener("change", updatePrice);
    frameSelect.addEventListener("change", updatePrice);
}

function updatePrice() {
    const sizeSelect = document.querySelector("#product-size");
    const frameSelect = document.querySelector("#product-frame");
    const priceElement = document.querySelector("#product-price");

    if (!sizeSelect || !frameSelect || !priceElement) {
        return;
    }

    const selectedSize = sizeSelect.options[sizeSelect.selectedIndex];
    const selectedFrame = frameSelect.options[frameSelect.selectedIndex];

    const sizePrice = Number(selectedSize.dataset.price);
    const framePrice = Number(selectedFrame.dataset.priceModifier);

    const totalPrice = sizePrice + framePrice;

    priceElement.textContent = `${totalPrice} kr`;
}

function showProductNotFound() {
    const mainContent = document.querySelector("#main-content");

    mainContent.innerHTML = `
        <section class="container py-5">
            <h1>Produktet blev ikke fundet</h1>
            <p>Det ser ud til, at produktet ikke findes eller er blevet fjernet.</p>
            <a href="shop.html" class="btn btn-primary">Tilbage til shoppen</a>
        </section>
    `;
}

function setupAddToCart(product) {
    const addToCartButton = document.querySelector("#add-to-cart-button");
    const feedbackElement = document.querySelector("#cart-feedback");

    if (!addToCartButton) {
        return;
    }

    addToCartButton.addEventListener("click", () => {
        if (!window.CartStorage) {
            console.error("CartStorage er ikke loaded. Tjek script-rækkefølgen.");
            return;
        }

        const cartItem = createCartItem(product);

        window.CartStorage.addItem(cartItem);

        showCartFeedback(feedbackElement, `${product.title} er lagt i kurven.`);
    });
}

function createCartItem(product) {
    const selectedSize = getSelectedOption("#product-size");
    const selectedPaper = getSelectedOption("#product-paper");
    const selectedFrame = getSelectedOption("#product-frame");

    const basePrice = Number(selectedSize.option.dataset.price) || 0;
    const framePrice = Number(selectedFrame.option.dataset.priceModifier) || 0;
    const totalPrice = basePrice + framePrice;

    return {
        id: `${product.slug}-${selectedSize.value}-${selectedPaper.value}-${selectedFrame.value}`,
        slug: product.slug,
        title: product.title,
        artist: product.artist,
        category: product.category,
        size: selectedSize.label,
        paper: selectedPaper.label,
        frame: selectedFrame.label,
        price: totalPrice,
        quantity: 1,
        image: product.images?.[0]?.src || "",
        imageAlt: product.images?.[0]?.alt || product.title
    };
}

function getSelectedOption(selector) {
    const select = document.querySelector(selector);
    const option = select.selectedOptions[0];

    return {
        value: select.value,
        label: option.textContent.trim(),
        option: option
    };
}

function showCartFeedback(feedbackElement, message) {
    if (!feedbackElement) {
        return;
    }

    feedbackElement.textContent = message;
    feedbackElement.classList.remove("d-none");
}