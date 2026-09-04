import provinces from "../data/provinces.js";

export default class ProvinceRepository {

    getAllAsync = async () => {
        return provinces;
    };

    getByIdAsync = async (id) => {
        return provinces.find(p => p.id === Number(id)) || null;
    };

    createAsync = async (entity) => {
        const newId = provinces.length > 0
            ? Math.max(...provinces.map(p => p.id)) + 1
            : 1;

        const newProvince = {
            id: newId,
            ...entity
        };

        provinces.push(newProvince);

        return newProvince;
    };

    updateAsync = async (entity) => {
        const index = provinces.findIndex(
            p => p.id === Number(entity.id)
        );

        if (index === -1) {
            return null;
        }

        provinces[index] = entity;

        return provinces[index];
    };

    deleteByIdAsync = async (id) => {
        const index = provinces.findIndex(
            p => p.id === Number(id)
        );

        if (index === -1) {
            return null;
        }

        return provinces.splice(index, 1)[0];
    };
}