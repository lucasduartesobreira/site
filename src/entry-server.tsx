// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" sizes="32x32" href="/favicon.png" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link
            rel="preconnect"
            href="https://fonts.googleapis.com"
            crossorigin="anonymous"
          ></link>
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600;1,700&display=swap"
            as="style"
          />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300..700;1,300..700&display=swap"
            as="style"
          />
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,300;1,300&display=swap"
            as="style"
          />
          <meta
            name="og:title"
            content="Welcome to the personal site of Lucas Duarte"
          />
          <meta
            name="og:description"
            content="Lucas Duarte is a Full-Stack Software Engineer who loves crafting performant, scalable, and maintainable solutions using technologies like Node.js, Python, Rust, and React, driven by a passion for competition and continuous improvement."
          />
          <meta name="og:image" content="/favicon.png" />
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
