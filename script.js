document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       HERO AUTO SLIDER
    ========================================= */

    const heroScroll = document.querySelector(".hero-scroll");
    const heroes = document.querySelectorAll(".hero");

    let currentSlide = 0;
    let autoSlide;

    function goToSlide(index) {
        heroScroll.scrollTo({
            left: heroes[index].offsetLeft,
            behavior: "smooth"
        });
    }

    function nextSlide() {
        currentSlide++;
        if (currentSlide >= heroes.length) {
            currentSlide = 0;
        }
        goToSlide(currentSlide);
    }

    function startSlider() {
        autoSlide = setInterval(nextSlide, 5000);
    }

    function stopSlider() {
        clearInterval(autoSlide);
    }

    startSlider();

    heroScroll.addEventListener("mouseenter", stopSlider);
    heroScroll.addEventListener("mouseleave", startSlider);


    /* =========================================
       KEYBOARD HERO CONTROL
    ========================================= */

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            nextSlide();
        }
        if (e.key === "ArrowLeft") {
            currentSlide--;
            if (currentSlide < 0) {
                currentSlide = heroes.length - 1;
            }
            goToSlide(currentSlide);
        }
    });


    /* =========================================
       ACTIVE NAVIGATION LINK
    ========================================= */

    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");
        });
    });


    /* =========================================
       MOBILE MENU AUTO CLOSE
    ========================================= */

    const menuToggle = document.getElementById("menu-toggle");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                menuToggle.checked = false;
            }
        });
    });


    /* =========================================
       LANGUAGE DROPDOWN (MOBILE FRIENDLY)
    ========================================= */

    const langBtn = document.querySelector(".lang-btn");
    const langMenu = document.querySelector(".lang-menu");

    if (langBtn && langMenu) {
        langBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            langMenu.style.display = langMenu.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", () => {
            langMenu.style.display = "none";
        });
    }


    /* =========================================
       MOVIE CARD INTERACTION
    ========================================= */

    const movieCards = document.querySelectorAll(".movie-card");

    movieCards.forEach(card => {
        card.addEventListener("click", () => {
            card.animate(
                [
                    { transform: "scale(1)" },
                    { transform: "scale(0.96)" },
                    { transform: "scale(1)" }
                ],
                { duration: 250 }
            );
        });
    });


    /* =========================================
       SMOOTH BACK TO TOP
    ========================================= */

    const backToTop = document.querySelector(".footer-top a");

    if (backToTop) {
        backToTop.addEventListener("click", (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }


    /* =========================================
       NAVBAR SCROLL EFFECT
    ========================================= */

    const navbar = document.querySelector(".navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 80) {
            navbar.style.position = "sticky";
            navbar.style.top = "0";
            navbar.style.zIndex = "10000";
            navbar.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
        } else {
            navbar.style.boxShadow = "none";
        }
    });


    /* =========================================
       LAZY LOAD IMAGES
    ========================================= */

    const images = document.querySelectorAll("img");
    images.forEach(img => {
        img.loading = "lazy";
    });


    /* =========================================
       HERO MANUAL SWIPE TRACKING
    ========================================= */

    heroScroll.addEventListener("scroll", () => {
        const slideWidth = window.innerWidth;
        currentSlide = Math.round(heroScroll.scrollLeft / slideWidth);
    });


    /* =========================================
       IMAGE LOAD FADE-IN EFFECT
       FIX: Check if already loaded to avoid stuck opacity:0
    ========================================= */

    images.forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            // Image already loaded (e.g. from cache) — show immediately
            img.style.opacity = "1";
        } else {
            img.style.opacity = "0";
            img.addEventListener("load", () => {
                img.style.transition = "opacity 0.5s ease";
                img.style.opacity = "1";
            });
            img.addEventListener("error", () => {
                img.style.opacity = "1"; // Show broken img icon rather than invisible
            });
        }
    });


    /* =========================================
       WISHLIST SYSTEM — init on page load
    ========================================= */

    initWishlist();

});


/* =========================================
   SEARCH FUNCTIONALITY
========================================= */

const searchInput = document.getElementById("searchInput");

if (searchInput) {
    searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();

        document.querySelectorAll(".movie-card").forEach(card => {
            const nameEl = card.querySelector("span");
            if (!nameEl) return;
            const movieName = nameEl.innerText.toLowerCase();
            card.style.display = movieName.includes(searchValue) ? "" : "none";
        });
    });
}


/* =========================================
   WISHLIST — state
========================================= */

let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

function saveWishlist() {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
}


