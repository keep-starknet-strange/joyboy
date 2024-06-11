export type ElapsedTime = {
  value: number;
  unit: 'just_now' | 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months' | 'years';
};

/**
 * Calculates the elapsed time between a timestamp and the current time.
 * @param {number} timestamp The timestamp to calculate the elapsed time from.
 * @param {number} currentTimestamp The current timestamp. Defaults to Date.now().
 * @returns {ElapsedTime} The elapsed time.
 */
export const getElapsedFromTimestamp = (
  timestamp: number,
  currentTimestamp = Date.now(),
): ElapsedTime => {
  const elapsed = Math.floor((currentTimestamp - timestamp) / 1000);

  if (elapsed < 10) {
    return {value: 0, unit: 'just_now'};
  }

  if (elapsed < 60) {
    return {value: elapsed, unit: 'seconds'};
  }

  const minutes = Math.floor(elapsed / 60);
  if (minutes < 60) {
    return {value: minutes, unit: 'minutes'};
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return {value: hours, unit: 'hours'};
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return {value: days, unit: 'days'};
  }

  if (days < 31) {
    return {value: Math.floor(days / 7), unit: 'weeks'};
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return {value: months, unit: 'months'};
  }

  return {value: Math.floor(months / 12), unit: 'years'};
};

export const getElapsedTimeStringFull = (
  timestamp: number,
  currentTimestamp = Date.now(),
): string => {
  const elapsed = getElapsedFromTimestamp(timestamp, currentTimestamp);

  switch (elapsed.unit) {
    case 'just_now':
      return 'just now';

    case 'seconds':
      return `${elapsed.value} second${elapsed.value > 1 ? 's' : ''} ago`;

    case 'minutes':
      return `${elapsed.value} minute${elapsed.value > 1 ? 's' : ''} ago`;

    case 'hours':
      return `${elapsed.value} hour${elapsed.value > 1 ? 's' : ''} ago`;

    case 'days':
      return `${elapsed.value} day${elapsed.value > 1 ? 's' : ''} ago`;

    case 'weeks':
      return `${elapsed.value} week${elapsed.value > 1 ? 's' : ''} ago`;

    case 'months':
      return `${elapsed.value} month${elapsed.value > 1 ? 's' : ''} ago`;

    case 'years':
      return `${elapsed.value} year${elapsed.value > 1 ? 's' : ''} ago`;

    default:
      return '';
  }
};

export const getElapsedTimeStringShort = (
  timestamp: number,
  currentTimestamp = Date.now(),
): string => {
  const elapsed = getElapsedFromTimestamp(timestamp, currentTimestamp);

  switch (elapsed.unit) {
    case 'just_now':
      return 'just now';

    case 'seconds':
      return `${elapsed.value}s`;

    case 'minutes':
      return `${elapsed.value}m`;

    case 'hours':
      return `${elapsed.value}h`;

    case 'days':
      return `${elapsed.value}d`;

    case 'weeks':
      return `${elapsed.value}w`;

    case 'months':
      return `${elapsed.value}mo`;

    case 'years':
      return `${elapsed.value}y`;

    default:
      return '';
  }
};
