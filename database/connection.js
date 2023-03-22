const mongoose = require("mongoose");

const conexion = async() => {
    try{

        await mongoose.connect("mongodb+srv://root:root@cluster0.rirelou.mongodb.net/mi_blog")
        //parametros a pasar si da fallo
        // useNewUrlParser: true
        // useUnifiedTopology: true
        // useCreateIndex: true

        console.log("Conectados a la base de datos")
    }catch(error){
        console.log(error)
        throw new Error("no se ha podido conectar a la base de datos")
    }
}

module.exports = {
    conexion
}