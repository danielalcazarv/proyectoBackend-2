/******Modulos******/
import express from 'express';
import morgan from 'morgan';
import path from 'path';
import {fileURLToPath} from 'url';
import { createServer } from "http";
import { Server } from "socket.io";
import handlebars from 'express-handlebars';
import { 
    mensajesDao as mensajesApi,
    usuariosDao as usuariosApi,
    productosDao as apiProductos,
} from './src/daos/index.js';
import { schema, normalize } from 'normalizr'
import session from "express-session";
import connectMongo from 'connect-mongo';
import bcrypt from 'bcrypt';
import minimist from 'minimist';
import cluster from 'cluster';
import os from 'os';
import * as dotenv from 'dotenv';
import multer from 'multer';
dotenv.config();

import passport from "passport";
import { Strategy } from "passport-local";
const LocalStrategy = Strategy;

//Persistencia session MongoDb Atlas
const MongoStore = connectMongo.create({
    mongoUrl: process.env.MONGODB_ATLAS_URL,
    ttl: 600
});

//Solucion a __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//Instancias de servidor
const app = express();
const httpServer = createServer(app);
const io = new Server (httpServer);
const CPU_CORES = os.cpus().length;
import routerProductos from './src/routes/productos.routes.js';
import routerCarritos from './src/routes/carrito.routes.js'

/****Normalizr*****/
//Normalizar
const schAuthor = new schema.Entity('author',{}, {idAttribute:'id'});
const schMensaje = new schema.Entity('post', {author: schAuthor}, {idAttribute: 'id'});
const schMensajes = new schema.Entity('posts', {mensajes: [schMensaje] }, {idAttribute: 'id'});
const normalizrMensajes = (msjsId) => normalize(msjsId, schMensajes);

/******Middleware******/
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('./public'));
app.use('/login', express.static('./public'));
app.use('/api', express.static('./public'));
app.use(morgan('dev'));

//Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb (null, './public/uploads');
    },
    filename: function (req, file, cb){
        cb(null, file.originalname);
    }
});

const upload = multer ({ 
    storage: storage,
    limits: {fileSize: 10000000}
}).single('avatar');


//Passport
passport.use( new LocalStrategy(
    async function (username, password, done){
        const usuariosDb = await usuariosApi.listarAll()
        const existeUsuario = usuariosDb.find(x=>x.username == username);
        
        if (!existeUsuario) {
            return done(null, false);
        } else {
            const match = await verifyPass(existeUsuario, password);
            if (!match){
                return done(null, false);
            }
            return done(null, existeUsuario);
        }
    }
));

passport.serializeUser((usuario, done)=>{
    done(null, usuario.username);
});

passport.deserializeUser(async (username, done)=>{
    const usuariosDb = await usuariosApi.listarAll()
    const existeUsuario = usuariosDb.find(x=>x.username == username);
    done(null, existeUsuario);
});

//Session Setup Mongo Atlas
app.use(session({
    store:MongoStore,
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
}));

//Session Auth
function auth(req, res, next) {
    if(req.isAuthenticated()){
        next()
    } else {
        res.redirect('/login')
    }
};

app.use(passport.initialize());
app.use(passport.session());

//Métodos de Auth
async function generateHashPassword(password){
    const hashPassword = await bcrypt.hash(password, 10);
    return hashPassword;
};

async function verifyPass(usuario, password) {
    const match = await bcrypt.compare(password, usuario.password);
    return match;
};

//Motores de plantillas
//HBS
app.engine('hbs', handlebars.engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname +'/src/views/layouts',
    partialsDir: __dirname +'/src/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views','./src/views');

/******Rutas******/
app.use('/api/productos', routerProductos);
app.use('/api/carrito', routerCarritos);

app.get('/', auth, (req,res)=>{
    const usuario = req.user.nombre;
    const email = req.user.username;
    res.render('main', {test:false, firstname: usuario, correo:email});
});

app.get('/api/productos-test', auth, async (req,res)=>{
    const productos = await apiProductos.listarAll();
    const usuario = req.user.nombre;
    const email = req.user.username;
    res.render('main', {test:true , api:productos, firstname: usuario, correo:email});
});

