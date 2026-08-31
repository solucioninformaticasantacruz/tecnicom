"use strict";

document.addEventListener("DOMContentLoaded", iniciarMercadoSantaCruz);

const API_MEDIA_BASE = "https://www.carnesdiaz.cl/";
const MURO_POR_PAGINA = 6;

let mercadoItems = [];
let mercadoCategorias = [];
let categoriaSeleccionada = "todos";

let muroPublicaciones = [];
let muroTipoSeleccionado = "todos";
let muroPaginaActual = 1;
let muroEnviando = false;
let muroComentarioEnviando = false;

const $ = id => document.getElementById(id);

const marketSearch = $("marketSearch");
const marketSearchButton = $("marketSearchButton");
const marketCategories = $("marketCategories");
const marketFeatured = $("marketFeatured");
const marketGrid = $("marketGrid");
const marketStatus = $("marketStatus");
const marketResultsCount = $("marketResultsCount");
const marketEvents = $("marketEvents");
const marketEventsSection = $("marketEventsSection");
const marketDetailView = $("marketDetailView");
const marketBackButton = $("marketBackButton");
const marketMenuButton = $("marketMenuButton");
const marketNav = $("marketNav");

const muroGrid = $("muroGrid");
const muroStatus = $("muroStatus");
const muroFiltros = $("muroFiltros");
const muroPaginacion = $("muroPaginacion");
const muroPublicarButton = $("muroPublicarButton");

const muroModal = $("muroModal");
const muroModalOverlay = $("muroModalOverlay");
const muroModalClose = $("muroModalClose");
const muroCancelarButton = $("muroCancelarButton");
const muroForm = $("muroForm");
const muroTipo = $("muroTipo");
const muroTitulo = $("muroTitulo");
const muroMensaje = $("muroMensaje");
const muroNombre = $("muroNombre");
const muroContacto = $("muroContacto");
const muroTituloContador = $("muroTituloContador");
const muroMensajeContador = $("muroMensajeContador");
const muroEnviarButton = $("muroEnviarButton");
const muroFormStatus = $("muroFormStatus");
const muroReclamoAviso = $("muroReclamoAviso");

const muroDetalleModal = $("muroDetalleModal");
const muroDetalleOverlay = $("muroDetalleOverlay");
const muroDetalleCerrar = $("muroDetalleCerrar");
const muroDetalleTipo = $("muroDetalleTipo");
const muroDetalleFecha = $("muroDetalleFecha");
const muroDetalleAnuncioTitulo = $("muroDetalleAnuncioTitulo");
const muroDetalleMensaje = $("muroDetalleMensaje");
const muroDetalleAutorWrap = $("muroDetalleAutorWrap");
const muroDetalleAutor = $("muroDetalleAutor");
const muroDetalleContactoWrap = $("muroDetalleContactoWrap");
const muroDetalleContacto = $("muroDetalleContacto");

const muroComentariosCantidad = $("muroComentariosCantidad");
const muroComentariosStatus = $("muroComentariosStatus");
const muroComentariosLista = $("muroComentariosLista");
const muroComentarioForm = $("muroComentarioForm");
const muroComentarioPublicacionId = $("muroComentarioPublicacionId");
const muroComentarioNombre = $("muroComentarioNombre");
const muroComentarioTexto = $("muroComentarioTexto");
const muroComentarioContador = $("muroComentarioContador");
const muroComentarioStatus = $("muroComentarioStatus");
const muroComentarioEnviar = $("muroComentarioEnviar");


async function iniciarMercadoSantaCruz() {

    configurarEventos();

    const parametros = new URLSearchParams(window.location.search);
    const slug = parametros.get("slug");

    if (slug) {
        await cargarDetalleMercado(slug);
        return;
    }

    await Promise.allSettled([
        cargarMuro(),
        cargarMercado()
    ]);
}


