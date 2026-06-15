/**
 * 이름
 * 소개
 *
 *
 */

export class UserProfileRes {
  profile_image_url: string;
  username: string;
  intro: string;
  followerNum: number;
  followingNum: number;
  todos: TodoItem[];
  diary: DiaryItem[];

  fandoms: FandomType[];
}

interface DiaryItem {
  imageUrl: string[];
  text: string;
  timestamp: Date;
}

interface TodoItem {
  isDone: boolean;
  memo?: string;
  content: string;
  timestamp: string;
}

interface FandomType {
  name: string;
  imageUrl: string;
}

// --

export class UserFollowRes {
  id: number;
  username: string;
  profileImage: string;
  isFollowing: boolean;
}
