import { BILL_NUMBER_PREFIX } from '@core/constants';
import {
    incrementBillSequence,
    getLastBillDate,
    setLastBillDate,
    resetBillSequence,
} from '@core/storage/mmkv';
import { formatDateForBill } from './date';

export const generateBillNumber = (): string => {
    const today = formatDateForBill();
    const lastDate = getLastBillDate();

    if (lastDate !== today) {
        resetBillSequence();
        setLastBillDate(today);
    }

    const seq = incrementBillSequence();
    const seqStr = seq.toString().padStart(4, '0');

    return `${BILL_NUMBER_PREFIX}-${today}-${seqStr}`;
};

let counter = 0;
export const generateId = (): string => {
    counter += 1;
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${random}-${counter}`;
};
