#!/usr/bin/env node

import clear from "clear";
import program from "commander";
import { BrowserRunner } from "./BrowserRunner";
import { Server } from "./browser/Server";
import { renderCli } from "./callbacks/cli";
import { buildScreenshotCallback } from "./callbacks/screenshot";
import { CONFIG } from "./config";
import { Job, BrowserStep } from "./types";

clear();

program
  .command("run <source>")
  .description("run a test")
  .action(async (source, destination) => {
    const steps: BrowserStep[] = [
      {
        locator: {
          inputType: "text",
          name: "username",
          tagName: "input",
          xpath: '//*[@id="username"]'
        },
        type: "type",
        value: "tomsmith"
      },
      {
        locator: {
          inputType: "password",
          name: "password",
          tagName: "input",
          xpath: '//*[@id="password"]'
        },
        type: "type",
        value: "SuperSecretPassword!"
      },
      {
        locator: {
          tagName: "button",
          textContent: " login",
          xpath: '//*[@id="login"]/button'
        },
        type: "click"
      }
    ];

    const job: Job = {
      href: `${CONFIG.testUrl}/login`,
      name: "Log in",
      steps
    };
    const server = new Server();
    await server.listen();

    const takeScreenshot = buildScreenshotCallback(1000);

    const callbacks = {
      beforeStep: [takeScreenshot, renderCli],
      afterStep: [renderCli],
      afterRun: [takeScreenshot, renderCli]
    };

    const runner = new BrowserRunner({ callbacks, server });
    await runner.run(job);

    await runner.close();

    process.exit(0);
  });

program.parse(process.argv);
