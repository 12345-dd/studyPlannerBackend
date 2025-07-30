const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname,'src', 'routes');
let docs = '## API Documentation\n\n';

fs.readdirSync(routesDir).forEach(file => {
  const content = fs.readFileSync(path.join(routesDir, file), 'utf-8');
  const lines = content.split('\n');

  let api = '';

  lines.forEach(line => {
    line = line.trim();

    if (line.startsWith('// @api')) {
      api = line.replace('// @api', '').trim();
    }

    if (line.startsWith('router.')) {
      const methodMatch = line.match(/router\.(\w+)\(/);
      const pathMatch = line.match(/\(['"`](.*?)['"`]/);

      if (methodMatch && pathMatch) {
        const method = methodMatch[1].toUpperCase();
        const routePath = pathMatch[1];

        docs += `### [${method}] ${routePath}\n`;
        docs += `Description: ${api}\n\n`;
      }
    }
  });
});

fs.writeFileSync('apiDoc.md', docs);
console.log('API documentation generated successfully!');
