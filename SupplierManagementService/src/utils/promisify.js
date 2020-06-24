/**
 * Utility function that wraps a callback function into a Promise.
 * @template R
 * @param { (cb: (err?: Error) => void) => R } func
 * @returns { Promise<R> }
 */
export default function promisify(func) {
  return new Promise((resolve, reject) => {
    const returnValue = func((err) => {
      if (err) reject(err);
      else resolve(returnValue);
    });
  });
}