function configurarEventos() {

    marketSearch?.addEventListener("input", filtrarMercado);
    marketSearchButton?.addEventListener("click", filtrarMercado);

    marketSearch?.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();
            filtrarMercado();
        }
    });

    marketBackButton?.addEventListener("click", () => {
        history.pushState({}, "", "mercado-santa-cruz.html");
        mostrarListadoMercado();
    });

    marketMenuButton?.addEventListener("click", () => {
        const abierto = marketNav?.classList.toggle("open");

        marketMenuButton.setAttribute(
            "aria-expanded",
            abierto ? "true" : "false"
        );
    });

    muroFiltros?.addEventListener("click", event => {

        const boton = event.target.closest("[data-tipo]");

        if (!boton) {
            return;
        }

        seleccionarTipoMuro(
            boton.dataset.tipo
        );
    });

    muroPublicarButton?.addEventListener(
        "click",
        abrirModalMuro
    );

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

    muroDetalleCerrar?.addEventListener(
        "click",
        cerrarDetalleMuro
    );

    muroDetalleOverlay?.addEventListener(
        "click",
        cerrarDetalleMuro
    );

    muroTitulo?.addEventListener(
        "input",
        actualizarContadorTitulo
    );

    muroMensaje?.addEventListener(
        "input",
        actualizarContadorMensaje
    );

    muroTipo?.addEventListener(
        "change",
        actualizarAvisoReclamo
    );

    muroForm?.addEventListener(
        "submit",
        enviarPublicacionMuro
    );

    muroComentarioTexto?.addEventListener(
        "input",
        actualizarContadorComentario
    );

    muroComentarioForm?.addEventListener(
        "submit",
        enviarComentarioMuro
    );

    window.addEventListener(
        "popstate",
        manejarHistorial
    );

    document.addEventListener(
        "keydown",
        event => {

            if (event.key !== "Escape") {
                return;
            }

            if (
                muroDetalleModal &&
                !muroDetalleModal.hidden
            ) {

                cerrarDetalleMuro();

                return;
            }

            if (
                muroModal &&
                !muroModal.hidden
            ) {

                cerrarModalMuro();
            }
        }
    );
}


/* =========================================================
   EL MURO
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

        console.error(error);

        mostrarEstadoMuro(
            "No fue posible cargar las publicaciones de El Muro."
        );
    }
}


function seleccionarTipoMuro(tipo) {

    const validos = [
        "todos",
        "informacion",
        "reclamo",
        "necesito",
        "ofrezco"
    ];

    muroTipoSeleccionado =
        validos.includes(tipo)
            ? tipo
            : "todos";

    muroPaginaActual =
        1;

    muroFiltros
        ?.querySelectorAll(
            "[data-tipo]"
        )
        .forEach(
            boton => {

                boton.classList.toggle(
                    "active",
                    boton.dataset.tipo ===
                        muroTipoSeleccionado
                );
            }
        );

    renderMuro();
}


function obtenerPublicacionesFiltradas() {

    if (
        muroTipoSeleccionado ===
        "todos"
    ) {

        return muroPublicaciones;
    }

    return muroPublicaciones.filter(
        item =>
            item.tipo ===
            muroTipoSeleccionado
    );
}


function renderMuro() {

    if (!muroGrid) {
        return;
    }

    muroGrid.innerHTML =
        "";

    const filtradas =
        obtenerPublicacionesFiltradas();

    if (
        !filtradas.length
    ) {

        mostrarEstadoMuro(
            muroTipoSeleccionado === "todos"
                ? "Todavía no hay publicaciones en El Muro."
                : "No hay publicaciones en esta categoría."
        );

        renderPaginacionMuro(
            0
        );

        return;
    }

    ocultarEstadoMuro();

    const totalPaginas =
        Math.ceil(
            filtradas.length /
            MURO_POR_PAGINA
        );

    muroPaginaActual =
        Math.min(
            Math.max(
                muroPaginaActual,
                1
            ),
            totalPaginas
        );

    const inicio =
        (
            muroPaginaActual - 1
        ) *
        MURO_POR_PAGINA;

    filtradas
        .slice(
            inicio,
            inicio + MURO_POR_PAGINA
        )
        .forEach(
            publicacion => {

                muroGrid.appendChild(
                    crearTarjetaMuro(
                        publicacion
                    )
                );
            }
        );

    renderPaginacionMuro(
        totalPaginas
    );
}


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

    articulo.tabIndex =
        0;

    articulo.setAttribute(
        "role",
        "button"
    );

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
        nombreTipo(
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

    const titulo =
        document.createElement(
            "h3"
        );

    titulo.textContent =
        publicacion.titulo ||
        "";

    const mensaje =
        document.createElement(
            "p"
        );

    mensaje.className =
        "muro-mensaje";

    mensaje.textContent =
        publicacion.mensaje ||
        "";

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

    const hint =
        document.createElement(
            "span"
        );

    hint.className =
        "muro-card-hint";

    hint.textContent =
        "Ver detalle y comentarios";

    footer.appendChild(
        hint
    );

    articulo.append(
        cabecera,
        titulo,
        mensaje,
        footer
    );

    const abrir =
        () =>
            abrirDetalleMuro(
                publicacion
            );

    articulo.addEventListener(
        "click",
        abrir
    );

    articulo.addEventListener(
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

    return articulo;
}


/* =========================================================
   PAGINACIÓN MURO
========================================================= */

