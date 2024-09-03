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

  const selectedPostId = createMemo(() =>
    (selectedPostSignal[0]() ?? (params.id !== "" && params.id != null))
      ? postId(Number(params.id))
      : null,
  );
  const setPosts = createMemo(() => postsStore[1]);
  const posts = createMemo(() => postsStore[0]);

  const [selectedPost] = createResource(selectedPostId, async (source) => {
    const post = posts().posts.get(source);
    if (post == null || post.content == null) {
      const result = await fetchPost(source);

      return result.at(0)?.[1];
    }

    return post;
  });

  createEffect(async () => {
    const post = selectedPost();
    if (post == null || post.content == null) return;
    const postFound = posts().posts.get(post.id);

    if (
      postFound != null &&
      (post.version !== postFound.version || post.content !== postFound.content)
    ) {
      setPosts()((posts) => {
        const postsEntries = posts.posts.set(post.id, post);
        return {
          posts: postsEntries,
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
  if (!Number.isSafeInteger(selectedPostId)) return [];

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
  });

  const setSelected = selectedPostSignal[1];
  createEffect(() => {
    const paramId = params.id;
    const fetchedKey = postsStore[0].posts.keys().next().value as
      | PostId
      | undefined;
    // handle load without params after fetch
    if ((paramId === "" || paramId == null) && fetchedKey != null) {
      setSelected(fetchedKey);
      navigate(`/blog/${fetchedKey}`);
      return;
    }

    const paramIdNumber = Number(paramId);
    if (!Number.isSafeInteger(paramIdNumber)) {
      return;
    }

    // First load with params
    const selected = selectedPostSignal[0]();
    if (selected == null) {
      setSelected(postId(paramIdNumber));
      navigate(`/blog/${paramIdNumber}`);
      return;
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
