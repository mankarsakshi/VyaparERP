const fs = require('fs');
const path = require('path');
const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/\r?\n\s*,\r?\n/g, "\n  },\n");
  content = content.replace(/\r?\n\s*\/\/\s*,\r?\n/g, "\n//   },\n");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed syntax in', file);
  }
});
