import {PermissionsAndroid, Platform, Alert} from 'react-native';
import RNFS from 'react-native-fs';

/**
 * Request storage permission for Android (< Android 13)
 */
export const requestStoragePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  if (Platform.Version >= 33) {
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Storage Permission Required',
        message: 'Allow the app to save downloaded files to your device storage.',
        buttonPositive: 'Allow',
        buttonNegative: 'Cancel',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn('Storage permission request error:', err);
    return true;
  }
};

/**
 * Save file to device storage with multiple directory fallbacks
 */
export const saveFileToDevice = async (
  fileName: string,
  content: string,
  encoding: 'utf8' | 'base64' | 'ascii' = 'utf8',
): Promise<string> => {
  await requestStoragePermission();

  const candidates: string[] = [];
  if (Platform.OS === 'android') {
    if (RNFS.DownloadDirectoryPath) {
      candidates.push(RNFS.DownloadDirectoryPath);
    }
    if (RNFS.ExternalDirectoryPath) {
      candidates.push(RNFS.ExternalDirectoryPath);
    }
    if (RNFS.ExternalStorageDirectoryPath) {
      candidates.push(`${RNFS.ExternalStorageDirectoryPath}/Download`);
    }
  }
  if (RNFS.DocumentDirectoryPath) {
    candidates.push(RNFS.DocumentDirectoryPath);
  }

  let lastError: any = null;
  for (const dir of candidates) {
    try {
      const targetPath = `${dir}/${fileName}`;
      await RNFS.writeFile(targetPath, content, encoding);
      return targetPath;
    } catch (err) {
      lastError = err;
      console.warn(`Failed writing to ${dir}, trying next candidate...`, err);
    }
  }

  throw lastError || new Error('Unable to write file to device storage.');
};

// ================================================================
// PURE JAVASCRIPT VECTOR PDF GENERATOR (NO EXTERNAL DEPENDENCIES)
// ================================================================

interface PDFTableColumn {
  title: string;
  width: number;
  align?: 'left' | 'center' | 'right';
}

const escapePdfText = (text: string): string => {
  if (!text) return '';
  const sanitized = String(text)
    .replace(/₹/g, 'Rs. ')
    .replace(/[^\x20-\x7E]/g, ' '); // 7-bit ASCII only
  return sanitized
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
};

