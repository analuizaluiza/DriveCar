const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db/db');

require('dotenv').config();

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ message: 'A senha deve ter pelo menos 8 caracteres.' });
  }

  try {
    const connection = await pool.getConnection();

    const [existente] = await connection.query('SELECT userId FROM users WHERE email = ?', [email]);
    if (existente.length > 0) {
      return res.status(409).json({ message: 'Email já cadastrado.' });
    }

    // Cria hash da senha
    const hash = await bcrypt.hash(password, 10);

    // Insere o usuário
    const [resultado] = await connection.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hash]
    );

    // Gera token JWT (crie um segredo JWT no .env)
    const token = jwt.sign({ userId: resultado.insertId, email }, process.env.JWT_SECRET, {
      expiresIn: '2h',
    });

    res.status(201).json({ token });
  } catch (erro) {
    console.error('Erro ao registrar:', erro);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
  }

  try {
    const connection = await pool.getConnection();

    const [usuarios] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado.' });
    }

    const usuario = usuarios[0];

    const senhaCorreta = await bcrypt.compare(password, usuario.password);

    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    const token = jwt.sign(
      { userId: usuario.userId, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(200).json({ access_token: token });
  } catch (erro) {
    console.error('Erro no login:', erro);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
});

module.exports = router;