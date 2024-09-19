import {
  Github,
  Linkedin,
  LucideProps,
  Mail,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-solid";
import { createMemo, For, JSXElement, PropsWithChildren } from "solid-js";

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
      <figure class="text-quaternary">
        {icon()({ "aria-label": `Check out my ${props.kind}`, size: 24 })}
      </figure>
    </a>
  );
}

function BasicInfo() {
  return (
    <div class="p-8 rounded-xl mt-auto mb-auto transition-all ease-out snap-center">
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

function FolderTab(props: { text: string; active: boolean; zIndex: string }) {
  const text = createMemo(() => props.text);
  const borderColor = createMemo(() =>
    props.active ? "border-tertiary" : "border-tertiary/40",
  );

  const activeZIndex = createMemo(() => props.zIndex);

  return (
    <li
      class={`inline-flex justify-center items-center font-medium italic text-xs bg-tertiary50 pl-1 pr-2 rounded-t-md ${borderColor()} border-t-2 border-x-2 ${activeZIndex()} relative`}
    >
      <div class="h-1 w-full absolute -bottom-1 left-0 bg-tertiary50 z-50" />
      <div
        class={`absolute translate-x-full -bottom-[1px] right-[1px] h-[27px] translate-y-[3px] w-[30px] overflow-clip`}
      >
        <div
          class={`absolute origin-top-left h-full w-[44px]  border-t-2 ${borderColor()} bg-tertiary50 transform rotate-[37deg] z-50`}
        />
      </div>
      <a class="z-50">{text()}</a>
    </li>
  );
}

function FolderPaper(props: PropsWithChildren) {
  return (
    <div class="h-full w-full rounded-[1px] drop-shadow-[2px_2px_12px_rgba(0,0,0,0.1)] p-2 bg-background z-[1000]">
      {props.children}
    </div>
  );
}

function Folder() {
  return (
    <div class="w-full h-full flex flex-col snap-start">
      <nav class="">
        <ul class="h-[24px] mt-1 flex flex-row w-full gap-3 text-sm">
          <FolderTab active={true} text="SUMMARY" zIndex="z-30" />
          <FolderTab active={false} text="JOURNEY" zIndex="z-10" />
          <FolderTab active={false} text="SECRETS" zIndex="z-[9]" />
        </ul>
      </nav>
      <div class="bg-tertiary50 h-full rounded-b-xl rounded-r-xl border-tertiary border-t-2 border-b-2 border-x-2 z-10 overflow-y-auto overflow-x-hidden relative py-4 px-4">
        <FolderPaper>
          <Summary />
        </FolderPaper>
      </div>
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
    <main class="flex max-md:flex-wrap items-center justify-center gap-4 text-center w-full h-full mx-auto font-montserrat font-regular text-foreground/80 p-4 overflow-x-hidden overflow-y-auto scrollbar max-md:snap-y max-md:snap-proximity max-md:snap-always scroll-mr-2">
      <BasicInfo />
      <Folder />
    </main>
  );
}
