import fs from 'fs';
import path from 'path';

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.css') || file.endsWith('.json')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
let count = 0;
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('—')) {
    // Replace spaced em-dash with spaced hyphen
    content = content.replace(/ — /g, ' - ');
    // Replace remaining em-dashes with hyphen
    content = content.replace(/—/g, '-');
    fs.writeFileSync(f, content);
    count++;
  }
});
console.log('Removed em-dashes from', count, 'files.');
