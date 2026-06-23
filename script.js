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

            navLinks.forEach(item =>
                item.classList.remove("active")
            );

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

            if (langMenu.style.display === "block") {
                langMenu.style.display = "none";
            } else {
                langMenu.style.display = "block";
            }
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
                {
                    duration: 250
                }
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

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
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
            navbar.style.boxShadow =
                "0 4px 20px rgba(0,0,0,0.5)";

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

        currentSlide = Math.round(
            heroScroll.scrollLeft / slideWidth
        );
    });


    /* =========================================
       IMAGE LOAD FADE-IN EFFECT
    ========================================= */

    images.forEach(img => {

        img.style.opacity = "0";

        img.addEventListener("load", () => {

            img.style.transition =
                "opacity 0.5s ease";

            img.style.opacity = "1";
        });
    });

});