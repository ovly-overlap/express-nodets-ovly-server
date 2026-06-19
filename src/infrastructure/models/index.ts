import { Sequelize } from 'sequelize-typescript'; // 'sequelize'가 아니라 'sequelize-typescript'에서 가져옵니다!

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

const databaseUrl = process.env.DATABASE_URL?.trim().replace(/^['"]|['"]$/g, "");

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is required.");
}

if (!/^postgres(ql)?:\/\//.test(databaseUrl)) {
  throw new Error("DATABASE_URL must start with postgres:// or postgresql://.");
}

const sequelize = new Sequelize(databaseUrl, {
  dialect: 'postgres',
  timezone: '+09:00',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
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
