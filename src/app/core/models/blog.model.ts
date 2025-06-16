import { Comment } from './comment.model';

export interface Blog {
  id: number;
  title: string;
  author: string;
  blogImage: string;
  authorAvatar: string;
  date: string;
  category: string;
  article: string;
  comments: Comment[];
}
