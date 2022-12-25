const { test, expect } = require('@jest/globals');

const switchCase = (...condPairs) => {
  if (!condPairs || !condPairs.length) {
    throw new Error(
      'No pair matched. Consider adding a `default` condition pair.'
    );
  }
  return (...args) => {
    let [cond, result] = condPairs[0];
    if (typeof cond === 'function' && cond(...args)) {
      return typeof result === 'function' ? result(...args) : result;
    } else if (typeof cond !== 'function' && cond) {
      return typeof result === 'function' ? result(...args) : result;
    } else {
      return switchCase(...condPairs.slice(1))(...args);
    }
  };
};

test('adv switch case', () => {
  let isEven = (a) => a % 2 === 0;
  let isOdd = (b) => b % 2 !== 0;
  expect(
    switchCase(
      [isEven, 'is even'],
      [isOdd, 'is odd'],
      [true, 'doesnt look like a number']
    )(2)
  ).toBe('is even');

  let isBeta = (str) => str === 'beta';
  expect(
    switchCase([isBeta, 'is beta!'], [true, 'is not a beta'])('alpha')
  ).toBe('is not a beta');

  let sumMoreThan3 = (a, b) => a + b > 3;
  let ifSumMoreThan3 = (a, b) => a * b;
  let sumLessThan3 = (a, b) => a + b < 3;
  let ifSumLessThan3 = (a, b) => a / b;
  let otherwise = (a, b) => `a: ${a}, b: ${b}`;

  expect(
    switchCase(
      [sumMoreThan3, ifSumMoreThan3],
      [sumLessThan3, ifSumLessThan3],
      [true, otherwise]
    )(1, 1)
  ).toEqual(1);

  expect(
    switchCase(
      [sumMoreThan3, ifSumMoreThan3],
      [sumLessThan3, ifSumLessThan3],
      [true, otherwise]
    )(3, 2)
  ).toEqual(6);

  expect(
    switchCase(
      [sumMoreThan3, ifSumMoreThan3],
      [sumLessThan3, ifSumLessThan3],
      [true, otherwise]
    )(1, 2)
  ).toEqual(`a: 1, b: 2`);

  expect(() =>
    switchCase([sumMoreThan3, ifSumMoreThan3], [sumLessThan3, ifSumLessThan3])(
      1,
      2
    )
  ).toThrowError();
});
