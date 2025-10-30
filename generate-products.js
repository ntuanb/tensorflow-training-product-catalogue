const fs = require('fs');
const crypto = require('crypto'); // For UUID

// Categories, brands, and realistic price ranges
const categories = {
  Technology: {
    brands: ["Logitech", "HP", "Canon", "Apple", "Microsoft", "Samsung", "Belkin", "Epson"],
    priceRange: [50, 1800] // Technology is expensive
  },
  Stationery: {
    brands: ["Marbig", "Stabilo", "Bic", "PaperMate", "Sharpie", "Pilot", "Uni-ball"],
    priceRange: [2, 25] // Cheap items
  },
  "Office Furniture": {
    brands: ["Steelcase", "Fellowes", "Artiss", "ErgoTune", "Tontine", "Sylex"],
    priceRange: [50, 1200] // Furniture is mid-expensive
  },
  "Art & Craft": {
    brands: ["Reeves", "Derwent", "Faber-Castell", "Crayola", "Winsor & Newton"],
    priceRange: [5, 150]
  },
  "Cleaning & Breakroom": {
    brands: ["Dettol", "Ajax", "Finish", "Nescafe", "Kleenex", "Morning Fresh"],
    priceRange: [2, 100]
  }
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

const products = [];
for (let i = 0; i < 1000; i++) {
  const categoryNames = Object.keys(categories);
  const category = categoryNames[Math.floor(Math.random() * categoryNames.length)];
  const { brands, priceRange } = categories[category];
  const brand = brands[Math.floor(Math.random() * brands.length)];

  const product = {
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${i}`,
    name: generateProductName(category, brand),
    brand,
    category,
    price: parseFloat((Math.random() * (priceRange[1] - priceRange[0]) + priceRange[0]).toFixed(2)),
    size: parseFloat((Math.random() * 50 + 0.1).toFixed(2)),
    stockQuantity: Math.floor(Math.random() * 296) + 5,
    isOnlineExclusive: Math.random() < 0.5
  };
  products.push(product);
}

// Save to JSON file
fs.writeFileSync('officeworks_products.json', JSON.stringify(products, null, 2));
console.log('✅ Generated officeworks_products.json with 500 products and realistic prices');
