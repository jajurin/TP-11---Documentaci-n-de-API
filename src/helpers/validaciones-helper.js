export function validarProvincia(province) {

    const fail = (mensaje) => {
        const error = new Error(mensaje);
        error.esValidacion = true;
        throw error;
    };

    if (!province.name) {
        fail("El nombre es obligatorio!!!");
    }

    if (province.name.trim().length < 3) {
        fail("El nombre debe tener al menos 3 caracteres");
    }

    if (!province.full_name) {
        fail("El nombre completo es obligatorio!!!");
    }

    if (province.full_name.trim().length < 5) {
        fail("El nombre completo debe tener al menos 5 caracteres");
    }

    if (province.latitude == null || province.latitude === "") {
        fail("La latitud es obligatoria");
    }

    if (isNaN(Number(province.latitude))) {
        fail("La latitud debe ser un número");
    }

    if (province.longitude == null || province.longitude === "") {
        fail("La longitud es obligatoria");
    }

    if (isNaN(Number(province.longitude))) {
        fail("La longitud debe ser un número");
    }

    if (province.display_order === "") {
        province.display_order = null;
    }

    if (
        province.display_order != null &&
        !Number.isInteger(Number(province.display_order))
    ) {
        fail("El display_order debe ser un número entero");
    }
}