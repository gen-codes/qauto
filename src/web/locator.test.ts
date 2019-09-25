import { BrowserObject } from "webdriverio";
import { createBrowser, injectClient } from "../browser/browserUtils";
import { CONFIG } from "../config";
import { QAWolf } from "./index";

let browser: BrowserObject;

beforeAll(async () => {
  browser = await createBrowser(`${CONFIG.testUrl}/login`);
  await injectClient(browser);
});

afterAll(() => browser.closeWindow());

test("getLabels correctly returns labels", async () => {
  const nullLabels = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getLabels(document.getElementsByTagName("h2")[0]);
  });

  expect(nullLabels).toBeNull();

  const usernameLabels = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getLabels(document.getElementsByTagName("input")[0]);
  });

  expect(usernameLabels).toEqual(["username"]);
});

test("getParentText correctly returns parent text", async () => {
  const iconParentText = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getParentText(document.getElementsByTagName("i")[0]);
  });

  expect(iconParentText).toEqual([" login", " login"]);
});

test("getPlaceholder correctly returns placeholder", async () => {
  const nullPlaceholder = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getPlaceholder(
      document.getElementsByTagName("input")[0]
    );
  });

  expect(nullPlaceholder).toBeNull();
});

test("getTextContent correctly returns text content", async () => {
  const headerTextContent = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getTextContent(
      document.getElementsByTagName("h2")[0]
    );
  });

  expect(headerTextContent).toBe("login page");

  const nullTextContent = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getTextContent(
      document.getElementsByTagName("input")[0]
    );
  });

  expect(nullTextContent).toBeNull();
});

test("getLocator correctly returns full element locator", async () => {
  const inputLocator = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;
    return qawolf.locator.getLocator(document.getElementsByTagName("input")[0]);
  });

  expect(inputLocator).toMatchObject({
    classList: null,
    href: null,
    id: "username",
    inputType: "text",
    labels: ["username"],
    name: "username",
    placeholder: null,
    tagName: "input",
    textContent: null
  });
  expect(inputLocator!.parentText).toContain("username");

  const headerLocator = await browser.execute(() => {
    const qawolf: QAWolf = (window as any).qawolf;

    return qawolf.locator.getLocator(document.getElementsByTagName("h2")[0]);
  });

  expect(headerLocator).toMatchObject({
    classList: null,
    href: null,
    id: null,
    inputType: null,
    labels: null,
    name: null,
    placeholder: null,
    tagName: "h2",
    textContent: "login page"
  });
  expect(headerLocator!.parentText).toContain("login page");
});
