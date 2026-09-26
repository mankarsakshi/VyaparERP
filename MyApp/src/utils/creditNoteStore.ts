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

export interface CreditNoteRecord {
  id: string;
  billNo: string;
  billDate: string;
  invoiceNo: string;
  invoiceDate: string;
  customerName: string;
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
  creditNoteTotal: number;
  adjustmentType: string;
  items: ProductLineItem[];
}

export const INITIAL_CREDIT_NOTES: CreditNoteRecord[] = [
  {
    id: '1',
    billNo: 'CN-001',
    billDate: '21/09/2026',
    invoiceNo: 'INV-001',
    invoiceDate: '15/09/2026',
    customerName: 'Ramesh Traders',
    phone: '9823012345',
    state: 'Maharashtra',
    city: 'Pune',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 14000.00,
    discount: 700.00,
    taxableAmount: 13300.00,
    cgst: 1197.00,
    sgst: 1197.00,
    igst: 0.00,
    creditNoteTotal: 15694.00,
    adjustmentType: 'Customer Credit',
    items: [
      {
        product: 'Wireless Router 150Mbps',
        batchNo: 'BATCH-4821',
        reason: 'Sales Return',
        sold: 10,
        returnQty: 2,
        rate: 7000.00,
        disc: 5,
        gst: 18,
        hsn: '8517',
        taxableAmt: 13300.00,
        cgstAmt: 1197.00,
        sgstAmt: 1197.00,
        igstAmt: 0.00,
        totalAmt: 15694.00,
      }
    ]
  },
  {
    id: '2',
    billNo: 'CN-002',
    billDate: '22/09/2026',
    invoiceNo: 'INV-004',
    invoiceDate: '19/09/2026',
    customerName: 'Suresh Enterprises',
    phone: '9890123456',
    state: 'Maharashtra',
    city: 'Mumbai',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 4000.00,
    discount: 200.00,
    taxableAmount: 3800.00,
    cgst: 342.00,
    sgst: 342.00,
    igst: 0.00,
    creditNoteTotal: 4484.00,
    adjustmentType: 'Refund',
    items: [
      {
        product: 'USB Type-C Adapter',
        batchNo: 'BATCH-1092',
        reason: 'Post Sale Discount',
        sold: 15,
        returnQty: 5,
        rate: 800.00,
        disc: 5,
        gst: 18,
        hsn: '8504',
        taxableAmt: 3800.00,
        cgstAmt: 342.00,
        sgstAmt: 342.00,
        igstAmt: 0.00,
        totalAmt: 4484.00,
      }
    ]
  },
  {
    id: '3',
    billNo: 'CN-003',
    billDate: '23/09/2026',
    invoiceNo: 'INV-005',
    invoiceDate: '20/09/2026',
    customerName: 'Vinod Hardware',
    phone: '9123456789',
    state: 'Karnataka',
    city: 'Bengaluru',
    defaultGstRate: '18%',
    taxType: 'IGST (Inter-state)',
    subtotal: 8000.00,
    discount: 400.00,
    taxableAmount: 7600.00,
    cgst: 0.00,
    sgst: 0.00,
    igst: 1368.00,
    creditNoteTotal: 8968.00,
    adjustmentType: 'Adjust Against Invoice',
    items: [
      {
        product: 'Mechanical Keyboard RGB',
        batchNo: 'BATCH-3011',
        reason: 'Deficiency in services',
        sold: 4,
        returnQty: 2,
        rate: 4000.00,
        disc: 5,
        gst: 18,
        hsn: '8471',
        taxableAmt: 7600.00,
        cgstAmt: 0.00,
        sgstAmt: 0.00,
        igstAmt: 1368.00,
        totalAmt: 8968.00,
      }
    ]
  }
];

let creditNotesCache: CreditNoteRecord[] = [...INITIAL_CREDIT_NOTES];
let isLoaded = false;

const getFilePath = () => {
  const baseDir = RNFS.DocumentDirectoryPath || RNFS.CachesDirectoryPath;
  return `${baseDir}/credit_notes.json`;
};

export const loadCreditNotes = async (): Promise<CreditNoteRecord[]> => {
  try {
    const path = getFilePath();
    const exists = await RNFS.exists(path);
    if (exists) {
      const content = await RNFS.readFile(path, 'utf8');
      const data = JSON.parse(content);
      if (Array.isArray(data) && data.length > 0) {
        creditNotesCache = data;
        isLoaded = true;
        return creditNotesCache;
      }
    }
    // Save initial mock data if file doesn't exist
    await saveCreditNotes(INITIAL_CREDIT_NOTES);
    creditNotesCache = [...INITIAL_CREDIT_NOTES];
    isLoaded = true;
    return creditNotesCache;
  } catch (err) {
    console.warn('Error loading credit notes from file:', err);
    return creditNotesCache;
  }
};

export const saveCreditNotes = async (notes: CreditNoteRecord[]): Promise<void> => {
  try {
    creditNotesCache = notes;
    const path = getFilePath();
    await RNFS.writeFile(path, JSON.stringify(notes, null, 2), 'utf8');
  } catch (err) {
    console.warn('Error saving credit notes to file:', err);
  }
};

export const getCreditNotesSync = (): CreditNoteRecord[] => {
  return creditNotesCache;
};

export const addCreditNoteRecord = async (newNote: CreditNoteRecord): Promise<CreditNoteRecord[]> => {
  if (!isLoaded) {
    await loadCreditNotes();
  }
  const existingIdx = creditNotesCache.findIndex(n => n.id === newNote.id || n.billNo === newNote.billNo);
  if (existingIdx >= 0) {
    creditNotesCache[existingIdx] = newNote;
  } else {
    creditNotesCache = [newNote, ...creditNotesCache];
  }
  await saveCreditNotes(creditNotesCache);
  return creditNotesCache;
};

export const deleteCreditNoteRecord = async (id: string): Promise<CreditNoteRecord[]> => {
  if (!isLoaded) {
    await loadCreditNotes();
  }
  creditNotesCache = creditNotesCache.filter(n => n.id !== id);
  await saveCreditNotes(creditNotesCache);
  return creditNotesCache;
};
