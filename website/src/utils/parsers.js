/**
 * Parses a string into an integer,
 * or null if the string is invalid.
 *
 * @param {any} str String to be parsed.
 * @returns A parsed integer or null.
 */
export function stringToInt(str) {
  let res = parseInt(str);
  res = isNaN(res) ? null : res;
  return res;
}
