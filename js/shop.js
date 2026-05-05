document.addEventListener("DOMContentLoaded", () => {
    const productGrid = document.querySelector("#product-grid");

    if (!productGrid) {
        return;
    }

    renderProductCards(productGrid);
});

function renderProductCards(productGrid) {
    productGrid.innerHTML = "";

    products.forEach((product) => {
        const productCard = createProductCard(product);
        productGrid.appendChild(productCard);
    });
}

function createProductCard(product) {
    const column = document.createElement("div");
    column.className = "col-6 col-md-4 col-lg-3";

    const firstImage = product.images[0];

    column.innerHTML = `
        <a
            href="product.html?slug=${encodeURIComponent(product.slug)}"
            class="shop-card"
            aria-label="Se produktet ${product.title}"
        >
            <div class="shop-card__image-wrap">
                <img
                    src="${firstImage.src}"
                    alt="${firstImage.alt}"
                    class="shop-card__image"
                >
            </div>

            <div class="shop-card__body">
                <h3 class="shop-card__title">
                    ${product.title}
                </h3>

                <p class="shop-card__artist">
                    ${product.artist}
                </p>

                <p class="shop-card__price">
                    Fra 400 kr
                </p>
            </div>
        </a>
    `;

    return column;
}