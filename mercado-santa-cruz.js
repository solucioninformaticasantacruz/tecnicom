"use strict";


document.addEventListener(
    "DOMContentLoaded",
    iniciarMercadoSantaCruz
);


/* =========================================================
   CONFIGURACIÓN
========================================================= */

const API_MEDIA_BASE =
    "https://www.carnesdiaz.cl/";

const MURO_CANTIDAD_INICIAL =
    12;

const MURO_INCREMENTO =
    12;


/* =========================================================
   ESTADO MERCADO
========================================================= */

let mercadoItems = [];

let mercadoCategorias = [];

let categoriaSeleccionada =
    "todos";


/* =========================================================
   ESTADO MURO
========================================================= */

let muroPublicaciones = [];

let muroTipoSeleccionado =
    "todos";

let muroCantidadVisible =
    MURO_CANTIDAD_INICIAL;

let muroEnviando =
    false;


/* =========================================================
   ELEMENTOS MERCADO
========================================================= */

const marketSearch =
    document.getElementById(
        "marketSearch"
    );

const marketSearchButton =
    document.getElementById(
        "marketSearchButton"
    );

const marketCategories =
    document.getElementById(
        "marketCategories"
    );

const marketFeatured =
    document.getElementById(
        "marketFeatured"
    );

const marketGrid =
    document.getElementById(
        "marketGrid"
    );

const marketStatus =
    document.getElementById(
        "marketStatus"
    );

const marketResultsCount =
    document.getElementById(
        "marketResultsCount"
    );

const marketEvents =
    document.getElementById(
        "marketEvents"
    );

const marketEventsSection =
    document.getElementById(
        "marketEventsSection"
    );

const marketDetailView =
    document.getElementById(
        "marketDetailView"
    );

const marketBackButton =
    document.getElementById(
        "marketBackButton"
    );

const marketMenuButton =
    document.getElementById(
        "marketMenuButton"
    );

const marketNav =
    document.getElementById(
        "marketNav"
    );


/* =========================================================
   ELEMENTOS MURO
========================================================= */

const muroGrid =
    document.getElementById(
        "muroGrid"
    );

const muroStatus =
    document.getElementById(
        "muroStatus"
    );

const muroFiltros =
    document.getElementById(
        "muroFiltros"
    );

const muroVerMasButton =
    document.getElementById(
        "muroVerMasButton"
    );

const muroPublicarButton =
    document.getElementById(
        "muroPublicarButton"
    );


/* =========================================================
   MODAL MURO
========================================================= */

const muroModal =
    document.getElementById(
        "muroModal"
    );

const muroModalOverlay =
    document.getElementById(
        "muroModalOverlay"
    );

const muroModalClose =
    document.getElementById(
        "muroModalClose"
    );

const muroCancelarButton =
    document.getElementById(
        "muroCancelarButton"
    );

const muroForm =
    document.getElementById(
        "muroForm"
    );

const muroTipo =
    document.getElementById(
        "muroTipo"
    );

const muroTitulo =
    document.getElementById(
        "muroTitulo"
    );

const muroMensaje =
    document.getElementById(
        "muroMensaje"
    );

const muroNombre =
    document.getElementById(
        "muroNombre"
    );

const muroContacto =
    document.getElementById(
        "muroContacto"
    );

const muroTituloContador =
    document.getElementById(
        "muroTituloContador"
    );

const muroMensajeContador =
    document.getElementById(
        "muroMensajeContador"
    );

const muroEnviarButton =
    document.getElementById(
        "muroEnviarButton"
    );

const muroFormStatus =
    document.getElementById(
        "muroFormStatus"
    );

const muroReclamoAviso =
    document.getElementById(
        "muroReclamoAviso"
    );


/* =========================================================
   INICIALIZAR
========================================================= */

