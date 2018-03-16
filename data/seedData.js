const faker = require('faker');


function randomInt() {
  return Math.floor(Math.random() * Math.floor(1050));
}

function randomNum() {
  return Math.floor(Math.random() * Math.floor(6)) * 100 + 200;
}

function createOneData(n) {
  const dummyData = {
    place_id: n,
    place_name: null,
    photos: [],
    reviews: [],
  };

  let photoObj = {
    ref: null,
    url: null,
    width: 500,
    height: 500,
  };

  let reviewObj = {
    name: null,
    avatar: null,
  };

  dummyData.place_id = n;
  dummyData.place_name = faker.company.companyName();
  
  for (let i = 0; i < 10; i++) {
    let randWidth = randomNum();
    let randHeight = randomNum();
    photoObj.width = randWidth;
    photoObj.height = randHeight;
    photoObj.url = `https://picsum.photos/${randWidth}/${randHeight}?image=${randomInt()}`;
    // dummyData[`photo${i}`] = photoObj;
    dummyData.photos.push(photoObj);
    photoObj = {};
    photoObj.ref = null;
    photoObj.width = 500;
    photoObj.height = 500;
  }
  for (let j = 0; j < 5; j++) {
    reviewObj.name = faker.internet.userName();
    reviewObj.avatar = faker.image.avatar();
    // dummyData[`reviews${j}`] = reviewObj;
    dummyData.reviews.push(reviewObj);
    reviewObj = {};
    reviewObj.name = null;
    reviewObj.avatar = null;
  }

  return dummyData;
}

function createBulkData(i) {
  const arr = [];

  for (let init = i; init < i + 1000; init++) {
    arr.push(createOneData(init));
  }

  return arr;
}

module.exports.createBulkData = createBulkData;
