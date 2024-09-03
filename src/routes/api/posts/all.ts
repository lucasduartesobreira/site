import { createClient } from "@libsql/client";
import { Post } from "~/lib/postTypes";

const client = createClient({
  url: process.env.DATABASE_URL ?? "file://data/local.db",
  authToken: process.env.AUTH_JWT_KEY,
});

const fetchPosts = async (): Promise<Array<Post>> => {
  const posts = await client.execute("SELECT * FROM posts LIMIT 200 ");
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
