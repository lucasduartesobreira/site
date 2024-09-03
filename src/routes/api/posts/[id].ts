import { type APIEvent } from "@solidjs/start/server";
import { dbClient } from "~/lib/database";
import { PostContent, postId, PostId } from "~/lib/postTypes";

const fetchPost = async (
  selectedPostId: PostId,
): Promise<Array<PostContent>> => {
  if (typeof selectedPostId !== "number") {
    return [];
  }
  const getPostResult = await dbClient().execute({
    sql: "SELECT * FROM posts_content LEFT JOIN posts WHERE posts.id == ? AND posts.id == posts_content.post_id LIMIT 1",
    args: [selectedPostId],
  });
  const row = getPostResult.rows as unknown as PostContent[];

  return row;
};

export async function GET(event: APIEvent) {
  const idParams = event.params.id;
  if (idParams === "") {
    return [];
  }
  const id = postId(Number.parseInt(idParams));
  return fetchPost(id);
}
