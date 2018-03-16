const mongoose = require('mongoose');
const request = require('request');
const rp = require('request-promise')
const Photos = ('./database/index.js');
const IDS = require('./weGotData.js');
const fs = require('fs');
const API_KEY = require('../config.js');

mongoose.connect('mongodb://localhost/photos');

const API_URL = 'https://maps.googleapis.com/maps/api/place/details/json?placeid=';

const PHOTOS_URL = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=';

function isJSONResponse(headers) {
  return headers['content-type'].includes('json');
}

function getJSONFromAPI(url, key, callback) {
  const seedData = [];
  IDS.forEach((ID) => { // for each ID
    const FULL_URL = `${API_URL}${ID}&key=${API_KEY.KEY}`;

    rp.get(FULL_URL, (err, response, body) => {
      if (err) {
        callback(err, null);
      } else if (!isJSONResponse(response.headers)) {
        callback(new Error('Response did not contain JSON data.'), null);
      } else {
        const data = JSON.parse(body);

        const entry = {
          place_id: data.result.id,
          place_name: data.result.name,
          reviews: [],
          photos: [],
        };

        // push each review to entry
        for (let j = 0; j < data.result.reviews.length; j += 1) {
          const review = data.result.reviews[j];
          entry.reviews.push(review);
        }

        // push photo details to entry
        for (let k = 0; k < data.result.photos.length; k += 1) {
          const photoRef = data.result.photos[k].photo_reference;
          const photoUrl = `${PHOTOS_URL}${photoRef}&key=${API_KEY}`;
          const details = { ref: photoRef, url: photoUrl };
          entry.photos.push(details);
        }
        seedData.push(entry);
      }
    });
  });
}
