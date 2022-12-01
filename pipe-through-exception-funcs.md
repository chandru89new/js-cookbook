# Piping through functions that can throw an exception

I love the pipe function. It's insanely useful in function composition and data transformation workflows where you send data through a long list of functions.

I wont go into the details and intricacies of the pipe function but the gist is best described with this example:

Suppose you want to do all these steps in sequence:

- take a number
- add 1 to the result
- then double that result
- then square the result of doubling
- then find the square-root of the previous result
- then halve it
- and finally decrement it

The example is trite (and you end up with the same number) but if you had a simple pipe function, you could write it like so:

```js
//              the input number
const doSteps = (number) =>
  pipe(
    // assume that all these named functions are defined somewhere
    inc1, // a => a + 1
    double, // a => a * 2
    square, // a => a * a
    root, // basically Math.sqrt
    halve, // a => a / 2
    dec1 // a => a - 1
  )(number);

doSteps(2); // 2
```

However, real-life scenarios are hardly as ideal or simple.

You deal with functions that could potentially throw an error and that kind of throws a spanner in the works. Unless you are okay with your pipe composition to throw (because one of the functions in the pipe did), it's not very neat. And I don't like runtime exceptions in my app so I use this handy-little exception-free `pipe`.

```js
const safeWrapper = (func, value) => {
  if (value.err) {
    return { err: value.err };
  }
  if (value.data) {
    try {
      let res = func(value.data);
      return { data: res };
    } catch (e) {
      return { err: e };
    }
  }
};
const pipe =
  (...fns) =>
  (initialInput) => {
    return fns.reduce(
      (acc, fn) => {
        return safeWrapper(fn, acc);
      },
      { data: initialInput }
    );
  };
```

What's happening here is that I'm not calling the functions in the pipe and using their results directly. Instead, I'm wrapping them – sort of like a Faraday's box – so that if the functions throw an error, they are _contained_.

A small change here is that the final output is of the form:

```ts
{ data: any | undefined, err: Err | undefined}
```

As an example:

```js
let inc1 = (a) => a + 1;
let double = (a) => a * 2;
let square = (a) => a * a;
let root = Math.sqrt;
let halve = (a) => a / 2;
let dec1 = (a) => a - 1;
pipe(inc1, double, square, root, halve, dec1)(2); // { data: 2 };
```

But if one or any of the functions throw:

```js
let err = new Error('error when squaring');
let inc1 = (a) => a + 1;
let double = (a) => a * 2;
let square = (a) => {
  throw err; // instead of doing the job, we throw an error
};
let root = Math.sqrt;
let halve = (a) => a / 2;
let dec1 = (a) => a - 1;
pipe(inc1, double, square, root, halve, dec1)(2); // { err: Error('error when squaring') };
```

The first function to throw will (kind of) "short-circuit" the whole operation and that will be the error returned.
