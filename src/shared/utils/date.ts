import dayjs from 'dayjs';
import { DATE_FORMAT, DATE_TIME_FORMAT } from '@core/constants';

export const formatDate = (date: Date | number): string =>
    dayjs(date).format(DATE_FORMAT);

export const formatDateTime = (date: Date | number): string =>
    dayjs(date).format(DATE_TIME_FORMAT);

export const formatTime = (date: Date | number): string =>
    dayjs(date).format('hh:mm A');

export const getStartOfDay = (date?: Date): Date =>
    dayjs(date).startOf('day').toDate();

export const getEndOfDay = (date?: Date): Date =>
    dayjs(date).endOf('day').toDate();

export const getStartOfWeek = (): Date =>
    dayjs().startOf('week').toDate();

export const getStartOfMonth = (date?: Date): Date =>
    dayjs(date).startOf('month').toDate();

export const getEndOfMonth = (): Date =>
    dayjs().endOf('month').toDate();

export const isToday = (date: Date | number): boolean =>
    dayjs(date).isSame(dayjs(), 'day');

export const getGreeting = (): 'goodMorning' | 'goodAfternoon' | 'goodEvening' => {
    const hour = dayjs().hour();
    if (hour < 12) {
        return 'goodMorning';
    }
    if (hour < 17) {
        return 'goodAfternoon';
    }
    return 'goodEvening';
};

export const formatDateForBill = (): string =>
    dayjs().format('YYMMDD');

export const getDateRangeForPeriod = (
    period: 'today' | 'thisWeek' | 'thisMonth',
): { from: Date; to: Date } => {
    const now = dayjs();
    switch (period) {
        case 'today':
            return { from: now.startOf('day').toDate(), to: now.endOf('day').toDate() };
        case 'thisWeek':
            return { from: now.startOf('week').toDate(), to: now.endOf('day').toDate() };
        case 'thisMonth':
            return { from: now.startOf('month').toDate(), to: now.endOf('day').toDate() };
    }
};

export const formatDateShort = (date: Date | number): string => {
    const d = dayjs(date);
    if (d.isSame(dayjs(), 'day')) {
        return 'Today';
    }
    if (d.isSame(dayjs().subtract(1, 'day'), 'day')) {
        return 'Yesterday';
    }
    return d.format('DD MMM');
};
