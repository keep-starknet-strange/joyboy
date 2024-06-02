import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const timestampToHumanReadable = (timestamp: number): string => {
  // Convert timestamp to dayjs object
  const date = dayjs.unix(timestamp);
  const fromNow = date.fromNow(true); // Get the relative time string without the "ago"

  // Replace long forms with short forms and remove spaces
  const formattedDate = fromNow
    .replace(/\sseconds?/, 's')
    .replace(/\sminutes?/, 'm')
    .replace(/\shours?/, 'h')
    .replace(/\sdays?/, 'd')
    .replace(/\smonths?/, 'mo')
    .replace(/\syears?/, 'y');

  return formattedDate;
};
