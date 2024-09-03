import { type APIEvent } from "@solidjs/start/server";
import { Post, postId, PostId } from "~/lib/postTypes";

const fetchPost = async (
  selectedPostId: PostId,
): Promise<Array<Partial<Post> & { content: string }>> => {
  const post = {
    id: selectedPostId,
    title: "Title Lorem Ipsum",
    content: "Lorem ipsum",
  };
  return [post];
};

export async function GET(event: APIEvent) {
  const id = postId(Number(event.params.id));
  return fetchPost(id);
}
