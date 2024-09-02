import { type APIEvent } from "@solidjs/start/server";
import { GetTags, Tagged, tagger } from "~/utils/tag";

const postId = tagger("PostId");
type PostId = Tagged<string, GetTags<typeof postId>>;

type Post = {
  id: PostId;
  title: string;
  content: string;
};

const fetchPost = async (selectedPostId: PostId): Promise<Array<Post>> => {
  const post = {
    id: selectedPostId,
    title: "Title Lorem Ipsum",
    content: "Lorem ipsum",
  } satisfies Post;
  return [post];
};

export async function GET(event: APIEvent) {
  const id = postId(event.params.id);
  return fetchPost(id);
}
