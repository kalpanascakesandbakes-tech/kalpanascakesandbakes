import fs from 'fs';

const cakes = [
  { id: 'c1', query: 'chocolate truffle cake' },
  { id: 'c2', query: 'mango cake' },
  { id: 'c3', query: 'pineapple cake' },
  { id: 'c4', query: 'mixed fruit cake' },
  { id: 'c5', query: 'butterscotch cake' },
  { id: 'c6', query: 'blueberry cake' },
  { id: 'c7', query: 'black forest cake' },
  { id: 'c8', query: 'vanilla cake' },
  { id: 'c9', query: 'red velvet cake' },
  { id: 'c10', query: 'kit kat cake' },
  { id: 'c11', query: 'oreo cake' },
  { id: 'c12', query: 'football cake' },
  { id: 'c13', query: 'fire cake' },
  { id: 'c14', query: 'anime cake' },
  { id: 'c15', query: 'gold wedding cake' },
  { id: 'c16', query: 'silver anniversary cake' },
  { id: 'c17', query: '18th birthday cake' },
  { id: 'c18', query: 'photo print cake' },
  { id: 'c19', query: 'half birthday cake' },
  { id: 'c20', query: '40th birthday cake' },
  { id: 'c21', query: '50th birthday cake' },
  { id: 'c22', query: '1st birthday cake' },
  { id: 'c23', query: '5th anniversary cake' },
  { id: 'c24', query: '10th anniversary cake' },
];

async function fetchImage(query) {
  try {
    const response = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=1`);
    if (!response.ok) return null;
    const json = await response.json();
    if (json.results && json.results.length > 0) {
      return json.results[0].urls.regular;
    }
  } catch (e) {
    return null;
  }
  return null;
}

async function main() {
  const mappings = {};
  for (const cake of cakes) {
    console.log(`Fetching ${cake.query}...`);
    let url = await fetchImage(cake.query);
    if (!url) {
      url = await fetchImage('delicious cake');
    }
    mappings[cake.id] = url;
    await new Promise(r => setTimeout(r, 800));
  }
  
  fs.writeFileSync('image_mappings.json', JSON.stringify(mappings, null, 2));
  console.log('Done.');
}

main();