function renderPaginacionMuro(
    totalPaginas
) {

    if (!muroPaginacion) {
        return;
    }

    muroPaginacion.innerHTML =
        "";

    if (
        totalPaginas <= 1
    ) {

        muroPaginacion.hidden =
            true;

        return;
    }

    muroPaginacion.hidden =
        false;

    const anterior =
        crearBotonPagina(
            "← Anterior",
            muroPaginaActual === 1,
            () => {

                muroPaginaActual--;

                renderMuro();

                subirAlMuro();
            },
            "muro-pagina-control"
        );

    muroPaginacion.appendChild(
        anterior
    );

    for (
        let pagina = 1;
        pagina <= totalPaginas;
        pagina++
    ) {

        const boton =
            crearBotonPagina(
                String(pagina),
                false,
                () => {

                    muroPaginaActual =
                        pagina;

                    renderMuro();

                    subirAlMuro();
                },
                "muro-pagina-numero"
            );

        if (
            pagina ===
            muroPaginaActual
        ) {

            boton.classList.add(
                "active"
            );

            boton.setAttribute(
                "aria-current",
                "page"
            );
        }

        muroPaginacion.appendChild(
            boton
        );
    }

    const siguiente =
        crearBotonPagina(
            "Siguiente →",
            muroPaginaActual ===
                totalPaginas,
            () => {

                muroPaginaActual++;

                renderMuro();

                subirAlMuro();
            },
            "muro-pagina-control"
        );

    muroPaginacion.appendChild(
        siguiente
    );
}


function crearBotonPagina(
    texto,
    disabled,
    accion,
    clase
) {

    const boton =
        document.createElement(
            "button"
        );

    boton.type =
        "button";

    boton.className =
        clase;

    boton.textContent =
        texto;

    boton.disabled =
        disabled;

    boton.addEventListener(
        "click",
        () => {

            if (
                !boton.disabled
            ) {

                accion();
            }
        }
    );

    return boton;
}


function subirAlMuro() {

    $("muro")
        ?.scrollIntoView(
            {
                behavior:
                    "smooth",

                block:
                    "start"
            }
        );
}


/* =========================================================
   DETALLE ANUNCIO
========================================================= */

