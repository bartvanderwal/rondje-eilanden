const fs = require('fs');
const csv = require('csv-parser');

const results = [];

fs.createReadStream('./data/participants.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    fs.writeFileSync('./data/participants.json', JSON.stringify(results, null, 2), 'utf8');
    console.log('CSV to JSON conversion completed.');
  });