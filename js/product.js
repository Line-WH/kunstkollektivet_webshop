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
    updateProductMeta(product);

    setText("#product-category", product.category);
    setText("#product-title", product.title);
    setText("#product-artist", `Af ${product.artist}`);
    setText("#product-description", product.description);
    setText("#product-artist-description", product.artistDescription);
    setText("#product-materials", product.materials);

    const addToCartButton = document.querySelector("#add-to-cart-button");

    if (addToCartButton) {
        addToCartButton.setAttribute(
            "aria-label",
            `Læg ${product.title} af ${product.artist} i kurven`
        );
    }

    renderGallery(product);
}

function updateProductMeta(product) {
    const title = `${product.title} af ${product.artist} | KunstKollektivet`;
    const description = createProductDescription(product);
    const url = `${window.location.origin}${window.location.pathname}?slug=${encodeURIComponent(product.slug)}`;
    const imageUrl = product.images?.[0]?.src
        ? new URL(product.images[0].src, window.location.href).href
        : `${window.location.origin}/images/og-image.jpg`;

    document.title = title;

    setMetaContent("#meta-description", description);
    setMetaContent("#og-title", title);
    setMetaContent("#og-description", description);
    setMetaContent("#og-url", url);
    setMetaContent("#og-image", imageUrl);

    const canonicalLink = document.querySelector("#canonical-link");

    if (canonicalLink) {
        canonicalLink.setAttribute("href", url);
    }
}

function createProductDescription(product) {
    const fallback = `Se ${product.title} af ${product.artist} hos KunstKollektivet. Vælg størrelse, papirtype og ramme.`;

    if (!product.description) {
        return fallback;
    }

    const shortDescription = product.description.trim();

    if (shortDescription.length <= 150) {
        return `${shortDescription} Se printet hos KunstKollektivet.`;
    }

    return `${shortDescription.slice(0, 147).trim()}...`;
}

function renderGallery(product) {
    const carouselInner = document.querySelector("#product-carousel-inner");
    const carouselIndicators = document.querySelector("#product-carousel-indicators");

    if (!carouselInner || !carouselIndicators) {
        return;
    }

    const mediaItems = getProductMediaItems(product);

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
        const isActive = index === 0;
        const activeClass = isActive ? "active" : "";
        const ariaCurrent = isActive ? `aria-current="true"` : "";

        carouselIndicators.insertAdjacentHTML(
            "beforeend",
            `
                <button
                    type="button"
                    data-bs-target="#productMediaCarousel"
                    data-bs-slide-to="${index}"
                    class="${activeClass}"
                    ${ariaCurrent}
                    aria-label="Vis ${mediaItem.label}"
                ></button>
            `
        );

        if (mediaItem.type === "video") {
            carouselInner.insertAdjacentHTML(
                "beforeend",
                `
                    <div class="carousel-item ${activeClass}">
                        <video
                            class="product-carousel__media"
                            controls
                            autoplay
                            loop
                            muted
                            playsinline
                            preload="metadata"
                            aria-label="${mediaItem.alt}"
                        >
                            <source src="${mediaItem.src}" type="${mediaItem.mimeType}">
                            Din browser understøtter ikke video.
                        </video>
                    </div>
                `
            );

            return;
        }

        carouselInner.insertAdjacentHTML(
            "beforeend",
            `
                <div class="carousel-item ${activeClass}">
                    <img
                        src="${mediaItem.src}"
                        class="product-carousel__media"
                        alt="${mediaItem.alt}"
                        loading="${index === 0 ? "eager" : "lazy"}"
                    >
                </div>
            `
        );
    });
}

function getProductMediaItems(product) {
    const mediaItems = [];

    const videos = Array.isArray(product.videos)
        ? product.videos
        : product.video
            ? [product.video]
            : [];

    videos.forEach((video, index) => {
        mediaItems.push({
            type: "video",
            src: video.src,
            mimeType: video.type || "video/mp4",
            alt: video.label || `Video af ${product.title}`,
            label: video.label || `video ${index + 1} af ${product.title}`
        });
    });

    (product.images || []).forEach((image, index) => {
        mediaItems.push({
            type: "image",
            src: image.src,
            alt: image.alt || `${product.title} af ${product.artist}`,
            label: `billede ${index + 1} af ${product.title}`
        });
    });

    return mediaItems;
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

    const sizePrice = Number(selectedSize.dataset.price) || 0;
    const framePrice = Number(selectedFrame.dataset.priceModifier) || 0;

    const totalPrice = sizePrice + framePrice;

    priceElement.textContent = `${totalPrice} kr.`;
}

function showProductNotFound() {
    document.title = "Produktet blev ikke fundet | KunstKollektivet";

    setMetaContent(
        "#meta-description",
        "Produktet blev ikke fundet hos KunstKollektivet."
    );

    const mainContent = document.querySelector("#main-content");

    if (!mainContent) {
        return;
    }

    mainContent.innerHTML = `
        <section class="container py-5" aria-labelledby="product-not-found-title">
            <p class="section-eyebrow">Produkt</p>
            <h1 id="product-not-found-title">Produktet blev ikke fundet</h1>
            <p>Det ser ud til, at produktet ikke findes eller er blevet fjernet.</p>
            <a href="shop.html" class="btn btn-is text-rust">Tilbage til shoppen</a>
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
        imageAlt: product.images?.[0]?.alt || `${product.title} af ${product.artist}`
    };
}

function getSelectedOption(selector) {
    const select = document.querySelector(selector);

    if (!select) {
        return {
            value: "",
            label: "",
            option: {}
        };
    }

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

function setText(selector, value) {
    const element = document.querySelector(selector);

    if (!element) {
        return;
    }

    element.textContent = value || "";
}

function setMetaContent(selector, value) {
    const element = document.querySelector(selector);

    if (!element || !value) {
        return;
    }

    element.setAttribute("content", value);
}