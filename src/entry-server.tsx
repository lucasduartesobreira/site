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
