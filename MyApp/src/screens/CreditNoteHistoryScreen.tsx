import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

type Props = {
  navigation: any;
};

export interface CreditNote {
  id: string;
  creditNoteNo: string;
  date: string;
  customerName: string;
  invoiceNo: string;
  reason: string;
  adjustmentType: string;
  amount: number;
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

const MOCK_CREDIT_NOTES: CreditNote[] = [
  { id: '1', creditNoteNo: 'CN-001', date: '21/09/2026', customerName: 'Ramesh Traders', invoiceNo: 'INV-001', reason: 'Sales Return', adjustmentType: 'Customer Credit', amount: 15400 },
  { id: '2', creditNoteNo: 'CN-002', date: '22/09/2026', customerName: 'Suresh Enterprises', invoiceNo: 'INV-004', reason: 'Post Sale Discount', adjustmentType: 'Refund', amount: 4500 },
  { id: '3', creditNoteNo: 'CN-003', date: '23/09/2026', customerName: 'Vinod Hardware', invoiceNo: 'INV-005', reason: 'Deficiency in services', adjustmentType: 'Adjust Against Invoice', amount: 8900 },
];

const CreditNoteHistoryScreen = ({navigation}: Props) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = MOCK_CREDIT_NOTES.filter(cn =>
    cn.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cn.creditNoteNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cn.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <BackArrowIcon />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Credit Note History</Text>
      </View>

      <View style={styles.content}>
        {/* SEARCH & ADD ROW */}
        <View style={styles.topActionsRow}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>{"\uD83D\uDD0D"}</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by customer, CN no..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>
          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportIcon}>{"\uD83D\uDCC4"}</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.swipeHint}>{"\u2190"} Horizontally Scrollable {"\u2192"}</Text>

        <View style={styles.tableCard}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalTableScroll}>
            <View>
              {/* TABLE HEADER */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
                <Text style={[styles.columnHeader, styles.colCN]}>CN NO.</Text>
                <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
                <Text style={[styles.columnHeader, styles.colCustomer]}>CUSTOMER</Text>
                <Text style={[styles.columnHeader, styles.colInvoice]}>INVOICE NO.</Text>
                <Text style={[styles.columnHeader, styles.colReason]}>REASON</Text>
                <Text style={[styles.columnHeader, styles.colAdjustment]}>ADJUSTMENT</Text>
                <Text style={[styles.columnHeader, styles.colAmount]}>AMOUNT</Text>
                <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
              </View>

              {/* TABLE BODY */}
              {filteredNotes.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No credit notes found.</Text>
                </View>
              ) : (
                filteredNotes.map((item, index) => (
                  <View
                    key={item.id}
                    style={[
                      styles.tableRow,
                      index === filteredNotes.length - 1 && styles.tableRowLast,
                    ]}>
                    <View style={styles.colIndex}>
                      <Text style={styles.cellIndexText}>{index + 1}</Text>
                    </View>
                    <View style={styles.colCN}>
                      <Text style={styles.cellBoldText}>{item.creditNoteNo}</Text>
                    </View>
                    <View style={styles.colDate}>
                      <Text style={styles.cellText}>{item.date}</Text>
                    </View>
                    <View style={styles.colCustomer}>
                      <Text style={styles.cellBoldText} numberOfLines={1}>{item.customerName}</Text>
                    </View>
                    <View style={styles.colInvoice}>
                      <Text style={styles.cellText}>{item.invoiceNo}</Text>
                    </View>
                    <View style={styles.colReason}>
                      <Text style={styles.cellText} numberOfLines={1}>{item.reason}</Text>
                    </View>
                    <View style={styles.colAdjustment}>
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.adjustmentType}</Text>
                      </View>
                    </View>
                    <View style={styles.colAmount}>
                      <Text style={styles.cellAmountText}>{"\u20B9"}{item.amount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colActions}>
                      <TouchableOpacity style={styles.actionBtn}>
                        <PencilIcon />
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionBtn}>
                        <DustbinIcon />
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              )}
            </View>
          </ScrollView>
        </View>
      </View>

      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreditNote')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreditNoteHistoryScreen;

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
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  topActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    paddingVertical: 0,
  },
  addBtn: {
    backgroundColor: '#ea7e30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 44,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  swipeHint: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 8,
    fontWeight: '500',
  },
  tableCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  horizontalTableScroll: {
    paddingBottom: 20,
  },
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
    fontWeight: '800',
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
  
  colIndex: { width: 40, alignItems: 'center' },
  colCN: { width: 90 },
  colDate: { width: 90 },
  colCustomer: { width: 140 },
  colInvoice: { width: 90 },
  colReason: { width: 130 },
  colAdjustment: { width: 130, alignItems: 'center' },
  colAmount: { width: 100, alignItems: 'flex-end', paddingRight: 10 },
  colActions: { width: 90, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 },

  cellIndexText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
  cellText: { fontSize: 13, color: '#475569', fontWeight: '500' },
  cellBoldText: { fontSize: 13, color: '#0f172a', fontWeight: '700' },
  cellAmountText: { fontSize: 13, color: '#ea580c', fontWeight: '800' },

  badgeContainer: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  badgeText: {
    fontSize: 10,
    color: '#475569',
    fontWeight: '700',
  },
  actionBtn: {
    width: 28,
    height: 28,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    padding: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  exportBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#ea7e30',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  exportIcon: {
    fontSize: 20,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
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
