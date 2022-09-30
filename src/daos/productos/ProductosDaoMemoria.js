import { ContenedorMemoria } from "../../containers/ContenedorMemoria.js";

const memoriaProductos = [];

class ProductosDaoMemoria extends ContenedorMemoria{
    constructor(){
        super(memoriaProductos);
    };
};

export default ProductosDaoMemoria;