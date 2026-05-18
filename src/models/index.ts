import { Sequelize } from 'sequelize-typescript'; // 'sequelize'가 아니라 'sequelize-typescript'에서 가져옵니다!
import { env } from 'process';
import configJson from '../../config/config.json' with { type: "json"}; 

// 사용할 모델들을 전부 import 합니다.
import Users from './users.js'; // (파일명 대소문자에 주의하세요. 작성하신 파일명이 'Users' 또는 'users'인지 확인)
import UserFollows from './user_follows.js';
import Posts from './posts.js';
import UserPostLikes from './user_post_likes.js';
import UserFandoms from './user_fandoms.js';
import Comments from './comments.js';

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
  logging: config.logging ?? false,
  timezone: '+09:00', // TODO : prod - timezone 변경
  // timezone: new Date().toLocaleDateString('en-US', {timeZoneName: 'longOffset'}).split('GMT')[1]
});

// 2. ★ 핵심: 여기에 사용할 모델 클래스들을 배열로 등록합니다.
// 이렇게 하면 initModel이나 associate를 일일이 호출하지 않아도 데코레이터(@HasMany 등)를 알아서 분석합니다.
sequelize.addModels([
  Users, 
  UserFollows, 
  Posts, 
  UserPostLikes, 
  UserFandoms, 
  Comments
]);

// 3. 다른 파일에서 사용할 수 있도록 내보내기
export { sequelize };
export {
  Users,
  UserFollows,
  Posts,
  UserPostLikes,
  UserFandoms,
  Comments
};
export default sequelize;