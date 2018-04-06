const pgp = require('pg-promise')();
const seedData = require('./pseedData');

const bizSize = 10000000;
const userSize = 1000000;
const photoSize = 100000000;

// const bizSize = 100000;
// const userSize = 10000;
// const photoSize = 100000;

const time = new Date().getTime();

const db = pgp({
  database: 'postgres',
  port: 5432,
});

const dbt = pgp({
  database: 'photos',
  port: 5432,
});

const insertBiz = (init) => {
  const bcs = new pgp.helpers.ColumnSet(
    ['id', 'businessname'],
    { table: 'businesses' },
  );

  const bquery = pgp.helpers.insert(seedData.createBulkBiz(init), bcs);

  return dbt.none(bquery)
    .then((data) => {
      // console.log('biz list success');
    })
    .catch((error) => {
      console.log(error);
    });
};

const insertUser = (init) => {
  const ucs = new pgp.helpers.ColumnSet(
    ['id', 'username', 'useravatar'],
    { table: 'users' },
  );

  const uquery = pgp.helpers.insert(seedData.createBulkUser(init), ucs);

  return dbt.none(uquery)
    .then((data) => {
      // console.log('user list success');
    })
    .catch((error) => {
      console.log('error');
    });
};

const insertPhoto = (init) => {
  const pcs = new pgp.helpers.ColumnSet(
    ['id', 'photourl', 'photowidth', 'photoheight', 'user_id', 'business_id'],
    { table: 'photos' },  
  );

  const pquery = pgp.helpers.insert(seedData.createBulkPhoto(init), pcs);

  return dbt.none(pquery)
    .then((data) => {
      // console.log('photo list success')
    })
    .catch((err) => {
      console.log(err);
    });
};

const createBusinessTB = () => {
  return dbt.none('CREATE TABLE businesses(' +
  'id INTEGER UNIQUE,' +
  'businessname TEXT);')
    .then((data) => {
      console.log('created BizTB');
    })
    .then(async () => {
      for (let i = 0; i < bizSize; i += 1000) {
        await insertBiz(i);
      }
      console.log(`biz time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createUsersTB = () => {
  return dbt.none('CREATE TABLE users(' +
  'id INTEGER UNIQUE,' +
  'username TEXT,' +
  'useravatar TEXT);')
    .then((data) => {
      console.log('created UserTB');
    })
    .then(async () => {
      for (let j = 0; j < userSize; j += 1000) {
        await insertUser(j);
      }
      console.log(`user time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    });
};

const createPhotosTB = () => {
  return dbt.none('CREATE TABLE photos(' +
  'id INTEGER UNIQUE,' +
  'photourl TEXT,' +
  'photowidth TEXT,' +
  'photoheight TEXT,' +
  'user_id INTEGER,' +
  'business_id INTEGER);')
  // 'user_id INTEGER REFERENCES users,' +
  // 'business_id INTEGER REFERENCES businesses;')
    .then((data) => {
      console.log('created PhotosTB');
    })
    .then(async () => {
      for (let  k = 0; k < photoSize; k += 1000) {
        await insertPhoto(k);
      }
      console.log(`photo time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    });
}; 

const createFK = () => {
  return dbt.none('ALTER TABLE photos ADD FOREIGN KEY ("user_id") REFERENCES users("id"),' +
  'ADD FOREIGN KEY ("business_id") REFERENCES businesses("id");')
    .then(() => {
      console.log(`fk time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    });
}

const indexPhotosDB = () => {
  return dbt.none('CREATE INDEX CONCURRENTLY ON photos("id");')
    .then(() => {
      console.log(`index photo time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    }); 
}

const indexBusinessesDB = () => {
  return dbt.none('CREATE INDEX CONCURRENTLY ON businesses("id");')
    .then(() => {
      console.log(`index biz time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    }); 
}

const indexUsersDB = () => {
  return dbt.none('CREATE INDEX CONCURRENTLY ON users ("id");')
    .then(() => {
      console.log(`index user time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    }); 
}

const indexPhotosFKUserDB = () => {
  return dbt.none('CREATE INDEX CONCURRENTLY ON photos("user_id");')
    .then(() => {
      console.log(`index photo fk user time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    }); 
}

const indexPhotosFKBizDB = () => {
  return dbt.none('CREATE INDEX CONCURRENTLY ON photos("business_id");')
    .then(() => {
      console.log(`index photo fk biz time: ${(new Date().getTime() - time) / 1000}`);
    })
    .catch((err) => {
      console.log(err);
    }); 
}

const createDB = () => {
  db.none('CREATE DATABASE photos')
    .then((data) => {
      console.log('created photos db');
    })
    .then(async () => {
      createBusinessTB();
      createUsersTB();
      await createPhotosTB();
      // await createBusinessTB();
      // await createUsersTB();
    })
    .then(async () => {
      await createFK();
    })
    .then(async () => {
      await indexUsersDB();
      await indexBusinessesDB();
      await indexPhotosDB();
      await indexPhotosFKBizDB();
      await indexPhotosFKUserDB();
    })
    // .then(async () => {
    //   await createPhotosTB();
    // })
    .catch((err) => {
      console.log(err);
    });
};

createDB();
