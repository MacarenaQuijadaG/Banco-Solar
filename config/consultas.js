const pg = require('pg');

const pool = new pg.Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bancosolar',
  password: 'desarrollo',
  port: 5432,
});

const agregarUsuario = async (nombre, balance) => {
  const result = await pool.query('INSERT INTO usuarios (nombre, balance) VALUES ($1, $2) RETURNING *', [nombre, balance]);
  return result.rows[0];
};

const obtenerUsuarios = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
};

const actualizarUsuario = async (id, nombre, balance) => {
  const result = await pool.query('UPDATE usuarios SET nombre = $1, balance = $2 WHERE id = $3 RETURNING *', [nombre, balance, id]);
  return result.rows[0];
};

const eliminarUsuario = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
};

const realizarTransferencia = async (emisor, receptor, monto) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE usuarios SET balance = balance - $1 WHERE id = $2', [monto, emisor]);
    await client.query('UPDATE usuarios SET balance = balance + $1 WHERE id = $2', [monto, receptor]);
    const result = await client.query('INSERT INTO transferencias (emisor, receptor, monto, fecha) VALUES ($1, $2, $3, NOW()) RETURNING *', [emisor, receptor, monto]);
    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const obtenerTransferencias = async () => {
  const result = await pool.query('SELECT * FROM transferencias');
  return result.rows;
};

module.exports = { agregarUsuario, obtenerUsuarios, actualizarUsuario, eliminarUsuario, realizarTransferencia, obtenerTransferencias };
