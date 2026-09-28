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
  loadPaymentPaidRecords,
  deletePaymentPaidRecord,
  PaymentPaidRecord,
} from '../utils/paymentPaidStore';
import { generatePurePDF, saveFileToDevice } from '../utils/exportHelper';

type Props = {
  navigation: any;
};

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Professional vector back arrow icon matching other history pages
const BackArrowIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ position: 'absolute', width: 14, height: 2.6, backgroundColor: '#1e293b', borderRadius: 1.3 }} />
    <View
      style={{
        position: 'absolute',
        left: 4,
        width: 9,
        height: 9,
        borderLeftWidth: 2.6,
        borderTopWidth: 2.6,
        borderColor: '#1e293b',
        borderRadius: 1.2,
        transform: [{ rotate: '-45deg' }],
      }}
    />
  </View>
);

const DocumentIcon = () => (
  <View style={{ width: 18, height: 20, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 14, height: 17, borderWidth: 1.8, borderColor: '#ffffff', borderRadius: 2, padding: 2 }}>
      <View style={{ width: 7, height: 1.5, backgroundColor: '#ffffff', marginBottom: 2 }} />
      <View style={{ width: 9, height: 1.5, backgroundColor: '#ffffff', marginBottom: 2 }} />
      <View style={{ width: 6, height: 1.5, backgroundColor: '#ffffff' }} />
    </View>
  </View>
);

