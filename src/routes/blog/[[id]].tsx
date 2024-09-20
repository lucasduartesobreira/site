import { useNavigate, useParams } from "@solidjs/router";
import rehypeRaw from "rehype-raw";
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
  Accessor,
} from "solid-js";
import { createStore } from "solid-js/store";
import { SolidMarkdown } from "solid-markdown";
import { Post, PostContent, postId, PostId } from "~/lib/postTypes";

type SelectedPostId = PostId | null;
type PostStore = { posts: Map<PostId, Post & Partial<PostContent>> };

const PostsStoreCtx = createContext<PostStore>({
  posts: new Map<PostId, Post>([]),
});

const PostControlCtx = createContext<{
  selectedPost: Resource<(Post & Partial<PostContent>) | null>;
  setSelectedPost: Setter<SelectedPostId>;
  selectedPostId: Accessor<SelectedPostId>;
  minimalPost: Accessor<Post | null>;
}>({
  selectedPost: (() => null) as Resource<any>,
  setSelectedPost: () => {},
  selectedPostId: () => null,
  minimalPost: () => null,
});

function PostMiniature(props: { post: Post; selected: boolean }) {
  const post = createMemo(() => props.post);
  const selectedColor = createMemo(() =>
    props.selected ? "border-sky-700 border-2" : "",
  );

  return (
    <a
      class={`text-gray-700 px-2 py-1 rounded bg-slate-200 ${selectedColor()}`}
      href={`/blog/${post().id}`}
    >
      {post().title}
    </a>
  );
}

function SideBar() {
  const { selectedPostId } = useContext(PostControlCtx);
  const postsCtx = useContext(PostsStoreCtx);
  const posts = createMemo(() => postsCtx.posts);

  const postsList = createMemo(() => Array.from(posts().entries()));

  return (
    <aside class="flex flex-col p-2 gap-2 border-r-2 border-tertiary50 min-w-max mr-1">
      <Show when={postsList().length > 0} fallback={<div>{"No posts"}</div>}>
        <For each={postsList()}>
          {([id, post]) => (
            <PostMiniature
              post={post}
              selected={(() => selectedPostId() === id)()}
            />
          )}
        </For>
      </Show>
    </aside>
  );
}

const useFetchContent = (
  selectedPostId: Accessor<SelectedPostId>,
  postsStore: PostStore,
) => {
  const fetchContent = async (postId: PostId) => {
    const postFound = postsStore.posts.get(postId);

    if (postFound != null && postFound.content != null) {
      return postFound;
    }

    const fetched = await fetchPost(postId);
    const mapped = fetched.map(([, v]) => v);
    return mapped.at(0) ?? null;
  };

  const [selectedContent] = createResource(selectedPostId, fetchContent);

  const postBasicData = createMemo(() => {
    const id = selectedPostId();
    if (id == null) return null;
    const post = postsStore.posts.get(id);
    if (post != null) return post;

    const content = selectedContent();
    if (content != null) return content;

    return null;
  });

  return [selectedContent, postBasicData] as const;
};

const usePost = () => {
  const [postsStore, setPosts] = createStore<PostStore>({ posts: new Map([]) });
  const [selectedPostId, setSelectedPostId] =
    createSignal<SelectedPostId>(null);

  const fetchPosts = async () => {
    const fetched = await fetchAllPosts();

    return fetched;
  };

  const [allFetchedPosts] = createResource(fetchPosts);

  createEffect(async () => {
    if (allFetchedPosts.state !== "ready") return;

    const fetchedPosts = allFetchedPosts();

    setPosts("posts", (posts) => {
      const oldPosts = Array.from(posts);
      const newPosts = fetchedPosts.concat(oldPosts);

      return new Map(newPosts);
    });
  });

  const [selectedPost, minimalPost] = useFetchContent(
    selectedPostId,
    postsStore,
  );

  createEffect(() => {
    const post = selectedPost();
    if (post == null || post.content == null) return;

    setPosts("posts", (posts) => new Map(posts.set(post.id, post)));
  });

  return [
    selectedPost,
    postsStore,
    setSelectedPostId,
    selectedPostId,
    minimalPost,
  ] as const;
};

function Content() {
  const { selectedPost, minimalPost: minimalPost } = useContext(PostControlCtx);

  return (
    <main class="text-center mx-auto font-montserrat text-foreground p-4 overflow-y-auto">
      <article>
        <h1 class="max-6-xs text-6xl text-primary font-semibold font-titillium uppercase my-16">
          {minimalPost()?.title}
        </h1>
        <p class="mt-8">{minimalPost()?.summary}</p>
        <Suspense fallback="Loading...">
          <SolidMarkdown
            children={selectedPost()?.content}
            rehypePlugins={[rehypeRaw]}
          ></SolidMarkdown>
        </Suspense>
      </article>
    </main>
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

  const [selectedPost, posts, setSelectedPost, selectedPostId, minimalPost] =
    usePost();

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

    if (selected != paramIdNumber) {
      setSelected(postId(paramIdNumber));
    }
  });

  return (
    <PostsStoreCtx.Provider value={posts}>
      <PostControlCtx.Provider
        value={{
          selectedPost,
          setSelectedPost,
          selectedPostId,
          minimalPost,
        }}
      >
        <div class="flex relative overflow-y-hidden">
          <SideBar />
          <Suspense>
            <Content />
          </Suspense>
        </div>
      </PostControlCtx.Provider>
    </PostsStoreCtx.Provider>
  );
}
