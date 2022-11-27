# Make it faster to access more info about an `id`

A repeating thing we do with a large list is try and `find` a particular item.

For instance, you get a `customers` list from an API and at various points, you try and extract one particular customer:

```js
let customers = [
  { id: 'asdf', name: 'john', age: 28, city: 'denver' },
  { id: 'lkjh', name: 'bob', age: 25, city: 'kyoto' },
  { id: 'qwer', name: 'angela', age: 44, city: 'mumbai' },
];

let customerIdToFind = 'asdf';

const result = customers.find((cust) => cust.id === customerIdToFind);
// { id: 'asdf', name: 'john', age: 28, city: 'denver' }
```

There are times when I do this a lot across the app. So instead of trying to `find` by iterating over a list, I convert the `customers` list into an object where the key is the `id` and the value is the customer object.

```js
const convertToObject = ({ key, list = [] }) => {
  if (!list || !list.length || !key) return undefined;
  const kvals = list.map((item) => item[key]).filter((v) => v !== undefined);
  return Object.fromEntries(
    kvals.map((kval) => [kval, list.find((item) => item[key] === kval)])
  );
};

let customers = [
  { id: 'asdf', name: 'john', age: 28, city: 'denver' },
  { id: 'lkjh', name: 'bob', age: 25, city: 'kyoto' },
  { id: 'qwer', name: 'angela', age: 44, city: 'mumbai' },
];

let customersAsObject = convertToObject({
  key: 'id',
  list: customers,
});

/* 
customersAsObject = {
  'asdf': { id: 'asdf', name: 'john', age: 28, city: 'denver' },
  'lkjh': { id: 'lkjh', name: 'bob', age: 25, city: 'kyoto' },
  'qwer': { id: 'qwer', name: 'angela', age: 44, city: 'mumbai' },
}
*/
```

This makes it easy to "access" a particular customer at O(1) time instead of O(N) time.

```js
let customers = [
  { id: 'asdf', name: 'john', age: 28, city: 'denver' },
  { id: 'lkjh', name: 'bob', age: 25, city: 'kyoto' },
  { id: 'qwer', name: 'angela', age: 44, city: 'mumbai' },
];

let customersAsObject = convertToObject({
  key: 'id',
  list: customers,
});

let customerIdToFind = 'asdf';

const result = customersAsObject[customerIdToFind];
// { id: 'asdf', name: 'john', age: 28, city: 'denver' }
```

Typically, I convert the `customers` list right at the time of getting the data from the API (or any other service) and pass the object around across the app.
