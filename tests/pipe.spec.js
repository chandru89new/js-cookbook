const { test, expect } = require('@jest/globals');

const safeWrapper = (func, value) => {
  if (value.err) {
    return { err: value.err };
  }
  if (value.data) {
    try {
      let res = func(value.data);
      return { data: res };
    } catch (e) {
      return { err: e };
    }
  }
};
const pipe =
  (...fns) =>
  (initialInput) => {
    return fns.reduce(
      (acc, fn) => {
        return safeWrapper(fn, acc);
      },
      { data: initialInput }
    );
  };

test('pipe', () => {
  let inc1 = (a) => a + 1;
  let double = (a) => a * 2;
  let square = (a) => a * a;
  let root = Math.sqrt;
  let halve = (a) => a / 2;
  let dec1 = (a) => a - 1;
  expect(pipe(inc1, double, square, root, halve, dec1)(2)).toEqual({ data: 2 });
});
test('pipe with error', () => {
  let err = new Error('error when squaring');
  let inc1 = (a) => a + 1;
  let double = (a) => a * 2;
  let square = (a) => {
    throw err;
  };
  let root = Math.sqrt;
  let halve = (a) => a / 2;
  let dec1 = (a) => a - 1;
  expect(pipe(inc1, double, square, root, halve, dec1)(2)).toEqual({ err });
});
