import { useLocation } from "@solidjs/router";

export default function Nav() {
  const location = useLocation();
  const active = (path: string) =>
    path == location.pathname
      ? "transition-all border-primary "
      : "transition-all border-transparent hover:border-primary";
  return (
    <header class="flex items-center bg-background border-b-2 border-tertiary text-foreground/80 font-titillium pb-1 my-2 mx-4">
      <div class="ml-4 font-montserrat italic text-lg mr-auto font-regular from-transparent to-white text-center items-center">
        ./lucas.d
      </div>
      <nav class="font-semibold">
        <ul class="container flex items-center justify-center">
          <li class={`border-b-2 ${active("/")} mx-1.5 sm:mx-6`}>
            <a href="/">About</a>
          </li>
          <li class={`border-b-2 ${active("/blog")} mx-1.5 sm:mx-6`}>
            <a href="/blog">Blog</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
