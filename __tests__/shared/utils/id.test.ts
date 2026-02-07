import { generateBillNumber, generateId } from '@shared/utils/id';

// The id module depends on mmkv functions. Since setup.ts mocks react-native-mmkv
// with a functional store, the mmkv functions should work.

describe('id utils', () => {
    describe('generateId', () => {
        it('should generate a unique string', () => {
            const id = generateId();
            expect(typeof id).toBe('string');
            expect(id.length).toBeGreaterThan(0);
        });

        it('should generate unique ids each time', () => {
            const id1 = generateId();
            const id2 = generateId();
            expect(id1).not.toBe(id2);
        });

        it('should contain timestamp and random parts', () => {
            const id = generateId();
            const parts = id.split('-');
            expect(parts.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('generateBillNumber', () => {
        it('should generate bill number with KM prefix', () => {
            const billNumber = generateBillNumber();
            expect(billNumber).toMatch(/^KM-/);
        });

        it('should include date component', () => {
            const billNumber = generateBillNumber();
            // Format: KM-YYMMDD-XXXX
            const parts = billNumber.split('-');
            expect(parts.length).toBe(3);
            expect(parts[1]).toMatch(/^\d{6}$/);
        });

        it('should include sequence number', () => {
            const billNumber = generateBillNumber();
            const parts = billNumber.split('-');
            expect(parts[2]).toMatch(/^\d{4}$/);
        });

        it('should increment sequence for consecutive bills', () => {
            const bill1 = generateBillNumber();
            const bill2 = generateBillNumber();
            const seq1 = parseInt(bill1.split('-')[2], 10);
            const seq2 = parseInt(bill2.split('-')[2], 10);
            expect(seq2).toBe(seq1 + 1);
        });
    });
});
