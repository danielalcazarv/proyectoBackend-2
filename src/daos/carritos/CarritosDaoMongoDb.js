import ContenedorMongoDb from "../../containers/ContenedorMongoDB.js";

class CarritosDaoMongoDb extends ContenedorMongoDb {

    constructor(){
        super('carritos', {
            productos: {type: Array, required: true, default:[]}
        })
    };
};

export default CarritosDaoMongoDb;
