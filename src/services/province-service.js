import ProvinceRepository from '../repositories/repository-province.js';
import { validarProvincia } from '../helpers/validaciones-helper.js';
import logHelper from '../helpers/log-helper.js';

export default class ProvinceService {

    constructor() {
        this.repo = new ProvinceRepository();
    }

    getAllAsync = async () => {
        try {
            return await this.repo.getAllAsync();
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    getByIdAsync = async (id) => {
        try {
            return await this.repo.getByIdAsync(id);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    searchByNameAsync = async (name) => {
        try {
            return await this.repo.searchByNameAsync(name);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    getAllOrderedAsync = async (sort) => {
        try {
            return await this.repo.getAllOrderedAsync(sort);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    createAsync = async (body) => {
        try {
            validarProvincia(body);
            return await this.repo.createAsync(body);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    updateAsync = async (body) => {
        try {
            const provinciaExistente = await this.repo.getByIdAsync(body.id);

            if (provinciaExistente === null) {
                return null;
            }

            validarProvincia(body);

            return await this.repo.updateAsync(body);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };

    deleteByIdAsync = async (id) => {
        try {
            const provinciaExistente = await this.repo.getByIdAsync(id);

            if (provinciaExistente === null) {
                return null;
            }

            return await this.repo.deleteByIdAsync(id);
        } catch (error) {
            logHelper.logError(error);
            throw error;
        }
    };
}