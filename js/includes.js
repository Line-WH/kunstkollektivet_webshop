async function loadPartial(selector, file) {
    const element = document.querySelector(selector);

    if (!element) return;

    try {
        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Could not load ${file}`);
        }

        element.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll("[data-nav-link]");

    navLinks.forEach((link) => {
        const linkPage = link.getAttribute("href");

        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

function initHeaderScrollState() {
    const header = document.querySelector(".site-header");
    const swapImages = document.querySelectorAll(".js-header-swap-img");

    if (!header) {
        return;
    }

    function updateHeaderOnScroll() {
        const isScrolled = window.scrollY > 10;

        header.classList.toggle("site-header--scrolled", isScrolled);

        swapImages.forEach((img) => {
            const defaultSrc = img.dataset.srcDefault;
            const scrolledSrc = img.dataset.srcScrolled;

            if (!defaultSrc || !scrolledSrc) {
                return;
            }

            img.src = isScrolled ? scrolledSrc : defaultSrc;
        });
    }

    updateHeaderOnScroll();
    window.addEventListener("scroll", updateHeaderOnScroll);
}

async function initPartials() {
    await Promise.all([
        loadPartial("#site-header", "partials/header.html"),
        loadPartial("#site-footer", "partials/footer.html"),
    ]);

    setActiveNavLink();
    initHeaderScrollState();

    if (window.CartStorage) {
        window.CartStorage.updateCartCount();
    }
}

initPartials();
