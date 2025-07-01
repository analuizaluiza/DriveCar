const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const { carId, start_date, end_date, total_price } = req.body;
    console.log("Usuário autenticado:", req.user);
    const userId = req.user.userId;

    if (!carId || !start_date || !end_date || !total_price) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const sql = `
      INSERT INTO bookings (user_id, car_id, start_date, end_date, total_price)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(sql, [userId, carId, start_date, end_date, total_price]);

    res.status(201).json({ message: 'Reserva realizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro interno ao criar reserva.' });
  }
});

router.get('/api/bookings', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const [rows] = await pool.query(
      `SELECT 
         b.bookingId, 
         b.start_date, 
         b.end_date, 
         b.total_price, 
         b.status,
         c.model, 
         c.brand
       FROM bookings b
       JOIN cars c ON b.car_id = c.carId
       WHERE b.user_id = ?`,
      [userId]
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ message: 'Erro interno ao buscar reservas' });
  }
});

router.put('/api/bookings/:id/cancel', async (req, res) => {
  const bookingId = req.params.id;

  try {
    const [result] = await pool.query(
      `UPDATE bookings 
       SET status = 'cancelled', cancelled_at = NOW() 
       WHERE bookingId = ? AND status = 'active'`,
      [bookingId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Reserva não encontrada ou já cancelada.' });
    }

    res.json({ message: 'Reserva cancelada com sucesso!' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno ao cancelar a reserva.' });
  }
});

module.exports = router;
