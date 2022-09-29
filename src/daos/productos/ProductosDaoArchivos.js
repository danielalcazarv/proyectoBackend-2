import { ContenedorArchivos } from "../../containers/ContenedorArchivos.js";

class ProductosDaoArchivos extends ContenedorArchivos {

    constructor() {
        super('./db/productos.json')
    }
};

export default ProductosDaoArchivos;