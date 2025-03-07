import { format } from 'date-fns-tz';

export const getDateTimeInTimeZone = (date: Date, timeZone: string): string => {
    return format(date, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone });
};