async function abrirDetalleMuro(
    publicacion
) {

    if (
        !muroDetalleModal
    ) {

        return;
    }

    const tipo =
        publicacion.tipo ||
        "informacion";

    muroDetalleTipo.className =
        `muro-tipo muro-tipo-${tipo}`;

    muroDetalleTipo.textContent =
        nombreTipo(
            tipo
        );

    muroDetalleFecha.textContent =
        formatearFechaRelativa(
            publicacion.fecha_publicacion ||
            publicacion.fecha_creacion
        );

    muroDetalleAnuncioTitulo.textContent =
        publicacion.titulo ||
        "";

    muroDetalleMensaje.textContent =
        publicacion.mensaje ||
        "";

    muroDetalleAutorWrap.hidden =
        !publicacion.nombre;

    muroDetalleAutor.textContent =
        publicacion.nombre ||
        "";

    muroDetalleContactoWrap.hidden =
        !publicacion.contacto;

    muroDetalleContacto.textContent =
        publicacion.contacto ||
        "";

    muroComentarioPublicacionId.value =
        String(
            publicacion.id ||
            ""
        );

    muroComentarioForm
        ?.reset();

    actualizarContadorComentario();

    limpiarEstadoComentario();

    muroDetalleModal.hidden =
        false;

    actualizarBloqueoBody();

    await cargarComentariosMuro(
        publicacion.id
    );
}


function cerrarDetalleMuro() {

    if (
        !muroDetalleModal ||
        muroComentarioEnviando
    ) {

        return;
    }

    muroDetalleModal.hidden =
        true;

    actualizarBloqueoBody();
}


/* =========================================================
   COMENTARIOS
========================================================= */

async function cargarComentariosMuro(
    publicacionId
) {

    muroComentariosLista.innerHTML =
        "";

    muroComentariosCantidad.textContent =
        "";

    if (
        !publicacionId
    ) {

        muroComentariosStatus.textContent =
            "No fue posible identificar la publicación.";

        return;
    }

    muroComentariosStatus.textContent =
        "Cargando comentarios...";

    try {

        const respuesta =
            await TECNICOM_API.request(
                `muro/${encodeURIComponent(publicacionId)}/comentarios`
            );

        const comentarios =
            Array.isArray(
                respuesta?.data
            )
                ? respuesta.data
                : [];

        muroComentariosCantidad.textContent =
            `${comentarios.length} comentario${
                comentarios.length === 1
                    ? ""
                    : "s"
            }`;

        muroComentariosStatus.textContent =
            comentarios.length
                ? ""
                : "Todavía no hay comentarios.";

        comentarios.forEach(
            comentario => {

                muroComentariosLista.appendChild(
                    crearComentarioMuro(
                        comentario
                    )
                );
            }
        );

    } catch (error) {

        console.warn(
            error
        );

        muroComentariosStatus.textContent =
            "Los comentarios aún deben habilitarse en la API.";
    }
}


function crearComentarioMuro(
    comentario
) {

    const articulo =
        document.createElement(
            "article"
        );

    articulo.className =
        "muro-comentario";

    const header =
        document.createElement(
            "div"
        );

    header.className =
        "muro-comentario-header";

    const nombre =
        document.createElement(
            "strong"
        );

    nombre.textContent =
        comentario.nombre ||
        "Usuario";

    const fecha =
        document.createElement(
            "time"
        );

    fecha.textContent =
        formatearFechaRelativa(
            comentario.fecha_publicacion ||
            comentario.fecha_creacion
        );

    const texto =
        document.createElement(
            "p"
        );

    texto.textContent =
        comentario.comentario ||
        comentario.mensaje ||
        "";

    header.append(
        nombre,
        fecha
    );

    articulo.append(
        header,
        texto
    );

    return articulo;
}


