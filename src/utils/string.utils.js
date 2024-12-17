export function slugify(str) {
  let slug = '';
  for (const c of str) {
    if (c === ' ' || c === '_' || c === '-') {
      if (slug[slug.length - 1] !== '-') {
        slug += '-';
      }
    } else if (c >= 'A' && c <= 'Z') {
      slug += c.toLowerCase();
    } else {
      slug += c.replace(/[\W]/g, '');
    }
  }
  return slug;
}

export function ucFirst(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

export function capitalize(str) {
  return str ? str.split(' ').map(ucFirst).join(' ') : '';
}
