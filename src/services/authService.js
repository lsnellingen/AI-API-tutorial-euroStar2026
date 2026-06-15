const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'ecommerce-secret-key';
const JWT_EXPIRES_IN = '1h';

function register({ username, email, password }) {
  if (!username || !email || !password) {
    throw new Error('Username, email, and password are required');
  }

  if (userModel.findByUsername(username)) {
    throw new Error('Username already exists');
  }

  if (userModel.findByEmail(email)) {
    throw new Error('Email already exists');
  }

  const user = userModel.create({ username, email, password });
  const token = generateToken(user);

  return {
    user: userModel.toPublic(user),
    token,
  };
}

function login({ username, password }) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = userModel.findByUsername(username);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Invalid username or password');
  }

  const token = generateToken(user);

  return {
    user: userModel.toPublic(user),
    token,
  };
}

function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

module.exports = {
  register,
  login,
  verifyToken,
};
