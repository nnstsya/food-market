export function getEnumValue<T>(enumObj: { [key: string]: string }, value: string): string {
  if (!value) return '';

  const key = Object.keys(enumObj).find(k =>
    k === value.toUpperCase()
  );

  return key ? enumObj[key] : value;
}
