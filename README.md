# Tilannehuone.fi-Api
Simppeli Api (tilannehuone.fi)[https://tilannehuone.fi], jolla voi hakea tietoja tilannehuoneesta.

Aplikaatio käyttää tähän puppeteeria, koska normaalilla GET pyynnöllä tilannehuoneesta ei tietoja saa.

### Käyttö
1. Ensin aja `npm install`
2. sitten `node index.js`
3. seuraavana palvelin käynnistyy `lcoalhost:300`
Esimerkkejä Apin käitöstä:
`localhost:300/api/v1/` - antaa kaikki sivulla olevat tiedot
`localhost:300/api/v1/Helsinki` - antaa Helsingin tiedot