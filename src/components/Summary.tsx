import { children, ComponentProps, ParentProps } from "solid-js";

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
      class={`hover:font-semibold transition-all ease-out text-pretty ${className}`}
    >
      {" "}
      {c()}
    </p>
  );
}

export default function Summary() {
  return (
    <>
      <h2 class="text-2xl font-titillium font-bold first:mb-2 text-primary">
        Summary
      </h2>
      <div class="font-regular flex flex-col gap-4 text-left text-justify text-pretty">
        <HighlightParagraph>
          Driven by a <span class="text-red-600 font-medium">love</span> for
          problem-solving and competition, I’ve been immersed in software
          development since 2014. Whether it’s optimizing systems, crafting
          scalable APIs, or building intuitive interfaces, I thrive on tackling
          complex challenges with creativity and precision. I find joy in
          exploring new technologies and continuously improving my craft, from
          building frameworks to automating workflows and beyond.
        </HighlightParagraph>
        <HighlightParagraph>
          What drives me is a passion for creating performant, scalable, and
          maintainable software, combined with a competitive edge to constantly
          improve. From building an HTTP framework in{" "}
          <HighlightSkill href="https://www.rust-lang.org/">
            Rust
          </HighlightSkill>{" "}
          to developing responsive web apps with{" "}
          <HighlightSkill href="https://react.dev/">React</HighlightSkill> and{" "}
          <HighlightSkill href="https://nextjs.org/">Next.js</HighlightSkill>, I
          focus on clean, efficient code that delivers real impact. Every
          project is an opportunity to push the limits, refine my skills, and
          solve challenging problems.
        </HighlightParagraph>
        <HighlightParagraph>
          Professionally, I’ve tackled complex backend systems, refactored
          critical code, and built scalable APIs with{" "}
          <HighlightSkill href="https://nodejs.org">Node.js</HighlightSkill>,{" "}
          <HighlightSkill href="https://python.org/">Python</HighlightSkill>,
          and{" "}
          <HighlightSkill href="https://aws.amazon.com/">AWS</HighlightSkill>.
          My competitive nature pushes me to optimize systems for speed and
          reliability, whether diagnosing bottlenecks or designing flexible
          architectures. I thrive in environments that challenge me, delivering
          solutions that not only perform but also stand the test of time.
        </HighlightParagraph>
        <HighlightParagraph>
          I’m also a strong believer in collaboration, constantly seeking to
          improve processes and share knowledge within teams. My approach blends
          technical expertise with a deep love for software development,
          ensuring that each project reflects not just functionality, but
          craftsmanship.
        </HighlightParagraph>
        <div>
          <h2 class="font-bold">Key Skills:</h2>
          <div class="flex max-md:flex-wrap max-md:gap-4 md:gap-2 max-md:items-center">
            <ul class="w-full flex flex-col gap-2">
              <li class="flex flex-col gap-2 text-start">
                <h2 class="inline-block font-semibold">Backend:</h2>
                <HighlightParagraph>
                  Node.js, TypeScript, Express.js, FastAPI, Rust, NestJS, Python
                </HighlightParagraph>
              </li>
              <li class="flex flex-col gap-2 text-start">
                <h2 class="inline-block font-semibold">Frontend:</h2>
                <HighlightParagraph>
                  React.js, Next.js, Solid.js, Tailwind, Styled Components
                </HighlightParagraph>{" "}
              </li>
              <li class="flex flex-col gap-2 text-start">
                <h2 class="inline-block font-semibold">Databases:</h2>
                <HighlightParagraph>
                  MongoDB, PostgreSQL, SQLite, RedShift, DynamoDB
                </HighlightParagraph>{" "}
              </li>
              <li class="flex flex-col gap-2 text-start">
                <h2 class="inline-block font-semibold">AWS:</h2>
                <HighlightParagraph>Lambda, S3, SQS, ECS</HighlightParagraph>
              </li>
              <li class="flex flex-col gap-2 text-start">
                <h2 class="inline-block font-semibold">Databases:</h2>
                <HighlightParagraph>
                  Docker, CI/CD, Terraform, GitHub Actions
                </HighlightParagraph>
              </li>
            </ul>
            <div class="min-w-max flex justify-center items-center md:mr-auto max-md:w-full">
              <img src="https://skillicons.dev/icons?i=nodejs,ts,express,fastapi,rust,nestjs,react,nextjs,solidjs,tailwind,styledcomponents,mongodb,postgresql,sqlite,dynamodb,aws,docker,terraform,githubactions,python&perline=4" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
