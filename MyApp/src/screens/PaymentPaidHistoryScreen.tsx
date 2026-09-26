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
} from 'react-native';
import {
  loadPaymentPaidRecords,
  PaymentPaidRecord,
} from '../utils/paymentPaidStore';

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

const PaymentPaidHistoryScreen = ({ navigation }: Props) => {
  const [records, setRecords] = useState<PaymentPaidRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = async () => {
    const data = await loadPaymentPaidRecords();
    setRecords(data);
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
      {/* 2. SEARCH BAR                                     */}
      {/* ================================================= */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search payment paid history..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={styles.clearBtn}
              activeOpacity={0.7}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
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
                </View>

                {/* TABLE BODY ROWS */}
                {filteredRecords.map((item, index) => {
                  const badge = getModeBadge(item.paymentMode);
                  const isLast = index === filteredRecords.length - 1;
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
                        <Text style={styles.cellIndexText}>{index + 1}</Text>
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
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </ScrollView>
        )}
      </View>
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

  // ---- 2. SEARCH BAR ----
  searchRow: {
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
  },
  searchContainer: {
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
});
