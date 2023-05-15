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

    // Uusi sivu
    const page = await browser.newPage();

    // tilannehuoneeseen
    const url = 'https://www.tilannehuone.fi/halytys.php';
    await page.goto(url);

    // Odota elementtejä
    await page.waitForSelector('tr.halytys');

    // Scrapee
    const data = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll('tr.halytys'));

      return rows.map((row) => {
        const kunta = row.querySelector('.kunta').textContent.trim();
        const pvmdate = row.querySelector('.pvmdate').textContent.trim();
        const typeElement = row.querySelector('td:nth-child(4)');
        const type = typeElement ? typeElement.textContent.trim() : '';

        return { kunta, pvmdate, type };
      });
    });

    // Sulje Puppeteer
    await browser.close();

    // etsi pyydetyt 'kunta' arvot
    const requestedKuntas = req.query.kunta || [];

    // Filtteröi
    const filteredData = data.filter((item) => {
      if (requestedKuntas.length === 0) {
        return true; // No filter applied, include all data
      }
      return requestedKuntas.includes(item.kunta);
    });

    // Lähetä JSON muodossa
    res.json(filteredData);
  } catch (error) {
    console.error('Error occurred while scraping:', error);
    res.status(500).send('An error occurred');
  }
});

// Express
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
