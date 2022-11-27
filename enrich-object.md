# Enrich object

This scenario is very common in apps that interact with data from an API/backend service.

Let's say you get a `customers` list which looks like this:

```js
let customers = [
  { id: 1, name: 'john', age: 28, city: 'denver' },
  { id: 2, name: 'bob', age: 25, city: 'kyoto' },
  { id: 3, name: 'angela', age: 44, city: 'mumbai' },
];
```

And then you get, as an example, a `kycCustomer`:

```js
let kycCustomer = {
  customerId: 1,
  kyc: true,
  createdOn: '2022-11-01',
};
```

But when I want to use the `kycCustomer` to, say, show on the UI or use as input to another function, I have to also get the customer's name, age and city where `customerId` equals `1`, and "enrich" this `kycCustomer` object with that data.

To do this, I use an `enrich` function where I tell which keys to match, which keys to extract and the function returns an enriched list.

```js
const enrich =
  ({ match, extract = [], source = [] }) =>
  (inputObj) => {
    if (!match) return inputObj;
    if (!extract?.length) return inputObj;
    if (!source) return inputObj;
    if (!source?.length) return inputObj;
    let matchingItem = source.find(
      (s) => s[match.sourceKey] === inputObj[match.inputKey]
    );
    if (!matchingItem) return inputObj;
    return extract.reduce((acc, key) => {
      return {
        ...acc,
        [key]: matchingItem[key],
      };
    }, inputObj);
  };

// USAGE
let customers = [
  { id: 1, name: 'john', age: 28, city: 'denver' },
  { id: 2, name: 'bob', age: 25, city: 'kyoto' },
  { id: 3, name: 'angela', age: 44, city: 'mumbai' },
];

let kycCustomer = {
  customerId: 1,
  kyc: true,
  createdOn: '2022-11-01',
};

let result = enrich({
  match: { sourceKey: 'id', inputKey: 'customerId' },
  extract: ['name', 'age', 'city'],
  source: customers,
})(kycCustomer);

/*
result = {
  customerId: 1,
  kyc: true,
  createdOn: '2022-11-01',
  name: 'john',
  age: 28,
  city: 'denver'
}
*/
```

## Handling lists instead of objects

We handled a single object `kycCustomer` but what if we have to enrich an entire list/array of such objects?

```js
let kycCustomers = [
  { customerId: 1, kyc: true, createdOn: '2022-11-01' },
  { customerId: 2, kyc: false },
  { customerId: 3, kyc: true, createdOn: '2022-09-01' },
];
```

Simply mapping over and using the `enrich` function will solve this for us. Like so:

```js
let customers = [
  { id: 1, name: 'john', age: 28, city: 'denver' },
  { id: 2, name: 'bob', age: 25, city: 'kyoto' },
  { id: 3, name: 'angela', age: 44, city: 'mumbai' },
];

let kycCustomers = [
  { customerId: 1, kyc: true, createdOn: '2022-11-01' },
  { customerId: 2, kyc: false },
  { customerId: 3, kyc: true, createdOn: '2022-09-01' },
];

let enrichedKycCustomers = kycCustomers.map((kycCustomer) =>
  enrich({
    match: { sourceKey: 'id', inputKey: 'customerId' },
    extract: ['name', 'age', 'city'],
    source: customers,
  })(kycCustomer)
);

/*
enrichedKycCustomers = [
  {
    customerId: 1,
    kyc: true,
    createdOn: '2022-11-01',
    name: 'john',
    age: 28,
    city: 'denver',
  },
  { customerId: 2, kyc: false, name: 'bob', age: 25, city: 'kyoto' },
  {
    customerId: 3,
    kyc: true,
    createdOn: '2022-09-01',
    name: 'angela',
    age: 44,
    city: 'mumbai',
  },
]
*/
```

And in fact, because `enrich` is a higher-order function (notice how it takes one argument and returns a function that takes the inputObject argument), we can also condense the `enrichedKycCustomers` to this:

```js
let enrichedKycCustomers = kycCustomers.map(
  enrich({
    match: { sourceKey: 'id', inputKey: 'customerId' },
    extract: ['name', 'age', 'city'],
    source: customers,
  })
);
```
