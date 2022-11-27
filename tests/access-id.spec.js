const { test, expect } = require('@jest/globals');

const convertToObject = ({ key, list = [] }) => {
  if (!list || !list.length || !key) return undefined;
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined);
  return Object.fromEntries(
    kvals.map((kval) => [kval, list.find((item) => item[key] === kval)])
  );
};

test('convertToObject', () => {
  let items = [
    { id: 1, name: 'john' },
    { id: 2, name: 'jane' },
    { id: 3, name: 'bob' },
  ];
  const obj = convertToObject({ key: 'id', list: items });
  expect(obj).toEqual({
    1: { id: 1, name: 'john' },
    2: { id: 2, name: 'jane' },
    3: { id: 3, name: 'bob' },
  });
});

test('convertToObject2', () => {
  let items = [
    { id: 1, name: 'john' },
    { _id: 2, name: 'jane' },
    { _id: 3, name: 'bob' },
  ];
  const obj = convertToObject({ key: 'id', list: items });
  expect(obj).toEqual({
    1: { id: 1, name: 'john' },
  });
});

test('convertToObject3', () => {
  let items = [
    { id: 'a1', name: 'john' },
    { id: 'a2', name: 'jane' },
    { id: 'a3', name: 'bob' },
  ];
  const obj = convertToObject({ key: 'id', list: items });
  expect(obj).toEqual({
    a1: { id: 'a1', name: 'john' },
    a2: { id: 'a2', name: 'jane' },
    a3: { id: 'a3', name: 'bob' },
  });
});
