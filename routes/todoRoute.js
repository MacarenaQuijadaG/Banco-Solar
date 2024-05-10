//rutas post, get, put y delete
import { todoController } from "../controllers/todoController.js";
import { Router } from "express";

const router = Router();
// RUTA GET / - Devuelve el html como ruta principal
router.get("/", todoController.read);

// RUTA POST /usuario - Recibe los datos de un nuevo usuario y los almacena en PostgreSQL.
router.post("/usuario", todoController.create);

// RUTA GET /usuarios - Devuelve todos los usuarios registrados con sus balances.
router.get("/usuarios", todoController.read);

// RUTA PUT /usuario - Recibe los datos modificados de un usuario registrado y los actualiza.
router.put("/usuario", todoController.update);

// RUTA DELETE /usuario - Recibe el id de un usuario registrado y lo elimina.
router.delete("/usuario", todoController.remove);

// RUTA POST /transferencia - Recibe los datos para realizar una nueva transferencia. Se debe ocupar una transacción SQL en la consulta a la base de datos.
router.post("/transferencia", todoController.createTransferencia);

// RUTA GET /transferencias - Devuelve todas las transferencias almacenadas en la base de datos en formato de arreglo.
router.get("/transferencias", todoController.getTransferencias);

export default router;
