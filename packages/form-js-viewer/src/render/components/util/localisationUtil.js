/**
 * Returns date format for the provided locale.
 * If the locale is not provided, uses the browser's locale.
 *
 * @param {string} [locale] - The locale to get date format for.
 * @returns {string} The date format for the locale.
 */
export function getLocaleDateFormat(locale = 'default') {
  const parts = new Intl.DateTimeFormat(locale).formatToParts(new Date(Date.UTC(2020, 5, 5)));
  return parts.map(part => {
    const len = part.value.length;
    switch (part.type) {
    case 'day': return 'd'.repeat(len);
    case 'month': return 'M'.repeat(len);
    case 'year': return 'y'.repeat(len);
    default: return part.value;
    }
  }).join('');
}

/**
 * Returns readable date format for the provided locale.
 * If the locale is not provided, uses the browser's locale.
 *
 * @param {string} [locale] - The locale to get readable date format for.
 * @returns {string} The readable date format for the locale.
 */
export function getLocaleReadableDateFormat(locale) {
  let format = getLocaleDateFormat(locale).toLowerCase();

  // Ensure month is in 'mm' format
  if (!format.includes('mm')) {
    format = format.replace('m', 'mm');
  }

  // Ensure day is in 'dd' format
  if (!format.includes('dd')) {
    format = format.replace('d', 'dd');
  }

  return format;
}

/**
 * Returns flatpickr config for the provided locale.
 * If the locale is not provided, uses the browser's locale.
 *
 * @param {string} [locale] - The locale to get flatpickr config for.
 * @returns {object} The flatpickr config for the locale.
 */
export function getLocaleDateFlatpickrConfig(locale) {
  return flatpickerizeDateFormat(getLocaleDateFormat(locale));
}

function flatpickerizeDateFormat(dateFormat) {

  const useLeadingZero = {
    day: dateFormat.includes('dd'),
    month: dateFormat.includes('MM'),
    year: dateFormat.includes('yyyy')
  };

  dateFormat = useLeadingZero.day ? dateFormat.replace('dd', 'd') : dateFormat.replace('d', 'j');
  dateFormat = useLeadingZero.month ? dateFormat.replace('MM', 'm') : dateFormat.replace('M', 'n');
  dateFormat = useLeadingZero.year ? dateFormat.replace('yyyy', 'Y') : dateFormat.replace('yy', 'y');

  return dateFormat;
}
