/* ===================================
   HEADER AL HACER SCROLL
=================================== */

const header = document.getElementById("header");

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }

});


/* ===================================
   REVEAL ANIMATION
=================================== */

const reveals = document.querySelectorAll(".reveal");

function revealElements() {

    reveals.forEach(element => {

        const windowHeight = window.innerHeight;

        const elementTop =
            element.getBoundingClientRect().top;

        const visible = 120;

        if (elementTop < windowHeight - visible) {
            element.classList.add("active");
        }

    });

}

window.addEventListener(
    "scroll",
    revealElements
);

window.addEventListener(
    "load",
    revealElements
);


/* ===================================
   PARALLAX HERO
=================================== */

const heroGlow =
    document.querySelector(".hero-glow");

window.addEventListener("scroll", () => {

    if (!heroGlow) return;

    const scroll =
        window.pageYOffset;

    heroGlow.style.transform =
        `translateY(${scroll * 0.25}px)`;

});


/* ===================================
   PARTICULAS
=================================== */

const particles =
    document.getElementById("particles");

if (particles) {

    for (let i = 0; i < 120; i++) {

        const particle =
            document.createElement("span");

        const size =
            Math.random() * 4 + 1;

        particle.style.width =
            size + "px";

        particle.style.height =
            size + "px";

        particle.style.left =
            Math.random() * 100 + "%";

        particle.style.top =
            Math.random() * 100 + "%";

        particle.style.animationDuration =
            (Math.random() * 20 + 10) + "s";

        particle.style.animationDelay =
            (Math.random() * 10) + "s";

        particle.classList.add(
            "particle"
        );

        particles.appendChild(
            particle
        );

    }

}


/* ===================================
   SMOOTH SCROLL
=================================== */

document
    .querySelectorAll('a[href^="#"]')
    .forEach(anchor => {

        anchor.addEventListener(
            "click",
            function (e) {

                const href =
                    this.getAttribute("href");

                if (!href || href === "#") {
                    return;
                }

                const target =
                    document.querySelector(href);

                if (!target) return;

                e.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 80;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.pageYOffset -
                    headerHeight;

                window.scrollTo({

                    top: targetPosition,

                    behavior: "smooth"

                });

                /*
                   Si el menú móvil está abierto,
                   se cierra después de seleccionar
                   una opción.
                */

                if (nav) {
                    nav.classList.remove(
                        "mobile-open"
                    );
                }

            }
        );

    });


/* ===================================
   MENU MOVIL
=================================== */

const mobileButton =
    document.querySelector(".mobile-menu");

const nav =
    document.querySelector("nav");

if (mobileButton && nav) {

    mobileButton.addEventListener(
        "click",
        () => {

            nav.classList.toggle(
                "mobile-open"
            );

        }
    );

}


/* ===================================
   CERRAR MENU MOVIL AL REDIMENSIONAR
=================================== */

window.addEventListener(
    "resize",
    () => {

        if (
            window.innerWidth > 768 &&
            nav
        ) {

            nav.classList.remove(
                "mobile-open"
            );

        }

    }
);


/* ===================================
   EFECTO 3D TARJETAS
=================================== */

const cards =
    document.querySelectorAll(".card");

cards.forEach(card => {

    card.addEventListener(
        "mousemove",
        e => {

            /*
               En dispositivos táctiles
               evitamos el efecto 3D.
            */

            if (
                window.matchMedia(
                    "(hover: none)"
                ).matches
            ) {
                return;
            }

            const rect =
                card.getBoundingClientRect();

            const x =
                e.clientX - rect.left;

            const y =
                e.clientY - rect.top;

            const rotateY =
                ((x / rect.width) - 0.5) * 8;

            const rotateX =
                ((y / rect.height) - 0.5) * -8;

            card.style.transform =
                `
                perspective(1000px)
                rotateX(${rotateX}deg)
                rotateY(${rotateY}deg)
                translateY(-6px)
                `;

        }
    );

    card.addEventListener(
        "mouseleave",
        () => {

            card.style.transform = "";

        }
    );

});


/* ===================================
   EFECTO MAQUINA DE ESCRIBIR
=================================== */

const heroTitle =
    document.querySelector(".hero h1");

if (heroTitle) {

    const text =
        heroTitle.innerText.trim();

    heroTitle.innerText = "";

    let index = 0;

    function typeWriter() {

        if (index < text.length) {

            heroTitle.innerText +=
                text.charAt(index);

            index++;

            setTimeout(
                typeWriter,
                25
            );

        }

    }

    window.addEventListener(
        "load",
        typeWriter
    );

}


/* ===================================
   BOTON VOLVER ARRIBA
=================================== */

const topButton =
    document.createElement("button");

topButton.innerHTML = "↑";

topButton.id = "topButton";

topButton.setAttribute(
    "aria-label",
    "Volver arriba"
);

topButton.setAttribute(
    "title",
    "Volver arriba"
);

document.body.appendChild(
    topButton
);

window.addEventListener(
    "scroll",
    () => {

        if (window.scrollY > 500) {

            topButton.classList.add(
                "show"
            );

        } else {

            topButton.classList.remove(
                "show"
            );

        }

    }
);

topButton.addEventListener(
    "click",
    () => {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }
);


/* ===================================
   MARCAR OPCION ACTIVA DEL MENU
=================================== */

const sections =
    document.querySelectorAll(
        "section[id]"
    );

const menuLinks =
    document.querySelectorAll(
        'nav a[href^="#"]'
    );

function updateActiveMenu() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        const sectionHeight =
            section.offsetHeight;

        if (
            window.pageYOffset >= sectionTop &&
            window.pageYOffset <
            sectionTop + sectionHeight
        ) {

            currentSection =
                section.getAttribute("id");

        }

    });

    menuLinks.forEach(link => {

        link.classList.remove(
            "active"
        );

        if (
            link.getAttribute("href") ===
            "#" + currentSection
        ) {

            link.classList.add(
                "active"
            );

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveMenu
);

window.addEventListener(
    "load",
    updateActiveMenu
);


/* ===================================
   CARGA COMPLETA
=================================== */

window.addEventListener(
    "load",
    () => {

        document.body.classList.add(
            "loaded"
        );

        revealElements();

    }
);
