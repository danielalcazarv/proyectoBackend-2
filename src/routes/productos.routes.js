import express from 'express';
import { productosDao as productosApi } from '../daos/index.js'

const routerProductos = express.Router();
const ADM = true;

/******Middleware******/
async function middlewareGetIdNotFound (req,res,next){
    const prod = await productosApi.listar(Number(req.params.id));
    if (prod==null){
        const msj = {
            error:404,
            descripcion:`Not found. El producto no existe. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

function middlewareAdminValid (req, res, next){
    if(!ADM){
        const msj = {
            error: 403,
            descripcion:`Forbidden Access. Require permisos de admin. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method} No autorizado.`
        };
        res.status(403).json(msj);
    }else{
        next();
    }
};

/******Rutas******/
routerProductos.get('/', async (req,res)=>{
    const prods = await productosApi.listarAll();
    return res.status(200).json(prods);
});

routerProductos.get('/:id', middlewareGetIdNotFound, async (req,res)=>{
    let id = Number(req.params.id);
    const prod = await productosApi.listar(id);
    res.status(200).json(prod);
});

routerProductos.post('/', middlewareAdminValid, async (req,res)=>{
    let obj = req.body;
    await productosApi.guardar(obj)
    res.status(200).json({msg:'Producto Agregado', data: req.body});
});

routerProductos.delete('/:id', middlewareAdminValid, middlewareGetIdNotFound, async (req,res)=>{
    let id = Number(req.params.id);
    await productosApi.borrar(id);
    res.status(200).json({msg:'Producto Borrado'});
})

routerProductos.put('/:id', middlewareAdminValid, middlewareGetIdNotFound, async (req, res)=>{
    let id = Number(req.params.id);
    let obj = req.body;
    await productosApi.actualizar(id,obj);
    res.status(201).json({msg:'Producto Actualizado', new:{...req.body}});
});

export default routerProductos;