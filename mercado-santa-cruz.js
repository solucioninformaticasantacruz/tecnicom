"use strict";


document.addEventListener(
    "DOMContentLoaded",
    iniciarMercado
);


/* =========================================================
   ESTADO
========================================================= */

let mercadoItems = [];
let mercadoCategorias = [];

let categoriaSeleccionada = "todos";

const API_MEDIA_BASE =
    "https://www.carnesdiaz.cl/";


/* =========================================================
   ELEMENTOS
========================================================= */

const marketSearch =
    document.getElementById("marketSearch");

const marketSearchButton =
    document.getElementById("marketSearchButton");

const marketCategories =
    document.getElementById("marketCategories");

const marketFeatured =
    document.getElementById("marketFeatured");

const marketGrid =
    document.getElementById("marketGrid");

const marketStatus =
    document.getElementById("marketStatus");

const marketResultsCount =
    document.getElementById("marketResultsCount");

const marketEvents =
    document.getElementById("marketEvents");

const marketEventsSection =
    document.getElementById("marketEventsSection");

const marketDetailView =
    document.getElementById("marketDetailView");

const marketBackButton =
    document.getElementById("marketBackButton");

const marketMenuButton =
    document.getElementById("marketMenuButton");

const marketNav =
    document.getElementById("marketNav");


/* =========================================================
   INICIAR
========================================================= */

async function iniciarMercado() {

    configurarEventos();

    const parametros =
        new URLSearchParams(
            window.location.search
        );

    const slug =
        parametros.get("slug");

    if (slug) {

        await cargarDetalle(slug);

        return;
    }

    await cargarMercado();
}


/* =========================================================
   EVENTOS
========================================================= */

function configurarEventos() {

    marketSearch?.addEventListener(
        "input",
        filtrarMercado
    );

    marketSearchButton?.addEventListener(
        "click",
        filtrarMercado
    );


    marketBackButton?.addEventListener(
        "click",
        () => {

            history.pushState(
                {},
                "",
                "mercado-santa-cruz.html"
            );

            mostrarListado();
        }
    );


    marketMenuButton?.addEventListener(
        "click",
        () => {

            const abierto =
                marketNav.classList.toggle("open");

            marketMenuButton.setAttribute(
                "aria-expanded",
                abierto
                    ? "true"
                    : "false"
            );
        }
    );


    window.addEventListener(
        "popstate",
        manejarHistorial
    );
}


/* =========================================================
   CARGAR MERCADO
========================================================= */

async function cargarMercado() {

    try {

        mostrarEstado(
            "Cargando información..."
        );


        const resultados =
            await Promise.allSettled([
                TECNICOM_API.getMercado(),
                TECNICOM_API.getCategoriasMercado(),
                TECNICOM_API.getEventosMercado()
            ]);


        /* =============================================
           MERCADO
        ============================================== */

        if (
            resultados[0].status ===
            "fulfilled"
        ) {

            mercadoItems =
                normalizarArray(
                    resultados[0].value
                );

        } else {

            console.error(
                resultados[0].reason
            );

            mercadoItems = [];
        }


        /* =============================================
           CATEGORÍAS
        ============================================== */

        if (
            resultados[1].status ===
            "fulfilled"
        ) {

            mercadoCategorias =
                normalizarArray(
                    resultados[1].value
                );

        } else {

            console.error(
                resultados[1].reason
            );

            mercadoCategorias = [];
        }


        /* =============================================
           EVENTOS
        ============================================== */

        if (
            resultados[2].status ===
            "fulfilled"
        ) {

            renderEventos(
                normalizarArray(
                    resultados[2].value
                )
            );

        } else {

            console.error(
                resultados[2].reason
            );

            ocultarEventos();
        }


        renderCategorias();

        renderMercado(
            mercadoItems
        );


        ocultarEstado();


    } catch (error) {

        console.error(error);

        mostrarEstado(
            "No fue posible cargar Mercado Santa Cruz."
        );
    }
}


