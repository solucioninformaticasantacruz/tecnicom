"use strict";

/* =========================================================
   TECNICOM - NOTICIAS
   =========================================================

   Este archivo controla:

   - Carga de noticias desde la API
   - Noticia destacada
   - Listado de noticias
   - Categorías
   - Buscador
   - Lectura de noticia completa
   - Navegación mediante ?slug=
   - Menú móvil

   ENDPOINTS:

   GET /api/noticias
   GET /api/noticias/{slug}

========================================================= */


const NoticiasApp = {

    /* =====================================================
       ESTADO
    ===================================================== */

    noticias: [],

    categoriaActual: "todas",

    busquedaActual: "",

    elementos: {},


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        this.elementos = {

            listingView:
                document.getElementById(
                    "newsListingView"
                ),

            articleView:
                document.getElementById(
                    "newsArticleView"
                ),

            featured:
                document.getElementById(
                    "newsFeatured"
                ),

            grid:
                document.getElementById(
                    "newsGrid"
                ),

            status:
                document.getElementById(
                    "newsStatus"
                ),

            categories:
                document.getElementById(
                    "newsCategories"
                ),

            search:
                document.getElementById(
                    "newsSearch"
                ),

            backButton:
                document.getElementById(
                    "newsBackButton"
                ),


            /* ARTÍCULO */

            articleCategory:
                document.getElementById(
                    "articleCategory"
                ),

            articleTitle:
                document.getElementById(
                    "articleTitle"
                ),

            articleSummary:
                document.getElementById(
                    "articleSummary"
                ),

            articleDate:
                document.getElementById(
                    "articleDate"
                ),

            articleViews:
                document.getElementById(
                    "articleViews"
                ),

            articleImageWrap:
                document.getElementById(
                    "articleImageWrap"
                ),

            articleImage:
                document.getElementById(
                    "articleImage"
                ),

            articleContent:
                document.getElementById(
                    "articleContent"
                ),


            /* MENÚ */

            menuButton:
                document.getElementById(
                    "newsMenuButton"
                ),

            nav:
                document.getElementById(
                    "newsNav"
                )
        };


        this.registrarEventos();


        /*
         * Revisamos si la URL contiene:
         *
         * noticias.html?slug=nombre-noticia
         */

        const slug =
            new URLSearchParams(
                window.location.search
            ).get("slug");


        if (slug) {

            this.cargarArticulo(
                slug
            );

        } else {

            this.cargarListado();

        }
    },


    /* =====================================================
       EVENTOS
    ===================================================== */

    registrarEventos() {

        /*
         * BUSCADOR
         */

        this.elementos.search
            ?.addEventListener(
                "input",
                event => {

                    this.busquedaActual =
                        event.target.value
                            .trim()
                            .toLowerCase();

                    this.renderListado();

                }
            );


        /*
         * VOLVER A NOTICIAS
         */

        this.elementos.backButton
            ?.addEventListener(
                "click",
                () => {

                    this.volverListado();

                }
            );


        /*
         * MENÚ MÓVIL
         */

        this.elementos.menuButton
            ?.addEventListener(
                "click",
                () => {

                    const abierto =
                        this.elementos.nav
                            .classList
                            .toggle("open");


                    this.elementos.menuButton
                        .setAttribute(
                            "aria-expanded",
                            abierto
                                ? "true"
                                : "false"
                        );

                }
            );
    },


    /* =====================================================
       CARGAR LISTADO DESDE API
    ===================================================== */

    async cargarListado() {

        this.mostrarListado();

        this.mostrarEstado(
            "Cargando noticias..."
        );


        try {

            /*
             * api.js ejecuta:
             *
             * GET
             * https://www.carnesdiaz.cl/api/noticias
             */

            this.noticias =
                await window.TECNICOM_API
                    .getNoticias();


            /*
             * Seguridad por si la API
             * devuelve algo inesperado.
             */

            if (
                !Array.isArray(
                    this.noticias
                )
            ) {

                this.noticias = [];

            }


            /*
             * Generamos categorías
             */

            this.renderCategorias();


            /*
             * Generamos noticias
             */

            this.renderListado();


        } catch (error) {

            console.error(
                "Error cargando noticias:",
                error
            );


            this.mostrarEstado(
                "No fue posible cargar las noticias en este momento."
            );

        }
    },


    /* =====================================================
       CATEGORÍAS
    ===================================================== */

    renderCategorias() {

        /*
         * Extraemos categorías únicas.
         */

        const categorias = [

            ...new Set(

                this.noticias

                    .map(
                        noticia =>
                            noticia.categoria
                    )

                    .filter(Boolean)

            )

        ].sort(
            (a, b) =>
                a.localeCompare(
                    b,
                    "es"
                )
        );


        /*
         * Limpiamos botones existentes.
         */

        this.elementos.categories.innerHTML =
            "";


        /*
         * Botón TODAS
         */

        this.elementos.categories
            .appendChild(

                this.crearBotonCategoria(
                    "todas",
                    "Todas"
                )

            );


        /*
         * Categorías obtenidas desde API.
         */

        categorias.forEach(
            categoria => {

                this.elementos.categories
                    .appendChild(

                        this.crearBotonCategoria(
                            categoria,
                            categoria
                        )

                    );

            }
        );
    },


    /* =====================================================
       CREAR BOTÓN CATEGORÍA
    ===================================================== */

    crearBotonCategoria(
        valor,
        texto
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "news-category-button";


        button.textContent =
            texto;


        /*
         * Categoría actualmente seleccionada.
         */

        if (
            this.categoriaActual ===
            valor
        ) {

            button.classList.add(
                "active"
            );

        }


        /*
         * CLICK
         */

        button.addEventListener(
            "click",
            () => {

                this.categoriaActual =
                    valor;


                /*
                 * Quitamos selección anterior.
                 */

                document
                    .querySelectorAll(
                        ".news-category-button"
                    )
                    .forEach(
                        item =>
                            item.classList.remove(
                                "active"
                            )
                    );


                /*
                 * Marcamos actual.
                 */

                button.classList.add(
                    "active"
                );


                /*
                 * Volvemos a generar listado.
                 */

                this.renderListado();

            }
        );


        return button;
    },


    /* =====================================================
       RENDERIZAR LISTADO
    ===================================================== */

    renderListado() {

        /*
         * Aplicamos categoría + buscador.
         */

        const filtradas =
            this.noticias.filter(
                noticia => {

                    /*
                     * FILTRO CATEGORÍA
                     */

                    const coincideCategoria =

                        this.categoriaActual ===
                            "todas"

                        ||

                        noticia.categoria ===
                            this.categoriaActual;


                    /*
                     * TEXTO BUSCABLE
                     */

                    const texto =
                        `
                            ${noticia.titulo || ""}
                            ${noticia.resumen || ""}
                            ${noticia.categoria || ""}
                        `
                        .toLowerCase();


                    /*
                     * FILTRO BUSCADOR
                     */

                    const coincideBusqueda =

                        this.busquedaActual ===
                            ""

                        ||

                        texto.includes(
                            this.busquedaActual
                        );


                    return (
                        coincideCategoria &&
                        coincideBusqueda
                    );

                }
            );


        /*
         * Limpiar contenido anterior.
         */

        this.elementos.grid.innerHTML =
            "";


        this.elementos.featured.innerHTML =
            "";


        this.elementos.featured.hidden =
            true;


        /*
         * SIN RESULTADOS
         */

        if (
            filtradas.length === 0
        ) {

            this.mostrarEstado(
                "No encontramos noticias con esos criterios."
            );

            return;
        }


        this.ocultarEstado();


        /*
         * NOTICIA DESTACADA
         *
         * Primero buscamos destacado = 1.
         *
         * Si no existe, usamos la primera.
         */

        const destacada =

            filtradas.find(
                noticia =>
                    this.esVerdadero(
                        noticia.destacado
                    )
            )

            ||

            filtradas[0];


        /*
         * Render noticia principal.
         */

        this.renderDestacada(
            destacada
        );


        /*
         * Resto de noticias.
         */

        filtradas

            .filter(
                noticia =>
                    noticia.id !==
                    destacada.id
            )

            .forEach(
                noticia => {

                    this.elementos.grid
                        .appendChild(

                            this.crearTarjeta(
                                noticia
                            )

                        );

                }
            );
    },


    /* =====================================================
       NOTICIA DESTACADA
    ===================================================== */

    renderDestacada(
        noticia
    ) {

        const section =
            this.elementos.featured;


        section.innerHTML =
            "";


        section.hidden =
            false;


        /*
         * CONTENEDOR
         */

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "news-featured-card";


        /*
         * IMAGEN
         */

        const image =
            this.crearImagen(

                noticia.imagen_portada,

                noticia.titulo,

                "news-featured-image"

            );


        /*
         * CONTENIDO
         */

        const content =
            document.createElement(
                "div"
            );


        content.className =
            "news-featured-content";


        /*
         * CATEGORÍA
         */

        const category =
            document.createElement(
                "p"
            );


        category.className =
            "news-category";


        category.textContent =
            noticia.categoria ||
            "Noticias";


        /*
         * TÍTULO
         */

        const title =
            document.createElement(
                "h2"
            );


        title.className =
            "news-featured-title";


        title.textContent =
            noticia.titulo ||
            "Sin título";


        /*
         * RESUMEN
         */

        const summary =
            document.createElement(
                "p"
            );


        summary.className =
            "news-featured-summary";


        summary.textContent =
            noticia.resumen ||
            "";


        /*
         * METADATOS
         */

        const meta =
            this.crearMeta(
                noticia
            );


        /*
         * BOTÓN
         */

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "news-read-button";


        button.textContent =
            "Leer noticia";


        button.addEventListener(
            "click",
            () => {

                this.abrirArticulo(
                    noticia.slug
                );

            }
        );


        /*
         * ARMAMOS CONTENIDO
         */

        content.append(

            category,

            title,

            summary,

            meta,

            button

        );


        /*
         * Agregamos imagen solo
         * si existe.
         */

        if (image) {

            card.append(
                image
            );

        }


        card.append(
            content
        );


        section.append(
            card
        );
    },


    /* =====================================================
       TARJETA NOTICIA
    ===================================================== */

    crearTarjeta(
        noticia
    ) {

        const article =
            document.createElement(
                "article"
            );


        article.className =
            "news-card";


        /*
         * IMAGEN
         */

        const image =
            this.crearImagen(

                noticia.imagen_portada,

                noticia.titulo,

                "news-card-image"

            );


        /*
         * CATEGORÍA
         */

        const category =
            document.createElement(
                "p"
            );


        category.className =
            "news-category";


        category.textContent =
            noticia.categoria ||
            "Noticias";


        /*
         * TÍTULO
         */

        const title =
            document.createElement(
                "h2"
            );


        title.className =
            "news-card-title";


        title.textContent =
            noticia.titulo ||
            "Sin título";


        /*
         * RESUMEN
         */

        const summary =
            document.createElement(
                "p"
            );


        summary.className =
            "news-card-summary";


        summary.textContent =
            noticia.resumen ||
            "";


        /*
         * FECHA / VISITAS
         */

        const meta =
            this.crearMeta(
                noticia
            );


        /*
         * BOTÓN
         */

        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";


        button.className =
            "news-read-button";


        button.textContent =
            "Leer noticia";


        button.addEventListener(
            "click",
            () => {

                this.abrirArticulo(
                    noticia.slug
                );

            }
        );


        /*
         * ARMAMOS TARJETA
         */

        if (image) {

            article.append(
                image
            );

        }


        article.append(

            category,

            title,

            summary,

            meta,

            button

        );


        return article;
    },


    /* =====================================================
       CREAR IMAGEN
    ===================================================== */

    crearImagen(
        url,
        titulo,
        className
    ) {

        if (!url) {

            return null;

        }


        const wrapper =
            document.createElement(
                "div"
            );


        wrapper.className =
            className;


        const img =
            document.createElement(
                "img"
            );


        img.src =
            this.resolverImagen(
                url
            );


        img.alt =
            titulo ||
            "Noticia TECNICOM";


        img.loading =
            "lazy";


        wrapper.appendChild(
            img
        );


        return wrapper;
    },


    /* =====================================================
       METADATOS
    ===================================================== */

    crearMeta(
        noticia
    ) {

        const meta =
            document.createElement(
                "div"
            );


        meta.className =
            "news-meta";


        /*
         * FECHA
         */

        const date =
            document.createElement(
                "span"
            );


        date.textContent =
            this.formatearFecha(
                noticia.fecha_publicacion
            );


        meta.appendChild(
            date
        );


        /*
         * VISITAS
         */

        if (
            noticia.visitas !== undefined &&
            noticia.visitas !== null
        ) {

            const views =
                document.createElement(
                    "span"
                );


            views.textContent =
                `${
                    Number(
                        noticia.visitas
                    ) || 0
                } lecturas`;


            meta.appendChild(
                views
            );

        }


        return meta;
    },


    /* =====================================================
       ABRIR ARTÍCULO
    ===================================================== */

    abrirArticulo(
        slug
    ) {

        if (!slug) {

            return;

        }


        /*
         * Cambiamos URL sin recargar página.
         *
         * Ejemplo:
         *
         * noticias.html?slug=automatizacion-empresas
         */

        const url =
            `${
                window.location.pathname
            }?slug=${
                encodeURIComponent(
                    slug
                )
            }`;


        window.history.pushState(

            {
                slug
            },

            "",

            url

        );


        /*
         * Consultamos noticia completa.
         */

        this.cargarArticulo(
            slug
        );
    },


    /* =====================================================
       CARGAR ARTÍCULO DESDE API
    ===================================================== */

    async cargarArticulo(
        slug
    ) {

        this.mostrarArticulo();


        /*
         * Estado carga.
         */

        this.elementos.articleTitle
            .textContent =
                "Cargando noticia...";


        this.elementos.articleSummary
            .textContent =
                "";


        this.elementos.articleContent
            .innerHTML =
                "";


        try {

            /*
             * GET:
             *
             * /api/noticias/{slug}
             */

            const noticia =
                await window.TECNICOM_API
                    .getNoticia(
                        slug
                    );


            if (!noticia) {

                throw new Error(
                    "Noticia no encontrada."
                );

            }


            /*
             * Dibujar noticia.
             */

            this.renderArticulo(
                noticia
            );


        } catch (error) {

            console.error(
                "Error cargando noticia:",
                error
            );


            this.elementos.articleTitle
                .textContent =
                    "No fue posible cargar la noticia";


            this.elementos.articleSummary
                .textContent =

                    error.message ||

                    "Inténtalo nuevamente.";

        }
    },


    /* =====================================================
       RENDER ARTÍCULO COMPLETO
    ===================================================== */

    renderArticulo(
        noticia
    ) {

        /*
         * TITLE DEL NAVEGADOR
         */

        document.title =

            `${
                noticia.titulo ||
                "Noticias"
            } | TECNICOM`;


        /*
         * CATEGORÍA
         */

        this.elementos.articleCategory
            .textContent =

                noticia.categoria ||
                "Noticias";


        /*
         * TÍTULO
         */

        this.elementos.articleTitle
            .textContent =

                noticia.titulo ||
                "";


        /*
         * RESUMEN
         */

        this.elementos.articleSummary
            .textContent =

                noticia.resumen ||
                "";


        /*
         * FECHA
         */

        this.elementos.articleDate
            .textContent =

                this.formatearFecha(
                    noticia.fecha_publicacion
                );


        /*
         * VISITAS
         */

        this.elementos.articleViews
            .textContent =

                noticia.visitas !==
                    undefined

                ?

                `${
                    Number(
                        noticia.visitas
                    ) || 0
                } lecturas`

                :

                "";


        /*
         * IMAGEN PORTADA
         */

        if (
            noticia.imagen_portada
        ) {

            this.elementos.articleImage
                .src =

                    this.resolverImagen(
                        noticia.imagen_portada
                    );


            this.elementos.articleImage
                .alt =

                    noticia.titulo ||
                    "Noticia TECNICOM";


            this.elementos.articleImageWrap
                .hidden =
                    false;

        } else {

            this.elementos.articleImageWrap
                .hidden =
                    true;


            this.elementos.articleImage
                .removeAttribute(
                    "src"
                );

        }


        /*
         * CONTENIDO COMPLETO
         *
         * Este contenido viene desde nuestra
         * propia base de datos.
         *
         * Puede contener:
         *
         * <p>
         * <h2>
         * <h3>
         * <strong>
         * <ul>
         * <li>
         * etc.
         */

        this.elementos.articleContent
            .innerHTML =

                noticia.contenido ||
                "";


        /*
         * Volvemos arriba.
         */

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    },


    /* =====================================================
       VOLVER AL LISTADO
    ===================================================== */

    volverListado() {

        /*
         * Quitamos ?slug=
         */

        window.history.pushState(

            {},

            "",

            window.location.pathname

        );


        /*
         * Restauramos título.
         */

        document.title =
            "Noticias | TECNICOM";


        /*
         * Mostrar listado.
         */

        this.mostrarListado();


        /*
         * Si todavía no tenemos noticias
         * las consultamos.
         */

        if (
            this.noticias.length === 0
        ) {

            this.cargarListado();

        } else {

            this.renderListado();

        }


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });
    },


    /* =====================================================
       MOSTRAR LISTADO
    ===================================================== */

    mostrarListado() {

        this.elementos.listingView
            .hidden =
                false;


        this.elementos.articleView
            .hidden =
                true;
    },


    /* =====================================================
       MOSTRAR ARTÍCULO
    ===================================================== */

    mostrarArticulo() {

        this.elementos.listingView
            .hidden =
                true;


        this.elementos.articleView
            .hidden =
                false;
    },


    /* =====================================================
       ESTADOS
    ===================================================== */

    mostrarEstado(
        texto
    ) {

        this.elementos.status
            .textContent =
                texto;


        this.elementos.status
            .hidden =
                false;
    },


    ocultarEstado() {

        this.elementos.status
            .hidden =
                true;
    },


    /* =====================================================
       FORMATEAR FECHA
    ===================================================== */

    formatearFecha(
        valor
    ) {

        if (!valor) {

            return "";

        }


        /*
         * MySQL puede entregar:
         *
         * 2026-08-31 15:30:00
         *
         * Lo convertimos a:
         *
         * 2026-08-31T15:30:00
         */

        const normalizado =

            String(
                valor
            ).replace(
                " ",
                "T"
            );


        const fecha =
            new Date(
                normalizado
            );


        /*
         * Si no se pudo interpretar,
         * mostramos valor original.
         */

        if (
            Number.isNaN(
                fecha.getTime()
            )
        ) {

            return valor;

        }


        /*
         * Ejemplo:
         *
         * 31 de agosto de 2026
         */

        return new Intl.DateTimeFormat(

            "es-CL",

            {
                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }

        ).format(
            fecha
        );
    },


    /* =====================================================
       RESOLVER URL DE IMAGEN
    ===================================================== */

    resolverImagen(
        url
    ) {

        if (!url) {

            return "";

        }


        /*
         * Si ya es URL completa:
         *
         * https://...
         *
         * la usamos directamente.
         */

        if (
            /^https?:\/\//i.test(
                url
            )
        ) {

            return url;

        }


        /*
         * Si MySQL contiene:
         *
         * media/noticias/foto.webp
         *
         * generamos:
         *
         * https://www.carnesdiaz.cl/media/noticias/foto.webp
         */

        const limpia =

            String(
                url
            ).replace(
                /^\/+/,
                ""
            );


        return (
            "https://www.carnesdiaz.cl/" +
            limpia
        );
    },


    /* =====================================================
       CONVERTIR BOOLEANO
    ===================================================== */

    esVerdadero(
        valor
    ) {

        return (

            valor === true ||

            valor === 1 ||

            valor === "1" ||

            valor === "true"

        );
    }

};


/* =========================================================
   BOTONES ATRÁS / ADELANTE DEL NAVEGADOR
========================================================= */

window.addEventListener(
    "popstate",
    () => {

        const slug =

            new URLSearchParams(
                window.location.search
            ).get(
                "slug"
            );


        if (slug) {

            NoticiasApp
                .cargarArticulo(
                    slug
                );

        } else {

            NoticiasApp
                .mostrarListado();


            /*
             * Si todavía no se han cargado
             * noticias, consultamos API.
             */

            if (
                NoticiasApp
                    .noticias
                    .length === 0
            ) {

                NoticiasApp
                    .cargarListado();

            } else {

                NoticiasApp
                    .renderListado();

            }

        }

    }
);


/* =========================================================
   INICIALIZAR
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * api.js debe cargarse antes.
         */

        if (
            !window.TECNICOM_API
        ) {

            console.error(

                "No se encontró TECNICOM_API. " +

                "Verifica que api.js se cargue " +

                "antes de noticias.js."

            );

            return;

        }


        NoticiasApp.init();

    }
);


/* =========================================================
   DISPONIBILIDAD GLOBAL
========================================================= */

window.NoticiasApp =
    NoticiasApp;
