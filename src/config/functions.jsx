export const FUNCTION_LIBRARY = {
  randomInt: (min, max) => (Math.floor(Math.random() * (max - min + 1)) + min),
  randomBinaryChoice: (probability, a, b) => (Math.random() > probability) ? a : b,
  randomChoice: (options) => {
      const r = Math.floor(Math.random() * options.length);
      return options[r];
  },
  formatAmountWithUnits: (amount, singularUnit, pluralUnit) => {
    return `${amount} ${amount === 1 ? singularUnit : pluralUnit}`;
  }
};