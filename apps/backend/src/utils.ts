export function formatToString(value: any) {
  if (Array.isArray(value) || typeof value === "object") {
    return JSON.stringify(value);
  } else if (typeof value === 'number') {
    return value.toString();
  }
  return value;
}

export const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;