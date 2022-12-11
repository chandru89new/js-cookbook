const { test, expect } = require('@jest/globals');

const runPromises = async (promises) => {
  let plist = Object.entries(promises).map(async ([name, promise]) => {
    let res;
    try {
      res = { data: await promise() };
    } catch (e) {
      res = { error: e };
    }
    return [name, res];
  });
  let intermediateResult = [];
  for (let p of plist) {
    await intermediateResult.push(await p);
  }
  return Object.fromEntries(intermediateResult);
};

const p1 = () => Promise.resolve(1);
const p2 = () => Promise.resolve(2);
const p3 = () => Promise.reject('Error!');
const p4 = () => Promise.resolve(4);
const p5 = () => Promise.resolve(5);

test('parallel promises', async () => {
  const results1 = await runPromises({
    p1,
    p2,
    p3,
  });
  expect(results1).toEqual({
    p1: { data: 1 },
    p2: { data: 2 },
    p3: { error: 'Error!' },
  });
  const results2 = await runPromises({ p1, p2, p4, p5 });
  expect(results2).toEqual({
    p1: { data: 1 },
    p2: { data: 2 },
    p4: { data: 4 },
    p5: { data: 5 },
  });
});
