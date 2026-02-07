import dayjs from 'dayjs';
import {
    formatDate,
    formatDateTime,
    formatTime,
    getStartOfDay,
    getEndOfDay,
    getStartOfWeek,
    getStartOfMonth,
    getEndOfMonth,
    isToday,
    getGreeting,
    formatDateForBill,
    getDateRangeForPeriod,
    formatDateShort,
} from '@shared/utils/date';

describe('date utils', () => {
    const testDate = new Date(2024, 0, 15, 14, 30, 0); // Jan 15, 2024 2:30 PM

    describe('formatDate', () => {
        it('should format date with DD/MM/YYYY', () => {
            expect(formatDate(testDate)).toBe('15/01/2024');
        });

        it('should accept timestamp', () => {
            expect(formatDate(testDate.getTime())).toBe('15/01/2024');
        });
    });

    describe('formatDateTime', () => {
        it('should format date and time', () => {
            expect(formatDateTime(testDate)).toBe('15/01/2024 02:30 PM');
        });
    });

    describe('formatTime', () => {
        it('should format time only', () => {
            expect(formatTime(testDate)).toBe('02:30 PM');
        });
    });

    describe('getStartOfDay', () => {
        it('should return midnight of given date', () => {
            const result = getStartOfDay(testDate);
            expect(result.getHours()).toBe(0);
            expect(result.getMinutes()).toBe(0);
            expect(result.getSeconds()).toBe(0);
        });

        it('should use today when no date given', () => {
            const result = getStartOfDay();
            expect(result.getHours()).toBe(0);
        });
    });

    describe('getEndOfDay', () => {
        it('should return 23:59:59 of given date', () => {
            const result = getEndOfDay(testDate);
            expect(result.getHours()).toBe(23);
            expect(result.getMinutes()).toBe(59);
            expect(result.getSeconds()).toBe(59);
        });
    });

    describe('getStartOfWeek', () => {
        it('should return start of current week', () => {
            const result = getStartOfWeek();
            expect(result.getHours()).toBe(0);
            expect(result.getDay()).toBe(0); // Sunday
        });
    });

    describe('getStartOfMonth', () => {
        it('should return first day of given month', () => {
            const result = getStartOfMonth(testDate);
            expect(result.getDate()).toBe(1);
            expect(result.getMonth()).toBe(0);
        });

        it('should use current month when no date given', () => {
            const result = getStartOfMonth();
            expect(result.getDate()).toBe(1);
        });
    });

    describe('getEndOfMonth', () => {
        it('should return last day of current month', () => {
            const result = getEndOfMonth();
            expect(result.getHours()).toBe(23);
            expect(result.getMinutes()).toBe(59);
        });
    });

    describe('isToday', () => {
        it('should return true for today', () => {
            expect(isToday(new Date())).toBe(true);
        });

        it('should return false for yesterday', () => {
            const yesterday = dayjs().subtract(1, 'day').toDate();
            expect(isToday(yesterday)).toBe(false);
        });

        it('should accept timestamp', () => {
            expect(isToday(Date.now())).toBe(true);
        });
    });

    describe('getGreeting', () => {
        it('should return a valid greeting key', () => {
            const result = getGreeting();
            expect(['goodMorning', 'goodAfternoon', 'goodEvening']).toContain(result);
        });
    });

    describe('formatDateForBill', () => {
        it('should return YYMMDD format', () => {
            const result = formatDateForBill();
            expect(result).toMatch(/^\d{6}$/);
        });
    });

    describe('getDateRangeForPeriod', () => {
        it('should return today range', () => {
            const range = getDateRangeForPeriod('today');
            expect(range.from).toBeDefined();
            expect(range.to).toBeDefined();
            expect(range.to.getTime()).toBeGreaterThanOrEqual(range.from.getTime());
        });

        it('should return this week range', () => {
            const range = getDateRangeForPeriod('thisWeek');
            expect(range.from.getDay()).toBe(0); // Sunday
        });

        it('should return this month range', () => {
            const range = getDateRangeForPeriod('thisMonth');
            expect(range.from.getDate()).toBe(1);
        });
    });

    describe('formatDateShort', () => {
        it('should return "Today" for today', () => {
            expect(formatDateShort(new Date())).toBe('Today');
        });

        it('should return "Yesterday" for yesterday', () => {
            const yesterday = dayjs().subtract(1, 'day').toDate();
            expect(formatDateShort(yesterday)).toBe('Yesterday');
        });

        it('should return DD MMM for older dates', () => {
            const oldDate = new Date(2023, 5, 15);
            expect(formatDateShort(oldDate)).toBe('15 Jun');
        });
    });
});