export const generatePurePDF = (
  documentTitle: string,
  columns: PDFTableColumn[],
  rows: string[][],
): string => {
  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const marginX = 20;
  const tableWidth = columns.reduce((sum, col) => sum + col.width, 0);

  const rowsPerPage = 32;
  const totalPages = Math.max(1, Math.ceil(rows.length / rowsPerPage));

  const objects: string[] = [];
  objects[0] = ''; // 1-indexed

  // 1: Catalog
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';

  // 3: Font Helvetica
  objects[3] =
    '3 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>\nendobj\n';

  // 4: Font Helvetica-Bold
  objects[4] =
    '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>\nendobj\n';

  const pageObjIds: number[] = [];
  let currentObjId = 5;

  for (let p = 0; p < totalPages; p++) {
    const pageObjId = currentObjId++;
    const contentObjId = currentObjId++;
    pageObjIds.push(pageObjId);

    const startRowIdx = p * rowsPerPage;
    const endRowIdx = Math.min(startRowIdx + rowsPerPage, rows.length);
    const pageRows = rows.slice(startRowIdx, endRowIdx);

    const cmds: string[] = [];

    // Top Header Banner (#4338ca)
    cmds.push('0.263 0.22 0.792 rg');
    cmds.push(`0 812 ${pageWidth} 30 re f`);

    // Title Text (White)
    cmds.push('BT');
    cmds.push('/F2 13 Tf');
    cmds.push('1 1 1 rg');
    cmds.push(`20 822 Td (${escapePdfText(documentTitle)}) Tj`);
    cmds.push('ET');

    // Subtitle & Date
    const nowStr = new Date().toLocaleString();
    cmds.push('BT');
    cmds.push('/F1 8.5 Tf');
    cmds.push('0.4 0.45 0.5 rg');
    cmds.push(
      `20 796 Td (Generated: ${escapePdfText(nowStr)}   |   Total Records: ${
        rows.length
      }) Tj`,
    );
    cmds.push('ET');

    // Table Header Background (#eef2ff)
    cmds.push('0.933 0.949 1.0 rg');
    cmds.push(`${marginX} 765 ${tableWidth} 22 re f`);

    // Table Header Border
    cmds.push('0.8 0.85 0.9 RG');
    cmds.push('0.75 w');
    cmds.push(`${marginX} 765 ${tableWidth} 22 re s`);

    // Table Header Labels
    let curX = marginX;
    columns.forEach(col => {
      cmds.push('BT');
      cmds.push('/F2 8.5 Tf');
      cmds.push('0.2 0.25 0.35 rg');
      const textX =
        col.align === 'center'
          ? curX + col.width / 2 - col.title.length * 2.2
          : curX + 4;
      cmds.push(
        `${Math.max(curX + 2, textX).toFixed(1)} 772 Td (${escapePdfText(
          col.title,
        )}) Tj`,
      );
      cmds.push('ET');
      curX += col.width;
    });

    // Data Rows
    let rowY = 744;
    pageRows.forEach((row, rIdx) => {
      const isOdd = rIdx % 2 === 1;

      // Alternating row background (#f8fafc)
      if (isOdd) {
        cmds.push('0.973 0.98 0.988 rg');
        cmds.push(`${marginX} ${rowY} ${tableWidth} 20 re f`);
      }

      // Row underline
      cmds.push('0.88 0.91 0.94 RG');
      cmds.push('0.5 w');
      cmds.push(
        `${marginX} ${rowY} m ${(marginX + tableWidth).toFixed(1)} ${rowY} l s`,
      );

      // Cell texts
      let cellX = marginX;
      row.forEach((cellVal, cIdx) => {
        const col = columns[cIdx];
        if (col) {
          const maxChars = Math.max(3, Math.floor(col.width / 5.2));
          let displayVal = String(cellVal || '');
          if (displayVal.length > maxChars) {
            displayVal = displayVal.slice(0, maxChars - 2) + '..';
          }

          cmds.push('BT');
          cmds.push('/F1 7.8 Tf');
          cmds.push('0.1 0.15 0.25 rg');
          const posX =
            col.align === 'center'
              ? cellX + col.width / 2 - displayVal.length * 2.0
              : cellX + 4;
          cmds.push(
            `${Math.max(cellX + 2, posX).toFixed(1)} ${(rowY + 6).toFixed(
              1,
            )} Td (${escapePdfText(displayVal)}) Tj`,
          );
          cmds.push('ET');
          cellX += col.width;
        }
      });

      rowY -= 20;
    });

    // Page Footer
    cmds.push('BT');
    cmds.push('/F1 8 Tf');
    cmds.push('0.55 0.6 0.65 rg');
    cmds.push(
      `20 22 Td (Page ${p + 1} of ${totalPages}   -   Confidential Document) Tj`,
    );
    cmds.push('ET');

    const streamBody = cmds.join('\n');
    const streamLen = streamBody.length;

    objects[pageObjId] = `${pageObjId} 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Contents ${contentObjId} 0 R /Resources << /Font << /F1 3 0 R /F2 4 0 R >> >> >>\nendobj\n`;
    objects[contentObjId] = `${contentObjId} 0 obj\n<< /Length ${streamLen} >>\nstream\n${streamBody}\nendstream\nendobj\n`;
  }

  // Set Pages object kids
  const kidsStr = pageObjIds.map(id => `${id} 0 R`).join(' ');
  objects[2] = `2 0 obj\n<< /Type /Pages /Kids [${kidsStr}] /Count ${totalPages} >>\nendobj\n`;

  // Assemble full PDF (7-bit ASCII byte-precise)
  const header = '%PDF-1.4\n%1234\n';
  const offsets: number[] = [];
  offsets[0] = 0;
  let offset = header.length;

  let body = '';
  for (let i = 1; i < objects.length; i++) {
    offsets[i] = offset + body.length;
    body += objects[i];
  }

  const startxref = offset + body.length;
  let xref = `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let i = 1; i < objects.length; i++) {
    const offStr = String(offsets[i]).padStart(10, '0');
    xref += `${offStr} 00000 n \n`;
  }

  const trailer = `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${startxref}\n%%EOF\n`;

  return header + body + xref + trailer;
};

// ================================================================
// CUSTOMER EXPORT
// ================================================================

export interface CustomerExportItem {
  id?: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  hasGstin?: boolean;
  gstin?: string;
  openingBalance?: number | string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export const downloadCustomers = async (
  customers: CustomerExportItem[],
  format: 'excel' | 'pdf' | 'csv' = 'pdf',
) => {
  if (!customers || customers.length === 0) {
    Alert.alert('No Data', 'There are no customer records to download.');
    return;
  }

  const timestamp = Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().slice(0, 10);

  try {
    if (format === 'pdf') {
      const columns: PDFTableColumn[] = [
        {title: '#', width: 22, align: 'center'},
        {title: 'Customer Name', width: 90},
        {title: 'Phone', width: 65},
        {title: 'Email', width: 95},
        {title: 'City', width: 50},
        {title: 'State', width: 55},
        {title: 'GSTIN', width: 68},
        {title: 'Balance (Rs)', width: 55, align: 'right'},
        {title: 'Bank', width: 55},
      ];

      const rows: string[][] = customers.map((c, idx) => [
        String(idx + 1),
        c.name || '-',
        c.phone || '-',
        c.email || '-',
        c.city || '-',
        c.state || '-',
        c.hasGstin && c.gstin ? c.gstin : '-',
        `Rs. ${Number(c.openingBalance || 0).toFixed(2)}`,
        c.bankName || '-',
      ]);

      const pdfData = generatePurePDF('CUSTOMER DIRECTORY', columns, rows);
      const fileName = `Customer_Directory_${dateStr}_${timestamp}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');

      Alert.alert(
        'Download Complete 📄',
        `PDF downloaded successfully (${customers.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    } else {
      // Excel / CSV format
      const headers = [
        '#',
        'Customer Name',
        'Phone',
        'Email',
        'Address',
        'City',
        'State',
        'Pincode',
        'GSTIN',
        'Opening Balance (INR)',
        'Bank Name',
        'Account Number',
        'IFSC Code',
      ];

      const csvRows = customers.map((c, idx) => [
        idx + 1,
        `"${(c.name || '').replace(/"/g, '""')}"`,
        `"${(c.phone || '').replace(/"/g, '""')}"`,
        `"${(c.email || '').replace(/"/g, '""')}"`,
        `"${(c.address || '').replace(/"/g, '""')}"`,
        `"${(c.city || '').replace(/"/g, '""')}"`,
        `"${(c.state || '').replace(/"/g, '""')}"`,
        `"${(c.pincode || '').replace(/"/g, '""')}"`,
        `"${(c.hasGstin && c.gstin ? c.gstin : 'N/A').replace(/"/g, '""')}"`,
        Number(c.openingBalance || 0).toFixed(2),
        `"${(c.bankName || '').replace(/"/g, '""')}"`,
        `"${(c.accountNumber || '').replace(/"/g, '""')}"`,
        `"${(c.ifscCode || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        headers.join(',') + '\n' + csvRows.map(r => r.join(',')).join('\n');

      const fileName = `Customer_Directory_${dateStr}_${timestamp}.csv`;
      const savedPath = await saveFileToDevice(fileName, csvContent, 'utf8');

      Alert.alert(
        'Download Complete 📊',
        `Customer records downloaded successfully (${customers.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    }
  } catch (err: any) {
    console.error('Customer export error:', err);
    Alert.alert('Download Error', err?.message || 'Unable to download file.');
  }
};

