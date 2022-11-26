# Promise.then.catch.finally made simpler

We deal with a lot of `promise`-based functions these days and a lot of times, we repeat this kind of code in our programs:

```js
somePromise()
  .then((result) => {
    // do something with the result
  })
  .catch((err) => {
    // do something with the error
  })
  .finally(() => {
    // do something after the promise is resolved/rejected
    // like clearing up some loading state etc.
  });
```

The cascading-style makes code look ugly (subjective, yes) and also kind of unreadable in real-world use-cases where there's a large chunk of code between `then` and `catch`.

We can use a similar pattern as the one in [try-catch made simpler](./try-catch-made-simpler.md) to make handling promises easy and neat.

```js
const runAsync = async (promiseFn, cb) => {
  try {
    const result = await promiseFn();
    return { data: result };
  } catch (e) {
    return { err: e };
  } finally {
    if (cb) cb();
  }
};
```

The basic idea is that you pass a promise function `promiseFn` and (optionally) a callback `cb` and `runAsync` takes care of running the promise, return either data or error and also running the callback function.

If the promise resolves (ie, success), the return value from `runAsync` is `Promise<{ data: resolvedValue }>`, and if it rejects (ie, fails), the return value is `Promise<{ err: rejectedValue }>`.

## Example

Here's a promise that could either resolve or reject:

```js
const promise = (int) =>
  new Promise((res, rej) => {
    if (int > 5) rej('oops');
    res(int);
  });
```

Here's how we'd use `runAsync` to handle this:

```js
// let's say we also want to set loading state while the promise runs
let loading = true;
const { data, err } = await runAsync(
  // the promise function to call
  () => promise(10),
  // and the callback to call finally
  () => {
    loading = false;
  }
);
// if we ran the above function, we'll get:
// err = 'oops'
// data = undefined
// and loading will be set to false
```
