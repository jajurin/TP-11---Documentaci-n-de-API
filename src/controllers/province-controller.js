import { Router } from 'express';
import ProvinceService from '../services/province-service.js';

const router = Router();
const svc = new ProvinceService();

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
            schema: { type: 'string', example: 'Error interno del servidor.' }
        }
    */
    try {
        const provinces = await svc.getAllAsync();
        return res.status(200).json(provinces);
    } catch (error) {
        return res.status(500).send('Error interno del servidor.');
    }
});


router.patch('/:id', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Actualiza el nombre de una provincia'
        #swagger.description = 'Actualización parcial: modifica únicamente el campo name de una provincia existente, dejando el resto de los datos sin cambios. El ID se recibe por path y el nuevo nombre por body.'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico de la provincia',
            required: true,
            type: 'integer'
        }

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Nuevo nombre de la provincia',
            required: true,
            schema: { $ref: '#/definitions/ProvinciaNombreInput' }
        }

        #swagger.responses[200] = {
            description: 'Nombre actualizado exitosamente',
            schema: { $ref: '#/definitions/Provincia' }
        }

        #swagger.responses[400] = {
            description: 'El ID no es un número válido o el nombre es inválido (obligatorio, mínimo 3 caracteres)',
            schema: { type: 'string', example: 'El nombre es obligatorio y debe tener al menos 3 caracteres.' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { type: 'string', example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
        }
    */
    try {
        if (isNaN(Number(req.params.id))) {
            return res.status(400).send('El ID debe ser un número.');
        }

        const province = await svc.updateNameAsync(req.params.id, req.body.name);

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
            schema: { type: 'string', example: 'El parámetro "sort" debe ser "asc" o "desc".' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
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
            schema: { type: 'string', example: 'El ID debe ser un número.' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { type: 'string', example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
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
            schema: { type: 'string', example: 'El nombre es obligatorio!!!' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
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
            schema: { type: 'string', example: 'La latitud debe ser un número' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { type: 'string', example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
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
            schema: { type: 'string', example: 'El ID debe ser un número.' }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada',
            schema: { type: 'string', example: 'Provincia no encontrada.' }
        }

        #swagger.responses[500] = {
            description: 'Error interno del servidor',
            schema: { type: 'string', example: 'Error interno del servidor.' }
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