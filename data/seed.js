const Promise = require('bluebird');
const MongoClient = require('mongodb').MongoClient;
const cluster = require('cluster');
const seedData = require('./seedData.js'); 

const numCPUs = require('os').cpus().length;
const time = new Date().getTime();
const coreCount = [];

function seedDB() {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {console.log(err)}

    console.log('mongo connected');

    let db = client.db('photos');
    
    let count = parseInt(10000000 / numCPUs);
    
    let core = cluster.worker.id;
    let counter = 10000000;
    
    async function genAndSeed() {
      i = parseInt(((core * 10000000) / numCPUs)); 
      j = parseInt((((core - 1) * 10000000) / numCPUs));
      for(var k = i; k > j; k-= 1000) {
        let l = seedData.createBulkData(k - 1000);
        await db.collection('photos').insertMany(l);
      }
      
      console.log(`time: ${(new Date().getTime() - time) / 1000}`);
      client.close();
      process.exit();
    }
    genAndSeed();
  });
}

function indexDB() {
  MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if(err) {console.log(err);}
    console('mongo connected to index');

    let db = client.db('photos');
    async function indexMe() {
      await db.collection("photos").createIndex({place_id: 1});
      client.close();
    }
    indexMe();
  });
}

function workerDone(worker) {
  return new Promise((resolve, reject) => {
    worker.on('disconnect', () => {
      resolve();
      reject();
    });
  });
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} running`);
  let workersDone = [];
  for (let i = 0; i < numCPUs; i++) {
    let worker = cluster.fork();
    workersDone.push(workerDone(worker));
  }

  Promise.all(workersDone).then(async () => {
    indexDB();
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} finised`);
  })
  
} else {
  seedDB();
  console.log(`worker ${process.pid} started`);
}

