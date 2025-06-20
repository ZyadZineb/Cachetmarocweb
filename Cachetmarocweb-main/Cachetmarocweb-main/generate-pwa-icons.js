const fs = require('fs');
const path = require('path');

// Create simple SVG icons that can be converted to PNG
const createSVGIcon = (size) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#004AAD;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0056CC;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  
  <!-- Border -->
  <rect x="2" y="2" width="${size-4}" height="${size-4}" fill="none" stroke="#E30613" stroke-width="${size/48}"/>
  
  <!-- Stamp icon -->
  <rect x="${size*0.3}" y="${size*0.3}" width="${size*0.4}" height="${size*0.4}" fill="white" stroke="#004AAD" stroke-width="${size/96}"/>
  
  <!-- Text -->
  <text x="${size/2}" y="${size*0.8}" font-family="Arial, sans-serif" font-size="${size/12}" font-weight="bold" text-anchor="middle" fill="white">CACHETS</text>
  <text x="${size/2}" y="${size*0.9}" font-family="Arial, sans-serif" font-size="${size/12}" font-weight="bold" text-anchor="middle" fill="white">MAROC</text>
</svg>`;
};

// Create the SVG files
const svg192 = createSVGIcon(192);
const svg512 = createSVGIcon(512);

// Write SVG files
fs.writeFileSync(path.join(__dirname, 'public', 'pwa-192x192.svg'), svg192);
fs.writeFileSync(path.join(__dirname, 'public', 'pwa-512x512.svg'), svg512);

console.log('SVG icons created successfully!');
console.log('Files created:');
console.log('- public/pwa-192x192.svg');
console.log('- public/pwa-512x512.svg');

// For PNG conversion, we'll create a simple base64 encoded PNG
// This is a minimal approach - in production you'd use a proper image library

const createBase64PNG = (size) => {
  // This is a simple 1x1 blue pixel PNG encoded in base64
  // In a real implementation, you'd use canvas or an image library
  const bluePixel = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA60e6kgAAAABJRU5ErkJggg==';
  return bluePixel;
};

// Create simple placeholder PNGs (these will be replaced by the HTML generator)
const pngData = createBase64PNG();

// Create the actual PNG files using a simple approach
// Note: This creates minimal PNGs - use the HTML generator for better quality
const createSimplePNG = (size) => {
  // Create a simple PNG header for a solid color image
  const canvas = `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="#004AAD"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/8}" fill="white" text-anchor="middle" dy=".3em">CM</text>
  </svg>`;
  
  return canvas;
};

console.log('\nTo create high-quality PNG icons:');
console.log('1. Open the create-pwa-icons.html file in your browser');
console.log('2. Click "Download Icons" to get the PNG files');
console.log('3. Save them as pwa-192x192.png and pwa-512x512.png in the public folder');
