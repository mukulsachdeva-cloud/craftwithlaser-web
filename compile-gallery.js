const fs = require('fs');
const path = require('path');

const catDir = path.join(__dirname, 'data', 'categories');
const itemDir = path.join(__dirname, 'data', 'gallery');
const outputFile = path.join(__dirname, 'gallery-index.json');

let categories = [];
let items = [];

console.log("Starting Portfolio Compiler Engine...");

// 1. Read Category Folders Safely
if (fs.existsSync(catDir)) {
  fs.readdirSync(catDir).forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(catDir, file), 'utf8'));
        categories.push(content);
      } catch (e) {
        console.error(`Failed to parse category file ${file}:`, e);
      }
    }
  });
} else {
  console.log(`Directory not found yet: ${catDir}`);
}

// 2. Read Gallery Item Arrays Safely
if (fs.existsSync(itemDir)) {
  fs.readdirSync(itemDir).forEach(file => {
    if (file.endsWith('.json')) {
      try {
        const content = JSON.parse(fs.readFileSync(path.join(itemDir, file), 'utf8'));
        items.push(content);
      } catch (e) {
        console.error(`Failed to parse gallery item ${file}:`, e);
      }
    }
  });
} else {
  console.log(`Directory not found yet: ${itemDir}`);
}

// 3. Structural Map Compilation Logic
const outputData = {
  galleries: categories.map(cat => {
    return {
      ...cat,
      items: items.filter(item => item.category === cat.id)
    };
  })
};

// 4. Force Generation directly into the public root path
try {
  fs.writeFileSync(outputFile, JSON.stringify(outputData, null, 2), 'utf8');
  console.log(`SUCCESS: Compiled ${categories.length} categories into ${outputFile}`);
} catch (err) {
  console.error("CRITICAL: Failed to write output file:", err);
}
