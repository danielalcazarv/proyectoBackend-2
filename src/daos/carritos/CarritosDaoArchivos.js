import { ContenedorArchivos } from "../../containers/ContenedorArchivos.js";

class CarritosDaoArchivos extends ContenedorArchivos {

    constructor(){
        super('./db/carritos.json');
    };

    async guardar(carrito = {productos: []}){
        return super.guardar(carrito);
    };
};

export default CarritosDaoArchivos;