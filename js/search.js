document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#search-form");
    const input = document.querySelector("#search-input");
    const resultsContainer = document.querySelector("#search-results");
    const summary = document.querySelector("#search-summary");

    if (!form || !input || !resultsContainer || !summary) {
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialQuery = params.get("q") || "";

    input.value = initialQuery;
    renderSearchResults(initialQuery);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const query = input.value.trim();
        const newUrl = query
            ? `search.html?q=${encodeURIComponent(query)}`
            : "search.html";

        window.history.pushState({}, "", newUrl);
        renderSearchResults(query);
    });

    function renderSearchResults(query) {
        resultsContainer.innerHTML = "";

        if (!query.trim()) {
            summary.textContent = "Indtast et søgeord for at finde prints.";
            return;
        }

        const results = searchProducts(query);

        if (results.length === 0) {
            summary.textContent = `Ingen resultater for "${query}".`;
            return;
        }

        summary.textContent = `${results.length} resultat${results.length === 1 ? "" : "er"} for "${query}".`;

        results.forEach((product) => {
            resultsContainer.appendChild(createSearchResultCard(product));
        });
    }
});

function searchProducts(query) {
    const searchTerms = normalizeSearchText(query)
        .split(" ")
        .filter(Boolean);

    return products.filter((product) => {
        const searchableText = normalizeSearchText([
            product.title,
            product.artist,
            product.category,
            product.description,
            product.artistDescription,
            product.materials,
            ...(product.tags || [])
        ].join(" "));

        return searchTerms.every((term) => searchableText.includes(term));
    });
}

function normalizeSearchText(text) {
    return String(text || "")
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replaceAll("æ", "ae")
        .replaceAll("ø", "oe")
        .replaceAll("å", "aa");
}

function createSearchResultCard(product) {
    const column = document.createElement("div");
    column.className = "col-12 col-md-6 col-lg-4";

    const firstImage = product.images?.[0];
    const imageSrc = firstImage?.src || "images/placeholder.jpg";
    const imageAlt = firstImage?.alt || product.title;

    const priceText = product.price
        ? `${product.price} kr.`
        : "";

    column.innerHTML = `
        <a
            href="product.html?slug=${encodeURIComponent(product.slug)}"
            class="shop-card"
            aria-label="Se produktet ${product.title}"
        >
            <div class="shop-card__image-wrap">
                <img
                    src="${imageSrc}"
                    alt="${imageAlt}"
                    class="shop-card__image"
                >
            </div>

            <div class="shop-card__body">
                <h2 class="shop-card__title">${product.title}</h2>
                <p class="shop-card__artist">${product.artist}</p>
                ${priceText ? `<p class="shop-card__price">${priceText}</p>` : ""}
            </div>
        </a>
    `;

    return column;
}