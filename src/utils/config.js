import path from 'path';
import {fileURLToPath} from 'url';
import * as dotenv from 'dotenv';
dotenv.config()

//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    fileSystem: {
        path:'./db'
    },
    mongoDb: {
        cnxStr: 'mongodb://localhost:27017/ecommerce',
        options: {
            useNewUrlParser:true,
            useUnifiedTopology:true,
            serverSelectionTimeoutMS: 5000,
        }
    },
    firebase: FIRESTORE_JSON_KEY,
}