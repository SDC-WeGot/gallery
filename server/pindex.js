const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const pgp = require('pg-promise')();
const db = require('../database/pindex.js');



const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/gallery', (req, res) => {
  const id = req.params.id;
  console.log('server querying for id: ', id);
  db.findOne(id, (data) => {
    let fitToFrontEnd = [{
      photos: [],
      reviews: [],
      place_id: null,
      place_name: null,
    }];

    fitToFrontEnd[0].place_id = data[0].business_id;
    fitToFrontEnd[0].place_name = data[0].businessname;

    data.forEach((photo) => {
      fitToFrontEnd[0].photos.push({
        ref: null,
        width: photo.photowidth,
        height: photo.photoheight,
        url: photo.photourl,
      });
      fitToFrontEnd[0].reviews.push({
        name: photo.username,
        avatar: photo.useravatar,
      });
    });

    res.json(fitToFrontEnd);
  });
});

app.listen(3001, () => console.log('Gallery App listening on port 3001!'));

module.exports = app;
