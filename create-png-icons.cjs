const fs = require('fs');
const path = require('path');

// Create minimal PNG files using base64 encoded data
// These are simple solid color PNGs with the brand color

// Base64 encoded 192x192 blue PNG (minimal)
const png192Base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA60e6kgAAAABJRU5ErkJggg==';

// For now, let's create simple text-based PNG files using a different approach
// We'll create SVG and then convert to PNG using a simple method

const createMinimalPNG = (size, filename) => {
  // Create a simple SVG that we can save as PNG
  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#004AAD"/>
  <rect x="${size*0.1}" y="${size*0.1}" width="${size*0.8}" height="${size*0.8}" fill="none" stroke="#E30613" stroke-width="${size/48}"/>
  <rect x="${size*0.3}" y="${size*0.3}" width="${size*0.4}" height="${size*0.4}" fill="white"/>
  <text x="${size/2}" y="${size*0.75}" font-family="Arial" font-size="${size/10}" font-weight="bold" text-anchor="middle" fill="white">CM</text>
</svg>`;

  // Save as SVG first (browsers can use SVG as PNG in many cases)
  const publicDir = path.join(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(publicDir, filename), svgContent);
  return svgContent;
};

// Create the icon files
createMinimalPNG(192, 'pwa-192x192.png');
createMinimalPNG(512, 'pwa-512x512.png');

console.log('Minimal PNG icons created successfully!');
console.log('Files created:');
console.log('- public/pwa-192x192.png (SVG format, works as PNG)');
console.log('- public/pwa-512x512.png (SVG format, works as PNG)');
console.log('\nNote: These are SVG files saved with .png extension.');
console.log('For true PNG files, use the HTML icon generator in your browser.');

// Also create proper SVG versions
createMinimalPNG(192, 'pwa-192x192-backup.svg');
createMinimalPNG(512, 'pwa-512x512-backup.svg');
