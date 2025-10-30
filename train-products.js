const tf = require('@tensorflow/tfjs-node');
const fs = require('fs');

function boolToNum(val) {
  return val ? 1 : 0;
}

function oneHot(index, length) {
  return Array.from({ length }, (_, i) => (i === index ? 1 : 0));
}

const rawData = fs.readFileSync('./products.json');
const products = JSON.parse(rawData);

const brands = [...new Set(products.map(p => p.brand))];
const brandToIndex = Object.fromEntries(brands.map((b, i) => [b, i]));

const inputs = products.map(p => oneHot(brandToIndex[p.brand], brands.length)); 
console.log('Inputs', JSON.stringify(inputs), '\n\n')
const labels = products.map(p => [p.price]);
console.log('Labels', JSON.stringify(labels), '\n\n')

// Convert to tensors
const inputTensor = tf.tensor2d(inputs);
console.log('inputTensor', JSON.stringify(inputTensor), '\n\n')
const labelTensor = tf.tensor2d(labels);
console.log('labelTensor', JSON.stringify(labelTensor), '\n\n')

// Normalize numeric values (important for training)
const inputMax = inputTensor.max(0);
const inputMin = inputTensor.min(0);
const labelMax = labelTensor.max();
const labelMin = labelTensor.min();

const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

// --- Define a simple model ---
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [brands.length], units: 16, activation: 'relu' }));
model.add(tf.layers.dense({ units: 8, activation: 'relu' }));
model.add(tf.layers.dense({ units: 1 }));

model.compile({ optimizer: tf.train.adam(0.01), loss: 'meanSquaredError' });

// --- Train the model ---
(async () => {
  console.log('Training...');
  await model.fit(normalizedInputs, normalizedLabels, {
    epochs: 300,
    shuffle: true,
    verbose: 0,
  });
  console.log('Training complete.');

  const inputBrand = process.argv[2];

  const testVector = oneHot(brandToIndex[inputBrand], brands.length);
  const testTensor = tf.tensor2d([testVector]);

  const normalizedPred = model.predict(testTensor);
  const pred = normalizedPred.mul(labelMax.sub(labelMin)).add(labelMin);
  const predictedPrice = (await pred.data())[0];

  console.log(`\nPredicted average price for brand "${inputBrand}": $${predictedPrice.toFixed(2)}`);

  const items = products.filter(product => product.brand === inputBrand)
  const actualAvgPrice = items.reduce((total, item) => total + item.price, 0) / items.length;

  console.log(`\nActual average price for brand "${inputBrand}": $${actualAvgPrice}`);

  // Optional: save model
  await model.save('file://./product-model');
})();