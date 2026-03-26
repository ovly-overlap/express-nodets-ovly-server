import { Sequelize } from 'sequelize-typescript';

const sequelize = new Sequelize({
  database: 'some_db',
  dialect: 'sqlite',
  username: 'root',
  password: '',
  storage: ':memory:',
  models: [__dirname + '/models'], // or [Player, Team],
});

// sequelize.addModels([Person]);
// sequelize.addModels(['path/to/models']);