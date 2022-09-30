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
    case 'firebase':
        const { default: ProductosDaosFirebase } = await import ('./productos/ProductosDaoFirebase.js');
        const { default: CarritosDaosFirebase } = await import ('./carritos/CarritosDaoFirebase.js');
        
        productosDao = new ProductosDaosFirebase();
        carritosDao = new CarritosDaosFirebase();
        break;
    default:
        const {default: ProductosDaoMemoria } = await import ('./productos/ProductosDaoMemoria.js');
        const {default: CarritosDaoMemoria } = await import ('./carritos/CarritosDaoMemoria.js');
        
        productosDao = new ProductosDaoMemoria();
        carritosDao = new CarritosDaoMemoria();
        break;
}


export {productosDao,carritosDao}