import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
} from 'react-native';

type Props = {
  navigation: any;
  route?: any;
};

export interface Expense {
  id: string;
  expenseDate: string;
  category: string;
  paidTo: string;
  description: string;
  amount: number;
  paymentMethod: string;
  referenceNo: string;
  gstApplicable: string;
  gstRate: string;
  notes: string;
}

const BackArrowIcon = () => (
  <View style={{width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
    <View style={{position: 'absolute', width: 14, height: 2.6, backgroundColor: '#1e293b', borderRadius: 1.3}} />
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
        transform: [{rotate: '-45deg'}],
      }}
    />
  </View>
);

const PencilIcon = ({size = 14, color = '#ea7e30'}) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.85,
        height: size * 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{rotate: '45deg'}],
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

const DustbinIcon = ({size = 14, color = '#ef4444'}) => (
  <View style={{width: size, height: size + 2, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.36,
        height: 1.5,
        backgroundColor: color,
        borderTopLeftRadius: 1,
        borderTopRightRadius: 1,
      }}
    />
    <View
      style={{
        width: size * 0.88,
        height: 1.5,
        backgroundColor: color,
        borderRadius: 0.75,
        marginVertical: 1,
      }}
    />
    <View
      style={{
        width: size * 0.68,
        height: size * 0.66,
        borderWidth: 1.3,
        borderColor: color,
        borderTopWidth: 0,
        borderBottomLeftRadius: 2.5,
        borderBottomRightRadius: 2.5,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 1,
      }}>
      <View style={{width: 1.1, height: '65%', backgroundColor: color, borderRadius: 0.5}} />
      <View style={{width: 1.1, height: '65%', backgroundColor: color, borderRadius: 0.5}} />
    </View>
  </View>
);

const MOCK_EXPENSES: Expense[] = [
  {
    id: '1',
    expenseDate: '21/09/2026',
    category: 'Electricity',
    paidTo: 'MSEDCL',
    description: 'Office Electricity Bill - August',
    amount: 4500,
    paymentMethod: 'Bank',
    referenceNo: 'TXN893240',
    gstApplicable: 'No',
    gstRate: '',
    notes: 'Paid online',
  },
  {
    id: '2',
    expenseDate: '15/09/2026',
    category: 'Office Supplies',
    paidTo: 'Stationery Mart',
    description: 'Printer ink and paper',
    amount: 1250,
    paymentMethod: 'UPI',
    referenceNo: 'UPI9081234',
    gstApplicable: 'Yes',
    gstRate: '18%',
    notes: '',
  },
  {
    id: '3',
    expenseDate: '10/09/2026',
    category: 'Rent',
    paidTo: 'Ramesh Landlord',
    description: 'Shop Rent September',
    amount: 15000,
    paymentMethod: 'Bank',
    referenceNo: 'RTGS120938',
    gstApplicable: 'No',
    gstRate: '',
    notes: '',
  },
  {
    id: '4',
    expenseDate: '05/09/2026',
    category: 'Transportation',
    paidTo: 'Fast Logistics',
    description: 'Goods transport charges',
    amount: 2800,
    paymentMethod: 'Cash',
    referenceNo: '',
    gstApplicable: 'Yes',
    gstRate: '5%',
    notes: 'Cash paid to driver',
  }
];

