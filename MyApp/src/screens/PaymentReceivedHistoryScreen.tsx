import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import {
  loadPaymentReceivedRecords,
  deletePaymentReceivedRecord,
  PaymentReceivedRecord,
} from '../utils/paymentReceivedStore';
import { generatePurePDF, saveFileToDevice } from '../utils/exportHelper';

type Props = {
  navigation: any;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Vector Back Arrow Icon matching the screenshot style
const BackArrowIcon = () => (
  <View style={{ width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ position: 'absolute', width: 11, height: 2, backgroundColor: '#0f172a', borderRadius: 1 }} />
    <View
      style={{
        position: 'absolute',
        left: 3,
        width: 6.5,
        height: 6.5,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#0f172a',
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }],
      }}
    />
  </View>
);

const DocumentIcon = () => (
  <View style={{ width: 20, height: 22, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 16, height: 19, borderWidth: 2, borderColor: '#ffffff', borderRadius: 3, padding: 2 }}>
      <View style={{ width: 8, height: 1.8, backgroundColor: '#ffffff', marginBottom: 2.5 }} />
      <View style={{ width: 10, height: 1.8, backgroundColor: '#ffffff', marginBottom: 2.5 }} />
      <View style={{ width: 6, height: 1.8, backgroundColor: '#ffffff' }} />
    </View>
  </View>
);

const EyeIcon = ({ size = 15, color = '#6366f1' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.85,
        height: size * 0.85,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: size * 0.6,
        borderBottomRightRadius: size * 0.6,
        borderTopRightRadius: size * 0.1,
        borderBottomLeftRadius: size * 0.1,
        transform: [{ rotate: '45deg' }],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.2,
          backgroundColor: color,
        }}
      />
    </View>
  </View>
);

const PencilIcon = ({ size = 15, color = '#ea7e30' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.85,
        height: size * 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: '45deg' }],
      }}>
      <View
        style={{
          width: size * 0.36,
          height: size * 0.14,
          borderWidth: 1.2,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: 1.5,
          borderTopRightRadius: 1.5,
          marginBottom: 0.5,
        }}
      />
      <View
        style={{
          width: size * 0.36,
          height: size * 0.44,
          borderWidth: 1.2,
          borderColor: color,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.18,
          borderRightWidth: size * 0.18,
          borderTopWidth: size * 0.22,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }}
      />
    </View>
  </View>
);

const DustbinIcon = ({ size = 15, color = '#ef4444' }: { size?: number; color?: string }) => (
  <View style={{ width: size, height: size + 2, alignItems: 'center', justifyContent: 'center' }}>
    <View
      style={{
        width: size * 0.36,
        height: 1.5,
        backgroundColor: color,
        borderRadius: 1,
        marginBottom: 1,
      }}
    />
    <View
      style={{
        width: size * 0.75,
        height: size * 0.65,
        borderWidth: 1.2,
        borderColor: color,
        borderTopWidth: 0,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      }}>
      <View style={{ width: 1, height: size * 0.35, backgroundColor: color }} />
      <View style={{ width: 1, height: size * 0.35, backgroundColor: color }} />
    </View>
  </View>
);

const ITEMS_PER_PAGE = 10;

const numberToWords = (num: number) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number) => {
    let numStr = n.toString();
    if (numStr.length > 9) return 'overflow';
    let nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArray) return '';
    let str = '';
    str += (nArray[1] !== '00') ? (a[Number(nArray[1])] || b[Number(nArray[1][0])] + ' ' + a[Number(nArray[1][1])]) + 'Crore ' : '';
    str += (nArray[2] !== '00') ? (a[Number(nArray[2])] || b[Number(nArray[2][0])] + ' ' + a[Number(nArray[2][1])]) + 'Lakh ' : '';
    str += (nArray[3] !== '00') ? (a[Number(nArray[3])] || b[Number(nArray[3][0])] + ' ' + a[Number(nArray[3][1])]) + 'Thousand ' : '';
    str += (nArray[4] !== '0') ? (a[Number(nArray[4])] || b[Number(nArray[4][0])] + ' ' + a[Number(nArray[4][1])]) + 'Hundred ' : '';
    str += (nArray[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(nArray[5])] || b[Number(nArray[5][0])] + ' ' + a[Number(nArray[5][1])]) : '';
    return str.trim();
  };

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  if (intPart === 0 && decPart === 0) return 'Zero Rupees Only';

  let result = inWords(intPart) + ' Rupees';
  if (decPart > 0) {
    result += ' and ' + inWords(decPart) + ' Paise';
  }
  return result + ' Only';
};

