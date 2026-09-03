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
  product_id?: number | string;
  product?: string;
  product_name?: string;
  sku?: string;
  product_sku?: string;
  quantity?: number | string;
  qty?: number | string;
  purchase_price?: number | string;
  rate?: number | string;
  hsn?: string;
  hsn_code?: string;
  product_hsn_code?: string;
  product_unit?: string;
  discount?: number | string;
  discount_amount?: number | string;
  tax_rate?: number | string;
  gst?: number | string;
  tax_amount?: number | string;
  gst_amount?: number | string;
  total_amount?: number | string;
  total?: number | string;
};

type PurchaseOrder = {
  id?: number;
  purchase_order_id?: number;
  user_id?: number;

  supplier_id?: number | string;
  supplier?: string;
  supplier_name?: string;
  supplier_phone?: string;
  phone_number?: string;
  supplier_email?: string;
  email_address?: string;
  supplier_gstin?: string;
  gstin?: string;
  supplier_address?: string;
  address?: string;

  purchase_order_no?: string;
  po_number?: string;
  po_no?: string;

  po_date?: string;
  purchase_date?: string;
  expected_date?: string;
  delivery_date?: string;

  subtotal?: number | string;
  discount?: number | string;
  tax_amount?: number | string;
  total_amount?: number | string;

  status?: string;
  payment_status?: string;
  payment_method?: string;
  notes?: string;
  document_name?: string;

  created_at?: string;
  updated_at?: string;

  items?: PurchaseOrderItem[];
  purchase_order_items?: PurchaseOrderItem[] | string;
  order_items?: PurchaseOrderItem[] | string;
  products?: PurchaseOrderItem[];
};