/* =========================================================
   NORMALIZAR RESPUESTA
========================================================= */

function normalizarArray(valor) {

    if (
        Array.isArray(valor)
    ) {

        return valor;
    }


    if (
        valor &&
        Array.isArray(valor.data)
    ) {

        return valor.data;
    }


    return [];
}


/* =========================================================
   CATEGORÍAS
========================================================= */

function renderCategorias() {

    if (!marketCategories) {
        return;
    }


    marketCategories.innerHTML = "";


    const todas =
        crearCategoria({
            nombre: "Todos",
            slug: "todos",
            descripcion:
                "Ver todos los comercios y servicios"
        });


    marketCategories.appendChild(
        todas
    );


    mercadoCategorias.forEach(
        categoria => {

            marketCategories.appendChild(
                crearCategoria(
                    categoria
                )
            );
        }
    );
}


/* =========================================================
   CREAR CATEGORÍA
========================================================= */

function crearCategoria(categoria) {

    const boton =
        document.createElement("button");


    boton.type = "button";

    boton.className =
        "market-category-card";


    const slug =
        categoria.slug ||
        slugificar(
            categoria.nombre || ""
        );


    if (
        slug ===
        categoriaSeleccionada
    ) {

        boton.classList.add(
            "active"
        );
    }


    boton.innerHTML = `
        <strong>
            ${escaparHTML(
                categoria.nombre || ""
            )}
        </strong>

        <span>
            ${escaparHTML(
                categoria.descripcion || ""
            )}
        </span>
    `;


    boton.addEventListener(
        "click",
        () => {

            categoriaSeleccionada =
                slug;

            renderCategorias();

            filtrarMercado();
        }
    );


    return boton;
}


/* =========================================================
   FILTRAR
========================================================= */

function filtrarMercado() {

    const busqueda =
        (
            marketSearch?.value || ""
        )
        .trim()
        .toLowerCase();


    const resultados =
        mercadoItems.filter(
            item => {

                const categoria =
                    slugificar(
                        item.categoria ||
                        item.categoria_slug ||
                        ""
                    );


                const coincideCategoria =
                    categoriaSeleccionada ===
                    "todos"

                    ||

                    categoria ===
                    categoriaSeleccionada;


                const texto = [
                    item.nombre,
                    item.titulo,
                    item.descripcion,
                    item.resumen,
                    item.categoria,
                    item.direccion
                ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();


                const coincideBusqueda =
                    !busqueda ||
                    texto.includes(
                        busqueda
                    );


                return (
                    coincideCategoria &&
                    coincideBusqueda
                );
            }
        );


    renderMercado(
        resultados
    );
}


/* =========================================================
   RENDER MERCADO
========================================================= */

function renderMercado(items) {

    if (!marketGrid) {
        return;
    }


    marketGrid.innerHTML = "";

    marketFeatured.innerHTML = "";


    if (
        marketResultsCount
    ) {

        marketResultsCount.textContent =
            `${items.length} resultado${
                items.length === 1
                    ? ""
                    : "s"
            }`;
    }


    if (
        items.length === 0
    ) {

        marketGrid.innerHTML = `
            <p class="market-empty">
                No encontramos resultados.
            </p>
        `;

        return;
    }


    const destacados =
        items.filter(
            item =>
                item.destacado == 1 ||
                item.destacado === true ||
                item.destacado === "1"
        );


    destacados
        .slice(0, 3)
        .forEach(
            item => {

                marketFeatured.appendChild(
                    crearTarjeta(item)
                );
            }
        );


    items.forEach(
        item => {

            marketGrid.appendChild(
                crearTarjeta(item)
            );
        }
    );
}


/* =========================================================
   CREAR TARJETA
========================================================= */

function crearTarjeta(item) {

    const tarjeta =
        document.createElement("article");


    tarjeta.className =
        "market-card";


    tarjeta.tabIndex = 0;


    const nombre =
        item.nombre ||
        item.titulo ||
        "Comercio";


    const imagen =
        resolverImagen(
            item.imagen ||
            item.imagen_portada
        );


    tarjeta.innerHTML = `

        <div class="market-card-image">

            ${
                imagen
                    ?
                    `
                    <img
                        src="${escaparAtributo(imagen)}"
                        alt="${escaparAtributo(nombre)}"
                        loading="lazy"
                    >
                    `
                    :
                    ""
            }

        </div>


        <div class="market-card-content">

            <p class="market-card-category">
                ${escaparHTML(
                    item.categoria || ""
                )}
            </p>


            <h3>
                ${escaparHTML(nombre)}
            </h3>


            <p class="market-card-description">
                ${escaparHTML(
                    item.descripcion ||
                    item.resumen ||
                    ""
                )}
            </p>


            ${
                item.direccion
                    ?
                    `
                    <p class="market-card-address">
                        ${escaparHTML(
                            item.direccion
                        )}
                    </p>
                    `
                    :
                    ""
            }

        </div>
    `;


    const abrir = () => {

        if (!item.slug) {
            return;
        }

        abrirDetalle(
            item.slug
        );
    };


    tarjeta.addEventListener(
        "click",
        abrir
    );


    tarjeta.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                abrir();
            }
        }
    );


    return tarjeta;
}


