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
import {saleAPI} from '../api/saleService';
import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route: any;
};

export type SaleProductItem = {
  id?: number | string;
  product_id?: number | string;
  productId?: number | string;
  product?: string;
  product_name?: string;
  productName?: string;
  hsn?: string;
  hsn_code?: string;
  quantity?: number | string;
  qty?: number | string;
  rate?: number | string;
  sale_price?: number | string;
  selling_price?: number | string;
  discount?: number | string;
  discount_percent?: number | string;
  tax_rate?: number | string;
  gst?: number | string;
  gst_percent?: number | string;
  tax_amount?: number | string;
  gst_amount?: number | string;
  cgst_amount?: number | string;
  sgst_amount?: number | string;
  igst_amount?: number | string;
  taxable_amount?: number | string;
  total_amount?: number | string;
};

export type SaleRecord = {
  id?: number | string;
  sale_id?: number | string;
  SaleNo?: string;
  sale_no?: string;
  bill_no?: string;
  bill_number?: string;
  invoice_number?: string;
  SaleDate?: string;
  sale_date?: string;
  date?: string;
  customer?: string;
  customer_name?: string;
  customerName?: string;
  customer_phone?: string;
  phone?: string;
  customer_address?: string;
  address?: string;
  customer_state?: string;
  state?: string;
  customer_pincode?: string;
  pincode?: string;
  gst_rate?: number | string;
  tax_rate?: number | string;
  subtotal?: number | string;
  discount?: number | string;
  discount_amount?: number | string;
  tax_amount?: number | string;
  gst_amount?: number | string;
  cgst_amount?: number | string;
  sgst_amount?: number | string;
  igst_amount?: number | string;
  taxable_amount?: number | string;
  total_amount?: number | string;
  GrandTotal?: number | string;
  grand_total?: number | string;
  payment_method?: string;
  payment_mode?: string;
  payment_status?: string;
  status?: string;
  notes?: string;
  items?: SaleProductItem[];
  sale_items?: SaleProductItem[] | string;
  products?: SaleProductItem[];
  quantity?: number;
  qty?: number;
  total_items?: number;
  item_count?: number;
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

const EyeIcon = ({size = 14, color = '#6366f1'}: {size?: number; color?: string}) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.8,
        height: size * 0.8,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: size * 0.6,
        borderBottomRightRadius: size * 0.6,
        borderTopRightRadius: size * 0.1,
        borderBottomLeftRadius: size * 0.1,
        transform: [{rotate: '45deg'}],
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

const INITIAL_DEMO_SALES: SaleRecord[] = [
  {
    id: 1,
    invoice_number: 'INV-2026-001',
    sale_date: '16-Sep-2026',
    customer_name: 'Rahul Sharma',
    customer_phone: '+91 98765 12340',
    customer_state: 'Maharashtra',
    total_amount: 3450,
    payment_status: 'Paid',
    payment_method: 'UPI',
    items: [
      {product_name: 'Amul Taaza Milk 1L', quantity: 10, sale_price: 52, total_amount: 520},
      {product_name: "Lay's Classic Salted 52g", quantity: 15, sale_price: 20, total_amount: 300},
      {product_name: 'Tata Tea Gold 250g', quantity: 20, sale_price: 131.5, total_amount: 2630},
    ],
  },
  {
    id: 2,
    invoice_number: 'INV-2026-002',
    sale_date: '15-Sep-2026',
    customer_name: 'Pooja Enterprises',
    customer_phone: '+91 98234 56781',
    customer_state: 'Maharashtra',
    total_amount: 8920,
    payment_status: 'Paid',
    payment_method: 'Bank Transfer',
    items: [
      {product_name: 'Classmate Notebook 172p', quantity: 120, sale_price: 45, total_amount: 5400},
      {product_name: 'Surf Excel 1kg', quantity: 25, sale_price: 140.8, total_amount: 3520},
    ],
  },
  {
    id: 3,
    invoice_number: 'INV-2026-003',
    sale_date: '14-Sep-2026',
    customer_name: 'Aditi Verma',
    customer_phone: '+91 97123 45672',
    customer_state: 'Gujarat',
    total_amount: 1250,
    payment_status: 'Partial',
    payment_method: 'Cash',
    items: [
      {product_name: 'Tata Tea Gold 250g', quantity: 8, sale_price: 156.25, total_amount: 1250},
    ],
  },
  {
    id: 4,
    invoice_number: 'INV-2026-004',
    sale_date: '13-Sep-2026',
    customer_name: 'Apex Supermart',
    customer_phone: '+91 99345 67893',
    customer_state: 'Maharashtra',
    total_amount: 18600,
    payment_status: 'Pending',
    payment_method: 'Credit',
    items: [
      {product_name: 'Surf Excel 1kg', quantity: 80, sale_price: 135, total_amount: 10800},
      {product_name: 'Classmate Notebook 172p', quantity: 150, sale_price: 42, total_amount: 6300},
      {product_name: "Lay's Classic Salted 52g", quantity: 75, sale_price: 20, total_amount: 1500},
    ],
  },
  {
    id: 5,
    invoice_number: 'INV-2026-005',
    sale_date: '11-Sep-2026',
    customer_name: 'Rajesh Gupta',
    customer_phone: '+91 91234 98765',
    customer_state: 'Madhya Pradesh',
    total_amount: 2840,
    payment_status: 'Paid',
    payment_method: 'UPI',
    items: [
      {product_name: 'Amul Taaza Milk 1L', quantity: 20, sale_price: 52, total_amount: 1040},
      {product_name: 'Surf Excel 1kg', quantity: 12, sale_price: 150, total_amount: 1800},
    ],
  },
  {
    id: 6,
    invoice_number: 'INV-2026-006',
    sale_date: '10-Sep-2026',
    customer_name: 'Sunshine Mart',
    customer_phone: '+91 98456 12378',
    customer_state: 'Maharashtra',
    total_amount: 14200,
    payment_status: 'Paid',
    payment_method: 'Cash',
    items: [
      {product_name: 'Tata Tea Gold 250g', quantity: 60, sale_price: 145, total_amount: 8700},
      {product_name: 'Classmate Notebook 172p', quantity: 110, sale_price: 50, total_amount: 5500},
    ],
  },
  {
    id: 7,
    invoice_number: 'INV-2026-007',
    sale_date: '08-Sep-2026',
    customer_name: 'Deepak Joshi',
    customer_phone: '+91 98712 34560',
    customer_state: 'Maharashtra',
    total_amount: 980,
    payment_status: 'Paid',
    payment_method: 'UPI',
    items: [
      {product_name: "Lay's Classic Salted 52g", quantity: 49, sale_price: 20, total_amount: 980},
    ],
  },
  {
    id: 8,
    invoice_number: 'INV-2026-008',
    sale_date: '06-Sep-2026',
    customer_name: 'Sai Kirana Stores',
    customer_phone: '+91 97654 32189',
    customer_state: 'Maharashtra',
    total_amount: 24750,
    payment_status: 'Partial',
    payment_method: 'Cheque',
    items: [
      {product_name: 'Surf Excel 1kg', quantity: 120, sale_price: 135, total_amount: 16200},
      {product_name: 'Tata Tea Gold 250g', quantity: 50, sale_price: 145, total_amount: 7250},
      {product_name: 'Amul Taaza Milk 1L', quantity: 25, sale_price: 52, total_amount: 1300},
    ],
  },
];

const AllSalesScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;
  const [sales, setSales] = useState<SaleRecord[]>(INITIAL_DEMO_SALES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await saleAPI.getSales();
      const saleList =
        response?.sales ||
        response?.data ||
        (Array.isArray(response) ? response : []);

      if (Array.isArray(saleList)) {
        setSales(saleList);
      }
    } catch (error: any) {
      console.log('FETCH SALES ERROR:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchSales();
    }, []),
  );

  const getSaleId = (sale: SaleRecord) => {
    return sale.id || sale.sale_id;
  };

  const getInvoiceNumber = (sale: SaleRecord, defaultIndex: number) => {
    return (
      sale.invoice_number ||
      sale.SaleNo ||
      sale.sale_no ||
      sale.bill_no ||
      sale.bill_number ||
      `INV-2026-${String(defaultIndex).padStart(3, '0')}`
    );
  };

  const getSaleDate = (sale: SaleRecord) => {
    return sale.sale_date || sale.SaleDate || sale.date || '-';
  };

  const getCustomerName = (sale: SaleRecord) => {
    return sale.customer_name || sale.customer || sale.customerName || 'General Customer';
  };

  const getSaleItems = (data: SaleRecord): SaleProductItem[] => {
    let itemsList: any[] = [];
    if (Array.isArray(data?.items)) {
      itemsList = data.items;
    } else if (typeof data?.items === 'string') {
      try {
        const parsed = JSON.parse(data.items);
        if (Array.isArray(parsed)) itemsList = parsed;
      } catch (e) {}
    } else if (Array.isArray(data?.sale_items)) {
      itemsList = data.sale_items;
    } else if (typeof data?.sale_items === 'string') {
      try {
        const parsed = JSON.parse(data.sale_items);
        if (Array.isArray(parsed)) itemsList = parsed;
      } catch (e) {}
    } else if (Array.isArray(data?.products)) {
      itemsList = data.products;
    }

    return itemsList;
  };

  const getItemCount = (sale: SaleRecord) => {
    const items = getSaleItems(sale);
    if (items.length > 0) return items.length;
    if (sale.total_items || sale.item_count) {
      return Number(sale.total_items || sale.item_count || 0);
    }
    return 1;
  };

  const getTotalQuantity = (sale: SaleRecord) => {
    const items = getSaleItems(sale);
    if (items.length > 0) {
      return items.reduce(
        (total, item) => total + Number(item.quantity ?? item.qty ?? 0),
        0,
      );
    }
    return Number(sale.quantity ?? sale.qty ?? 1);
  };

  const getTotalAmount = (sale: SaleRecord) => {
    // 1. Try to calculate from items precisely as the invoice modal does
    const items = getSaleItems(sale);
    if (items && items.length > 0) {
      let calculatedTotal = 0;
      const fallbackGstRate = Number(sale.gst_rate ?? sale.tax_rate ?? 18);
      
      items.forEach(item => {
        const qty = Number(item.quantity ?? item.qty ?? 0);
        const rate = Number(item.rate ?? item.sale_price ?? item.selling_price ?? 0);
        const discPercent = Number(item.discount ?? item.discount_percent ?? 0);
        
        const rawGst = Number(item.gst ?? item.tax_rate ?? item.gst_percent ?? 0);
        const gstPercent = rawGst > 0 ? rawGst : fallbackGstRate;
        
        const gross = qty * rate;
        const discAmt = gross * (discPercent / 100);
        const taxable = gross - discAmt;
        const taxAmt = taxable * (gstPercent / 100);
        calculatedTotal += (taxable + taxAmt);
      });
      
      if (calculatedTotal > 0) {
        // Add any additional invoice-level charges if they exist in the backend
        const freight = Number((sale as any).freight_charges || 0);
        const roundOff = Number((sale as any).round_off || 0);
        // Note: Invoice level discount is subtracted from total, but items already have discount.
        // If there's an invoice level discount, subtract it.
        const invoiceDiscount = Number((sale as any).discount || 0);
        // In this app, item-level discounts and invoice-level discounts might be mixed, 
        // but the modal usually calculates from items.
        return calculatedTotal + freight + roundOff - invoiceDiscount;
      }
    }

    // 2. Fallback to header-level fields
    const subtotal = Number(sale.subtotal || 0);
    const discount = Number(sale.discount || 0);
    const taxAmount = Number(sale.tax_amount || sale.gst_amount || 0);
    
    if (subtotal > 0 || taxAmount > 0) {
      const freight = Number((sale as any).freight_charges || 0);
      const roundOff = Number((sale as any).round_off || 0);
      const calculatedTotal = (subtotal - discount) + taxAmount + freight + roundOff;
      
      if (calculatedTotal > 0) {
        return calculatedTotal;
      }
    }

    // 3. Ultimate fallback to raw total_amount field
    return Number(
      sale.total_amount ??
        sale.GrandTotal ??
        sale.grand_total ??
        0,
    );
  };

  const getPaymentMethod = (sale: SaleRecord) => {
    return sale.payment_method || sale.payment_mode || 'Cash';
  };

  const getPaymentStatus = (sale: SaleRecord) => {
    return sale.payment_status || sale.status || 'Paid';
  };

  const openViewSale = (sale: SaleRecord) => {
    const saleId = getSaleId(sale);
    navigation.navigate('AddSale', {
      mode: 'edit',
      showBill: true,
      saleId,
      sale,
      user,
    });
  };

  const openEditSale = (sale: SaleRecord) => {
    const saleId = getSaleId(sale);
    navigation.navigate('AddSale', {
      mode: 'edit',
      saleId,
      sale,
      user,
    });
  };

  const deleteSale = (sale: SaleRecord) => {
    const saleId = getSaleId(sale);
    const invNo = getInvoiceNumber(sale, 1);

    Alert.alert(
      'Delete Sale',
      `Are you sure you want to delete invoice ${invNo}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              if (saleId) {
                await saleAPI.deleteSale(saleId).catch(() => {});
              }
              setSales(prev =>
                prev.filter(item => getSaleId(item) !== saleId),
              );
              Alert.alert('Success', 'Sale record deleted successfully.');
            } catch (error: any) {
              console.log('DELETE SALE ERROR:', error);
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
    const targetList = filteredSales.length > 0 ? filteredSales : sales;

    const columns = [
      {title: '#', width: 25, align: 'center' as const},
      {title: 'Invoice No.', width: 85},
      {title: 'Date', width: 70},
      {title: 'Customer', width: 105},
      {title: 'Items', width: 40, align: 'center' as const},
      {title: 'Qty', width: 40, align: 'center' as const},
      {title: 'Total (Rs)', width: 75, align: 'right' as const},
      {title: 'Payment', width: 60, align: 'center' as const},
      {title: 'Status', width: 55, align: 'center' as const},
    ];

    const rows = targetList.map((s, idx) => [
      String(idx + 1),
      getInvoiceNumber(s, idx + 1),
      getSaleDate(s),
      getCustomerName(s),
      String(getItemCount(s)),
      String(getTotalQuantity(s)),
      `Rs. ${getTotalAmount(s).toFixed(2)}`,
      getPaymentMethod(s),
      getPaymentStatus(s),
    ]);

    try {
      const pdfBase64 = generatePurePDF('All Sales Report', columns, rows);
      const filename = `Sales_${Date.now()}.pdf`;
      await saveFileToDevice(filename, pdfBase64, 'base64');
      Alert.alert('Success', `PDF saved successfully as ${filename}`);
    } catch (e: any) {
      Alert.alert('Export Error', e.message || 'Failed to export PDF');
    }
  };

  const filteredSales = sales.filter(s => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const inv = getInvoiceNumber(s, 1).toLowerCase();
    const cust = getCustomerName(s).toLowerCase();
    const status = getPaymentStatus(s).toLowerCase();
    const date = getSaleDate(s).toLowerCase();
    const mode = getPaymentMethod(s).toLowerCase();
    return (
      inv.includes(q) ||
      cust.includes(q) ||
      status.includes(q) ||
      date.includes(q) ||
      mode.includes(q)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSales.length / ITEMS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredSales.length,
  );
  const currentSales = filteredSales.slice(startIndex, endIndex);

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
          <Text style={styles.headerTitle}>All Invoices</Text>
        </View>
      </View>

      {/* 2. SEARCH & EXPORT ROW */}
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
          <Text style={styles.exportIcon}>📄</Text>
        </TouchableOpacity>
      </View>

      {/* 3. SWIPE HINT */}
      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintArrow}>➔</Text>
        <Text style={styles.swipeHintText}>
          Swipe the table to see all columns
        </Text>
      </View>

      {/* 4. MAIN DATA TABLE CARD */}
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
              <Text style={[styles.columnHeader, styles.colCustomer]}>
                CUSTOMER
              </Text>
              <Text style={[styles.columnHeader, styles.colItems]}>ITEMS</Text>
              <Text style={[styles.columnHeader, styles.colQty]}>QTY</Text>
              <Text style={[styles.columnHeader, styles.colTotal]}>TOTAL</Text>
              <Text style={[styles.columnHeader, styles.colPayment]}>PAYMENT</Text>
              <Text style={[styles.columnHeader, styles.colStatus]}>
                STATUS
              </Text>
              <Text style={[styles.columnHeader, styles.colActions]}>
                ACTIONS
              </Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentSales.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const statusStr = getPaymentStatus(item).toLowerCase();
              const isPaid = statusStr === 'paid' || statusStr === 'completed';
              const isPartial = statusStr === 'partial' || statusStr === 'partially paid';

              return (
                <View
                  key={getSaleId(item) || index}
                  style={[
                    styles.tableRow,
                    index === currentSales.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* Invoice No. Column */}
                  <View style={styles.colInvoice}>
                    <Text style={styles.cellNameText} numberOfLines={1}>
                      {getInvoiceNumber(item, globalIndex)}
                    </Text>
                  </View>

                  {/* Date Column */}
                  <View style={styles.colDate}>
                    <Text style={styles.cellDateText}>
                      {getSaleDate(item)}
                    </Text>
                  </View>

                  {/* Customer Column */}
                  <View style={styles.colCustomer}>
                    <Text style={styles.cellCustomerText} numberOfLines={1}>
                      {getCustomerName(item)}
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
                      ₹{getTotalAmount(item).toFixed(2)}
                    </Text>
                  </View>

                  {/* Payment Method Column */}
                  <View style={styles.colPayment}>
                    <Text style={styles.cellPaymentText} numberOfLines={1}>
                      {getPaymentMethod(item)}
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
                        {getPaymentStatus(item)}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openViewSale(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <EyeIcon size={14} color="#6366f1" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditSale(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => deleteSale(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentSales.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No sales records found.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Scroll Bar Track Indicator */}
        <View style={styles.scrollTrack}>
          <View style={styles.scrollThumb} />
        </View>

        {/* 5. PAGINATION FOOTER */}
        {filteredSales.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredSales.length}`}
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

      {/* 6. FLOATING ADD BUTTON */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('AddSale', {user})}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* 7. EXPORT MENU MODAL */}
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

