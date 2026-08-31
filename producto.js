
"use strict";

const $ = id =>
    document.getElementById(id);


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const slug =
            new URLSearchParams(
                location.search
            )
            .get(
                "slug"
            );

        if (
            !slug
        ) {

            $("productStatus").textContent =
                "Producto no especificado.";

            return;
        }


        try {

            const producto =
                await TECNICOM_API.getProductoMercado(
                    slug
                );

            if (
                !producto
            ) {

                throw new Error(
                    "Producto no encontrado."
                );
            }


            $("productStatus").hidden =
                true;

            $("productDetail").hidden =
                false;

            $("productName").textContent =
                producto.nombre ||
                "";

            $("productCategory").textContent =
                producto.categoria ||
                "";

            $("productPrice").textContent =
                precio(
                    producto.precio
                );

            $("productDescription").textContent =
                producto.descripcion ||
                "";

            $("productSeller").textContent =
                producto.negocio_nombre
                    ? `Vendido por ${producto.negocio_nombre}`
                    : "";


            const nivel =
                $("productSellerLevel");

            if (
                nivel
            ) {

                const esFull =
                    String(
                        producto.plan ||
                        "basico"
                    )
                    .toLowerCase() ===
                    "full";

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


            if (
                producto.imagen
            ) {

                $("productImage").src =
                    media(
                        producto.imagen
                    );

                $("productImage").alt =
                    producto.nombre ||
                    "Producto";
            }


            if (
                producto.negocio_slug
            ) {

                $("productStore").href =
                    `tienda.html?slug=${encodeURIComponent(producto.negocio_slug)}`;

                $("productStore").textContent =
                    "Ver tienda online";

            } else {

                $("productStore").hidden =
                    true;
            }

        } catch (error) {

            console.error(
                error
            );

            $("productStatus").textContent =
                "No fue posible cargar este producto.";
        }
    }
);


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
