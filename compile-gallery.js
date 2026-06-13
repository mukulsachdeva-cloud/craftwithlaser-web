const fs = require('fs');
const path = require('path');

const catDir = './data/categories';
const itemDir = './data/gallery';

let categories = [];
let items = [];

// 1. Read custom categories created in your dashboard
if (fs.existsSync(catDir)) {
  fs.readdirSync(catDir).forEach(file => {
    if (file.endsWith('.json')) {
      try {
        categories.push(JSON.parse(fs.readFileSync(path.join(catDir, file), 'utf8')));
      } catch (e) {
        console.error(`Error reading category file ${file}:`, e);
      }
    }
  });
}

// 2. Read individual gallery items with their photo arrays
if (fs.existsSync(itemDir)) {
  fs.readdirSync(itemDir).forEach(file => {
    if (file.endsWith('.json')) {
      try {
        items.push(JSON.parse(fs.readFileSync(path.join(itemDir, file), 'utf8')));
      } catch (e) {
        console.error(`Error reading gallery item file ${file}:`, e);
      }
    }
  });
}

// 3. Map items to their respective matching categories
const outputData = {
  galleries: categories.map(cat => {
    return {
      ...cat,
      items: items.filter(item => item.category === cat.id)
    };
  })
};

// 4. Save the compiled relational data tree for the homepage
fs.writeFileSync('./gallery-index.json', JSON.stringify(outputData, null, 2));
console.log(`Successfully compiled ${categories.length} custom galleries for production.`);
