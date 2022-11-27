const { test, expect } = require('@jest/globals');

const getKeyVal = (key) => (obj) => {
  if (!obj || !key) return undefined;
  if (!obj.hasOwnProperty(key)) return undefined;
  return obj[key];
};

const pluck = (path) => (object) => {
  if (!path) return null;
  const keys = path.split('.').length ? path.split('.') : [path];
  return keys.reduce((acc, nextKey) => getKeyVal(nextKey)(acc), object);
};

const transform = (definition) => (inputObject) => {
  return Object.fromEntries(
    Object.keys(definition).map((key) => [
      key,
      typeof definition[key] === 'string'
        ? pluck(definition[key])(inputObject)
        : transform(definition[key])(inputObject),
    ])
  );
};

test('extract and flatten', () => {
  const def = {
    name: 'name',
    age: 'details.age',
    email: 'details.contact.email',
    id: 'id',
    location: 'city',
    job: 'details.job',
  };
  const obj = {
    id: 1,
    name: 'john',
    city: 'denver',
    job: 'engineer',
    details: {
      age: 28,
      contact: {
        phone: '789787',
        email: 'john@doe.com',
      },
    },
  };

  expect(transform(def)(obj)).toEqual({
    id: 1,
    name: 'john',
    email: 'john@doe.com',
    age: 28,
    location: 'denver',
  });
});
