
"use strict";

const $ = id =>
    document.getElementById(id);

let productos = [];


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        try {

            productos =
                await TECNICOM_API.getProductosMercado(
                    100
                );

            if (
                !Array.isArray(productos)
            ) {

                productos = [];
            }

            render(
                productos
            );

        } catch (error) {

            console.error(
                error
            );

            $("productStatus").textContent =
                "No fue posible cargar los productos.";
        }


        $("productSearchButton")
            ?.addEventListener(
                "click",
                filtrar
            );

        $("productSearch")
            ?.addEventListener(
                "input",
                filtrar
            );
    }
);


function normalizarPlan(plan) {

    const valor =
        String(
            plan ||
            "basico"
        )
        .trim()
        .toLowerCase();

    return valor === "full"
        ? "full"
        : "basico";
}


function nombreNivel(plan) {

    return normalizarPlan(plan) === "full"
        ? "Tienda Online"
        : "Emprendedor";
}


function filtrar() {

    const q =
        $("productSearch")
            ?.value
            .trim()
            .toLowerCase() ||
        "";

    render(
        productos.filter(
            producto =>
                `${
                    producto.nombre || ""
                } ${
                    producto.categoria || ""
                } ${
                    producto.negocio_nombre || ""
                }`
                .toLowerCase()
                .includes(q)
        )
    );
}


function render(items) {

    const grid =
        $("productGrid");

    const estado =
        $("productStatus");

    if (
        !grid ||
        !estado
    ) {

        return;
    }

    grid.innerHTML =
        "";

    estado.hidden =
        items.length > 0;

    if (
        !items.length
    ) {

        estado.textContent =
            "No hay productos para mostrar.";

        return;
    }


    items.forEach(
        producto => {

            const enlace =
                document.createElement(
                    "a"
                );

            enlace.className =
                "card";

            enlace.href =
                `producto.html?slug=${encodeURIComponent(producto.slug || "")}`;

            enlace.style.textDecoration =
                "none";


            const nivel =
                nombreNivel(
                    producto.plan
                );

            const nivelClase =
                normalizarPlan(
                    producto.plan
                ) === "full"
                    ? "seller-level-full"
                    : "seller-level-basic";


            enlace.innerHTML =
                `${
                    producto.imagen
                        ? `<img src="${media(producto.imagen)}" alt="${esc(producto.nombre || "Producto")}">`
                        : ""
                }
                <div class="card-body">
                    <span class="seller-level ${nivelClase}">${esc(nivel)}</span>
                    <p class="muted">${esc(producto.categoria || "Producto")}</p>
                    <h3>${esc(producto.nombre || "")}</h3>
                    <p class="price">${precio(producto.precio)}</p>
                    <p class="muted">Vendido por ${esc(producto.negocio_nombre || "")}</p>
                </div>`;


            grid.appendChild(
                enlace
            );
        }
    );
}


function media(valor) {

    return /^https?:/i.test(valor)
        ? valor
        : `https://www.carnesdiaz.cl/${String(valor).replace(/^\/+/, "")}`;
}


function precio(valor) {

    const numero =
        Number(valor);

    return Number.isFinite(numero)
        ? new Intl.NumberFormat(
            "es-CL",
            {
                style: "currency",
                currency: "CLP",
                maximumFractionDigits: 0
            }
        ).format(numero)
        : "";
}


function esc(valor) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        valor;

    return div.innerHTML;
}
