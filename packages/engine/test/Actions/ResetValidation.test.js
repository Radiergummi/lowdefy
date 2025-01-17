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

import testContext from '../testContext';

const pageId = 'one';

const closeLoader = jest.fn();
const displayMessage = jest.fn();
const lowdefy = {
  displayMessage,
  pageId,
};

const RealDate = Date;
const mockDate = jest.fn(() => ({ date: 0 }));
mockDate.now = jest.fn(() => 0);

// Comment out to use console
console.log = () => {};
console.error = () => {};

beforeEach(() => {
  displayMessage.mockReset();
  closeLoader.mockReset();
  displayMessage.mockImplementation(() => closeLoader);
});

beforeAll(() => {
  global.Date = mockDate;
});

afterAll(() => {
  global.Date = RealDate;
});

test('RestValidation after required field', async () => {
  const rootBlock = {
    blockId: 'root',
    meta: {
      category: 'context',
    },
    areas: {
      content: {
        blocks: [
          {
            blockId: 'text1',
            type: 'TextInput',
            meta: {
              category: 'input',
              valueType: 'string',
            },
            required: true,
          },
          {
            blockId: 'button',
            type: 'Button',
            meta: {
              category: 'display',
            },
            events: {
              onClick: [
                {
                  id: 'validate',
                  type: 'Validate',
                },
              ],
            },
          },
          {
            blockId: 'reset',
            type: 'Button',
            meta: {
              category: 'display',
            },
            events: {
              onClick: [
                {
                  id: 'reset',
                  type: 'ResetValidation',
                },
              ],
            },
          },
        ],
      },
    },
  };
  const context = await testContext({
    lowdefy,
    rootBlock,
  });
  const { button, reset, text1 } = context.RootBlocks.map;
  expect(text1.eval.validation).toEqual({
    errors: ['This field is required'],
    status: null,
    warnings: [],
  });
  await button.triggerEvent({ name: 'onClick' });
  expect(button.Events.events.onClick.history[0]).toEqual({
    blockId: 'button',
    bounced: false,
    event: undefined,
    eventName: 'onClick',
    error: {
      action: {
        id: 'validate',
        type: 'Validate',
      },
      error: {
        error: new Error('Your input has 1 validation error.'),
        index: 0,
        type: 'Validate',
      },
    },
    responses: {
      validate: {
        type: 'Validate',
        index: 0,
        error: new Error('Your input has 1 validation error.'),
      },
    },
    success: false,
    startTimestamp: { date: 0 },
    endTimestamp: { date: 0 },
  });
  expect(text1.eval.validation).toEqual({
    errors: ['This field is required'],
    status: 'error',
    warnings: [],
  });
  expect(displayMessage.mock.calls).toEqual([
    [
      {
        content: 'Your input has 1 validation error.',
        duration: 6,
        status: 'error',
      },
    ],
  ]);
  displayMessage.mockReset();
  displayMessage.mockImplementation(() => closeLoader);
  await reset.triggerEvent({ name: 'onClick' });
  expect(button.Events.events.onClick.history[0]).toEqual({
    blockId: 'button',
    bounced: false,
    endTimestamp: {
      date: 0,
    },
    error: {
      action: {
        id: 'validate',
        type: 'Validate',
      },
      error: {
        error: new Error('Your input has 1 validation error.'),
        index: 0,
        type: 'Validate',
      },
    },
    event: undefined,
    eventName: 'onClick',
    responses: {
      validate: {
        error: new Error('Your input has 1 validation error.'),
        index: 0,
        type: 'Validate',
      },
    },
    startTimestamp: {
      date: 0,
    },
    success: false,
  });
  expect(text1.eval.validation).toEqual({
    errors: ['This field is required'],
    status: null,
    warnings: [],
  });
  expect(displayMessage.mock.calls).toEqual([]);
});
