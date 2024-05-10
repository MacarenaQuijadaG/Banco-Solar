// IMPORTACIONES REQUERIDAS DE PAQUETES INSTALADOS
import cors from "cors";
import "dotenv/config";
import express from "express";

// IMPORTANDO EL JS QUE CONTIENE LA DEFINICION DE RUTAS
import todoRoute from "./routes/todoRoute.js";

const app = express();

// MIDDLEWARES GENERALES 
app.use(express.json());  //FORMATAEAR A JSON LAS SOLICITUDES
app.use(cors()); // PERMITIR LLAMADO ENTRE SERVIDORES DISTINTOS
app.use("/todos", todoRoute); // DEFINIR LA URL BASE DE LAS RUTAS TODAS INICIARAN ASI

// LEVANTANDO EL SERVIDOR
const PORT_SERVER = process.env.PORT_SERVER || 5000;

app.listen(PORT_SERVER, () => {
  console.log(`Server listening on port http://localhost:${PORT_SERVER}`);
});
