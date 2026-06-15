const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`E-commerce API running on http://localhost:${PORT}`);
});

module.exports = app;
