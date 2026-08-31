"use strict";


/* =========================================================
   TECNICOM - MODAL DINÁMICO
   =========================================================

   Todos los elementos que tengan:

       data-contenido="clave"

   abrirán este mismo modal.

   Ejemplo:

       data-contenido="mysql"

   consulta:

       /api/contenidos/mysql

   ========================================================= */


const ModalContenido = {

    modal: null,

    box: null,

    titulo: null,

    subtitulo: null,

    descripcion: null,

    detalle: null,

    imagen: null,

    botonCerrar: null,

    elementoAnterior: null,


    /* =====================================================
       INICIALIZACIÓN
    ===================================================== */

    init() {

        this.modal =
            document.getElementById(
                "modalContenido"
            );


        /*
         * Si el HTML todavía no tiene el modal,
         * evitamos errores JavaScript.
         */

        if (!this.modal) {

            console.warn(
                "No se encontró #modalContenido."
            );

            return;
        }


        this.box =
            this.modal.querySelector(
                ".modal-contenido-box"
            );


        this.titulo =
            document.getElementById(
                "modalTitulo"
            );


        this.subtitulo =
            document.getElementById(
                "modalSubtitulo"
            );


        this.descripcion =
            document.getElementById(
                "modalDescripcion"
            );


        this.detalle =
            document.getElementById(
                "modalDetalle"
            );


        this.imagen =
            document.getElementById(
                "modalImagen"
            );


        this.botonCerrar =
            document.getElementById(
                "modalCerrar"
            );


        this.registrarElementos();

        this.registrarEventosModal();


        console.log(
            "Modal dinámico TECNICOM inicializado."
        );
    },


    /* =====================================================
       ELEMENTOS data-contenido
    ===================================================== */

    registrarElementos() {

        const elementos =
            document.querySelectorAll(
                "[data-contenido]"
            );


        elementos.forEach(
            elemento => {

                /*
                 * CLICK
                 */

                elemento.addEventListener(
                    "click",
                    event => {

                        /*
                         * Si posteriormente ponemos un enlace
                         * dentro de una tarjeta, no queremos
                         * interferir con ese enlace.
                         */

                        const enlace =
                            event.target.closest("a");

                        if (enlace) {
                            return;
                        }


                        const clave =
                            elemento.dataset.contenido;


                        if (!clave) {
                            return;
                        }


                        this.elementoAnterior =
                            elemento;


                        this.abrir(
                            clave
                        );
                    }
                );


                /*
                 * ACCESIBILIDAD:
                 * ENTER / ESPACIO
                 */

                elemento.addEventListener(
                    "keydown",
                    event => {

                        if (
                            event.key !== "Enter" &&
                            event.key !== " "
                        ) {
                            return;
                        }


                        event.preventDefault();


                        const clave =
                            elemento.dataset.contenido;


                        if (!clave) {
                            return;
                        }


                        this.elementoAnterior =
                            elemento;


                        this.abrir(
                            clave
                        );
                    }
                );

            }
        );


        console.log(
            `${elementos.length} contenidos dinámicos encontrados.`
        );
    },


    /* =====================================================
       EVENTOS DEL MODAL
    ===================================================== */

    registrarEventosModal() {

        /*
         * BOTÓN X
         */

        this.botonCerrar
            ?.addEventListener(
                "click",
                () => {

                    this.cerrar();

                }
            );


        /*
         * CLICK FUERA DEL MODAL
         */

        this.modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === this.modal
                ) {

                    this.cerrar();

                }

            }
        );


        /*
         * ESCAPE
         */

        document.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Escape" &&
                    this.estaAbierto()
                ) {

                    this.cerrar();

                }

            }
        );
    },


    /* =====================================================
       ABRIR
    ===================================================== */

    async abrir(clave) {

        if (!clave) {
            return;
        }


        /*
         * Abrimos inmediatamente.
         */

        this.mostrar();


        /*
         * Mostramos estado de carga.
         */

        this.mostrarCargando();


        try {

            /*
             * Consultamos API
             */

            const contenido =
                await window.TECNICOM_API
                    .getContenido(clave);


            /*
             * Renderizamos información.
             */

            this.renderizar(
                contenido
            );


        } catch (error) {

            console.error(
                "Error cargando modal:",
                error
            );


            this.mostrarError(
                error.message
            );

        }
    },


    /* =====================================================
       MOSTRAR MODAL
    ===================================================== */

    mostrar() {

        this.modal.classList.add(
            "activo"
        );


        this.modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "modal-abierto"
        );


        /*
         * Ponemos el foco en cerrar.
         */

        window.setTimeout(
            () => {

                this.botonCerrar?.focus();

            },
            100
        );
    },


    /* =====================================================
       CERRAR MODAL
    ===================================================== */

    cerrar() {

        this.modal.classList.remove(
            "activo"
        );


        this.modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "modal-abierto"
        );


        /*
         * Devolvemos foco al elemento
         * que abrió el modal.
         */

        if (this.elementoAnterior) {

            this.elementoAnterior.focus();

        }
    },


    /* =====================================================
       ESTADO
    ===================================================== */

    estaAbierto() {

        return this.modal.classList.contains(
            "activo"
        );
    },


    /* =====================================================
       CARGANDO
    ===================================================== */

    mostrarCargando() {

        this.titulo.textContent =
            "Cargando...";


        this.subtitulo.textContent =
            "";


        this.descripcion.textContent =
            "";


        this.detalle.innerHTML =
            "";


        this.ocultarImagen();
    },


    /* =====================================================
       RENDERIZAR CONTENIDO
    ===================================================== */

    renderizar(contenido) {

        /*
         * TÍTULO
         */

        this.titulo.textContent =
            contenido.titulo || "";


        /*
         * SUBTÍTULO
         */

        this.subtitulo.textContent =
            contenido.subtitulo || "";


        /*
         * Ocultamos subtítulo si está vacío.
         */

        this.subtitulo.style.display =
            contenido.subtitulo
                ? ""
                : "none";


        /*
         * DESCRIPCIÓN
         */

        this.descripcion.textContent =
            contenido.descripcion || "";


        /*
         * DETALLE
         *
         * Este campo puede contener HTML
         * almacenado por nosotros en MySQL.
         */

        this.detalle.innerHTML =
            contenido.detalle || "";


        /*
         * IMAGEN
         */

        if (contenido.imagen) {

            this.mostrarImagen(
                contenido.imagen,
                contenido.titulo
            );

        } else {

            this.ocultarImagen();

        }


        /*
         * Reiniciamos scroll del modal.
         */

        if (this.box) {

            this.box.scrollTop = 0;

        }
    },


    /* =====================================================
       IMAGEN
    ===================================================== */

    mostrarImagen(
        url,
        titulo = "TECNICOM"
    ) {

        if (!this.imagen) {
            return;
        }


        this.imagen.src =
            url;


        this.imagen.alt =
            titulo || "TECNICOM";


        this.imagen.hidden =
            false;
    },


    ocultarImagen() {

        if (!this.imagen) {
            return;
        }


        this.imagen.hidden =
            true;


        this.imagen.removeAttribute(
            "src"
        );


        this.imagen.alt =
            "";
    },


    /* =====================================================
       ERROR
    ===================================================== */

    mostrarError(mensaje) {

        this.titulo.textContent =
            "No fue posible cargar la información";


        this.subtitulo.textContent =
            "";


        this.subtitulo.style.display =
            "none";


        this.descripcion.textContent =
            mensaje ||
            "Ocurrió un problema al consultar la información.";


        this.detalle.innerHTML =
            `
                <p class="modal-error">
                    Intenta nuevamente en unos segundos.
                </p>
            `;


        this.ocultarImagen();
    }

};


/* =========================================================
   INICIAR CUANDO EL HTML ESTÉ LISTO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*
         * Verificamos que api.js haya sido
         * cargado antes de modal.js.
         */

        if (!window.TECNICOM_API) {

            console.error(
                "TECNICOM_API no está disponible. " +
                "Verifica que api.js se cargue antes de modal.js."
            );

            return;
        }


        ModalContenido.init();

    }
);


/* =========================================================
   DISPONIBILIDAD GLOBAL
========================================================= */

window.ModalContenido =
    ModalContenido;
