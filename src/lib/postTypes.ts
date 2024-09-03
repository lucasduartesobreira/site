import { GetTags, Tagged, tagger } from "~/utils/tag";

export const postId = tagger("PostId");
export type PostId = Tagged<number, GetTags<typeof postId>>;

export type Post = {
  id: PostId;
  title: string;
  subtitle: string;
  published_at: string;
  last_version: number;
  summary: string;
  icon?: string;
};

export type PostContent = {
  post_id: PostId;
  version: number;
  content: string;
  created_at: string;
};
