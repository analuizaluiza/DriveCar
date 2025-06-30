const express = require('express');
const router = express.Router();
const path = require('path');
const { pool } = require('../db/db');
const authMiddleware = require('../middlewares/authMiddleware');
require('dotenv').config();
// Configurar o multer


router.get('/api/cars/search', async (req, res) => {
  const search = req.query.q;

  if (!search) {
    return res.status(400).json({ message: "Parâmetro de busca 'q' é obrigatório" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM cars WHERE brand LIKE ? OR model LIKE ?",
      [`%${search}%`, `%${search}%`]
    );
    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar carros:", error);
    res.status(500).json({ message: "Erro interno ao buscar carros" });
  }
});

const fs = require('fs');

router.get('/api/cars/:id', async (req, res) => {
  const { id } = req.params;
  const [rows] = await pool.query('SELECT * FROM cars WHERE carId = ?', [id]);
  res.json(rows[0]);
});

router.delete('/api/cars/:id', authMiddleware, async (req, res) => {
  try {
    const carId = req.params.id;

    // Buscar imagem antes de deletar
    const [cars] = await pool.query('SELECT image FROM cars WHERE carId = ?', [carId]);

    if (cars.length === 0) {
      return res.status(404).json({ message: 'Carro não encontrado.' });
    }

    const imagePath = cars[0].image;

    await pool.query('DELETE FROM cars WHERE carId = ?', [carId]);

    if (imagePath) {
      const localPath = path.join(__dirname, '..', imagePath);
      fs.unlink(localPath, (err) => {
        if (err) console.error('Erro ao deletar imagem:', err);
      });
    }

    res.json({ message: 'Carro deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar carro:', error);
    res.status(500).json({ message: 'Erro interno ao deletar carro.' });
  }
});


router.get('/api/cars', async (req, res) => {
  try {
    const [cars] = await pool.query("SELECT * FROM cars WHERE is_active = 1");
    res.json(cars);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar carros' });
  }
});

module.exports = router;
