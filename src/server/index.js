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

app.get('/rover', async (req, res) => {
  const ROVERS_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
  const nasaApiRoverData = `${ROVERS_URL}?api_key=${process.env.API_KEY}`;
  // const nasaApiRoversData = 'https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=2stiEBelXQJW9ZOk1DhXepf9p8kMjM0AaP0kQCMh'
  // const nasaApiRoversData = await fetch(
  //   `${ROVERS_URL}?api_key=${process.env.API_KEY}`
  // );
  // const nasaApiPhotosData = await fetch(
  //   `${ROVERS_URL}/${name}/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`
  // );

  try {
    const nasaData = await fetch(`${nasaApiRoverData}`).then(res => res.json());
    res.send({ nasaData });
  } catch (err) {
    console.log('error:', err);
  }
});

// example API call
app.get('/apod', async (req, res) => {
  try {
    let image = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`
    ).then(res => res.json());
    res.send({ image });
  } catch (err) {
    console.log('error:', err);
  }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
