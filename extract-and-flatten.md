# Extract and flatten an object

Many times, I've found myself wanting to extract only some keys from an object and also flatten it.

As an example, here's a person's details:

```js
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
```

And here's what I want to convert it into:

```js
const newObj = {
  id: 1,
  name: 'john',
  email: 'john@doe.com',
  age: 28,
  location: 'denver',
};
```

So basically there's a bit of "extraction" involved (like, `location` in the new object maps to `obj.city` and `email` maps to `obj.details.contact.email`).

To do this, I use a custom transform function (note that the first two functions `getKeyVal` and `pluck` are helper functions):

```js
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
```

And here's how I'd use the `transform` function:

```js
// the actual input object
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

// the "definition" which is like a map or instruction
const definition = {
  name: 'name',
  age: 'details.age',
  email: 'details.contact.email',
  id: 'id',
  location: 'city',
};

// finally, apply the transformer
const result = transform(definition)(obj);
console.log(result);
/*
{
  id: 1,
  name: 'john',
  email: 'john@doe.com',
  age: 28,
  location: 'denver',
}
*/
```

What if in the `definition`, you had a wrong mapping?

```js
const definition = {
  name: 'name',
  age: 'details.age',
  email: 'details.contact.email',
  id: 'id',
  location: 'city',
  job: 'details.job', // wrong mapping. there is no `details.job` in the input object
};
```

This will not error out but simply return `undefined` for the `job` key.
