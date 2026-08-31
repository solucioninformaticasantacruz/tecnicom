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
        footer.children.length
    ) {

        articulo.appendChild(
            footer
        );
    }


    articulo.addEventListener(
        "click",
        () => {
            abrirDetalleMuro(
                publicacion.id
            );
        }
    );


    articulo.addEventListener(
        "keydown",
        event => {

            if (
                event.key !== "Enter" &&
                event.key !== " "
            ) {

                return;
            }


            event.preventDefault();


            abrirDetalleMuro(
                publicacion.id
            );
        }
    );


    return articulo;
}


/* =========================================================
   PAGINACIÓN DEL MURO
========================================================= */

function renderPaginacionMuro(
    totalPaginas
) {

    if (
        !muroPaginacion
    ) {

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
        document.createElement(
            "button"
        );


    anterior.type =
        "button";


    anterior.className =
        "muro-pagina-button muro-pagina-anterior";


    anterior.textContent =
        "← Anterior";


    anterior.disabled =
        muroPaginaActual <= 1;


    anterior.addEventListener(
        "click",
        () => {

            if (
                muroPaginaActual <= 1
            ) {

                return;
            }


            muroPaginaActual--;


            renderMuro();


            desplazarAlMuro();
        }
    );


    muroPaginacion.appendChild(
        anterior
    );


    const paginas =
        obtenerPaginasVisiblesMuro(
            totalPaginas
        );


    paginas.forEach(
        pagina => {

            if (
                pagina === "..."
            ) {

                const puntos =
                    document.createElement(
                        "span"
                    );


                puntos.className =
                    "muro-pagina-puntos";


                puntos.textContent =
                    "...";


                muroPaginacion.appendChild(
                    puntos
                );


                return;
            }


            const boton =
                document.createElement(
                    "button"
                );


            boton.type =
                "button";


            boton.className =
                "muro-pagina-button";


            boton.textContent =
                String(
                    pagina
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


            boton.addEventListener(
                "click",
                () => {

                    muroPaginaActual =
                        pagina;


                    renderMuro();


                    desplazarAlMuro();
                }
            );


            muroPaginacion.appendChild(
                boton
            );
        }
    );


    const siguiente =
        document.createElement(
            "button"
        );


    siguiente.type =
        "button";


    siguiente.className =
        "muro-pagina-button muro-pagina-siguiente";


    siguiente.textContent =
        "Siguiente →";


    siguiente.disabled =
        muroPaginaActual >=
        totalPaginas;


    siguiente.addEventListener(
        "click",
        () => {

            if (
                muroPaginaActual >=
                totalPaginas
            ) {

                return;
            }


            muroPaginaActual++;


            renderMuro();


            desplazarAlMuro();
        }
    );


    muroPaginacion.appendChild(
        siguiente
    );
}


/* =========================================================
   PÁGINAS VISIBLES
========================================================= */

function obtenerPaginasVisiblesMuro(
    totalPaginas
) {

    if (
        totalPaginas <= 7
    ) {

        return Array.from(
            {
                length:
                    totalPaginas
            },
            (
                _,
                indice
            ) =>
                indice + 1
        );
    }


    const paginas =
        [];


    paginas.push(
        1
    );


    if (
        muroPaginaActual > 4
    ) {

        paginas.push(
            "..."
        );
    }


    const inicio =
        Math.max(
            2,
            muroPaginaActual - 1
        );


    const fin =
        Math.min(
            totalPaginas - 1,
            muroPaginaActual + 1
        );


    for (
        let pagina = inicio;
        pagina <= fin;
        pagina++
    ) {

        paginas.push(
            pagina
        );
    }


    if (
        muroPaginaActual <
        totalPaginas - 3
    ) {

        paginas.push(
            "..."
        );
    }


    paginas.push(
        totalPaginas
    );


    return paginas;
}


/* =========================================================
   DESPLAZAR HACIA EL MURO
========================================================= */

function desplazarAlMuro() {

    const seccion =
        document.querySelector(
            ".muro-section"
        );


    if (
        !seccion
    ) {

        return;
    }


    const posicion =
        seccion.getBoundingClientRect().top +
        window.scrollY -
        20;


    window.scrollTo({
        top:
            posicion,

        behavior:
            "smooth"
    });
}


/* =========================================================
   ESTADO DEL MURO
========================================================= */

function mostrarEstadoMuro(
    mensaje
) {

    if (
        !muroStatus
    ) {

        return;
    }


    muroStatus.textContent =
        mensaje;


    muroStatus.hidden =
        false;


    if (
        muroGrid
    ) {

        muroGrid.innerHTML =
            "";
    }
}


function ocultarEstadoMuro() {

    if (
        muroStatus
    ) {

        muroStatus.hidden =
            true;
    }
}


/* =========================================================
   NOMBRE DEL TIPO
========================================================= */

function nombreTipo(
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
   MODAL DETALLE DEL MURO
========================================================= */

async function abrirDetalleMuro(
    publicacionId
) {

    if (
        !muroDetalleModal
    ) {

        return;
    }


    publicacionId =
        Number.parseInt(
            publicacionId,
            10
        );


    if (
        !Number.isFinite(
            publicacionId
        ) ||
        publicacionId < 1
    ) {

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | BUSCAR PRIMERO EN LAS PUBLICACIONES YA CARGADAS
    |--------------------------------------------------------------------------
    */

    let publicacion =
        muroPublicaciones.find(
            item =>
                Number(
                    item.id
                ) ===
                publicacionId
        );


    /*
    |--------------------------------------------------------------------------
    | SI NO ESTÁ EN MEMORIA, CONSULTAR API
    |--------------------------------------------------------------------------
    */

    if (
        !publicacion
    ) {

        try {

            publicacion =
                await TECNICOM_API
                    .getMuroPublicacion(
                        publicacionId
                    );

        } catch (error) {

            console.error(
                error
            );


            return;
        }
    }


    if (
        !publicacion
    ) {

        return;
    }


    /*
    |--------------------------------------------------------------------------
    | TIPO
    |--------------------------------------------------------------------------
    */

    const tipo =
        publicacion.tipo ||
        "informacion";


    if (
        muroDetalleTipo
    ) {

        muroDetalleTipo.className =
            `muro-tipo muro-tipo-${tipo}`;


        muroDetalleTipo.textContent =
            nombreTipo(
                tipo
            );
    }


    /*
    |--------------------------------------------------------------------------
    | FECHA
    |--------------------------------------------------------------------------
    */

    if (
        muroDetalleFecha
    ) {

        muroDetalleFecha.textContent =
            formatearFechaCompleta(
                publicacion.fecha_publicacion ||
                publicacion.fecha_creacion
            );
    }


    /*
    |--------------------------------------------------------------------------
    | TÍTULO
    |--------------------------------------------------------------------------
    */

    if (
        muroDetalleAnuncioTitulo
    ) {

        muroDetalleAnuncioTitulo.textContent =
            publicacion.titulo ||
            "";
    }


    /*
    |--------------------------------------------------------------------------
    | MENSAJE
    |--------------------------------------------------------------------------
    */

    if (
        muroDetalleMensaje
    ) {

        muroDetalleMensaje.textContent =
            publicacion.mensaje ||
            "";
    }


    /*
    |--------------------------------------------------------------------------
    | AUTOR
    |--------------------------------------------------------------------------
    */

    if (
        muroDetalleAutorWrap
    ) {

        if (
            publicacion.nombre
        ) {

            muroDetalleAutorWrap.hidden =
                false;


            if (
                muroDetalleAutor
            ) {

                muroDetalleAutor.textContent =
                    publicacion.nombre;
            }

        } else {

            muroDetalleAutorWrap.hidden =
                true;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | CONTACTO
    |--------------------------------------------------------------------------
    */

    if (
        muroDetalleContactoWrap
    ) {

        if (
            publicacion.contacto
        ) {

            muroDetalleContactoWrap.hidden =
                false;


            if (
                muroDetalleContacto
            ) {

                muroDetalleContacto.textContent =
                    publicacion.contacto;
            }

        } else {

            muroDetalleContactoWrap.hidden =
                true;
        }
    }


    /*
    |--------------------------------------------------------------------------
    | PREPARAR FORMULARIO DE COMENTARIO
    |--------------------------------------------------------------------------
    */

    if (
        muroComentarioPublicacionId
    ) {

        muroComentarioPublicacionId.value =
            String(
                publicacionId
            );
    }


    if (
        muroComentarioForm
    ) {

        muroComentarioForm.reset();
    }


    if (
        muroComentarioPublicacionId
    ) {

        muroComentarioPublicacionId.value =
            String(
                publicacionId
            );
    }


    actualizarContadorComentario();


    ocultarEstadoComentario();


    /*
    |--------------------------------------------------------------------------
    | MOSTRAR MODAL
    |--------------------------------------------------------------------------
    */

    muroDetalleModal.hidden =
        false;


    document.body.classList.add(
        "muro-modal-abierto"
    );


    /*
    |--------------------------------------------------------------------------
    | CARGAR COMENTARIOS
    |--------------------------------------------------------------------------
    */

    await cargarComentariosMuro(
        publicacionId
    );
}


/* =========================================================
   CERRAR DETALLE
========================================================= */

function cerrarDetalleMuro() {

    if (
        !muroDetalleModal
    ) {

        return;
    }


    muroDetalleModal.hidden =
        true;


    document.body.classList.remove(
        "muro-modal-abierto"
    );


    if (
        muroComentariosLista
    ) {

        muroComentariosLista.innerHTML =
            "";
    }


    if (
        muroComentarioForm
    ) {

        muroComentarioForm.reset();
    }


    actualizarContadorComentario();


    ocultarEstadoComentario();
}


/* =========================================================
   CARGAR COMENTARIOS
========================================================= */

async function cargarComentariosMuro(
    publicacionId
) {

    if (
        muroComentariosStatus
    ) {

        muroComentariosStatus.hidden =
            false;


        muroComentariosStatus.textContent =
            "Cargando comentarios...";
    }


    if (
        muroComentariosLista
    ) {

        muroComentariosLista.innerHTML =
            "";
    }


    try {

        const comentarios =
            await TECNICOM_API
                .getMuroComentarios(
                    publicacionId
                );


        renderComentariosMuro(
            comentarios
        );

    } catch (error) {

        console.error(
            error
        );


        if (
            muroComentariosStatus
        ) {

            muroComentariosStatus.hidden =
                false;


            muroComentariosStatus.textContent =
                "No fue posible cargar los comentarios.";
        }


        if (
            muroComentariosCantidad
        ) {

            muroComentariosCantidad.textContent =
                "0 comentarios";
        }
    }
}


/* =========================================================
   MOSTRAR COMENTARIOS
========================================================= */

function renderComentariosMuro(
    comentarios
) {

    comentarios =
        Array.isArray(
            comentarios
        )
            ? comentarios
            : [];


    if (
        muroComentariosCantidad
    ) {

        const cantidad =
            comentarios.length;


        muroComentariosCantidad.textContent =
            cantidad === 1
                ? "1 comentario"
                : `${cantidad} comentarios`;
    }


    if (
        !muroComentariosLista
    ) {

        return;
    }


    muroComentariosLista.innerHTML =
        "";


    if (
        !comentarios.length
    ) {

        if (
            muroComentariosStatus
        ) {

            muroComentariosStatus.hidden =
                false;


            muroComentariosStatus.textContent =
                "Todavía no hay comentarios. Puedes ser el primero en comentar.";
        }


        return;
    }


    if (
        muroComentariosStatus
    ) {

        muroComentariosStatus.hidden =
            true;
    }


    comentarios.forEach(
        comentario => {

            muroComentariosLista.appendChild(
                crearComentarioMuro(
                    comentario
                )
            );
        }
    );
}


/* =========================================================
   CREAR COMENTARIO
========================================================= */

function crearComentarioMuro(
    comentario
) {

    const articulo =
        document.createElement(
            "article"
        );


    articulo.className =
        "muro-comentario";


    const cabecera =
        document.createElement(
            "div"
        );


    cabecera.className =
        "muro-comentario-header";


    const nombre =
        document.createElement(
            "strong"
        );


    nombre.className =
        "muro-comentario-nombre";


    nombre.textContent =
        comentario.nombre ||
        "Anónimo";


    const fecha =
        document.createElement(
            "time"
        );


    fecha.className =
        "muro-comentario-fecha";


    fecha.textContent =
        formatearFechaRelativa(
            comentario.fecha_publicacion ||
            comentario.fecha_creacion
        );


    cabecera.append(
        nombre,
        fecha
    );


    const texto =
        document.createElement(
            "p"
        );


    texto.className =
        "muro-comentario-texto";


    texto.textContent =
        comentario.comentario ||
        "";


    articulo.append(
        cabecera,
        texto
    );


    return articulo;
}


/* =========================================================
   ENVIAR COMENTARIO
========================================================= */

async function enviarComentarioMuro(
    event
) {

    event.preventDefault();


    if (
        muroComentarioEnviando
    ) {

        return;
    }


    const publicacionId =
        Number.parseInt(
            muroComentarioPublicacionId?.value ||
            "",
            10
        );


    if (
        !Number.isFinite(
            publicacionId
        ) ||
        publicacionId < 1
    ) {

        mostrarEstadoComentario(
            "No fue posible identificar la publicación.",
            "error"
        );


        return;
    }


    const nombre =
        (
            muroComentarioNombre?.value ||
            ""
        ).trim();


    const comentario =
        (
            muroComentarioTexto?.value ||
            ""
        ).trim();


    /*
    |--------------------------------------------------------------------------
    | VALIDACIÓN NOMBRE
    |--------------------------------------------------------------------------
    */

    if (
        nombre.length < 2 ||
        nombre.length > 80
    ) {

        mostrarEstadoComentario(
            "Escribe un nombre de entre 2 y 80 caracteres.",
            "error"
        );


        muroComentarioNombre?.focus();


        return;
    }


    /*
    |--------------------------------------------------------------------------
    | VALIDACIÓN COMENTARIO
    |--------------------------------------------------------------------------
    */

    if (
        comentario.length < 2 ||
        comentario.length > 300
    ) {

        mostrarEstadoComentario(
            "El comentario debe tener entre 2 y 300 caracteres.",
            "error"
        );


        muroComentarioTexto?.focus();


        return;
    }


    muroComentarioEnviando =
        true;


    if (
        muroComentarioEnviar
    ) {

        muroComentarioEnviar.disabled =
            true;


        muroComentarioEnviar.textContent =
            "Enviando...";
    }


    mostrarEstadoComentario(
        "Enviando comentario...",
        "cargando"
    );


    try {

        const resultado =
            await TECNICOM_API
                .publicarMuroComentario(
                    publicacionId,
                    {
                        nombre,
                        comentario
                    }
                );


        /*
        |--------------------------------------------------------------------------
        | EL BACKEND DEJA EL COMENTARIO PENDIENTE
        |--------------------------------------------------------------------------
        */

        muroComentarioForm?.reset();


        if (
            muroComentarioPublicacionId
        ) {

            muroComentarioPublicacionId.value =
                String(
                    publicacionId
                );
        }


        actualizarContadorComentario();


        mostrarEstadoComentario(
            resultado?.data?.mensaje ||
            resultado?.message ||
            "Tu comentario fue recibido y será revisado antes de aparecer públicamente.",
            "exito"
        );


        /*
        | Volvemos a consultar los comentarios publicados.
        | Como el nuevo queda pendiente, normalmente no
        | aparecerá hasta ser aprobado.
        */

        await cargarComentariosMuro(
            publicacionId
        );


    } catch (error) {

        console.error(
            error
        );


        mostrarEstadoComentario(
            error.message ||
            "No fue posible enviar el comentario.",
            "error"
        );

    } finally {

        muroComentarioEnviando =
            false;


        if (
            muroComentarioEnviar
        ) {

            muroComentarioEnviar.disabled =
                false;


            muroComentarioEnviar.textContent =
                "Publicar comentario";
        }
    }
}


/* =========================================================
   CONTADOR COMENTARIO
========================================================= */

function actualizarContadorComentario() {

    if (
        !muroComentarioContador
    ) {

        return;
    }


    const cantidad =
        muroComentarioTexto?.value.length ||
        0;


    muroComentarioContador.textContent =
        `${cantidad}/300`;
}


/* =========================================================
   ESTADO COMENTARIO
========================================================= */

function mostrarEstadoComentario(
    mensaje,
    tipo = ""
) {

    if (
        !muroComentarioStatus
    ) {

        return;
    }


    muroComentarioStatus.hidden =
        false;


    muroComentarioStatus.className =
        "muro-form-status";


    if (
        tipo
    ) {

        muroComentarioStatus.classList.add(
            tipo
        );
    }


    muroComentarioStatus.textContent =
        mensaje;
}


function ocultarEstadoComentario() {

    if (
        !muroComentarioStatus
    ) {

        return;
    }


    muroComentarioStatus.hidden =
        true;


    muroComentarioStatus.textContent =
        "";


    muroComentarioStatus.className =
        "muro-form-status";
}


/* =========================================================
   MODAL PUBLICAR EN EL MURO
========================================================= */

function abrirModalMuro() {

    if (
        !muroModal
    ) {

        return;
    }


    muroForm?.reset();


    actualizarContadorTitulo();

    actualizarContadorMensaje();

    actualizarAvisoReclamo();

    ocultarEstadoFormularioMuro();


    muroModal.hidden =
        false;


    document.body.classList.add(
        "muro-modal-abierto"
    );


    window.setTimeout(
        () => {

            muroTipo?.focus();

        },
        50
    );
}


/* =========================================================
   CERRAR MODAL PUBLICACIÓN
========================================================= */

function cerrarModalMuro() {

    if (
        !muroModal
    ) {

        return;
    }


    if (
        muroEnviando
    ) {

        return;
    }


    muroModal.hidden =
        true;


    document.body.classList.remove(
        "muro-modal-abierto"
    );


    muroForm?.reset();


    actualizarContadorTitulo();

    actualizarContadorMensaje();

    actualizarAvisoReclamo();

    ocultarEstadoFormularioMuro();
}


/* =========================================================
   CONTADORES FORMULARIO
========================================================= */

function actualizarContadorTitulo() {

    if (
        !muroTituloContador
    ) {

        return;
    }


    const cantidad =
        muroTitulo?.value.length ||
        0;


    muroTituloContador.textContent =
        `${cantidad}/120`;
}


function actualizarContadorMensaje() {

    if (
        !muroMensajeContador
    ) {

        return;
    }


    const cantidad =
        muroMensaje?.value.length ||
        0;


    muroMensajeContador.textContent =
        `${cantidad}/500`;
}


/* =========================================================
   AVISO RECLAMO
========================================================= */

function actualizarAvisoReclamo() {

    if (
        !muroReclamoAviso
    ) {

        return;
    }


    muroReclamoAviso.hidden =
        muroTipo?.value !==
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


    const tipo =
        (
            muroTipo?.value ||
            ""
        ).trim();


    const titulo =
        (
            muroTitulo?.value ||
            ""
        ).trim();


    const mensaje =
        (
            muroMensaje?.value ||
            ""
        ).trim();


    const nombre =
        (
            muroNombre?.value ||
            ""
        ).trim();


    const contacto =
        (
            muroContacto?.value ||
            ""
        ).trim();


    const tiposPermitidos = [
        "informacion",
        "reclamo",
        "necesito",
        "ofrezco"
    ];


    if (
        !tiposPermitidos.includes(
            tipo
        )
    ) {

        mostrarEstadoFormularioMuro(
            "Selecciona un tipo de publicación válido.",
            "error"
        );


        return;
    }


    if (
        titulo.length < 3 ||
        titulo.length > 120
    ) {

        mostrarEstadoFormularioMuro(
            "El título debe tener entre 3 y 120 caracteres.",
            "error"
        );


        muroTitulo?.focus();


        return;
    }


    if (
        mensaje.length < 5 ||
        mensaje.length > 500
    ) {

        mostrarEstadoFormularioMuro(
            "El mensaje debe tener entre 5 y 500 caracteres.",
            "error"
        );


        muroMensaje?.focus();


        return;
    }


    if (
        nombre.length > 100
    ) {

        mostrarEstadoFormularioMuro(
            "El nombre no puede superar los 100 caracteres.",
            "error"
        );


        return;
    }


    if (
        contacto.length > 150
    ) {

        mostrarEstadoFormularioMuro(
            "El contacto no puede superar los 150 caracteres.",
            "error"
        );


        return;
    }


    muroEnviando =
        true;


    if (
        muroEnviarButton
    ) {

        muroEnviarButton.disabled =
            true;


        muroEnviarButton.textContent =
            "Enviando...";
    }


    mostrarEstadoFormularioMuro(
        "Enviando publicación...",
        "cargando"
    );


    try {

        const resultado =
            await TECNICOM_API
                .publicarMuro({
                    tipo,
                    titulo,
                    mensaje,
                    nombre,
                    contacto
                });


        mostrarEstadoFormularioMuro(
            resultado?.data?.mensaje ||
            resultado?.message ||
            "Tu publicación fue recibida y será revisada antes de aparecer en El Muro.",
            "exito"
        );


        muroForm?.reset();


        actualizarContadorTitulo();

        actualizarContadorMensaje();

        actualizarAvisoReclamo();


    } catch (error) {

        console.error(
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


        if (
            muroEnviarButton
        ) {

            muroEnviarButton.disabled =
                false;


            muroEnviarButton.textContent =
                "Enviar publicación";
        }
    }
}


/* =========================================================
   ESTADO FORMULARIO MURO
========================================================= */

function mostrarEstadoFormularioMuro(
    mensaje,
    tipo = ""
) {

    if (
        !muroFormStatus
    ) {

        return;
    }


    muroFormStatus.hidden =
        false;


    muroFormStatus.className =
        "muro-form-status";


    if (
        tipo
    ) {

        muroFormStatus.classList.add(
            tipo
        );
    }


    muroFormStatus.textContent =
        mensaje;
}


function ocultarEstadoFormularioMuro() {

    if (
        !muroFormStatus
    ) {

        return;
    }


    muroFormStatus.hidden =
        true;


    muroFormStatus.textContent =
        "";


    muroFormStatus.className =
        "muro-form-status";
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


/* =========================================================
   CATEGORÍAS
========================================================= */

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


/* =========================================================
   FILTRADO
========================================================= */

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


/* =========================================================
   RENDER MERCADO
========================================================= */

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


/* =========================================================
   TARJETA MERCADO
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


/* =========================================================
   MOSTRAR DETALLE
========================================================= */

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


/* =========================================================
   OCULTAR LISTADO AL VER DETALLE
========================================================= */

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


/* =========================================================
   VOLVER AL LISTADO
========================================================= */

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


/* =========================================================
   FECHAS
========================================================= */

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


/* =========================================================
   SLUG
========================================================= */

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


/* =========================================================
   ESTADO MERCADO
========================================================= */

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
