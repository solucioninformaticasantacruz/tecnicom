"use strict";

const TECNICOM_API = {

    baseUrl:
        "https://www.carnesdiaz.cl/api",


    /* =====================================================
       REQUEST GENERAL
    ====================================================== */

    async request(
        endpoint,
        options = {}
    ) {

        const url =
            `${this.baseUrl}/${String(endpoint).replace(/^\/+/, "")}`;


        const config = {

            method:
                options.method || "GET",

            headers: {
                "Accept":
                    "application/json",

                ...(
                    options.headers ||
                    {}
                )
            }
        };


        if (
            options.body !== undefined &&
            options.body !== null
        ) {

            if (
                options.body instanceof FormData
            ) {

                config.body =
                    options.body;

            } else if (
                typeof options.body ===
                "object"
            ) {

                config.headers["Content-Type"] =
                    "application/json";

                config.body =
                    JSON.stringify(
                        options.body
                    );

            } else {

                config.body =
                    options.body;
            }
        }


        try {

            const response =
                await fetch(
                    url,
                    config
                );


            const texto =
                await response.text();


            let resultado =
                null;


            if (
                texto.trim() !== ""
            ) {

                try {

                    resultado =
                        JSON.parse(
                            texto
                        );

                } catch (error) {

                    console.error(
                        "La API no devolvió JSON válido:",
                        texto
                    );


                    throw new Error(
                        "La API devolvió una respuesta inválida."
                    );
                }
            }


            if (
                !response.ok
            ) {

                throw new Error(
                    resultado?.message ||
                    resultado?.error ||
                    `Error HTTP ${response.status}`
                );
            }


            if (
                resultado &&
                resultado.success === false
            ) {

                throw new Error(
                    resultado.message ||
                    "La API informó un error."
                );
            }


            return resultado;

        } catch (error) {

            console.error(
                `Error consultando ${url}:`,
                error
            );


            throw error;
        }
    },


    /* =====================================================
       CONTENIDOS
    ====================================================== */

    async getContenido(
        clave
    ) {

        const resultado =
            await this.request(
                `contenidos/${encodeURIComponent(clave)}`
            );


        return resultado?.data ||
            null;
    },


    /* =====================================================
       SERVICIOS
    ====================================================== */

    async getServicios()
    {
        const resultado =
            await this.request(
                "servicios"
            );

        return resultado?.data ||
            [];
    },


    async getServicio(
        slug
    ) {

        const resultado =
            await this.request(
                `servicios/${encodeURIComponent(slug)}`
            );

        return resultado?.data ||
            null;
    },


    /* =====================================================
       NOTICIAS
    ====================================================== */

    async getNoticias()
    {
        const resultado =
            await this.request(
                "noticias"
            );

        return resultado?.data ||
            [];
    },


    async getNoticia(
        slug
    ) {

        const resultado =
            await this.request(
                `noticias/${encodeURIComponent(slug)}`
            );

        return resultado?.data ||
            null;
    },


    /* =====================================================
       MERCADO SANTA CRUZ
    ====================================================== */

    async getMercado()
    {
        const resultado =
            await this.request(
                "mercado"
            );

        return resultado?.data ||
            [];
    },


    async getMercadoItem(
        slug
    ) {

        const resultado =
            await this.request(
                `mercado/${encodeURIComponent(slug)}`
            );

        return resultado?.data ||
            null;
    },


    async getCategoriasMercado()
    {
        const resultado =
            await this.request(
                "mercado/categorias"
            );

        return resultado?.data ||
            [];
    },


    async getEventosMercado()
    {
        const resultado =
            await this.request(
                "mercado/eventos"
            );

        return resultado?.data ||
            [];
    },


    /* =====================================================
       EL MURO
    ====================================================== */

    async getMuro(
        limit = 100
    ) {

        limit =
            Number.parseInt(
                limit,
                10
            );


        if (
            !Number.isFinite(limit) ||
            limit < 1
        ) {

            limit =
                100;
        }


        limit =
            Math.min(
                limit,
                100
            );


        const resultado =
            await this.request(
                `muro?page=1&limit=${limit}`
            );


        /*
        |--------------------------------------------------------------------------
        | IMPORTANTE
        |--------------------------------------------------------------------------
        |
        | MuroController devuelve:
        |
        | data: {
        |     publicaciones: [...],
        |     paginacion: {...}
        | }
        |
        | mercado-santa-cruz.js necesita recibir solamente el array.
        |
        */


        if (
            Array.isArray(
                resultado?.data?.publicaciones
            )
        ) {

            return resultado.data.publicaciones;
        }


        /*
        | Compatibilidad por si en algún momento
        | la API retorna directamente un array.
        */

        if (
            Array.isArray(
                resultado?.data
            )
        ) {

            return resultado.data;
        }


        return [];
    },


    async getMuroPagina(
        pagina = 1,
        limit = 6,
        tipo = ""
    ) {

        pagina =
            Math.max(
                1,
                Number.parseInt(
                    pagina,
                    10
                ) || 1
            );


        limit =
            Math.min(
                100,
                Math.max(
                    1,
                    Number.parseInt(
                        limit,
                        10
                    ) || 6
                )
            );


        let endpoint;


        if (
            tipo &&
            tipo !== "todos"
        ) {

            endpoint =
                `muro/tipo/${encodeURIComponent(tipo)}?page=${pagina}&limit=${limit}`;

        } else {

            endpoint =
                `muro?page=${pagina}&limit=${limit}`;
        }


        const resultado =
            await this.request(
                endpoint
            );


        return resultado?.data || {
            publicaciones: [],
            paginacion: {
                pagina_actual: pagina,
                por_pagina: limit,
                total_registros: 0,
                total_paginas: 0,
                tiene_anterior: false,
                tiene_siguiente: false
            }
        };
    },


    async getMuroPublicacion(
        id
    ) {

        const resultado =
            await this.request(
                `muro/${encodeURIComponent(id)}`
            );


        return resultado?.data ||
            null;
    },


    async publicarMuro(
        datos
    ) {

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


    async getMuroComentarios(
        publicacionId
    ) {

        const resultado =
            await this.request(
                `muro/${encodeURIComponent(publicacionId)}/comentarios`
            );


        return Array.isArray(
            resultado?.data
        )
            ? resultado.data
            : [];
    },


    async publicarMuroComentario(
        publicacionId,
        datos
    ) {

        return await this.request(
            `muro/${encodeURIComponent(publicacionId)}/comentarios`,
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

    async enviarContacto(
        datos
    ) {

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
