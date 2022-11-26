# Extracting keys from a list of objects

Most times when you get data from an external source (like a json file or an API response), you get a list of objects with a lot of keys in each of those objects.

But you might only want some keys in each object (eg for showing on the UI or using it in some data transform).

In those cases, you might end up writing a function that maps over the list and "extracts" certain keys only, while discarding others.

If this is a pattern, you could use this function:

```js
// A HELPER FUNCTION THAT WILL BE SUBSEQUENTLY USED
const getKeyVal = (key, obj) => {
  if (!obj) return undefined;
  if (obj.hasOwnProperty(key)) return obj[key];
  return undefined;
};

// THE ACTUAL FUNCTION TO USE
const extractKeys = (keys = [], list = []) => {
  return list.map((obj) => {
    if (!obj) return undefined;
    return Object.fromEntries(keys.map((key) => [key, getKeyVal(key, obj)]));
  });
};
```

## Example

Suppose you have data like this:

```js
const objs = [
  { id: 1, number: 33, place: { city: 'Ohio' }, color: 'red' },
  { id: 2, number: 21, place: { city: 'Tokyo' }, color: 'black' },
  { id: 3, number: 87, place: { city: 'Delhi' }, color: 'yellow' },
];
```

And you only want "id" and "place" keys from each object:

```js
const res1 = extractKeys(['id', 'place'], objs);
console.log(res1);
/*
[
  { id: 1, place: { city: 'Ohio' } },
  { id: 2, place: { city: 'Tokyo' } },
  { id: 3, place: { city: 'Delhi' } },
]
*/
```

For keys that are not in the original object, the function will return `undefined` (which is the same as excluding that key in the result)

Eg:

```js
const res3 = extractKeys(['id', 'name', 'city'], objs); // objects in objs do not have `name` or `city` as properties
console.log(res3);
/*
[
  { id: 1 },
  { id: 2 },
  { id: 3 },
]
*/
```
