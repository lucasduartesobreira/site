import { dbClient } from "~/lib/database";
import { Post } from "~/lib/postTypes";

const fetchPosts = async (): Promise<Array<Post>> => {
  const posts = await dbClient().execute("SELECT * FROM posts LIMIT 200 ");
  const rows = (posts.rows as unknown as Post[]).map((post) => ({
    ...post,
    content: post.summary,
  }));

  return rows;
};

export async function GET() {
  const result = await fetchPosts();
  return result;
}
