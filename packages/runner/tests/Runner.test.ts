import { hasText } from "@qawolf/browser";
import { CONFIG } from "@qawolf/config";
import { loadWorkflow } from "@qawolf/fixtures";
import { Workflow } from "@qawolf/types";
import { Runner } from "../src/Runner";

describe("Runner", () => {
  let workflow: Workflow;

  beforeAll(async () => {
    workflow = await loadWorkflow("scroll_login");
  });

  it("runs a workflow", async () => {
    console.log("runs a workflow", {
      ...workflow,
      url: CONFIG.testUrl
    });

    const runner = await Runner.create({
      ...workflow,
      url: CONFIG.testUrl
    });
    await runner.run();

    const page = await runner.browser.currentPage();
    const hasSecureText = await hasText(
      page,
      "You logged out of the secure area!"
    );
    expect(hasSecureText).toBe(true);

    await runner.close();
  });

  it("finds property of element", async () => {
    const runner = await Runner.create({
      ...workflow,
      // need to rename for the video to have a separate path
      name: "dropdown",
      url: `${CONFIG.testUrl}dropdown`
    });

    const id = await runner.findProperty({
      selector: "select",
      property: "id"
    });
    expect(id).toBe("dropdown");

    await runner.close();
  });
});
