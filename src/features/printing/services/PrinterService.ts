export interface PrinterService {
    connect(address: string): Promise<boolean>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    printBill(bill: PrintBillData): Promise<void>;
    printTestPage(): Promise<void>;
}

export interface PrintBillData {
    storeName: string;
    storeAddress: string;
    storePhone: string;
    gstNumber?: string;
    billNumber: string;
    date: string;
    time: string;
    items: PrintBillItem[];
    subtotal: number;
    discount: number;
    grandTotal: number;
    paymentMode: string;
    customerName?: string;
    customerPhone?: string;
}

export interface PrintBillItem {
    name: string;
    quantity: number;
    unit: string;
    price: number;
    total: number;
}
