import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  TextInput,
  Platform,
  Dimensions,
  Modal,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {purchaseAPI} from '../api/purchaseService';
import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route: any;
};

type PurchaseItem = {
  rate?: number;
  qty?: number;
  id?: number;
  product_id?: number;
  product_name?: string;
  product_sku?: string;
  product_unit?: string;
  product_hsn_code?: string;
  quantity?: number;
  purchase_price?: number;
  discount?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
};

type Purchase = {
  gst?: any;
  tax_rate?: any;
  rate?: number;
  product_hsn_code?: any;
  product_unit?: any;
  id?: number;
  purchase_id?: number;
  user_id?: number;
  supplier_id?: number;
  supplier_name?: string;
  supplier_phone?: string;
  supplier_email?: string;
  supplier_gstin?: string;
  supplier_address?: string;
  invoice_number?: string;
  purchase_date?: string;
  subtotal?: number;
  discount?: number;
  tax_amount?: number;
  total_amount?: number;
  payment_status?: string;
  payment_method?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
  items?: PurchaseItem[];
  purchase_items?: PurchaseItem[] | string;
  products?: PurchaseItem[];
  quantity?: number;
  qty?: number;
  total_items?: number;
  item_count?: number;
  product_name?: string;
  product?: string;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// Professional vector back arrow icon
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

const PencilIcon = ({size = 14, color = '#ea7e30'}: {size?: number; color?: string}) => (
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

const DustbinIcon = ({size = 14, color = '#ef4444'}: {size?: number; color?: string}) => (
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

const INITIAL_DEMO_PURCHASES: Purchase[] = [
  {
    id: 1,
    invoice_number: 'INV-PUR-1001',
    purchase_date: '15-Sep-2026',
    supplier_name: 'Amul Dairy Distributors',
    supplier_phone: '+91 98765 43210',
    total_amount: 14500,
    payment_status: 'Paid',
    payment_method: 'Bank Transfer',
    quantity: 250,
    items: [{product_name: 'Amul Taaza Milk 1L', quantity: 250, purchase_price: 52}],
  },
  {
    id: 2,
    invoice_number: 'INV-PUR-1002',
    purchase_date: '14-Sep-2026',
    supplier_name: 'PepsiCo India Holdings',
    supplier_phone: '+91 98123 45678',
    total_amount: 8200,
    payment_status: 'Paid',
    payment_method: 'UPI',
    quantity: 400,
    items: [{product_name: "Lay's Classic Salted 52g", quantity: 400, purchase_price: 16}],
  },
  {
    id: 3,
    invoice_number: 'INV-PUR-1003',
    purchase_date: '12-Sep-2026',
    supplier_name: 'ITC Limited Paperboards',
    supplier_phone: '+91 97654 32109',
    total_amount: 18500,
    payment_status: 'Partial',
    payment_method: 'Cash',
    quantity: 350,
    items: [{product_name: 'Classmate Notebook 172p', quantity: 350, purchase_price: 36}],
  },
  {
    id: 4,
    invoice_number: 'INV-PUR-1004',
    purchase_date: '10-Sep-2026',
    supplier_name: 'Tata Global Beverages',
    supplier_phone: '+91 99887 76655',
    total_amount: 22800,
    payment_status: 'Pending',
    payment_method: 'Credit',
    quantity: 200,
    items: [{product_name: 'Tata Tea Gold 250g', quantity: 200, purchase_price: 114}],
  },
  {
    id: 5,
    invoice_number: 'INV-PUR-1005',
    purchase_date: '08-Sep-2026',
    supplier_name: 'Hindustan Unilever Ltd',
    supplier_phone: '+91 91234 56789',
    total_amount: 34200,
    payment_status: 'Paid',
    payment_method: 'NEFT',
    quantity: 350,
    items: [{product_name: 'Surf Excel 1kg', quantity: 350, purchase_price: 98}],
  },
];

const AllPurchasesScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;
  const [purchases, setPurchases] = useState<Purchase[]>(INITIAL_DEMO_PURCHASES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await purchaseAPI.getPurchases();
      const purchaseList =
        response?.purchases ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      if (Array.isArray(purchaseList) && purchaseList.length > 0) {
        setPurchases(purchaseList);
      }
    } catch (error: any) {
      console.log('FETCH PURCHASE ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchases();
    }, []),
  );

  const getPurchaseId = (purchase: Purchase) => {
    return purchase.id || purchase.purchase_id;
  };

  const getPurchaseItems = (data: Purchase): PurchaseItem[] => {
    let itemsList: any[] = [];
    if (Array.isArray(data?.items)) {
      itemsList = data.items;
    } else if (typeof data?.items === 'string') {
      try {
        const parsed = JSON.parse(data.items);
        if (Array.isArray(parsed)) itemsList = parsed;
      } catch (e) {}
    } else if (Array.isArray(data?.purchase_items)) {
      itemsList = data.purchase_items;
    } else if (typeof data?.purchase_items === 'string') {
      try {
        const parsed = JSON.parse(data.purchase_items);
        if (Array.isArray(parsed)) itemsList = parsed;
      } catch (e) {}
    } else if (Array.isArray(data?.products)) {
      itemsList = data.products;
    }

    if (itemsList.length === 0 && (data.product_name || data.product)) {
      itemsList = [
        {
          product_name: data.product_name || data.product,
          quantity: data.quantity || data.qty || 1,
          purchase_price: data.rate || 0,
          total_amount: data.total_amount || 0,
        },
      ];
    }
    return itemsList;
  };

  const getItemCount = (purchase: Purchase) => {
    const items = getPurchaseItems(purchase);
    if (items.length > 0) return items.length;
    if (purchase.total_items || purchase.item_count) {
      return Number(purchase.total_items || purchase.item_count || 0);
    }
    if (purchase.product_name || purchase.product) return 1;
    return 0;
  };

  const getTotalQuantity = (purchase: Purchase) => {
    const items = getPurchaseItems(purchase);
    if (items.length > 0) {
      return items.reduce(
        (total, item) => total + Number(item.quantity ?? item.qty ?? 0),
        0,
      );
    }
    return Number(purchase.quantity ?? purchase.qty ?? 0);
  };

  const openPurchase = (purchase: Purchase) => {
    const purchaseId = getPurchaseId(purchase);
    if (!purchaseId) return;
    navigation.navigate('ViewPurchase', {
      mode: 'view',
      purchaseId,
      purchase,
      user,
    });
  };

  const openEditPurchase = (purchase: Purchase) => {
    const purchaseId = getPurchaseId(purchase);
    if (!purchaseId) return;
    navigation.navigate('AddPurchase', {
      mode: 'edit',
      purchaseId,
      purchase,
      user,
    });
  };

  const deletePurchase = (purchase: Purchase) => {
    const purchaseId = getPurchaseId(purchase);
    if (!purchaseId) return;

    Alert.alert(
      'Delete Purchase',
      `Are you sure you want to delete purchase ${purchase.invoice_number || ''}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await purchaseAPI.deletePurchase(purchaseId);
              setPurchases(prev =>
                prev.filter(item => getPurchaseId(item) !== purchaseId),
              );
              Alert.alert('Success', 'Purchase deleted successfully.');
            } catch (error: any) {
              console.log('DELETE PURCHASE ERROR:', error);
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleExportPDF = async () => {
    setDownloadMenuVisible(false);
    const targetList = filteredPurchases.length > 0 ? filteredPurchases : purchases;

    const columns = [
      {title: '#', width: 25, align: 'center' as const},
      {title: 'Invoice No.', width: 85},
      {title: 'Date', width: 70},
      {title: 'Supplier', width: 110},
      {title: 'Items', width: 40, align: 'center' as const},
      {title: 'Qty', width: 40, align: 'center' as const},
      {title: 'Total (Rs)', width: 70, align: 'right' as const},
      {title: 'Status', width: 55, align: 'center' as const},
    ];

    const rows = targetList.map((p, idx) => [
      String(idx + 1),
      p.invoice_number || '-',
      p.purchase_date || '-',
      p.supplier_name || '-',
      String(getItemCount(p)),
      String(getTotalQuantity(p)),
      `Rs. ${Number(p.total_amount || 0).toFixed(2)}`,
      p.payment_status || 'Paid',
    ]);

    try {
      const pdfBase64 = generatePurePDF('All Purchases Report', columns, rows);
      const filename = `Purchases_${Date.now()}.pdf`;
      await saveFileToDevice(filename, pdfBase64, 'base64');
      Alert.alert('Success', `PDF saved successfully as ${filename}`);
    } catch (e: any) {
      Alert.alert('Export Error', e.message || 'Failed to export PDF');
    }
  };

  const filteredPurchases = purchases.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.invoice_number && p.invoice_number.toLowerCase().includes(q)) ||
      (p.supplier_name && p.supplier_name.toLowerCase().includes(q)) ||
      (p.payment_status && p.payment_status.toLowerCase().includes(q)) ||
      (p.purchase_date && p.purchase_date.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPurchases.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredPurchases.length,
  );
  const currentPurchases = filteredPurchases.slice(startIndex, endIndex);

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================= */}
      {/* 1. HEADER                                         */}
      {/* ================================================= */}
      <View style={styles.header}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>All Purchases</Text>
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
            placeholder="Search invoice, supplier..."
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

        {/* Export Button */}
        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.8}
          onPress={() => setDownloadMenuVisible(true)}>
          <Text style={styles.exportIcon}>📄</Text>
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
      {/* 4. MAIN DATA TABLE CARD                           */}
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
              <Text style={[styles.columnHeader, styles.colInvoice]}>
                INVOICE NO
              </Text>
              <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
              <Text style={[styles.columnHeader, styles.colSupplier]}>
                SUPPLIER
              </Text>
              <Text style={[styles.columnHeader, styles.colItems]}>ITEMS</Text>
              <Text style={[styles.columnHeader, styles.colQty]}>QTY</Text>
              <Text style={[styles.columnHeader, styles.colTotal]}>TOTAL</Text>
              <Text style={[styles.columnHeader, styles.colStatus]}>
                STATUS
              </Text>
              <Text style={[styles.columnHeader, styles.colActions]}>
                ACTIONS
              </Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentPurchases.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const statusStr = (item.payment_status || 'Paid').toLowerCase();
              const isPaid = statusStr === 'paid' || statusStr === 'completed';
              const isPartial = statusStr === 'partial' || statusStr === 'partially paid';

              return (
                <View
                  key={getPurchaseId(item) || index}
                  style={[
                    styles.tableRow,
                    index === currentPurchases.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* Invoice No. Column */}
                  <View style={styles.colInvoice}>
                    <Text style={styles.cellNameText} numberOfLines={1}>
                      {item.invoice_number || `PUR-${globalIndex}`}
                    </Text>
                  </View>

                  {/* Date Column */}
                  <View style={styles.colDate}>
                    <Text style={styles.cellDateText}>
                      {item.purchase_date || '-'}
                    </Text>
                  </View>

                  {/* Supplier Column */}
                  <View style={styles.colSupplier}>
                    <Text style={styles.cellSupplierText} numberOfLines={1}>
                      {item.supplier_name || 'General Supplier'}
                    </Text>
                  </View>

                  {/* Items Column */}
                  <View style={styles.colItems}>
                    <Text style={styles.cellDateText}>{getItemCount(item)}</Text>
                  </View>

                  {/* Qty Column */}
                  <View style={styles.colQty}>
                    <Text style={styles.cellDateText}>{getTotalQuantity(item)}</Text>
                  </View>

                  {/* Total Column */}
                  <View style={styles.colTotal}>
                    <Text style={styles.cellTotalText}>
                      ₹{Number(item.total_amount || 0).toFixed(2)}
                    </Text>
                  </View>

                  {/* Status Column */}
                  <View style={styles.colStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        isPaid
                          ? styles.statusBadgePaid
                          : isPartial
                          ? styles.statusBadgePartial
                          : styles.statusBadgePending,
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isPaid
                            ? styles.statusTextPaid
                            : isPartial
                            ? styles.statusTextPartial
                            : styles.statusTextPending,
                        ]}>
                        {item.payment_status || 'Paid'}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openPurchase(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <Text style={styles.viewActionIcon}>👁️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditPurchase(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => deletePurchase(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentPurchases.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No purchases found.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Scroll Bar Track Indicator */}
        <View style={styles.scrollTrack}>
          <View style={styles.scrollThumb} />
        </View>

        {/* ============================================= */}
        {/* 5. PAGINATION FOOTER (Only when count > 10)  */}
        {/* ============================================= */}
        {filteredPurchases.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredPurchases.length}`}
            </Text>

            <View style={styles.paginationControls}>
              {/* Previous Page */}
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

              {/* Page Count */}
              <Text style={styles.pageCountText}>
                {safeCurrentPage}/{totalPages}
              </Text>

              {/* Next Page */}
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
      {/* 6. FLOATING ADD BUTTON (+)                        */}
      {/* ================================================= */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddPurchase', {user})}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* ================================================= */}
      {/* 7. EXPORT MENU MODAL                              */}
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
            <TouchableOpacity
              style={styles.exportOptionRow}
              onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={styles.exportOptionText}>Download as PDF</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default AllPurchasesScreen;

// =====================================================
// STYLESHEET
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // ---- 1. HEADER ----
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
  },

  // ---- 2. SEARCH & EXPORT ROW ----
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
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  exportIcon: {
    fontSize: 20,
  },

  // ---- 3. SWIPE HINT ----
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

  // ---- 4. TABLE CARD ----
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

  // Column Widths
  colIndex: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colInvoice: {
    width: 140,
    justifyContent: 'center',
    paddingRight: 10,
  },
  colDate: {
    width: 105,
    justifyContent: 'center',
  },
  colSupplier: {
    width: 170,
    justifyContent: 'center',
    paddingRight: 10,
  },
  colItems: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colQty: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTotal: {
    width: 105,
    justifyContent: 'center',
  },
  colStatus: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colActions: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Table Header
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

  // Table Body Rows
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

  cellNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  cellDateText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  cellSupplierText: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '600',
  },

  cellTotalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusBadgePaid: {
    backgroundColor: '#ecfdf5',
  },

  statusBadgePartial: {
    backgroundColor: '#eff6ff',
  },

  statusBadgePending: {
    backgroundColor: '#fffbeb',
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  statusTextPaid: {
    color: '#059669',
  },

  statusTextPartial: {
    color: '#3b82f6',
  },

  statusTextPending: {
    color: '#d97706',
  },

  actionBtn: {
    padding: 4,
  },

  viewActionIcon: {
    fontSize: 14,
  },

  editActionIcon: {
    fontSize: 14,
  },

  deleteActionIcon: {
    fontSize: 14,
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

  // Scroll Bar Track
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

  // ---- 5. PAGINATION FOOTER ----
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

  // ---- 6. FLOATING ADD BUTTON ----
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

  // ---- MODAL OVERLAYS ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  exportMenuCard: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  exportMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 14,
  },

  exportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f4',
  },

  exportOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  exportOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
});