//Info
app.get('/info', (req,res)=>{
    const objInfo = {
        "ARG_INPUT": minimist(process.argv.slice(2)),
        "OS": process.platform,
        "NODE_VER": process.version,
        "RSS": process.memoryUsage().rss,
        "EXEC_PATH": process.execPath,
        "PROCESS_ID": process.pid,
        "PROJECT_FOLDER": process.cwd(),
        "CPU_CORES": CPU_CORES
    }
    res.status(200).json(objInfo);
});

//Rutas de login y registro
app.get('/login', (req,res)=>{
    res.render('login');
});

app.get('/login-error', (req,res)=>{
    res.render('login-error');
});

app.post('/login', passport.authenticate('local',  {successRedirect: '/', failureRedirect: '/login-error'}, ));

app.get('/registro', (req,res)=>{
    res.render('registro');
});

app.get('/registro-error', (req,res)=>{
    res.render('registro-error');
});

app.post('/registro', upload, async (req,res)=>{
    const { username, password, nombre, direccion, edad, telefono } = req.body;
    const avatar = req.file.path;
    const usuariosDb = await usuariosApi.listarAll();
    const existeUsuario = usuariosDb.find(x=>x.username == username);

    if(existeUsuario){
        res.render('registro-error')
    }else {
        const usuarioNuevo = { username, password: await generateHashPassword(password), nombre, direccion, edad, telefono, avatar };
        usuariosApi.guardar(usuarioNuevo);
        res.redirect('/login');
    }
});

app.get('/logout', (req, res)=> {
    const usuario = req.user.nombre;
    req.logOut(err => {
        res.render('logout.hbs', {firstname: usuario})
    })
});


//Errores globales
app.use(function(err,req,res,next){
    console.log(err.stack);
    res.status(err.status || 500).send({error: "Algo se rompió"})
});

app.use(function(req,res,next){
    const msj ={
        error: 404,
        descripcion:`Not found. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method} No implementada.`
    };
    console.log(`Not found. Ruta: ${req.baseUrl}${req.url} || Método: ${req.method} No implementada.`)
    res.status(404).send(msj)
});

/******Web Socket******/
//Chat
io.on('connection', async (socket)=>{
    const mensajes = await mensajesApi.listarAll()
    const normalizados = normalizrMensajes({id:'mensajes', mensajes})
    socket.emit('mensajes', normalizados);

    socket.on('new-mensaje', data =>{
        mensajesApi.guardar(data);
        io.sockets.emit('mensajes', normalizados);
    });
});

//Productos
io.on('connection', async (socket)=>{
    try {
        let prods;
        prods = await apiProductos.listarAll();
        socket.emit('productos', prods);

        socket.on('new-prod', async data =>{
            productosDB.insertar(data);
            prods = await apiProductos.listarAll();
            io.sockets.emit('productos',prods);
        });
    } catch (error) {
        throw error;
    }
});

/******Servidor******/
let options = {default: {puerto:8080, modo: 'FORK'}, alias: {modo: 'm', p: 'puerto', d:'debug'}};
let args = minimist(process.argv.slice(2), options);


//CLUSTER
if (cluster.isPrimary) {
    console.log('Cant de cores: ', CPU_CORES);
    
    for (let i = 0; i < CPU_CORES; i++) {
        cluster.fork();
    }

    cluster.on('exit', worker => {
        console.log(`Worker ${process.pid} ${worker.id} ${worker.pid} finalizo ${new Date().toLocaleString()}`);
        cluster.fork();
    });

} else {
    const PORT = parseInt(process.argv[2]) || 8080;
    const server = httpServer.listen(PORT, ()=>{
        console.log( `Tu servidor esta corriendo en el puerto http://localhost: ${PORT} - PID WORKER ${process.pid}`);
    });
    server.on('error', error => console.log(`Error en servidor: ${error}`))
}

/*
//FORK
const PORT = process.env.PORT || 8080;
const server = httpServer.listen(PORT, ()=>{
    console.log( `Tu servidor esta corriendo en el puerto http://localhost: ${PORT} - PID WORKER ${process.pid}`);
});
server.on('error', error => logger.error(`Error en servidor: ${error}`))
*/