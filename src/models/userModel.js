const bcrypt = require('bcryptjs');

const users = [
  {
    id: 1,
    username: 'alice',
    email: 'alice@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: 2,
    username: 'bob',
    email: 'bob@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
  {
    id: 3,
    username: 'carol',
    email: 'carol@example.com',
    password: bcrypt.hashSync('password123', 10),
  },
];

let nextUserId = 4;

function findAll() {
  return users;
}

function findById(id) {
  return users.find((user) => user.id === id);
}

function findByUsername(username) {
  return users.find((user) => user.username === username);
}

function findByEmail(email) {
  return users.find((user) => user.email === email);
}

function create({ username, email, password }) {
  const user = {
    id: nextUserId++,
    username,
    email,
    password: bcrypt.hashSync(password, 10),
  };
  users.push(user);
  return user;
}

function toPublic(user) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}

module.exports = {
  findAll,
  findById,
  findByUsername,
  findByEmail,
  create,
  toPublic,
};
