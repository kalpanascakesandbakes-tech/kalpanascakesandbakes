import { mockCakes } from './src/utils/mockData.js';
import fs from 'fs';

// Convert the mockCakes array to CSV format
const headers = ['ID', 'Name', 'Category', 'Flavor', 'Price', 'Rating', 'Tags', 'Image URL'];
const rows = mockCakes.map(cake => [
  cake.id,
  `"${cake.name}"`,
  cake.category,
  cake.flavor,
  cake.price,
  cake.rating,
  `"${cake.tags.join(', ')}"`,
  `"${cake.image}"`
]);

const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');

fs.writeFileSync('Cake_Catalog_Database.csv', csvContent);
console.log('Successfully created Cake_Catalog_Database.csv!');
