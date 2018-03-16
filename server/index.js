const request = require('supertest')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// mongoose.connect('mongodb://database/photos');
mongoose.connect('mongodb://localhost/photos');

const Photos = require('../database/index.js');

const app = express();

app.use(cors());

app.use(bodyParser.json());

// serve static files from dist dir
app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

// if no ID typed into url bar, redirect to this ID
app.get('/', (req, res) => {
  res.status(200).redirect('/restaurants/ChIJUcXYWWGAhYARmjMY2bJAG2s');
});

// retrieve data from API(db)
app.get('/api/restaurants/:id/gallery', (req, res) => {
  const id = req.params.id;
  console.log('server querying for id: ', id);
  Photos.findOne(id, (err, data) => {
    if (err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.listen(3001, () => console.log('Gallery App listening on port 3001!'));

module.exports = app;
