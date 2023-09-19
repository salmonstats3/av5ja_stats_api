import lodash from 'lodash';

export function deep_omit<T extends object, K extends keyof T>(object: T, paths: K[]): any {
  const omit = [];
  const clone = lodash.cloneDeepWith(object, (value, key, object, stack) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (!lodash.isUndefined(key) && paths.includes(key)) {
      omit.push({ from: stack.get(object), key });
      return null;
    }
  });
  omit.forEach(({ key, from }) => lodash.unset(from, key));
  return clone;
}
