const faker = require('faker');

function randomInt() {
  return Math.floor(Math.random() * Math.floor(1050));
}

function randomNum() {
  return Math.floor(Math.random() * Math.floor(6)) * 100 + 200;
}

function randomUser() {
  return Math.floor(Math.random() * Math.floor(100000));
}

function createObjBiz(i) {
  const dummyBiz = {};
  dummyBiz.id = i;
  dummyBiz.businessname = faker.company.companyName();
  return dummyBiz;
}

function createObjUser(j) {
  const dummyUser = {};
  dummyUser.id = j;
  dummyUser.username = faker.internet.userName();
  dummyUser.useravatar = faker.image.avatar();
  return dummyUser;
}

let counter = 0;
let temp = 0;

function createObjPhoto(k) {
  let randWidth = randomNum();
  let randHeight = randomNum();
  const dummyPhoto = {};
  dummyPhoto.id = k;
  dummyPhoto.photourl = `https://picsum.photos/${randWidth}/${randHeight}?image=${randomInt()}`;
  dummyPhoto.photowidth = randWidth;
  dummyPhoto.photoheight = randHeight;

  dummyPhoto.user_id = randomUser();


  // dummyPhoto.user_id = 1;

  if (counter < 9) {
  // if (counter < 4) {
    dummyPhoto.business_id = temp;
    counter += 1;
  } else {
    dummyPhoto.business_id = temp;
    temp += 1;
    counter = 0;
  }

  return dummyPhoto;
}

function createBulkBiz(i) {
  const arrBiz = [];

  for (let init = i; init < i + 1000; init++) {
    arrBiz.push(createObjBiz(init));
  }

  if (i % 100000 === 0) {
    console.log('biz', i);
  }

  return arrBiz;
}

function createBulkUser(j) {
  const arrUser = [];

  for (let init = j; init < j + 1000; init++) {
    arrUser.push(createObjUser(init));
  }

  if (j % 100000 === 0) {
    console.log('user', j);
  }

  return arrUser;
}

function createBulkPhoto(k) {
  const arrPhoto = [];

  for (let init = k; init < k + 1000; init++) {
    arrPhoto.push(createObjPhoto(init));
  }

  if (k % 100000 === 0) {
    console.log('photo', k);
  }
  return arrPhoto;
}

module.exports.createBulkBiz = createBulkBiz;
module.exports.createBulkUser = createBulkUser;
module.exports.createBulkPhoto = createBulkPhoto;
