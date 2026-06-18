import fs from 'fs';

const mappings = JSON.parse(fs.readFileSync('image_mappings.json', 'utf8'));
let mockData = fs.readFileSync('src/utils/mockData.js', 'utf8');

for (const id in mappings) {
  const url = mappings[id];
  // We need to replace `image: getCakeImage('...')` with `image: '${url}'`
  // But wait, some cakes in mockData might not be using getCakeImage anymore if they were changed, though I haven't changed them.
  // Actually, let's just use regex to replace `image: getCakeImage\('[^']+'\)` with `image: '${url}'` for each specific object.
  // A safer way is to find `{ id: '${id}', ... image: ... }`
  
  const regex = new RegExp(`({ id: '${id}'.*?image: )[^,}]+`, 'g');
  mockData = mockData.replace(regex, `$1'${url}'`);
}

fs.writeFileSync('src/utils/mockData.js', mockData);
console.log('mockData updated!');
