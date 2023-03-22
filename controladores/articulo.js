const validator = require("validator")
const Articulo = require("../modelos/Articulo")
const fs = require("fs")
const path = require("path")

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una accion de prueba en mi controlador de articulos"
    })
} 

const curso = (req, res) => {
    console.log("Se ha ejecutado el endPoint probando")
    return res.status(200).send({
        curso: "Master en react",
        autor: "Victor Robles web",
        url: "victorRoblesweb.es/master-web"
    })
}

const crear = (req, res) => {

    // Recoger parametros por post a guardar
    let parametros = req.body;

    // Validar datos
    try{

        let validar_titulo = !validator.isEmpty(parametros.titulo) 
            && validator.isLength(parametros.titulo, {min:5, max:undefined})
        let validar_contenido = !validator.isEmpty(parametros.contenido)
        
        if(!validar_contenido || !validar_titulo){
            throw new Error("No se ha validado la informacion !!");
        }

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }
    
    // Creamos y asignamos valores a objeto basado en el modelo de manera manual
    // const articulo = new Articulo()
    // articulo.titulo = parametros.titulo

    // Creamos y asignamos valores a objeto basado en el modelo de manera automatica
    const articulo = new Articulo(parametros)
    articulo.titulo = parametros.titulo

    // Guardar el articulo en la base de datos
    articulo.save((error, articuloGuardado) => {
        if(error || !articuloGuardado){
            return res.status(400).json({
                status: "error",
                mensaje: "No se han guardado los articulos"
            })
        }

        // Devolver resultado
    
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Articulo creado con exito"
        })
    })
}

const listar = (req, res) => {
    let consulta = Articulo.find({})
                            .sort({fecha: -1}) // orden descendente
    if(req.params.ultimos && req.params.ultimos != undefined){
        consulta.limit(3) // mostrar solo 3 resultados cuando exista el parametro ultimos
    }
                            
    consulta.exec((error, articulos) => {
        if(error || !articulos){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            })
        }

        return res.status(200).send({
            status: "succes",
            total: articulos.length,
            articulos
        })
    })
}

const uno = (req, res) => {
    // Recogemos un id por la ulr
    let id = req.params.id

    // Buscamos el articulo
    Articulo.findById(id, (error, articulo) => {
        // Si no existe devolver error
        if(error || !articulo){
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha encontrado el articulo!!"
            })
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        })
    })


}

const borrar = (req, res) => {
    let articulo_id = req.params.id;

    Articulo.findOneAndDelete({_id: articulo_id}, (error, articuloBorrado) => {
        if(error || !articuloBorrado){
            return res.status(500).json({
                status: "error",
                mensaje: "Error al borrar el articulo"
            })
        }

        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Articulo borrado con exito"
        })
    })
}

const editar = (req, res) => {
    // recoger id articulo 
    let articuloId = req.params.id

    // recoger datos del body
    let parametros = req.body

    // Validar datos
    try{

        let validar_titulo = !validator.isEmpty(parametros.titulo) 
            && validator.isLength(parametros.titulo, {min:5, max:undefined})
        let validar_contenido = !validator.isEmpty(parametros.contenido)
        
        if(!validar_contenido || !validar_titulo){
            throw new Error("No se ha validado la informacion !!");
        }

    }catch(error){
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        })
    }

    // Buscar y actualizar articulo
    Articulo.findOneAndUpdate({_id: articuloId}, parametros, {new:true}, (error, articuloActualizado) => {

        if(error || !articuloActualizado){
            return res.status(400).json({
                status: "error",
                mensaje: "Error al actualizar"
            })
        }
        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        })
    })
}

const subir = (req, res) => {

    // configurar multer

    // Recoger el fichero de imagen subido
    if(!req.file && !req.files){
        return res.status(404).json({
            status: "error",
            mensaje: "Petición invalida"
        })
    }

    // Nombre del archivo
    let nombreArchivo = req.file.originalname

    // Extension del archivo
    let extension = nombreArchivo.split(".")
    let archivo_extension = extension[1];

    // Comprobar extension correcta
    if(archivo_extension != "png" && archivo_extension != "jgp" && archivo_extension != "jpeg" && archivo_extension != "gif"){
        // borrar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            return res.status(400).json({
                status: "error",
                mensaje: "Archivo invalido"
            })
        })
    }else{
        // Si todo va bien, actualizar el articulo

        // recoger id articulo 
        let articuloId = req.params.id

        // Buscar y actualizar articulo
        Articulo.findOneAndUpdate({_id: articuloId}, {imagen: req.file.filename}, {new:true}, (error, articuloActualizado) => {

            if(error || !articuloActualizado){
                return res.status(400).json({
                    status: "error",
                    mensaje: "Error al actualizar",
                })
            }

            //Devolver espuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                ficheroSubido: req.file
            })

        })

    }

    
}

const imagen = (req, res) => {
    let fichero = req.params.fichero
    let ruta_fisica = "./imagenes/articulos/"+fichero

    fs.stat(ruta_fisica, (error, existe) => {
        if(existe){
            return res.sendFile(path.resolve(ruta_fisica))
        }else{
            return res.status(404).json({
                status: "error",
                mensaje: "La imagen no existe",
                existe,
                fichero,
                ruta_fisica
            })
        }
    })
}

const buscar = (req, res) => {
    // Sacar el string de busqueda
    let busqueda = req.params.busqueda

    // Find OR
    Articulo.find({"$or": [
            { "titulo": { "$regex": busqueda, "$options": "i"}},
            { "contenido": { "$regex": busqueda, "$options": "i"}},
        ]})
    .sort({fecha: -1})
    .exec((error, articulosEncontrados) => {
        if(error || !articulosEncontrados || articulosEncontrados.length <= 0){
            return res.status(404).json({
                status: "error",
                mensaje: "No se han encontrado articulos"
            })
        }

        return res.status(200).json({
            status: "access",
            articulosEncontrados
        })
    })
}

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno, 
    borrar,
    editar, 
    subir, 
    imagen,
    buscar
}