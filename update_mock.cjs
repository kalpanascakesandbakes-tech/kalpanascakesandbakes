const fs = require('fs');

const dataFile = './src/utils/mockData.js';
let content = fs.readFileSync(dataFile, 'utf8');

const mapping = {
  'Chocolate': ['/cakes/truffle_whole_1781772121847.png', '/cakes/truffle_top_1781772132295.png', '/cakes/truffle_side_1781772143569.png', '/cakes/truffle_slice_1781772159179.png'],
  'Mango': ['/cakes/mango_whole_1781772394311.png', '/cakes/mango_top_1781772405640.png', '/cakes/mango_side_1781772418039.png', '/cakes/mango_slice_1781772427714.png'],
  'Pineapple': ['/cakes/pineapple_whole_1781772439907.png', '/cakes/pineapple_top_1781772452398.png', '/cakes/pineapple_side_1781772464244.png', '/cakes/pineapple_slice_1781772477105.png'],
  'Fruit': ['/cakes/fruit_whole_1781772489345.png', '/cakes/fruit_top_1781772504150.png', '/cakes/fruit_side_1781772517557.png', '/cakes/fruit_slice_1781772530489.png']
};

const lines = content.split('\n');
const newLines = lines.map(line => {
  if (line.includes('id: \'c') && !line.includes('images: [')) {
    const flavorMatch = line.match(/flavor:\s*'([^']+)'/);
    if (flavorMatch && mapping[flavorMatch[1]]) {
      const imagesArr = JSON.stringify(mapping[flavorMatch[1]]).replace(/"/g, "'");
      // Inject before the trailing } or },
      return line.replace(/\}(,?)$/, `, image: '${mapping[flavorMatch[1]][0]}', images: ${imagesArr} }$1`);
    }
  }
  return line;
});

fs.writeFileSync(dataFile, newLines.join('\n'));
console.log('Updated mockData.js successfully.');
