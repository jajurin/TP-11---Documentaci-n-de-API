export function validarProvincia(province) {

    if (!province.name) {
        throw new Error("El nombre es obligatorio!!!");
    }

    if (province.name.trim().length < 3) {
        throw new Error("El nombre debe tener al menos 3 caracteres");
    }
    if (!province.full_name) {
        throw new Error("El nombre completo es obligatorio!!!");
    }
    if (province.full_name.trim().length < 5) {
        throw new Error("El nombre completo debe tener al menos 5 caracteres");
    }

     if (province.latitude == null || province.latitude === "") {
        throw new Error("La latitud es obligatoria");
    }
    
    if (isNaN(Number(province.latitude))) {
        throw new Error("La latitud debe ser un número");
    }


    if (province.longitude == null || province.longitude === "") {
        throw new Error("La longitud es obligatoria");
    }

    if (isNaN(Number(province.longitude))) {
        throw new Error("La longitud debe ser un número");
    }
   if (province.display_order === "") {
        province.display_order = null;
    }
    if (
        province.display_order != null &&
        !Number.isInteger(Number(province.display_order))
    ) {
        throw new Error("El display_order debe ser un número entero");
    }
    
}