const PaymentReceivedHistoryScreen = ({ navigation }: Props) => {
  const [records, setRecords] = useState<PaymentReceivedRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<PaymentReceivedRecord | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  const fetchRecords = async () => {
    const data = await loadPaymentReceivedRecords();
    setRecords(data);
  };

  const handleDelete = (id: string, voucherNo: string) => {
    Alert.alert(
      'Delete Payment Received',
      `Are you sure you want to delete payment receipt ${voucherNo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deletePaymentReceivedRecord(id);
            setRecords([...updated]);
          },
        },
      ],
    );
  };

  const handleEdit = (record: PaymentReceivedRecord) => {
    navigation.navigate('PaymentReceived', { editItem: record });
  };

  useEffect(() => {
    fetchRecords();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      fetchRecords();
    });
    return unsubscribe;
  }, [navigation]);

  const filteredRecords = records.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const noteText = (p.notes || p.note || p.remarks || p.description || '');
    return (
      (p.customerName && p.customerName.toLowerCase().includes(q)) ||
      (p.voucherNo && p.voucherNo.toLowerCase().includes(q)) ||
      (p.invoiceNo && p.invoiceNo.toLowerCase().includes(q)) ||
      (p.customerPhone && p.customerPhone.includes(q)) ||
      (p.customerEmail && p.customerEmail.toLowerCase().includes(q)) ||
      (p.customerAddress && p.customerAddress.toLowerCase().includes(q)) ||
      (p.referenceNumber && p.referenceNumber.toLowerCase().includes(q)) ||
      (p.paymentMode && p.paymentMode.toLowerCase().includes(q)) ||
      (p.paymentDate && p.paymentDate.toLowerCase().includes(q)) ||
      (noteText && noteText.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredRecords.length);
  const currentRecords = filteredRecords.slice(startIndex, endIndex);

  const getModeBadge = (mode: string) => {
    const m = (mode || '').toLowerCase();
    if (m === 'upi') {
      return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
    }
    if (m === 'cash') {
      return { bg: '#fff7ed', text: '#c2410c', border: '#fed7aa' };
    }
    if (m === 'net banking' || m === 'bank transfer') {
      return { bg: '#eff6ff', text: '#1d4ed8', border: '#bfdbfe' };
    }
    if (m === 'cheque') {
      return { bg: '#f5f3ff', text: '#6d28d9', border: '#ddd6fe' };
    }
    if (m === 'card') {
      return { bg: '#fdf2f8', text: '#be185d', border: '#fbcfe8' };
    }
    return { bg: '#f1f5f9', text: '#475569', border: '#e2e8f0' };
  };

  const handleExportPDF = async () => {
    try {
      setDownloadMenuVisible(false);
      const columns = [
        { title: '#', width: 20, align: 'center' as const },
        { title: 'Voucher No', width: 68 },
        { title: 'Date', width: 55 },
        { title: 'Customer Name', width: 85 },
        { title: 'Phone', width: 55 },
        { title: 'Against Inv', width: 55 },
        { title: 'Mode', width: 45 },
        { title: 'Reference No', width: 60 },
        { title: 'Notes', width: 65 },
        { title: 'Received', width: 50, align: 'right' as const },
      ];

      const rows: string[][] = filteredRecords.map((item, idx) => [
        String(idx + 1),
        item.voucherNo || '-',
        item.paymentDate || '-',
        item.customerName || '-',
        item.customerPhone || '-',
        item.invoiceNo || '-',
        item.paymentMode || '-',
        item.referenceNumber || '-',
        item.notes || item.note || item.remarks || item.description || '-',
        `Rs. ${Number(item.receivedAmount).toLocaleString('en-IN')}`,
      ]);

      const pdfData = generatePurePDF('PAYMENT RECEIVED REPORT', columns, rows);
      const fileName = `Payment_Received_Report_${Date.now()}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');
      Alert.alert('Report Exported 📄', `Payment received report saved successfully!\n\nPath: ${savedPath}`);
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export report.');
    }
  };

  const handleExportSingleReceipt = async (record: PaymentReceivedRecord) => {
    try {
      const noteContent = record.notes || record.note || record.remarks || record.description || '-';
      const columns = [
        { title: 'Field', width: 140 },
        { title: 'Details', width: 360 },
      ];
      const rows: string[][] = [
        ['Voucher No', record.voucherNo || '-'],
        ['Payment Date', record.paymentDate || '-'],
        ['Customer Name', record.customerName || '-'],
        ['Customer Phone', record.customerPhone || '-'],
        ['Customer Address', record.customerAddress || '-'],
        ['Against Invoice', record.invoiceNo || 'None / Advance'],
        ['Payment Mode', record.paymentMode || 'Cash'],
        ['Reference Number', record.referenceNumber || '-'],
        ['Amount Received', `Rs. ${Number(record.receivedAmount).toLocaleString('en-IN')}`],
        ['Amount in Words', numberToWords(Number(record.receivedAmount))],
        ['Notes / Remarks', noteContent],
      ];

      const pdfData = generatePurePDF(`PAYMENT RECEIPT - ${record.voucherNo}`, columns, rows);
      const fileName = `Receipt_${record.voucherNo}.pdf`;
      const savedPath = await saveFileToDevice(fileName, pdfData, 'utf8');
      Alert.alert('Receipt Downloaded 📄', `Receipt saved successfully!\n\nPath: ${savedPath}`);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to download receipt.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* ================================================= */}
      {/* 1. HEADER (MATCHING SCREENSHOT)                   */}
      {/* ================================================= */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>Payment Received History</Text>
        </View>
      </View>

      {/* ================================================= */}
      {/* 2. SEARCH & EXPORT ROW                            */}
      {/* ================================================= */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search invoice, customer, payment..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={t => {
              setSearchQuery(t);
              setCurrentPage(1);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.8}
          onPress={() => setDownloadMenuVisible(true)}>
          <DocumentIcon />
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* 3. SWIPE HINT                                     */}
      {/* ================================================= */}
      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintArrow}>➔</Text>
        <Text style={styles.swipeHintText}>
          Swipe the table to see all columns
        </Text>
      </View>

      {/* ================================================= */}
      {/* 4. MAIN DATA TABLE CARD (HORIZONTALLY SCROLLABLE) */}
      {/* ================================================= */}
      <View style={styles.tableCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalTableScroll}>
          <View>
            {/* TABLE HEADER */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
              <Text style={[styles.columnHeader, styles.colVoucher]}>VOUCHER NO.</Text>
              <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
              <Text style={[styles.columnHeader, styles.colCustomer]}>CUSTOMER</Text>
              <Text style={[styles.columnHeader, styles.colPhone]}>PHONE</Text>
              <Text style={[styles.columnHeader, styles.colEmail]}>EMAIL</Text>
              <Text style={[styles.columnHeader, styles.colAddress]}>ADDRESS</Text>
              <Text style={[styles.columnHeader, styles.colInvoice]}>AGAINST INVOICE</Text>
              <Text style={[styles.columnHeader, styles.colMode]}>PAYMENT MODE</Text>
              <Text style={[styles.columnHeader, styles.colRef]}>REFERENCE NO.</Text>
              <Text style={[styles.columnHeader, styles.colAmount]}>AMOUNT RECEIVED</Text>
              <Text style={[styles.columnHeader, styles.colNotes]}>NOTES</Text>
              <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentRecords.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const modeBadge = getModeBadge(item.paymentMode);

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.tableRow,
                    index === currentRecords.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* Voucher No. Column */}
                  <View style={styles.colVoucher}>
                    <Text style={styles.cellVoucherText}>{item.voucherNo}</Text>
                  </View>

                  {/* Date Column */}
                  <View style={styles.colDate}>
                    <Text style={styles.cellDateText}>{item.paymentDate}</Text>
                  </View>

                  {/* Customer Column */}
                  <View style={styles.colCustomer}>
                    <Text style={styles.cellCustomerText} numberOfLines={1}>
                      {item.customerName}
                    </Text>
                  </View>

                  {/* Phone Column */}
                  <View style={styles.colPhone}>
                    <Text style={styles.cellMutedText}>{item.customerPhone || '-'}</Text>
                  </View>

                  {/* Email Column */}
                  <View style={styles.colEmail}>
                    <Text style={styles.cellMutedText} numberOfLines={1}>
                      {item.customerEmail || '-'}
                    </Text>
                  </View>

                  {/* Address Column */}
                  <View style={styles.colAddress}>
                    <Text style={styles.cellMutedText} numberOfLines={1}>
                      {item.customerAddress || '-'}
                    </Text>
                  </View>

                  {/* Against Invoice Column */}
                  <View style={styles.colInvoice}>
                    <Text style={styles.cellInvoiceText}>
                      {item.invoiceNo || 'Advance'}
                    </Text>
                  </View>

                  {/* Payment Mode Column */}
                  <View style={styles.colMode}>
                    <View style={[styles.statusBadge, { backgroundColor: modeBadge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: modeBadge.text }]}>
                        {item.paymentMode}
                      </Text>
                    </View>
                  </View>

                  {/* Reference No. Column */}
                  <View style={styles.colRef}>
                    <Text style={styles.cellMutedText} numberOfLines={1}>
                      {item.referenceNumber || '-'}
                    </Text>
                  </View>

                  {/* Amount Received Column */}
                  <View style={styles.colAmount}>
                    <Text style={styles.cellAmountText}>
                      ₹{Number(item.receivedAmount).toLocaleString('en-IN')}
                    </Text>
                  </View>

                  {/* Notes Column */}
                  <View style={styles.colNotes}>
                    <Text style={styles.cellMutedText} numberOfLines={1}>
                      {item.notes || item.note || item.remarks || item.description || '-'}
                    </Text>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      onPress={() => {
                        setSelectedRecord(item);
                        setViewModalVisible(true);
                      }}
                      style={[styles.actionBtn, { backgroundColor: '#eef2ff' }]}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <EyeIcon size={14} color="#6366f1" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleEdit(item)}
                      style={[styles.actionBtn, { backgroundColor: '#fff7ed' }]}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(item.id, item.voucherNo)}
                      style={[styles.actionBtn, { backgroundColor: '#fef2f2' }]}
                      activeOpacity={0.7}
                      hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentRecords.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No payment received records found.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Scroll Bar Track Indicator */}
        <View style={styles.scrollTrack}>
          <View style={styles.scrollThumb} />
        </View>

        {/* 5. PAGINATION FOOTER */}
        {filteredRecords.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredRecords.length}`}
            </Text>

            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  safeCurrentPage <= 1 && styles.pageBtnDisabled,
                ]}
                disabled={safeCurrentPage <= 1}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <Text
                  style={[
                    styles.pageBtnText,
                    safeCurrentPage <= 1 && styles.pageBtnTextDisabled,
                  ]}>
                  ‹
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageCountText}>
                {safeCurrentPage}/{totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  safeCurrentPage >= totalPages && styles.pageBtnDisabled,
                ]}
                disabled={safeCurrentPage >= totalPages}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <Text
                  style={[
                    styles.pageBtnText,
                    safeCurrentPage >= totalPages && styles.pageBtnTextDisabled,
                  ]}>
                  ›
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ================================================= */}
      {/* 6. FLOATING ADD BUTTON                            */}
      {/* ================================================= */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('PaymentReceived')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* ================================================= */}
      {/* 7. VIEW RECEIPT VOUCHER MODAL                     */}
      {/* ================================================= */}
      <Modal
        visible={viewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.receiptModalCard}>
            {selectedRecord && (
              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modal Header */}
                <View style={styles.receiptHeader}>
                  <View>
                    <Text style={styles.receiptTitle}>Payment Receipt</Text>
                    <Text style={styles.receiptVoucherNo}>{selectedRecord.voucherNo}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setViewModalVisible(false)}
                    style={styles.closeModalBtn}>
                    <Text style={styles.closeModalBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Amount Banner */}
                <View style={styles.receiptAmountBanner}>
                  <Text style={styles.receiptAmountLabel}>TOTAL AMOUNT RECEIVED</Text>
                  <Text style={styles.receiptAmountValue}>₹{Number(selectedRecord.receivedAmount).toLocaleString('en-IN')}</Text>
                  <Text style={styles.receiptWordsText}>{numberToWords(Number(selectedRecord.receivedAmount))}</Text>
                </View>

                {/* Meta Rows */}
                <View style={styles.receiptSection}>
                  <Text style={styles.sectionHeader}>Customer Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Customer Name:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.customerName}</Text>
                  </View>
                  {!!selectedRecord.customerPhone && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone Number:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.customerPhone}</Text>
                    </View>
                  )}
                  {!!selectedRecord.customerEmail && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email Address:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.customerEmail}</Text>
                    </View>
                  )}
                  {!!selectedRecord.customerAddress && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.customerAddress}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.receiptSection}>
                  <Text style={styles.sectionHeader}>Transaction Details</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Date:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.paymentDate}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Against Invoice:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.invoiceNo || 'None / Advance'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Mode:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.paymentMode}</Text>
                  </View>
                  {!!selectedRecord.referenceNumber && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Reference No:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.referenceNumber}</Text>
                    </View>
                  )}
                  {!!(selectedRecord.notes || selectedRecord.note || selectedRecord.remarks || selectedRecord.description) && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Notes:</Text>
                      <Text style={styles.detailValue}>
                        {selectedRecord.notes || selectedRecord.note || selectedRecord.remarks || selectedRecord.description}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Actions Inside Modal */}
                <View style={styles.receiptActionsRow}>
                  <TouchableOpacity
                    style={styles.downloadReceiptBtn}
                    onPress={() => handleExportSingleReceipt(selectedRecord)}>
                    <Text style={styles.downloadReceiptBtnText}>📥 Download PDF Receipt</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* ================================================= */}
      {/* 8. EXPORT / DOWNLOAD MENU MODAL                   */}
      {/* ================================================= */}
      <Modal
        visible={downloadMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDownloadMenuVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDownloadMenuVisible(false)}>
          <View style={styles.exportMenuCard}>
            <Text style={styles.exportMenuTitle}>Export Report</Text>
            <TouchableOpacity style={styles.exportOptionRow} onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={styles.exportOptionText}>Download as PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentReceivedHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // 1. HEADER
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 24) + 6) : 10,
    paddingBottom: 8,
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  headerTitleArea: {
    flex: 1,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: -0.2,
  },

  // 2. SEARCH & EXPORT ROW
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },

  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  searchIcon: {
    fontSize: 15,
    color: '#94a3b8',
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    paddingVertical: 0,
  },

  clearBtn: {
    padding: 4,
  },

  clearBtnText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: '700',
  },

  exportButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#ea7e30',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  // 3. SWIPE HINT
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  swipeHintArrow: {
    color: '#ea7e30',
    fontSize: 14,
    fontWeight: '800',
    marginRight: 6,
  },

  swipeHintText: {
    color: '#ea7e30',
    fontSize: 12,
    fontWeight: '600',
  },

  // 4. TABLE CARD
  tableCard: {
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    marginBottom: 80,
  },

  horizontalTableScroll: {
    minWidth: '100%',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingVertical: 14,
    borderBottomWidth: 1.5,
    borderBottomColor: '#fed7aa',
  },

  columnHeader: {
    fontSize: 12,
    fontWeight: '800',
    color: '#c2410c',
    letterSpacing: 0.5,
  },

  // Column Widths
  colIndex: {
    width: 45,
    paddingLeft: 14,
  },

  colVoucher: {
    width: 140,
    paddingHorizontal: 6,
  },

  colDate: {
    width: 110,
    paddingHorizontal: 6,
  },

  colCustomer: {
    width: 170,
    paddingHorizontal: 6,
  },

  colPhone: {
    width: 120,
    paddingHorizontal: 6,
  },

  colEmail: {
    width: 150,
    paddingHorizontal: 6,
  },

  colAddress: {
    width: 170,
    paddingHorizontal: 6,
  },

  colInvoice: {
    width: 130,
    paddingHorizontal: 6,
  },

  colMode: {
    width: 120,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
  },

  colRef: {
    width: 140,
    paddingHorizontal: 6,
  },

  colAmount: {
    width: 130,
    paddingHorizontal: 6,
  },

  colNotes: {
    width: 150,
    paddingHorizontal: 6,
  },

  colActions: {
    width: 120,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 6,
    gap: 8,
  },

  // Table Body Rows
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  cellIndexText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },

  cellVoucherText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },

  cellDateText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  cellCustomerText: {
    fontSize: 13.5,
    color: '#1e293b',
    fontWeight: '600',
  },

  cellMutedText: {
    fontSize: 13,
    color: '#64748b',
  },

  cellInvoiceText: {
    fontSize: 13,
    color: '#6366f1',
    fontWeight: '600',
  },

  cellAmountText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },

  // Status / Mode Badges
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  // Action Buttons
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTable: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 13.5,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  // Scroll Track Indicator
  scrollTrack: {
    height: 3,
    backgroundColor: '#f1f5f9',
    width: '100%',
  },

  scrollThumb: {
    height: 3,
    backgroundColor: '#ea7e30',
    width: '30%',
    borderRadius: 2,
  },

  // 5. PAGINATION FOOTER
  paginationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  paginationInfoText: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '600',
  },

  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  pageBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  pageBtnDisabled: {
    opacity: 0.4,
  },

  pageBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
  },

  pageBtnTextDisabled: {
    color: '#94a3b8',
  },

  pageCountText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 4,
  },

  // 6. FLOATING ADD BUTTON
  floatingAddButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 6,
  },

  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  addIconV: {
    position: 'absolute',
    width: 3,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // 7. MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  receiptModalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },

  receiptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },

  receiptTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },

  receiptVoucherNo: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea7e30',
    marginTop: 2,
  },

  closeModalBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeModalBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748b',
  },

  receiptAmountBanner: {
    backgroundColor: '#fff7ed',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 14,
  },

  receiptAmountLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#c2410c',
    letterSpacing: 0.5,
  },

  receiptAmountValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ea7e30',
    marginTop: 2,
  },

  receiptWordsText: {
    fontSize: 11,
    color: '#7c2d12',
    fontStyle: 'italic',
    marginTop: 2,
  },

  receiptSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },

  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 4,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 12,
    color: '#0f172a',
    fontWeight: '600',
    maxWidth: '65%',
    textAlign: 'right',
  },

  receiptActionsRow: {
    marginTop: 10,
  },

  downloadReceiptBtn: {
    height: 44,
    backgroundColor: '#ea7e30',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  downloadReceiptBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // 8. EXPORT MENU MODAL
  exportMenuCard: {
    width: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    elevation: 8,
  },

  exportMenuTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 12,
    textAlign: 'center',
  },

  exportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    marginBottom: 8,
    gap: 10,
  },

  exportOptionIcon: {
    fontSize: 18,
  },

  exportOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
});
