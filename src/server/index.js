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
  const ROVERS_URL = 'https://api.nasa.gov/mars-photos/api/v1/rovers';
  let key = 'rovers';
  let url = ROVERS_URL;
  const { name } = req.params;
  // const nasaApiRoversData = 'https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=2stiEBelXQJW9ZOk1DhXepf9p8kMjM0AaP0kQCMh'
  // const nasaApiRoversData = await fetch(
  //   `${ROVERS_URL}?api_key=${process.env.API_KEY}`
  // );
  // const nasaApiPhotosData = await fetch(
  //   `${ROVERS_URL}/${name}/photos?sol=1000&page=1&api_key=${process.env.API_KEY}`
  // );

  if (name) {
    url += `/${name}/photos?earth_date=2015-6-3&api_key=${process.env.API_KEY}`;
  } else {
    url += `?api_key=${process.env.API_KEY}`;
  }

  try {
    const nasaData = await fetch(url).then(res => res.json());

    if (name) {
      return res.send(nasaData);
    }

    const roverData = nasaData.rovers.map(data => ({
      landing_date: data.landing_date,
      launch_date: data.launch_date,
      status: data.status,
    }));

    res.send(roverData);
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
