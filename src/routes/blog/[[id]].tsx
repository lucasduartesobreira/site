import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { ChevronsLeft, ChevronsRight } from "lucide-solid";
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
    props.selected
      ? "border-primary border-2 opacity-100 text-primary font-semibold"
      : "border-background",
  );

  return (
    <a
      class={`flex text-foreground mx-2 rounded border-2 ${selectedColor()} transition-all ease-out duration-500 `}
      href={`/blog/${post().id}`}
      role="link"
    >
      <div class="mx-2 my-1 max-h-24 w-full break-all text-pretty line-clamp-3 overflow-hidden text-ellipsis">
        {post().title}
      </div>
    </a>
  );
}

function SideBar() {
  const { selectedPostId } = useContext(PostControlCtx);
  const postsCtx = useContext(PostsStoreCtx);
  const posts = createMemo(() => postsCtx.posts);

  const postsList = createMemo(() => Array.from(posts().entries()));
  const [open, setSideBarOpen] = createSignal(true);

  const openOrCloseStyle = () =>
    open()
      ? "md:min-w-72 md:max-w-sm max-md:w-full max-md:grow"
      : "max-md:w-2 md:min-w-2 md:max-w-6 [&_a]:hidden";

  return (
    <aside
      class={`flex transition-all ease-out duration-1000 ${open() ? "max-md:min-w-full" : "max-md:min-w-[57px]"} gap-1`}
    >
      <Show
        when={postsList().length > 0}
        fallback={
          <div class="text-foreground mx-2 rounded border-2 max-h-24 border-transparent transition-all ease-out duration-500">
            {"No posts"}
          </div>
        }
      >
        <ul
          class={`flex flex-col p-2 gap-2 border-r-2 border-tertiary50 h-full mb-1 font-regular transition-all transition-width ease-out duration-1000 ${openOrCloseStyle()} `}
        >
          <For each={postsList()}>
            {([id, post]) => (
              <PostMiniature
                post={post}
                selected={(() => selectedPostId() === id)()}
              />
            )}
          </For>
        </ul>
        <div class="self-justify-start h-full min-w-max max-w-max grow-0 shrink-0 flex items-start mr-1">
          <button
            class={`${open() ? "hidden" : ""} flex items-center justify-center self-center w-8 h-8 hover:border-2 hover:border-primary text-primary rounded-md select:bg-tertiary50 transition-all ease-out`}
            onClick={(e) => {
              setSideBarOpen(true);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronsRight />
          </button>
          <button
            class={`${!open() ? "hidden" : ""} flex items-center justify-center self-center w-8 h-8 hover:border-2 hover:border-primary text-primary rounded-md select:bg-tertiary50 transition-all ease-out`}
            onClick={(e) => {
              setSideBarOpen(false);
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <ChevronsLeft />
          </button>
        </div>
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
    <main class="text-center mx-auto md:max-w-[70%] font-montserrat text-foreground p-4 overflow-y-auto">
      <article>
        <h1 class="max-6-xs text-5xl text-primary font-bold font-titillium uppercase mt-8">
          {minimalPost()?.title}
        </h1>
        <p class="mt-2 mb-6 text-base italic text-foreground/80">
          {minimalPost()?.summary}
        </p>
        <Suspense fallback="Loading...">
          <SolidMarkdown
            children={selectedPost()?.content}
            rehypePlugins={[rehypeRaw]}
            class="text-justify gap-1 text-foreground"
          ></SolidMarkdown>
        </Suspense>
      </article>
    </main>
  );
}

const fetchAllPosts = async (): Promise<Array<[PostId, Post]>> => {
  const fetched = await fetch(
    `${import.meta.env.VITE_API_URL ?? "http://localhost:5173"}/api/posts/all`,
    {
      method: "GET",
    },
  );

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
    `${import.meta.env.VITE_API_URL ?? "http://localhost:5173"}/api/posts/${selectedPostId}`,
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
        <Title>Blog</Title>
        <div class="flex relative overflow-hidden h-full">
          <SideBar />
          <Suspense>
            <Content />
          </Suspense>
        </div>
      </PostControlCtx.Provider>
    </PostsStoreCtx.Provider>
  );
}
