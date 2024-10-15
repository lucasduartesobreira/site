import { ChevronDown, ChevronUp } from "lucide-solid";
import {
  children,
  ComponentProps,
  createContext,
  createMemo,
  createSignal,
  Match,
  ParentProps,
  Show,
  Signal,
  Suspense,
  Switch,
  useContext,
} from "solid-js";

function HighlightParagraph(props: ParentProps<ComponentProps<"p">>) {
  const c = children(() => props.children);
  const className = () => props.class;

  return (
    <p
      class={`pb-2 group-hover/exp:font-semibold transition-all ease-out text-pretty ${className()}`}
    >
      {c()}
    </p>
  );
}

function LeftSideIconContainer(props: ParentProps) {
  const c = children(() => props.children);
  return (
    <div class="max-w-min min-w-min min-h-min h-full flex justify-center overflow-hidden ">
      <div class="w-4 h-4 min-w-4 min-h-4 rounded-full border-2 border-tertiary relative group-hover/exp:border-3 group-hover/exp:drop-shadow-[0px_0px_1px_rgba(0,0,0,0.2)] group-hover/exp:bg-tertiary transition-all ease-out">
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
  const typeOfSection = createMemo(() => props.type);
  return (
    <DescriptionContainer>
      <section class="flex gap-2 group/exp">
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
        {props.children}
      </section>
    </DescriptionContainer>
  );
}

const IsDescriptionOpen = createContext<Signal<boolean>>();

function DescriptionContainer(props: ParentProps) {
  const signal = createSignal(true);

  return (
    <IsDescriptionOpen.Provider value={signal}>
      {props.children}
    </IsDescriptionOpen.Provider>
  );
}

function useDescription() {
  const isOpenContext = useContext(IsDescriptionOpen);

  if (isOpenContext == undefined) {
    throw "Description is undefined";
  }

  return isOpenContext;
}

function Description(props: ParentProps) {
  const [isOpen] = useDescription();
  const c = children(() => props.children);
  return (
    <div
      class={`flex gap-1 grow-0 group/description transition-all ease-out duration-1000 ${isOpen() ? "grow-0" : ""}`}
    >
      <div class="grow">
        <Show when={isOpen()}>{c()}</Show>
      </div>
    </div>
  );
}

function DescriptionButton(props: ParentProps) {
  const [isOpen, setOpen] = useDescription();
  return (
    <button
      class="flex justify-center items-center"
      onclick={() => setOpen((open) => !open)}
    >
      {props.children}
      <Show when={isOpen()} fallback={<ChevronDown size={16} />}>
        <ChevronUp size={16} />
      </Show>
    </button>
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
            <DescriptionButton>
              <span class="flex gap-2 items-center">
                {"Full Stack Developer - Free Lancer - 2023 - Present"}
              </span>
            </DescriptionButton>
            <Description>
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description
            </Description>
          </HighlightParagraph>
        </Section>
        <Section type="last">
          <HighlightParagraph>
            <span class="flex gap-2">
              {"Back-end Developer - Free Lancer - 2022 - 2022"}
              <DescriptionButton></DescriptionButton>
            </span>
            <Description>
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description
            </Description>
          </HighlightParagraph>
        </Section>
      </div>
    </>
  );
}
