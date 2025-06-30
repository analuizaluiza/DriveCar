require('dotenv').config(); 
const config = {
  host: process.env.HOST,
  user: process.env.USUARIO,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: false
};

module.exports = config;