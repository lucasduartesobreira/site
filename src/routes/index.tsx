import {
  Github,
  Linkedin,
  LucideProps,
  Mail,
  Twitch,
  Twitter,
  Youtube,
} from "lucide-solid";
import {
  createMemo,
  createSignal,
  For,
  JSXElement,
  Match,
  PropsWithChildren,
  Switch,
} from "solid-js";

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
        Full-Stack Developer
      </h2>
      <div class="flex w-full justify-center gap-2 my-2">
        <For each={Object.keys(links) as SocialMediaKinds[]}>
          {(data) => <SocialMediaLink kind={data} />}
        </For>
      </div>
    </div>
  );
}

function FolderTab(props: {
  text: string;
  active: boolean;
  zIndex: string;
  setActiveTab: () => void;
}) {
  const text = createMemo(() => props.text);
  const borderColor = createMemo(() =>
    props.active ? "border-tertiary" : "border-tertiary/40",
  );

  const activeZIndex = createMemo(() => props.zIndex);

  return (
    <li
      class={`inline-flex justify-center items-center font-medium italic text-xs bg-tertiary50 pl-1 pr-2 rounded-t-md ${borderColor()} border-t-2 border-x-2 transition-all ease-out ${activeZIndex()} relative focus-within:drop-shadow-[2px_-2px_4px_rgba(0,0,0,0.1)] hover:drop-shadow-[2px_-2px_4px_rgba(0,0,0,0.1)]`}
    >
      <div class="h-1 w-full absolute -bottom-1 left-0 bg-tertiary50 z-50" />
      <div
        class={`absolute translate-x-full -bottom-[1px] right-[1px] h-[27px] translate-y-[3px] w-[30px] overflow-clip`}
      >
        <div
          class={`absolute origin-top-left h-full w-[44px]  border-t-2 ${borderColor()} bg-tertiary50 transform rotate-[37deg] z-50`}
        />
      </div>
      <button class="z-50" onClick={() => props.setActiveTab()}>
        {text().toUpperCase()}
      </button>
    </li>
  );
}

function FolderPaper(props: PropsWithChildren) {
  return (
    <div class="h-full w-full rounded-[1px] drop-shadow-[2px_2px_12px_rgba(0,0,0,0.1)] p-2 bg-background-50 z-[1000] overflow-y-auto scrollbar">
      {props.children}
    </div>
  );
}

function Folder() {
  const [activeTab, setActiveTab] = createSignal<"summary" | "journey">(
    "summary",
  );

  return (
    <div class="w-full h-full flex flex-col snap-start">
      <nav class="">
        <ul class="h-[24px] mt-1 flex flex-row w-full gap-3 text-sm">
          <FolderTab
            active={activeTab() === "summary"}
            text="SUMMARY"
            zIndex={
              activeTab() === "summary" ? "z-30 opacity-100" : "z-10 opacity-90"
            }
            setActiveTab={() => setActiveTab("summary")}
          />
          <FolderTab
            active={activeTab() === "journey"}
            text="JOURNEY"
            zIndex={
              activeTab() === "journey" ? "z-30 opacity-100" : "z-10 opacity-90"
            }
            setActiveTab={() => setActiveTab("journey")}
          />
          <FolderTab
            active={false}
            text="SECRETS"
            zIndex="z-[9] opacity-85"
            setActiveTab={() => {}}
          />
        </ul>
      </nav>
      <div class="bg-tertiary50 h-full rounded-b-xl rounded-r-xl border-tertiary border-t-2 border-b-2 border-x-2 z-10 overflow-y-auto overflow-x-hidden relative py-4 px-4 transition-all ease-out">
        <FolderPaper>
          <Switch>
            <Match when={activeTab() === "summary"}>
              <Summary />
            </Match>
            <Match when={activeTab() === "journey"}>
              <Journey />
            </Match>
          </Switch>
        </FolderPaper>
      </div>
    </div>
  );
}

function Summary() {
  return (
    <>
      <h2 class="text-2xl font-titillium font-bold first:mb-2 text-primary">
        Summary
      </h2>
      <div class="font-regular flex flex-col gap-4 text-left">
        <p>
          Driven by a love for problem-solving and competition, I’ve been
          immersed in software development since 2014. Whether it’s optimizing
          systems, crafting scalable APIs, or building intuitive interfaces, I
          thrive on tackling complex challenges with creativity and precision. I
          find joy in exploring new technologies and continuously improving my
          craft, from building frameworks to automating workflows and beyond.
        </p>
        <p>
          What defines my work is a dedication to quality and performance, with
          a focus on clean, efficient code that drives results. Over the years,
          I’ve worked with a range of technologies—from creating HTTP frameworks
          in Rust to designing responsive web applications with React and
          Next.js—always with the goal of delivering elegant and scalable
          solutions. Every project, whether large or small, is an opportunity to
          refine my skills and contribute something meaningful.
        </p>
        <p>
          I’m also a strong believer in collaboration, constantly seeking to
          improve processes and share knowledge within teams. My approach blends
          technical expertise with a deep love for software development,
          ensuring that each project reflects not just functionality, but
          craftsmanship.
        </p>
        <div>
          Key Skills:
          <ul>
            <li>
              Backend: Node.js, TypeScript, Express.js, FastAPI, Rust, NestJS
            </li>
            <li>
              Frontend: React.js, Next.js, Solid.js, Tailwind, Styled Components
            </li>
            <li>
              Databases: MongoDB, PostgreSQL, SQLite AWS: Lambda, S3, SQS, ECS,
            </li>
            <li>
              RedShift, DynamoDB DevOps: Docker, CI/CD, Terraform, GitHub
              Actions
            </li>
          </ul>
        </div>
      </div>
    </>
  );
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
