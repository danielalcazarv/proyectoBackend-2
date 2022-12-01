//Variable de entorno
import * as dotenv from 'dotenv';
dotenv.config();

let productosDao;
let carritosDao;
let mensajesDao;
let usuariosDao;

switch (process.env.PERS) {
    case 'json':
        const { default: ProductosDaoArchivos } = await import ('./productos/ProductosDaoArchivos.js');
        const { default: CarritosDaoArchivos } = await import ('./carritos/CarritosDaoArchivos.js');
        const {default: MensajesDaoArchivos } = await import ('./mensajes/MensajesDaoArchivos.js');
        const { default: UsuariosDaoArchivos } = await import ('./usuarios/UsuariosDaoArchivos.js');
        
        productosDao = new ProductosDaoArchivos();
        carritosDao = new CarritosDaoArchivos();
        mensajesDao = new MensajesDaoArchivos();
        usuariosDao = new UsuariosDaoArchivos();
        break;
    case 'mongoDb':
        const { default: ProductosDaoMongoDb } = await import ('./productos/ProductosDaoMongoDb.js');
        const { default: CarritosDaoMongoDb } = await import ('./carritos/CarritosDaoMongoDb.js');
        const { default: MensajesDaoMongoDb } = await import ('./mensajes/MensajesDaoMongoDb.js');
        const { default: UsuariosDaoMongoDb } = await import ('./usuarios/UsuariosDaoMongoDb.js');
        
        productosDao = new ProductosDaoMongoDb();
        carritosDao = new CarritosDaoMongoDb();
        mensajesDao = new MensajesDaoMongoDb();
        usuariosDao = new UsuariosDaoMongoDb();
        break;
    case 'firebase':
        const { default: ProductosDaosFirebase } = await import ('./productos/ProductosDaoFirebase.js');
        const { default: CarritosDaosFirebase } = await import ('./carritos/CarritosDaoFirebase.js');
        const { default: MensajesDaosFirebase } = await import ('./mensajes/MensajesDaoFirebase.js');
        
        productosDao = new ProductosDaosFirebase();
        carritosDao = new CarritosDaosFirebase();
        mensajesDao = new MensajesDaosFirebase();
        break;
    default:
        const {default: ProductosDaoMemoria } = await import ('./productos/ProductosDaoMemoria.js');
        const {default: CarritosDaoMemoria } = await import ('./carritos/CarritosDaoMemoria.js');
        
        productosDao = new ProductosDaoMemoria();
        carritosDao = new CarritosDaoMemoria();
        break;
}


export {productosDao,carritosDao, mensajesDao, usuariosDao}