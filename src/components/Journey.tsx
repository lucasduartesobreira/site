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
      class={`flex text-sm gap-1 group/description transition-all ease-out duration-75`}
    >
      <div class="grow">
        <Show when={isOpen()}>
          <div class="my-2 group-hover/exp:font-medium">{c()}</div>
        </Show>
      </div>
    </div>
  );
}

function ExperienceToggleDescription(props: ParentProps) {
  const [isOpen, setOpen] = useExperience();
  return (
    <button
      class="flex font-titillium flex-wrap gap-1 items-start"
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
      <span class="flex flex-wrap items-center shrink-0 ">
        {props.jobTitle}
      </span>
      <span class="flex flex-wrap items-center shrink-0 text-sm ">
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
              <ul class="list-disc list-inside">
                <li>
                  Responsible for identifying and resolving production bugs
                  without prior knowledge of the project, achieving a 99%
                  success rate, and ensuring rapid system stability.
                </li>
                <li>
                  Responsible for implementing integrations with various
                  third-party APIs, such as Google Maps and payment APIs,
                  optimizing data flow and interaction between external systems.
                </li>
                <li>
                  Developed robust CI/CD pipelines using Terraform and Docker,
                  automating deployment across multiple environments, which
                  resulted in reduced delivery times and minimized manual
                  errors.
                </li>
                <li>
                  Wrote unit and integration tests using Jest, Vitest, and
                  Pytest to ensure code reliability and maintain high test
                  coverage, enabling smooth deployments and quick bug
                  identification during development.
                </li>
                <li>
                  Created high-performance and scalable REST APIs using Node.js,
                  Express.js, NestJS, FastAPI, and Python, with databases such
                  as MongoDB, PostgreSQL, RedShift, DynamoDB, and SQLite.{" "}
                </li>
                <li>
                  Experienced with AWS integrations, including SQS, Lambda,
                  CloudWatch, EC2, S3, and ECS, providing efficient and
                  cost-effective solutions for data storage and processing.
                </li>
                <li>
                  Developed responsive and optimized web interfaces using
                  React.js, Next.js, and Solid.js, utilizing Tailwind, CSS,
                  HTML, and Styled Components for styling.{" "}
                </li>
                <li>
                  Implemented IndexedDB for offline support and managed
                  application state with Context API and React Query, ensuring a
                  smooth and interactive user experience.
                </li>
              </ul>
            </ExperienceDescription>
          </Experience>
        </Section>
        <Section type="middle">
          <Experience>
            <ExperienceHeader
              jobTitle="Back-end Developer"
              company="Tindin Educação LTDA"
              start="03/2022"
              end="11/2022"
            />
            <ExperienceDescription>
              <ul class="list-disc list-inside">
                <li>
                  Diagnosed system bottleneck, using MongoDB Atlas Analytics and
                  AWS CloudWatch, and improved it by fixing the database
                  connection over-usage that led to 99% uptime and improved
                  average response time;
                </li>
                <li>
                  Co-led weekly Back-end team meetings, optimizing meeting time
                  and contributing to increased team satisfaction and
                  productivity.
                </li>
                <li>
                  Designed and implemented a complete refactor of the
                  permissions system with zero downtime, enhancing flexibility
                  in account setting and decreasing support requests;
                </li>
                <li>
                  Designed and implemented a custom script to migrate data from
                  the previous product to the new one;
                </li>
                <li>
                  Wrote both unit and integration tests using Jest to ensure
                  code reliability and maintain high test coverage, enabling
                  smooth deployments and quick identification of bugs during
                  development;
                </li>
                <li>
                  Fixed issues and finished functionalities using JavaScript,
                  Express.js, Jest, MongoDB, REST, AWS Lambda, AWS ECS, Git, and
                  GitLab in order to support the prior major project;
                </li>
                <li>
                  Implemented and maintained multiple features for the new major
                  project using Typescript, REST, Jest, MongoDB, AWS Lambda, AWS
                  S3, AWS SQS, Git, GitHub, and GitLab;
                </li>
                <li>
                  Helped coworkers with pair programming and code reviews to
                  promote a cooperative development atmosphere;
                </li>
                <li>
                  Integrated the new system with multiple external platforms
                  using WebHooks' best practices.
                </li>
              </ul>
            </ExperienceDescription>
          </Experience>
        </Section>
        <Section type="middle">
          <Experience>
            <ExperienceHeader
              jobTitle="Competitive Programmer"
              company="Freelancer"
              start="2016"
              end="2018"
            />
            <ExperienceDescription>
              <ul class="list-disc list-inside">
                <li>
                  Sharpened problem-solving skills through algorithmic
                  challenges, consistently tackling complex problems in data
                  structures, dynamic programming, and graph theory to improve
                  efficiency and solution speed.
                </li>
                <li>
                  Developed a deep understanding of computational complexity,
                  optimizing solutions by applying advanced algorithms, design
                  patterns, and programming techniques to achieve optimal time
                  and space complexity.
                </li>
                <li>
                  Engaged in continuous learning and self-improvement, regularly
                  solving coding challenges to stay proficient in key algorithms
                  and data structures, ensuring readiness for real-world
                  application and technical interviews.
                </li>
              </ul>
            </ExperienceDescription>
          </Experience>
        </Section>
        <Section type="last">
          <Experience>
            <ExperienceHeader
              jobTitle="Java Minecraft Plug-in Developer"
              company="Freelancer"
              start="2014"
              end="2015"
            />
            <ExperienceDescription>
              <ul class="list-disc list-inside">
                <li>
                  Managed deployment and maintenance of Minecraft servers
                  running Hunger Games and Mini Games, ensuring stable
                  performance and quick issue resolution. Regular updates kept
                  servers compatible with new versions.
                </li>
                <li>
                  Developed and maintained mini-game plugins, creating custom
                  game mechanics and fixing bugs based on player feedback to
                  enhance the overall experience.
                </li>
                <li>
                  Extended Hunger Games plugins by adding new features, updating
                  to multiple Minecraft versions, and incorporating current
                  trends, all while ensuring compatibility.
                </li>
                <li>
                  Collaborated with developers and the community, prioritizing
                  feature requests and continuously rolling out improvements
                  based on player feedback.
                </li>
              </ul>
            </ExperienceDescription>
          </Experience>
        </Section>
      </div>
    </>
  );
}
