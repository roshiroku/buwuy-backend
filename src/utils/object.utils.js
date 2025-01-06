export function pick(obj, ...props) {
  if (!obj) return obj;
  const res = {};
  props.forEach((name) => res[name] = obj[name]);
  return res;
}

export function omit(obj, ...props) {
  if (!obj) return obj;
  const res = {};
  const omit = new Set();

  props.forEach((name) => omit.add(name));

  for (const name in obj) {
    if (!omit.has(name)) {
      res[name] = obj[name];
    }
  }

  return res;
}