const EyeIcon = ({ size = 14, color = '#6366f1' }: { size?: number; color?: string }) => (
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

const PencilIcon = ({ size = 14, color = '#ea7e30' }: { size?: number; color?: string }) => (
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

const DustbinIcon = ({ size = 14, color = '#ef4444' }: { size?: number; color?: string }) => (
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

const PaymentPaidHistoryScreen = ({ navigation }: Props) => {
  const [records, setRecords] = useState<PaymentPaidRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState<PaymentPaidRecord | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  const fetchRecords = async () => {
    const data = await loadPaymentPaidRecords();
    setRecords(data);
  };

  const handleDelete = (id: string, voucherNo: string) => {
    Alert.alert(
      'Delete Payment Record',
      `Are you sure you want to delete payment record ${voucherNo}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deletePaymentPaidRecord(id);
            setRecords([...updated]);
          },
        },
      ],
    );
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
    return (
      (p.supplierName && p.supplierName.toLowerCase().includes(q)) ||
      (p.voucherNo && p.voucherNo.toLowerCase().includes(q)) ||
      (p.billNo && p.billNo.toLowerCase().includes(q)) ||
      (p.supplierPhone && p.supplierPhone.includes(q)) ||
      (p.supplierEmail && p.supplierEmail.toLowerCase().includes(q)) ||
      (p.supplierGSTIN && p.supplierGSTIN.toLowerCase().includes(q)) ||
      (p.supplierAddress && p.supplierAddress.toLowerCase().includes(q)) ||
      (p.transactionNo && p.transactionNo.toLowerCase().includes(q)) ||
      (p.paymentMode && p.paymentMode.toLowerCase().includes(q)) ||
      (p.paymentDate && p.paymentDate.includes(q)) ||
      (p.remarks && p.remarks.toLowerCase().includes(q))
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
      const targetList = filteredRecords.length > 0 ? filteredRecords : records;
      if (targetList.length === 0) {
        Alert.alert('Export', 'No payment records available to export.');
        return;
      }
      const columns = [
        { title: '#', width: 25, align: 'center' as const },
        { title: 'Voucher No', width: 85 },
        { title: 'Date', width: 75 },
        { title: 'Supplier Name', width: 120 },
        { title: 'Bill No', width: 75 },
        { title: 'Bill Amt', width: 70, align: 'right' as const },
        { title: 'Amount Paid', width: 75, align: 'right' as const },
        { title: 'Remaining', width: 70, align: 'right' as const },
        { title: 'Mode', width: 55, align: 'center' as const },
      ];
      const rows = targetList.map((p, idx) => [
        String(idx + 1),
        p.voucherNo || `PAY-${p.id}`,
        p.paymentDate || '-',
        p.supplierName || 'General Supplier',
        p.billNo || '-',
        `Rs. ${Number(p.billAmount || 0).toLocaleString('en-IN')}`,
        `Rs. ${Number(p.paymentAmount || 0).toLocaleString('en-IN')}`,
        `Rs. ${Number(p.remainingAmount || 0).toLocaleString('en-IN')}`,
        p.paymentMode || 'UPI',
      ]);
      const pdfBase64 = generatePurePDF('Payment Paid History Report', columns, rows);
      const filename = `PaymentPaid_History_${Date.now()}.pdf`;
      const filePath = await saveFileToDevice(filename, pdfBase64, 'base64');
      Alert.alert('Export Successful', `Saved report to:\n${filePath}`);
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ================================================= */}
      {/* 1. HEADER (MATCHING OTHER HISTORY PAGES)          */}
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
          <Text style={styles.headerTitle}>Payment Paid History</Text>
        </View>
      </View>

      {/* ================================================= */}
      {/* 2. SEARCH BAR & EXPORT BUTTON                     */}
      {/* ================================================= */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search payment paid history..."
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
              style={styles.clearBtn}
              activeOpacity={0.7}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.85}
          onPress={() => setDownloadMenuVisible(true)}>
          <DocumentIcon />
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* 3. SWIPE HINT                                     */}
      {/* ================================================= */}
      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintArrow}>➔</Text>
        <Text style={styles.swipeHintText}>Swipe the table to see all columns</Text>
      </View>

      {/* ================================================= */}
      {/* 4. MAIN DATA TABLE CARD                           */}
      {/* ================================================= */}
      <View style={styles.tableCard}>
        {filteredRecords.length === 0 ? (
          <View style={styles.emptyTable}>
            <Text style={styles.emptyIcon}>💳</Text>
            <Text style={styles.emptyTitle}>No Payment Records Found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'No matching payment records for your search'
                : 'No payment records available'}
            </Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalTableScroll}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                {/* TABLE HEADER */}
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
                  <Text style={[styles.columnHeader, styles.colVoucher]}>VOUCHER NO.</Text>
                  <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
                  <Text style={[styles.columnHeader, styles.colSupplier]}>SUPPLIER NAME</Text>
                  <Text style={[styles.columnHeader, styles.colPhone]}>PHONE NUMBER</Text>
                  <Text style={[styles.columnHeader, styles.colEmail]}>EMAIL ADDRESS</Text>
                  <Text style={[styles.columnHeader, styles.colGstin]}>GSTIN / TAX ID</Text>
                  <Text style={[styles.columnHeader, styles.colAddress]}>SUPPLIER ADDRESS</Text>
                  <Text style={[styles.columnHeader, styles.colBillNo]}>PURCHASE / BILL #</Text>
                  <Text style={[styles.columnHeader, styles.colBillAmt]}>BILL AMT</Text>
                  <Text style={[styles.columnHeader, styles.colPrevPaid]}>PREV PAID</Text>
                  <Text style={[styles.columnHeader, styles.colPaidAmt]}>AMOUNT PAID</Text>
                  <Text style={[styles.columnHeader, styles.colRemaining]}>REMAINING</Text>
                  <Text style={[styles.columnHeader, styles.colMode]}>PAYMENT MODE</Text>
                  <Text style={[styles.columnHeader, styles.colTxn]}>TRANSACTION / REF</Text>
                  <Text style={[styles.columnHeader, styles.colRemarks]}>REMARKS / NOTES</Text>
                  <Text style={[styles.columnHeader, styles.colAttachment]}>ATTACHMENT</Text>
                  <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
                </View>

                {/* TABLE BODY ROWS */}
                {currentRecords.map((item, index) => {
                  const globalIdx = startIndex + index + 1;
                  const badge = getModeBadge(item.paymentMode);
                  const isLast = index === currentRecords.length - 1;
                  const isEven = index % 2 === 0;

                  return (
                    <View
                      key={item.id || index}
                      style={[
                        styles.tableRow,
                        isEven ? styles.tableRowEven : styles.tableRowOdd,
                        isLast && styles.tableRowLast,
                      ]}>
                      {/* # Column */}
                      <View style={styles.colIndex}>
                        <Text style={styles.cellIndexText}>{globalIdx}</Text>
                      </View>

                      {/* Voucher No. Column */}
                      <View style={styles.colVoucher}>
                        <Text style={styles.cellVoucherText} numberOfLines={1}>
                          {item.voucherNo || `PAY-${item.id}`}
                        </Text>
                      </View>

                      {/* Date Column */}
                      <View style={styles.colDate}>
                        <Text style={styles.cellDateText}>
                          {item.paymentDate || '-'}
                        </Text>
                      </View>

                      {/* Supplier Column */}
                      <View style={styles.colSupplier}>
                        <Text style={styles.cellSupplierText} numberOfLines={1}>
                          {item.supplierName || 'General Supplier'}
                        </Text>
                      </View>

                      {/* Phone Column */}
                      <View style={styles.colPhone}>
                        <Text style={styles.cellPhoneText} numberOfLines={1}>
                          {item.supplierPhone || '-'}
                        </Text>
                      </View>

                      {/* Email Column */}
                      <View style={styles.colEmail}>
                        <Text style={styles.cellEmailText} numberOfLines={1}>
                          {item.supplierEmail || '-'}
                        </Text>
                      </View>

                      {/* GSTIN Column */}
                      <View style={styles.colGstin}>
                        <Text style={styles.cellGstinText} numberOfLines={1}>
                          {item.supplierGSTIN || '-'}
                        </Text>
                      </View>

                      {/* Address Column */}
                      <View style={styles.colAddress}>
                        <Text style={styles.cellAddressText} numberOfLines={1}>
                          {item.supplierAddress || '-'}
                        </Text>
                      </View>

                      {/* Bill No Column */}
                      <View style={styles.colBillNo}>
                        <View style={styles.billBadgeContainer}>
                          <Text style={styles.billBadgeText} numberOfLines={1}>
                            {item.billNo || '-'}
                          </Text>
                        </View>
                      </View>

                      {/* Bill Amount Column */}
                      <View style={styles.colBillAmt}>
                        <Text style={styles.cellAmountText}>
                          ₹{Number(item.billAmount || 0).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      {/* Previous Paid Column */}
                      <View style={styles.colPrevPaid}>
                        <Text style={styles.cellPrevPaidText}>
                          ₹{Number(item.previousPaid || 0).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      {/* Amount Paid Column */}
                      <View style={styles.colPaidAmt}>
                        <Text style={styles.cellPaidAmtText}>
                          ₹{Number(item.paymentAmount || 0).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      {/* Remaining Column */}
                      <View style={styles.colRemaining}>
                        <Text
                          style={[
                            styles.cellRemainingText,
                            item.remainingAmount > 0 ? styles.remainingPending : styles.remainingSettled,
                          ]}>
                          ₹{Number(item.remainingAmount || 0).toLocaleString('en-IN')}
                        </Text>
                      </View>

                      {/* Payment Mode Column */}
                      <View style={styles.colMode}>
                        <View
                          style={[
                            styles.modeBadge,
                            { backgroundColor: badge.bg, borderColor: badge.border },
                          ]}>
                          <Text style={[styles.modeBadgeText, { color: badge.text }]}>
                            {item.paymentMode || 'UPI'}
                          </Text>
                        </View>
                      </View>

                      {/* Transaction / Ref Column */}
                      <View style={styles.colTxn}>
                        <Text style={styles.cellTxnText} numberOfLines={1}>
                          {item.transactionNo || '-'}
                        </Text>
                      </View>

                      {/* Remarks Column */}
                      <View style={styles.colRemarks}>
                        <Text style={styles.cellRemarksText} numberOfLines={1}>
                          {item.remarks || '-'}
                        </Text>
                      </View>

                      {/* Attachment Column */}
                      <View style={styles.colAttachment}>
                        {item.attachmentName ? (
                          <View style={styles.attachmentBadge}>
                            <Text style={styles.attachmentBadgeText} numberOfLines={1}>
                              📎 {item.attachmentName}
                            </Text>
                          </View>
                        ) : (
                          <Text style={styles.cellMutedText}>None</Text>
                        )}
                      </View>

                      {/* Actions Column */}
                      <View style={styles.colActions}>
                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => {
                            setSelectedRecord(item);
                            setViewModalVisible(true);
                          }}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <EyeIcon size={14} color="#6366f1" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => navigation.navigate('PaymentPaid', { paymentRecord: item })}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <PencilIcon size={14} color="#ea7e30" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionBtn}
                          onPress={() => handleDelete(item.id, item.voucherNo || `PAY-${item.id}`)}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                          <DustbinIcon size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>

      {/* ================================================= */}
      {/* 5. PAGINATION CONTROLS (SHOW ONLY IF > 10 ROWS)   */}
      {/* ================================================= */}
      {filteredRecords.length > 10 && (
        <View style={styles.paginationRow}>
          <Text style={styles.paginationInfo}>
            Showing {startIndex + 1}–{endIndex} of {filteredRecords.length}
          </Text>
          <View style={styles.paginationBtns}>
            <TouchableOpacity
              style={[styles.pageBtn, safeCurrentPage === 1 && styles.pageBtnDisabled]}
              disabled={safeCurrentPage === 1}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
              <Text style={styles.pageBtnText}>◀ Prev</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>
              {safeCurrentPage} / {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.pageBtn, safeCurrentPage === totalPages && styles.pageBtnDisabled]}
              disabled={safeCurrentPage === totalPages}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
              <Text style={styles.pageBtnText}>Next ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ================================================= */}
      {/* 6. FLOATING ADD PAYMENT PAID BUTTON (+)           */}
      {/* ================================================= */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('PaymentPaid')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* ================================================= */}
      {/* 7. DOWNLOAD/EXPORT REPORT MODAL                   */}
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
            <Text style={styles.exportMenuTitle}>Export Payment Paid History</Text>
            <TouchableOpacity
              style={styles.exportOptionBtn}
              activeOpacity={0.7}
              onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={styles.exportOptionText}>Export as PDF Report</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportOptionBtn}
              activeOpacity={0.7}
              onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📊</Text>
              <Text style={styles.exportOptionText}>Export Data Table</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================================================= */}
      {/* 8. VIEW DETAILS MODAL                             */}
      {/* ================================================= */}
      <Modal
        visible={viewModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setViewModalVisible(false)}>
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContainer}>
            {selectedRecord && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.detailModalScroll}>
                {/* 1. Header */}
                <View style={styles.detailHeader}>
                  <View style={styles.detailBadge}>
                    <Text style={styles.detailBadgeText}>PAYMENT VOUCHER</Text>
                  </View>
                  <Text style={styles.detailVoucherNo}>{selectedRecord.voucherNo || `PAY-${selectedRecord.id}`}</Text>
                  <Text style={styles.detailDate}>Date: {selectedRecord.paymentDate || '-'}</Text>
                </View>

                {/* 2. Supplier Details */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>SUPPLIER DETAILS</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Supplier:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.supplierName || 'General Supplier'}</Text>
                  </View>
                  {!!selectedRecord.supplierPhone && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Phone:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.supplierPhone}</Text>
                    </View>
                  )}
                  {!!selectedRecord.supplierEmail && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Email:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.supplierEmail}</Text>
                    </View>
                  )}
                  {!!selectedRecord.supplierGSTIN && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>GSTIN:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.supplierGSTIN}</Text>
                    </View>
                  )}
                  {!!selectedRecord.supplierAddress && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.supplierAddress}</Text>
                    </View>
                  )}
                </View>

                {/* 3. Payment & Bill Details */}
                <View style={styles.detailSection}>
                  <Text style={styles.detailSectionTitle}>PAYMENT DETAILS</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Purchase Bill #:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.billNo || '-'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Bill Amount:</Text>
                    <Text style={styles.detailValue}>₹{Number(selectedRecord.billAmount || 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Previous Paid:</Text>
                    <Text style={styles.detailValue}>₹{Number(selectedRecord.previousPaid || 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={[styles.detailRow, styles.detailRowHighlight]}>
                    <Text style={styles.detailLabelBold}>Amount Paid:</Text>
                    <Text style={styles.detailValuePaid}>₹{Number(selectedRecord.paymentAmount || 0).toLocaleString('en-IN')}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Remaining Balance:</Text>
                    <Text style={[styles.detailValue, selectedRecord.remainingAmount > 0 ? { color: '#ef4444', fontWeight: '700' } : { color: '#059669', fontWeight: '700' }]}>
                      ₹{Number(selectedRecord.remainingAmount || 0).toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Payment Mode:</Text>
                    <Text style={styles.detailValue}>{selectedRecord.paymentMode || 'UPI'}</Text>
                  </View>
                  {!!selectedRecord.transactionNo && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Transaction / Ref #:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.transactionNo}</Text>
                    </View>
                  )}
                  {!!selectedRecord.remarks && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Remarks / Notes:</Text>
                      <Text style={styles.detailValue}>{selectedRecord.remarks}</Text>
                    </View>
                  )}
                  {!!selectedRecord.attachmentName && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Attachment:</Text>
                      <Text style={styles.detailValue}>📎 {selectedRecord.attachmentName}</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.detailCloseBtn}
              activeOpacity={0.8}
              onPress={() => setViewModalVisible(false)}>
              <Text style={styles.detailCloseBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default PaymentPaidHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // ---- 1. HEADER ----
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 32 : 26,
    paddingBottom: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8eef5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitleArea: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b192c',
  },

  // ---- 2. SEARCH BAR & EXPORT BUTTON ----
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    height: 48,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 15,
    marginRight: 8,
    color: '#94a3b8',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    padding: 0,
  },
  clearBtn: {
    padding: 6,
  },
  clearBtnText: {
    fontSize: 13,
    color: '#94a3b8',
    fontWeight: 'bold',
  },
  exportButton: {
    width: 48,
    height: 48,
    backgroundColor: '#ea7e30',
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  // ---- 3. SWIPE HINT ----
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 8,
    gap: 6,
  },
  swipeHintArrow: {
    fontSize: 12,
    color: '#ea7e30',
    fontWeight: 'bold',
  },
  swipeHintText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.1,
  },

  // ---- 4. DATA TABLE CARD ----
  tableCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  horizontalTableScroll: {
    paddingBottom: 4,
  },

  // TABLE HEADER
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1.5,
    borderBottomColor: '#fed7aa',
    paddingVertical: 13,
    paddingHorizontal: 12,
  },
  columnHeader: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#c2410c',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // TABLE ROWS
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableRowOdd: {
    backgroundColor: '#fafbfc',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },

  // COLUMN WIDTHS & ALIGNMENTS
  colIndex: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colVoucher: {
    width: 140,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colDate: {
    width: 105,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colSupplier: {
    width: 180,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colPhone: {
    width: 125,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colEmail: {
    width: 170,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colGstin: {
    width: 160,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colAddress: {
    width: 220,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colBillNo: {
    width: 140,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colBillAmt: {
    width: 125,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colPrevPaid: {
    width: 125,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colPaidAmt: {
    width: 135,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colRemaining: {
    width: 125,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colMode: {
    width: 120,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTxn: {
    width: 155,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colRemarks: {
    width: 180,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colAttachment: {
    width: 140,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colActions: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  actionBtn: {
    padding: 6,
    marginHorizontal: 3,
  },

  // CELL TYPOGRAPHIES
  cellIndexText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },
  cellVoucherText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ea7e30',
  },
  cellDateText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },
  cellSupplierText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  cellPhoneText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },
  cellEmailText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },
  cellGstinText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cellAddressText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748b',
  },
  cellAmountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  cellPrevPaidText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#64748b',
  },
  cellPaidAmtText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#059669',
  },
  cellRemainingText: {
    fontSize: 13,
    fontWeight: '700',
  },
  remainingPending: {
    color: '#ef4444',
  },
  remainingSettled: {
    color: '#059669',
  },
  cellTxnText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },
  cellRemarksText: {
    fontSize: 12.5,
    fontWeight: '400',
    color: '#64748b',
  },
  cellMutedText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  // BADGES
  billBadgeContainer: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dbeafe',
    alignSelf: 'flex-start',
  },
  billBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563eb',
  },
  modeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3.5,
    borderRadius: 8,
    borderWidth: 1,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  attachmentBadge: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignSelf: 'flex-start',
  },
  attachmentBadgeText: {
    fontSize: 11.5,
    color: '#334155',
    fontWeight: '600',
  },

  // EMPTY STATE
  emptyTable: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94a3b8',
  },

  // ---- 5. PAGINATION ----
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  paginationInfo: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea7e30',
  },
  pageIndicator: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    marginHorizontal: 4,
  },

  // ---- 6. FLOATING ADD BUTTON ----
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 99,
  },
  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3.5,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  addIconV: {
    position: 'absolute',
    width: 3.5,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // ---- 7. EXPORT MODAL ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  exportMenuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    elevation: 8,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  exportMenuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    textAlign: 'center',
  },
  exportOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  exportOptionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  exportOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  // ---- 8. VIEW DETAILS MODAL STYLES ----
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  detailModalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '85%',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  detailModalScroll: {
    padding: 20,
  },
  detailHeader: {
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 16,
    marginBottom: 16,
  },
  detailBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fed7aa',
    marginBottom: 8,
  },
  detailBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#c2410c',
    letterSpacing: 0.5,
  },
  detailVoucherNo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 4,
  },
  detailDate: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  detailSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  detailSectionTitle: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#ea7e30',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailRowHighlight: {
    backgroundColor: '#ecfdf5',
    marginHorizontal: -8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 12.5,
    color: '#64748b',
    fontWeight: '500',
    flex: 0.45,
  },
  detailLabelBold: {
    fontSize: 13,
    color: '#065f46',
    fontWeight: '700',
    flex: 0.45,
  },
  detailValue: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
    flex: 0.55,
    textAlign: 'right',
  },
  detailValuePaid: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '800',
    flex: 0.55,
    textAlign: 'right',
  },
  detailCloseBtn: {
    backgroundColor: '#ea7e30',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCloseBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
