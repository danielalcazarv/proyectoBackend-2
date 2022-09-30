//Variable de entorno
import * as dotenv from 'dotenv';
dotenv.config();

let productosDao;
let carritosDao;

switch (process.env.PERS) {
    case 'json':
        const { default: ProductosDaoArchivos } = await import ('./productos/ProductosDaoArchivos.js');
        const { default: CarritosDaoArchivos } = await import ('./carritos/CarritosDaoArchivos.js');
        
        productosDao = new ProductosDaoArchivos();
        carritosDao = new CarritosDaoArchivos();
        break;
    case 'mongoDb':
        const { default: ProductosDaoMongoDb } = await import ('./productos/ProductosDaoMongoDb.js');
        const { default: CarritosDaoMongoDb } = await import ('./carritos/CarritosDaoMongoDb.js');
        
        productosDao = new ProductosDaoMongoDb();
        carritosDao = new CarritosDaoMongoDb();
        break;
    default:
        console.log('memo')
        //const {default: ProductosDaoMemoria } = await import ('./productos/ProductosDaoMemoria.js');
        //const {default: CarritosDaoMemoria } = await import ('./carritos/ProductosDaoMemoria.js');
        
        //productosDao = new ProductosDaoMemoria();
        //carritosDao = new CarritosDaoMemoria();
        break;
}


export {productosDao,carritosDao}