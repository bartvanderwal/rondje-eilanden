const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

const verbose = true;
const startjaar = 2015;
const eindjaar = 2015;

// Laad het HTML-bestand.
for(let jaar=startjaar; jaar<=eindjaar; jaar++ ) {
  let inputFile = `./data/rondje-eilanden-${jaar}.html`;
  let htmlBuffer;
  try {
    htmlBuffer = fs.readFileSync(inputFile, 'utf8');
    let resultFilename = `results-${jaar}.json`;

    // Tussen variabele voor tabel rijen
    // Debug: Log het aantal rijen en de eerste paar rijen om de structuur te inspecteren
    console.log(`Start met scrapen ${inputFile} naar ${resultFilename}.`);
      parseFile(htmlBuffer, resultFilename)
  } catch (error) {
    console.log(`Fout voor jaar ${jaar}, waarschijnlijk Corona jaar ofzo, ik skip ${inputFile}`);
    if (verbose) {
      console.error(error);
    }
  }
}

function parseFile(htmlBuffer, resultFilename) {
  let html = iconv.decode(htmlBuffer, 'UTF-16LE');

  const $ = cheerio.load(html);

  // Debug: Log de volledige HTML om te zien of deze correct is geladen
  console.log(`HTML Content: ${$('html').html()}`);

  // Tussen variabele voor tabel rijen
  let participants = $('table tr');
  console.log(`Parsen ${participants.length} tabel rijen`);

  let results = [];

  participants.each((rowNum, elem) => {
    const cols = $(elem).find('td');
    if (cols.length === 7) {
      const result = {
        position: $(cols[0]).text().trim(),
        startNumber: $(cols[1]).text().trim(),
        name: $(cols[2]).text().trim(),
        city: $(cols[3]).text().trim(),
        category: $(cols[4]).text().trim(),
        categoryPosition: $(cols[5]).text().trim(),
        totalTime: $(cols[6]).text().trim(),
      };
      if (verbose) {
        console.log(`Row ${rowNum}: ${result}`);
      }
      results.push(result);
    }
  });

  // Schrijf de resultaten naar een JSON-bestand.
  fs.writeFileSync(`./data/${resultFilename}`, JSON.stringify(results, null, 2), 'utf8');
}
