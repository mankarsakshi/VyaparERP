import RNFS from 'react-native-fs';

export interface PaymentPaidRecord {
  id: string;
  voucherNo: string;
  paymentDate: string;
  supplierName: string;
  supplierPhone: string;
  supplierEmail: string;
  supplierGSTIN: string;
  supplierAddress: string;
  billNo: string;
  billAmount: number;
  previousPaid: number;
  remainingAmount: number;
  paymentAmount: number;
  paymentMode: string;
  transactionNo: string;
  remarks: string;
  attachmentName?: string;
  createdAt?: string;
}

export const INITIAL_PAYMENT_PAID_RECORDS: PaymentPaidRecord[] = [
  {
    id: '1',
    voucherNo: 'PAY-2026-001',
    paymentDate: '26/09/2026',
    supplierName: 'Mankar Sakshi Traders',
    supplierPhone: '9876543210',
    supplierEmail: 'sakshi@traders.com',
    supplierGSTIN: '27AAAAA0000A1Z5',
    supplierAddress: 'Shop 12, Market Yard, Pune, Maharashtra',
    billNo: 'PUR-2026-001',
    billAmount: 50000,
    previousPaid: 20000,
    remainingAmount: 0,
    paymentAmount: 30000,
    paymentMode: 'UPI',
    transactionNo: 'UPI/987654321001',
    remarks: 'Payment cleared for purchase bill',
    attachmentName: 'receipt_pur_001.pdf',
    createdAt: new Date('2026-09-26T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    voucherNo: 'PAY-2026-002',
    paymentDate: '25/09/2026',
    supplierName: 'Sharma Electricals & Hardware',
    supplierPhone: '9812345678',
    supplierEmail: 'sharma@hardware.com',
    supplierGSTIN: '27BBBBB1111B1Z2',
    supplierAddress: 'Plot 45, MIDC Area, Mumbai, Maharashtra',
    billNo: 'INV-1088',
    billAmount: 32000,
    previousPaid: 12000,
    remainingAmount: 10000,
    paymentAmount: 10000,
    paymentMode: 'Net Banking',
    transactionNo: 'NEFT-88392019',
    remarks: 'Part payment done via NEFT',
    attachmentName: 'bank_transfer_adv.pdf',
    createdAt: new Date('2026-09-25T11:30:00Z').toISOString(),
  },
  {
    id: '3',
    voucherNo: 'PAY-2026-003',
    paymentDate: '24/09/2026',
    supplierName: 'Gupta Wholesale Suppliers',
    supplierPhone: '9765432109',
    supplierEmail: 'gupta@wholesale.com',
    supplierGSTIN: '27CCCCC2222C1Z9',
    supplierAddress: 'Shop 88, Sector 18, Noida, Uttar Pradesh',
    billNo: 'INV-1092',
    billAmount: 120000,
    previousPaid: 80000,
    remainingAmount: 0,
    paymentAmount: 40000,
    paymentMode: 'Cheque',
    transactionNo: 'CHQ-554210',
    remarks: 'Final settlement cheque issued',
    attachmentName: 'cheque_copy.jpg',
    createdAt: new Date('2026-09-24T14:15:00Z').toISOString(),
  },
  {
    id: '4',
    voucherNo: 'PAY-2026-004',
    paymentDate: '23/09/2026',
    supplierName: 'Apex Industrial Corporation',
    supplierPhone: '9654321098',
    supplierEmail: 'apex@corp.com',
    supplierGSTIN: '27DDDDD3333D1Z4',
    supplierAddress: 'Industrial Estate, Phase II, New Delhi',
    billNo: 'PUR-2026-002',
    billAmount: 75000,
    previousPaid: 45000,
    remainingAmount: 5000,
    paymentAmount: 25000,
    paymentMode: 'Cash',
    transactionNo: 'CASH-REC-102',
    remarks: 'Cash payment with physical receipt voucher',
    attachmentName: 'cash_voucher.pdf',
    createdAt: new Date('2026-09-23T16:45:00Z').toISOString(),
  },
];

let paymentPaidCache: PaymentPaidRecord[] = [...INITIAL_PAYMENT_PAID_RECORDS];
let isLoaded = false;

const getFilePath = () => {
  const baseDir = RNFS.DocumentDirectoryPath || RNFS.CachesDirectoryPath;
  return `${baseDir}/payment_paid_records.json`;
};

export const loadPaymentPaidRecords = async (): Promise<PaymentPaidRecord[]> => {
  try {
    const path = getFilePath();
    const exists = await RNFS.exists(path);
    if (exists) {
      const content = await RNFS.readFile(path, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        paymentPaidCache = data;
        isLoaded = true;
        return paymentPaidCache;
      }
    }
    await savePaymentPaidRecords(INITIAL_PAYMENT_PAID_RECORDS);
    paymentPaidCache = [...INITIAL_PAYMENT_PAID_RECORDS];
    isLoaded = true;
    return paymentPaidCache;
  } catch (err) {
    console.warn('Error loading payment paid records from file:', err);
    return paymentPaidCache;
  }
};

export const savePaymentPaidRecords = async (records: PaymentPaidRecord[]): Promise<void> => {
  try {
    paymentPaidCache = records;
    const path = getFilePath();
    await RNFS.writeFile(path, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving payment paid records to file:', err);
  }
};

export const getPaymentPaidSync = (): PaymentPaidRecord[] => {
  return paymentPaidCache;
};

export const addPaymentPaidRecord = async (newRecord: PaymentPaidRecord): Promise<PaymentPaidRecord[]> => {
  if (!isLoaded) {
    await loadPaymentPaidRecords();
  }
  const existingIdx = paymentPaidCache.findIndex(
    r => r.id === newRecord.id || (newRecord.voucherNo && r.voucherNo === newRecord.voucherNo),
  );
  if (existingIdx >= 0) {
    paymentPaidCache[existingIdx] = newRecord;
  } else {
    paymentPaidCache = [newRecord, ...paymentPaidCache];
  }
  await savePaymentPaidRecords(paymentPaidCache);
  return paymentPaidCache;
};

export const deletePaymentPaidRecord = async (id: string): Promise<PaymentPaidRecord[]> => {
  if (!isLoaded) {
    await loadPaymentPaidRecords();
  }
  paymentPaidCache = paymentPaidCache.filter(r => r.id !== id);
  await savePaymentPaidRecords(paymentPaidCache);
  return paymentPaidCache;
};
