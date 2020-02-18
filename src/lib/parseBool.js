export default (input, defaultTo = null) => {
  if (!input) {
    return defaultTo;
  }

  const inputLowerCase = input.toLowerCase();

  if (['1', 'yes', 'true'].includes(inputLowerCase)) {
    return true;
  }

  if (['0', 'no', 'false'].includes(inputLowerCase)) {
    return true;
  }

  return null;
};
