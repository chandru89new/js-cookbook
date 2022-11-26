# Try-Catch made simpler

A lot of native functions and library functions can and do "throw" an error. So one ends up writing a bunch of `try.. catch` (or forgetting to do so, ending up in ugly runtime errors).

That's a lot of boilerplate to write. Instead, I borrowed a style popularized by the likes of Golang (`if err != nil`) and Haskell (`Either type`) to handle functions that could potentially throw exceptions/errors.

```js
const tryCatch = (tryExpression) => {
  try {
    const res = tryExpression();
    return { data: res, err: undefined };
  } catch (e) {
    return { err: e, data: undefined };
  }
};
```

`tryCatch` takes a function expression that could potentially throw and returns a safe value (even if the function threw an error).

If the function passed to `tryCatch` succeeds, then the return is `{data: Data}` (where `Data` is whatever was the return value of the `tryExpression`.) Otherwise, where it throws, the return value will be `{ err: Error }` where `Error` is the exception thrown by the function.

## Example

Suppose you have this function:

```js
const testFn = (int) => {
  if (int > 5) {
    throw new Error('oops');
  }
  return int;
};
```

`testFn` throws an error if the input is greater than 5. Otherwise it returns the input as-is.

With `tryCatch`, you can wrap this so that it will never throw, but instead, return an error "safely".

```js
const { data, err } = tryCatch(() => testFn(7)); // notice how we wrap `testFn(7)` as an arrow function / lamda
if (err) console.log('Error:', err.toString());
else console.log('Success!', data);
```
