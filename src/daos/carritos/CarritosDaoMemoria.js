import { ContenedorMemoria } from "../../containers/ContenedorMemoria.js";

const memoriaCarritos = [];

class CarritosDaoMemoria extends ContenedorMemoria{
    constructor(){
        super(memoriaCarritos);
    };

    async guardar(carrito = {productos: []}){
        return super.guardar(carrito);
    };
};

export default CarritosDaoMemoria;