export class ContenedorMemoria {
    constructor(array){
        this.array = array
    };

    async listarAll (){
        try {
            const datos = await this.array
            return datos;
        } catch (error) {
            console.log('Error al leer archivo. Tipo de error: ' + error);
            return [];
        }
    };

    async guardar (obj){
        try {
            const collection = await this.listarAll();
            const timestamp = new Date().toLocaleString();
            let newId;
            if (collection.length == 0){
                newId = 1;
            } else{
                newId = collection[collection.length - 1].id + 1;
            }
            const newItem = {id:newId, timestamp:timestamp, ...obj};
            this.array.push(newItem);
        } catch (error) {
            console.log("Error al guardar. Tipo de error: "+ error);
        }
    };

    async listar (id){
        try {
            const idFiltrado = await this.array.find(obj => obj.id === Number(id));
            if (idFiltrado===undefined){
                const notFound = null;
                return notFound;
            }else{
                return idFiltrado;
            };
        } catch (error) {
            console.log('No se encontró id. Tipo de error: ' + error);
        }
    };

    async borrar (id){
        try {
            const datos = await this.array;
            for (let i = 0; i < datos.length; i++ ){
                if (datos[i].id = id){
                    datos.splice(i, 1);
                }
            return datos;
            }
        } catch (error) {
            console.log('No se pudo eliminar id. Tipo de error: ' + error);
        }
    };

    async borrarAll (){
        try {
            const datos = await this.array;
            datos.splice(0,datos.length);
        } catch (error) {
            console.log(error);
        }
    };

    async actualizar (id, obj){
        try {
            const targetObj = await this.array.find(obj => obj.id === Number(id));
            const newData = {id: targetObj.id, timestamp: targetObj.timestamp, ...obj}
            Object.keys(targetObj).forEach(key =>{
                targetObj[key] = newData[key];
            });
        } catch (error) {
            console.log("Error al actualizar. Tipo de error: "+ error);
        }
    };
};