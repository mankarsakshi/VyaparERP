import RNFS from 'react-native-fs';

export interface ProductLineItem {
  product: string;
  batchNo?: string;
  reason?: string;
  sold?: number;
  returnQty: number;
  rate: number;
  disc: number;
  gst?: number;
  hsn: string;
  taxableAmt: number;
  cgstAmt: number;
  sgstAmt: number;
  igstAmt: number;
  totalAmt: number;
}

export interface DebitNoteRecord {
  id: string;
  billNo: string;
  billDate: string;
  invoiceNo: string;
  invoiceDate: string;
  supplierName: string;
  phone: string;
  state: string;
  city: string;
  defaultGstRate: string;
  taxType: string;
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  debitNoteTotal: number;
  adjustmentType: string;
  items: ProductLineItem[];
}

export const INITIAL_DEBIT_NOTES: DebitNoteRecord[] = [
  {
    id: '1',
    billNo: 'DN-001',
    billDate: '23/09/2026',
    invoiceNo: 'INV-1025',
    invoiceDate: '20/09/2026',
    supplierName: 'Ramesh Suppliers',
    phone: '9823012345',
    state: 'Maharashtra',
    city: 'Pune',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 10000.00,
    discount: 500.00,
    taxableAmount: 9500.00,
    cgst: 855.00,
    sgst: 855.00,
    igst: 0.00,
    debitNoteTotal: 11210.00,
    adjustmentType: 'Adjust Against Invoice',
    items: [
      {
        product: 'Laptop Computer',
        batchNo: 'BATCH-8471',
        reason: 'Damaged Screen',
        sold: 5,
        returnQty: 1,
        rate: 10000.00,
        disc: 5,
        gst: 18,
        hsn: '8471',
        taxableAmt: 9500.00,
        cgstAmt: 855.00,
        sgstAmt: 855.00,
        igstAmt: 0.00,
        totalAmt: 11210.00,
      }
    ]
  },
  {
    id: '2',
    billNo: 'DN-002',
    billDate: '24/09/2026',
    invoiceNo: 'INV-1028',
    invoiceDate: '21/09/2026',
    supplierName: 'Mahavir Electronics',
    phone: '9890123456',
    state: 'Maharashtra',
    city: 'Mumbai',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 5000.00,
    discount: 250.00,
    taxableAmount: 4750.00,
    cgst: 427.50,
    sgst: 427.50,
    igst: 0.00,
    debitNoteTotal: 5605.00,
    adjustmentType: 'Supplier Credit',
    items: [
      {
        product: 'Mechanical Keyboard',
        batchNo: 'BATCH-8472',
        reason: 'Price Difference',
        sold: 10,
        returnQty: 2,
        rate: 2500.00,
        disc: 5,
        gst: 18,
        hsn: '8471',
        taxableAmt: 4750.00,
        cgstAmt: 427.50,
        sgstAmt: 427.50,
        igstAmt: 0.00,
        totalAmt: 5605.00,
      }
    ]
  },
  {
    id: '3',
    billNo: 'DN-003',
    billDate: '24/09/2026',
    invoiceNo: 'INV-1030',
    invoiceDate: '22/09/2026',
    supplierName: 'Global Tech Components',
    phone: '9123456789',
    state: 'Karnataka',
    city: 'Bengaluru',
    defaultGstRate: '18%',
    taxType: 'IGST (Inter-state)',
    subtotal: 18500.00,
    discount: 925.00,
    taxableAmount: 17575.00,
    cgst: 0.00,
    sgst: 0.00,
    igst: 3163.50,
    debitNoteTotal: 20739.50,
    adjustmentType: 'Refund',
    items: [
      {
        product: '27-inch Gaming Monitor',
        batchNo: 'BATCH-104',
        reason: 'Defective Display Panel',
        sold: 3,
        returnQty: 1,
        rate: 18500.00,
        disc: 5,
        gst: 18,
        hsn: '8528',
        taxableAmt: 17575.00,
        cgstAmt: 0.00,
        sgstAmt: 0.00,
        igstAmt: 3163.50,
        totalAmt: 20739.50,
      }
    ]
  },
  {
    id: '4',
    billNo: 'DN-004',
    billDate: '24/09/2026',
    invoiceNo: 'INV-1035',
    invoiceDate: '22/09/2026',
    supplierName: 'Sun Distributors',
    phone: '9765432109',
    state: 'Maharashtra',
    city: 'Pune',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 3000.00,
    discount: 0.00,
    taxableAmount: 3000.00,
    cgst: 270.00,
    sgst: 270.00,
    igst: 0.00,
    debitNoteTotal: 3540.00,
    adjustmentType: 'Adjust Against Invoice',
    items: [
      {
        product: 'Wireless Optical Mouse',
        batchNo: 'BATCH-101',
        reason: 'Purchase Return',
        sold: 20,
        returnQty: 6,
        rate: 500.00,
        disc: 0,
        gst: 18,
        hsn: '8471',
        taxableAmt: 3000.00,
        cgstAmt: 270.00,
        sgstAmt: 270.00,
        igstAmt: 0.00,
        totalAmt: 3540.00,
      }
    ]
  }
];

let debitNotesCache: DebitNoteRecord[] = [...INITIAL_DEBIT_NOTES];
let isLoaded = false;

const getFilePath = () => {
  const baseDir = RNFS.DocumentDirectoryPath || RNFS.CachesDirectoryPath;
  return `${baseDir}/debit_notes.json`;
};

export const loadDebitNotes = async (): Promise<DebitNoteRecord[]> => {
  try {
    const path = getFilePath();
    const exists = await RNFS.exists(path);
    if (exists) {
      const content = await RNFS.readFile(path, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        debitNotesCache = data;
        isLoaded = true;
        return debitNotesCache;
      }
    }
    await saveDebitNotes(INITIAL_DEBIT_NOTES);
    debitNotesCache = [...INITIAL_DEBIT_NOTES];
    isLoaded = true;
    return debitNotesCache;
  } catch (err) {
    console.warn('Error loading debit notes from file:', err);
    return debitNotesCache;
  }
};

export const saveDebitNotes = async (notes: DebitNoteRecord[]): Promise<void> => {
  try {
    debitNotesCache = notes;
    const path = getFilePath();
    await RNFS.writeFile(path, JSON.stringify(notes, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving debit notes to file:', err);
  }
};

export const getDebitNotesSync = (): DebitNoteRecord[] => {
  return debitNotesCache;
};

export const addDebitNoteRecord = async (newNote: DebitNoteRecord): Promise<DebitNoteRecord[]> => {
  if (!isLoaded) {
    await loadDebitNotes();
  }
  const existingIdx = debitNotesCache.findIndex(n => n.id === newNote.id || n.billNo === newNote.billNo);
  if (existingIdx >= 0) {
    debitNotesCache[existingIdx] = newNote;
  } else {
    debitNotesCache = [newNote, ...debitNotesCache];
  }
  await saveDebitNotes(debitNotesCache);
  return debitNotesCache;
};

export const deleteDebitNoteRecord = async (id: string): Promise<DebitNoteRecord[]> => {
  if (!isLoaded) {
    await loadDebitNotes();
  }
  debitNotesCache = debitNotesCache.filter(n => n.id !== id);
  await saveDebitNotes(debitNotesCache);
  return debitNotesCache;
};
