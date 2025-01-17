/*
  Copyright 2020-2021 Lowdefy, Inc

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import path from 'path';
import { readFile } from '@lowdefy/node-utils';
import getLowdefyYaml from './getLowdefyYaml';

jest.mock('@lowdefy/node-utils', () => {
  const readFile = jest.fn();
  const writeFile = jest.fn();
  return {
    readFile,
    writeFile,
  };
});

beforeEach(() => {
  readFile.mockReset();
});

const baseDirectory = process.cwd();

test('get version from yaml file', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      lowdefy: 1.0.0
      `;
    }
    return null;
  });
  const config = await getLowdefyYaml({ baseDirectory });
  expect(config).toEqual({ lowdefyVersion: '1.0.0', cliConfig: {} });
});

test('get version from yaml file, base dir specified', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'baseDir/lowdefy.yaml')) {
      return `
      lowdefy: 1.0.0
      `;
    }
    return null;
  });
  const config = await getLowdefyYaml({ baseDirectory: path.resolve(process.cwd(), './baseDir') });
  expect(config).toEqual({ lowdefyVersion: '1.0.0', cliConfig: {} });
});

test('could not find lowdefy.yaml in cwd', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return null;
    }
    return `
    lowdefy: 1.0.0
    `;
  });
  await expect(getLowdefyYaml({ baseDirectory })).rejects.toThrow(
    'Could not find "lowdefy.yaml" file in specified base directory'
  );
});

test('could not find lowdefy.yaml in base dir', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'baseDir/lowdefy.yaml')) {
      return null;
    }
    return `
    lowdefy: 1.0.0
    `;
  });
  await expect(
    getLowdefyYaml({ baseDirectory: path.resolve(process.cwd(), './baseDir') })
  ).rejects.toThrow('Could not find "lowdefy.yaml" file in specified base directory');
});

test('lowdefy.yaml is invalid yaml', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      lowdefy: 1.0.0
        - a: a
        b: b
      `;
    }
    return null;
  });
  await expect(getLowdefyYaml({ baseDirectory })).rejects.toThrow(
    'Could not parse "lowdefy.yaml" file. Received error '
  );
});

test('No version specified', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      pages:
        - id: page1
          type: Context
      `;
    }
    return null;
  });
  await expect(getLowdefyYaml({ baseDirectory })).rejects.toThrow(
    'No version specified in "lowdefy.yaml" file. Specify a version in the "lowdefy" field.'
  );
});

test('Version is not a string', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      lowdefy: 1
      `;
    }
    return null;
  });
  await expect(getLowdefyYaml({ baseDirectory })).rejects.toThrow(
    'Version number specified in "lowdefy.yaml" file is not valid. Received 1.'
  );
});

test('Version is not a valid version number', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      lowdefy: v1-0-3
      `;
    }
    return null;
  });
  await expect(getLowdefyYaml({ baseDirectory })).rejects.toThrow(
    'Version number specified in "lowdefy.yaml" file is not valid. Received "v1-0-3".'
  );
});

test('get cliConfig', async () => {
  readFile.mockImplementation((filePath) => {
    if (filePath === path.resolve(process.cwd(), 'lowdefy.yaml')) {
      return `
      lowdefy: 1.0.0
      cli:
        disableTelemetry: true
        watch:
          - a
      `;
    }
    return null;
  });
  const config = await getLowdefyYaml({ baseDirectory });
  expect(config).toEqual({
    lowdefyVersion: '1.0.0',
    cliConfig: { disableTelemetry: true, watch: ['a'] },
  });
});

test('could not find lowdefy.yaml in base dir, command is "init" or "clean-cache"', async () => {
  readFile.mockImplementation(() => null);
  let config = await getLowdefyYaml({ command: 'init', baseDirectory });
  expect(config).toEqual({
    cliConfig: {},
  });
  config = await getLowdefyYaml({ command: 'clean-cache', baseDirectory });
  expect(config).toEqual({
    cliConfig: {},
  });
});
