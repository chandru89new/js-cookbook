const { test, expect } = require('@jest/globals');

const tryCatch = (tryExpression) => {
  try {
    const res = tryExpression();
    return { data: res, err: undefined };
  } catch (e) {
    return { err: e, data: undefined };
  }
};

const testFn = (int) => {
  if (int > 5) {
    throw new Error('oops');
  }
  return int;
};

test('tryCatch', () => {
  expect(tryCatch(() => testFn(4))).toEqual({ data: 4 });
  expect(tryCatch(() => testFn(10))).toEqual({ err: new Error('oops') });
});
