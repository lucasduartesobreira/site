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
    <>
      <h1 class="max-6-xs text-6xl text-sky-700 font-thin uppercase my-16">
        Lucas Duarte
      </h1>
      <a>Sub title</a>
      <div>
        <For each={Object.keys(links) as SocialMediaKinds[]}>
          {(data) => <SocialMediaLink kind={data} />}
        </For>
      </div>
      <section>
        <p>
          Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem
          ipsum Lorem ipsum Lorem ipsum
        </p>
      </section>
    </>
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
    <main class="text-center mx-auto text-gray-700 p-4">
      <BasicInfo />
      <Summary />
      <Journey />
    </main>
  );
}
