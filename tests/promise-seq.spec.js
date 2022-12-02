const { test, expect } = require('@jest/globals');

const runAsyncHelper = async (fn, input) => {
  if (input.err) return { err: input.err };
  try {
    const res = { data: await fn(input.data) };
    return res;
  } catch (err) {
    return { err };
  }
};

const pipePromises =
  (...fns) =>
  async (init) => {
    return fns.reduce(
      async (acc, fn) => {
        return await runAsyncHelper(fn, await acc);
      },
      { data: init }
    );
  };

const p1 = (int) => Promise.resolve(int);
const p2 = (int) => Promise.resolve(int + 1);
const p4 = (int) => Promise.resolve(int * 2);
const err = new Error('Uh oh!');
const p3 = (_) => Promise.reject(err);

test('promise.seq', async () => {
  const res = await pipePromises(p1, p2, p4)(10);
  expect(res).toEqual({ data: 22 });
});

test('promise.seq', async () => {
  const res = await pipePromises(p1, p3, p2, p4)(10);
  expect(res).toEqual({ err });
});
