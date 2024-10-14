import {
  children,
  ComponentProps,
  createMemo,
  Match,
  ParentProps,
  Switch,
} from "solid-js";

function HighlightSkill(props: ParentProps<ComponentProps<"a">>) {
  const c = children(() => props.children);
  const className = () => props.class;
  const beautifulHover =
    "hover:text-transparent hover:bg-gradient-to-r hover:from-tertiary hover:via-tertiary hover:to-tertiary50 hover:bg-clip-text";

  const restOfProps = () => {
    const { class: _cName, children: _children, ...rest } = props;
    return rest;
  };
  return (
    <a
      class={`text-primary font-bold font-titillium text-lg ${beautifulHover} ${className()}`}
      {...restOfProps}
    >
      {c()}
    </a>
  );
}

function HighlightParagraph(props: ParentProps<ComponentProps<"p">>) {
  const c = children(() => props.children);
  const className = () => props.class;

  return (
    <p
      class={`py-2 hover:font-semibold transition-all ease-out text-pretty ${className}`}
    >
      {c()}
    </p>
  );
}

function LeftSideIconContainer(props: ParentProps) {
  const c = children(() => props.children);
  return (
    <div class="self-center max-w-min min-w-min min-h-min h-full flex justify-center items-center overflow-hidden">
      <div class="w-4 h-4 min-w-4 min-h-4 rounded-full border-2 border-tertiary relative">
        {c()}
      </div>
    </div>
  );
}

function LeftSideIconDown() {
  return (
    <div class="absolute top-full left-1/2 -translate-x-1/2 w-[2px] h-screen bg-tertiary" />
  );
}

function LeftSideIconUp() {
  return (
    <div class="absolute bottom-full left-1/2 -translate-x-1/2 w-[2px] h-screen bg-tertiary" />
  );
}

function LeftSideIconFirst() {
  return (
    <LeftSideIconContainer>
      <LeftSideIconDown />
    </LeftSideIconContainer>
  );
}

function LeftSideIconMiddle() {
  return (
    <LeftSideIconContainer>
      <LeftSideIconUp />
      <LeftSideIconDown />
    </LeftSideIconContainer>
  );
}

function LeftSideIconLast() {
  return (
    <LeftSideIconContainer>
      <LeftSideIconUp />
    </LeftSideIconContainer>
  );
}

function Section(props: ParentProps<{ type: "first" | "middle" | "last" }>) {
  const c = children(() => props.children);
  const typeOfSection = createMemo(() => props.type);
  return (
    <section class="flex items-center gap-2">
      <Switch>
        <Match when={typeOfSection() === "first"}>
          <LeftSideIconFirst />
        </Match>
        <Match when={typeOfSection() === "middle"}>
          <LeftSideIconMiddle />
        </Match>
        <Match when={typeOfSection() === "last"}>
          <LeftSideIconLast />
        </Match>
      </Switch>
      {c()}
    </section>
  );
}

export default function Journey() {
  return (
    <>
      <h2 class="text-2xl font-titillium font-bold first:mb-2 text-primary">
        Journey
      </h2>
      <div class="font-regular flex flex-col text-left text-justify text-pretty">
        <Section type="first">
          <HighlightParagraph>
            Full Stack Developer - Free Lancer - 2023 - Present
          </HighlightParagraph>
        </Section>
        <Section type="last">
          <HighlightParagraph>
            Back-end Developer - Free Lancer - 2022 - 2022
          </HighlightParagraph>
        </Section>
      </div>
    </>
  );
}
