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
import {purchaseOrderAPI} from '../api/purchaseOrderService';
import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route: any;
};

type PurchaseOrderItem = {
  id?: number;
  purchase_order_id?: number;
  product_id?: number;
  product_name?: string;
  sku?: string;
  quantity?: number;
  qty?: number;
  purchase_price?: number;
  rate?: number;
  discount?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  received_quantity?: number;
  created_at?: string;
};

type PurchaseOrder = {
  id?: number;
  purchase_order_id?: number;
  user_id?: number;
  supplier_id?: number;
  supplier_name?: string;
  supplier_phone?: string;
  supplier_email?: string;
  supplier_address?: string;
  purchase_order_no?: string;
  po_date?: string;
  expected_date?: string;
  subtotal?: number;
  discount?: number;
  tax_amount?: number;
  total_amount?: number;
  grand_total?: number;
  status?: string;
  notes?: string;
  document_name?: string;
  document_type?: string;
  quantity?: number;
  qty?: number;
  created_at?: string;
  updated_at?: string;
  items?: PurchaseOrderItem[];
  purchase_order_items?: PurchaseOrderItem[];
  order_items?: PurchaseOrderItem[];
  products?: PurchaseOrderItem[];
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

const INITIAL_DEMO_ORDERS: PurchaseOrder[] = [
  {
    id: 1,
    purchase_order_no: 'PO-2026-001',
    po_date: '15-Sep-2026',
    expected_date: '20-Sep-2026',
    supplier_name: 'Amul Dairy Distributors',
    supplier_phone: '+91 98765 43210',
    subtotal: 13000,
    discount: 0,
    tax_amount: 1500,
    total_amount: 14500,
    grand_total: 14500,
    status: 'Received',
    quantity: 250,
    items: [{product_name: 'Amul Taaza Milk 1L', quantity: 250, purchase_price: 52}],
  },
  {
    id: 2,
    purchase_order_no: 'PO-2026-002',
    po_date: '14-Sep-2026',
    expected_date: '18-Sep-2026',
    supplier_name: 'PepsiCo India Holdings',
    supplier_phone: '+91 98123 45678',
    subtotal: 8000,
    discount: 200,
    tax_amount: 400,
    total_amount: 8200,
    grand_total: 8200,
    status: 'Received',
    quantity: 400,
    items: [{product_name: "Lay's Classic Salted 52g", quantity: 400, purchase_price: 16}],
  },
  {
    id: 3,
    purchase_order_no: 'PO-2026-003',
    po_date: '12-Sep-2026',
    expected_date: '22-Sep-2026',
    supplier_name: 'ITC Limited Paperboards',
    supplier_phone: '+91 97654 32109',
    subtotal: 18000,
    discount: 500,
    tax_amount: 1000,
    total_amount: 18500,
    grand_total: 18500,
    status: 'Pending',
    quantity: 350,
    items: [{product_name: 'Classmate Notebook 172p', quantity: 350, purchase_price: 36}],
  },
  {
    id: 4,
    purchase_order_no: 'PO-2026-004',
    po_date: '10-Sep-2026',
    expected_date: '16-Sep-2026',
    supplier_name: 'Tata Global Beverages',
    supplier_phone: '+91 99887 76655',
    subtotal: 22000,
    discount: 0,
    tax_amount: 800,
    total_amount: 22800,
    grand_total: 22800,
    status: 'Pending',
    quantity: 200,
    items: [{product_name: 'Tata Tea Gold 250g', quantity: 200, purchase_price: 114}],
  },
  {
    id: 5,
    purchase_order_no: 'PO-2026-005',
    po_date: '08-Sep-2026',
    expected_date: '15-Sep-2026',
    supplier_name: 'Hindustan Unilever Ltd',
    supplier_phone: '+91 91234 56789',
    subtotal: 32000,
    discount: 1000,
    tax_amount: 3200,
    total_amount: 34200,
    grand_total: 34200,
    status: 'Approved',
    quantity: 350,
    items: [{product_name: 'Surf Excel 1kg', quantity: 350, purchase_price: 98}],
  },
];

const PurchaseOrderHistoryScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  const [orders, setOrders] = useState<PurchaseOrder[]>(INITIAL_DEMO_ORDERS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  // ==========================================================
  // FETCH PURCHASE ORDERS
  // ==========================================================
  const fetchPurchaseOrders = useCallback(async () => {
    try {
      setLoading(true);
      const response = await purchaseOrderAPI.getPurchaseOrders();

      let orderList: PurchaseOrder[] = [];
      if (Array.isArray(response)) {
        orderList = response;
      } else if (Array.isArray(response?.data)) {
        orderList = response.data;
      } else if (Array.isArray(response?.orders)) {
        orderList = response.orders;
      } else if (Array.isArray(response?.purchaseOrders)) {
        orderList = response.purchaseOrders;
      } else if (Array.isArray(response?.purchase_orders)) {
        orderList = response.purchase_orders;
      }

      if (orderList.length > 0) {
        setOrders(orderList);
      }
    } catch (error: any) {
      console.log('FETCH PURCHASE ORDERS ERROR:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPurchaseOrders();
    }, [fetchPurchaseOrders]),
  );

  const getPurchaseOrderId = (order: PurchaseOrder) => {
    return order.id || order.purchase_order_id;
  };

  const getOrderItems = (order: PurchaseOrder): PurchaseOrderItem[] => {
    const possibleItems =
      order.items ||
      order.purchase_order_items ||
      order.order_items ||
      order.products ||
      [];

    if (Array.isArray(possibleItems)) {
      return possibleItems;
    }

    if (typeof possibleItems === 'string') {
      try {
        const parsed = JSON.parse(possibleItems);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  };

  const getTotalQuantity = (order: PurchaseOrder): number => {
    const items = getOrderItems(order);
    if (items.length > 0) {
      return items.reduce((sum, item) => {
        return sum + Number(item.quantity ?? item.qty ?? 0);
      }, 0);
    }
    return Number(order.quantity ?? order.qty ?? 0);
  };

  const getItemCount = (order: PurchaseOrder) => {
    return getOrderItems(order).length;
  };

  const getGrandTotal = (order: PurchaseOrder) => {
    if (order.grand_total !== undefined && order.grand_total !== null) {
      return Number(order.grand_total);
    }
    if (order.total_amount !== undefined && order.total_amount !== null) {
      return Number(order.total_amount);
    }
    const subtotal = Number(order.subtotal ?? 0);
    const discount = Number(order.discount ?? 0);
    const gst = Number(order.tax_amount ?? 0);
    return subtotal - discount + gst;
  };

  const formatDate = (value?: string) => {
    if (!value) return '-';
    const str = String(value).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [day, month, year] = str.split('/');
      return `${day}/${month}/${year}`;
    }
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const [year, month, day] = str.substring(0, 10).split('-');
      return `${day}/${month}/${year}`;
    }
    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      const day = String(parsed.getDate()).padStart(2, '0');
      const month = String(parsed.getMonth() + 1).padStart(2, '0');
      const year = parsed.getFullYear();
      return `${day}/${month}/${year}`;
    }
    return str;
  };

  const openPurchaseOrder = (order: PurchaseOrder) => {
    const orderId = getPurchaseOrderId(order);
    if (!orderId) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }
    navigation.navigate('ViewPurchaseOrder', {
      mode: 'view',
      purchaseOrderId: orderId,
      purchaseOrder: order,
      order: order,
      user: user,
    });
  };

  const editPurchaseOrder = (order: PurchaseOrder) => {
    const orderId = getPurchaseOrderId(order);
    if (!orderId) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }
    navigation.navigate('PurchaseOrder', {
      mode: 'edit',
      purchaseOrderId: orderId,
      purchaseOrder: order,
      order: order,
      user: user,
    });
  };

  const addPurchaseOrder = () => {
    navigation.navigate('PurchaseOrder', {
      mode: 'add',
      user: user,
    });
  };

  const deleteOrder = (order: PurchaseOrder) => {
    const orderId = getPurchaseOrderId(order);
    if (!orderId) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }

    const orderNumber = order.purchase_order_no || `PO-${orderId}`;

    Alert.alert(
      'Delete Purchase Order',
      `Are you sure you want to delete ${orderNumber}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await purchaseOrderAPI.deletePurchaseOrder(orderId);
              setOrders(prev =>
                prev.filter(item => getPurchaseOrderId(item) !== orderId),
              );
              Alert.alert('Success', 'Purchase order deleted successfully.');
            } catch (error: any) {
              console.log('DELETE PURCHASE ORDER ERROR:', error);
              Alert.alert(
                'Error',
                error?.message || 'Failed to delete purchase order.',
              );
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
    const targetList = filteredOrders.length > 0 ? filteredOrders : orders;

    const columns = [
      {title: '#', width: 25, align: 'center' as const},
      {title: 'PO No.', width: 85},
      {title: 'Date', width: 70},
      {title: 'Supplier', width: 110},
      {title: 'Items', width: 40, align: 'center' as const},
      {title: 'Qty', width: 40, align: 'center' as const},
      {title: 'Total (Rs)', width: 70, align: 'right' as const},
      {title: 'Status', width: 55, align: 'center' as const},
    ];

    const rows = targetList.map((p, idx) => [
      String(idx + 1),
      p.purchase_order_no || '-',
      formatDate(p.po_date),
      p.supplier_name || '-',
      String(getItemCount(p)),
      String(getTotalQuantity(p)),
      `Rs. ${getGrandTotal(p).toFixed(2)}`,
      p.status || 'Draft',
    ]);

    try {
      const pdfBase64 = generatePurePDF('Purchase Order History Report', columns, rows);
      const filename = `PurchaseOrders_${Date.now()}.pdf`;
      await saveFileToDevice(filename, pdfBase64, 'base64');
      Alert.alert('Success', `PDF saved successfully as ${filename}`);
    } catch (e: any) {
      Alert.alert('Export Error', e.message || 'Failed to export PDF');
    }
  };

  const filteredOrders = orders.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (p.purchase_order_no && p.purchase_order_no.toLowerCase().includes(q)) ||
      (p.supplier_name && p.supplier_name.toLowerCase().includes(q)) ||
      (p.status && p.status.toLowerCase().includes(q)) ||
      (p.po_date && p.po_date.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredOrders.length,
  );
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

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
          <Text style={styles.headerTitle}>Purchase Order History</Text>
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
            placeholder="Search PO no, supplier..."
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
              <Text style={[styles.columnHeader, styles.colPoNo]}>PO NUMBER</Text>
              <Text style={[styles.columnHeader, styles.colDate]}>DATE</Text>
              <Text style={[styles.columnHeader, styles.colSupplier]}>SUPPLIER</Text>
              <Text style={[styles.columnHeader, styles.colItems]}>ITEMS</Text>
              <Text style={[styles.columnHeader, styles.colQty]}>QTY</Text>
              <Text style={[styles.columnHeader, styles.colTotal]}>TOTAL</Text>
              <Text style={[styles.columnHeader, styles.colStatus]}>STATUS</Text>
              <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentOrders.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const statusStr = (item.status || 'Draft').toLowerCase();
              const isReceived = statusStr === 'received' || statusStr === 'completed' || statusStr === 'approved';
              const isPending = statusStr === 'pending';
              const isCancelled = statusStr === 'cancelled' || statusStr === 'canceled' || statusStr === 'rejected';

              const orderNumber = item.purchase_order_no || `PO-${globalIndex}`;
              const grandTotal = getGrandTotal(item);

              return (
                <View
                  key={getPurchaseOrderId(item) || index}
                  style={[
                    styles.tableRow,
                    index === currentOrders.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* PO Number Column */}
                  <TouchableOpacity
                    style={styles.colPoNo}
                    activeOpacity={0.7}
                    onPress={() => openPurchaseOrder(item)}>
                    <Text style={styles.cellNameText} numberOfLines={1}>
                      {orderNumber}
                    </Text>
                  </TouchableOpacity>

                  {/* Date Column */}
                  <View style={styles.colDate}>
                    <Text style={styles.cellDateText}>
                      {formatDate(item.po_date)}
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
                      ₹{grandTotal.toFixed(2)}
                    </Text>
                  </View>

                  {/* Status Column */}
                  <View style={styles.colStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        isReceived
                          ? styles.statusBadgeReceived
                          : isPending
                          ? styles.statusBadgePending
                          : isCancelled
                          ? styles.statusBadgeCancelled
                          : styles.statusBadgeDraft,
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isReceived
                            ? styles.statusTextReceived
                            : isPending
                            ? styles.statusTextPending
                            : isCancelled
                            ? styles.statusTextCancelled
                            : styles.statusTextDraft,
                        ]}>
                        {item.status || 'Draft'}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openPurchaseOrder(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <Text style={styles.viewActionIcon}>👁️</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => editPurchaseOrder(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => deleteOrder(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentOrders.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No purchase orders found.</Text>
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
        {filteredOrders.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredOrders.length}`}
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
        onPress={addPurchaseOrder}>
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

