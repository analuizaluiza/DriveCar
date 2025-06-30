const express = require('express');
const router = express.Router();
const { pool } = require('../db/db');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authMiddleware");

require('dotenv').config();

router.get("/api/user", authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT userId, name, email FROM users WHERE userId = ?",
      [req.user.userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Erro na rota /api/user:", error);
    res.status(500).json({ message: 'Erro interno', error: error.message });
  }
});

// PUT editar perfil
router.put('/api/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email, password } = req.body;

    if (!name || !email)
      return res.status(400).json({ message: 'Nome e email são obrigatórios' });

    const updateFields = [name, email];
    let sql = 'UPDATE users SET name = ?, email = ?';

    if (password && password.trim() !== '') {
      const bcrypt = require('bcryptjs');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      sql += ', password = ?';
      updateFields.push(hashedPassword);
    }

    sql += ' WHERE userId = ?';
    updateFields.push(userId);

    await pool.query(sql, updateFields);

    res.json({ message: 'Perfil atualizado com sucesso' });
  } catch (error) {
    console.error("Erro no PUT /api/user:", error);
    res.status(500).json({ message: 'Erro interno ao atualizar perfil' });
  }
});


// DELETE perfil
router.delete('/api/user', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId; // Correto
    const [result] = await pool.query('DELETE FROM users WHERE userId = ?', [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado para deletar' });
    }

    res.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error("Erro ao deletar perfil:", error); // Log do erro no terminal
    res.status(500).json({ message: 'Erro interno ao deletar conta' });
  }
});

// Buscar usuários por nome
router.get('/api/users/search', authMiddleware, async (req, res) => {
  const search = req.query.q;

  if (!search) {
    return res.status(400).json({ message: "Parâmetro de busca 'q' é obrigatório" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT userId, name FROM users WHERE name LIKE ?",
      [`%${search}%`]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro interno ao buscar usuários" });
  }
});

// Buscar usuário por ID
router.get('/api/users/:id', authMiddleware, async (req, res) => {
  const userId = req.params.id;
  try {
    const [rows] = await pool.query(
      "SELECT userId, name, email FROM users WHERE userId = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ message: "Erro interno ao buscar usuário" });
  }
});

module.exports = router;