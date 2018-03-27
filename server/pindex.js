const newrelic = require('newrelic');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const db = require('../database/pindex.js');
const redis = require('redis');

const client = redis.createClient(6379, '127.0.0.1');

function cache(req, res, next) {
  const id = req.params.id;
  client.get(id, (err, data) => {
    if (err) throw err; 

    if (data !== null) {
      res.send(JSON.parse(data));
    } else {
      next();
    }
  });
}

app.use(cors());
app.use(bodyParser.json());

app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/gallery', cache, (req, res) => {
  const id = req.params.id;
  console.log('server querying for id: ', id);
  db.findOne(id, (data) => {
    const fitToFrontEnd = [{
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

    client.setex(id, 3600, JSON.stringify(fitToFrontEnd));
    res.json(fitToFrontEnd);
  });
});

app.listen(3001, () => console.log('Gallery App listening on port 3001!'));

module.exports = app;
