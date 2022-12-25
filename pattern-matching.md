# Advanced switch-case / pattern-matching

Sometimes, we end up having to deal with somewhat complex scenarios where a simple switch-case wont be enough.

Let's say you receive a value (from an API call or something) and this value could be `null` or a singleton array (eg., `[someObject]`) or an array of arbitrary number of items. Your job is to throw an error if the value is null, extract a specific key-value and process it through a function if it's a singleton array or return a reduced value if the value is an array of length greater than 1.

To make it grokkable, here's the process flow:

- if value === null, throw an error
- if value is a singleton array, extract a specific key-value and process it through some function
- if value is array of more items, run it through a reducer to extract some value.

How would we do that using a switch case?

```js
switch (value) {
  case null:
    throw new Error('value cannot be null');
  case value.length === 1:
    return processFunction(value[0]?.key);
  case value.length > 1:
    return reducer(value);
  default:
    throw new Error('unprocessable value');
}
```

The problem is that the above code does not work. `case` statements match the value with the input so you can't have some expression in `case`.

That's where some advanced switch-case statements come handy. The inspiration for this comes from pattern-matching ideas in other languages, and libraries like `lodash` and `ramda` which have the `cond` function (which in itself is inspired from Lisp).

```js
const switchCase = (...condPairs) => {
  if (!condPairs || !condPairs.length) {
    throw new Error(
      'No pair matched. Consider adding a `default` condition pair.'
    );
  }
  return (...args) => {
    let [cond, result] = condPairs[0];
    if (typeof cond === 'function' && cond(...args)) {
      return typeof result === 'function' ? result(...args) : result;
    } else if (typeof cond !== 'function' && cond) {
      return typeof result === 'function' ? result(...args) : result;
    } else {
      return switchCase(...condPairs.slice(1))(...args);
    }
  };
};
```

The utility function above looks a handful but it's really simple in its logic:

- `switchCase` takes arrays of condition-result pairs like this:

```js
// assume isNull, throwError, isSingleton, processData, isArray, reduceData are all functions already defined
let sc = switchCase(
  [isNull, throwError],
  [isSingleton, processData],
  [isArray, reduceData],
  [true, () => throw new Error('unprocessable entity')]
);

// and now you use it like this:
const result = sc([someObject]);
```

- next, when you call it with some arguments, it takes it and runs it through the first element of each pair. If the result of that function is true, it will run the corresponding second element.

So in the example above, it will take the `[someObject]` and pass it through `isNull` function (because `isNull` is a function). If the result of that is true, then it will run the `throwError` function and pass `[someObject]` as the argument to the function.

If not, then it takes the next pair (`[isSingleton, processData]`) and sends the argument (`[someObject]`) through `isSingleton`. If the result is true, then the value is passed through `processData` and the result is returned.

And it goes on till it reaches the final pair `[true, throw...]`. Notice how the final pair has just `true` as the first element: the switchCase function figures that this is not a function but a value, so it won't try to run it like a function but just check if the value is true. Yes it is, and therefore it runs the function associated with this pair (the `() => throw...`).

I've written the `switchCase` function in a way where it can work with both functions and values. If it's a function, it is going to run the function passing the arguments provided by you. If not, it just checks if the value is true. And if the result part of the pair (ie, second element) is a value, it simply returns the value.

And finally, just as a `switch-case` is incomplete without a `default:` clause, you need to ensure you have a default case (typically the last one, with `[true, ...]`). If you don't end up having that, the function will throw an error saying you don't have a default clause.