export default PurchaseOrderHistoryScreen;

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
    fontSize: 16,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14.5,
    color: '#0f172a',
    paddingVertical: 0,
    fontWeight: '500',
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
    marginLeft: 10,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
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
    marginBottom: 8,
    gap: 6,
  },

  swipeHintArrow: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: 'bold',
  },

  swipeHintText: {
    fontSize: 12,
    color: '#94a3b8',
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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },

  horizontalTableScroll: {
    paddingBottom: 4,
  },

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

  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  // Column Widths
  colIndex: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colPoNo: {
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
    width: 155,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  colItems: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colQty: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTotal: {
    width: 100,
    paddingHorizontal: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colStatus: {
    width: 95,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colActions: {
    width: 105,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  // Cell Typographies
  cellIndexText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
  },

  cellNameText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },

  cellDateText: {
    fontSize: 12.5,
    fontWeight: '500',
    color: '#475569',
  },

  cellSupplierText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  cellTotalText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  statusBadgeReceived: {
    backgroundColor: '#dcfce7',
  },
  statusBadgePending: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeCancelled: {
    backgroundColor: '#fee2e2',
  },
  statusBadgeDraft: {
    backgroundColor: '#f1f5f9',
  },

  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusTextReceived: {
    color: '#15803d',
  },
  statusTextPending: {
    color: '#b45309',
  },
  statusTextCancelled: {
    color: '#b91c1c',
  },
  statusTextDraft: {
    color: '#475569',
  },

  // Action Buttons
  actionBtn: {
    width: 28,
    height: 28,
    borderRadius: 7,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  viewActionIcon: {
    fontSize: 13,
  },

  editActionIcon: {
    fontSize: 13,
  },

  deleteActionIcon: {
    fontSize: 13,
  },

  // Empty State
  emptyTable: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH - 32,
  },

  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // Scroll Track Indicator
  scrollTrack: {
    height: 3.5,
    backgroundColor: '#f1f5f9',
    width: '100%',
  },

  scrollThumb: {
    width: 60,
    height: '100%',
    backgroundColor: '#ea7e30',
    borderRadius: 2,
    marginLeft: 20,
  },

  // ---- 5. PAGINATION FOOTER ----
  paginationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },

  paginationInfoText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#64748b',
  },

  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  pageBtnDisabled: {
    opacity: 0.4,
    backgroundColor: '#f1f5f9',
  },

  pageBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 18,
  },

  pageBtnTextDisabled: {
    color: '#94a3b8',
  },

  pageCountText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    paddingHorizontal: 4,
  },

  // ---- 6. FLOATING ADD BUTTON ----
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 50,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },

  addIconH: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  addIconV: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  // ---- 7. EXPORT MODAL ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  exportMenuCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },

  exportMenuTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 16,
    textAlign: 'center',
  },

  exportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  exportOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  exportOptionText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#1e293b',
  },
});