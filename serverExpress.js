import express from 'express';
const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor ${PORT}`);
});
import { errores } from './errores/errores.js';

// Importamos funciones de consulta/consulta.js 
import { agregar, todos, editar, eliminar, transferir, transferencias, saldo } from './config/consultas.js';

// Middleware 
app.use(express.json());

// devuelve el index.html
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: "./" });
})

//ruta del usuario a crear
app.post("/usuario", async (req, res) => {
    const { nombre, balance } = req.body;
    if (!nombre || !balance) {
        res.status(400).json({ mensaje: "Debe ingresar todos los datos" });
    } else {
            const result = await agregar(nombre, balance);
            res.send(result);
    }
});

// devuelve todos los usuarios
app.get("/usuarios", async (req, res) => {
    try {
        const result = await todos();
        res.send(result);
    } catch (error) {
        res.send(error);
    }
});

// ruta que devuelve los modificados
app.put("/usuario", async (req, res) => {
    const { id, nombre, balance } = req.body;
    try {
        const result = await editar(id, nombre, balance);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

// Elimina
app.delete("/usuario", async (req, res) => {
    const { id } = req.query;
    try {
        const result = await eliminar(id);
        console.log("Respuesta de la función eliminar: ", result);
        res.json(result);
    } catch (error) {
        res.send(error);
    }
});

// transferencia 
app.post("/transferencia", async (req, res) => {
    const { emisor, receptor, monto } = req.body;
    if (!emisor ||!receptor ||!monto) {
        res.status(400).json({ mensaje: "Ingrese todos los datos" });
    }
    try {
        const saldoEmisor = await saldo(emisor);
        if (saldoEmisor < monto) {
            return res.status(400).json({ mensaje: "Saldo insufuciente" });
            //res.send(error);
        }
        const result = await transferir(emisor, receptor, monto);
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});

// mostras transferencias
app.get("/transferencias", async (req, res) => {
    try {
        const result = await transferencias();
        res.json(result);
    } catch (error) {
        res.json(error);
    }
});