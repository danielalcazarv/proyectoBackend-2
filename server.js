/******Modulos******/
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import morgan from 'morgan';

//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Instancias de servidor
const app = express();
const routerProductos = require('./src/routes/productos.routes.js');
const routerCarritos = require('./src/routes/carrito.routes.js');

/******Middleware******/
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use(morgan('dev'));

/******Rutas******/
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarritos);

//Errores globales
app.use(function(err,req,res,next){
    console.error(err.stack);
    res.status(err.status || 500).send({error: "Algo se rompió"})
});

app.use(function(req,res,next){
    const msj ={
        error: 404,
        descripcion:`Not found. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method} No implementada.`
    };
    res.status(404).send(msj)
});

/******Servidor******/
const port = 8080;
app.listen(port, ()=>{
    console.log("Tu servidor esta corriendo en el puerto " + port);
})
app.on("error", error=> console.log("El error es: " + error))
