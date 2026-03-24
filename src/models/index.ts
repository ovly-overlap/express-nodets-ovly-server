import { Sequelize } from 'sequelize-typescript';


const db = {};

const sequelize = new Sequelize({
  database: 'some_db',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: ':memory:',
  models: [__dirname + '/models'], // or [Player, Team],
});


Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = sequelize;

// db.Article = require('./article.js')(sequelize,Sequelize);
// 오류 가능성

export default db;
