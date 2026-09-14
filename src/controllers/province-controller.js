import { Router } from 'express';
import ProvinceService from '../services/province-service.js';

const router = Router();
const svc = new ProvinceService();

// GET /api/province
router.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Obtiene todas las provincias'
        #swagger.description = 'Devuelve el listado completo de provincias argentinas cargadas en el sistema, sin aplicar filtros ni un orden particular.'

        #swagger.responses[200] = {
            description: 'Lista de todas las provincias',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Provincia' }
            }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        const provinces = await svc.getAllAsync();
        return res.status(200).json(provinces);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});


// GET /api/province/search?name=...
router.get('/search', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Busca provincias por nombre'
        #swagger.description = 'Filtra el listado de provincias devolviendo únicamente aquellas cuyo nombre contenga el texto recibido por query string (búsqueda parcial, sin distinguir mayúsculas/minúsculas).'

        #swagger.parameters['name'] = {
            in: 'query',
            description: 'Texto a buscar dentro del nombre de la provincia',
            required: true,
            type: 'string'
        }

        #swagger.responses[200] = {
            description: 'Provincias que coinciden con la búsqueda',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Provincia' }
            }
        }

        #swagger.responses[400] = {
            description: 'Falta el parámetro name',
            schema: { example: 'El parámetro "name" es requerido.' }
        }

        #swagger.responses[404] = {
            description: 'No se encontraron provincias que coincidan con el nombre buscado',
            schema: { example: 'No se encontraron provincias con ese nombre.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).send('El parámetro "name" es requerido.');
        }

        const provinces = await svc.searchByNameAsync(name);

        if (provinces.length === 0) {
            return res.status(404).send('No se encontraron provincias con ese nombre.');
        }

        return res.status(200).json(provinces);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});


// GET /api/province/order?sort=asc|desc
router.get('/order', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Obtiene todas las provincias ordenadas por display_order'
        #swagger.description = 'Devuelve el listado completo de provincias ordenado según el campo display_order. Si no se especifica el parámetro sort, se ordena de forma ascendente por defecto. Los únicos valores válidos para sort son "asc" y "desc".'

        #swagger.parameters['sort'] = {
            in: 'query',
            description: 'Dirección del ordenamiento (asc o desc). Por defecto asc.',
            required: false,
            type: 'string'
        }

        #swagger.responses[200] = {
            description: 'Provincias ordenadas',
            schema: {
                type: 'array',
                items: { $ref: '#/definitions/Provincia' }
            }
        }

        #swagger.responses[400] = {
            description: 'El parámetro sort tiene un valor inválido (solo se acepta "asc" o "desc")',
            schema: { example: 'El parámetro "sort" debe ser "asc" o "desc".' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        const { sort } = req.query;

        if (sort !== undefined && sort !== 'asc' && sort !== 'desc') {
            return res.status(400).send('El parámetro "sort" debe ser "asc" o "desc".');
        }

        const provinces = await svc.getAllOrderedAsync(sort);
        return res.status(200).json(provinces);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});


// GET /api/province/:id
router.get('/:id', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Obtiene una provincia por ID'
        #swagger.description = 'Busca y devuelve una única provincia a partir de su ID numérico. Si no existe una provincia con ese ID, devuelve un error 404.'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico de la provincia',
            required: true,
            type: 'integer'
        }

        #swagger.responses[200] = {
            description: 'Provincia encontrada',
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[400] = {
            description: 'El ID enviado no es un número válido',
            schema: { example: 'El ID debe ser un número.' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        if (isNaN(Number(req.params.id))) {
            return res.status(400).send('El ID debe ser un número.');
        }

        const province = await svc.getByIdAsync(req.params.id);

        if (province === null) {
            return res.status(404).send('Provincia no encontrada.');
        }

        return res.status(200).json(province);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});


// POST /api/province
router.post('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Crea una nueva provincia'
        #swagger.description = 'Crea una nueva provincia a partir de los datos recibidos en el body. El ID se genera automáticamente. Antes de crearla se validan los campos obligatorios: name (mínimo 3 caracteres), full_name (mínimo 5 caracteres), latitude y longitude (numéricos) y display_order (entero, opcional).'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos de la provincia a crear',
            required: true,
            schema: { $ref: '#/definitions/ProvinciaInput' }
        }

        #swagger.responses[201] = {
            description: 'Provincia creada exitosamente',
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[400] = {
            description: 'Datos inválidos. Puede deberse a: nombre obligatorio o con menos de 3 caracteres, nombre completo obligatorio o con menos de 5 caracteres, latitud/longitud obligatorias y numéricas, o display_order que no sea un número entero.',
            schema: { example: 'El nombre es obligatorio!!!' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        const province = await svc.createAsync(req.body);
        return res.status(201).json(province);
    } catch (error) {
        if (error.esValidacion) {
            return res.status(400).send(error.message);
        }
        return res.status(500).send('Error interno del servidor.');
    }
});


// PUT /api/province
router.put('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Actualiza una provincia'
        #swagger.description = 'Actualiza los datos de una provincia existente. El ID enviado en el body debe corresponder a una provincia ya cargada; de lo contrario devuelve 404. Se aplican las mismas validaciones de campos que en la creación.'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos completos de la provincia a actualizar. El ID debe corresponder a una provincia existente.',
            required: true,
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[200] = {
            description: 'Provincia actualizada exitosamente',
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[400] = {
            description: 'Datos inválidos. Puede deberse a: ID faltante, nombre obligatorio o con menos de 3 caracteres, nombre completo obligatorio o con menos de 5 caracteres, latitud/longitud obligatorias y numéricas, o display_order que no sea un número entero.',
            schema: { example: 'La latitud debe ser un número' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        if (!req.body.id) {
            return res.status(400).send('El ID es obligatorio para actualizar.');
        }

        const province = await svc.updateAsync(req.body);

        if (province === null) {
            return res.status(404).send('Provincia no encontrada.');
        }

        return res.status(200).json(province);
    } catch (error) {
        if (error.esValidacion) {
            return res.status(400).send(error.message);
        }
        return res.status(500).send('Error interno del servidor.');
    }
});


// DELETE /api/province/:id
router.delete('/:id', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Elimina una provincia por ID'
        #swagger.description = 'Elimina definitivamente una provincia a partir de su ID numérico. Si no existe una provincia con ese ID, devuelve un error 404.'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico de la provincia',
            required: true,
            type: 'integer'
        }

        #swagger.responses[200] = {
            description: 'Provincia eliminada exitosamente',
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[400] = {
            description: 'El ID enviado no es un número válido',
            schema: { example: 'El ID debe ser un número.' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { example: 'Error interno del servidor.' }
        }
    */
    try {
        if (isNaN(Number(req.params.id))) {
            return res.status(400).send('El ID debe ser un número.');
        }

        const province = await svc.deleteByIdAsync(req.params.id);

        if (province === null) {
            return res.status(404).send('Provincia no encontrada.');
        }

        return res.status(200).json(province);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});

export default router;