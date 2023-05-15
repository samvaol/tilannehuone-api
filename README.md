# Tilannehuone.fi-Api
Simppeli Api [tilannehuone.fi:hin](https://tilannehuone.fi), jolla voi hakea tietoja tilannehuoneesta.

Aplikaatio käyttää tähän puppeteeria, koska normaalilla GET pyynnöllä tilannehuoneesta ei tietoja saa.

### Käyttö
1. Ensin aja `npm install`
2. sitten `node index.js`
3. seuraavana palvelin käynnistyy `lcoalhost:300`



Esimerkkejä Apin käitöstä:

`localhost:300/api/v1/` - antaa kaikki sivulla olevat tiedot

`http://localhost:3000/api/v1?kunta=Helsinki` - antaa Helsingin tiedot

`localhost:3000/api/v1?kunta=Hyvinkää&kunta=Helsinki` - antaa Hyvinkään Ja Helsingin tiedot