const ViewPurchaseOrderScreen = ({navigation, route}: Props) => {
  const purchaseOrderId =
    route?.params?.purchaseOrderId ||
    route?.params?.id ||
    route?.params?.purchaseOrder?.id;

  const passedOrder =
    route?.params?.purchaseOrder || route?.params?.order;

  const user = route?.params?.user;

  const [order, setOrder] = useState<PurchaseOrder | null>(
    passedOrder || null,
  );
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // =========================================================
  // FETCH LATEST PURCHASE ORDER FROM DATABASE
  // =========================================================
  const fetchPurchaseOrderDetails = async (isPullToRefresh = false) => {
    try {
      if (!purchaseOrderId) {
        if (!passedOrder) {
          Alert.alert('Error', 'Purchase Order ID not found.');
        }
        return;
      }

      if (isPullToRefresh) {
        setRefreshing(true);
      } else if (!order) {
        setLoading(true);
      }

      const response =
        await purchaseOrderAPI.getPurchaseOrderById(purchaseOrderId);

      if (response) {
        setOrder(response);
      }
    } catch (error: any) {
      console.log('VIEW PURCHASE ORDER ERROR:', error);
      if (!passedOrder && !order) {
        Alert.alert(
          'Error',
          error?.message || 'Unable to load purchase order details.',
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPurchaseOrderDetails();
      return () => {
        setIsMenuOpen(false);
      };
    }, [purchaseOrderId]),
  );

  // =========================================================
  // GET ITEMS
  // =========================================================
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
      } catch (error) {}
    } else if (Array.isArray(data?.purchase_order_items)) {
      itemsList = data.purchase_order_items;
    } else if (typeof data?.purchase_order_items === 'string') {
      try {
        const parsed = JSON.parse(data.purchase_order_items);
        if (Array.isArray(parsed)) {
          itemsList = parsed;
        }
      } catch (error) {}
    } else if (Array.isArray(data?.order_items)) {
      itemsList = data.order_items;
    } else if (Array.isArray(data?.products)) {
      itemsList = data.products;
    }

    return itemsList;
  };

  const formatAmount = (value: any) => {
    const num = Number(value) || 0;
    return `₹${num.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getQuantity = (item: PurchaseOrderItem) => {
    return Number(item.quantity ?? item.qty ?? 0);
  };

  const getRate = (item: PurchaseOrderItem) => {
    return Number(item.purchase_price ?? item.rate ?? 0);
  };

  const getDiscount = (item: PurchaseOrderItem) => {
    return Number(item.discount ?? item.discount_amount ?? 0);
  };

  const getTaxRate = (item: PurchaseOrderItem) => {
    return Number(item.tax_rate ?? item.gst ?? 0);
  };

  const getTaxAmount = (item: PurchaseOrderItem) => {
    if (item.tax_amount !== undefined && item.tax_amount !== null) {
      return Number(item.tax_amount);
    }
    if (item.gst_amount !== undefined && item.gst_amount !== null) {
      return Number(item.gst_amount);
    }
    const quantity = getQuantity(item);
    const rate = getRate(item);
    const discount = getDiscount(item);
    const taxable = quantity * rate - discount;
    return (taxable * getTaxRate(item)) / 100;
  };

  const getTotal = (item: PurchaseOrderItem) => {
    if (item.total_amount !== undefined && item.total_amount !== null) {
      return Number(item.total_amount);
    }
    if (item.total !== undefined && item.total !== null) {
      return Number(item.total);
    }
    const quantity = getQuantity(item);
    const rate = getRate(item);
    const discount = getDiscount(item);
    const tax = getTaxAmount(item);
    return quantity * rate - discount + tax;
  };

  const handleSave = () => {
    Alert.alert('Saved', 'Purchase order details saved successfully.', [
      {
        text: 'OK',
        onPress: () => navigation.goBack(),
      },
    ]);
  };

  const handleEdit = () => {
    setIsMenuOpen(false);
    const currentId = order?.id || purchaseOrderId;
    if (!currentId) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }
    navigation.navigate('PurchaseOrder', {
      mode: 'edit',
      purchaseOrderId: currentId,
      purchaseOrder: order,
      order: order,
      user: user,
    });
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    const currentId = order?.id || purchaseOrderId;
    if (!currentId) {
      Alert.alert('Error', 'Purchase Order ID not found.');
      return;
    }

    const poNumber =
      order?.purchase_order_no ||
      order?.po_number ||
      `PO-${currentId}`;

    Alert.alert(
      'Delete Purchase Order',
      `Are you sure you want to delete ${poNumber}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await purchaseOrderAPI.deletePurchaseOrder(currentId);
              Alert.alert(
                'Success',
                'Purchase order deleted successfully.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ],
              );
            } catch (err: any) {
              Alert.alert(
                'Error',
                err?.message || 'Failed to delete purchase order.',
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // Status badge styling helper
  const getStatusBadgeStyle = (status?: string) => {
    const s = String(status || '').toLowerCase();
    if (s === 'completed' || s === 'received' || s === 'approved') {
      return {bg: '#dcfce7', text: '#15803d'};
    }
    if (s === 'sent' || s === 'ordered' || s === 'issued') {
      return {bg: '#dbeafe', text: '#1d4ed8'};
    }
    if (s === 'cancelled' || s === 'rejected') {
      return {bg: '#fee2e2', text: '#b91c1c'};
    }
    return {bg: '#fef3c7', text: '#b45309'};
  };

  if (loading && !order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase Order Details</Text>
        </View>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4338ca" />
          <Text style={styles.loadingText}>Loading purchase order...</Text>
        </View>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.arrow}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Purchase Order Details</Text>
        </View>
        <View style={styles.noDataBox}>
          <Text style={styles.noDataTitle}>Purchase Order Not Found</Text>
          <Text style={styles.noDataText}>
            Unable to load purchase order details from server.
          </Text>
        </View>
      </View>
    );
  }

  const items = getOrderItems(order);
  const statusColors = getStatusBadgeStyle(order.status);
  const poNumber =
    order.purchase_order_no ||
    order.po_number ||
    order.po_no ||
    (order.id ? `PO-${order.id}` : 'N/A');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Purchase Order Details</Text>

        <TouchableOpacity
          style={styles.menuIconButton}
          onPress={() => setIsMenuOpen(!isMenuOpen)}>
          <Text style={styles.menuDots}>⋮</Text>
        </TouchableOpacity>
      </View>

      {/* HEADER MENU OVERLAY */}
      {isMenuOpen && (
        <View style={styles.menuDropdown}>
          <TouchableOpacity style={styles.menuDropdownItem} onPress={handleEdit}>
            <Text style={styles.menuDropdownText}>Edit Purchase Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuDropdownItem}
            onPress={() => {
              setIsMenuOpen(false);
              fetchPurchaseOrderDetails(true);
            }}>
            <Text style={styles.menuDropdownText}>Refresh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuDropdownItem, styles.deleteItem]}
            onPress={handleDelete}>
            <Text style={[styles.menuDropdownText, styles.deleteText]}>
              Delete Purchase Order
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* STRUCTURED BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchPurchaseOrderDetails(true)}
            colors={['#4338ca']}
            tintColor="#4338ca"
          />
        }
        onTouchStart={() => {
          if (isMenuOpen) setIsMenuOpen(false);
        }}>
        {/* =================================================
            1. PURCHASE ORDER INFORMATION
        ================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              PURCHASE ORDER INFORMATION
            </Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Purchase Order No.</Text>
              <Text style={styles.fieldValueBold}>{poNumber}</Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>PO Date</Text>
              <Text style={styles.fieldValue}>
                {order.po_date || order.purchase_date || 'N/A'}
              </Text>
            </View>

            {order.expected_date || order.delivery_date ? (
              <>
                <View style={styles.fieldDivider} />
                <View style={styles.fieldGroup}>
                  <Text style={styles.fieldLabel}>Expected Delivery Date</Text>
                  <Text style={styles.fieldValue}>
                    {order.expected_date || order.delivery_date}
                  </Text>
                </View>
              </>
            ) : null}

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Status</Text>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: statusColors.bg},
                ]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    {color: statusColors.text},
                  ]}>
                  {order.status || 'Draft'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* =================================================
            2. SUPPLIER INFORMATION
        ================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUPPLIER INFORMATION</Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Supplier Name</Text>
              <Text style={styles.fieldValueBold}>
                {order.supplier_name || order.supplier || 'No Supplier'}
              </Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone</Text>
              <Text style={styles.fieldValue}>
                {order.supplier_phone || order.phone_number || 'N/A'}
              </Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email</Text>
              <Text style={styles.fieldValue}>
                {order.supplier_email || order.email_address || 'N/A'}
              </Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>GSTIN</Text>
              <Text style={styles.fieldValue}>
                {order.supplier_gstin || order.gstin || 'N/A'}
              </Text>
            </View>

            <View style={styles.fieldDivider} />

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Address</Text>
              <Text style={styles.fieldValue}>
                {order.supplier_address || order.address || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            3. PRODUCT INFORMATION
        ================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>PRODUCT INFORMATION</Text>
            <Text style={styles.itemCountBadge}>
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </Text>
          </View>

          <View style={styles.sectionBodyNoPadding}>
            {items.length === 0 ? (
              <View style={styles.noItemsBox}>
                <Text style={styles.noItemsText}>
                  No product items available.
                </Text>
              </View>
            ) : (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.detailsTableWrapper}>
                  {/* TABLE HEADER */}
                  <View style={styles.detailsTableHeaderRow}>
                    <Text style={[styles.detailsThCell, styles.detColIdx]}>#</Text>
                    <Text style={[styles.detailsThCell, styles.detColProduct]}>Product & Details</Text>
                    <Text style={[styles.detailsThCell, styles.detColQty]}>Qty</Text>
                    <Text style={[styles.detailsThCell, styles.detColPrice]}>Rate</Text>
                    <Text style={[styles.detailsThCell, styles.detColDisc]}>Disc</Text>
                    <Text style={[styles.detailsThCell, styles.detColTax]}>GST</Text>
                    <Text style={[styles.detailsThCell, styles.detColTotal]}>Total</Text>
                  </View>

                  {/* TABLE ROWS */}
                  {items.map((item, index) => {
                    const quantity = getQuantity(item);
                    const rate = getRate(item);
                    const discount = getDiscount(item);
                    const taxRate = getTaxRate(item);
                    const taxAmount = getTaxAmount(item);
                    const total = getTotal(item);
                    const isEven = index % 2 === 0;

                    return (
                      <View
                        key={item.id || item.product_id || index}
                        style={[
                          styles.detailsTableDataRow,
                          isEven ? styles.rowEven : styles.rowOdd,
                        ]}>
                        <Text style={[styles.detailsTdCell, styles.detColIdx, styles.mutedText]}>
                          {index + 1}
                        </Text>

                        <View style={[styles.detColProduct, styles.productCell]}>
                          <Text style={styles.productNameText} numberOfLines={2}>
                            {item.product_name ||
                              item.product ||
                              `Product ${index + 1}`}
                          </Text>
                          <View style={styles.productBadgeRow}>
                            {item.product_sku || item.sku ? (
                              <Text style={styles.productSkuBadge}>
                                SKU: {item.product_sku || item.sku}
                              </Text>
                            ) : null}
                            {item.product_hsn_code || item.hsn_code || item.hsn ? (
                              <Text style={styles.productHsnBadge}>
                                HSN: {item.product_hsn_code || item.hsn_code || item.hsn}
                              </Text>
                            ) : null}
                          </View>
                        </View>

                        <Text style={[styles.detailsTdCell, styles.detColQty, styles.centerText, styles.boldDarkText]}>
                          {quantity}
                        </Text>

                        <Text style={[styles.detailsTdCell, styles.detColPrice, styles.rightText]}>
                          {formatAmount(rate)}
                        </Text>

                        <Text style={[styles.detailsTdCell, styles.detColDisc, styles.rightText]}>
                          {discount > 0 ? formatAmount(discount) : '-'}
                        </Text>

                        <View style={[styles.detColTax, styles.taxCellContainer]}>
                          <Text style={styles.taxRateText}>{taxRate}%</Text>
                          {taxAmount > 0 ? (
                            <Text style={styles.taxAmountSubText}>
                              ({formatAmount(taxAmount)})
                            </Text>
                          ) : null}
                        </View>

                        <Text style={[styles.detailsTdCell, styles.detColTotal, styles.rightText, styles.totalAmountHighlight]}>
                          {formatAmount(total)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>

        {/* =================================================
            4. ATTACHED DOCUMENT (IF APPLICABLE)
        ================================================= */}
        {order.document_name ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>ATTACHMENT</Text>
            </View>
            <View style={styles.sectionBody}>
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Document File</Text>
                <Text style={styles.fieldValueBold}>
                  📄 {order.document_name}
                </Text>
              </View>
            </View>
          </View>
        ) : null}

        {/* =================================================
            5. NOTES (IF APPLICABLE)
        ================================================= */}
        {order.notes ? (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NOTES</Text>
            </View>
            <View style={styles.sectionBody}>
              <Text style={styles.notesText}>{order.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* =================================================
            6. SUMMARY
        ================================================= */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>SUMMARY</Text>
          </View>

          <View style={styles.sectionBody}>
            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(order.subtotal)}
              </Text>
            </View>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(order.discount)}
              </Text>
            </View>

            <View style={styles.summaryLine}>
              <Text style={styles.summaryLabel}>GST</Text>
              <Text style={styles.summaryValue}>
                {formatAmount(order.tax_amount)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.grandTotalLine}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                {formatAmount(order.total_amount)}
              </Text>
            </View>
          </View>
        </View>

        {/* =================================================
            7. ACTION BUTTON
        ================================================= */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.saveButton}
          onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

// =========================================================
// STRUCTURED & INTERACTIVE STYLES
// =========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  // HEADER
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 46,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  backButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  arrow: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '700',
  },

  headerTitle: {
    flex: 1,
    marginLeft: 10,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.3,
  },

  menuIconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuDots: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },

  // MENU DROPDOWN
  menuDropdown: {
    position: 'absolute',
    right: 16,
    top: 90,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    minWidth: 180,
  },

  menuDropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  menuDropdownText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },

  deleteItem: {
    borderBottomWidth: 0,
  },

  deleteText: {
    color: '#dc2626',
  },

  // CONTENT
  content: {
    padding: 14,
    paddingBottom: 40,
  },

  // STRUCTURED SECTION CARD
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 14,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },

  sectionHeader: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  sectionHeaderRow: {
    backgroundColor: '#f8fafc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#334155',
    letterSpacing: 0.8,
  },

  itemCountBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  sectionBody: {
    padding: 16,
  },

  // FIELD GROUPS
  fieldGroup: {
    marginVertical: 4,
  },

  fieldLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
  },

  fieldValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },

  fieldValueBold: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
  },

  fieldDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 8,
  },

  // STATUS BADGE
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  // PRODUCT STRUCTURED BOX
  productStructuredBox: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    padding: 14,
  },

  productMarginTop: {
    marginTop: 14,
  },

  productTopHeader: {
    marginBottom: 6,
  },

  productNameLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },

  productNameValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
  },

  productMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  productMetaText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  productMetaValue: {
    color: '#1e293b',
    fontWeight: '700',
  },

  productInnerDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 6,
  },

  productTotalDivider: {
    height: 1.5,
    backgroundColor: '#cbd5e1',
    marginTop: 8,
    marginBottom: 8,
  },

  // DETAILS TABLE
  sectionBodyNoPadding: {
    padding: 0,
    overflow: 'hidden',
  },

  detailsTableWrapper: {
    minWidth: 520,
  },

  detailsTableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    paddingVertical: 9,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    alignItems: 'center',
  },

  detailsThCell: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },

  detailsTableDataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
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

  detailsTdCell: {
    fontSize: 12,
    color: '#334155',
  },

  detColIdx: {
    width: 26,
    textAlign: 'center',
  },

  detColProduct: {
    width: 170,
    paddingHorizontal: 6,
  },

  detColQty: {
    width: 44,
    textAlign: 'center',
  },

  detColPrice: {
    width: 80,
    textAlign: 'right',
  },

  detColDisc: {
    width: 60,
    textAlign: 'right',
  },

  detColTax: {
    width: 70,
    textAlign: 'right',
  },

  detColTotal: {
    width: 90,
    textAlign: 'right',
  },

  productBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    flexWrap: 'wrap',
    gap: 4,
  },

  productSkuBadge: {
    fontSize: 10,
    color: '#4338ca',
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },

  productHsnBadge: {
    fontSize: 10,
    color: '#0369a1',
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    overflow: 'hidden',
  },

  taxCellContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },

  taxRateText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

  taxAmountSubText: {
    fontSize: 10,
    color: '#64748b',
  },

  totalAmountHighlight: {
    fontWeight: '700',
    color: '#4338ca',
    fontSize: 13,
  },

  productCell: {
    justifyContent: 'center',
  },

  productNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
  },

  centerText: {
    textAlign: 'center',
  },

  rightText: {
    textAlign: 'right',
  },

  boldDarkText: {
    fontWeight: '700',
    color: '#0f172a',
  },

  mutedText: {
    color: '#94a3b8',
    fontSize: 11,
  },

  // STRUCTURED ROW (LABEL - VALUE)
  structuredRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },

  structuredLabel: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },

  structuredValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
  },

  structuredValueBold: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '700',
  },

  structuredTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  structuredTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },

  structuredTotalValue: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4338ca',
  },

  noItemsBox: {
    padding: 16,
    alignItems: 'center',
  },

  noItemsText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
  },

  // NOTES
  notesText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 20,
  },

  // SUMMARY
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '600',
  },

  summaryValue: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
  },

  summaryDivider: {
    height: 1.5,
    backgroundColor: '#cbd5e1',
    marginVertical: 10,
  },

  grandTotalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
  },

  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4338ca',
  },

  // SAVE BUTTON
  saveButton: {
    backgroundColor: '#4338ca',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#4338ca',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // LOADING & NO DATA
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },

  noDataBox: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  noDataTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },

  noDataText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
  },
});

export default ViewPurchaseOrderScreen;