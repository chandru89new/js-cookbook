const { test, expect } = require('@jest/globals');

const customers = [
  {
    id: 1,
    name: 'john',
    age: 28,
    city: 'denver',
    contact: { email: 'john@doe.com' },
  },
  { id: 2, name: 'bob', age: 25, city: 'kyoto' },
  { id: 3, name: 'angela', age: 44, city: 'mumbai' },
];

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

test('enrich', () => {
  const input = { customerId: 1, kyc: false };
  expect(enrich({ extract: ['id'], source: customers })(input)).toEqual(input);
  expect(
    enrich({
      match: { sourceKey: 'id', inputKey: 'customerId' },
      source: customers,
    })(input)
  ).toEqual(input);
  expect(
    enrich({
      extract: ['id'],
      match: { sourceKey: 'id', inputKey: 'customerId' },
    })(input)
  ).toEqual(input);
  expect(
    enrich({
      match: 'id',
      extract: ['name', 'age'],
      source: customers,
    })(input)
  ).toEqual({
    customerId: 1,
    kyc: false,
    name: 'john',
    age: 28,
  });
  expect(
    enrich({
      match: 'id',
      extract: ['name', 'contact'],
      source: customers,
    })(input)
  ).toEqual({
    customerId: 1,
    kyc: false,
    name: 'john',
    contact: {
      email: 'john@doe.com',
    },
  });
  expect(
    enrich({
      match: 'id',
      extract: ['name', 'location'],
      source: customers,
    })(input)
  ).toEqual({
    customerId: 1,
    kyc: false,
    name: 'john',
  });

  let customers2 = [
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
    source: customers2,
  })(kycCustomer);

  expect(result).toEqual({
    customerId: 1,
    kyc: true,
    createdOn: '2022-11-01',
    name: 'john',
    age: 28,
    city: 'denver',
  });
});

test('enrich2', () => {
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

  expect(enrichedKycCustomers).toEqual([
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
  ]);
});

test('enrich3', () => {
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

  let enrichedKycCustomers = kycCustomers.map(
    enrich({
      match: { sourceKey: 'id', inputKey: 'customerId' },
      extract: ['name', 'age', 'city'],
      source: customers,
    })
  );

  expect(enrichedKycCustomers).toEqual([
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
  ]);
});
