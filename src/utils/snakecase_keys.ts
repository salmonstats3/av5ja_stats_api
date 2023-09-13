import { snakeCase, isObject, isArray, reduce, isDate } from "lodash";

export const snakecaseKeys = (obj: any) => {
  if (!isObject(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return obj.map((v) => snakecaseKeys(v));
  }
  if (isDate(obj)) {
    return obj;
  }
  return reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [snakeCase(k)]: snakecaseKeys(v),
      };
    },
    {},
  );
};
