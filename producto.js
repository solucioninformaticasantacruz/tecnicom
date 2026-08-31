"use strict";

const $ = id =>
    document.getElementById(id);


document.addEventListener(
    "DOMContentLoaded",
    cargarProducto
);


async function cargarProducto() {

    const slug =
        new URLSearchParams(
            location.search
        )
        .get(
            "slug"
        );

    if (!slug) {
        $("productStatus").textContent =
            "Producto no especificado.";
        return;
    }

    try {
        const producto =
            await TECNICOM_API.getProductoMercado(
                slug
            );

        if (!producto) {
            throw new Error(
                "Producto no encontrado."
            );
        }

        $("productStatus").hidden =
            true;

        $("productDetail").hidden =
            false;

        $("productName").textContent =
            producto.nombre || "";

        $("productCategory").textContent =
            producto.categoria || "";

        $("productPrice").textContent =
            precio(
                producto.precio
            );

        $("productDescription").textContent =
            producto.descripcion_larga ||
            producto.descripcion ||
            "";

        $("productSeller").textContent =
            producto.negocio_nombre
                ? `Vendido por ${producto.negocio_nombre}`
                : "";

        const plan =
            String(
                producto.plan ||
                "basico"
            )
            .trim()
            .toLowerCase();

        configurarNivelVendedor(
            plan
        );

        configurarImagen(
            producto
        );

        configurarAccionPrincipal(
            producto,
            plan
        );

    } catch (error) {
        console.error(error);

        $("productStatus").textContent =
            "No fue posible cargar este producto.";
    }
}


function configurarNivelVendedor(
    plan
) {

    const nivel =
        $("productSellerLevel");

    if (!nivel) {
        return;
    }

    const esFull =
        plan === "full";

    nivel.textContent =
        esFull
            ? "Tienda Online"
            : "Emprendedor";

    nivel.className =
        `seller-level ${
            esFull
                ? "seller-level-full"
                : "seller-level-basic"
        }`;
}


function configurarImagen(
    producto
) {

    const imagen =
        $("productImage");

    if (!imagen) {
        return;
    }

    if (!producto.imagen) {
        imagen.hidden =
            true;
        return;
    }

    imagen.hidden =
        false;

    imagen.src =
        media(
            producto.imagen
        );

    imagen.alt =
        producto.nombre ||
        "Producto";
}


function configurarAccionPrincipal(
    producto,
    plan
) {

    const accion =
        $("productPrimaryAction");

    const estado =
        $("productContactStatus");

    if (!accion) {
        return;
    }

    accion.hidden =
        true;

    accion.removeAttribute(
        "target"
    );

    accion.removeAttribute(
        "rel"
    );

    accion.className =
        "btn";

    if (estado) {
        estado.hidden =
            true;
        estado.textContent =
            "";
    }

    /* =====================================================
       EMPRENDEDOR / BÁSICO
       No tiene tienda propia. El botón contacta directamente
       al WhatsApp del emprendedor.
    ====================================================== */
    if (plan === "basico") {

        const whatsapp =
            producto.negocio_whatsapp ||
            producto.negocio_telefono ||
            "";

        if (!whatsapp) {
            if (estado) {
                estado.hidden =
                    false;
                estado.textContent =
                    "Este emprendedor todavía no tiene un WhatsApp de contacto publicado.";
            }
            return;
        }

        accion.href =
            crearUrlWhatsApp(
                whatsapp,
                `Hola, vi el producto ${producto.nombre || "publicado"} en La Tiendita de Mercado Santa Cruz y quisiera consultar por él.`
            );

        accion.textContent =
            "Contactar por WhatsApp";

        accion.classList.add(
            "btn-whatsapp"
        );

        accion.target =
            "_blank";

        accion.rel =
            "noopener noreferrer";

        accion.hidden =
            false;

        return;
    }

    /* =====================================================
       TIENDA ONLINE / FULL
       Sí tiene tienda independiente.
    ====================================================== */
    if (
        plan === "full" &&
        producto.negocio_slug
    ) {
        accion.href =
            `tienda.html?slug=${encodeURIComponent(producto.negocio_slug)}`;

        accion.textContent =
            "Ver tienda online";

        accion.hidden =
            false;
    }
}


function crearUrlWhatsApp(
    numero,
    mensaje = ""
) {

    let limpio =
        String(numero || "")
            .replace(/\D/g, "");

    if (!limpio) {
        return "#";
    }

    if (
        limpio.length === 9 &&
        limpio.startsWith("9")
    ) {
        limpio =
            `56${limpio}`;
    }

    return `https://wa.me/${limpio}${
        mensaje
            ? `?text=${encodeURIComponent(mensaje)}`
            : ""
    }`;
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