async function enviarComentarioMuro(
    event
) {

    event.preventDefault();

    if (
        muroComentarioEnviando
    ) {

        return;
    }

    if (
        !muroComentarioForm.checkValidity()
    ) {

        muroComentarioForm.reportValidity();

        return;
    }

    const publicacionId =
        muroComentarioPublicacionId.value.trim();

    const datos = {

        nombre:
            muroComentarioNombre.value.trim(),

        comentario:
            muroComentarioTexto.value.trim()
    };

    try {

        muroComentarioEnviando =
            true;

        muroComentarioEnviar.disabled =
            true;

        muroComentarioEnviar.textContent =
            "Enviando...";

        mostrarEstadoComentario(
            "Enviando comentario...",
            "cargando"
        );

        const respuesta =
            await TECNICOM_API.request(
                `muro/${encodeURIComponent(publicacionId)}/comentarios`,
                {
                    method:
                        "POST",

                    body:
                        datos
                }
            );

        mostrarEstadoComentario(
            respuesta?.data?.mensaje ||
            "Comentario recibido.",
            "exito"
        );

        muroComentarioForm.reset();

        actualizarContadorComentario();

        await cargarComentariosMuro(
            publicacionId
        );

    } catch (error) {

        mostrarEstadoComentario(
            error.message ||
            "Los comentarios todavía no están habilitados en la API.",
            "error"
        );

    } finally {

        muroComentarioEnviando =
            false;

        muroComentarioEnviar.disabled =
            false;

        muroComentarioEnviar.textContent =
            "Publicar comentario";
    }
}


function actualizarContadorComentario() {

    muroComentarioContador.textContent =
        `${
            muroComentarioTexto
                ?.value.length ||
            0
        } / 300`;
}


function mostrarEstadoComentario(
    mensaje,
    tipo
) {

    muroComentarioStatus.hidden =
        false;

    muroComentarioStatus.className =
        `muro-form-status ${tipo || ""}`;

    muroComentarioStatus.textContent =
        mensaje;
}


function limpiarEstadoComentario() {

    muroComentarioStatus.hidden =
        true;

    muroComentarioStatus.className =
        "muro-form-status";

    muroComentarioStatus.textContent =
        "";
}


/* =========================================================
   PUBLICAR EN EL MURO
========================================================= */

function abrirModalMuro() {

    muroModal.hidden =
        false;

    actualizarBloqueoBody();

    limpiarEstadoFormularioMuro();

    actualizarContadorTitulo();

    actualizarContadorMensaje();

    actualizarAvisoReclamo();
}


function cerrarModalMuro() {

    if (
        muroEnviando
    ) {

        return;
    }

    muroModal.hidden =
        true;

    actualizarBloqueoBody();
}


function actualizarBloqueoBody() {

    const abierto =
        (
            muroModal &&
            !muroModal.hidden
        )
        ||
        (
            muroDetalleModal &&
            !muroDetalleModal.hidden
        );

    document.body.classList.toggle(
        "muro-modal-abierto",
        Boolean(
            abierto
        )
    );
}


function actualizarContadorTitulo() {

    muroTituloContador.textContent =
        `${
            muroTitulo
                ?.value.length ||
            0
        } / 120`;
}


function actualizarContadorMensaje() {

    muroMensajeContador.textContent =
        `${
            muroMensaje
                ?.value.length ||
            0
        } / 500`;
}


function actualizarAvisoReclamo() {

    muroReclamoAviso.hidden =
        muroTipo.value !==
        "reclamo";
}


