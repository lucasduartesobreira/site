import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const basepath = () =>
    location.pathname.startsWith("/blog") ? "/blog" : "/";
  const active = (path: string) =>
    path == basepath()
      ? "border-primary "
      : "border-transparent  hover:border-primary";

  const beautifulHover =
    "hover:text-transparent hover:bg-gradient-to-r hover:from-primary hover:via-primary hover:to-primary/70 hover:bg-clip-text";
  return (
    <header
      role="banner"
      class="flex items-center bg-background border-b-2 border-tertiary text-foreground/80 font-titillium pb-1 my-2 mx-4"
    >
      <a
        class={`ml-4 font-jetbrains italic text-lg mr-auto font-light from-transparent to-foreground text-center items-center transition-all ease-out ${beautifulHover}`}
        href="/"
      >
        ./lucas.d{basepath()}
      </a>
      <nav class="font-semibold">
        <ul class="transition-all ease-out container flex items-center justify-center">
          <li
            class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6 transition-all ease-out ${beautifulHover}`}
          >
            <a href="/">About</a>
          </li>
          <li
            class={`border-b-2 ${active("/blog")} mx-1.5 sm:mx-6 transition-all ease-out ${beautifulHover}`}
          >
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