async function iniciarMercadoSantaCruz() {

    configurarEventos();


    const parametros =
        new URLSearchParams(
            window.location.search
        );


    const slug =
        parametros.get(
            "slug"
        );


    /*
    |--------------------------------------------------------------------------
    | Si viene un comercio específico
    |--------------------------------------------------------------------------
    */

    if (slug) {

        await cargarDetalleMercado(
            slug
        );

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Página normal
    |--------------------------------------------------------------------------
    */

    await Promise.allSettled([
        cargarMuro(),
        cargarMercado()
    ]);
}


/* =========================================================
   CONFIGURAR EVENTOS
========================================================= */

function configurarEventos() {


    /* =====================================================
       BUSCADOR MERCADO
    ====================================================== */

    marketSearch?.addEventListener(
        "input",
        filtrarMercado
    );


    marketSearchButton?.addEventListener(
        "click",
        filtrarMercado
    );


    marketSearch?.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                filtrarMercado();
            }
        }
    );


    /* =====================================================
       VOLVER DESDE DETALLE
    ====================================================== */

    marketBackButton?.addEventListener(
        "click",
        () => {

            history.pushState(
                {},
                "",
                "mercado-santa-cruz.html"
            );


            mostrarListadoMercado();
        }
    );


    /* =====================================================
       MENÚ MÓVIL
    ====================================================== */

    marketMenuButton?.addEventListener(
        "click",
        () => {

            const abierto =
                marketNav?.classList.toggle(
                    "open"
                );


            marketMenuButton.setAttribute(
                "aria-expanded",
                abierto
                    ? "true"
                    : "false"
            );
        }
    );


    /* =====================================================
       HISTORIAL
    ====================================================== */

    window.addEventListener(
        "popstate",
        manejarHistorial
    );


    /* =====================================================
       FILTROS MURO
    ====================================================== */

    muroFiltros?.addEventListener(
        "click",
        event => {

            const boton =
                event.target.closest(
                    "[data-tipo]"
                );


            if (!boton) {
                return;
            }


            seleccionarTipoMuro(
                boton.dataset.tipo
            );
        }
    );


    /* =====================================================
       VER MÁS MURO
    ====================================================== */

    muroVerMasButton?.addEventListener(
        "click",
        () => {

            muroCantidadVisible +=
                MURO_INCREMENTO;


            renderMuro();
        }
    );


    /* =====================================================
       ABRIR MODAL
    ====================================================== */

    muroPublicarButton?.addEventListener(
        "click",
        abrirModalMuro
    );


    /* =====================================================
       CERRAR MODAL
    ====================================================== */

    muroModalClose?.addEventListener(
        "click",
        cerrarModalMuro
    );


    muroCancelarButton?.addEventListener(
        "click",
        cerrarModalMuro
    );


    muroModalOverlay?.addEventListener(
        "click",
        cerrarModalMuro
    );


    /* =====================================================
       ESCAPE
    ====================================================== */

    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape" &&
                muroModal &&
                !muroModal.hidden
            ) {

                cerrarModalMuro();
            }
        }
    );


    /* =====================================================
       CONTADORES
    ====================================================== */

    muroTitulo?.addEventListener(
        "input",
        actualizarContadorTitulo
    );


    muroMensaje?.addEventListener(
        "input",
        actualizarContadorMensaje
    );


    /* =====================================================
       TIPO PUBLICACIÓN
    ====================================================== */

    muroTipo?.addEventListener(
        "change",
        actualizarAvisoReclamo
    );


    /* =====================================================
       ENVIAR PUBLICACIÓN
    ====================================================== */

    muroForm?.addEventListener(
        "submit",
        enviarPublicacionMuro
    );
}


/* =========================================================
   CARGAR EL MURO
========================================================= */

async function cargarMuro() {

    try {

        mostrarEstadoMuro(
            "Cargando publicaciones..."
        );


        muroPublicaciones =
            await TECNICOM_API.getMuro(
                100
            );


        if (
            !Array.isArray(
                muroPublicaciones
            )
        ) {

            muroPublicaciones = [];
        }


        renderMuro();


    } catch (error) {

        console.error(
            "Error cargando El Muro:",
            error
        );


        mostrarEstadoMuro(
            "No fue posible cargar las publicaciones de El Muro."
        );
    }
}


/* =========================================================
   SELECCIONAR FILTRO MURO
========================================================= */

function seleccionarTipoMuro(tipo) {

    const tiposValidos = [
        "todos",
        "informacion",
        "reclamo",
        "necesito",
        "ofrezco"
    ];


    if (
        !tiposValidos.includes(tipo)
    ) {

        tipo = "todos";
    }


    muroTipoSeleccionado =
        tipo;


    muroCantidadVisible =
        MURO_CANTIDAD_INICIAL;


    actualizarFiltrosMuro();

    renderMuro();
}


