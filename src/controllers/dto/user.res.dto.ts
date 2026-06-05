/**
 * 이름
 * 소개
 *
 *
 */

export class UserProfileRes {
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
