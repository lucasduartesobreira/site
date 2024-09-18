import {
  Github,
  Linkedin,
  LucideProps,
  Mail,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-solid";
import { createMemo, For, JSXElement } from "solid-js";

const links = {
  ["linkedin"]: "https://www.linkedin.com/in/lucasduartesobreira",
  ["youtube"]: "https://youtube.com/@HiImDots",
  ["github"]: "https://github.com/lucasduartesobreira",
  ["twitch"]: "https://twitch.tv/imdots_",
  ["x"]: "https://x.com/imdots_",
  ["gmail"]: "mailto:lucasduartesobreira@gmail.com",
} as const;

type SocialMediaKinds = keyof typeof links;
const icons: { [K in keyof typeof links]: (props: LucideProps) => JSXElement } =
  {
    ["linkedin"]: (props) => <Linkedin {...props} />,
    ["youtube"]: (props) => <Youtube {...props} />,
    ["github"]: (props) => <Github {...props} />,
    ["twitch"]: (props) => <Twitch {...props} />,
    ["x"]: (props) => <Twitter {...props} />,
    ["gmail"]: (props) => <Mail {...props} />,
  } as const;

function SocialMediaLink(props: { kind: SocialMediaKinds }) {
  const link = createMemo(() => links[props.kind]);
  const icon = createMemo(() => icons[props.kind]);
  return (
    <a href={link()}>
      <figure class="text-tertiary">
        {icon()({ "aria-label": `Check out my ${props.kind}`, size: 20 })}
      </figure>
    </a>
  );
}

function BasicInfo() {
  return (
    <div class="p-8 rounded-xl mt-auto mb-auto transition-all ease-out">
      <h1 class="text-6xl text-primary font-bold font-titillium uppercase mt-4 mb-2">
        Lucas Duarte
      </h1>
      <h2 class="font-regular text-4xl text-secondary mb-4">
        Backend Developer
      </h2>
      <div class="flex w-full justify-center gap-2 my-2">
        <For each={Object.keys(links) as SocialMediaKinds[]}>
          {(data) => <SocialMediaLink kind={data} />}
        </For>
      </div>
    </div>
  );
}

function Folder() {
  return (
    <div class="w-full h-full flex flex-col gap-0">
    </div>
  );
}

function Summary() {
  return <p>Summary</p>;
}

function Journey() {
  return <p>Journey</p>;
}

export default function About() {
  return (
    <main class="flex max-md:flex-wrap items-center justify-center gap-4 text-center w-full h-full mx-auto font-montserrat font-regular text-foreground/80 p-4">
      <BasicInfo />
      <Folder />
    </main>
  );
}
