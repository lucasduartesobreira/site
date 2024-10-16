import { ArrowRight, ChevronDown, ChevronUp } from "lucide-solid";
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
  Switch,
  useContext,
} from "solid-js";

function Experience(props: ParentProps<ComponentProps<"p">>) {
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
    <ExperienceContainer>
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
    </ExperienceContainer>
  );
}

const IsDescriptionOpen = createContext<Signal<boolean>>();

function ExperienceContainer(props: ParentProps) {
  const signal = createSignal(true);

  return (
    <IsDescriptionOpen.Provider value={signal}>
      {props.children}
    </IsDescriptionOpen.Provider>
  );
}

function useExperience() {
  const isOpenContext = useContext(IsDescriptionOpen);

  if (isOpenContext == undefined) {
    throw "Description is undefined";
  }

  return isOpenContext;
}

function ExperienceDescription(props: ParentProps) {
  const [isOpen] = useExperience();
  const c = children(() => props.children);
  return (
    <div
      class={`flex gap-1 group/description transition-all ease-out duration-75`}
    >
      <div class="grow">
        <Show when={isOpen()}>{c()}</Show>
      </div>
    </div>
  );
}

function ExperienceToggleDescription(props: ParentProps) {
  const [isOpen, setOpen] = useExperience();
  return (
    <button
      class="flex gap-2 items-start"
      onclick={() => setOpen((open) => !open)}
    >
      {props.children}
      <div class="w-6 h-6 self-start flex justify-center items-center">
        <Show when={isOpen()} fallback={<ChevronDown size={16} />}>
          <ChevronUp size={16} />
        </Show>
      </div>
    </button>
  );
}

function ShowDate(props: { start: string; end: string }) {
  return (
    <span class="flex gap-2 max-w-min items-center">
      {props.start}
      <ArrowRight class="self-center" size={16} />
      {props.end}
    </span>
  );
}

function JobTitleAndCompany(props: { jobTitle: string; company: string }) {
  return (
    <span class="flex flex-col items-start">
      <span class="flex flex-wrap items-center shrink-0">{props.jobTitle}</span>
      <span class="flex items-center shrink-0 text-sm">{props.company}</span>
    </span>
  );
}

function ExperienceHeader(props: {
  jobTitle: string;
  company: string;
  start: string;
  end: string | "Present";
}) {
  return (
    <ExperienceToggleDescription>
      <JobTitleAndCompany jobTitle={props.jobTitle} company={props.company} />
      {" - "}
      <ShowDate start={props.start} end={props.end} />
    </ExperienceToggleDescription>
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
          <Experience>
            <ExperienceHeader
              jobTitle="Full Stack Developer"
              company="Free Lancer"
              start="01/2023"
              end="Present"
            />
            <ExperienceDescription>
              Really good Description
            </ExperienceDescription>
          </Experience>
        </Section>
        <Section type="last">
          <Experience>
            <ExperienceHeader
              jobTitle="Back-end Developer"
              company="Tindin Educação LTDA"
              start="03/2022"
              end="11/2022"
            />
            <ExperienceDescription>
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description Description
              Description Description Description Description
            </ExperienceDescription>
          </Experience>
        </Section>
      </div>
    </>
  );
}