async function enviarPublicacionMuro(
    event
) {

    event.preventDefault();

    if (
        muroEnviando
    ) {

        return;
    }

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

        mostrarEstadoFormularioMuro(
            respuesta?.data?.mensaje ||
            "Tu publicación fue recibida y será revisada.",
            "exito"
        );

        muroForm.reset();

        actualizarContadorTitulo();

        actualizarContadorMensaje();

        actualizarAvisoReclamo();

    } catch (error) {

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


function mostrarEstadoFormularioMuro(
    mensaje,
    tipo
) {

    muroFormStatus.hidden =
        false;

    muroFormStatus.className =
        `muro-form-status ${tipo || ""}`;

    muroFormStatus.textContent =
        mensaje;
}


function limpiarEstadoFormularioMuro() {

    muroFormStatus.hidden =
        true;

    muroFormStatus.className =
        "muro-form-status";

    muroFormStatus.textContent =
        "";
}


function mostrarEstadoMuro(
    texto
) {

    muroStatus.hidden =
        false;

    muroStatus.textContent =
        texto;
}


function ocultarEstadoMuro() {

    muroStatus.hidden =
        true;
}


function nombreTipo(
    tipo
) {

    return {
        informacion:
            "Información",

        reclamo:
            "Reclamo",

        necesito:
            "Necesito",

        ofrezco:
            "Ofrezco"

    }[tipo]
    ||
    "Información";
}


/* =========================================================
   MERCADO
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

        mercadoItems =
            resultados[0].status ===
            "fulfilled"
                ? normalizarArray(
                    resultados[0].value
                )
                : [];

        mercadoCategorias =
            resultados[1].status ===
            "fulfilled"
                ? normalizarArray(
                    resultados[1].value
                )
                : [];

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

            ocultarEventos();
        }

        renderCategorias();

        renderMercado(
            mercadoItems
        );

        ocultarEstadoMercado();

    } catch (error) {

        console.error(
            error
        );

        mostrarEstadoMercado(
            "No fue posible cargar Mercado Santa Cruz."
        );
    }
}


function normalizarArray(
    valor
) {

    if (
        Array.isArray(
            valor
        )
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


function renderCategorias() {

    if (
        !marketCategories
    ) {

        return;
    }

    marketCategories.innerHTML =
        "";

    marketCategories.appendChild(
        crearCategoriaMercado(
            {
                nombre:
                    "Todos",

                slug:
                    "todos",

                descripcion:
                    "Ver todos los comercios y servicios"
            }
        )
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
            categoria.nombre ||
            ""
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


function filtrarMercado() {

    const busqueda =
        (
            marketSearch
                ?.value ||
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
                .filter(
                    Boolean
                )
                .join(
                    " "
                )
                .toLowerCase();

                return (
                    coincideCategoria &&
                    (
                        !busqueda ||
                        texto.includes(
                            busqueda
                        )
                    )
                );
            }
        );

    renderMercado(
        resultados
    );
}


function renderMercado(
    items
) {

    marketGrid.innerHTML =
        "";

    marketFeatured.innerHTML =
        "";

    marketResultsCount.textContent =
        `${items.length} resultado${
            items.length === 1
                ? ""
                : "s"
        }`;

    if (
        !items.length
    ) {

        marketGrid.innerHTML =
            '<p class="market-empty">No encontramos resultados.</p>';

        return;
    }

    items
        .filter(
            item =>
                item.destacado === true ||
                item.destacado === 1 ||
                item.destacado === "1"
        )
        .slice(
            0,
            3
        )
        .forEach(
            item => {

                marketFeatured.appendChild(
                    crearTarjetaMercado(
                        item
                    )
                );
            }
        );

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

    const nombre =
        item.nombre ||
        item.titulo ||
        "Comercio";

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

    if (
        rutaImagen
    ) {

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

    const abrir =
        () => {

            if (
                item.slug
            ) {

                abrirDetalleMercado(
                    item.slug
                );
            }
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

    window.scrollTo(
        {
            top:
                0,

            behavior:
                "smooth"
        }
    );
}


async function cargarDetalleMercado(
    slug
) {

    try {

        const item =
            await TECNICOM_API.getMercadoItem(
                slug
            );

        if (
            !item
        ) {

            throw new Error(
                "No se encontró el comercio."
            );
        }

        mostrarDetalleMercado(
            item
        );

    } catch (error) {

        console.error(
            error
        );
    }
}


function mostrarDetalleMercado(
    item
) {

    ocultarSeccionesListado();

    marketDetailView.hidden =
        false;

    establecerTexto(
        "marketDetailCategory",
        item.categoria
    );

    establecerTexto(
        "marketDetailTitle",
        item.nombre ||
        item.titulo ||
        ""
    );

    establecerTexto(
        "marketDetailSummary",
        item.descripcion ||
        item.resumen
    );

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

    const contenido =
        $("marketDetailContent");

    contenido.innerHTML =
        item.contenido ||
        "";

    const imageWrap =
        $("marketDetailImageWrap");

    const image =
        $("marketDetailImage");

    const rutaImagen =
        resolverImagen(
            item.imagen ||
            item.imagen_portada
        );

    imageWrap.hidden =
        !rutaImagen;

    if (
        rutaImagen
    ) {

        image.src =
            rutaImagen;

        image.alt =
            item.nombre ||
            item.titulo ||
            "";
    }
}


function ocultarSeccionesListado() {

    [
        ".muro-section",
        ".market-search-section",
        ".market-categories-section",
        ".market-featured-section",
        ".market-business-section",
        ".market-events-section"
    ]
    .forEach(
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


function mostrarListadoMercado() {

    marketDetailView.hidden =
        true;

    [
        ".muro-section",
        ".market-search-section",
        ".market-categories-section",
        ".market-featured-section",
        ".market-business-section"
    ]
    .forEach(
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
        marketEvents
            ?.children.length
    ) {

        marketEventsSection.hidden =
            false;
    }

    renderMercado(
        mercadoItems
    );

    renderMuro();
}


async function manejarHistorial() {

    const slug =
        new URLSearchParams(
            window.location.search
        )
        .get(
            "slug"
        );

    if (
        slug
    ) {

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
        !eventos.length
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

    marketEventsSection.hidden =
        false;
}


function ocultarEventos() {

    marketEventsSection.hidden =
        true;
}


/* =========================================================
   UTILIDADES
========================================================= */

function establecerDatoDetalle(
    filaId,
    valorId,
    valor
) {

    const fila =
        $(
            filaId
        );

    const elemento =
        $(
            valorId
        );

    if (
        !fila ||
        !elemento
    ) {

        return;
    }

    fila.hidden =
        !valor;

    elemento.textContent =
        valor ||
        "";
}


function establecerTexto(
    id,
    texto
) {

    const elemento =
        $(
            id
        );

    if (
        elemento
    ) {

        elemento.textContent =
            texto ||
            "";
    }
}


function resolverImagen(
    ruta
) {

    if (
        !ruta
    ) {

        return "";
    }

    ruta =
        String(
            ruta
        )
        .trim();

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


function formatearFecha(
    fecha
) {

    const date =
        crearFecha(
            fecha
        );

    if (
        !date
    ) {

        return fecha ||
            "";
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
    )
    .format(
        date
    );
}


function formatearFechaRelativa(
    fecha
) {

    const date =
        crearFecha(
            fecha
        );

    if (
        !date
    ) {

        return "";
    }

    const ahora =
        new Date();

    const segundos =
        Math.floor(
            (
                ahora.getTime() -
                date.getTime()
            )
            /
            1000
        );

    if (
        segundos < 60
    ) {

        return "Hace un momento";
    }

    const minutos =
        Math.floor(
            segundos /
            60
        );

    if (
        minutos < 60
    ) {

        return `Hace ${minutos} min`;
    }

    const horas =
        Math.floor(
            minutos /
            60
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
            horas /
            24
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

    return formatearFecha(
        fecha
    );
}


function crearFecha(
    fecha
) {

    if (
        !fecha
    ) {

        return null;
    }

    const date =
        new Date(
            String(
                fecha
            )
            .trim()
            .replace(
                " ",
                "T"
            )
        );

    return Number.isNaN(
        date.getTime()
    )
        ? null
        : date;
}


function slugificar(
    texto
) {

    return String(
        texto ||
        ""
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


function mostrarEstadoMercado(
    texto
) {

    marketStatus.hidden =
        false;

    marketStatus.textContent =
        texto;
}


function ocultarEstadoMercado() {

    marketStatus.hidden =
        true;
}
