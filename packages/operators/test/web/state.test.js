/* eslint-disable max-classes-per-file */
import WebParser from '../../src/webParser';

const args = {
  string: 'args',
  arr: [{ a: 'args1' }, { a: 'args2' }],
};

const context = {
  config: {
    string: 'config',
    arr: [{ a: 'config1' }, { a: 'config2' }],
  },
  input: {
    string: 'input',
    arr: [{ a: 'input1' }, { a: 'input2' }],
  },
  lowdefyGlobal: {
    string: 'global',
    arr: [{ a: 'global1' }, { a: 'global2' }],
  },
  menus: [
    {
      menuId: 'default',
    },
    {
      menuId: 'm_1',
    },
    {
      menuId: 'm_2',
    },
  ],
  mutations: {
    not_loaded: { loading: true, response: 'fail' },
    string: { loading: false, response: 'mutation String' },
    number: { loading: false, response: 500 },
    arr: { loading: false, response: [{ a: 'mutation a1' }, { a: 'mutation a2' }] },
  },
  requests: {
    not_loaded: { loading: true, response: 'fail' },
    string: { loading: false, response: 'request String' },
    number: { loading: false, response: 500 },
    arr: { loading: false, response: [{ a: 'request a1' }, { a: 'request a2' }] },
  },
  state: {
    string: 'state',
    arr: [{ a: 'state1' }, { a: 'state2' }],
  },
  urlQuery: {
    string: 'urlQuery',
    arr: [{ a: 'urlQuery1' }, { a: 'urlQuery2' }],
  },
};

const contexts = {};

const arrayIndices = [1];

test('_state in object', () => {
  const input = { a: { _state: 'string' } };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    a: 'state',
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state full state', () => {
  const input = { _state: true };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    string: 'state',
    arr: [{ a: 'state1' }, { a: 'state2' }],
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state null', () => {
  const input = { _state: null };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toBe(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _state params must be of type string or object. Received: null at locationId.],
    ]
  `);
});

test('_state replace key arrayIndices', () => {
  const input = { a: { _state: 'arr.$.a' } };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    a: 'state2',
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object key', () => {
  const input = {
    _state: {
      key: 'string',
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual('state');
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object all', () => {
  const input = {
    _state: {
      all: true,
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    string: 'state',
    arr: [{ a: 'state1' }, { a: 'state2' }],
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object all and key', () => {
  const input = {
    _state: {
      all: true,
      key: 'string',
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual({
    string: 'state',
    arr: [{ a: 'state1' }, { a: 'state2' }],
  });
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object invalid', () => {
  const input = {
    _state: {
      other: true,
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _state.key must be of type string. Received: {"other":true} at locationId.],
    ]
  `);
});

test('_state param array', () => {
  const input = {
    _state: ['string'],
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`
    Array [
      [Error: Operator Error: _state params must be of type string or object. Received: ["string"] at locationId.],
    ]
  `);
});

test('_state param object with string default', () => {
  const input = {
    _state: {
      key: 'notFound',
      default: 'defaultValue',
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual('defaultValue');
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object with zero default', () => {
  const input = {
    _state: {
      key: 'notFound',
      default: 0,
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(0);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object with false default', () => {
  const input = {
    _state: {
      key: 'notFound',
      default: false,
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(false);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});

test('_state param object with no default', () => {
  const input = {
    _state: {
      key: 'notFound',
    },
  };
  const parser = new WebParser({ context, contexts });
  const res = parser.parse({ input, args, location: 'locationId', arrayIndices });
  expect(res.output).toEqual(null);
  expect(res.errors).toMatchInlineSnapshot(`Array []`);
});