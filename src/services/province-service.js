import ProvinceRepository from '../repositories/repository-province.js';
import { validarProvincia } from '../helpers/validaciones-helper.js';

export default class ProvinceService {

    constructor() {
        this.repo = new ProvinceRepository();
    }

    getAllAsync = async () => {
        return await this.repo.getAllAsync();
    };

    getByIdAsync = async (id) => {
        return await this.repo.getByIdAsync(id);
    };

    createAsync = async (body) => {
        validarProvincia(body);
        return await this.repo.createAsync(body);
    };

    updateAsync = async (body) => {
        const provinciaExistente = await this.repo.getByIdAsync(body.id);

        if (provinciaExistente === null) {
            return null;
        }

        validarProvincia(body);

        return await this.repo.updateAsync(body);
    };

    deleteByIdAsync = async (id) => {
        const provinciaExistente = await this.repo.getByIdAsync(id);

        if (provinciaExistente === null) {
            return null;
        }

        return await this.repo.deleteByIdAsync(id);
    };
}