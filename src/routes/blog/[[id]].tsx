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
  const selectedPostSignal = useContext(SelectedPostCtx);
  const postsStore = useContext(PostsCtx);

  const selectedPostId = createMemo(() => selectedPostSignal[0]());
  const setPosts = createMemo(() => postsStore[1]);
  const posts = createMemo(() => postsStore[0]);

  const [postsFetched] = createResource(selectedPostId, fetchPosts);

  createEffect(() => {
    const result = postsFetched();
    if (result) {
      setPosts()((posts) => {
        return {
          posts: new Map(Array.from(posts.posts.entries()).concat(result)),
        };
      });
    }
  });

  const selectedPost = createMemo(() => {
    const postId = selectedPostId();
    return postId != null ? (posts().posts.get(postId) ?? null) : null;
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
  if (selectedPostId) {
    const post = {
      id: postId("Another one"),
      title: "Title Lorem Ipsum",
      content: "Lorem ipsum",
    } satisfies Post;
    return [[post.id, post]];
  }
  const post = {
    id: postId("None"),
    title: "No title",
    content: "Nothing yet",
  };

  return [[post.id, post]];
};

export default function Blog() {
  const [postsFetched] = createResource(async () => await fetchPosts(null), {
    initialValue: [],
  });
  const selectedPostSignal = createSignal<PostId | null>(null);
  const postsStore = createStore<PostStore>({ posts: new Map([]) });

  createRenderEffect(async () => {
    postsStore[1]({ posts: new Map(postsFetched()) });
    selectedPostSignal[1](postsFetched().at(0)?.[0] ?? null);
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
