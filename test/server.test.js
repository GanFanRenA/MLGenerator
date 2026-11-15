const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

test("the local application server serves the page and API", async (t) => {
  const temporaryDirectory = await fs.mkdtemp(
    path.join(os.tmpdir(), "ml-generator-test-"),
  );
  process.env.MLGENERATOR_STATE_FILE = path.join(
    temporaryDirectory,
    "app-state.json",
  );

  const { startPreviewServer } = require("../preview-server");
  const { server, url } = await startPreviewServer({ port: 0 });

  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    await fs.rm(temporaryDirectory, { recursive: true, force: true });
  });

  const pageResponse = await fetch(url);
  assert.equal(pageResponse.status, 200);
  assert.match(await pageResponse.text(), /<title>ML Generator/);

  const projectResponse = await fetch(`${url}/api/project`);
  assert.equal(projectResponse.status, 200);
  assert.deepEqual(await projectResponse.json(), {
    selected: false,
    path: null,
  });
});
