const fs = require('fs');
const path = require('path');
const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Replace lone comma after 'alignItems: 'center','
  content = content.replace(/alignItems:\s*'center',\s*\,/g, "alignItems: 'center',\n  },");
  content = content.replace(/alignItems:\s*'flex-start',\s*\,/g, "alignItems: 'flex-start',\n  },");

  // In some files, it might be commented out like '//   ,'
  content = content.replace(/alignItems:\s*'center',\s*\/\/\s*\,/g, "alignItems: 'center',\n//   },");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed syntax in', file);
  }
});
