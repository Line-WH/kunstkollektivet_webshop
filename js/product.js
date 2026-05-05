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

    if (product.video) {
        mediaItems.push({
            type: "video",
            src: product.video.src,
            mimeType: product.video.type,
            alt: product.video.label || `${product.title} video`
        });
    }

    product.images.forEach((image) => {
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