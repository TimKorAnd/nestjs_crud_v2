export const isEmptyOrNull = function (obj: object) {
  if (obj === null) return true;
  return Object.getOwnPropertyNames(obj).length === 0;
};