/* =========================================================
   ACTUALIZAR FILTROS
========================================================= */

function actualizarFiltrosMuro() {

    const botones =
        muroFiltros?.querySelectorAll(
            "[data-tipo]"
        );


    botones?.forEach(
        boton => {

            boton.classList.toggle(
                "active",
                boton.dataset.tipo ===
                    muroTipoSeleccionado
            );
        }
    );
}


/* =========================================================
   FILTRAR PUBLICACIONES MURO
========================================================= */

function obtenerPublicacionesFiltradas() {

    if (
        muroTipoSeleccionado ===
        "todos"
    ) {

        return muroPublicaciones;
    }


    return muroPublicaciones.filter(
        publicacion =>
            publicacion.tipo ===
            muroTipoSeleccionado
    );
}


/* =========================================================
   RENDER MURO
========================================================= */

function renderMuro() {

    if (!muroGrid) {
        return;
    }


    muroGrid.innerHTML =
        "";


    const filtradas =
        obtenerPublicacionesFiltradas();


    if (
        filtradas.length === 0
    ) {

        mostrarEstadoMuro(
            muroTipoSeleccionado === "todos"
                ? "Todavía no hay publicaciones en El Muro."
                : "No hay publicaciones en esta categoría."
        );


        if (muroVerMasButton) {

            muroVerMasButton.hidden =
                true;
        }


        return;
    }


    ocultarEstadoMuro();


    const visibles =
        filtradas.slice(
            0,
            muroCantidadVisible
        );


    visibles.forEach(
        publicacion => {

            muroGrid.appendChild(
                crearTarjetaMuro(
                    publicacion
                )
            );
        }
    );


    if (muroVerMasButton) {

        muroVerMasButton.hidden =
            muroCantidadVisible >=
            filtradas.length;
    }
}


/* =========================================================
   CREAR PUBLICACIÓN MURO
========================================================= */

function crearTarjetaMuro(
    publicacion
) {

    const articulo =
        document.createElement(
            "article"
        );


    const tipo =
        publicacion.tipo ||
        "informacion";


    articulo.className =
        `muro-card muro-card-${tipo}`;


    /*
    |--------------------------------------------------------------------------
    | Cabecera
    |--------------------------------------------------------------------------
    */

    const cabecera =
        document.createElement(
            "div"
        );


    cabecera.className =
        "muro-card-header";


    const etiqueta =
        document.createElement(
            "span"
        );


    etiqueta.className =
        `muro-tipo muro-tipo-${tipo}`;


    etiqueta.textContent =
        obtenerNombreTipoMuro(
            tipo
        );


    const fecha =
        document.createElement(
            "time"
        );


    fecha.className =
        "muro-fecha";


    fecha.textContent =
        formatearFechaRelativa(
            publicacion.fecha_publicacion ||
            publicacion.fecha_creacion
        );


    cabecera.append(
        etiqueta,
        fecha
    );


    /*
    |--------------------------------------------------------------------------
    | Título
    |--------------------------------------------------------------------------
    */

    const titulo =
        document.createElement(
            "h3"
        );


    titulo.textContent =
        publicacion.titulo ||
        "";


    /*
    |--------------------------------------------------------------------------
    | Mensaje
    |--------------------------------------------------------------------------
    */

    const mensaje =
        document.createElement(
            "p"
        );


    mensaje.className =
        "muro-mensaje";


    mensaje.textContent =
        publicacion.mensaje ||
        "";


    /*
    |--------------------------------------------------------------------------
    | Footer
    |--------------------------------------------------------------------------
    */

    const footer =
        document.createElement(
            "div"
        );


    footer.className =
        "muro-card-footer";


    if (
        publicacion.nombre
    ) {

        const autor =
            document.createElement(
                "span"
            );


        autor.className =
            "muro-autor";


        autor.textContent =
            publicacion.nombre;


        footer.appendChild(
            autor
        );
    }


    if (
        publicacion.contacto
    ) {

        const contacto =
            document.createElement(
                "span"
            );


        contacto.className =
            "muro-contacto";


        contacto.textContent =
            publicacion.contacto;


        footer.appendChild(
            contacto
        );
    }


    articulo.append(
        cabecera,
        titulo,
        mensaje
    );


    if (
        footer.children.length > 0
    ) {

        articulo.appendChild(
            footer
        );
    }


    return articulo;
}


