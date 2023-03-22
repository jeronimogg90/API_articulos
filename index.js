const { conexion } = require("./database/connection");
const express = require("express")
const cors = require("cors")

//Inicializar app
console.log("App arranca")

//Conectar a la base de datos
conexion();

//Crear servidor de node
const app = express()
const puerto = 3900;

// configurar cors
app.use(cors())

//convertir body a objeto js
app.use(express.json()) // recibid datos con content-type app/json
app.use(express.urlencoded({extended:true})) // decodifica los datos y los convierte en objeto json

// rutas
const rutas_articulo = require("./rutas/articulo")

// Cargo las rutas
app.use("/api",  rutas_articulo)

//Rutas pruebas hardcodeadas
app.get("/", (req, res) => {
    console.log("Se ha ejecutado el endPoint /")
    return res.status(200).send("<h1>Empezando a crear un api rest con node")
})

app.get("/probando", (req, res) => {
    console.log("Se ha ejecutado el endPoint probando")
    return res.status(200).send({
        curso: "Master en react",
        autor: "Victor Robles web",
        url: "victorRoblesweb.es/master-web"
    })
})

//Crear el servidor y escuchar peticiones http
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto "+puerto)
})