export default AllSalesScreen;

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

  // 2. SEARCH & EXPORT ROW
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
    shadowOffset: {width: 0, height: 3},
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

  colInvoice: {
    width: 130,
    paddingHorizontal: 6,
  },

  colDate: {
    width: 105,
    paddingHorizontal: 6,
  },

  colCustomer: {
    width: 160,
    paddingHorizontal: 6,
  },

  colItems: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  colQty: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  colTotal: {
    width: 115,
    paddingHorizontal: 6,
  },

  colPayment: {
    width: 105,
    paddingHorizontal: 6,
  },

  colStatus: {
    width: 105,
    paddingHorizontal: 6,
    alignItems: 'flex-start',
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

  cellNameText: {
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

  cellTotalText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },

  cellPaymentText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '600',
  },

  // Status Badges
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadgePaid: {
    backgroundColor: '#ecfdf5',
  },

  statusBadgePartial: {
    backgroundColor: '#fffbeb',
  },

  statusBadgePending: {
    backgroundColor: '#fef2f2',
  },

  statusBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },

  statusTextPaid: {
    color: '#059669',
  },

  statusTextPartial: {
    color: '#d97706',
  },

  statusTextPending: {
    color: '#dc2626',
  },

  // Actions
  actionBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
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
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // Scroll indicator track
  scrollTrack: {
    height: 3,
    backgroundColor: '#f1f5f9',
    width: '100%',
  },

  scrollThumb: {
    height: 3,
    width: 60,
    backgroundColor: '#ea7e30',
    borderRadius: 1.5,
  },

  // 5. PAGINATION FOOTER
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
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  pageBtnDisabled: {
    opacity: 0.4,
  },

  pageBtnText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginTop: -2,
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

  // 6. FLOATING ADD BUTTON
  floatingAddButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },

  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  addIconV: {
    position: 'absolute',
    width: 3,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  // 7. EXPORT MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
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
    backgroundColor: '#f8fafc',
    paddingVertical: 14,
    paddingHorizontal: 16,
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
