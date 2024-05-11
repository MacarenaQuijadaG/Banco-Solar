const express = require("express");
const bodyParser = require("body-parser");
const { 
  agregarUsuario, 
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  transferencias,
  transferencia
} = require("./config/consultas");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Ruta para servir el archivo index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Rutas para manipulación de usuarios
app.post("/usuario", async (req, res) => {
  try {
    const { nombre, balance } = req.body;
    const resultado = await agregarUsuario(nombre, balance);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/usuarios", async (req, res) => {
  try {
    const resultado = await obtenerUsuarios();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/usuario', async (req, res) => {
  try {
    const { id } = req.query;
    const resultado = await eliminarUsuario(id);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/usuario', async (req,res) => {
  try {
    const { id } = req.query;
    const { nombre, balance } = req.body;
    const resultado = await actualizarUsuario(id, nombre, balance);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rutas para manejo de transferencias

// nueva trasferencia
app.post("/transferencia", async (req, res) => {
  try {
    const { emisor, receptor, monto } = req.body;
    console.log("emisor, receptor, monto: ", emisor, receptor, monto);
    
    // realizar la transferencia
    const resultado = await transferencia(emisor, receptor, monto);
    
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// desplega todas las transferencias
app.get("/transferencias", async (req, res) => {
  try {
    // No se necesita req.body aquí ya que es una solicitud GET
    const resultado = await transferencias();
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

