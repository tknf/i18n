const OBJECT_NOTATION_MATCHER = /\[(.*?)\]|(\w+)/g;

export function get<T>(obj: { [key: string]: any } | undefined, keypath: string | string[], defaultValue?: T): T | any {
  if (obj == null) return undefined;

  if (typeof keypath === "string" && obj[keypath]) {
    return obj[keypath];
  }

  const keys = Array.isArray(keypath) ? keypath : getKeypath(keypath);
  let acc = obj;
  // eslint-disable-next-line @typescript-eslint/prefer-for-of
  for (let i = 0; i < keys.length; i++) {
    const val = acc[keys[i]];
    if (val === undefined) return defaultValue;
    acc = val;
  }

  return acc;
}

function getKeypath(str: string) {
  const path: string[] = [];
  let result: RegExpExecArray | null;
  while ((result = OBJECT_NOTATION_MATCHER.exec(str))) {
    const [, first, second] = result;
    path.push(first || second);
  }

  return path;
}

// Unfortunately, this is how we have to type this at the moment.
// There is currently a proposal to support variadic kinds.
// https://github.com/Microsoft/TypeScript/issues/5453
export function merge<TSource1, TSource2>(source1: TSource1, source2: TSource2): TSource1 & TSource2;
export function merge<TSource1, TSource2, TSource3>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3
): TSource1 & TSource2 & TSource3;
export function merge<TSource1, TSource2, TSource3, TSource4>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4
): TSource1 & TSource2 & TSource3 & TSource4;
export function merge<TSource1, TSource2, TSource3, TSource4, TSource5>(
  source1: TSource1,
  source2: TSource2,
  source3: TSource3,
  source4: TSource4,
  source5: TSource5
): TSource1 & TSource2 & TSource3 & TSource4 & TSource5;
export function merge<TResult>(...objs: any[]): TResult;
export function merge<TSource1, TSource2, TSource3, TSource4, TSource5>(
  ...objs: (TSource1 | TSource2 | TSource3 | TSource4 | TSource5)[]
) {
  let final = {};

  for (const obj of objs) {
    final = mergeRecursively(final, obj);
  }

  return final;
}

interface GeneralObject {
  [key: string]: any;
}

function mergeRecursively(inputObjA: GeneralObject, objB: GeneralObject) {
  const objA: GeneralObject = Array.isArray(inputObjA) ? [...inputObjA] : { ...inputObjA };
  for (const key in objB) {
    if (!Object.prototype.hasOwnProperty.call(objB, key)) {
      continue;
    } else if (isMergeableValue(objB[key]) && isMergeableValue(objA[key])) {
      objA[key] = mergeRecursively(objA[key], objB[key]);
    } else {
      objA[key] = objB[key];
    }
  }

  return objA;
}

function isMergeableValue(value: any) {
  return value !== null && typeof value === "object";
}
