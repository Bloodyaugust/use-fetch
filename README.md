# @bloodyaugust/use-fetch

A simple, *safe* fetch custom hook for React. Why safe? There's a good chance you've seen this before:

```
Warning: Can’t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
```

This hook helps you avoid mutating state on components that are `unmounted` by providing you with the `mounted` state of the hook, and aborts in-flight requests on `unmount`.

## Features

- *Safe*: gives you the tools to avoid mutating state on `unmounted` components.
- Simple: Just a hook! No `Context`s were harmed (or used) in the source of this library.
- Flexible: you get the `response`, the `json`, and of course the `mounted` state.
- Configurable: turn off automatic `json` parsing for those one-off cases.
- Provides a convenient `Promise`-based API.
- Aborts in-flight requests automatically if `unmounted`.
- Rejects `Promise` if the `response` indicates failure.
- No dependencies aside from `React`.

## Install

```bash
npm install @bloodyaugust/use-fetch
# or, if using yarn
yarn add @bloodyaugust/use-fetch
```

## Usage

This example demonstrates how you might get some todos with `useFetch` while being sure you don't mutate state after your component is `unmounted`.
```jsx
import React, { useEffect, useState } from 'react';
import useFetch from '@bloodyaugust/use-fetch';

function TodoList() {
  const { execute } = useFetch();
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const getTodos = async () => {
      await execute('https://jsonplaceholder.typicode.com/todos/')
        .then(({ json, mounted }) => {
          if (mounted) {
            setTodos(json);
          }
        });
    };

    getTodos();
  }, []);

  return (
    <div>
      {todos.map((todo) => {
        <span key={todo.id}>{todo.title}</span>
      })}
    </div>
  );
}
```

## API

### Props

```jsx
useFetch({
  noJSON: bool // Set true if you want to skip JSON parsing (no json key will be provided to the promise chain)
})
```

### Execute

`execute` is the only object returned by the hook. It provides as consistent an API as it can, but there are some slight differences depending on if the request is successful, aborted, or failed for some other reason.

Parameters are the same as [fetch](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch).

#### success

```jsx
useFetch('https://jsonplaceholder.typicode.com/todos/')
  .then({
    response, // The fetch Response object
    json, // The result of response.json() (not present if the noJSON prop was set)
    mounted // The mounted state of the hook
  } => {})
```

#### error with fetch (includes abort)

```jsx
useFetch('https://jsonplaceholder.typicode.com/todos/')
  .catch({
    error // The Error object thrown by fetch
  } => {})
```

#### response indicates failure (!response.ok)

```jsx
useFetch('https://jsonplaceholder.typicode.com/todos/')
  .catch({
    response,
    error, // new Error(`Request failed: ${response.status}`)
    mounted
  } => {})
```
