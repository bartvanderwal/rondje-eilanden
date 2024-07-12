const fs = require('fs');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const execSync = require('child_process').execSync;

const verbose = true;
const reallyVerbose = true;
const startjaar = 2023;
const eindjaar = 2023;

for (let jaar = startjaar; jaar <= eindjaar; jaar++) {
  let inputFile = `./input/rondje-eilanden-${jaar}.html`;
  let htmlBuffer;
  try {
    htmlBuffer = fs.readFileSync(inputFile);
    let encoding = detectEncoding(inputFile);
    let resultFilename = `results-${jaar}.json`;

    console.log(`Start met scrapen ${inputFile} naar ${resultFilename} met encoding ${encoding}.`);
    parseFile(htmlBuffer, resultFilename, encoding);
  } catch (error) {
    console.log(`Fout voor jaar ${jaar}, waarschijnlijk Corona jaar ofzo, ik skip ${inputFile}`);
    if (verbose) {
      console.error(error);
    }
  }
}

function detectEncoding(filePath) {
  let output = execSync(`file -I ${filePath}`).toString();
  let match = output.match(/charset=(\S+)/);
  return match ? match[1] : 'unknown';
}

function parseFile(htmlBuffer, resultFilename, encoding) {
  let html;
  if (encoding === 'utf-16le' || encoding === 'iso-8859-1' || encoding === 'utf-8') {
    html = iconv.decode(htmlBuffer, encoding.toUpperCase().replace('-', ''));
  } else {
    html = htmlBuffer.toString();
  }

  const $ = cheerio.load(html);

  // Debug: Log de volledige HTML om te zien of deze correct is geladen
  console.log(`HTML Content (begin): ${$('html').html().slice(0, 200)}`);

  // Tussen variabele voor tabel rijen
  let participants = $('table tr');
  if (verbose) {
    console.log(`Parsen ${participants.length} tabel rijen`);
  }

  let results = [];

  participants.each((rowNum, elem) => {
    const cols = $(elem).find('td');
    if (reallyVerbose) {
      console.log(`Cols length: ${cols.length}`);
    }

    let result;
    if (cols.length === 7) {
      result = {
        position: $(cols[0]).text().trim(),
        startNumber: $(cols[1]).text().trim(),
        name: $(cols[2]).text().trim(),
        city: $(cols[3]).text().trim(),
        category: $(cols[4]).text().trim(),
        categoryPosition: $(cols[5]).text().trim(),
        totalTime: $(cols[6]).text().trim(),
      }
    } else if (cols.length === 9) {
      result = {
        position: $(cols[0]).text().trim(),
        startNumber: $(cols[1]).text().trim(),
        name: $(cols[2]).text().trim(),
        city: $(cols[3]).text().trim(),
        category: $(cols[6]).text().trim(),
        categoryPosition: $(cols[5]).text().trim(),
        totalTime: $(cols[8]).text().trim(),
      };
    }

    if (reallyVerbose) {
      console.log(`Row ${rowNum}: ${JSON.stringify(result)}`);
    }
    results.push(result);
  });

  // Schrijf de resultaten naar een JSON-bestand
  fs.writeFileSync(`./output/${resultFilename}`, JSON.stringify(results, null, 2), 'utf8');
  console.log(`Scraping completed and results saved to "${resultFilename}"`);
}
