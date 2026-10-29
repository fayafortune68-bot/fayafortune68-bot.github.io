
"use strict";

/* =========================================
   1. SÉLECTION DES ÉLÉMENTS
========================================= */

const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const header = document.querySelector(".header");

const typingText = document.getElementById("typing-text");
const contactForm = document.getElementById("contact-form");
const formNotice = document.getElementById("form-notice");


/* =========================================
   2. MENU MOBILE
========================================= */

function closeMobileMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Ouvrir le menu");

    menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", String(isOpen));

        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fermer le menu" : "Ouvrir le menu"
        );

        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';

    });

    // Fermer le menu après un clic sur un lien
    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", closeMobileMenu);

    });

    // Fermer le menu avec la touche Échap
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape") {
            closeMobileMenu();
        }

    });

    // Réinitialiser le menu si la fenêtre devient large
    window.addEventListener("resize", () => {

        if (window.innerWidth > 760) {
            closeMobileMenu();
        }

    });

}


/* =========================================
   3. NAVIGATION AU DÉFILEMENT
========================================= */

function updateHeader() {

    if (!header) return;

    header.classList.toggle("scrolled", window.scrollY > 30);

}

window.addEventListener("scroll", updateHeader, {
    passive: true
});

updateHeader();


/* =========================================
   4. ANIMATION DU TEXTE D'ACCUEIL
========================================= */

if (typingText) {

    const words = [
        "Intelligence Artificielle",
        "Big Data",
        "développement informatique",
        "technologies innovantes"
    ];

    let wordIndex = 0;
    let characterIndex = 0;

    let deleting = false;
    let typingTimer;

    function typeEffect() {

        const currentWord = words[wordIndex];

        if (deleting) {

            characterIndex--;

        } else {

            characterIndex++;

        }

        typingText.textContent = currentWord.slice(
            0,
            characterIndex
        );

        let delay = deleting ? 35 : 75;

        if (!deleting && characterIndex === currentWord.length) {

            deleting = true;
            delay = 1500;

        } else if (deleting && characterIndex === 0) {

            deleting = false;

            wordIndex = (wordIndex + 1) % words.length;

            delay = 350;

        }

        typingTimer = window.setTimeout(typeEffect, delay);

    }

    // Respecter les préférences de réduction des animations
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (reducedMotion.matches) {

        typingText.textContent = words[0];

    } else {

        typingText.textContent = "";

        typingTimer = window.setTimeout(typeEffect, 500);

        reducedMotion.addEventListener("change", (event) => {

            if (event.matches) {

                window.clearTimeout(typingTimer);
                typingText.textContent = words[0];

            } else {

                characterIndex = 0;
                wordIndex = 0;
                deleting = false;

                window.clearTimeout(typingTimer);

                typingTimer = window.setTimeout(typeEffect, 500);

            }

        });

    }

}


/* =========================================
   5. APPARITION PROGRESSIVE DES SECTIONS
========================================= */

const revealElements = document.querySelectorAll(".reveal");

const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
);

if ("IntersectionObserver" in window && !motionPreference.matches) {

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("visible");

                    observer.unobserve(entry.target);

                }

            });

        },
        {
            threshold: 0.12,
            rootMargin: "0px 0px -35px 0px"
        }
    );

    revealElements.forEach((element) => {

        revealObserver.observe(element);

    });

} else {

    // Solution de secours pour les anciens navigateurs
    revealElements.forEach((element) => {

        element.classList.add("visible");

    });

}


/* =========================================
   6. SECTION ACTIVE DANS LA NAVIGATION
========================================= */

const sections = document.querySelectorAll("main section[id]");
const navigationLinks = document.querySelectorAll(".nav-link");

if ("IntersectionObserver" in window) {

    const sectionObserver = new IntersectionObserver(
        (entries) => {

            entries.forEach((entry) => {

                if (!entry.isIntersecting) return;

                const currentId = entry.target.id;

                navigationLinks.forEach((link) => {

                    const isActive =
                        link.getAttribute("href") === `#${currentId}`;

                    link.classList.toggle("active", isActive);

                });

            });

        },
        {
            rootMargin: "-30% 0px -60% 0px"
        }
    );

    sections.forEach((section) => {

        sectionObserver.observe(section);

    });

}


/* =========================================
   7. ANNÉE AUTOMATIQUE
========================================= */

const currentYear = document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent = new Date().getFullYear();

}


/* =========================================
   8. LIENS TEMPORAIRES
========================================= */

document.querySelectorAll(".placeholder-link").forEach((link) => {

    link.addEventListener("click", (event) => {

        const href = link.getAttribute("href");

        // Éviter qu'un lien temporaire renvoie en haut de page
        if (href === "#") {

            event.preventDefault();

            if (formNotice) {

                formNotice.textContent =
                    "Personnalise ce lien avant de publier ton portfolio.";

            }

        }

    });

});


/* =========================================
   9. FORMULAIRE DE CONTACT
========================================= */

if (contactForm && formNotice) {

    contactForm.addEventListener("submit", (event) => {

        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();

        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        /*
         * IMPORTANT :
         * Remplace cette adresse par ton véritable email.
         */
        const recipient = "contact@example.com";

        if (recipient === "contact@example.com") {

            formNotice.textContent =
                "Configure ton adresse email dans index.html et script.js avant d'utiliser le formulaire.";

            return;

        }

        const emailSubject = encodeURIComponent(subject);

        const emailBody = encodeURIComponent(
            `Bonjour FAYA Naka Fortune,\n\n` +
            `Nom : ${name}\n` +
            `Email : ${email}\n\n` +
            `Message :\n${message}\n\n` +
            `Envoyé depuis ton portfolio.`
        );

        const mailtoLink =
            `mailto:${recipient}` +
            `?subject=${emailSubject}` +
            `&body=${emailBody}`;

        formNotice.textContent =
            "Ouverture de votre application email...";

        window.location.href = mailtoLink;

    });

}


/* =========================================
   10. CONSOLE DE DÉVELOPPEMENT
========================================= */

console.log(
    "%cBienvenue sur le portfolio de FAYA Naka Fortune !",
    "color: #a78bfa; font-size: 15px; font-weight: bold;"
);

console.log(
    "Étudiante en Génie informatique | Intelligence Artificielle & Big Data"
);

