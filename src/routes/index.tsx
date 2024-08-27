import { createMemo, For } from "solid-js";

const links = {
  ["linkedin"]: "",
  ["youtube"]: "",
  ["github"]: "",
  ["twitch"]: "",
  ["x"]: "",
  ["gmail"]: "",
} as const;

const icons: { [K in keyof typeof links]: string } = {
  ["linkedin"]: "",
  ["youtube"]: "",
  ["github"]: "",
  ["twitch"]: "",
  ["x"]: "",
  ["gmail"]: "",
} as const;

type SocialMediaKinds = keyof typeof links;

function SocialMediaLink(props: { kind: SocialMediaKinds }) {
  const link = createMemo(() => links[props.kind]);
  const icon = createMemo(() => icons[props.kind]);
  return (
    <a href={link()}>
      <figure>
        <img src={icon()} alt={`Icone da Rede ${props.kind}`}></img>
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
