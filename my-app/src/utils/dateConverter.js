/**
 * Converts date to local format
 * 
 * @param {Date || String} date
 * @returns {String} formattedDate
 */
export function convertDateToLocalFormat(date) {
  const convertedDate = new Date(date);
  let offset = convertedDate.getTimezoneOffset() * 60 * 1000;
  let adjustedDate = new Date(convertedDate.getTime() - offset);
  let formattedDate = adjustedDate.toISOString().split("T")[0];
  return formattedDate;
}
/**
 * Converts date from HST to UTC.
 *
 * @param   {Date || String} date   Date to convert.
 * @returns {Date}                  UTC date.
 */
export function convertLocalDateToUTC(date) {
  if (typeof date === 'string') date = new Date(date);
  return new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
}

/**
 * Converts a Date object or String into a readable date/time String.
 *
 * @param   {Date || String} date   Date to convert.
 * @returns {String}                Date in format "MON DD, YYYY HH:MM AM/PM".
 */
export function prettyHstDateTime(date) {
  if (typeof date === 'string') date = new Date(date);
  const options = { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }
  return date.toLocaleString("en-US", options);
}

/**
 * Converts a Date object or String into a readable date String.
 *
 * @param   {Date || String} date   Date to convert.
 * @returns {String}                Date in format "MON DD, YYYY".
 */
export function prettyHstDate(date) {
  if (typeof date === 'string') date = new Date(date);
  const options = { month: 'short', day: 'numeric', year: 'numeric' }
  return date.toLocaleString("en-US", options);
}