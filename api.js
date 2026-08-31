"use strict";


const TECNICOM_API = {

    baseUrl: "https://www.carnesdiaz.cl/api",


    /* =====================================================
       PETICIÓN GENERAL
    ====================================================== */

    async request(endpoint, options = {}) {

        const url =
            `${this.baseUrl}/${endpoint.replace(/^\/+/, "")}`;


        const config = {

            method:
                options.method || "GET",

            headers: {

                "Accept":
                    "application/json",

                ...options.headers
            },

            ...options
        };


        /* =============================================
           JSON AUTOMÁTICO
        ============================================== */

        if (
            config.body &&
            typeof config.body === "object" &&
            !(config.body instanceof FormData)
        ) {

            config.headers[
                "Content-Type"
            ] = "application/json";


            config.body =
                JSON.stringify(
                    config.body
                );
        }


        try {

            const response =
                await fetch(
                    url,
                    config
                );


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


            /* =========================================
               ERROR HTTP
            ========================================== */

            if (!response.ok) {

                const message =
                    result?.message ||
                    `Error HTTP ${response.status}`;


                throw new Error(
                    message
                );
            }


            /* =========================================
               ERROR INFORMADO POR API
            ========================================== */

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
       CONTENIDOS / MODALES
    ====================================================== */

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


    async getContenidos() {

        const result =
            await this.request(
                "contenidos"
            );


        return result?.data || [];
    },


    async getContenidosPorTipo(tipo) {

        const result =
            await this.request(
                `contenidos/tipo/${encodeURIComponent(tipo)}`
            );


        return result?.data || [];
    },


    /* =====================================================
       SERVICIOS
    ====================================================== */

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
    ====================================================== */

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
    ====================================================== */

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
       EL MURO
    ====================================================== */

    async getMuro(limit = 50) {

        const limite =
            Math.min(
                Math.max(
                    Number(limit) || 50,
                    1
                ),
                100
            );


        const result =
            await this.request(
                `muro?limit=${limite}`
            );


        return result?.data || [];
    },


    async getMuroPorTipo(
        tipo,
        limit = 50
    ) {

        if (!tipo) {

            throw new Error(
                "No se indicó el tipo de publicación."
            );
        }


        const limite =
            Math.min(
                Math.max(
                    Number(limit) || 50,
                    1
                ),
                100
            );


        const result =
            await this.request(
                `muro/tipo/${encodeURIComponent(tipo)}?limit=${limite}`
            );


        return result?.data || [];
    },


    async publicarMuro(datos) {

        if (!datos) {

            throw new Error(
                "No se entregaron los datos de la publicación."
            );
        }


        return await this.request(
            "muro",
            {

                method:
                    "POST",

                body:
                    datos
            }
        );
    },


    /* =====================================================
       CONTACTO
    ====================================================== */

    async enviarContacto(datos) {

        return await this.request(
            "contacto",
            {

                method:
                    "POST",

                body:
                    datos
            }
        );
    }
};


window.TECNICOM_API =
    TECNICOM_API;
