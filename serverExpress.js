const express = require('express');
const bodyParser = require('body-parser');
const { agregarUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, realizarTransferencia, obtenerTransferencias } = require('./config/consultas');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/usuario', async (req, res) => {
  const { nombre, balance } = req.body;
  try {
    const usuario = await agregarUsuario(nombre, balance);
    res.status(201).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar usuario' });
  }
});

app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await obtenerUsuarios();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.put('/usuario', async (req, res) => {
  const { id, nombre, balance } = req.body;
  try {
    const usuario = await actualizarUsuario(id, nombre, balance);
    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

app.delete('/usuario', async (req, res) => {
  const { id } = req.query;
  try {
    await eliminarUsuario(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

app.post('/transferencia', async (req, res) => {
  const { emisor, receptor, monto } = req.body;
  try {
    const transferencia = await realizarTransferencia(emisor, receptor, monto);
    res.status(201).json(transferencia);
  } catch (error) {
    res.status(500).json({ error: 'Error al realizar transferencia' });
  }
});

app.get('/transferencias', async (req, res) => {
  try {
    const transferencias = await obtenerTransferencias();
    res.status(200).json(transferencias);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener transferencias' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
