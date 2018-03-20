const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/restaurants/:id', express.static(path.join(__dirname, '../client/dist')));

app.get('/api/restaurants/:id/gallery', (req, res) => {
  const id = req.params.id;
  console.log('server querying for id: ', id);
  // Photos.findOne(id, (err, data) => {
  //   if (err) {
  //     res.sendStatus(500);
  //   } else {
  //     res.json(data);
  //   }
  // });
});

app.listen(3001, () => console.log('Gallery App listening on port 3001!'));

module.exports = app;
