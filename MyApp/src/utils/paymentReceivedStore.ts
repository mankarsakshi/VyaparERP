import RNFS from 'react-native-fs';

export interface PaymentReceivedRecord {
  id: string;
  voucherNo: string;
  paymentDate: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  invoiceNo: string;
  receivedAmount: number;
  paymentMode: string;
  referenceNumber: string;
  notes: string;
  note?: string;
  remarks?: string;
  description?: string;
  createdAt?: string;
}

export const INITIAL_PAYMENT_RECEIVED_RECORDS: PaymentReceivedRecord[] = [
  {
    id: '1',
    voucherNo: 'REC-2026-001',
    paymentDate: '28 Sep 2026',
    customerName: 'Mankar Sakshi Traders',
    customerPhone: '9876543210',
    customerEmail: 'sakshi.traders@gmail.com',
    customerAddress: 'Shop 12, Market Yard, Pune',
    invoiceNo: 'INV-1025',
    receivedAmount: 25000,
    paymentMode: 'UPI',
    referenceNumber: 'UPI/987654321001',
    notes: 'Advance payment received via PhonePe',
    note: 'Advance payment received via PhonePe',
    remarks: 'Advance payment received via PhonePe',
    createdAt: new Date('2026-09-28T10:00:00Z').toISOString(),
  },
  {
    id: '2',
    voucherNo: 'REC-2026-002',
    paymentDate: '27 Sep 2026',
    customerName: 'Sharma Electricals & Hardware',
    customerPhone: '9812345678',
    customerEmail: 'sharma.elec@yahoo.com',
    customerAddress: 'Plot 45, MIDC, Mumbai',
    invoiceNo: 'INV-1026',
    receivedAmount: 18500,
    paymentMode: 'Bank Transfer',
    referenceNumber: 'NEFT-88392019',
    notes: 'Full invoice settlement received',
    note: 'Full invoice settlement received',
    remarks: 'Full invoice settlement received',
    createdAt: new Date('2026-09-27T11:30:00Z').toISOString(),
  },
  {
    id: '3',
    voucherNo: 'REC-2026-003',
    paymentDate: '26 Sep 2026',
    customerName: 'Gupta Wholesale Suppliers',
    customerPhone: '9765432109',
    customerEmail: 'gupta.wholesale@gmail.com',
    customerAddress: 'Shop 88, Sector 18, Noida',
    invoiceNo: 'INV-1028',
    receivedAmount: 42000,
    paymentMode: 'Cheque',
    referenceNumber: 'CHQ-772341',
    notes: 'Cheque cleared in HDFC account',
    note: 'Cheque cleared in HDFC account',
    remarks: 'Cheque cleared in HDFC account',
    createdAt: new Date('2026-09-26T14:15:00Z').toISOString(),
  },
  {
    id: '4',
    voucherNo: 'REC-2026-004',
    paymentDate: '25 Sep 2026',
    customerName: 'Rahul Verma',
    customerPhone: '9845612300',
    customerEmail: 'rahul.verma@outlook.com',
    customerAddress: 'MG Road, Bengaluru',
    invoiceNo: 'INV-1030',
    receivedAmount: 12000,
    paymentMode: 'Cash',
    referenceNumber: 'CASH-REC-004',
    notes: 'Cash received on delivery',
    note: 'Cash received on delivery',
    remarks: 'Cash received on delivery',
    createdAt: new Date('2026-09-25T16:45:00Z').toISOString(),
  },
  {
    id: '5',
    voucherNo: 'REC-2026-005',
    paymentDate: '24 Sep 2026',
    customerName: 'Priya Sharma Enterprises',
    customerPhone: '9712345678',
    customerEmail: 'priya.ent@gmail.com',
    customerAddress: 'Kothrud, Pune',
    invoiceNo: 'INV-1035',
    receivedAmount: 35000,
    paymentMode: 'UPI',
    referenceNumber: 'UPI/971234567800',
    notes: 'Part payment received for bulk hardware order',
    note: 'Part payment received for bulk hardware order',
    remarks: 'Part payment received for bulk hardware order',
    createdAt: new Date('2026-09-24T12:00:00Z').toISOString(),
  },
];

let paymentReceivedCache: PaymentReceivedRecord[] = [...INITIAL_PAYMENT_RECEIVED_RECORDS];
let isLoaded = false;

const getFilePath = () => {
  const baseDir = RNFS.DocumentDirectoryPath || RNFS.CachesDirectoryPath;
  return `${baseDir}/payment_received_records.json`;
};

export const loadPaymentReceivedRecords = async (): Promise<PaymentReceivedRecord[]> => {
  try {
    const path = getFilePath();
    const exists = await RNFS.exists(path);
    if (exists) {
      const content = await RNFS.readFile(path, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        paymentReceivedCache = data.map((item: any) => {
          const noteText = item.notes ?? item.note ?? item.remarks ?? item.description ?? '';
          return {
            ...item,
            notes: noteText,
            note: noteText,
            remarks: noteText,
          };
        });
        isLoaded = true;
        return paymentReceivedCache;
      }
    }
    await savePaymentReceivedRecords(INITIAL_PAYMENT_RECEIVED_RECORDS);
    paymentReceivedCache = [...INITIAL_PAYMENT_RECEIVED_RECORDS];
    isLoaded = true;
    return paymentReceivedCache;
  } catch (err) {
    console.warn('Error loading payment received records from file:', err);
    return paymentReceivedCache;
  }
};

export const savePaymentReceivedRecords = async (records: PaymentReceivedRecord[]): Promise<void> => {
  try {
    paymentReceivedCache = records;
    const path = getFilePath();
    await RNFS.writeFile(path, JSON.stringify(records, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving payment received records to file:', err);
  }
};

export const getPaymentReceivedSync = (): PaymentReceivedRecord[] => {
  return paymentReceivedCache;
};

export const addPaymentReceivedRecord = async (newRecord: PaymentReceivedRecord): Promise<PaymentReceivedRecord[]> => {
  if (!isLoaded) {
    await loadPaymentReceivedRecords();
  }
  const noteContent = newRecord.notes ?? newRecord.note ?? newRecord.remarks ?? newRecord.description ?? '';
  const sanitizedRecord: PaymentReceivedRecord = {
    ...newRecord,
    notes: noteContent,
    note: noteContent,
    remarks: noteContent,
  };

  const existingIdx = paymentReceivedCache.findIndex(
    r => r.id === sanitizedRecord.id || (sanitizedRecord.voucherNo && r.voucherNo === sanitizedRecord.voucherNo),
  );
  if (existingIdx >= 0) {
    paymentReceivedCache[existingIdx] = {
      ...paymentReceivedCache[existingIdx],
      ...sanitizedRecord,
    };
  } else {
    paymentReceivedCache = [sanitizedRecord, ...paymentReceivedCache];
  }
  await savePaymentReceivedRecords(paymentReceivedCache);
  return paymentReceivedCache;
};

export const deletePaymentReceivedRecord = async (id: string): Promise<PaymentReceivedRecord[]> => {
  if (!isLoaded) {
    await loadPaymentReceivedRecords();
  }
  paymentReceivedCache = paymentReceivedCache.filter(r => r.id !== id);
  await savePaymentReceivedRecords(paymentReceivedCache);
  return paymentReceivedCache;
};
