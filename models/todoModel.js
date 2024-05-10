import "dotenv/config";
import { pool } from "../database/connection.js";

// Función para obtener todos los usuarios
const findAll = async () => {
  const query = {
    text: "SELECT * FROM usuarios"
  };
  const { rows } = await pool.query(query);

  return rows;
};

// Función para obtener un usuario por su ID
const findById = async (id) => {
  const query = {
    text: "SELECT * FROM usuarios WHERE id = $1",
    values: [id]
  };
  const { rows } = await pool.query(query);
  
  return rows[0];
};

// Función para crear un nuevo usuario
const create = async (usuario) => {
  const query = {
    text: "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
    values: [usuario.nombre, usuario.balance]
  };
  const { rows } = await pool.query(query);
  
  return rows[0];
};

// Función para eliminar un usuario por su ID
const remove = async (id) => {
  const query = {
    text: "DELETE FROM usuarios WHERE id = $1 RETURNING *",
    values: [id]
  };
  const { rows } = await pool.query(query);
  
  return rows[0];
};

// Función para actualizar un usuario por su ID
const update = async (id, usuario) => {
  const query = {
    text: "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
    values: [usuario.nombre, usuario.balance, id]
  };
  const { rows } = await pool.query(query);
  
  return rows[0];
};

export const usuarioModel = {
  findAll,
  findById,
  create,
  remove,
  update
};
