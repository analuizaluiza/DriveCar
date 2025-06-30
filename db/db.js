const mysql = require("mysql2/promise");
const config = require("./config");

const userSchema = require("../schemas/userSchema");
const carSchema = require("../schemas/carSchema");
const bookingSchema = require("../schemas/bookingSchema");

const seedCars = require("./seeders/seedCars"); // << Importa o seeder

const pool = mysql.createPool(config);

async function ensureTable(connection, schema, tableName) {
  await connection.query(schema);
  console.log(`✅ Tabela '${tableName}' verificada/criada.`);
}

async function connectDB() {
  try {
    const connection = await pool.getConnection();
    console.log("🟢 Conectado ao MySQL");

    await ensureTable(connection, userSchema, "users");
    await ensureTable(connection, carSchema, "cars");
    await ensureTable(connection, bookingSchema, "bookings");

    await seedCars(connection); // << Usa o seeder separado

    connection.release();
  } catch (err) {
    console.error("❌ Erro na conexão/criação:", err.message);
  }
}

module.exports = { pool, connectDB };
