// Simple script to create placeholder images using Node.js
const fs = require('fs');
const path = require('path');

const vehicles = [
  { name: 'toyota-land-cruiser-prado', color: '#1a1a1a', text: 'Toyota Land Cruiser Prado' },
  { name: 'nissan-xtrail', color: '#2c3e50', text: 'Nissan X-Trail' },
  { name: 'mitsubishi-pajero', color: '#34495e', text: 'Mitsubishi Pajero' },
  { name: 'toyota-camry', color: '#3498db', text: 'Toyota Camry' },
  { name: 'honda-accord', color: '#e74c3c', text: 'Honda Accord' },
  { name: 'toyota-prius', color: '#27ae60', text: 'Toyota Prius' },
  { name: 'toyota-hilux', color: '#f39c12', text: 'Toyota Hilux' },
  { name: 'isuzu-dmax', color: '#e67e22', text: 'Isuzu D-Max' },
  { name: 'nissan-note', color: '#9b59b6', text: 'Nissan Note' },
  { name: 'toyota-vitz', color: '#16a085', text: 'Toyota Vitz' }
];

const imagesDir = path.join(__dirname, 'public', 'images', 'vehicles');

// Create SVG placeholders (these will work immediately)
vehicles.forEach(vehicle => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
  <rect width="600" height="400" fill="${vehicle.color}"/>
  <text x="300" y="180" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${vehicle.text}</text>
  <text x="300" y="220" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.8)" text-anchor="middle">🚗</text>
</svg>`;
  
  const filePath = path.join(imagesDir, `${vehicle.name}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`Created: ${vehicle.name}.svg`);
});

console.log('\n✅ All placeholder images created!');
console.log('Now updating database with local image paths...');
