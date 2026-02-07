// Test database model static properties and computed properties
// We test the model class definitions, not the ORM functionality

describe('Bill model', () => {
    let Bill: any;

    beforeAll(() => {
        Bill = require('@core/database/models/Bill').default;
    });

    it('should have correct table name', () => {
        expect(Bill.table).toBe('bills');
    });

    it('should have correct associations', () => {
        expect(Bill.associations.customers.type).toBe('belongs_to');
        expect(Bill.associations.bill_items.type).toBe('has_many');
        expect(Bill.associations.payments.type).toBe('has_many');
        expect(Bill.associations.credit_entries.type).toBe('has_many');
    });
});

describe('BillItem model', () => {
    let BillItem: any;

    beforeAll(() => {
        BillItem = require('@core/database/models/BillItem').default;
    });

    it('should have correct table name', () => {
        expect(BillItem.table).toBe('bill_items');
    });

    it('should have correct associations', () => {
        expect(BillItem.associations.bills.type).toBe('belongs_to');
        expect(BillItem.associations.products.type).toBe('belongs_to');
    });
});

describe('Category model', () => {
    let Category: any;

    beforeAll(() => {
        Category = require('@core/database/models/Category').default;
    });

    it('should have correct table name', () => {
        expect(Category.table).toBe('categories');
    });

    it('should have correct associations', () => {
        expect(Category.associations.products.type).toBe('has_many');
    });
});

describe('Customer model', () => {
    let Customer: any;

    beforeAll(() => {
        Customer = require('@core/database/models/Customer').default;
    });

    it('should have correct table name', () => {
        expect(Customer.table).toBe('customers');
    });

    it('should have correct associations', () => {
        expect(Customer.associations.bills.type).toBe('has_many');
        expect(Customer.associations.credit_entries.type).toBe('has_many');
        expect(Customer.associations.payments.type).toBe('has_many');
    });
});

describe('CreditEntry model', () => {
    let CreditEntry: any;

    beforeAll(() => {
        CreditEntry = require('@core/database/models/CreditEntry').default;
    });

    it('should have correct table name', () => {
        expect(CreditEntry.table).toBe('credit_entries');
    });

    it('should have correct associations', () => {
        expect(CreditEntry.associations.customers.type).toBe('belongs_to');
        expect(CreditEntry.associations.bills.type).toBe('belongs_to');
    });
});

describe('InventoryLog model', () => {
    let InventoryLog: any;

    beforeAll(() => {
        InventoryLog = require('@core/database/models/InventoryLog').default;
    });

    it('should have correct table name', () => {
        expect(InventoryLog.table).toBe('inventory_logs');
    });

    it('should have correct associations', () => {
        expect(InventoryLog.associations.products.type).toBe('belongs_to');
    });
});

describe('Payment model', () => {
    let Payment: any;

    beforeAll(() => {
        Payment = require('@core/database/models/Payment').default;
    });

    it('should have correct table name', () => {
        expect(Payment.table).toBe('payments');
    });

    it('should have correct associations', () => {
        expect(Payment.associations.bills.type).toBe('belongs_to');
        expect(Payment.associations.customers.type).toBe('belongs_to');
    });
});

describe('Product model', () => {
    let Product: any;

    beforeAll(() => {
        Product = require('@core/database/models/Product').default;
    });

    it('should have correct table name', () => {
        expect(Product.table).toBe('products');
    });

    it('should have correct associations', () => {
        expect(Product.associations.categories.type).toBe('belongs_to');
        expect(Product.associations.bill_items.type).toBe('has_many');
        expect(Product.associations.inventory_logs.type).toBe('has_many');
    });
});
