const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

/* 
    * TODO *
    Älä turhaan sulje puppeteer
    Lisää filttereitä
*/
app.get('/api/v1/:kunta?', async (req, res) => {
  try {
    // Käynnistä Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });

    // Avaa uusi sivu
    const page = await browser.newPage();

    // Navigoi tilannehuoneeseen
    const url = 'https://www.tilannehuone.fi/halytys.php';
    await page.goto(url);

    // Odota että kama lataa
    await page.waitForSelector('tr.halytys');

    // Scrapee data
    const data = await page.evaluate((kunta) => {
      const rows = Array.from(document.querySelectorAll('tr.halytys'));

      return rows
        .map((row) => {
          const kuntaValue = row.querySelector('.kunta').textContent.trim();
          const pvmdate = row.querySelector('.pvmdate').textContent.trim();
          const typeElement = row.querySelector('td:nth-child(4)');
          const type = typeElement.textContent.trim();

          return { kunta: kuntaValue, pvmdate, type };
        })
        .filter((item) => {
          if (kunta) {
            const filterValue = kunta.toLowerCase();

            return item.kunta.toLowerCase() === filterValue;
          }

          return true;
        });
    }, req.params.kunta);

    // Sulje selain
    await browser.close();

    // Lähtetä vastaus json muodossa
    res.json(data);
  } catch (error) {
    console.error('Error occurred while scraping:', error);
    res.status(500).send('An error occurred');
  }
});

// Express
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
