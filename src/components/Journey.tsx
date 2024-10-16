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
  const signal = createSignal(false);

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
      class="flex flex-wrap gap-1 items-start"
      onclick={() => setOpen((open) => !open)}
    >
      {props.children}
      <div class="w-6 h-6 text-primary self-start flex justify-center items-center">
        <Show
          when={isOpen()}
          fallback={<ChevronDown size={16} strokeWidth={3} />}
        >
          <ChevronUp size={16} strokeWidth={3} />
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
      <span class="flex flex-wrap items-center shrink-0 text-sm">
        {props.company}
      </span>
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
              <p>
                - Responsible for identifying and resolving production bugs
                without prior knowledge of the project, achieving a 99% success
                rate, and ensuring rapid system stability.
              </p>
              <p>
                - Responsible for implementing integrations with various
                third-party APIs, such as Google Maps and payment APIs,
                optimizing data flow and interaction between external systems.
              </p>
              <p>
                - Developed robust CI/CD pipelines using Terraform and Docker,
                automating deployment across multiple environments, which
                resulted in reduced delivery times and minimized manual errors.
              </p>
              <p>
                - Wrote unit and integration tests using Jest, Vitest, and
                Pytest to ensure code reliability and maintain high test
                coverage, enabling smooth deployments and quick bug
                identification during development.
              </p>
              <p>
                - Created high-performance and scalable REST APIs using Node.js,
                Express.js, NestJS, FastAPI, and Python, with databases such as
                MongoDB, PostgreSQL, RedShift, DynamoDB, and SQLite.{" "}
              </p>
              <p>
                - Experienced with AWS integrations, including SQS, Lambda,
                CloudWatch, EC2, S3, and ECS, providing efficient and
                cost-effective solutions for data storage and processing.
              </p>
              <p>
                - Developed responsive and optimized web interfaces using
                React.js, Next.js, and Solid.js, utilizing Tailwind, CSS, HTML,
                and Styled Components for styling.{" "}
              </p>
              <p>
                - Implemented IndexedDB for offline support and managed
                application state with Context API and React Query, ensuring a
                smooth and interactive user experience.
              </p>
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
              <p>
                - Diagnosed system bottleneck, using MongoDB Atlas Analytics and
                AWS CloudWatch, and improved it by fixing the database
                connection over-usage that led to 99% uptime and improved
                average response time;
              </p>
              <p>
                - Co-led weekly Back-end team meetings, optimizing meeting time
                and contributing to increased team satisfaction and
                productivity.
              </p>
              <p>
                - Designed and implemented a complete refactor of the
                permissions system with zero downtime, enhancing flexibility in
                account setting and decreasing support requests;
              </p>
              <p>
                - Designed and implemented a custom script to migrate data from
                the previous product to the new one;
              </p>
              <p>
                - Wrote both unit and integration tests using Jest to ensure
                code reliability and maintain high test coverage, enabling
                smooth deployments and quick identification of bugs during
                development;
              </p>
              <p>
                - Fixed issues and finished functionalities using JavaScript,
                Express.js, Jest, MongoDB, REST, AWS Lambda, AWS ECS, Git, and
                GitLab in order to support the prior major project;
              </p>
              <p>
                - Implemented and maintained multiple features for the new major
                project using Typescript, REST, Jest, MongoDB, AWS Lambda, AWS
                S3, AWS SQS, Git, GitHub, and GitLab;
              </p>
              <p>
                - Helped coworkers with pair programming and code reviews to
                promote a cooperative development atmosphere;
              </p>
              <p>
                - Integrated the new system with multiple external platforms
                using WebHooks' best practices.
              </p>
            </ExperienceDescription>
          </Experience>
        </Section>
      </div>
    </>
  );
}
