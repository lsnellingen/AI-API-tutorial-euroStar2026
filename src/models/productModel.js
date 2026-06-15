const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'Noise-cancelling over-ear headphones',
    price: 149.99,
    stock: 50,
  },
  {
    id: 2,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with Cherry MX switches',
    price: 89.99,
    stock: 30,
  },
  {
    id: 3,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and SD card reader',
    price: 49.99,
    stock: 100,
  },
];

function findAll() {
  return products;
}

function findById(id) {
  return products.find((product) => product.id === id);
}

function reduceStock(id, quantity) {
  const product = findById(id);
  if (!product || product.stock < quantity) {
    return false;
  }
  product.stock -= quantity;
  return true;
}

module.exports = {
  findAll,
  findById,
  reduceStock,
};
