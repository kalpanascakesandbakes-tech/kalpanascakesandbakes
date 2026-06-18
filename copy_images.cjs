const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\patga\\.gemini\\antigravity\\brain\\4afcb176-dc2b-47e2-8d13-9b7ba1658d20';
const destDir = path.join(__dirname, 'public', 'cakes');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = [
  'truffle_whole_1781772121847.png',
  'truffle_top_1781772132295.png',
  'truffle_side_1781772143569.png',
  'truffle_slice_1781772159179.png'
];

files.forEach(file => {
  fs.copyFileSync(path.join(srcDir, file), path.join(destDir, file));
});

console.log('Images copied successfully.');
