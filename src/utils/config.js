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
    firebase: {

    },

}