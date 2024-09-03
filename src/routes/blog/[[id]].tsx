import { useNavigate, useParams } from "@solidjs/router";
import {
  createSignal,
  createContext,
  Signal,
  useContext,
  createMemo,
  For,
  createEffect,
  Show,
  createResource,
  Suspense,
} from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";
import { Post, PostContent, postId, PostId } from "~/lib/postTypes";

type SelectedPost = PostId | null;

const SelectedPostCtx = createContext<Signal<SelectedPost>>(
  createSignal<SelectedPost>(null),
);

type PostStore = { posts: Map<PostId, Post & Partial<PostContent>> };

const PostsCtx = createContext<[Store<PostStore>, SetStoreFunction<PostStore>]>(
  [{ posts: new Map<PostId, Post>([]) }, () => {}],
);

function PostMiniature(props: { post: Post; selected: boolean }) {
  const selectPostSignal = useContext(SelectedPostCtx);
  const post = createMemo(() => props.post);
  const selectedColor = createMemo(() =>
    props.selected ? "border-sky-700 border-2" : "",
  );

  const navigate = useNavigate();
  return (
    <button
      class={`text-gray-700 px-2 py-1 rounded bg-slate-200 ${selectedColor()}`}
      onClick={() => {
        selectPostSignal[1](post().id);
        navigate(`/blog/${post().id}`);
      }}
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
    () => selectedPostSignal[0]() ?? postId(Number(params.id)),
  );
  const setPosts = createMemo(() => postsStore[1]);
  const posts = createMemo(() => postsStore[0]);

  const [selectedPost] = createResource(selectedPostId, async (source) => {
    if (!posts().posts.has(source)) {
      const result = await fetchPost(source);

      return result[0][1];
    }

    return posts().posts.get(source) ?? null;
  });

  createEffect(async () => {
    const post = selectedPost();
    if (post != null && !posts().posts.has(post.id)) {
      setPosts()((posts) => {
        const postsEntries = Array.from(posts.posts.entries());
        return {
          posts: new Map(postsEntries.concat([[post.id, post]])),
        };
      });
    }
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

const fetchAllPosts = async (): Promise<Array<[PostId, Post]>> => {
  const fetched = await fetch(`http://localhost:5173/api/posts/all`, {
    method: "GET",
  });

  const result: Array<Post> = await fetched.json();

  if (result instanceof Array) {
    return result.map((post) => [post.id, post] as const);
  }
  throw "todo";
};

const fetchPost = async (
  selectedPostId: PostId,
): Promise<Array<[PostId, Post & PostContent]>> => {
  const fetched = await fetch(
    `http://localhost:5173/api/posts/${selectedPostId}`,
    {
      method: "GET",
    },
  );

  const result: Array<Post & PostContent> = await fetched.json();

  if (result instanceof Array) {
    return result.map((post) => [post.id, post] as const);
  }
  throw "todo";
};

export default function Blog() {
  const selectedPostSignal = createSignal<PostId | null>(null);
  const postsStore = createStore<PostStore>({ posts: new Map([]) });

  const navigate = useNavigate();
  const params = useParams();

  const [allFetchedPosts] = createResource(async () => await fetchAllPosts(), {
    initialValue: [],
  });

  createEffect(async () => {
    if (allFetchedPosts.state != "ready") {
      return;
    }

    const fetched = allFetchedPosts();
    if (fetched.length === 0) return;

    postsStore[1]({ posts: new Map(fetched) });
    if (params.id?.length === 0 || params.id == null) {
      selectedPostSignal[1](fetched.at(0)?.[0] ?? null);
      navigate(`${fetched[0][0]}`, { replace: true });
    }
  });

  return (
    <PostsCtx.Provider value={postsStore}>
      <SelectedPostCtx.Provider value={selectedPostSignal}>
        <Suspense fallback={<div>Loading</div>}>
          <div class="flex">
            <SideBar />
            <Content />
          </div>
        </Suspense>
      </SelectedPostCtx.Provider>
    </PostsCtx.Provider>
  );
}