// ================================================================
// PRODUCT EXPORT
// ================================================================

export interface ProductExportItem {
  id?: string;
  name: string;
  sku?: string;
  category?: string;
  unit?: string;
  purchasePrice?: number;
  sellingPrice?: number;
  cgst?: string;
  sgst?: string;
  igst?: string;
  gstRate?: string;
  openingStock?: number;
  currentStock?: number;
  lowStockLevel?: number;
  hsnCode?: string;
  description?: string;
}

export const downloadProducts = async (
  products: ProductExportItem[],
  format: 'excel' | 'pdf' | 'csv' = 'pdf',
) => {
  if (!products || products.length === 0) {
    Alert.alert('No Data', 'There are no product records to download.');
    return;
  }

  const timestamp = Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().slice(0, 10);

  try {
    if (format === 'pdf') {
      const columns: PDFTableColumn[] = [
        {title: '#', width: 22, align: 'center'},
        {title: 'Product Name', width: 120},
        {title: 'SKU', width: 65},
        {title: 'Category', width: 70},
        {title: 'Unit', width: 38},
        {title: 'Purchase (Rs)', width: 62, align: 'right'},
        {title: 'Selling (Rs)', width: 62, align: 'right'},
        {title: 'GST', width: 38, align: 'center'},
        {title: 'Stock', width: 38, align: 'center'},
        {title: 'Min', width: 40, align: 'center'},
      ];

      const rows: string[][] = products.map((p, idx) => [
        String(idx + 1),
        p.name || '-',
        p.sku || '-',
        p.category || '-',
        p.unit || '-',
        `Rs. ${Number(p.purchasePrice || 0).toFixed(2)}`,
        `Rs. ${Number(p.sellingPrice || 0).toFixed(2)}`,
        p.gstRate || '-',
        String(p.currentStock ?? 0),
        String(p.lowStockLevel ?? 0),
      ]);

      const pdfData = generatePurePDF('PRODUCT DIRECTORY', columns, rows);
      const fileName = `Product_Directory_${dateStr}_${timestamp}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');

      Alert.alert(
        'Download Complete 📄',
        `PDF downloaded successfully (${products.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    } else {
      // Excel / CSV format
      const headers = [
        '#',
        'Product Name',
        'SKU',
        'Category',
        'Unit',
        'Purchase Price (INR)',
        'Selling Price (INR)',
        'GST Rate',
        'Opening Stock',
        'Current Stock',
        'Low Stock Level',
        'HSN Code',
        'Description',
      ];

      const csvRows = products.map((p, idx) => [
        idx + 1,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${(p.sku || '').replace(/"/g, '""')}"`,
        `"${(p.category || '').replace(/"/g, '""')}"`,
        `"${(p.unit || '').replace(/"/g, '""')}"`,
        Number(p.purchasePrice || 0).toFixed(2),
        Number(p.sellingPrice || 0).toFixed(2),
        `"${(p.gstRate || '').replace(/"/g, '""')}"`,
        p.openingStock ?? 0,
        p.currentStock ?? 0,
        p.lowStockLevel ?? 0,
        `"${(p.hsnCode || '').replace(/"/g, '""')}"`,
        `"${(p.description || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        headers.join(',') + '\n' + csvRows.map(r => r.join(',')).join('\n');

      const fileName = `Product_Directory_${dateStr}_${timestamp}.csv`;
      const savedPath = await saveFileToDevice(fileName, csvContent, 'utf8');

      Alert.alert(
        'Download Complete 📊',
        `Product records downloaded successfully (${products.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    }
  } catch (err: any) {
    console.error('Product export error:', err);
    Alert.alert('Download Error', err?.message || 'Unable to download file.');
  }
};

// ================================================================
// SUPPLIER EXPORT
// ================================================================

export interface SupplierExportItem {
  id?: string | number;
  name: string;
  phone?: string;
  mobile?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  hasGstin?: boolean;
  gstin?: string;
  openingBalance?: number | string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
}

export const downloadSuppliers = async (
  suppliers: SupplierExportItem[],
  format: 'excel' | 'pdf' | 'csv' = 'pdf',
) => {
  if (!suppliers || suppliers.length === 0) {
    Alert.alert('No Data', 'There are no supplier records to download.');
    return;
  }

  const timestamp = Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().slice(0, 10);

  try {
    if (format === 'pdf') {
      const columns: PDFTableColumn[] = [
        {title: '#', width: 22, align: 'center'},
        {title: 'Supplier Name', width: 90},
        {title: 'Phone', width: 65},
        {title: 'Email', width: 95},
        {title: 'City', width: 50},
        {title: 'State', width: 55},
        {title: 'GSTIN', width: 68},
        {title: 'Balance (Rs)', width: 55, align: 'right'},
        {title: 'Bank', width: 55},
      ];

      const rows: string[][] = suppliers.map((s, idx) => [
        String(idx + 1),
        s.name || '-',
        s.phone || s.mobile || '-',
        s.email || '-',
        s.city || '-',
        s.state || '-',
        s.hasGstin && s.gstin ? s.gstin : s.gstin ? s.gstin : '-',
        `Rs. ${Number(s.openingBalance || 0).toFixed(2)}`,
        s.bankName || '-',
      ]);

      const pdfData = generatePurePDF('SUPPLIER DIRECTORY', columns, rows);
      const fileName = `Supplier_Directory_${dateStr}_${timestamp}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');

      Alert.alert(
        'Download Complete 📄',
        `PDF downloaded successfully (${suppliers.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    } else {
      // Excel / CSV format
      const headers = [
        '#',
        'Supplier Name',
        'Phone',
        'Email',
        'Address',
        'City',
        'State',
        'Pincode',
        'GSTIN',
        'Opening Balance (INR)',
        'Bank Name',
        'Account Number',
        'IFSC Code',
      ];

      const csvRows = suppliers.map((s, idx) => [
        idx + 1,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.phone || s.mobile || '').replace(/"/g, '""')}"`,
        `"${(s.email || '').replace(/"/g, '""')}"`,
        `"${(s.address || '').replace(/"/g, '""')}"`,
        `"${(s.city || '').replace(/"/g, '""')}"`,
        `"${(s.state || '').replace(/"/g, '""')}"`,
        `"${(s.pincode || '').replace(/"/g, '""')}"`,
        `"${(s.gstin || 'N/A').replace(/"/g, '""')}"`,
        Number(s.openingBalance || 0).toFixed(2),
        `"${(s.bankName || '').replace(/"/g, '""')}"`,
        `"${(s.accountNumber || '').replace(/"/g, '""')}"`,
        `"${(s.ifscCode || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        headers.join(',') + '\n' + csvRows.map(r => r.join(',')).join('\n');

      const fileName = `Supplier_Directory_${dateStr}_${timestamp}.csv`;
      const savedPath = await saveFileToDevice(fileName, csvContent, 'utf8');

      Alert.alert(
        'Download Complete 📊',
        `Supplier records downloaded successfully (${suppliers.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    }
  } catch (err: any) {
    console.error('Supplier export error:', err);
    Alert.alert('Download Error', err?.message || 'Unable to download file.');
  }
};

// ================================================================
// CATEGORY EXPORT
// ================================================================

export interface CategoryExportItem {
  id?: string | number;
  categoryName?: string;
  name?: string;
  description?: string;
  status?: string;
}

export const downloadCategories = async (
  categories: CategoryExportItem[],
  format: 'excel' | 'pdf' | 'csv' = 'pdf',
) => {
  if (!categories || categories.length === 0) {
    Alert.alert('No Data', 'There are no category records to download.');
    return;
  }

  const timestamp = Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().slice(0, 10);

  try {
    if (format === 'pdf') {
      const columns: PDFTableColumn[] = [
        {title: '#', width: 35, align: 'center'},
        {title: 'Category Name', width: 380},
        {title: 'Status', width: 85, align: 'center'},
      ];

      const rows: string[][] = categories.map((c, idx) => [
        String(idx + 1),
        c.categoryName || c.name || '-',
        (c.status || 'Active').toUpperCase(),
      ]);

      const pdfData = generatePurePDF('PRODUCT CATEGORY DIRECTORY', columns, rows);
      const fileName = `Category_Directory_${dateStr}_${timestamp}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');

      Alert.alert(
        'Download Complete 📄',
        `PDF downloaded successfully (${categories.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    } else {
      // Excel / CSV format
      const headers = ['#', 'Category Name', 'Status'];

      const csvRows = categories.map((c, idx) => [
        idx + 1,
        `"${(c.categoryName || c.name || '').replace(/"/g, '""')}"`,
        `"${(c.status || 'Active').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        headers.join(',') + '\n' + csvRows.map(r => r.join(',')).join('\n');

      const fileName = `Category_Directory_${dateStr}_${timestamp}.csv`;
      const savedPath = await saveFileToDevice(fileName, csvContent, 'utf8');

      Alert.alert(
        'Download Complete 📊',
        `Category records downloaded successfully (${categories.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    }
  } catch (err: any) {
    console.error('Category export error:', err);
    Alert.alert('Download Error', err?.message || 'Unable to download file.');
  }
};

// ================================================================
// UNIT EXPORT
// ================================================================

export interface UnitExportItem {
  id?: string | number;
  name: string;
  unit: string;
  description?: string;
}

export const downloadUnits = async (
  units: UnitExportItem[],
  format: 'excel' | 'pdf' | 'csv' = 'pdf',
) => {
  if (!units || units.length === 0) {
    Alert.alert('No Data', 'There are no unit records to download.');
    return;
  }

  const timestamp = Date.now().toString().slice(-4);
  const dateStr = new Date().toISOString().slice(0, 10);

  try {
    if (format === 'pdf') {
      const columns: PDFTableColumn[] = [
        {title: '#', width: 25, align: 'center'},
        {title: 'Unit Name', width: 140},
        {title: 'Symbol / Code', width: 90, align: 'center'},
        {title: 'Description', width: 270},
      ];

      const rows: string[][] = units.map((u, idx) => [
        String(idx + 1),
        u.name || '-',
        u.unit || '-',
        u.description || '-',
      ]);

      const pdfData = generatePurePDF('UNIT DIRECTORY', columns, rows);
      const fileName = `Unit_Directory_${dateStr}_${timestamp}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');

      Alert.alert(
        'Download Complete 📄',
        `PDF downloaded successfully (${units.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    } else {
      // Excel / CSV format
      const headers = ['#', 'Unit Name', 'Symbol / Code', 'Description'];

      const csvRows = units.map((u, idx) => [
        idx + 1,
        `"${(u.name || '').replace(/"/g, '""')}"`,
        `"${(u.unit || '').replace(/"/g, '""')}"`,
        `"${(u.description || '').replace(/"/g, '""')}"`,
      ]);

      const csvContent =
        headers.join(',') + '\n' + csvRows.map(r => r.join(',')).join('\n');

      const fileName = `Unit_Directory_${dateStr}_${timestamp}.csv`;
      const savedPath = await saveFileToDevice(fileName, csvContent, 'utf8');

      Alert.alert(
        'Download Complete 📊',
        `Unit records downloaded successfully (${units.length} records).\n\nFile Name: ${fileName}\n\nSaved to:\n${savedPath}`,
        [{text: 'OK'}],
      );
    }
  } catch (err: any) {
    console.error('Unit export error:', err);
    Alert.alert('Download Error', err?.message || 'Unable to download file.');
  }
};



