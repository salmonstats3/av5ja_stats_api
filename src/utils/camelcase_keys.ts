import { camelCase, isObject, isArray, reduce, isDate } from "lodash";

export const camelcaseKeys = (obj: any) => {
  if (!isObject(obj)) {
    return obj;
  }
  if (isArray(obj)) {
    return obj.map((v) => camelcaseKeys(v));
  }
  if (isDate(obj)) {
    return obj;
  }
  return reduce(
    obj,
    (r, v, k) => {
      return {
        ...r,
        [camelCase(k)]: camelcaseKeys(v),
      };
    },
    {},
  );
};
