const fs = require('fs');
const path = require('path');
const screensDir = path.join(__dirname, 'src', 'screens');
const files = fs.readdirSync(screensDir).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));

files.forEach(file => {
  const filePath = path.join(screensDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/#4338ca/gi, '#C86A34');
  content = content.replace(/#3730a3/gi, '#B35D2A');
  content = content.replace(/#6366f1/gi, '#C86A34');
  content = content.replace(/#c7d2fe/gi, '#FCE0D0');
  content = content.replace(/#e0e7ff/gi, '#FFE0C7');
  content = content.replace(/#eef2ff/gi, '#FFF0E6');
  
  content = content.replace(/backgroundColor:\s*['"]#f9fafb['"]/g, "backgroundColor: '#ffffff'");

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', file);
  }
});
