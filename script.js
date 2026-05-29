// REVEAL SCROLL

const reveals = document.querySelectorAll(".reveal");

window.addEventListener("scroll", () => {

    reveals.forEach(el => {

        const top = el.getBoundingClientRect().top;

        if(top < window.innerHeight - 100){

            el.classList.add("active");

        }

    });

});

// HEADER EFECTO

window.addEventListener("scroll",()=>{

    const header =
    document.getElementById("header");

    if(window.scrollY > 50){

        header.style.background =
        "rgba(0,0,0,.85)";

    }
    else{

        header.style.background =
        "rgba(0,0,0,.5)";

    }

});

// PARTICULAS

const particles =
document.getElementById("particles");

for(let i=0;i<80;i++){

    const p =
    document.createElement("div");

    p.style.position="absolute";

    p.style.width="3px";
    p.style.height="3px";

    p.style.borderRadius="50%";

    p.style.background="#3b82f6";

    p.style.left=
    Math.random()*100+"%";

    p.style.top=
    Math.random()*100+"%";

    p.style.opacity=.5;

    p.style.animation=
    `float ${5+Math.random()*10}s infinite`;

    particles.appendChild(p);

}

const style =
document.createElement("style");

style.innerHTML=`

@keyframes float{

0%{
transform:translateY(0px);
}

50%{
transform:translateY(-50px);
}

100%{
transform:translateY(0px);
}

}

`;

document.head.appendChild(style);
