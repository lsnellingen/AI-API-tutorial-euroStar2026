const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const swaggerPath = path.join(__dirname, '../../swagger.yaml');

function loadSwaggerDocument() {
  const fileContents = fs.readFileSync(swaggerPath, 'utf8');
  return yaml.load(fileContents);
}

function getSwaggerSpec(req, res) {
  try {
    const document = loadSwaggerDocument();
    res.status(200).json(document);
  } catch {
    res.status(500).json({ error: 'Failed to load Swagger specification' });
  }
}

module.exports = {
  loadSwaggerDocument,
  getSwaggerSpec,
};
