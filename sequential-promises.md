# Safe, simple, sequential promises

Whenever you need to run a "sequence" of promises one after the other – because, say, you need the output of one promise to be fed into the next promise – things will get a little tricky.

The bad way of doing it would be to chain them.

```js
promise1()
  .then(result1 => {
    promise2(result1)
      .then(result2 => {
        promise3(result2)
          .then(result3 => {
            ...
          })
          .catch(...)
      })
      .catch(...)
  })
  .catch(...)
```

A better way would be to use the `async/await` syntactic sugar:

```js
try {
  const result1 = await promise1()
  const result2 = await promise2(result1)
  const result3 = await promise3(result2)
  ...
  return resultFinal
} catch (e) {
  // do something with error e
}
```

And that's not too bad if you had just 2-3 promises, which I guess would be typical use-case.

However, we could combine the ideas from [pipe](./pipe-through-exception-funcs.md) and [safer promises](./promise-made-simpler.md) to build an asynchronous variation of a `pipe`.

```js
const runAsyncHelper = async (fn, input) => {
  if (input.err) return { err: input.err };
  try {
    const res = { data: await fn(input.data) };
    return res;
  } catch (err) {
    return { err };
  }
};

const pipePromises =
  (...fns) =>
  async (init) => {
    return fns.reduce(
      async (acc, fn) => {
        return await runAsyncHelper(fn, await acc);
      },
      { data: init }
    );
  };
```

The idea is simple.

- You take a bunch of promise functions
- Pass { data: initialInput } to the first promise but wrap it in an `runAsyncHelper` function which simply runs the promise, awaits the result and returns either `{ data: result }` or `{ err: Error }`
- and then pass that data to the next promise in the list
- and so on till the final promise is resolved

The key difference is that we `await` a lot.

## Example

Let's say we have 3 promises to run sequentially:

```js
const p1 = (int) => Promise.resolve(int);
const p2 = (int) => Promise.resolve(int + 1);
const p3 = (int) => Promise.resolve(int * 2);
```

We can now run them sequentially like so:

```js
const result = await pipePromises(p1, p2, p3)(10); // result = { data: 22 }
```

What if one of the promises actually failed?

```js
const p1 = (int) => Promise.resolve(int);
const p2 = (int) => Promise.resolve(int + 1);
const p3 = (_) => Promise.reject(new Error('Uh oh'));
const p4 = (int) => Promise.resolve(int * 2);

const result = await pipePromises(p1, p2, p3, p4)(10); // result = { err: new Error("Uh oh") }
```

A failed promise is like a short-circuit. The first promise to fail will be returned as the result of the pipe.
