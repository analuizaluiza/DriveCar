const mysql = require('mysql2/promise');
const carSchema = require('./carSchema');

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'drive_car'
};

async function initCarTable() {
  try {
    const connection = await mysql.createConnection(dbConfig);

    // Verifica se a tabela 'cars' já existe
    const [rows] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM information_schema.tables
      WHERE table_schema = ? AND table_name = 'cars';
    `, [dbConfig.database]);

    const tabelaExiste = rows[0].count > 0;

    if (!tabelaExiste) {
      // Cria a tabela
      await connection.execute(carSchema);
      console.log('✅ Tabela cars criada com sucesso.');

      // Inserir os dados somente se a tabela foi criada
      const seedCars = [
        ['Toyota', 'Corolla', 2020, 'ABC1234', 1, 150.00, 'https://example.com/corolla.jpg'],
        ['Honda', 'Civic', 2021, 'XYZ9876', 1, 180.00, 'https://example.com/civic.jpg']
      ];

      const insertQuery = `
        INSERT INTO cars (brand, model, year, license_plate, is_active, daily_price, image)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      for (const car of seedCars) {
        await connection.execute(insertQuery, car);
      }

      console.log('🚀 Carros inseridos com sucesso!');
    } else {
      console.log('ℹ️ A tabela cars já existia. Nenhum dado foi inserido.');
    }

    await connection.end();
  } catch (error) {
    console.error('❌ Erro ao criar a tabela ou inserir dados:', error);
  }
}

initCarTable();
