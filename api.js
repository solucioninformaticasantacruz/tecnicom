"use strict";


/* =========================================================
   TECNICOM - CLIENTE API REST
   =========================================================

   Este archivo centraliza todas las comunicaciones
   entre el sitio web TECNICOM y la API PHP.

   API:
   https://www.carnesdiaz.cl/api/

   ========================================================= */


const TECNICOM_API = {

    /* -----------------------------------------------------
       CONFIGURACIÓN
    ----------------------------------------------------- */

    baseUrl: "https://www.carnesdiaz.cl/api",


    /* -----------------------------------------------------
       PETICIÓN GENERAL
    ----------------------------------------------------- */

    async request(endpoint, options = {}) {

        const url =
            `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;


        const config = {

            method:
                options.method || "GET",

            headers: {
                "Accept": "application/json",

                ...options.headers
            },

            ...options
        };


        /*
         * Si enviamos un body como objeto JavaScript,
         * lo convertimos automáticamente a JSON.
         */

        if (
            config.body &&
            typeof config.body === "object" &&
            !(config.body instanceof FormData)
        ) {

            config.headers["Content-Type"] =
                "application/json";

            config.body =
                JSON.stringify(config.body);
        }


        try {

            const response =
                await fetch(
                    url,
                    config
                );


            /*
             * Intentamos obtener JSON.
             *
             * Primero usamos text() para poder detectar
             * respuestas PHP inválidas, warnings, HTML, etc.
             */

            const responseText =
                await response.text();


            let result;

            try {

                result =
                    responseText
                        ? JSON.parse(responseText)
                        : null;

            } catch (error) {

                console.error(
                    "La API no devolvió JSON válido:",
                    responseText
                );

                throw new Error(
                    "La API devolvió una respuesta inválida."
                );
            }


            /*
             * Error HTTP
             */

            if (!response.ok) {

                const message =
                    result?.message ||
                    `Error HTTP ${response.status}`;

                throw new Error(message);
            }


            /*
             * La API TECNICOM utiliza:
             *
             * {
             *     success: true,
             *     data: ...
             * }
             */

            if (
                result &&
                result.success === false
            ) {

                throw new Error(
                    result.message ||
                    "La API informó un error."
                );
            }


            return result;

        } catch (error) {

            console.error(
                `Error consultando ${url}:`,
                error
            );

            throw error;
        }
    },


    /* =====================================================
       CONTENIDOS DEL MODAL
    ===================================================== */

    async getContenido(clave) {

        if (!clave) {

            throw new Error(
                "No se indicó la clave del contenido."
            );
        }


        const result =
            await this.request(
                `contenidos/${encodeURIComponent(clave)}`
            );


        if (!result?.data) {

            throw new Error(
                "No se encontró información para este contenido."
            );
        }


        return result.data;
    },


    /* =====================================================
       SERVICIOS
    ===================================================== */

    async getServicios() {

        const result =
            await this.request(
                "servicios"
            );

        return result?.data || [];
    },


    async getServicio(slug) {

        const result =
            await this.request(
                `servicios/${encodeURIComponent(slug)}`
            );

        return result?.data || null;
    },


    /* =====================================================
       NOTICIAS
       Lo utilizaremos posteriormente en noticias.html
    ===================================================== */

    async getNoticias() {

        const result =
            await this.request(
                "noticias"
            );

        return result?.data || [];
    },


    async getNoticia(slug) {

        const result =
            await this.request(
                `noticias/${encodeURIComponent(slug)}`
            );

        return result?.data || null;
    },


    /* =====================================================
       MERCADO SANTA CRUZ
       Lo utilizaremos posteriormente.
    ===================================================== */

    async getMercado() {

        const result =
            await this.request(
                "mercado"
            );

        return result?.data || [];
    },


    async getMercadoItem(slug) {

        const result =
            await this.request(
                `mercado/${encodeURIComponent(slug)}`
            );

        return result?.data || null;
    },


    async getCategoriasMercado() {

        const result =
            await this.request(
                "mercado/categorias"
            );

        return result?.data || [];
    },


    async getEventosMercado() {

        const result =
            await this.request(
                "mercado/eventos"
            );

        return result?.data || [];
    },


    /* =====================================================
       CONTACTO
       Lo podremos utilizar posteriormente.
    ===================================================== */

    async enviarContacto(datos) {

        const result =
            await this.request(
                "contacto",
                {
                    method: "POST",

                    body: datos
                }
            );

        return result;
    }

};


/* =========================================================
   DISPONIBILIDAD GLOBAL
========================================================= */

/*
 * Esto permite usar TECNICOM_API desde otros archivos
 * como modal.js.
 */

window.TECNICOM_API =
    TECNICOM_API;
