import { GetTags, Tagged, tagger } from "~/utils/tag";

const postId = tagger("PostId");
type PostId = Tagged<string, GetTags<typeof postId>>;

type Post = {
  id: PostId;
  title: string;
  content: string;
};

const fetchPosts = async (): Promise<Array<Post>> => {
  const post_one = {
    id: postId("None"),
    title: "No title",
    content: "Nothing yet",
  };

  const post_two = {
    id: postId("anotherone"),
    title: "Title Lorem Ipsum",
    content: "Lorem ipsum",
  } satisfies Post;

  return [post_one, post_two] as const;
};

export async function GET() {
  const result = await fetchPosts();
  return result;
}
