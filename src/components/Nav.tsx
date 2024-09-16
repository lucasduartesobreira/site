import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "border-primary "
      : "border-transparent  hover:border-primary";

  const beautifulHover =
    "hover:text-transparent hover:bg-gradient-to-r hover:from-primary hover:via-primary hover:to-primary/80 hover:bg-clip-text";
  return (
    <header
      role="banner"
      class="flex items-center bg-background border-b-2 border-tertiary text-foreground/80 font-titillium pb-1 my-2 mx-4"
    >
      <a
        class={`ml-4 font-montserrat italic text-lg mr-auto font-regular from-transparent to-foreground text-center items-center transition-all ease-out ${beautifulHover}`}
        href="/"
      >
        ./lucas.d
      </a>
      <nav class="font-semibold">
        <ul class="transition-all ease-out container flex items-center justify-center">
          <li
            class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6 ${beautifulHover}`}
          >
            <a href="/">About</a>
          </li>
          <li
            class={`border-b-2 ${active("/blog")} mx-1.5 sm:mx-6 ${beautifulHover}`}
          >
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
