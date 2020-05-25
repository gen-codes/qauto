const qawolf = require("qawolf");

let browser;
let page;

beforeAll(async () => {
  browser = await qawolf.launch();
  const context = await browser.newContext({viewport: null});
  await qawolf.register(context);
  page = await context.newPage();
});

afterAll(async () => {
  await qawolf.stopVideos();
  await browser.close();
});

describe("dilosi", () => {
  it('opens the page', async () => {
    await page.goto("http://localhost:5000/");
    await page.mouse.move(934,318)
    page.setViewportSize({
      width: 940,
      height: 944,
    })
    await page.mouse.move(1155,314)
    page.setViewportSize({
      width: 1157,
      height: 944,
    })
    await page.mouse.move(1238,313)
    page.setViewportSize({
      width: 1237,
      height: 944,
    })
    await page.mouse.move(494,612)
    await page.mouse.click(494,612)
    await page.mouse.move(1223,314)
    page.setViewportSize({
      width: 1178,
      height: 944,
    })
    await page.mouse.move(72,172)
    await page.mouse.click(72,172)
    await page.mouse.move(51,222)
    await page.mouse.click(51,222)
    await page.mouse.move(27,259)
    await qawolf.create();
  })
});