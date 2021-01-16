import { useEffect, useRef } from 'react';

export default function useFetch(props = {}) {
  const abortController = useRef(null);
  const mounted = useRef(true);

  const execute = async (url, options) => {
    let response;
    abortController.current = new AbortController();

    try {
      response = await fetch(url, {
        signal: abortController.current.signal,
        ...options
      });
    } catch (error) {
      return Promise.reject({
        error
      });
    }

    if (!response.ok) {
      return Promise.reject({
        response,
        error: new Error(`Request failed: ${response.status}`),
        mounted: mounted.current
      });
    }

    if (props.noJSON) {
      return Promise.resolve({
        response,
        mounted
      });
    }

    const json = await response.json();

    return Promise.resolve({
      response,
      json,
      mounted: mounted.current
    });
  }

  useEffect(() => {
    return () => {
      mounted.current = false;

      if (abortController.current) {
        abortController.current.abort();
      }
    }
  }, []);

  return { execute };
}
