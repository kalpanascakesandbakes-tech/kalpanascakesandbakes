const fs = require('fs');

const flavorUrls = JSON.parse(fs.readFileSync('flavor_urls.json', 'utf8'));

const FLAVORS = [
  'Chocolate', 'Pineapple', 'Mango', 'Fruit', 'Butterscotch', 
  'Blueberry', 'Black Forest', 'Vanilla', 'Red Velvet', 'Kit Kat', 'Oreo'
];

const CATEGORIES = [
  'Trending Cakes',
  'Birthday Cakes',
  'Anniversary Cakes',
  'Gourmet Cakes',
  'Bento Cakes',
  'Photo Cakes',
  'Designer Cakes',
  'Half Birthday Cakes'
];

// Our AI generated 4-angle shoots
const flavorImages = {
  'Chocolate': ['/cakes/truffle_whole_1781772121847.png', '/cakes/truffle_top_1781772132295.png', '/cakes/truffle_side_1781772143569.png', '/cakes/truffle_slice_1781772159179.png'],
  'Mango': ['/cakes/mango_whole_1781772394311.png', '/cakes/mango_top_1781772405640.png', '/cakes/mango_side_1781772418039.png', '/cakes/mango_slice_1781772427714.png'],
  'Pineapple': ['/cakes/pineapple_whole_1781772439907.png', '/cakes/pineapple_top_1781772452398.png', '/cakes/pineapple_side_1781772464244.png', '/cakes/pineapple_slice_1781772477105.png'],
  'Fruit': ['/cakes/fruit_whole_1781772489345.png', '/cakes/fruit_top_1781772504150.png', '/cakes/fruit_side_1781772517557.png', '/cakes/fruit_slice_1781772530489.png']
};

const defaultImages = [
  'https://plus.unsplash.com/premium_photo-1679047241341-c2fb93336bb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Y2FrZXxlbnwwfHx8fDE3ODE3NjI4Njh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1714670623261-a2e9797d4e05?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8dmFuaWxsYSUyMGNha2V8ZW58MHx8fHwxNzgxNzYyODUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1713447395823-2e0b40b75a89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8Ymx1ZWJlcnJ5JTIwY2FrZXxlbnwwfHx8fDE3ODE3NjI4NDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1750085037153-1e62f0730bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8a2l0JTIwa2F0JTIwY2FrZXxlbnwwfHx8fDE3ODE3NjI4NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1670445426823-db5647af73ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8b3JlbyUyMGNha2V8ZW58MHx8fHwxNzgxNzYyODU3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://plus.unsplash.com/premium_photo-1716484116881-01a900990846?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMjA3fDB8MXxzZWFyY2h8MXx8ZmlyZSUyMGNha2V8ZW58MHx8fHwxNzgxNzYyODYxfDA&ixlib=rb-4.1.0&q=80&w=1080'
];

let cakeIdCounter = 1;
const mockCakes = [];

CATEGORIES.forEach((category, catIndex) => {
  FLAVORS.forEach((flavor, index) => {
    const isBestSeller = category === 'Trending Cakes' && index < 4; 
    
    let imagesArr = null;
    let mainImage = '';
    
    // We only use the 4-angle shoots for the 'Trending Cakes' category
    // For other categories, even for Chocolate, we use Unsplash so they look distinct
    if (category === 'Trending Cakes' && flavorImages[flavor]) {
      imagesArr = flavorImages[flavor];
      mainImage = imagesArr[0];
    } else {
      // Pick a unique image from the Unsplash list
      const flavorList = flavorUrls[flavor] || [];
      if (flavorList.length > 0) {
        mainImage = flavorList[catIndex % flavorList.length];
      } else {
        mainImage = defaultImages[(catIndex + index) % defaultImages.length];
      }
    }

    let name = `Premium ${flavor} ${category.replace(' Cakes', '')}`;
    if (flavor === 'Chocolate') name = `Dutch Truffle ${category.replace(' Cakes', '')}`;
    if (flavor === 'Mango') name = `Fresh Mango ${category.replace(' Cakes', '')}`;

    mockCakes.push({
      id: `c${cakeIdCounter++}`,
      name: name,
      category: 'Cakes',
      flavor: flavor,
      price: 450 + (index * 20),
      rating: parseFloat((4.5 + (Math.random() * 0.5)).toFixed(1)),
      tags: [category, '60 Minutes Delivery'],
      image: mainImage,
      ...(imagesArr && { images: imagesArr }),
      ...(isBestSeller && { isBestSeller: true })
    });
  });
});

const output = `export const FLAVORS = ${JSON.stringify(FLAVORS, null, 2)};

export const CATEGORIES = ${JSON.stringify(CATEGORIES, null, 2)};

export const mockCakes = ${JSON.stringify(mockCakes, null, 2)};

export const getBestSellers = () => mockCakes.filter(cake => cake.isBestSeller);
export const getFeaturedCakes = () => mockCakes.filter(cake => cake.tags.includes('Trending Cakes')).slice(0, 4);

export const getAllTags = () => {
  const tags = new Set();
  mockCakes.forEach(cake => {
    cake.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
};
`;

fs.writeFileSync('src/utils/mockData.js', output);
console.log('mockData.js regenerated!');
