import { useNavigate, useParams } from "@solidjs/router";
import {
  createSignal,
  createContext,
  Signal,
  useContext,
  createResource,
  createMemo,
  For,
  createEffect,
  Show,
  createRenderEffect,
  createUniqueId,
} from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { tagger, Tagged, GetTags } from "~/utils/tag";

const postId = tagger("PostId");
type PostId = Tagged<string, GetTags<typeof postId>>;

type SelectedPost = PostId | null;

const SelectedPostCtx = createContext<Signal<SelectedPost>>(
  createSignal<SelectedPost>(null),
);

type Post = {
  id: PostId;
  title: string;
  content: string;
};

type PostStore = { posts: Map<PostId, Post> };

const PostsCtx = createContext<[Store<PostStore>, SetStoreFunction<PostStore>]>(
  [{ posts: new Map<PostId, Post>([]) }, () => {}],
);

function PostMiniature(props: { post: Post; selected: boolean }) {
  const selectPostSignal = useContext(SelectedPostCtx);
  const post = createMemo(() => props.post);
  const selectedColor = createMemo(() =>
    props.selected ? "border-sky-700 border-2" : "",
  );
  return (
    <button
      class={`text-gray-700 px-2 py-1 rounded bg-slate-200 ${selectedColor()}`}
      onClick={() => selectPostSignal[1](post().id)}
    >
      {post().title}
    </button>
  );
}

function SideBar() {
  const [selectedPost] = useContext(SelectedPostCtx);
  const [posts] = useContext(PostsCtx);

  const postsList = createMemo(() => Array.from(posts.posts.entries()));

  return (
    <aside class="flex flex-col p-4 gap-4">
      <Show when={postsList().length > 0} fallback={<div>{"No posts"}</div>}>
        <For each={postsList()}>
          {([id, post]) => (
            <PostMiniature
              post={post}
              selected={(() => selectedPost() === id)()}
            />
          )}
        </For>
      </Show>
    </aside>
  );
}

function Content() {
  const params = useParams();
  const selectedPostSignal = useContext(SelectedPostCtx);
  const postsStore = useContext(PostsCtx);

  const selectedPostId = createMemo(
    () => selectedPostSignal[0]() ?? postId(params.id),
  );
  const setPosts = createMemo(() => postsStore[1]);
  const posts = createMemo(() => postsStore[0]);

  createEffect(async () => {
    if (!posts().posts.has(selectedPostId())) {
      const result = await fetchPost(selectedPostId());
      setPosts()(({ posts }) => {
        return {
          posts: new Map(Array.from(posts.entries()).concat(result)),
        };
      });
    }
  });

  const selectedPost = createMemo(() => {
    const postId = selectedPostId();
    const storedPosts = posts().posts;
    return postId != null ? (storedPosts.get(postId) ?? null) : null;
  });

  return (
    <Show when={selectedPost() != null} fallback={<div>No post</div>}>
      <main class="text-center mx-auto text-gray-700 p-4">
        <article>
          <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
            {selectedPost()?.title}
          </h1>
          <p class="mt-8">{selectedPost()?.content}</p>
        </article>
      </main>
    </Show>
  );
}

const fetchPosts = async (
  selectedPostId: PostId | null,
): Promise<Array<[PostId, Post]>> => {
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

  return [
    [post_one.id, post_one],
    [post_two.id, post_two],
  ];
};

const fetchPost = async (
  selectedPostId: PostId,
): Promise<Array<[PostId, Post]>> => {
  const post = {
    id: postId("anotherone"),
    title: "Title Lorem Ipsum",
    content: "Lorem ipsum",
  } satisfies Post;
  return [[post.id, post]];
};

export default function Blog() {
  const selectedPostSignal = createSignal<PostId | null>(null);
  const postsStore = createStore<PostStore>({ posts: new Map([]) });

  const navigate = useNavigate();
  const params = useParams();
  createRenderEffect(async () => {
    const fetched = await fetchPosts(null);
    if (fetched.length > 0) {
      postsStore[1]({ posts: new Map(fetched) });
    }

    if (params.id?.length === 0 || params.id == undefined) {
      selectedPostSignal[1](fetched.at(0)?.[0] ?? null);
      navigate(`${fetched[0][0]}`, { replace: true });
    }
  });

  return (
    <PostsCtx.Provider value={postsStore}>
      <SelectedPostCtx.Provider value={selectedPostSignal}>
        <div class="flex">
          <SideBar />
          <Content />
        </div>
      </SelectedPostCtx.Provider>
    </PostsCtx.Provider>
  );
}
