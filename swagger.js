import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Jajurin Y Laizerovich - Provincias',
        description: 'API REST CRUD de provincias argentinas, con persistencia en PostgreSQL (Supabase).',
        version: '1.0.0'
    },

    host: 'localhost:3000',
    schemes: ['http'],

    '@definitions': {

        Provincia: {
            type: "object",
            properties: {
                id: { type: "number", example: 1, description: "Identificador único de la provincia, generado automáticamente por el sistema." },
                name: { type: "string", example: "Buenos Aires", description: "Nombre corto o de uso común de la provincia." },
                full_name: { type: "string", example: "Provincia de Buenos Aires", description: "Nombre oficial completo de la provincia." },
                latitude: { type: "string", example: "-36.6769", description: "Latitud geográfica del centro de la provincia. Se almacena como texto para conservar el formato numérico exacto (incluye signo y decimales)." },
                longitude: { type: "string", example: "-60.5588", description: "Longitud geográfica del centro de la provincia. Se almacena como texto por el mismo motivo que la latitud." },
                display_order: { type: "number", example: 1, description: "Orden numérico utilizado para mostrar las provincias en listados (por ejemplo, de norte a sur). Es opcional." }
            }
        },

        ProvinciaInput: {
            type: "object",
            required: ["name", "full_name", "latitude", "longitude"],
            properties: {
                name: { type: "string", description: "Nombre corto o de uso común de la provincia." },
                full_name: { type: "string", description: "Nombre oficial completo de la provincia." },
                latitude: { type: "string", description: "Latitud geográfica del centro de la provincia (numérica, en formato texto)." },
                longitude: { type: "string", description: "Longitud geográfica del centro de la provincia (numérica, en formato texto)." },
                display_order: { type: "number", description: "Orden numérico opcional utilizado para mostrar las provincias en listados." }
            },
            example: {
                name: "Córdoba",
                full_name: "Provincia de Córdoba",
                latitude: "-31.4",
                longitude: "-64.18",
                display_order: 5
            }
        },

        ProvinciaNombreInput: {
            type: "object",
            required: ["name"],
            properties: {
                name: { type: "string", description: "Nuevo nombre corto de la provincia (mínimo 3 caracteres).", example: "Santa Fe" }
            }
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    import('./index.js');
});