/* =========================================
   WISHLIST — update counter badge
========================================= */

function updateWishlistCount() {
    const countEl = document.getElementById("wishlistCount");
    if (countEl) countEl.textContent = wishlist.length;
}


/* =========================================
   WISHLIST — render dropdown items
========================================= */

function renderWishlistDropdown() {
    const body = document.getElementById("wishlistMovies");
    if (!body) return;

    body.innerHTML = "";

    if (wishlist.length === 0) {
        body.innerHTML = `<p class="wishlist-empty-msg">No movies in your wishlist yet ❤️</p>`;
        return;
    }

    // Build a lookup: name → img src from all source cards
    const cardMap = {};
    document.querySelectorAll(".movies-section .movie-card").forEach(card => {
        const nameEl = card.querySelector("span");
        const imgEl  = card.querySelector("img");
        if (!nameEl || !imgEl) return;
        cardMap[nameEl.innerText.trim()] = imgEl.src;
    });

    wishlist.forEach(movieName => {
        const imgSrc = cardMap[movieName] || "";

        const item = document.createElement("div");
        item.className = "wishlist-item";
        item.innerHTML = `
            <img src="${imgSrc}" alt="${movieName}">
            <span class="wishlist-item-name">${movieName}</span>
            <button class="wishlist-remove-btn" title="Remove">✕</button>
        `;

        item.querySelector(".wishlist-remove-btn").addEventListener("click", () => {
            removeFromWishlist(movieName);
        });

        body.appendChild(item);
    });
}


/* =========================================
   WISHLIST — remove helper + card sync
========================================= */

function removeFromWishlist(movieName) {
    wishlist = wishlist.filter(m => m !== movieName);
    saveWishlist();
    updateWishlistCount();
    renderWishlistDropdown();
    syncCardButton(movieName, false);
}

function syncCardButton(movieName, isActive) {
    document.querySelectorAll(".movies-section .movie-card").forEach(card => {
        const nameEl = card.querySelector("span");
        if (!nameEl || nameEl.innerText.trim() !== movieName) return;
        const btn = card.querySelector(".wishlist-btn");
        if (!btn) return;
        btn.innerHTML  = isActive ? "❤️" : "🤍";
        isActive ? btn.classList.add("active") : btn.classList.remove("active");
    });
}


/* =========================================
   WISHLIST — bind each card's heart button
========================================= */

function bindWishlistButton(button) {
    const card = button.closest(".movie-card");
    const nameEl = card.querySelector("span");
    if (!nameEl) return;

    const movieName = nameEl.innerText.trim();

    // Sync initial state from persisted wishlist
    if (wishlist.includes(movieName)) {
        button.innerHTML = "❤️";
        button.classList.add("active");
    } else {
        button.innerHTML = "🤍";
        button.classList.remove("active");
    }

    button.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (wishlist.includes(movieName)) {
            wishlist = wishlist.filter(m => m !== movieName);
            button.innerHTML = "🤍";
            button.classList.remove("active");
        } else {
            wishlist.push(movieName);
            button.innerHTML = "❤️";
            button.classList.add("active");
        }

        saveWishlist();
        updateWishlistCount();
        renderWishlistDropdown();
    });
}


/* =========================================
   WISHLIST — init: dropdown + all cards
========================================= */

function initWishlist() {
    // Bind every card's heart button
    document.querySelectorAll(".movie-card .wishlist-btn").forEach(bindWishlistButton);

    // Set count badge and populate dropdown from localStorage
    updateWishlistCount();
    renderWishlistDropdown();

    // Dropdown toggle
    const wishlistLink     = document.getElementById("wishlistLink");
    const wishlistDropdown = document.getElementById("wishlistDropdown");
    const wrapper          = document.getElementById("wishlistNavWrapper");

    if (wishlistLink && wishlistDropdown) {
        wishlistLink.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            wishlistDropdown.classList.toggle("open");
        });

        // Close on outside click
        document.addEventListener("click", (e) => {
            if (wrapper && !wrapper.contains(e.target)) {
                wishlistDropdown.classList.remove("open");
            }
        });
    }

    // Clear all button inside dropdown header
    const clearBtn = document.getElementById("clearWishlist");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => {
            wishlist = [];
            localStorage.removeItem("wishlist");
            updateWishlistCount();
            renderWishlistDropdown();
            document.querySelectorAll(".movie-card .wishlist-btn").forEach(btn => {
                btn.innerHTML = "🤍";
                btn.classList.remove("active");
            });
        });
    }
}
