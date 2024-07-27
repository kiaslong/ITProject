import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();
  const intervalId = useRef(null);

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Clear the interval
  const clear = () => {
    if (intervalId.current !== null) {
      clearInterval(intervalId.current);
      intervalId.current = null;
    }
  };

  // Set up the interval.
  useEffect(() => {
    clear(); // Clear any existing interval before setting a new one
    if (delay !== null) {
      intervalId.current = setInterval(() => {
        if (savedCallback.current) {
          savedCallback.current();
        }
      }, delay);
      return clear;
    }
  }, [delay]);

  // Clear interval on component unmount
  useEffect(() => {
    return clear;
  }, []);
}

export default useInterval;
