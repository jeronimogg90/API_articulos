const express = require("express")
const multer = require("multer")

const router = express.Router()

// multer
const almacenamiento = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './imagenes/articulos')
    },
    filename: (req, file, cb) => {
        cb(null, "articulo"+Date.now() + file.originalname)
    }
})

const subidas= multer({storage: almacenamiento})

// Cargamos el controlador
const ArticuloController = require("../controladores/articulo")

// Rutas de prueba
router.get("/ruta-de-prueba", ArticuloController.prueba)
router.get("/curso", ArticuloController.curso)

// Ruta util
router.post("/crear", ArticuloController.crear)
router.get("/articulos/:ultimos?", ArticuloController.listar) // parametro opcional
router.get("/articulo/:id", ArticuloController.uno) // parametro obligatorio
router.delete("/articulo/:id", ArticuloController.borrar) // parametro obligatorio
router.put("/articulo/:id", ArticuloController.editar) // parametro obligatorio
router.post("/subir-imagen/:id", [subidas.single("file0")], ArticuloController.subir)
router.get("/imagen/:fichero", ArticuloController.imagen) // parametro obligatorio
router.get("/buscar/:busqueda", ArticuloController.buscar) // parametro obligatorio


module.exports = router