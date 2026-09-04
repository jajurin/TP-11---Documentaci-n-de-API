import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'API de Jajurin Y Laizerovich - Provincias',
        description: 'API REST CRUD de provincias argentinas utilizando datos en memoria.',
        version: '1.0.0'
    },

    host: 'localhost:3000',
    schemes: ['http'],

    definitions: {
        Provincia: {
            id: 1,
            name: 'Buenos Aires',
            full_name: 'Provincia de Buenos Aires',
            latitude: '-36.6769',
            longitude: '-60.5588',
            display_order: 1
        },

        ProvinciaInput: {
            name: 'Buenos Aires',
            full_name: 'Provincia de Buenos Aires',
            latitude: '-36.6769',
            longitude: '-60.5588',
            display_order: 1
        }
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['./index.js'];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    import('./index.js');
});