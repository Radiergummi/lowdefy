import cleanOutputDirectory from './cleanOutputDirectory';
import cleanDirectory from '../utils/files/cleanDirectory';

jest.mock('../utils/files/cleanDirectory', () => {
  return jest.fn();
});

beforeEach(() => {
  cleanDirectory.mockReset();
});

test('cleanOutputDirectory calls cleanDirectory', async () => {
  const context = {
    outputBaseDir: 'outputBaseDir',
  };
  await cleanOutputDirectory({ context });
  expect(cleanDirectory.mock.calls).toMatchInlineSnapshot([['outputBaseDir']]);
});
