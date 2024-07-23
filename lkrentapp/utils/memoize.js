// src/utils/memoize.js
export const memoize = (fn) => {
    let lastArgs = null;
    let lastResult = null;
  
    return (...args) => {
      if (lastArgs && args.length === lastArgs.length && args.every((arg, index) => arg === lastArgs[index])) {
        return lastResult;
      }
      lastArgs = args;
      lastResult = fn(...args);
      return lastResult;
    };
  };
  