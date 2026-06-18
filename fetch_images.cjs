const fs = require('fs');

const flavors = ['Chocolate', 'Pineapple', 'Mango', 'Fruit', 'Butterscotch', 'Blueberry', 'Black Forest', 'Vanilla', 'Red Velvet', 'Kit Kat', 'Oreo'];

const fetchImages = async () => {
  const flavorUrls = {};
  for (const flavor of flavors) {
    try {
      const res = await fetch(`https://unsplash.com/napi/search/photos?query=${encodeURIComponent(flavor + ' cake')}&per_page=10`);
      const data = await res.json();
      flavorUrls[flavor] = data.results.map(img => img.urls.regular);
      console.log(`Fetched ${data.results.length} images for ${flavor}`);
    } catch (e) {
      console.error(`Failed for ${flavor}`, e);
    }
  }
  fs.writeFileSync('flavor_urls.json', JSON.stringify(flavorUrls, null, 2));
  console.log('Saved to flavor_urls.json');
};

fetchImages();
