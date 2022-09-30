import ContenedorFirebase from "../../containers/ContenedorFirebase.js";

class CarritosDaosFirebase extends ContenedorFirebase {

    constructor(){
        super('carritos')
    }

    async guardar(carrito = {productos:[]}) {
        return super.guardar(carrito)
    }
};

export default CarritosDaosFirebase;