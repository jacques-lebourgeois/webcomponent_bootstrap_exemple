const fs = require('fs');
const path = require('path');

const src = path.join(__dirname, '..', 'node_modules', 'bootstrap538', 'dist', 'css', 'bootstrap.min.css');
const destDir = path.join(__dirname, '..', 'src', 'components', 'my-bootstrap');
const dest = path.join(destDir, 'bootstrap.css');

// Ensure dest dir exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

try {
  fs.copyFileSync(src, dest);
  console.log('Copied bootstrap 5.3.8 CSS to', dest);
} catch (err) {
  console.error('Failed to copy bootstrap CSS. Did you run npm install?');
  console.error(err);
  process.exit(1);
}