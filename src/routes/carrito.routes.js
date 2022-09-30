import express from 'express';
import {
    productosDao as productosApi,
    carritosDao as carritosApi
} from '../daos/index.js'

const routerCarritos = express.Router();

/******Middleware******/
//Valida id de carritos.
async function middlewareGetCartId (req,res,next){
    let id = req.params.id;
    const cart = await carritosApi.listar(id);
    if (cart==null){
        const msj = {
            error:404,
            descripcion:`Not found. Carrito de Usuario no encontrado. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

//Valida si el carrito tiene productos
async function middlewareGetCartProdNotFound (req,res,next){
    let id = req.params.id;
    const cart = await carritosApi.listar(id);
    const index = cart.productos.findIndex(x=>x.id);
    if (index == -1){
        const msj = {
            error:404,
            descripcion:`Not found. Carrito de Usuario vacio. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

//Valida si el producto existe en db
async function middlewareProdNotFound (req,res,next){
    let id = req.body.id;
    const prod= await productosApi.listar(id);
    if (prod==null){
        const msj = {
            error:404,
            descripcion:`Not found. Producto inexsistente. Ruta: ${req.baseUrl}/${req.body.id} || Método: ${req.method}`};
        res.status(404).json(msj);
    }else{
        next();
    }
};

/******Rutas******/
routerCarritos.get('/', async (req,res)=>{
    const carts = (await carritosApi.listarAll()).map(c=>c.id);
    res.status(200).json(carts)
})

routerCarritos.post('/', async (req,res)=>{
    await carritosApi.guardar();
    res.status(200).json({msg:`Carrito creado`});
});

routerCarritos.delete('/:id', middlewareGetCartId, async (req,res)=>{
    await carritosApi.borrar(req.params.id);
    res.status(200).json({msg:'Carrito borrado'});
});

routerCarritos.get('/:id/productos', middlewareGetCartId, middlewareGetCartProdNotFound, async (req,res)=>{
    const cart = await carritosApi.listar(req.params.id);
    res.status(200).json(cart.productos);
});

routerCarritos.post('/:id/productos/', middlewareGetCartId, middlewareProdNotFound, async (req,res)=>{ 
    const currentCart = await carritosApi.listar(req.params.id);
    const newProducto = await productosApi.listar(req.body.id);
    currentCart.productos.push(newProducto);
    await carritosApi.actualizar(req.params.id,{productos:[...currentCart.productos]});
    res.status(200).json({msg:'Producto Agregado al Carrito'});
});

routerCarritos.delete('/:id/productos/:id_prod', middlewareGetCartId,  async (req,res)=>{
    const getCurrentCart = await carritosApi.listar(req.params.id);
    const newCart = getCurrentCart.productos.filter(obj=>obj.id!=req.params.id_prod);
    await carritosApi.actualizar(req.params.id,{productos:[...newCart]});
    res.status(200).json({msg:'Producto eliminado del Carrito'});
});

export default routerCarritos;