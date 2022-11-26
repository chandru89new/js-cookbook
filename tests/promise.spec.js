const { test, expect } = require('@jest/globals');

const promise = (int) =>
  new Promise((res, rej) => {
    if (int > 5) rej('oops');
    res(int);
  });

const runAsync = async (promiseFn, cb) => {
  try {
    const result = await promiseFn();
    return { data: result };
  } catch (e) {
    return { err: e };
  } finally {
    if (cb) cb();
  }
};

test('runAsync', async () => {
  let callback = jest.fn();
  expect(await runAsync(() => promise(7), callback)).toEqual({ err: 'oops' });
  expect(await runAsync(() => promise(3), callback)).toEqual({ data: 3 });
  expect(await runAsync(() => promise(3))).toEqual({ data: 3 });
  expect(callback).toHaveBeenCalledTimes(2);
});
