import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {purchaseAPI} from '../api/purchaseService';

type Props = {
  navigation: any;
  route: any;
};

type PurchaseItem = {
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

const AllPurchasesScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
  const [menuId, setMenuId] = useState<number | null>(null);

  // =========================================================
  // FETCH PURCHASES
  // =========================================================

  const fetchPurchases = async () => {
    try {
      setLoading(true);

      const response = await purchaseAPI.getPurchases();

      console.log(
        'PURCHASE API RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      const purchaseList =
        response?.purchases ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      setPurchases(
        Array.isArray(purchaseList) ? purchaseList : [],
      );
    } catch (error: any) {
      console.log('FETCH PURCHASE ERROR:', error);

      Alert.alert(
        'Error',
        error?.message ||
          'Unable to load purchases. Check your backend server.',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // REFRESH WHEN SCREEN OPENS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      fetchPurchases();

      return () => {
        setMenuId(null);
      };
    }, []),
  );

  // =========================================================
  // GET PURCHASE ID
  // =========================================================

  const getPurchaseId = (purchase: Purchase) => {
    return purchase.id || purchase.purchase_id;
  };

  // =========================================================
  // VIEW PURCHASE
  // READ ONLY
  // =========================================================

  const openPurchase = (purchase: Purchase) => {
    setMenuId(null);

    const purchaseId = getPurchaseId(purchase);

    if (!purchaseId) {
      Alert.alert('Error', 'Purchase ID not found.');
      return;
    }

    console.log(
      'Opening purchase for VIEW:',
      purchaseId,
    );

    navigation.navigate('ViewPurchase', {
      mode: 'view',
      purchaseId: purchaseId,
      purchase: purchase,
      user: user,
    });
  };

  // =========================================================
  // EDIT PURCHASE
  // =========================================================

  const openEditPurchase = (purchase: Purchase) => {
    setMenuId(null);

    const purchaseId = getPurchaseId(purchase);

    if (!purchaseId) {
      Alert.alert('Error', 'Purchase ID not found.');
      return;
    }

    console.log(
      'Opening purchase for EDIT:',
      purchaseId,
    );

    navigation.navigate('AddPurchase', {
      mode: 'edit',
      purchaseId: purchaseId,
      purchase: purchase,
      user: user,
    });
  };

  // =========================================================
  // DELETE PURCHASE
  // =========================================================

  const deletePurchase = (purchase: Purchase) => {
    setMenuId(null);

    const purchaseId = getPurchaseId(purchase);

    if (!purchaseId) {
      Alert.alert('Error', 'Purchase ID not found.');
      return;
    }

    Alert.alert(
      'Delete Purchase',
      `Are you sure you want to delete purchase ${
        purchase.invoice_number || ''
      }?`,
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

              await purchaseAPI.deletePurchase(
                purchaseId,
              );

              setPurchases(prev =>
                prev.filter(item => {
                  const itemId = getPurchaseId(item);

                  return itemId !== purchaseId;
                }),
              );

              Alert.alert(
                'Success',
                'Purchase deleted successfully.',
              );
            } catch (error: any) {
              console.log(
                'DELETE PURCHASE ERROR:',
                error,
              );

              Alert.alert(
                'Error',
                error?.message ||
                  'Failed to delete purchase.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // =========================================================
  // GET PURCHASE ITEMS HELPER
  // =========================================================

  const getPurchaseItems = (data: Purchase): PurchaseItem[] => {
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
    } else if (Array.isArray(data?.purchase_items)) {
      itemsList = data.purchase_items;
    } else if (typeof data?.purchase_items === 'string') {
      try {
        const parsed = JSON.parse(data.purchase_items);
        if (Array.isArray(parsed)) {
          itemsList = parsed;
        }
      } catch (e) {}
    } else if (Array.isArray(data?.products)) {
      itemsList = data.products;
    }

    if (itemsList.length === 0 && (data.product_name || data.product)) {
      itemsList = [
        {
          product_name: data.product_name || data.product,
          product_sku: data.product_sku,
          product_unit: data.product_unit,
          product_hsn_code: data.product_hsn_code,
          quantity: data.quantity || data.qty || 1,
          purchase_price: data.purchase_price || data.rate || 0,
          tax_rate: data.tax_rate || data.gst || 0,
          tax_amount: data.tax_amount || 0,
          total_amount: data.total_amount || 0,
        },
      ];
    }

    return itemsList;
  };

  const getStatusBadgeStyle = (status?: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'paid' || s === 'completed') {
      return {bg: '#dcfce7', text: '#15803d'};
    }
    if (s === 'partial' || s === 'partially paid') {
      return {bg: '#dbeafe', text: '#1d4ed8'};
    }
    if (s === 'cancelled' || s === 'failed') {
      return {bg: '#fee2e2', text: '#b91c1c'};
    }
    return {bg: '#fef3c7', text: '#b45309'};
  };

  // =========================================================
  // GET ITEM COUNT
  // =========================================================

  const getItemCount = (purchase: Purchase) => {
    const itemsList = getPurchaseItems(purchase);

    if (itemsList.length > 0) {
      return itemsList.reduce(
        (total, item) =>
          total +
          Number(
            item.quantity ||
              item.qty ||
              1,
          ),
        0,
      );
    }

    if (
      purchase?.quantity ||
      purchase?.qty ||
      purchase?.total_items ||
      purchase?.item_count
    ) {
      return Number(
        purchase.quantity ||
          purchase.qty ||
          purchase.total_items ||
          purchase.item_count ||
          0,
      );
    }

    if (
      purchase?.product_name ||
      purchase?.product
    ) {
      return 1;
    }

    return 0;
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>

          <Text style={styles.arrow}>
            ←
          </Text>

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          All Purchases
        </Text>

      </View>

      {/* CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>

        {/* LOADING */}
        {loading &&
        purchases.length === 0 ? (

          <View style={styles.loader}>

            <ActivityIndicator
              size="large"
              color="#4338ca"
            />

            <Text style={styles.loadingText}>
              Loading purchases...
            </Text>

          </View>

        ) : purchases.length === 0 ? (

          /* EMPTY */
          <View style={styles.emptyBox}>

            <Text style={styles.emptyTitle}>
              No Purchases Found
            </Text>

            <Text style={styles.emptyText}>
              Add a purchase first and it will
              appear here.
            </Text>

          </View>

        ) : (

          /* PURCHASE LIST */
          purchases.map(
            (purchase, index) => {

              const currentId =
                getPurchaseId(purchase) ||
                index;

              const isMenuOpen =
                menuId === currentId;

              const items =
                getPurchaseItems(purchase);

              const totalQty = items.reduce(
                (sum, item) => sum + Number(item.quantity ?? item.qty ?? 0),
                0,
              );

              const paymentStatus =
                purchase.payment_status || 'Pending';

              const statusColors =
                getStatusBadgeStyle(paymentStatus);

              const totalAmount = Number(
                purchase.total_amount || 0,
              ).toFixed(2);

              return (
                <View
                  key={currentId}
                  style={
                    styles.purchaseWrapper
                  }>

                  {/* PURCHASE ROW WITH TABULAR PRODUCTS */}
                  <TouchableOpacity
                    activeOpacity={0.9}
                    style={
                      styles.purchaseRow
                    }
                    onPress={() =>
                      openPurchase(
                        purchase,
                      )
                    }>

                    {/* CARD HEADER */}
                    <View style={styles.cardHeader}>
                      <View style={styles.leftSection}>
                        <View style={styles.invoiceRow}>
                          <Text
                            style={styles.invoiceNumber}
                            numberOfLines={1}>
                            {purchase.invoice_number || `PUR-${purchase.id || index + 1}`}
                          </Text>

                          <View
                            style={[
                              styles.statusBadge,
                              {backgroundColor: statusColors.bg},
                            ]}>
                            <Text
                              style={[
                                styles.statusText,
                                {color: statusColors.text},
                              ]}>
                              {paymentStatus}
                            </Text>
                          </View>
                        </View>

                        <Text
                          style={styles.supplierName}
                          numberOfLines={1}>
                          {purchase.supplier_name || 'No Supplier'}
                        </Text>

                        <Text style={styles.date}>
                          Purchase Date: {purchase.purchase_date || 'No date'}
                        </Text>
                      </View>

                      {/* THREE DOT BUTTON */}
                      <TouchableOpacity
                        style={styles.menuButton}
                        onPress={event => {
                          event.stopPropagation?.();
                          setMenuId(
                            isMenuOpen
                              ? null
                              : Number(currentId),
                          );
                        }}>
                        <Text style={styles.menuDots}>⋮</Text>
                      </TouchableOpacity>
                    </View>

                    {/* =================================================
                        PRODUCT INFORMATION TABLE
                    ================================================= */}
                    <View style={styles.tableCardSection}>
                      <View style={styles.tableTitleRow}>
                        <Text style={styles.tableSectionTitle}>Product Information</Text>
                        <Text style={styles.itemCountText}>
                          {items.length} {items.length === 1 ? 'item' : 'items'}
                        </Text>
                      </View>

                      {items.length > 0 ? (
                        <View style={styles.tableWrapper}>
                          {/* TABLE HEADER */}
                          <View style={styles.tableHeaderRow}>
                            <Text style={[styles.thCell, styles.colIdx]}>#</Text>
                            <Text style={[styles.thCell, styles.colProduct]}>Product</Text>
                            <Text style={[styles.thCell, styles.colQty]}>Qty</Text>
                            <Text style={[styles.thCell, styles.colPrice]}>Price</Text>
                            <Text style={[styles.thCell, styles.colTax]}>GST</Text>
                            <Text style={[styles.thCell, styles.colTotal]}>Total</Text>
                          </View>

                          {/* TABLE ROWS */}
                          {items.map((item, itemIndex) => {
                            const quantity = Number(
                              item.quantity ?? item.qty ?? 0,
                            );
                            const price = Number(
                              item.purchase_price ?? item.rate ?? 0,
                            );
                            const taxRate = Number(
                              item.tax_rate ?? (item as any).gst ?? 0,
                            );
                            const itemTotal = Number(
                              item.total_amount ??
                                (quantity * price),
                            );
                            const isEven = itemIndex % 2 === 0;

                            return (
                              <View
                                key={item.id ?? itemIndex}
                                style={[
                                  styles.tableDataRow,
                                  isEven ? styles.rowEven : styles.rowOdd,
                                ]}>
                                <Text style={[styles.tdCell, styles.colIdx, styles.mutedText]}>
                                  {itemIndex + 1}
                                </Text>

                                <View style={[styles.colProduct, styles.productCell]}>
                                  <Text
                                    style={styles.productNameText}
                                    numberOfLines={1}>
                                    {item.product_name ||
                                      (item as any).product ||
                                      `Product ${itemIndex + 1}`}
                                  </Text>
                                  {item.product_sku || (item as any).sku ? (
                                    <Text
                                      style={styles.skuText}
                                      numberOfLines={1}>
                                      SKU: {item.product_sku || (item as any).sku}
                                    </Text>
                                  ) : null}
                                </View>

                                <Text style={[styles.tdCell, styles.colQty, styles.centerText]}>
                                  {quantity}
                                </Text>

                                <Text style={[styles.tdCell, styles.colPrice, styles.rightText]}>
                                  ₹{price.toFixed(2)}
                                </Text>

                                <Text style={[styles.tdCell, styles.colTax, styles.rightText]}>
                                  {taxRate > 0 ? `${taxRate}%` : '0%'}
                                </Text>

                                <Text style={[styles.tdCell, styles.colTotal, styles.rightText, styles.totalCellText]}>
                                  ₹{itemTotal.toFixed(2)}
                                </Text>
                              </View>
                            );
                          })}
                        </View>
                      ) : (
                        <View style={styles.noItemsBox}>
                          <Text style={styles.noItemsText}>No products listed</Text>
                        </View>
                      )}
                    </View>

                    {/* CARD FOOTER */}
                    <View style={styles.cardFooter}>
                      <Text style={styles.footerSummaryText}>
                        Total Qty: <Text style={styles.boldDarkText}>{totalQty}</Text>
                      </Text>
                      <View style={styles.footerTotalContainer}>
                        <Text style={styles.footerTotalLabel}>Total Amount:</Text>
                        <Text style={styles.footerTotalAmount}>₹{totalAmount}</Text>
                      </View>
                    </View>

                  </TouchableOpacity>

                  {/* MENU */}
                  {isMenuOpen && (

                    <View
                      style={styles.menu}>

                      {/* VIEW */}
                      <TouchableOpacity
                        style={
                          styles.menuItem
                        }
                        onPress={() =>
                          openPurchase(
                            purchase,
                          )
                        }>

                        <Text
                          style={
                            styles.menuText
                          }>

                          View Details

                        </Text>

                      </TouchableOpacity>

                      {/* EDIT */}
                      <TouchableOpacity
                        style={
                          styles.menuItem
                        }
                        onPress={() =>
                          openEditPurchase(
                            purchase,
                          )
                        }>

                        <Text
                          style={
                            styles.menuText
                          }>

                          Edit

                        </Text>

                      </TouchableOpacity>

                      {/* DELETE */}
                      <TouchableOpacity
                        style={[
                          styles.menuItem,
                          styles.deleteMenuItem,
                        ]}
                        onPress={() =>
                          deletePurchase(
                            purchase,
                          )
                        }>

                        <Text
                          style={[
                            styles.menuText,
                            styles.deleteText,
                          ]}>

                          Delete

                        </Text>

                      </TouchableOpacity>

                    </View>

                  )}

                </View>
              );
            },
          )

        )}

      </ScrollView>

      {/* FLOATING ACTION BUTTON (BOTTOM RIGHT) */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate('AddPurchase', {
            mode: 'add',
            user: user,
          })
        }>
        <Text style={styles.floatingButtonIcon}>+</Text>
        <Text style={styles.floatingButtonText}>Add Purchase</Text>
      </TouchableOpacity>

    </View>
  );
};

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#4338ca',
    paddingTop: 45,
    paddingBottom: 18,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 15,
    width: 35,
    height: 35,
    justifyContent: 'center',
  },

  arrow: {
    color: '#ffffff',
    fontSize: 30,
    lineHeight: 32,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },

  addButton: {
    height: 38,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 'auto',
  },

  addButtonText: {
    color: '#4338ca',
    fontSize: 13,
    fontWeight: '700',
  },

  content: {
    padding: 12,
    paddingBottom: 90,
  },

  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },

  emptyBox: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    padding: 35,
    borderRadius: 12,
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
    marginTop: 8,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
  },

  purchaseWrapper: {
    marginBottom: 14,
    position: 'relative',
  },

  purchaseRow: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  leftSection: {
    flex: 1,
    paddingRight: 8,
  },

  invoiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  invoiceNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  statusBadge: {
    marginLeft: 8,
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#92400e',
  },

  supplierName: {
    marginTop: 5,
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },

  date: {
    marginTop: 3,
    fontSize: 11,
    color: '#64748b',
  },

  menuButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },

  menuDots: {
    fontSize: 22,
    color: '#475569',
    fontWeight: '700',
  },

  // =========================================================
  // PRODUCT INFORMATION TABLE
  // =========================================================

  tableCardSection: {
    marginTop: 10,
  },

  tableTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  tableSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  itemCountText: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },

  tableWrapper: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },

  thCell: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },

  tableDataRow: {
    flexDirection: 'row',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },

  rowEven: {
    backgroundColor: '#ffffff',
  },

  rowOdd: {
    backgroundColor: '#f8fafc',
  },

  tdCell: {
    fontSize: 11,
    color: '#334155',
  },

  colIdx: {
    width: 20,
    textAlign: 'center',
  },

  colProduct: {
    flex: 2.2,
    paddingHorizontal: 4,
  },

  colQty: {
    width: 32,
    textAlign: 'center',
  },

  colPrice: {
    flex: 1.1,
    textAlign: 'right',
  },

  colTax: {
    width: 36,
    textAlign: 'right',
  },

  colTotal: {
    flex: 1.2,
    textAlign: 'right',
  },

  productCell: {
    justifyContent: 'center',
  },

  productNameText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0f172a',
  },

  skuText: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 1,
  },

  centerText: {
    textAlign: 'center',
  },

  rightText: {
    textAlign: 'right',
  },

  totalCellText: {
    fontWeight: '700',
    color: '#4338ca',
  },

  mutedText: {
    color: '#94a3b8',
    fontSize: 10,
  },

  noItemsBox: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  noItemsText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  // =========================================================
  // CARD FOOTER
  // =========================================================

  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  footerSummaryText: {
    fontSize: 12,
    color: '#64748b',
  },

  boldDarkText: {
    fontWeight: '700',
    color: '#0f172a',
  },

  footerTotalContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerTotalLabel: {
    fontSize: 12,
    color: '#64748b',
    marginRight: 5,
    fontWeight: '500',
  },

  footerTotalAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4338ca',
  },

  menu: {
    position: 'absolute',
    right: 8,
    top: 75,
    width: 140,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    zIndex: 100,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  deleteMenuItem: {
    borderBottomWidth: 0,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0f172a',
  },

  deleteText: {
    color: '#dc2626',
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

export default AllPurchasesScreen;