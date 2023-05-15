const express = require('express');
const puppeteer = require('puppeteer');

const app = express();

/*
    Copyright © Sampo Syrjämäki 2023
*/

/* 
    * TODO *
    Älä turhaan sulje puppeteer
    Lisää filttereitä
*/

app.get('/api/v1', async (req, res) => {
  try {
    // Käynnistä Puppeteer
    const browser = await puppeteer.launch({ headless: 'new' });

    // Avaa uusi sivu
    const page = await browser.newPage();

    // Mene tilannehuoneeseen
    const url = 'https://www.tilannehuone.fi/halytys.php';
    await page.goto(url);

    // Odota elementtejä
    await page.waitForSelector('tr.halytys');

    // Scrapee data
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr.halytys'));

      return rows.map((row) => {
        const kuntaValue = row.querySelector('.kunta').textContent.trim();
        const pvmdateElement = row.querySelector('.pvmdate');
        const pvmdate = pvmdateElement.textContent.trim();
        const time = pvmdateElement.nextSibling.textContent.trim();
        const typeElement = row.querySelector('td:nth-child(4)');
        const type = typeElement.textContent.trim();

        return { kunta: kuntaValue, pvmdate, time, type };
      });
    });

    // Sulje Puppeteer
    await browser.close();

    // Tarkitsta jos on kunta filtteri
    if (req.query.kunta) {
      const kuntaValues = Array.isArray(req.query.kunta)
        ? req.query.kunta.map((k) => k.toLowerCase())
        : [req.query.kunta.toLowerCase()];

      const filteredData = data.filter((item) =>
        kuntaValues.includes(item.kunta.toLowerCase())
      );

      // Filtteröity data JSON mudossa
      res.json(filteredData);
    } else {
      // Lähetä tiedot JSON muodossa
      res.json(data);
    }
  } catch (error) {
    console.error('Error occurred while scraping:', error);
    res.status(500).send('An error occurred');
  }
});

// Express
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
