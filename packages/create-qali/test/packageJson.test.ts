import fs from 'fs-extra';
import * as packageJson from '../src/packageJson';

const writeFileSpy = jest
  .spyOn(fs, 'writeFile')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  .mockImplementation(async () => {});

describe('readPackageJson', () => {
  const { readPackageJson } = packageJson;

  it('loads package.json relative to cwd', async () => {
    const pkg = await readPackageJson();
    expect(pkg.name).toEqual('create-qawolf');
  });

  it('throws an error when there is no package.json', async () => {
    const spy = jest.spyOn(process, 'cwd');
    spy.mockReturnValue('/fakedir');
    await expect(readPackageJson()).rejects.toMatchInlineSnapshot(
      `[Error: cannot read package.json]`,
    );
    spy.mockRestore();
  });
});

describe('addDevDependencies', () => {
  let readPackageJsonSpy: jest.SpyInstance;

  beforeAll(() => {
    readPackageJsonSpy = jest.spyOn(packageJson, 'readPackageJson');
    readPackageJsonSpy.mockResolvedValue({
      name: 'mypackage',
      devDependencies: { a: '*', z: '*' },
    });
  });

  afterAll(() => {
    readPackageJsonSpy.mockRestore();
  });

  it('adds devDependencies alphabetically', async () => {
    await packageJson.addDevDependencies(true);
    expect(writeFileSpy.mock.calls[0][1]).toMatchInlineSnapshot(`
      "{
        \\"name\\": \\"mypackage\\",
        \\"devDependencies\\": {
          \\"@types/debug\\": \\"^4.1.5\\",
          \\"@types/jest\\": \\"^25.2.2\\",
          \\"@types/node\\": \\"^14.0.1\\",
          \\"a\\": \\"*\\",
          \\"jest\\": \\"^26.0.1\\",
          \\"playwright\\": \\"^1.0.1\\",
          \\"qawolf\\": \\"^1.0.1\\",
          \\"ts-jest\\": \\"^25.5.1\\",
          \\"z\\": \\"*\\"
        }
      }
      "
    `);
  });

  it('does not add jest to create-react-app', async () => {
    readPackageJsonSpy.mockResolvedValue({
      name: 'my-create-react-app',
      dependencies: { 'react-scripts': '*' },
    });

    const packages = await packageJson.addDevDependencies(true);
    expect(packages['jest']).toBeUndefined();
  });
});
