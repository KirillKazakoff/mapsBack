import { DateTime } from 'luxon';

export const dateDb = {
    fromDb: (date: string) => {
        return new Date(date)
            .toLocaleString('ru', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
            })
            .toString();
    },
    toDb: (date: string, format: string) => {
        const dateObj = DateTime.fromFormat(date, format);
        const res = dateObj.toISO();

        if (!res) return '';
        return res;
    },
};
