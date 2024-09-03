import { useNavigate, useParams } from "@solidjs/router";
import {
  createSignal,
  createContext,
  useContext,
  createMemo,
  For,
  createEffect,
  Show,
  createResource,
  Suspense,
  Setter,
  Resource,
} from "solid-js";
import { createStore } from "solid-js/store";
import { Post, PostContent, postId, PostId } from "~/lib/postTypes";

type SelectedPost = PostId | null;
type PostStore = { posts: Map<PostId, Post & Partial<PostContent>> };

const PostsStoreCtx = createContext<PostStore>({
  posts: new Map<PostId, Post>([]),
});

const PostControlCtx = createContext<{
  selectedPost: Resource<(Post & Partial<PostContent>) | null>;
  setSelectedPost: Setter<SelectedPost>;
}>({ selectedPost: (() => null) as Resource<any>, setSelectedPost: () => {} });

function PostMiniature(props: { post: Post; selected: boolean }) {
  const { setSelectedPost } = useContext(PostControlCtx);
  const post = createMemo(() => props.post);
  const selectedColor = createMemo(() =>
    props.selected ? "border-sky-700 border-2" : "",
  );

  const navigate = useNavigate();
  return (
    <button
      class={`text-gray-700 px-2 py-1 rounded bg-slate-200 ${selectedColor()}`}
      onClick={() => {
        setSelectedPost(post().id);
        navigate(`/blog/${post().id}`);
      }}
    >
      {post().title}
    </button>
  );
}

function SideBar() {
  const { selectedPost } = useContext(PostControlCtx);
  const postsCtx = useContext(PostsStoreCtx);
  const posts = createMemo(() => postsCtx.posts);

  const postsList = createMemo(() => Array.from(posts().entries()));

  return (
    <aside class="flex flex-col p-4 gap-4">
      <Show when={postsList().length > 0} fallback={<div>{"No posts"}</div>}>
        <For each={postsList()}>
          {([id, post]) => (
            <PostMiniature
              post={post}
              selected={(() => selectedPost()?.id === id)()}
            />
          )}
        </For>
      </Show>
    </aside>
  );
}

const usePost = () => {
  const [posts, setPosts] = createStore<PostStore>({ posts: new Map([]) });
  const [selectedPostId, setSelected] = createSignal<PostId | null>(null);

  const fetchPosts = async () => {
    const fetched = await fetchAllPosts();

    return fetched;
  };

  const [allFetchedPosts] = createResource(fetchPosts);

  createEffect(async () => {
    if (allFetchedPosts.state !== "ready") return;

    const fetchedPosts = allFetchedPosts();

    setPosts((posts) => {
      const oldPosts = Array.from(posts.posts);
      const newPosts = fetchedPosts.concat(oldPosts);

      return { posts: new Map(newPosts) };
    });
  });

  const fetchContent = async (postId: PostId) => {
    const postFound = posts.posts.get(postId);

    if (postFound != null && postFound.content != null) {
      return postFound;
    }

    const fetched = await fetchPost(postId);
    const mapped = fetched.map(([, v]) => v);
    return mapped.at(0) ?? null;
  };

  const [selectedPost] = createResource(selectedPostId, fetchContent);

  createEffect(() => {
    const post = selectedPost();
    if (post == null || post.content == null) return;

    setPosts(({ posts }) => {
      const newP = posts.set(post.id, post);
      return { posts: newP };
    });
  });

  return [selectedPost, posts, setSelected] as const;
};

function Content() {
  const { selectedPost } = useContext(PostControlCtx);

  return (
    <Suspense fallback={<div>No post</div>}>
      <main class="text-center mx-auto text-gray-700 p-4">
        <article>
          <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
            {selectedPost()?.title}
          </h1>
          <p class="mt-8">{selectedPost()?.content}</p>
        </article>
      </main>
    </Suspense>
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
  const navigate = useNavigate();
  const params = useParams();

  const [selectedPost, posts, setSelectedPost] = usePost();

  const setSelected = setSelectedPost;
  createEffect(() => {
    const paramId = params.id;
    const fetchedKey = posts.posts.keys().next().value as PostId | undefined;
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
    const selected = selectedPost()?.id;
    if (selected == null) {
      setSelected(postId(paramIdNumber));
      navigate(`/blog/${paramIdNumber}`);
      return;
    }
  });

  return (
    <PostsStoreCtx.Provider value={posts}>
      <PostControlCtx.Provider value={{ selectedPost, setSelectedPost }}>
        <Suspense fallback={<div>Loading</div>}>
          <div class="flex">
            <SideBar />
            <Content />
          </div>
        </Suspense>
      </PostControlCtx.Provider>
    </PostsStoreCtx.Provider>
  );
}