/* =========================================================
   NOMBRE TIPO
========================================================= */

function obtenerNombreTipoMuro(
    tipo
) {

    const nombres = {

        informacion:
            "Información",

        reclamo:
            "Reclamo",

        necesito:
            "Necesito",

        ofrezco:
            "Ofrezco"
    };


    return nombres[tipo] ||
        "Información";
}


/* =========================================================
   MODAL MURO
========================================================= */

function abrirModalMuro() {

    if (!muroModal) {
        return;
    }


    muroModal.hidden =
        false;


    document.body.classList.add(
        "muro-modal-abierto"
    );


    limpiarEstadoFormularioMuro();


    actualizarContadorTitulo();

    actualizarContadorMensaje();

    actualizarAvisoReclamo();


    setTimeout(
        () => {

            muroTipo?.focus();

        },
        50
    );
}


/* =========================================================
   CERRAR MODAL
========================================================= */

function cerrarModalMuro() {

    if (!muroModal) {
        return;
    }


    if (muroEnviando) {
        return;
    }


    muroModal.hidden =
        true;


    document.body.classList.remove(
        "muro-modal-abierto"
    );


    muroPublicarButton?.focus();
}


/* =========================================================
   CONTADOR TÍTULO
========================================================= */

function actualizarContadorTitulo() {

    if (
        !muroTitulo ||
        !muroTituloContador
    ) {

        return;
    }


    muroTituloContador.textContent =
        `${muroTitulo.value.length} / 120`;
}


/* =========================================================
   CONTADOR MENSAJE
========================================================= */

function actualizarContadorMensaje() {

    if (
        !muroMensaje ||
        !muroMensajeContador
    ) {

        return;
    }


    muroMensajeContador.textContent =
        `${muroMensaje.value.length} / 500`;
}


/* =========================================================
   AVISO RECLAMOS
========================================================= */

function actualizarAvisoReclamo() {

    if (
        !muroTipo ||
        !muroReclamoAviso
    ) {

        return;
    }


    muroReclamoAviso.hidden =
        muroTipo.value !==
        "reclamo";
}


/* =========================================================
   ENVIAR PUBLICACIÓN
========================================================= */

