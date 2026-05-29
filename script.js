/* ===================================
   MENU AL HACER SCROLL
=================================== */

const header =
document.getElementById("header");

window.addEventListener("scroll", () => {

    if(window.scrollY > 50){

        header.classList.add("scrolled");

    }
    else{

        header.classList.remove("scrolled");

    }

});

/* ===================================
   REVEAL ANIMATION
=================================== */

const reveals =
document.querySelectorAll(".reveal");

function revealElements(){

    reveals.forEach(element => {

        const windowHeight =
        window.innerHeight;

        const elementTop =
        element.getBoundingClientRect().top;

        const visible =
        120;

        if(elementTop < windowHeight - visible){

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
   CONTADORES ANIMADOS
=================================== */

const counters =
document.querySelectorAll(".counter");

let counterStarted = false;

function startCounters(){

    if(counterStarted) return;

    const stats =
    document.querySelector(".stats");

    if(!stats) return;

    const top =
    stats.getBoundingClientRect().top;

    if(top < window.innerHeight){

        counterStarted = true;

        counters.forEach(counter => {

            const target =
            parseInt(
            counter.dataset.target
            );

            let current = 0;

            const increment =
            Math.ceil(target / 100);

            const timer =
            setInterval(() => {

                current += increment;

                if(current >= target){

                    counter.textContent =
                    target + "+";

                    clearInterval(timer);

                }
                else{

                    counter.textContent =
                    current;

                }

            },20);

        });

    }

}

window.addEventListener(
"scroll",
startCounters
);

window.addEventListener(
"load",
startCounters
);

/* ===================================
   PARALLAX HERO
=================================== */

const heroGlow =
document.querySelector(".hero-glow");

window.addEventListener("scroll", () => {

    if(!heroGlow) return;

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

if(particles){

    for(let i=0;i<120;i++){

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

        particle.classList.add("particle");

        particles.appendChild(
        particle
        );

    }

}

/* ===================================
   SMOOTH MENU LINKS
=================================== */

document
.querySelectorAll('a[href^="#"]')
.forEach(anchor => {

    anchor.addEventListener(
    "click",
    function(e){

        e.preventDefault();

        const target =
        document.querySelector(
        this.getAttribute("href")
        );

        if(!target) return;

        window.scrollTo({

            top:
            target.offsetTop - 80,

            behavior:"smooth"

        });

    });

});

/* ===================================
   MENU MOVIL
=================================== */

const mobileButton =
document.querySelector(
".mobile-menu"
);

const nav =
document.querySelector("nav");

if(mobileButton){

    mobileButton.addEventListener(
    "click",
    () => {

        nav.classList.toggle(
        "mobile-open"
        );

    });

}

/* ===================================
   EFECTO 3D TARJETAS
=================================== */

const cards =
document.querySelectorAll(
".card"
);

cards.forEach(card => {

    card.addEventListener(
    "mousemove",
    e => {

        const rect =
        card.getBoundingClientRect();

        const x =
        e.clientX - rect.left;

        const y =
        e.clientY - rect.top;

        const rotateY =
        ((x / rect.width) - 0.5) * 12;

        const rotateX =
        ((y / rect.height) - 0.5) * -12;

        card.style.transform =
        `
        perspective(1000px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        translateY(-8px)
        `;

    });

    card.addEventListener(
    "mouseleave",
    () => {

        card.style.transform =
        "";

    });

});

/* ===================================
   EFECTO MAQUINA DE ESCRIBIR
=================================== */

const heroTitle =
document.querySelector(
".hero h1"
);

if(heroTitle){

    const text =
    heroTitle.innerText;

    heroTitle.innerText = "";

    let index = 0;

    function typeWriter(){

        if(index < text.length){

            heroTitle.innerText +=
            text.charAt(index);

            index++;

            setTimeout(
            typeWriter,
            30
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

document.body.appendChild(
topButton
);

window.addEventListener(
"scroll",
() => {

    if(window.scrollY > 500){

        topButton.classList.add(
        "show"
        );

    }
    else{

        topButton.classList.remove(
        "show"
        );

    }

});

topButton.addEventListener(
"click",
() => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/* ===================================
   CARGA COMPLETA
=================================== */

window.addEventListener(
"load",
() => {

    document.body.classList.add(
    "loaded"
    );

});
