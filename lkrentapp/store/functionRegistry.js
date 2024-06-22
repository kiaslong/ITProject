// functionRegistry.js
const functionRegistry = {};

export const registerFunction = (key, fn) => {
  functionRegistry[key] = fn;
};

export const getFunction = (key) => functionRegistry[key];

export const unregisterFunction = (key) => {
  delete functionRegistry[key];
};
