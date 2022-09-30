import ContenedorMongoDb from "../../containers/ContenedorMongoDB.js";

class ProductosDaoMongoDb extends ContenedorMongoDb {

    constructor(){
        super('productos', {
            nombre: {type: String, required: true},
            marca: {type: String, required: true},
            descripcion: {type: String, required: true},
            codigo: {type: Number, required: true},
            precio: {type: Number, required: true},
            foto: {type: String, required: true}
        })
    }
};

export default ProductosDaoMongoDb;