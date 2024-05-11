const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "desarrollo",
  database: "bancosolar",
  port: 5432,
});

const agregarUsuario = async (nombre, balance) => {
  try {
    const res = await pool.query(
      "INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *",
      [nombre, balance]
    );

    console.log("Registro agregado:", res.rows[0]);
    return res.rows[0]; // Devuelve el usuario agregado
  } catch (error) {
    console.error("Error al agregar usuario:", error);
    throw error;
  }
};

const obtenerUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    console.log("Usuarios registrados:", res.rows);
    return res.rows;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  try {
    const res = await pool.query(
      "DELETE FROM usuarios WHERE id = $1 RETURNING *",
      [id]
    );
    console.log("Usuario eliminado:", res.rows[0]);
    return res.rows[0]; // Devuelve el usuario eliminado
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    throw error;
  }
};

const actualizarUsuario = async (id, nombre, balance) => {
  try {
    const res = await pool.query(
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
      [nombre, balance, id]
    );

    if (res.rowCount > 0) {
      console.log("Usuario actualizado:", res.rows[0]);
      return res.rows[0]; // Devuelve el usuario actualizado
    } else {
      throw new Error("No se encontró el usuario para actualizar");
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

const transferencia = async (emisor, receptor, monto) => {
  try {
    await pool.query("BEGIN");
    const descontar = await pool.query(
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
      [monto, emisor]
    );

    const acreditar = await pool.query(
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [monto, receptor]
    );

    const actualizarUsuarios = await pool.query(
      "INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [emisor, receptor, monto]
    );

    await pool.query("COMMIT");
    console.log("Transferencia realizada con éxito");
    await actualizarUsuario(emisor, receptor, monto);
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log("Error en la transferencia:", error.message);
    throw { error: error.message };
  }
};

const transferencias = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM transferencias");
    console.log("Transacciones registradas:", result.rows);
    return result.rows;
  } catch (error) {
    console.log("Error al obtener las transferencias:", error.message);
    throw { error: error.message };
  }
};

module.exports = {
  pool,
  agregarUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  transferencia,
  transferencias,
};
