# Parallel promises made simple

`Promise.all` and `Promise.allSettled` have made it easy to run promises parallelly. However, the data returned by `Promise.allSettled` (which is what I often end up having to use because `Promise.all` fails at the first promise that rejects/fails) is slightly cumbersome to deal with.

Instead, I use a recipe where it becomes easy for me to run parallel promise functions and handle the data far more easily.

Before I show the recipe, here's how the usage looks like:

```js
// let's say we have these functions that return a promise
const getUsers = () => axios.get('/users');
const getTeams = () => axios.get('/teams');
const getPlans = () => axios.get('/plans');
const setConfig = () => axios.post('/config', { data: config }); // config comes from somewhere

// now, we have to run these on app-load
const results = await runPromises({
  users: getUsers,
  teams: getTeams,
  plans: getPlans,
  config: setConfig,
});
// runPromises is the recipe.

// and then `results` will look like this:
// results == {
//   users: { data: [...] }, // or { error: AxiosError }
//   teams: { data: [...] }, // or { error: AxiosError }
//   plans: { data: [...] }, // or { error: AxiosError }
//   config: { data: {...} }, // or { error: AxiosError }
// }
```

The object-based approach is not as great as a list but you can see the benefit - no need to deal with `status` and `value` and `reason` for each. Instead, each key in your object (which maps to a function) will have a resolved value object that either contains the `data` key or the `error` key.

Here's the recipe to use:

```js
const runPromises = async (promises) => {
  let plist = Object.entries(promises).map(async ([name, promise]) => {
    let res;
    try {
      res = { data: await promise() };
    } catch (e) {
      res = { error: e };
    }
    return [name, res];
  });
  let intermediateResult = [];
  for (let p of plist) {
    await intermediateResult.push(await p);
  }
  return Object.fromEntries(intermediateResult);
};
```

Briefly, what we do is convert the object into a `[key, value]` pair list, then run each promise (but because this is a `map`, it is run parallelly), and finally collect these promises into another `[key, value]` pair list and return that as an object.