async function enviarPublicacionMuro(
    event
) {

    event.preventDefault();


    if (
        muroEnviando
    ) {

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Validación HTML
    |--------------------------------------------------------------------------
    */

    if (
        !muroForm.checkValidity()
    ) {

        muroForm.reportValidity();

        return;
    }


    const datos = {

        tipo:
            muroTipo.value.trim(),

        titulo:
            muroTitulo.value.trim(),

        mensaje:
            muroMensaje.value.trim(),

        nombre:
            muroNombre.value.trim(),

        contacto:
            muroContacto.value.trim()
    };


    /*
    |--------------------------------------------------------------------------
    | Validación adicional
    |--------------------------------------------------------------------------
    */

    if (
        datos.titulo.length < 3 ||
        datos.titulo.length > 120
    ) {

        mostrarEstadoFormularioMuro(
            "El título debe tener entre 3 y 120 caracteres.",
            "error"
        );

        return;
    }


    if (
        datos.mensaje.length < 5 ||
        datos.mensaje.length > 500
    ) {

        mostrarEstadoFormularioMuro(
            "El mensaje debe tener entre 5 y 500 caracteres.",
            "error"
        );

        return;
    }


    try {

        muroEnviando =
            true;


        muroEnviarButton.disabled =
            true;


        muroEnviarButton.textContent =
            "Enviando...";


        mostrarEstadoFormularioMuro(
            "Enviando publicación...",
            "cargando"
        );


        const respuesta =
            await TECNICOM_API.publicarMuro(
                datos
            );


        /*
        |--------------------------------------------------------------------------
        | Éxito
        |--------------------------------------------------------------------------
        */

        mostrarEstadoFormularioMuro(
            respuesta?.data?.mensaje ||
            "Tu publicación fue recibida y será revisada antes de aparecer en El Muro.",
            "exito"
        );


        muroForm.reset();


        actualizarContadorTitulo();

        actualizarContadorMensaje();

        actualizarAvisoReclamo();


        /*
        |--------------------------------------------------------------------------
        | No agregamos manualmente la publicación al muro.
        |
        | Esto es intencional porque acaba de quedar
        | en estado PENDIENTE.
        |--------------------------------------------------------------------------
        */

        setTimeout(
            () => {

                if (
                    !muroEnviando
                ) {

                    cerrarModalMuro();
                }

            },
            2500
        );


    } catch (error) {

        console.error(
            "Error publicando en El Muro:",
            error
        );


        mostrarEstadoFormularioMuro(
            error.message ||
            "No fue posible enviar la publicación.",
            "error"
        );


    } finally {

        muroEnviando =
            false;


        muroEnviarButton.disabled =
            false;


        muroEnviarButton.textContent =
            "Enviar publicación";
    }
}


/* =========================================================
   ESTADO FORMULARIO
========================================================= */

function mostrarEstadoFormularioMuro(
    mensaje,
    tipo
) {

    if (!muroFormStatus) {
        return;
    }


    muroFormStatus.hidden =
        false;


    muroFormStatus.className =
        `muro-form-status ${tipo || ""}`;


    muroFormStatus.textContent =
        mensaje;
}


/* =========================================================
   LIMPIAR ESTADO FORMULARIO
========================================================= */

function limpiarEstadoFormularioMuro() {

    if (!muroFormStatus) {
        return;
    }


    muroFormStatus.hidden =
        true;


    muroFormStatus.className =
        "muro-form-status";


    muroFormStatus.textContent =
        "";
}


/* =========================================================
   ESTADO MURO
========================================================= */

function mostrarEstadoMuro(
    texto
) {

    if (!muroStatus) {
        return;
    }


    muroStatus.hidden =
        false;


    muroStatus.textContent =
        texto;
}


/* =========================================================
   OCULTAR ESTADO MURO
========================================================= */

function ocultarEstadoMuro() {

    if (!muroStatus) {
        return;
    }


    muroStatus.hidden =
        true;
}


/* =========================================================
   CARGAR MERCADO
========================================================= */

async function cargarMercado() {

    try {

        mostrarEstadoMercado(
            "Cargando información..."
        );


        const resultados =
            await Promise.allSettled([
                TECNICOM_API.getMercado(),
                TECNICOM_API.getCategoriasMercado(),
                TECNICOM_API.getEventosMercado()
            ]);


        /*
        |--------------------------------------------------------------------------
        | Comercios
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Categorías
        |--------------------------------------------------------------------------
        */

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


        /*
        |--------------------------------------------------------------------------
        | Eventos
        |--------------------------------------------------------------------------
        */

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


        ocultarEstadoMercado();


    } catch (error) {

        console.error(
            "Error cargando Mercado Santa Cruz:",
            error
        );


        mostrarEstadoMercado(
            "No fue posible cargar Mercado Santa Cruz."
        );
    }
}


/* =========================================================
   NORMALIZAR ARRAY
========================================================= */

function normalizarArray(
    valor
) {

    if (
        Array.isArray(valor)
    ) {

        return valor;
    }


    if (
        valor &&
        Array.isArray(
            valor.data
        )
    ) {

        return valor.data;
    }


    return [];
}


/* =========================================================
   CATEGORÍAS MERCADO
========================================================= */

function renderCategorias() {

    if (!marketCategories) {
        return;
    }


    marketCategories.innerHTML =
        "";


    const todas =
        crearCategoriaMercado({

            nombre:
                "Todos",

            slug:
                "todos",

            descripcion:
                "Ver todos los comercios y servicios"
        });


    marketCategories.appendChild(
        todas
    );


    mercadoCategorias.forEach(
        categoria => {

            marketCategories.appendChild(
                crearCategoriaMercado(
                    categoria
                )
            );
        }
    );
}


/* =========================================================
   CREAR CATEGORÍA
========================================================= */

function crearCategoriaMercado(
    categoria
) {

    const boton =
        document.createElement(
            "button"
        );


    boton.type =
        "button";


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


    const nombre =
        document.createElement(
            "strong"
        );


    nombre.textContent =
        categoria.nombre ||
        "";


    const descripcion =
        document.createElement(
            "span"
        );


    descripcion.textContent =
        categoria.descripcion ||
        "";


    boton.append(
        nombre,
        descripcion
    );


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
   FILTRAR MERCADO
========================================================= */

function filtrarMercado() {

    const busqueda =
        (
            marketSearch?.value ||
            ""
        )
        .trim()
        .toLowerCase();


    const resultados =
        mercadoItems.filter(
            item => {


                const categoria =
                    slugificar(
                        item.categoria_slug ||
                        item.categoria ||
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

function renderMercado(
    items
) {

    if (!marketGrid) {
        return;
    }


    marketGrid.innerHTML =
        "";


    if (marketFeatured) {

        marketFeatured.innerHTML =
            "";
    }


    /*
    |--------------------------------------------------------------------------
    | Contador
    |--------------------------------------------------------------------------
    */

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


    /*
    |--------------------------------------------------------------------------
    | Sin resultados
    |--------------------------------------------------------------------------
    */

    if (
        items.length === 0
    ) {

        const mensaje =
            document.createElement(
                "p"
            );


        mensaje.className =
            "market-empty";


        mensaje.textContent =
            "No encontramos resultados.";


        marketGrid.appendChild(
            mensaje
        );


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | Destacados
    |--------------------------------------------------------------------------
    */

    const destacados =
        items.filter(
            item =>
                item.destacado === true ||
                item.destacado === 1 ||
                item.destacado === "1"
        );


    destacados
        .slice(0, 3)
        .forEach(
            item => {

                marketFeatured?.appendChild(
                    crearTarjetaMercado(
                        item
                    )
                );
            }
        );


    /*
    |--------------------------------------------------------------------------
    | Todos
    |--------------------------------------------------------------------------
    */

    items.forEach(
        item => {

            marketGrid.appendChild(
                crearTarjetaMercado(
                    item
                )
            );
        }
    );
}


/* =========================================================
   CREAR TARJETA MERCADO
========================================================= */

function crearTarjetaMercado(
    item
) {

    const tarjeta =
        document.createElement(
            "article"
        );


    tarjeta.className =
        "market-card";


    tarjeta.tabIndex =
        0;


    tarjeta.setAttribute(
        "role",
        "button"
    );


    const nombre =
        item.nombre ||
        item.titulo ||
        "Comercio";


    /*
    |--------------------------------------------------------------------------
    | Imagen
    |--------------------------------------------------------------------------
    */

    const imagenContenedor =
        document.createElement(
            "div"
        );


    imagenContenedor.className =
        "market-card-image";


    const rutaImagen =
        resolverImagen(
            item.imagen ||
            item.imagen_portada
        );


    if (rutaImagen) {

        const imagen =
            document.createElement(
                "img"
            );


        imagen.src =
            rutaImagen;


        imagen.alt =
            nombre;


        imagen.loading =
            "lazy";


        imagenContenedor.appendChild(
            imagen
        );
    }


    /*
    |--------------------------------------------------------------------------
    | Contenido
    |--------------------------------------------------------------------------
    */

    const contenido =
        document.createElement(
            "div"
        );


    contenido.className =
        "market-card-content";


    const categoria =
        document.createElement(
            "p"
        );


    categoria.className =
        "market-card-category";


    categoria.textContent =
        item.categoria ||
        "";


    const titulo =
        document.createElement(
            "h3"
        );


    titulo.textContent =
        nombre;


    const descripcion =
        document.createElement(
            "p"
        );


    descripcion.className =
        "market-card-description";


    descripcion.textContent =
        item.descripcion ||
        item.resumen ||
        "";


    contenido.append(
        categoria,
        titulo,
        descripcion
    );


    /*
    |--------------------------------------------------------------------------
    | Dirección
    |--------------------------------------------------------------------------
    */

    if (
        item.direccion
    ) {

        const direccion =
            document.createElement(
                "p"
            );


        direccion.className =
            "market-card-address";


        direccion.textContent =
            item.direccion;


        contenido.appendChild(
            direccion
        );
    }


    tarjeta.append(
        imagenContenedor,
        contenido
    );


    /*
    |--------------------------------------------------------------------------
    | Abrir detalle
    |--------------------------------------------------------------------------
    */

    const abrir =
        () => {

            if (!item.slug) {
                return;
            }


            abrirDetalleMercado(
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

async function abrirDetalleMercado(
    slug
) {

    history.pushState(
        {
            slug
        },
        "",
        `mercado-santa-cruz.html?slug=${encodeURIComponent(slug)}`
    );


    await cargarDetalleMercado(
        slug
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* =========================================================
   CARGAR DETALLE
========================================================= */

async function cargarDetalleMercado(
    slug
) {

    try {

        const item =
            await TECNICOM_API.getMercadoItem(
                slug
            );


        if (!item) {

            throw new Error(
                "No se encontró el comercio."
            );
        }


        mostrarDetalleMercado(
            item
        );


    } catch (error) {

        console.error(
            "Error cargando comercio:",
            error
        );


        if (!marketDetailView) {
            return;
        }


        marketDetailView.hidden =
            false;


        marketDetailView.innerHTML = `
            <div class="market-detail-container">
                <a
                    href="mercado-santa-cruz.html"
                    class="market-back-button"
                >
                    ← Volver a Mercado Santa Cruz
                </a>

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

function mostrarDetalleMercado(
    item
) {

    ocultarSeccionesListado();


    marketDetailView.hidden =
        false;


    const nombre =
        item.nombre ||
        item.titulo ||
        "";


    establecerTexto(
        "marketDetailCategory",
        item.categoria
    );


    establecerTexto(
        "marketDetailTitle",
        nombre
    );


    establecerTexto(
        "marketDetailSummary",
        item.descripcion ||
        item.resumen
    );


    /*
    |--------------------------------------------------------------------------
    | Datos
    |--------------------------------------------------------------------------
    */

    establecerDatoDetalle(
        "marketDetailAddressRow",
        "marketDetailAddress",
        item.direccion
    );


    establecerDatoDetalle(
        "marketDetailPhoneRow",
        "marketDetailPhone",
        item.telefono
    );


    establecerDatoDetalle(
        "marketDetailScheduleRow",
        "marketDetailSchedule",
        item.horario
    );


    /*
    |--------------------------------------------------------------------------
    | Contenido HTML administrado
    |--------------------------------------------------------------------------
    */

    const contenido =
        document.getElementById(
            "marketDetailContent"
        );


    if (contenido) {

        contenido.innerHTML =
            item.contenido ||
            "";
    }


    /*
    |--------------------------------------------------------------------------
    | Imagen
    |--------------------------------------------------------------------------
    */

    const imageWrap =
        document.getElementById(
            "marketDetailImageWrap"
        );


    const image =
        document.getElementById(
            "marketDetailImage"
        );


    const rutaImagen =
        resolverImagen(
            item.imagen ||
            item.imagen_portada
        );


    if (
        rutaImagen &&
        image &&
        imageWrap
    ) {

        image.src =
            rutaImagen;


        image.alt =
            nombre;


        imageWrap.hidden =
            false;


    } else if (
        imageWrap
    ) {

        imageWrap.hidden =
            true;
    }
}


/* =========================================================
   OCULTAR SECCIONES DEL LISTADO
========================================================= */

function ocultarSeccionesListado() {

    const selectores = [

        ".muro-section",
        ".market-search-section",
        ".market-categories-section",
        ".market-featured-section",
        ".market-business-section",
        ".market-events-section"

    ];


    selectores.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    elemento => {

                        elemento.hidden =
                            true;
                    }
                );
        }
    );
}


/* =========================================================
   MOSTRAR LISTADO
========================================================= */

function mostrarListadoMercado() {

    if (
        marketDetailView
    ) {

        marketDetailView.hidden =
            true;
    }


    const selectores = [

        ".muro-section",
        ".market-search-section",
        ".market-categories-section",
        ".market-featured-section",
        ".market-business-section"

    ];


    selectores.forEach(
        selector => {

            document
                .querySelectorAll(
                    selector
                )
                .forEach(
                    elemento => {

                        elemento.hidden =
                            false;
                    }
                );
        }
    );


    if (
        marketEvents &&
        marketEvents.children.length > 0 &&
        marketEventsSection
    ) {

        marketEventsSection.hidden =
            false;
    }


    renderMercado(
        mercadoItems
    );


    renderMuro();


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
            window.location.search
        );


    const slug =
        parametros.get(
            "slug"
        );


    if (slug) {

        await cargarDetalleMercado(
            slug
        );


    } else {

        mostrarListadoMercado();
    }
}


/* =========================================================
   EVENTOS
========================================================= */

function renderEventos(
    eventos
) {

    if (
        !marketEvents ||
        eventos.length === 0
    ) {

        ocultarEventos();

        return;
    }


    marketEvents.innerHTML =
        "";


    eventos.forEach(
        evento => {

            const articulo =
                document.createElement(
                    "article"
                );


            articulo.className =
                "market-event";


            const fecha =
                document.createElement(
                    "div"
                );


            fecha.className =
                "market-event-date";


            fecha.textContent =
                formatearFecha(
                    evento.fecha ||
                    evento.fecha_evento
                );


            const titulo =
                document.createElement(
                    "h3"
                );


            titulo.textContent =
                evento.titulo ||
                evento.nombre ||
                "";


            const descripcion =
                document.createElement(
                    "p"
                );


            descripcion.textContent =
                evento.descripcion ||
                evento.resumen ||
                "";


            articulo.append(
                fecha,
                titulo,
                descripcion
            );


            marketEvents.appendChild(
                articulo
            );
        }
    );


    if (
        marketEventsSection
    ) {

        marketEventsSection.hidden =
            false;
    }
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

function establecerDatoDetalle(
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
   ESTABLECER TEXTO
========================================================= */

function establecerTexto(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (!elemento) {
        return;
    }


    elemento.textContent =
        texto || "";
}


/* =========================================================
   IMAGEN
========================================================= */

function resolverImagen(
    ruta
) {

    if (!ruta) {
        return "";
    }


    ruta =
        String(ruta).trim();


    if (
        /^https?:\/\//i.test(
            ruta
        )
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
   FECHA NORMAL
========================================================= */

function formatearFecha(
    fecha
) {

    const date =
        crearFecha(
            fecha
        );


    if (!date) {

        return fecha || "";
    }


    return new Intl.DateTimeFormat(
        "es-CL",
        {

            day:
                "numeric",

            month:
                "long",

            year:
                "numeric"
        }
    ).format(date);
}


/* =========================================================
   FECHA RELATIVA MURO
========================================================= */

function formatearFechaRelativa(
    fecha
) {

    const date =
        crearFecha(
            fecha
        );


    if (!date) {

        return "";
    }


    const ahora =
        new Date();


    const diferencia =
        ahora.getTime() -
        date.getTime();


    const segundos =
        Math.floor(
            diferencia / 1000
        );


    if (
        segundos < 60
    ) {

        return "Hace un momento";
    }


    const minutos =
        Math.floor(
            segundos / 60
        );


    if (
        minutos < 60
    ) {

        return `Hace ${minutos} min`;
    }


    const horas =
        Math.floor(
            minutos / 60
        );


    if (
        horas < 24
    ) {

        return horas === 1
            ? "Hace 1 hora"
            : `Hace ${horas} horas`;
    }


    const dias =
        Math.floor(
            horas / 24
        );


    if (
        dias === 1
    ) {

        return "Ayer";
    }


    if (
        dias < 7
    ) {

        return `Hace ${dias} días`;
    }


    return new Intl.DateTimeFormat(
        "es-CL",
        {

            day:
                "numeric",

            month:
                "short",

            year:
                date.getFullYear() !==
                ahora.getFullYear()
                    ? "numeric"
                    : undefined
        }
    ).format(date);
}


/* =========================================================
   CREAR FECHA
========================================================= */

function crearFecha(
    fecha
) {

    if (!fecha) {
        return null;
    }


    /*
    |--------------------------------------------------------------------------
    | MySQL:
    | 2026-08-31 13:20:00
    |--------------------------------------------------------------------------
    */

    const normalizada =
        String(fecha)
            .trim()
            .replace(
                " ",
                "T"
            );


    const date =
        new Date(
            normalizada
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return null;
    }


    return date;
}


/* =========================================================
   SLUG
========================================================= */

function slugificar(
    texto
) {

    return String(
        texto || ""
    )
    .normalize(
        "NFD"
    )
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
   ESTADO MERCADO
========================================================= */

function mostrarEstadoMercado(
    texto
) {

    if (!marketStatus) {
        return;
    }


    marketStatus.hidden =
        false;


    marketStatus.textContent =
        texto;
}


/* =========================================================
   OCULTAR ESTADO MERCADO
========================================================= */

function ocultarEstadoMercado() {

    if (!marketStatus) {
        return;
    }


    marketStatus.hidden =
        true;
}
