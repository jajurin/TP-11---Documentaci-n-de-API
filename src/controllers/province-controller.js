import { Router } from 'express';
import ProvinceService from '../services/province-service.js';

const router = Router();
const svc = new ProvinceService();

// GET /api/province
router.get('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Obtiene todas las provincias'

        #swagger.responses[200] = {
            description: 'Lista de todas las provincias',
            schema: {
                type: 'array',
                items: {
                    $ref: '#/definitions/Provincia'
                }
            }
        }
    */

    const provinces = await svc.getAllAsync();

    return res.status(200).json(provinces);
});


// GET /api/province/:id
router.get('/:id', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Obtiene una provincia por ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico de la provincia',
            required: true,
            type: 'integer'
        }

        #swagger.responses[200] = {
            description: 'Provincia encontrada',
            schema: {
                $ref: '#/definitions/Provincia'
            }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada'
        }
    */

    const province = await svc.getByIdAsync(req.params.id);

    if (province === null) {
        return res.status(404).send('Provincia no encontrada.');
    }

    return res.status(200).json(province);
});


// POST /api/province
router.post('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Crea una nueva provincia'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos de la provincia a crear',
            required: true,
            schema: {
                $ref: '#/definitions/ProvinciaInput'
            }
        }

        #swagger.responses[201] = {
            description: 'Provincia creada exitosamente',
            schema: {
                $ref: '#/definitions/Provincia'
            }
        }

        #swagger.responses[400] = {
            description: 'Datos inválidos'
        }
    */

    try {
        const province = await svc.createAsync(req.body);

        return res.status(201).json(province);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});


// PUT /api/province
router.put('/', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Actualiza una provincia'

        #swagger.parameters['body'] = {
            in: 'body',
            description: 'Datos completos de la provincia a actualizar. El ID debe corresponder a una provincia existente.',
            required: true,
            schema: {
                $ref: '#/definitions/Provincia'
            }
        }

        #swagger.responses[200] = {
            description: 'Provincia actualizada exitosamente',
            schema: {
                $ref: '#/definitions/Provincia'
            }
        }

        #swagger.responses[400] = {
            description: 'Datos inválidos'
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada'
        }
    */

    try {
        const province = await svc.updateAsync(req.body);

        if (province === null) {
            return res.status(404).send('Provincia no encontrada.');
        }

        return res.status(200).json(province);
    } catch (error) {
        return res.status(400).send(error.message);
    }
});


// DELETE /api/province/:id
router.delete('/:id', async (req, res) => {
    /*
        #swagger.tags = ['Provincias']
        #swagger.summary = 'Elimina una provincia por ID'

        #swagger.parameters['id'] = {
            in: 'path',
            description: 'ID numérico de la provincia',
            required: true,
            type: 'integer'
        }

        #swagger.responses[200] = {
            description: 'Provincia eliminada exitosamente',
            schema: {
                $ref: '#/definitions/Provincia'
            }
        }

        #swagger.responses[404] = {
            description: 'Provincia no encontrada'
        }
    */

    const province = await svc.deleteByIdAsync(req.params.id);

    if (province === null) {
        return res.status(404).send('Provincia no encontrada.');
    }

    return res.status(200).json(province);
});

export default router;