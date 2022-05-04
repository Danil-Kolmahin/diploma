export const timeout = async (ms: number) => {
  return new Promise((r) => setTimeout(r, ms));
};

export const isObject = (candidate: unknown) => {
  return typeof candidate === 'object' &&
    !Array.isArray(candidate) &&
    candidate !== null;
};

export const convertToHex = (str: string) => {
  let hex = '';
  for (let i = 0; i < str.length; i++)
    hex += str.charCodeAt(i).toString(16);
  return hex;
};

export const parseCookies = (cookies: string): { [key: string]: string } => {
  const keysValues = cookies
    .split('; ');
  const result: { [key: string]: string } = {};
  for (const keyValue of keysValues) {
    const [key, value] = keyValue.split('=');
    result[key] = value;
  }
  return result;
};

// todo refactor
export const checkFileType = (
  fileName: string, possibleFileTypes: string[], // .js .tsx
) => {
  const checkRegEx = new RegExp(
    `([.](${
      possibleFileTypes.map(
        (t: string) => t.slice(1),
      ).join('|')
    }))$`,
  );
  return checkRegEx.test(fileName);
};

export const strToBase16 = (str: string) => parseInt(str, 16).toString();

export const factorial = (n: number): number => n ? (n * factorial(n - 1)) : 1;

export const sum = (x: number, y: number) => x + y;

export const sleep = (ms: number) => new Promise(
  (resolve) => setTimeout(resolve, ms),
);

export const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};
