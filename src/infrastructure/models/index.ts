import { Sequelize } from 'sequelize-typescript'; // 'sequelize'가 아니라 'sequelize-typescript'에서 가져옵니다!
import { env } from 'process';

import configJson from '../config/config.json' with { type: "json"}; 
import Users from './users.js'; 
import UserFollows from './user_follows.js';
import Posts from './posts.js';
import UserPostLikes from './user_post_likes.js';
import UserFandoms from './user_fandoms.js';
import Comments from './comments.js';
import Fandoms from './fandoms.js';
import PostImages from './post_images.js';
import News from './news.js';
import PostReports from './post_reports.js';
import Schedule from './schedule.js';
import UserHiddenPosts from './user_hidden_posts.js';

const currentEnv = env.NODE_ENV || 'development';
// @ts-ignore
const config = configJson[currentEnv];

// 1. sequelize-typescript의 Sequelize 인스턴스 생성
const sequelize = new Sequelize({ 
  database: config.database,
  username: config.username,
  password: config.password,
  host: config.host,
  dialect: config.dialect, // 'mysql', 'postgres' 등
  timezone: '+09:00', // TODO : prod - timezone 변경
  // timezone: new Date().toLocaleDateString('en-US', {timeZoneName: 'longOffset'}).split('GMT')[1]
});

sequelize.addModels([
  Users, 
  UserFollows, 
  UserPostLikes, 
  UserHiddenPosts,
  Posts, 
  PostReports,
  PostImages,
  Comments,
  UserFandoms, 
  Fandoms,
  News,
  Schedule,
]);

export { sequelize };
export {
  Users, 
  UserFollows, 
  UserPostLikes, 
  UserHiddenPosts,
  Posts, 
  PostReports,
  PostImages,
  Comments,
  UserFandoms, 
  Fandoms,
  News,
  Schedule,
};
export default sequelize;