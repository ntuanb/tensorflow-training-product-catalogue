const fs = require('fs');

// Example categories and brands
const categories = {
  Technology: ["Logitech", "HP", "Canon", "Apple", "Microsoft", "Samsung", "Belkin", "Epson"],
  Stationery: ["Marbig", "Stabilo", "Bic", "PaperMate", "Sharpie", "Pilot", "Uni-ball"],
  "Office Furniture": ["Steelcase", "Fellowes", "Artiss", "ErgoTune", "Tontine", "Sylex"],
  "Art & Craft": ["Reeves", "Derwent", "Faber-Castell", "Crayola", "Winsor & Newton"],
  "Cleaning & Breakroom": ["Dettol", "Ajax", "Finish", "Nescafe", "Kleenex", "Morning Fresh"]
};

// Helper to create random product name by category
function generateProductName(category, brand) {
  const baseNames = {
    Technology: ["Wireless Mouse", "Laptop", "Printer", "Monitor", "Keyboard", "Webcam", "USB Hub", "Headset"],
    Stationery: ["Ballpoint Pen", "Notebook", "Highlighter", "Stapler", "Paper Ream", "Clipboard", "Envelope Pack"],
    "Office Furniture": ["Office Chair", "Standing Desk", "Filing Cabinet", "Bookshelf", "Desk Lamp", "Footrest"],
    "Art & Craft": ["Sketchbook", "Paint Set", "Brush Pack", "Canvas", "Marker Set", "Colour Pencils"],
    "Cleaning & Breakroom": ["Dishwashing Liquid", "Surface Wipes", "Coffee Jar", "Tissues Box", "Hand Sanitizer", "Paper Towels"]
  };
  const choices = baseNames[category];
  return `${brand} ${choices[Math.floor(Math.random() * choices.length)]}`;
}

// Generate 500 products
const products = [];
for (let i = 0; i < 500; i++) {
  const categoryNames = Object.keys(categories);
  const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const brand = categories[category][Math.floor(Math.random() * categories[category].length)];

  const product = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${i}`,
    name: generateProductName(category, brand),
    brand,
    category,
    price: parseFloat((Math.random() * (1800 - 2.5) + 2.5).toFixed(2)),
    size: parseFloat((Math.random() * 50 + 0.1).toFixed(2)),
    stockQuantity: Math.floor(Math.random() * 296) + 5,
    isOnlineExclusive: Math.random() < 0.5
  };
  products.push(product);
}

// Save to JSON file
fs.writeFileSync('products.json', JSON.stringify(products, null, 2));
console.log('✅ Generated products.json with 500 products');