const AllExpensesScreen = ({navigation}: Props) => {
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const EXPENSES_PER_PAGE = 10;

  const handleDeleteExpense = (expense: Expense) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete this ${expense.category} expense of ₹${expense.amount}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setExpenses(prev => prev.filter(e => e.id !== expense.id));
          },
        },
      ],
    );
  };

  const filteredExpenses = expenses.filter(expense => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;

    return (
      expense.category.toLowerCase().includes(query) ||
      expense.paidTo.toLowerCase().includes(query) ||
      expense.description.toLowerCase().includes(query) ||
      expense.paymentMethod.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / EXPENSES_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * EXPENSES_PER_PAGE;
  const endIndex = Math.min(startIndex + EXPENSES_PER_PAGE, filteredExpenses.length);
  const currentExpenses = filteredExpenses.slice(startIndex, endIndex);

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>All Expenses</Text>
        </View>
      </View>

      {/* 2. SEARCH BAR & EXPORT */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by category, vendor..."
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
          onPress={() => Alert.alert('Export', 'Export functionality coming soon')}>
          <Text style={styles.exportIcon}>📄</Text>
        </TouchableOpacity>
      </View>

      {/* 3. SWIPE HINT */}
      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintArrow}>➔</Text>
        <Text style={styles.swipeHintText}>Swipe the table to see all columns</Text>
      </View>

      {/* 4. TABLE CARD */}
      <View style={styles.tableCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalTableScroll}>
          <View>
            {/* TABLE HEADER */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
              <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
              <Text style={[styles.columnHeader, styles.colCategory]}>CATEGORY</Text>
              <Text style={[styles.columnHeader, styles.colPaidTo]}>PAID TO</Text>
              <Text style={[styles.columnHeader, styles.colAmount]}>AMOUNT</Text>
              <Text style={[styles.columnHeader, styles.colMethod]}>METHOD</Text>
              <Text style={[styles.columnHeader, styles.colRef]}>REF NO.</Text>
              <Text style={[styles.columnHeader, styles.colGst]}>GST</Text>
              <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
            </View>

            {/* TABLE BODY */}
            {currentExpenses.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.tableRow,
                    index === currentExpenses.length - 1 && styles.tableRowLast,
                  ]}>
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>
                  <View style={styles.colDate}>
                    <Text style={styles.cellText}>{item.expenseDate}</Text>
                  </View>
                  <View style={styles.colCategory}>
                    <Text style={styles.cellTextBold} numberOfLines={1}>{item.category}</Text>
                  </View>
                  <View style={styles.colPaidTo}>
                    <Text style={styles.cellText} numberOfLines={1}>{item.paidTo || '-'}</Text>
                  </View>
                  <View style={styles.colAmount}>
                    <Text style={styles.cellAmountText}>₹{item.amount.toFixed(2)}</Text>
                  </View>
                  <View style={styles.colMethod}>
                    <Text style={styles.cellText}>{item.paymentMethod}</Text>
                  </View>
                  <View style={styles.colRef}>
                    <Text style={styles.cellText} numberOfLines={1}>{item.referenceNo || '-'}</Text>
                  </View>
                  <View style={styles.colGst}>
                    <Text style={styles.cellText}>{item.gstApplicable === 'Yes' ? item.gstRate : '-'}</Text>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleDeleteExpense(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentExpenses.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No expenses found.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Scroll Bar Track Indicator */}
        <View style={styles.scrollTrack}>
          <View style={styles.scrollThumb} />
        </View>

        {/* PAGINATION FOOTER */}
        {filteredExpenses.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredExpenses.length}`}
            </Text>

            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[styles.pageBtn, safeCurrentPage <= 1 && styles.pageBtnDisabled]}
                disabled={safeCurrentPage <= 1}
                onPress={() => setCurrentPage(p => Math.max(1, p - 1))}>
                <Text style={[styles.pageBtnText, safeCurrentPage <= 1 && styles.pageBtnTextDisabled]}>‹</Text>
              </TouchableOpacity>
              <Text style={styles.pageCountText}>{safeCurrentPage}/{totalPages}</Text>
              <TouchableOpacity
                style={[styles.pageBtn, safeCurrentPage >= totalPages && styles.pageBtnDisabled]}
                disabled={safeCurrentPage >= totalPages}
                onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
                <Text style={[styles.pageBtnText, safeCurrentPage >= totalPages && styles.pageBtnTextDisabled]}>›</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddExpense')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default AllExpensesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 28 : 22,
    paddingBottom: 14,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginTop: 4,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 6,
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  exportIcon: {
    fontSize: 20,
  },
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  swipeHintArrow: {
    fontSize: 13,
    color: '#94a3b8',
    marginRight: 6,
    fontWeight: '700',
  },
  swipeHintText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  tableCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  horizontalTableScroll: {
    minWidth: '100%',
  },
  colIndex: { width: 44, alignItems: 'center', justifyContent: 'center' },
  colDate: { width: 100, justifyContent: 'center' },
  colCategory: { width: 140, justifyContent: 'center' },
  colPaidTo: { width: 150, justifyContent: 'center' },
  colAmount: { width: 110, justifyContent: 'center' },
  colMethod: { width: 90, justifyContent: 'center' },
  colRef: { width: 110, justifyContent: 'center' },
  colGst: { width: 70, justifyContent: 'center' },
  colActions: { width: 85, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },

  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cellIndexText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },
  cellText: {
    fontSize: 14,
    color: '#334155',
  },
  cellTextBold: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  cellAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  actionBtn: {
    padding: 4,
  },
  emptyTable: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  scrollTrack: {
    height: 4,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    borderRadius: 2,
    marginBottom: 8,
  },
  scrollThumb: {
    width: 80,
    height: 4,
    backgroundColor: '#ea7e30',
    borderRadius: 2,
  },
  paginationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },
  paginationInfoText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '700',
  },
  pageBtnTextDisabled: {
    color: '#94a3b8',
  },
  pageCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 4,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },
  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3.2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  addIconV: {
    position: 'absolute',
    width: 3.2,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});
