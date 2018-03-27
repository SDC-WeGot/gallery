const pgp = require('pg-promise')();

const dbt = pgp({
  database: 'photos',
  port: 5432,
});

function findOne(id, callback) {
  // console.log('database finding by id:', id);
  dbt.any(`SELECT * from businesses INNER JOIN photos ON businesses.id = photos.business_id INNER JOIN users on photos.user_id = users.id WHERE businesses.id = ${id};`, [true])
    .then(function(data) {
      // console.log(data);
      callback(data);
    })
    .catch(function(error) {
      console.log(error);
    });
}

module.exports.findOne = findOne;
