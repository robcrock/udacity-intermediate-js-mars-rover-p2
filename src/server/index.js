/* eslint-disable no-undef */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', express.static(path.join(__dirname, '../public')));

// your API calls
// const ROVERS_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
// const nasaApiRoversData = await fetchAsync(`${ROVERS_URL}?api_key=${process.env.API_KEY}`);
// const nasaApiPhotosData = await fetchAsync(`${ROVERS_URL}/${name}/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`);
// EXPAMPLE QUERY
// https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY

app.get('/rover/:name?', async (req, res) => {
  // UNCOMMENT TO RUN LOCAL API KEY
  // DO NOT DELETE
  const ROVERS_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
  let url = ROVERS_URL;
  const { name } = req.params;

  if (name) {
    url += `/${name}/photos?earth_date=2015-6-3&api_key=${process.env.API_KEY}`;
  } else {
    url += `?api_key=${process.env.API_KEY}`;
  }

  // const url = 'https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=2015-6-3&api_key=DEMO_KEY'

  try {
    const nasaData = await fetch(url).then(response => response.json());

    // return res.send(nasaData);
    // DO NOT DELETE
    if (name) {
      return res.send(nasaData);
    }

    // DO NOT DELETE
    const roverData = nasaData.rovers.map(data => ({
      landing_date: data.landing_date,
      launch_date: data.launch_date,
      status: data.status,
    }));

    // DO NOT DELETE
    res.send(roverData);
  } catch (err) {
    console.log('error:', err);
  }
});

// example API call
app.get('/apod', async (req, res) => {
  try {
    const image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then(response => response.json());

    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
