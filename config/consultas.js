const { errores } = require("../errores/errores.js");
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  hots: "localhost",
  password: "desarrollo",
  database: "bancosolar",
  port: 5432,
});

const agregarUsuario = async (nombre, balance) => {
  try {
    const res = await pool.query(
      "INSERT INTO usuarios (nombre, balance) VALUES($1 , $2) RETURNING*",
      [nombre, balance]
    );

    console.log("Registro agregado : ", res.rows[0]);
  } catch (error) {
    console.log("error", error, error.message);
    throw { error: error.message };

  }
};

const obtenerUsuarios = async () => {
  try {
    const res = await pool.query("SELECT * FROM usuarios");
    console.log("Usuarios registrados : ", res.rows);
    return res.rows;
  } catch (error) {
    console.log("error", error, error.message);
    throw { error: error.message };
  }
};

const eliminarUsuario = async (id) => {
  try {
    const res = await pool.query(
      `DELETE FROM usuarios  WHERE id = $1 RETURNING *`,
      [id]
    );
    console.log("Usuarios eliminados : ", res.rows);
  } catch (error) {
    console.log("error", error, error.message);
    throw { error: error.message };
  }
};

const actualizarUsuario = async (id, nombre, balance) => {
  try {
    const res = await pool.query(
      "UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *",
      [nombre, balance, id]
    );
    console.log("Usuarios actualizado : ", res);
  } catch (error) {
    console.log("error", error, error.message);
    throw { error: error.message };
  }
};
// comienza la segunda tabla de transferencia
const transferencia = async (emisor, receptor, monto) => {
  try {
    await pool.query("BEGIN");
    const descontar = await pool.query(
      "UPDATE usuarios SET balance = balance - $1 WHERE id = $2 RETURNING *",
      [monto, emisor]
    ); 

    console.log("descuento $",descontar);


    const acreditar = await pool.query(
      "UPDATE usuarios SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [monto, emisor]
    );
    console.log("acreditar $",acreditar);

    const actualizarUsuarios = await pool.query(
      "INSERT INTO transferencias  (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *",
      [emisor, receptor, monto]
    );
    console.log("actualizar: ",actualizarUsuarios);

    await pool.query("COMMIT");
    actualizarUsuario();
   
  } catch (error) {
    await pool.query("ROLLBACK");
    console.log("error", error, error.message);
    throw { error: error.message };
  }
};


const transferencias = async (req, res) => {
  console.log("nombre, balance $ ",req, res);
  try {
    const res = await pool.query("SELECT * FROM transferencias");
    console.log("Transacciones registradas : ", res.rows);
    
    return res.rows;
  } catch (error) {
    console.log("error", error, error.message);
    throw { error: error.message };
  }
};

module.exports = {
  pool,
  agregarUsuario,
  obtenerUsuarios,
  eliminarUsuario,
  actualizarUsuario,
  transferencias,
  transferencia,
};
