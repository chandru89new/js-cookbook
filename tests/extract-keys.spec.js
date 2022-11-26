const { test, expect } = require('@jest/globals');

const getKeyVal = (key, obj) => {
  if (!obj) return undefined;
  if (obj.hasOwnProperty(key)) return obj[key];
  return undefined;
};
const extractKeys = (keys = [], list = []) => {
  return list.map((obj) => {
    if (!obj) return undefined;
    return Object.fromEntries(keys.map((key) => [key, getKeyVal(key, obj)]));
  });
};

test('extractKeys', () => {
  const objs = [
    { id: 1, number: 33, place: { city: 'Ohio' }, color: 'red' },
    { id: 2, number: 21, place: { city: 'Tokyo' }, color: 'black' },
    { id: 3, number: 87, place: { city: 'Delhi' }, color: 'yellow' },
  ];
  const res1 = extractKeys(['id', 'place'], objs);
  const res2 = extractKeys(['color', 'number'], objs);
  const res3 = extractKeys(['name', 'city'], objs);
  const res4 = extractKeys(['id', 'name', 'city'], objs);
  expect(res1).toEqual([
    { id: 1, place: { city: 'Ohio' } },
    { id: 2, place: { city: 'Tokyo' } },
    { id: 3, place: { city: 'Delhi' } },
  ]);
  expect(res2).toEqual([
    { number: 33, color: 'red' },
    { number: 21, color: 'black' },
    { number: 87, color: 'yellow' },
  ]);
  expect(res3).toEqual([{}, {}, {}]);
  expect(res4).toEqual([{ id: 1 }, { id: 2 }, { id: 3 }]);
});
