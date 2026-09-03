import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {purchaseOrderAPI} from '../api/purchaseOrderService';

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
  purchase_price?: number;
  discount?: number;
  tax_rate?: number;
  tax_amount?: number;
  total_amount?: number;
  received_quantity?: number;
  created_at?: string;
};

type PurchaseOrder = {
  id?: number;
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

  status?: string;
  notes?: string;
  document_name?: string;
  document_type?: string;

  created_at?: string;
  updated_at?: string;

  items?: PurchaseOrderItem[];
};

const PurchaseOrderHistoryScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);

  // ==========================================================
  // FETCH DATA FROM DATABASE
  // ==========================================================

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);

      const response = await purchaseOrderAPI.getPurchaseOrders();

      console.log(
        '========== PURCHASE ORDER DATABASE RESPONSE ==========',
      );
      console.log(JSON.stringify(response, null, 2));

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

      console.log('ORDERS USED BY HISTORY:', orderList);

      setOrders(orderList);
    } catch (error: any) {
      console.log('FETCH PURCHASE ORDERS ERROR:', error);

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load purchase orders from database.',
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // REFRESH
  // ==========================================================

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchPurchaseOrders();
    } finally {
      setRefreshing(false);
    }
  };

  // ==========================================================
  // LOAD WHEN SCREEN OPENS
  // ==========================================================

  useFocusEffect(
    useCallback(() => {
      fetchPurchaseOrders();

      return () => {
        setMenuId(null);
      };
    }, []),
  );

  // ==========================================================
  // OPEN PURCHASE ORDER (VIEW)
  // ==========================================================

  const openPurchaseOrder = (order: PurchaseOrder) => {
    setMenuId(null);

    const orderId = order.id || (order as any)?.purchase_order_id;

    navigation.navigate('ViewPurchaseOrder', {
      mode: 'view',
      purchaseOrderId: orderId,
      purchaseOrder: order,
      order: order,
      user: user,
    });
  };

  // ==========================================================
  // EDIT PURCHASE ORDER
  // ==========================================================

  const editPurchaseOrder = (order: PurchaseOrder) => {
    setMenuId(null);

    const orderId = order.id || (order as any)?.purchase_order_id;

    navigation.navigate('PurchaseOrder', {
      mode: 'edit',
      purchaseOrderId: orderId,
      purchaseOrder: order,
      order: order,
      user: user,
    });
  };

  // ==========================================================
  // ADD PURCHASE ORDER
  // ==========================================================

  const addPurchaseOrder = () => {
    navigation.navigate('PurchaseOrder', {
      mode: 'add',
      user: user,
    });
  };

  // ==========================================================
  // DELETE
  // ==========================================================

  const deleteOrder = (order: PurchaseOrder) => {
    setMenuId(null);

    if (!order.id) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }

    const orderNumber =
      order.purchase_order_no ||
      `PO-${order.id}`;

    Alert.alert(
      'Delete Purchase Order',
      `Are you sure you want to delete ${orderNumber}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',

          onPress: async () => {
            try {
              setLoading(true);

              await purchaseOrderAPI.deletePurchaseOrder(order.id!);

              setOrders(prev =>
                prev.filter(item => item.id !== order.id),
              );

              Alert.alert(
                'Success',
                'Purchase order deleted successfully.',
              );
            } catch (error: any) {
              console.log('DELETE PURCHASE ORDER ERROR:', error);

              Alert.alert(
                'Error',
                error?.message ||
                  'Failed to delete purchase order.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // ==========================================================
  // DATE FORMATTER (e.g. 01 Sep 2026)
  // ==========================================================

  const formatCardDate = (value?: string): string => {
    if (!value) {
      return '-';
    }

    const str = String(value).trim();

    // If DD/MM/YYYY
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(str)) {
      const [d, m, y] = str.split('/');
      const dateObj = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(dateObj.getTime())) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${d} ${months[dateObj.getMonth()]} ${y}`;
      }
    }

    // If YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}/.test(str)) {
      const [y, m, d] = str.substring(0, 10).split('-');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = Number(m) - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        return `${d} ${months[monthIndex]} ${y}`;
      }
    }

    const parsed = new Date(str);
    if (!isNaN(parsed.getTime())) {
      const d = String(parsed.getDate()).padStart(2, '0');
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const y = parsed.getFullYear();
      return `${d} ${months[parsed.getMonth()]} ${y}`;
    }

    return str;
  };

  // ==========================================================
  // EXTRACT ORDER ITEMS
  // ==========================================================

  const getOrderItems = (data: PurchaseOrder): PurchaseOrderItem[] => {
    let itemsList: any[] = [];

    if (Array.isArray(data?.items)) {
      itemsList = data.items;
    } else if (typeof data?.items === 'string') {
      try {
        const parsed = JSON.parse(data.items);
        if (Array.isArray(parsed)) {
          itemsList = parsed;
        }
      } catch (e) {}
    } else if (Array.isArray((data as any)?.purchase_order_items)) {
      itemsList = (data as any).purchase_order_items;
    } else if (typeof (data as any)?.purchase_order_items === 'string') {
      try {
        const parsed = JSON.parse((data as any).purchase_order_items);
        if (Array.isArray(parsed)) {
          itemsList = parsed;
        }
      } catch (e) {}
    } else if (Array.isArray((data as any)?.order_items)) {
      itemsList = (data as any).order_items;
    } else if (Array.isArray((data as any)?.products)) {
      itemsList = (data as any).products;
    }

    return itemsList;
  };

  // ==========================================================
  // STATUS STYLE WITH COLORED DOT
  // ==========================================================

  const getStatusInfo = (status?: string) => {
    const s = String(status || '').toLowerCase().trim();
    if (s === 'received' || s === 'completed' || s === 'approved') {
      return {
        dotColor: '#16a34a',
        textColor: '#15803d',
        bgColor: '#dcfce7',
        label: status || 'Received',
      };
    }
    if (s === 'cancelled' || s === 'rejected') {
      return {
        dotColor: '#dc2626',
        textColor: '#b91c1c',
        bgColor: '#fee2e2',
        label: status || 'Cancelled',
      };
    }
    if (s === 'pending') {
      return {
        dotColor: '#eab308',
        textColor: '#b45309',
        bgColor: '#fef3c7',
        label: 'Pending',
      };
    }
    return {
      dotColor: '#6b7280',
      textColor: '#374151',
      bgColor: '#f3f4f6',
      label: status || 'Draft',
    };
  };

  const displayStatus = (order: PurchaseOrder) => {
    if (
      order.status !== undefined &&
      order.status !== null &&
      String(order.status).trim() !== ''
    ) {
      return String(order.status);
    }
    return 'Pending';
  };

  // ==========================================================
  // FORMAT TOTAL AMOUNT (e.g. ₹12,500)
  // ==========================================================

  const formatTotalAmount = (order: PurchaseOrder): string => {
    if (
      order.total_amount !== undefined &&
      order.total_amount !== null &&
      !isNaN(Number(order.total_amount))
    ) {
      const num = Number(order.total_amount);
      return `₹${num.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })}`;
    }
    return '₹0';
  };

  return (
    <View style={styles.container}>
      {/* ======================================================
          HEADER
      ====================================================== */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Purchase Orders</Text>
      </View>

      {/* ======================================================
          LIST
      ====================================================== */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#4338ca']}
            tintColor="#4338ca"
          />
        }
        onScrollBeginDrag={() => setMenuId(null)}>
        {/* LOADING */}
        {loading && orders.length === 0 ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#4338ca" />
            <Text style={styles.loadingText}>Loading purchase orders...</Text>
          </View>
        ) : orders.length === 0 ? (
          /* EMPTY */
          <View style={styles.emptyBox}>
            <Text style={styles.emptyTitle}>No Purchase Orders</Text>
            <Text style={styles.emptyText}>
              No purchase orders are available in the database.
            </Text>
            <TouchableOpacity
              style={styles.createButton}
              onPress={addPurchaseOrder}>
              <Text style={styles.createButtonText}>
                + Create Purchase Order
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* ==================================================
             PURCHASE ORDER CARDS
             ================================================== */
          orders.map((order, index) => {
            const currentId = order.id ?? index;
            const isMenuOpen = menuId === currentId;

            const orderNumber =
              order.purchase_order_no || `PO-${order.id ?? index + 1}`;

            const supplier = order.supplier_name || 'Unknown Supplier';
            const date = formatCardDate(order.po_date || order.created_at);
            const status = displayStatus(order);
            const statusInfo = getStatusInfo(status);
            const totalFormatted = formatTotalAmount(order);
            const items = getOrderItems(order);
            const itemsCount = items.length;

            return (
              <View key={`${currentId}-${index}`} style={styles.cardWrapper}>
                <TouchableOpacity
                  activeOpacity={0.88}
                  style={styles.card}
                  onPress={() => openPurchaseOrder(order)}>
                  {/* TOP ROW: PO Number (Left) & Status Badge + Three Dots (Right) */}
                  <View style={styles.cardTopRow}>
                    <Text style={styles.orderNumber} numberOfLines={1}>
                      {orderNumber}
                    </Text>

                    <View style={styles.statusAndActionRow}>
                      <View
                        style={[
                          styles.statusBadge,
                          {backgroundColor: statusInfo.bgColor},
                        ]}>
                        <View
                          style={[
                            styles.statusDot,
                            {backgroundColor: statusInfo.dotColor},
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            {color: statusInfo.textColor},
                          ]}>
                          {statusInfo.label}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.menuButton}
                        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                        onPress={event => {
                          event.stopPropagation?.();
                          setMenuId(isMenuOpen ? null : currentId);
                        }}>
                        <Text style={styles.menuDots}>⋮</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* SUPPLIER NAME */}
                  <Text style={styles.supplierName} numberOfLines={1}>
                    {supplier}
                  </Text>

                  {/* BOTTOM ROW: (Date & Items Count on Left, Amount & View Details on Right) */}
                  <View style={styles.cardBottomRow}>
                    <View style={styles.bottomLeftCol}>
                      <Text style={styles.dateText}>{date}</Text>
                      <Text style={styles.itemsCountText}>
                        {itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}
                      </Text>
                    </View>

                    <View style={styles.bottomRightCol}>
                      <Text style={styles.totalAmountText}>
                        {totalFormatted}
                      </Text>
                      <TouchableOpacity
                        onPress={() => openPurchaseOrder(order)}
                        hitSlop={{top: 6, bottom: 6, left: 6, right: 6}}>
                        <Text style={styles.viewDetailsText}>
                          View Details →
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>

                {/* THREE DOTS ACTION MENU */}
                {isMenuOpen && (
                  <View style={styles.menuDropdown}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => editPurchaseOrder(order)}>
                      <Text style={styles.menuItemText}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.menuItem, styles.lastMenuItem]}
                      onPress={() => deleteOrder(order)}>
                      <Text
                        style={[styles.menuItemText, styles.deleteItemText]}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* FLOATING ACTION BUTTON (BOTTOM RIGHT) */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.85}
        onPress={addPurchaseOrder}>
        <Text style={styles.floatingButtonIcon}>+</Text>
        <Text style={styles.floatingButtonText}>Purchase Order</Text>
      </TouchableOpacity>

      {/* DELETE / LOADING OVERLAY */}
      {loading && orders.length > 0 && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="small" color="#4338ca" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

// ==========================================================
// STYLES
// ==========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // HEADER
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  backText: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '300',
  },

  headerTitle: {
    flex: 1,
    color: '#fff',
    fontSize: 19,
    fontWeight: '700',
  },

  // CONTENT
  content: {
    padding: 14,
    paddingBottom: 90,
  },

  // LOADER
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 13,
  },

  // EMPTY
  emptyBox: {
    backgroundColor: '#fff',
    marginTop: 30,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  emptyText: {
    marginTop: 7,
    color: '#64748b',
    textAlign: 'center',
    fontSize: 13,
  },

  createButton: {
    marginTop: 18,
    backgroundColor: '#4338ca',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 7,
  },

  createButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },

  // ==========================================================
  // CARD DESIGN
  // ==========================================================

  cardWrapper: {
    position: 'relative',
    marginBottom: 12,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1.5},
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  orderNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    flex: 1,
    marginRight: 8,
  },

  statusAndActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 12,
    marginRight: 4,
  },

  statusDot: {
    width: 6.5,
    height: 6.5,
    borderRadius: 4,
    marginRight: 5,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },

  menuButton: {
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 2,
  },

  menuDots: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '700',
    lineHeight: 22,
  },

  supplierName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginTop: 4,
    marginBottom: 14,
  },

  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  bottomLeftCol: {
    justifyContent: 'flex-end',
  },

  dateText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '400',
  },

  itemsCountText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginTop: 3,
  },

  bottomRightCol: {
    alignItems: 'flex-end',
  },

  totalAmountText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },

  viewDetailsText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4338ca',
    marginTop: 4,
  },

  menuDropdown: {
    position: 'absolute',
    right: 14,
    top: 44,
    width: 120,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    zIndex: 999,
    overflow: 'hidden',
  },

  menuItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  lastMenuItem: {
    borderBottomWidth: 0,
  },

  menuItemText: {
    fontSize: 13.5,
    fontWeight: '500',
    color: '#0f172a',
  },

  deleteItemText: {
    color: '#dc2626',
  },

  // LOADING OVERLAY
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(15,23,42,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingBox: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },

  processingText: {
    marginLeft: 9,
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    backgroundColor: '#4338ca',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 30,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 5,
    zIndex: 99,
  },

  floatingButtonIcon: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginRight: 6,
    lineHeight: 22,
  },

  floatingButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default PurchaseOrderHistoryScreen;