/* =========================================================
   ABRIR DETALLE
========================================================= */

async function abrirDetalle(slug) {

    history.pushState(
        { slug },
        "",
        `mercado-santa-cruz.html?slug=${encodeURIComponent(slug)}`
    );


    await cargarDetalle(slug);


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   CARGAR DETALLE
========================================================= */

async function cargarDetalle(slug) {

    try {

        const item =
            await TECNICOM_API
                .getMercadoItem(slug);


        if (!item) {

            throw new Error(
                "No se encontró el comercio."
            );
        }


        mostrarDetalle(item);


    } catch (error) {

        console.error(error);

        marketDetailView.hidden =
            false;

        marketDetailView.innerHTML = `
            <div class="market-detail-container">

                <button
                    class="market-back-button"
                    onclick="location.href='mercado-santa-cruz.html'"
                >
                    ← Volver
                </button>

                <p>
                    No fue posible cargar esta información.
                </p>

            </div>
        `;
    }
}


/* =========================================================
   MOSTRAR DETALLE
========================================================= */

function mostrarDetalle(item) {

    document
        .querySelectorAll(
            ".market-categories-section, .market-featured-section, .market-business-section, .market-events-section"
        )
        .forEach(
            elemento => {

                elemento.hidden = true;
            }
        );


    marketDetailView.hidden =
        false;


    const nombre =
        item.nombre ||
        item.titulo ||
        "";


    document.getElementById(
        "marketDetailCategory"
    ).textContent =
        item.categoria || "";


    document.getElementById(
        "marketDetailTitle"
    ).textContent =
        nombre;


    document.getElementById(
        "marketDetailSummary"
    ).textContent =
        item.descripcion ||
        item.resumen ||
        "";


    establecerDato(
        "marketDetailAddressRow",
        "marketDetailAddress",
        item.direccion
    );


    establecerDato(
        "marketDetailPhoneRow",
        "marketDetailPhone",
        item.telefono
    );


    establecerDato(
        "marketDetailScheduleRow",
        "marketDetailSchedule",
        item.horario
    );


    document.getElementById(
        "marketDetailContent"
    ).innerHTML =
        item.contenido || "";


    const imagen =
        resolverImagen(
            item.imagen ||
            item.imagen_portada
        );


    const imageWrap =
        document.getElementById(
            "marketDetailImageWrap"
        );


    const image =
        document.getElementById(
            "marketDetailImage"
        );


    if (imagen) {

        image.src =
            imagen;

        image.alt =
            nombre;

        imageWrap.hidden =
            false;

    } else {

        imageWrap.hidden =
            true;
    }
}


/* =========================================================
   MOSTRAR LISTADO
========================================================= */

function mostrarListado() {

    marketDetailView.hidden =
        true;


    document
        .querySelectorAll(
            ".market-categories-section, .market-featured-section, .market-business-section"
        )
        .forEach(
            elemento => {

                elemento.hidden = false;
            }
        );


    if (marketEvents?.children.length) {

        marketEventsSection.hidden =
            false;
    }


    renderMercado(
        mercadoItems
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   HISTORIAL
========================================================= */

async function manejarHistorial() {

    const parametros =
        new URLSearchParams(
            location.search
        );


    const slug =
        parametros.get("slug");


    if (slug) {

        await cargarDetalle(slug);

    } else {

        mostrarListado();
    }
}


/* =========================================================
   EVENTOS
========================================================= */

function renderEventos(eventos) {

    if (
        !marketEvents ||
        eventos.length === 0
    ) {

        ocultarEventos();

        return;
    }


    marketEvents.innerHTML = "";


    eventos.forEach(
        evento => {

            const articulo =
                document.createElement(
                    "article"
                );


            articulo.className =
                "market-event";


            articulo.innerHTML = `

                <div class="market-event-date">

                    ${escaparHTML(
                        formatearFecha(
                            evento.fecha ||
                            evento.fecha_evento
                        )
                    )}

                </div>


                <h3>

                    ${escaparHTML(
                        evento.titulo ||
                        evento.nombre ||
                        ""
                    )}

                </h3>


                <p>

                    ${escaparHTML(
                        evento.descripcion ||
                        evento.resumen ||
                        ""
                    )}

                </p>
            `;


            marketEvents.appendChild(
                articulo
            );
        }
    );
}


/* =========================================================
   OCULTAR EVENTOS
========================================================= */

function ocultarEventos() {

    if (
        marketEventsSection
    ) {

        marketEventsSection.hidden =
            true;
    }
}


/* =========================================================
   DATO DETALLE
========================================================= */

function establecerDato(
    filaId,
    valorId,
    valor
) {

    const fila =
        document.getElementById(
            filaId
        );

    const elemento =
        document.getElementById(
            valorId
        );


    if (
        !fila ||
        !elemento
    ) {

        return;
    }


    if (!valor) {

        fila.hidden =
            true;

        return;
    }


    fila.hidden =
        false;

    elemento.textContent =
        valor;
}


/* =========================================================
   IMAGEN
========================================================= */

function resolverImagen(ruta) {

    if (!ruta) {
        return "";
    }


    if (
        /^https?:\/\//i.test(ruta)
    ) {

        return ruta;
    }


    return (
        API_MEDIA_BASE +
        ruta.replace(
            /^\/+/,
            ""
        )
    );
}


/* =========================================================
   FECHA
========================================================= */

function formatearFecha(fecha) {

    if (!fecha) {
        return "";
    }


    const fechaNormalizada =
        fecha.includes("T")
            ?
            fecha
            :
            fecha.replace(
                " ",
                "T"
            );


    const date =
        new Date(
            fechaNormalizada
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return fecha;
    }


    return new Intl.DateTimeFormat(
        "es-CL",
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    ).format(date);
}


/* =========================================================
   SLUG
========================================================= */

function slugificar(texto) {

    return String(
        texto || ""
    )
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .trim()
    .replace(
        /[^a-z0-9]+/g,
        "-"
    )
    .replace(
        /^-+|-+$/g,
        ""
    );
}


/* =========================================================
   SEGURIDAD HTML
========================================================= */

function escaparHTML(valor) {

    return String(
        valor ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );
}


function escaparAtributo(valor) {

    return escaparHTML(valor);
}


/* =========================================================
   ESTADO
========================================================= */

function mostrarEstado(texto) {

    if (!marketStatus) {
        return;
    }


    marketStatus.hidden =
        false;

    marketStatus.textContent =
        texto;
}


function ocultarEstado() {

    if (!marketStatus) {
        return;
    }


    marketStatus.hidden =
        true;
}
