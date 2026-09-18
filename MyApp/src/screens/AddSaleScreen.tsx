import React, {useEffect, useState} from 'react';
import {Picker} from '@react-native-picker/picker';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {API_BASE_URL} from '../api/config';

type Props = {
  navigation: any;
  route: any;
};

type Product = {
  id: string;
  name: string;
  hsn: string;
  rate?: string | number;
  selling_price?: string | number;
  discount?: string | number;
  gst?: string | number;
};

type Customer = {
  id: string;
  name: string;
  phone?: string;
  address?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
};

type SaleItem = {
  id?: string | number;
  productId?: string | number | null;
  product: string;
  quantity: string;
  rate: string;
  discount: string;
  hsn: string;
  gst: string;

  taxableAmount?: number;
  gstAmount?: number;
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  totalAmount?: number;
};

const createEmptyItem = (): SaleItem => ({
  productId: null,
  product: '',
  quantity: '',
  rate: '',
  discount: '0',
  hsn: '',
  gst: '0',
});

const isItemBlank = (item: SaleItem): boolean =>
  !item.product.trim() &&
  !item.quantity.trim() &&
  !item.rate.trim() &&
  !item.hsn.trim();

const getCurrentDate = (): string => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const formatDateForMySQL = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`;
};

const parseExistingDate = (value: any): Date => {
  if (!value) {
    return new Date();
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

const formatCurrency = (value: number): string => {
  return `₹${Number(value || 0).toFixed(2)}`;
};

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

const AddSaleScreen = ({navigation, route}: Props) => {
  const routeSale =
    route?.params?.sale ||
    route?.params?.item ||
    null;

  const routeSaleId =
    route?.params?.saleId ||
    routeSale?.id ||
    routeSale?.sale_id ||
    null;

  const isEditing =
    route?.params?.mode === 'edit' ||
    !!routeSaleId;

  const [saleId, setSaleId] =
    useState<string | number | null>(routeSaleId);

  const [SaleNo, setSaleNo] = useState('');
  const [SaleDate, setSaleDate] =
    useState(getCurrentDate());

  const [showDatePicker, setShowDatePicker] =
    useState(false);

  const [selectedDate, setSelectedDate] =
    useState<Date>(new Date());

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loadingCustomers, setLoadingCustomers] =
    useState(false);

  const [Customer, setCustomer] = useState('');

  const [customerId, setCustomerId] =
    useState<string | number | null>(null);

  const [customerAddress, setCustomerAddress] =
    useState('');

  const [customerPhone, setCustomerPhone] =
    useState('');

  const [customerState, setCustomerState] =
    useState('');

  const [customerPincode, setCustomerPincode] =
    useState('');

  const [gstRate, setGstRate] =
    useState('18');

  const [showCustomers, setShowCustomers] =
    useState(false);

  const [productsList, setProductsList] =
    useState<Product[]>([]);

  const [items, setItems] = useState<SaleItem[]>(
    Array.from({length: 5}, createEmptyItem),
  );

  const [modalVisible, setModalVisible] =
    useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [modalProduct, setModalProduct] =
    useState('');

  const [modalProductId, setModalProductId] =
    useState<string | number | null>(null);

  const [modalQuantity, setModalQuantity] =
    useState('1');

  const [modalRate, setModalRate] =
    useState('');

  const [modalDiscount, setModalDiscount] =
    useState('0');

  const [modalHsn, setModalHsn] =
    useState('');

  const [modalGst, setModalGst] =
    useState('0');

  const [
    modalProductDropdownOpen,
    setModalProductDropdownOpen,
  ] = useState(false);

  const [PaymentMode, setPaymentMode] =
    useState('Cash');

  const [saving, setSaving] =
    useState(false);

  const numberValue = (value: any): number => {
    const number = Number(value);
    return Number.isFinite(number) ? number : 0;
  };

  const normalizeState = (state: any): string => {
    return String(state ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');
  };

  const isMaharashtraCustomer = (): boolean => {
    const state = normalizeState(customerState);
    if (!state) {
      return true;
    }
    return (
      state === 'maharashtra' ||
      state === 'mh' ||
      state.includes('maharashtra')
    );
  };

  const calculateProductGst = (
    taxableAmount: number,
    gstPercent: number,
  ) => {
    const taxable = Number(taxableAmount || 0);
    const rate = Number(gstPercent || 0);
    const totalGst = Number(((taxable * rate) / 100).toFixed(2));

    if (isMaharashtraCustomer()) {
      const cgst = Number((totalGst / 2).toFixed(2));
      const sgst = Number((totalGst - cgst).toFixed(2));

      return {
        cgstAmount: cgst,
        sgstAmount: sgst,
        igstAmount: 0,
        gstAmount: totalGst,
      };
    }

    return {
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: totalGst,
      gstAmount: totalGst,
    };
  };

  const loadCustomersFromDB = async () => {
    try {
      setLoadingCustomers(true);
      const response = await fetch(`${API_BASE_URL}/api/customers`);
      const data = await response.json();

      const customerData = Array.isArray(data)
        ? data
        : data?.customers || data?.data || [];

      const formattedCustomers: Customer[] = customerData.map((item: any) => ({
        id: String(item.id ?? item.customer_id ?? item.customerId ?? ''),
        name: item.name ?? item.customer_name ?? item.customerName ?? '',
        phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
        address: item.address ?? item.customer_address ?? '',
        state: item.state ?? item.customer_state ?? '',
        pincode: item.pincode ?? item.pin_code ?? item.postal_code ?? item.zip_code ?? '',
        gstin: item.gstin ?? item.gst_number ?? '',
      }));

      setCustomers(formattedCustomers);
    } catch (error) {
      console.log('Load customers error:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const loadProductsFromDB = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();

      const productData = Array.isArray(data)
        ? data
        : data?.products || data?.data || [];

      const formattedProducts: Product[] = productData.map((item: any) => ({
        id: String(item.id ?? item.product_id ?? item.productId ?? ''),
        name: item.name ?? item.product_name ?? item.productName ?? '',
        hsn: item.hsn ?? item.hsn_code ?? '',
        rate: item.rate ?? item.selling_price ?? item.sale_price ?? 0,
        selling_price: item.selling_price ?? item.sale_price ?? item.rate ?? 0,
        discount: item.discount ?? item.discount_percent ?? 0,
        gst: item.gst ?? item.gst_percent ?? item.tax_rate ?? 0,
      }));

      setProductsList(formattedProducts);
    } catch (error) {
      console.log('Load products error:', error);
    }
  };

  useEffect(() => {
    loadCustomersFromDB();
    loadProductsFromDB();

    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadCustomersFromDB();
      loadProductsFromDB();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (route?.params?.newCustomer) {
      const newCustomer = route.params.newCustomer;

      setCustomer(newCustomer.name || newCustomer.customer_name || '');
      setCustomerId(newCustomer.id ?? newCustomer.customer_id ?? null);
      setCustomerAddress(newCustomer.address ?? newCustomer.customer_address ?? '');
      setCustomerPhone(newCustomer.phone ?? newCustomer.mobile ?? newCustomer.phone_number ?? '');
      setCustomerState(newCustomer.state ?? newCustomer.customer_state ?? '');
      setCustomerPincode(newCustomer.pincode ?? newCustomer.pin_code ?? newCustomer.postal_code ?? '');
      setShowCustomers(false);
      loadCustomersFromDB();
    }
  }, [route?.params?.newCustomer]);

  const calculateItem = (item: SaleItem) => {
    const quantity = numberValue(item.quantity);
    const rate = numberValue(item.rate);
    const grossAmount = quantity * rate;
    const discountPercent = numberValue(item.discount);
    const discountAmount = (grossAmount * discountPercent) / 100;
    const taxableAmount = grossAmount - discountAmount;
    const gstPercent = numberValue(item.gst) > 0 ? numberValue(item.gst) : numberValue(gstRate);
    const gstBreakup = calculateProductGst(taxableAmount, gstPercent);
    const totalAmount = taxableAmount + gstBreakup.gstAmount;

    return {
      quantity,
      rate,
      grossAmount,
      discountPercent,
      discountAmount,
      taxableAmount,
      gstPercent,
      gstAmount: gstBreakup.gstAmount,
      cgstAmount: gstBreakup.cgstAmount,
      sgstAmount: gstBreakup.sgstAmount,
      igstAmount: gstBreakup.igstAmount,
      totalAmount,
    };
  };

  const calculateSaleSummary = () => {
    let subtotal = 0;
    let discountAmount = 0;
    let taxableAmount = 0;
    let gstAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;
    let grandTotal = 0;

    items.forEach((item: SaleItem) => {
      if (isItemBlank(item)) {
        return;
      }
      const calculation = calculateItem(item);
      subtotal += calculation.grossAmount;
      discountAmount += calculation.discountAmount;
      taxableAmount += calculation.taxableAmount;
      gstAmount += calculation.gstAmount;
      cgstAmount += calculation.cgstAmount;
      sgstAmount += calculation.sgstAmount;
      igstAmount += calculation.igstAmount;
      grandTotal += calculation.totalAmount;
    });

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      gstAmount,
      cgstAmount,
      sgstAmount,
      igstAmount,
      grandTotal,
    };
  };

  const calculateGstSummary = () => {
    const gstMap: {
      [key: string]: {
        taxableAmount: number;
        cgstAmount: number;
        sgstAmount: number;
        igstAmount: number;
        gstAmount: number;
      };
    } = {};

    items.forEach((item: SaleItem) => {
      if (isItemBlank(item)) {
        return;
      }
      const calculation = calculateItem(item);
      const gstRateKey = String(calculation.gstPercent);

      if (!gstMap[gstRateKey]) {
        gstMap[gstRateKey] = {
          taxableAmount: 0,
          cgstAmount: 0,
          sgstAmount: 0,
          igstAmount: 0,
          gstAmount: 0,
        };
      }

      gstMap[gstRateKey].taxableAmount += calculation.taxableAmount;
      gstMap[gstRateKey].cgstAmount += calculation.cgstAmount;
      gstMap[gstRateKey].sgstAmount += calculation.sgstAmount;
      gstMap[gstRateKey].igstAmount += calculation.igstAmount;
      gstMap[gstRateKey].gstAmount += calculation.gstAmount;
    });

    return Object.keys(gstMap)
      .sort((a, b) => Number(a) - Number(b))
      .map(gstRateVal => ({
        gstRate: gstRateVal,
        taxableAmount: Number(gstMap[gstRateVal].taxableAmount.toFixed(2)),
        cgstAmount: Number(gstMap[gstRateVal].cgstAmount.toFixed(2)),
        sgstAmount: Number(gstMap[gstRateVal].sgstAmount.toFixed(2)),
        igstAmount: Number(gstMap[gstRateVal].igstAmount.toFixed(2)),
        gstAmount: Number(gstMap[gstRateVal].gstAmount.toFixed(2)),
      }));
  };

  const openAddModal = () => {
    const firstBlankIndex = items.findIndex(isItemBlank);
    if (firstBlankIndex !== -1) {
      setEditingIndex(firstBlankIndex);
    } else {
      setEditingIndex(null);
    }
    setModalProduct('');
    setModalProductId(null);
    setModalQuantity('1');
    setModalRate('');
    setModalDiscount('0');
    setModalHsn('');
    setModalGst(gstRate);
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    setModalProduct(item.product);
    setModalProductId(item.productId ?? null);
    setModalQuantity(item.quantity || '1');
    setModalRate(item.rate || '');
    setModalDiscount(item.discount || '0');
    setModalHsn(item.hsn || '');
    setModalGst(item.gst || gstRate);
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const handleSelectModalProduct = (product: Product) => {
    setModalProduct(product.name);
    setModalProductId(product.id);
    setModalRate(String(product.selling_price ?? product.rate ?? ''));
    setModalDiscount(String(product.discount ?? '0'));
    setModalHsn(String(product.hsn ?? ''));

    const productGst = numberValue(product.gst);
    setModalGst(productGst > 0 ? String(productGst) : gstRate);
    setModalProductDropdownOpen(false);
  };

  const handleSaveModalItem = () => {
    if (!modalProduct.trim()) {
      Alert.alert('Validation', 'Please select a product.');
      return;
    }

    if (!modalQuantity.trim() || numberValue(modalQuantity) <= 0) {
      Alert.alert('Validation', 'Please enter a valid quantity.');
      return;
    }

    if (!modalRate.trim() || numberValue(modalRate) < 0) {
      Alert.alert('Validation', 'Please enter a valid rate.');
      return;
    }

    const quantity = numberValue(modalQuantity);
    const rate = numberValue(modalRate);
    const discountPercent = numberValue(modalDiscount);
    const gstPercent = numberValue(modalGst);

    const grossAmount = quantity * rate;
    const discountAmount = (grossAmount * discountPercent) / 100;
    const taxableAmount = grossAmount - discountAmount;
    const gstBreakup = calculateProductGst(taxableAmount, gstPercent);
    const totalAmount = taxableAmount + gstBreakup.gstAmount;

    const newItem: SaleItem = {
      productId: modalProductId,
      product: modalProduct.trim(),
      quantity: modalQuantity,
      rate: modalRate,
      discount: modalDiscount || '0',
      hsn: modalHsn || '',
      gst: modalGst || '0',
      taxableAmount,
      gstAmount: gstBreakup.gstAmount,
      cgstAmount: gstBreakup.cgstAmount,
      sgstAmount: gstBreakup.sgstAmount,
      igstAmount: gstBreakup.igstAmount,
      totalAmount,
    };

    setItems((previousItems: SaleItem[]): SaleItem[] => {
      const updatedItems = [...previousItems];
      if (editingIndex !== null) {
        updatedItems[editingIndex] = {
          ...updatedItems[editingIndex],
          ...newItem,
          id: updatedItems[editingIndex]?.id,
        };
      } else {
        const blankIndex = updatedItems.findIndex((item: SaleItem) => isItemBlank(item));
        if (blankIndex >= 0) {
          updatedItems[blankIndex] = newItem;
        } else {
          updatedItems.push(newItem);
        }
      }
      return updatedItems;
    });

    setModalVisible(false);
    setEditingIndex(null);
  };

  const handleDeleteItem = (index: number) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setItems((previousItems: SaleItem[]): SaleItem[] => {
            const updatedItems = previousItems.filter(
              (_item: SaleItem, itemIndex: number) => itemIndex !== index,
            );
            while (updatedItems.length < 5) {
              updatedItems.push(createEmptyItem());
            }
            return updatedItems;
          });
        },
      },
    ]);
  };

  const populateSaleFields = (sale: any) => {
    setSaleId(sale?.id ?? sale?.sale_id ?? null);
    setSaleNo(String(sale?.SaleNo ?? sale?.sale_no ?? sale?.bill_no ?? sale?.bill_number ?? ''));

    const existingDate = parseExistingDate(sale?.SaleDate ?? sale?.sale_date ?? sale?.date);
    setSelectedDate(existingDate);
    setSaleDate(formatDateForMySQL(existingDate));

    setCustomer(String(sale?.customer ?? sale?.customer_name ?? ''));
    setCustomerId(sale?.customer_id ?? sale?.customerId ?? null);
    setCustomerAddress(String(sale?.customer_address ?? sale?.address ?? ''));
    setCustomerPhone(String(sale?.customer_phone ?? sale?.phone ?? ''));
    setCustomerState(String(sale?.customer_state ?? sale?.state ?? ''));
    setCustomerPincode(
      String(sale?.customer_pincode ?? sale?.pincode ?? sale?.pin_code ?? sale?.postal_code ?? ''),
    );
    setGstRate(String(sale?.gst_rate ?? sale?.tax_rate ?? 18));
    setPaymentMode(sale?.payment_mode ?? sale?.payment_method ?? 'Cash');

    const existingItems = sale?.items ?? sale?.sale_items ?? sale?.products ?? [];

    if (Array.isArray(existingItems) && existingItems.length > 0) {
      const mappedItems: SaleItem[] = existingItems.map((item: any): SaleItem => ({
        id: item.id ?? item.sale_item_id,
        productId: item.product_id ?? item.productId ?? null,
        product: item.product ?? item.product_name ?? item.productName ?? '',
        quantity: String(item.quantity ?? item.qty ?? ''),
        rate: String(item.sale_price ?? item.selling_price ?? item.rate ?? 0),
        discount: String(item.discount_percent ?? item.discount ?? 0),
        hsn: String(item.hsn ?? item.hsn_code ?? ''),
        gst: String(item.gst_percent ?? item.tax_rate ?? item.gst ?? 0),
        taxableAmount: numberValue(item.taxable_amount),
        gstAmount: numberValue(item.gst_amount ?? item.tax_amount),
        cgstAmount: numberValue(item.cgst_amount),
        sgstAmount: numberValue(item.sgst_amount),
        igstAmount: numberValue(item.igst_amount),
        totalAmount: numberValue(item.total_amount),
      }));

      while (mappedItems.length < 5) {
        mappedItems.push(createEmptyItem());
      }
      setItems(mappedItems);
    }
  };

  const resetForm = () => {
    setSaleId(null);
    setSaleNo('');
    setSaleDate(getCurrentDate());
    setSelectedDate(new Date());
    setCustomer('');
    setCustomerId(null);
    setCustomerAddress('');
    setCustomerPhone('');
    setCustomerState('');
    setCustomerPincode('');
    setGstRate('18');
    setPaymentMode('Cash');
    setItems(Array.from({length: 5}, createEmptyItem));
  };

  useEffect(() => {
    const sale = route?.params?.sale || route?.params?.item || null;
    if (sale) {
      populateSaleFields(sale);
    } else if (route?.params?.mode !== 'edit' && !route?.params?.saleId) {
      resetForm();
    }
  }, [route?.params?.sale, route?.params?.item, route?.params?.mode, route?.params?.saleId]);

  const handleSaveSale = async () => {
    if (!Customer.trim()) {
      Alert.alert('Validation', 'Please select a customer.');
      return;
    }

    const validItems: SaleItem[] = items.filter((item: SaleItem) => !isItemBlank(item));

    if (validItems.length === 0) {
      Alert.alert('Validation', 'Please add at least one product.');
      return;
    }

    for (let index = 0; index < validItems.length; index++) {
      const item = validItems[index];

      if (!item.product.trim()) {
        Alert.alert('Validation', `Please select product for item ${index + 1}.`);
        return;
      }

      if (numberValue(item.quantity) <= 0) {
        Alert.alert('Validation', `Please enter a valid quantity for item ${index + 1}.`);
        return;
      }

      if (numberValue(item.rate) < 0) {
        Alert.alert('Validation', `Please enter a valid rate for item ${index + 1}.`);
        return;
      }
    }

    const summary = calculateSaleSummary();
    const selectedCustomer = customers.find(
      (customer: Customer) => customer.id === String(customerId),
    );
    const resolvedCustomerId = customerId ?? selectedCustomer?.id ?? null;
    const finalBillNo = SaleNo.trim();

    const saleItems = validItems.map((item: SaleItem) => {
      const calculation = calculateItem(item);
      const resolvedProductId =
        item.productId ??
        productsList.find((product: Product) => product.name.trim() === item.product.trim())?.id ??
        null;

      return {
        id: item.id ? Number(item.id) : undefined,
        product_id: resolvedProductId ? Number(resolvedProductId) : undefined,
        product: item.product.trim(),
        product_name: item.product.trim(),
        hsn: item.hsn?.trim() || '',
        hsn_code: item.hsn?.trim() || '',
        quantity: calculation.quantity,
        sale_price: calculation.rate,
        selling_price: calculation.rate,
        rate: calculation.rate,
        discount: Number(calculation.discountAmount.toFixed(2)),
        discount_percent: Number(calculation.discountPercent.toFixed(2)),
        tax_rate: calculation.gstPercent,
        gst_percent: calculation.gstPercent,
        tax_amount: Number(calculation.gstAmount.toFixed(2)),
        gst_amount: Number(calculation.gstAmount.toFixed(2)),
        cgst_amount: Number(calculation.cgstAmount.toFixed(2)),
        sgst_amount: Number(calculation.sgstAmount.toFixed(2)),
        igst_amount: Number(calculation.igstAmount.toFixed(2)),
        taxable_amount: Number(calculation.taxableAmount.toFixed(2)),
        subtotal: Number(calculation.grossAmount.toFixed(2)),
        total_amount: Number(calculation.totalAmount.toFixed(2)),
      };
    });

    const payload = {
      id: saleId ? Number(saleId) : undefined,
      sale_id: saleId ? Number(saleId) : undefined,
      customer_id: resolvedCustomerId ? Number(resolvedCustomerId) : undefined,
      customer: Customer.trim(),
      customer_name: Customer.trim(),
      customer_address: customerAddress.trim(),
      customer_phone: customerPhone.trim(),
      customer_state: customerState.trim(),
      customer_pincode: customerPincode.trim(),
      pincode: customerPincode.trim(),
      gst_rate: numberValue(gstRate),
      cgst_amount: Number(summary.cgstAmount.toFixed(2)),
      sgst_amount: Number(summary.sgstAmount.toFixed(2)),
      igst_amount: Number(summary.igstAmount.toFixed(2)),
      bill_number: finalBillNo,
      bill_no: finalBillNo,
      SaleNo: finalBillNo,
      sale_no: finalBillNo,
      SaleDate: SaleDate,
      sale_date: SaleDate,
      subtotal: Number(summary.subtotal.toFixed(2)),
      discount: Number(summary.discountAmount.toFixed(2)),
      discount_percent: 0,
      taxable_amount: Number(summary.taxableAmount.toFixed(2)),
      tax_amount: Number(summary.gstAmount.toFixed(2)),
      total_amount: Number(summary.grandTotal.toFixed(2)),
      GrandTotal: Number(summary.grandTotal.toFixed(2)),
      payment_method: PaymentMode,
      payment_mode: PaymentMode,
      notes: null,
      items: saleItems,
      sale_items: saleItems,
      products: saleItems,
    };

    try {
      setSaving(true);
      await new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 500);
      });

      Alert.alert(
        'Success',
        isEditing ? 'Sale updated successfully.' : 'Sale added successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              resetForm();
              navigation.goBack();
            },
          },
        ],
      );
    } catch (error) {
      console.log('Save sale error:', error);
      Alert.alert('Error', 'Unable to save sale.');
    } finally {
      setSaving(false);
    }
  };

  const summary = calculateSaleSummary();
  const gstSummary = calculateGstSummary();

  const filteredModalProducts = productsList.filter((product: Product) =>
    product.name.toLowerCase().includes(modalProduct.toLowerCase()),
  );

  const modalSubtotalNum = numberValue(modalQuantity) * numberValue(modalRate);
  const modalDiscountAmount = (modalSubtotalNum * numberValue(modalDiscount)) / 100;
  const modalTaxableAmount = modalSubtotalNum - modalDiscountAmount;
  const modalGstBreakup = calculateProductGst(modalTaxableAmount, numberValue(modalGst));
  const modalGstAmount = modalGstBreakup.gstAmount;

  const modalCgstPercent = isMaharashtraCustomer() ? numberValue(modalGst) / 2 : 0;
  const modalSgstPercent = isMaharashtraCustomer() ? numberValue(modalGst) / 2 : 0;
  const modalIgstPercent = isMaharashtraCustomer() ? 0 : numberValue(modalGst);
  const modalTotal = modalTaxableAmount + modalGstAmount;

  const filledItemsCount = items.filter(i => i.product.trim()).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================= */}
      {/* 1. HEADER                                         */}
      {/* ================================================= */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Sale' : 'Add Sale'}
          </Text>
        </View>
      </View>

      {/* ================================================= */}
      {/* 2. SCROLLABLE FORM BODY                           */}
      {/* ================================================= */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* ----------------- SALE INFORMATION CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Sale Information</Text>

          <View style={styles.inputRow}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Invoice No</Text>
              <TextInput
                style={styles.textInput}
                value={SaleNo}
                onChangeText={setSaleNo}
                placeholder="e.g. INV-1001"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Invoice Date *</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.8}>
                <Text style={styles.datePickerText}>{SaleDate}</Text>
                <Text style={styles.calendarIconText}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
                setSaleDate(formatDateForMySQL(date));
              }
            }}
          />
        )}

        {/* ----------------- CUSTOMER INFORMATION CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Customer Information</Text>

          <Text style={styles.fieldLabel}>Select Customer</Text>
          <View style={styles.dropdownContainer}>
            <TouchableOpacity
              style={styles.selectBtn}
              onPress={() => setShowCustomers(!showCustomers)}
              activeOpacity={0.8}>
              <Text
                style={[
                  styles.selectBtnText,
                  !Customer && styles.placeholderText,
                ]}>
                {Customer || 'Select customer'}
              </Text>
              <Text style={styles.arrowIcon}>{showCustomers ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {showCustomers && (
              <View style={styles.dropdownMenu}>
                {loadingCustomers ? (
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color="#ea7e30" />
                  </View>
                ) : customers.length === 0 ? (
                  <Text style={styles.emptyText}>No customers found</Text>
                ) : (
                  <ScrollView
                    nestedScrollEnabled
                    keyboardShouldPersistTaps="handled"
                    style={{maxHeight: 180}}>
                    {customers.map((cust: Customer) => (
                      <TouchableOpacity
                        key={cust.id}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setCustomer(cust.name);
                          setCustomerId(cust.id);
                          setCustomerAddress(cust.address ?? '');
                          setCustomerPhone(cust.phone ?? '');
                          setCustomerState(cust.state ?? '');
                          setCustomerPincode(cust.pincode ?? '');
                          setShowCustomers(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{cust.name}</Text>
                        {!!cust.phone && (
                          <Text style={styles.dropdownSubText}>{cust.phone}</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>

          <View style={[styles.inputRow, {marginTop: 12}]}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Customer Name</Text>
              <TextInput
                style={styles.textInput}
                value={Customer}
                onChangeText={setCustomer}
                placeholder="Enter customer name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={customerPhone}
                onChangeText={setCustomerPhone}
                keyboardType="phone-pad"
                placeholder="Enter phone no"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, {marginTop: 12}]}>Address</Text>
          <TextInput
            style={styles.textAreaInput}
            value={customerAddress}
            onChangeText={setCustomerAddress}
            placeholder="Enter customer address"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />

          <View style={[styles.inputRow, {marginTop: 12}]}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>State</Text>
              <TextInput
                style={styles.textInput}
                value={customerState}
                onChangeText={setCustomerState}
                placeholder="Enter state"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Pincode</Text>
              <TextInput
                style={styles.textInput}
                value={customerPincode}
                onChangeText={setCustomerPincode}
                keyboardType="number-pad"
                maxLength={6}
                placeholder="Enter pincode"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          <View style={[styles.inputRow, {marginTop: 12}]}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Default GST Rate</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={gstRate}
                  mode="dropdown"
                  onValueChange={value => setGstRate(String(value))}
                  style={styles.picker}
                  dropdownIconColor="#64748b">
                  <Picker.Item label="0%" value="0" />
                  <Picker.Item label="5%" value="5" />
                  <Picker.Item label="12%" value="12" />
                  <Picker.Item label="18%" value="18" />
                  <Picker.Item label="28%" value="28" />
                </Picker>
              </View>
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Tax Type</Text>
              <View style={styles.taxTypeBox}>
                <Text style={styles.taxTypeValue}>
                  {isMaharashtraCustomer() ? 'CGST + SGST (Intra-state)' : 'IGST (Inter-state)'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ----------------- SALE ITEMS CARD ----------------- */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithBadge}>
              <Text style={styles.cardHeaderTitle}>Sale Items</Text>
              <View style={styles.itemBadge}>
                <Text style={styles.itemBadgeText}>
                  {filledItemsCount} {filledItemsCount === 1 ? 'Item' : 'Items'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addItemBtn}
              onPress={openAddModal}
              activeOpacity={0.8}>
              <Text style={styles.addItemBtnText}>+ Add Product</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.swipeHintRow}>
            <Text style={styles.swipeHintArrow}>➔</Text>
            <Text style={styles.swipeHintText}>Tap any row to edit</Text>
          </View>

          <View style={styles.tableCardWrapper}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} nestedScrollEnabled>
              <View>
                {/* TABLE HEADER */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.colProduct}>
                    <Text style={styles.thText}>PRODUCT</Text>
                  </View>
                  <View style={styles.colQty}>
                    <Text style={[styles.thText, styles.textCenter]}>QTY</Text>
                  </View>
                  <View style={styles.colRate}>
                    <Text style={[styles.thText, styles.textRight]}>RATE (₹)</Text>
                  </View>
                  <View style={styles.colDiscount}>
                    <Text style={[styles.thText, styles.textCenter]}>DISC %</Text>
                  </View>
                  <View style={styles.colHsn}>
                    <Text style={[styles.thText, styles.textCenter]}>HSN</Text>
                  </View>
                  <View style={styles.colGst}>
                    <Text style={[styles.thText, styles.textCenter]}>GST %</Text>
                  </View>
                  <View style={styles.colTax}>
                    <Text style={[styles.thText, styles.textRight]}>CGST</Text>
                  </View>
                  <View style={styles.colTax}>
                    <Text style={[styles.thText, styles.textRight]}>SGST</Text>
                  </View>
                  <View style={styles.colTax}>
                    <Text style={[styles.thText, styles.textRight]}>IGST</Text>
                  </View>
                  <View style={styles.colTotal}>
                    <Text style={[styles.thText, styles.textRight]}>TOTAL (₹)</Text>
                  </View>
                  <View style={styles.colAction}>
                    <Text style={[styles.thText, styles.textCenter]}>ACTION</Text>
                  </View>
                </View>

                {/* TABLE ROWS */}
                {items.map((item: SaleItem, index: number) => {
                  const calculation = calculateItem(item);
                  const isBlank = isItemBlank(item);
                  const isEven = index % 2 === 0;

                  return (
                    <TouchableOpacity
                      key={item.id ?? `sale-item-${index}`}
                      activeOpacity={0.7}
                      onPress={() => openEditModal(index)}
                      style={[
                        styles.tableDataRow,
                        isEven ? styles.rowEven : styles.rowOdd,
                        isBlank && styles.blankRow,
                        index === items.length - 1 && styles.lastRow,
                      ]}>
                      {/* Product */}
                      <View style={styles.colProduct}>
                        {isBlank ? (
                          <Text style={styles.cellPlaceholderText}>+ Select Product...</Text>
                        ) : (
                          <Text style={styles.cellProductText} numberOfLines={1}>
                            {item.product}
                          </Text>
                        )}
                      </View>

                      {/* Qty */}
                      <View style={styles.colQty}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : item.quantity || '0'}
                        </Text>
                      </View>

                      {/* Rate */}
                      <View style={styles.colRate}>
                        <Text style={[styles.cellRightText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : formatCurrency(numberValue(item.rate))}
                        </Text>
                      </View>

                      {/* Discount */}
                      <View style={styles.colDiscount}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : `${item.discount || '0'}%`}
                        </Text>
                      </View>

                      {/* HSN */}
                      <View style={styles.colHsn}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : item.hsn || '-'}
                        </Text>
                      </View>

                      {/* GST % */}
                      <View style={styles.colGst}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : `${calculation.gstPercent || '0'}%`}
                        </Text>
                      </View>

                      {/* CGST */}
                      <View style={styles.colTax}>
                        <Text style={[styles.cellRightText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : formatCurrency(calculation.cgstAmount)}
                        </Text>
                      </View>

                      {/* SGST */}
                      <View style={styles.colTax}>
                        <Text style={[styles.cellRightText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : formatCurrency(calculation.sgstAmount)}
                        </Text>
                      </View>

                      {/* IGST */}
                      <View style={styles.colTax}>
                        <Text style={[styles.cellRightText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : formatCurrency(calculation.igstAmount)}
                        </Text>
                      </View>

                      {/* Total */}
                      <View style={styles.colTotal}>
                        <Text style={[styles.cellTotalText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : formatCurrency(calculation.totalAmount)}
                        </Text>
                      </View>

                      {/* ACTIONS */}
                      <View style={styles.colAction}>
                        {!isBlank && (
                          <View style={styles.actionButtonsRow}>
                            <TouchableOpacity
                              onPress={() => openEditModal(index)}
                              style={styles.actionIconBtn}
                              activeOpacity={0.7}
                              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                              <PencilIcon size={14} color="#ea7e30" />
                            </TouchableOpacity>

                            <TouchableOpacity
                              onPress={() => handleDeleteItem(index)}
                              style={styles.actionIconBtn}
                              activeOpacity={0.7}
                              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                              <DustbinIcon size={14} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* ----------------- GST AMOUNT SUMMARY CARD ----------------- */}
        <View style={styles.gstSummaryCard}>
          <Text style={styles.gstSummaryTitle}>GST Breakdown Summary</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.gstSummaryTable}>
              {/* GST SUMMARY HEADER */}
              <View style={styles.gstSummaryHeader}>
                <Text style={[styles.gstSummaryHeaderText, styles.gstRateSummaryColumn]}>
                  GST Rate
                </Text>
                <Text style={[styles.gstSummaryHeaderText, styles.gstTaxableSummaryColumn]}>
                  Taxable Amount
                </Text>
                <Text style={[styles.gstSummaryHeaderText, styles.gstAmountSummaryColumn]}>
                  CGST
                </Text>
                <Text style={[styles.gstSummaryHeaderText, styles.gstAmountSummaryColumn]}>
                  SGST
                </Text>
                <Text style={[styles.gstSummaryHeaderText, styles.gstAmountSummaryColumn]}>
                  IGST
                </Text>
                <Text style={[styles.gstSummaryHeaderText, styles.gstAmountSummaryColumn]}>
                  Total GST
                </Text>
              </View>

              {/* GST SUMMARY DATA */}
              {gstSummary.length === 0 ? (
                <View style={styles.gstEmptyRow}>
                  <Text style={styles.gstEmptyText}>No GST applicable</Text>
                </View>
              ) : (
                gstSummary.map(row => (
                  <View key={row.gstRate} style={styles.gstSummaryRow}>
                    <Text style={[styles.gstSummaryCell, styles.gstRateSummaryColumn]}>
                      {row.gstRate}%
                    </Text>
                    <Text style={[styles.gstSummaryCell, styles.gstTaxableSummaryColumn]}>
                      {formatCurrency(row.taxableAmount)}
                    </Text>
                    <Text style={[styles.gstSummaryCell, styles.gstAmountSummaryColumn]}>
                      {formatCurrency(row.cgstAmount)}
                    </Text>
                    <Text style={[styles.gstSummaryCell, styles.gstAmountSummaryColumn]}>
                      {formatCurrency(row.sgstAmount)}
                    </Text>
                    <Text style={[styles.gstSummaryCell, styles.gstAmountSummaryColumn]}>
                      {formatCurrency(row.igstAmount)}
                    </Text>
                    <Text
                      style={[
                        styles.gstSummaryCell,
                        styles.gstAmountSummaryColumn,
                        styles.gstTotalCell,
                      ]}>
                      {formatCurrency(row.gstAmount)}
                    </Text>
                  </View>
                ))
              )}

              {/* GST TOTAL */}
              {gstSummary.length > 0 && (
                <View style={styles.gstSummaryTotalRow}>
                  <Text style={[styles.gstSummaryTotalText, styles.gstRateSummaryColumn]}>
                    Total
                  </Text>
                  <Text style={[styles.gstSummaryTotalText, styles.gstTaxableSummaryColumn]}>
                    {formatCurrency(
                      gstSummary.reduce((sum, row) => sum + row.taxableAmount, 0),
                    )}
                  </Text>
                  <Text style={[styles.gstSummaryTotalText, styles.gstAmountSummaryColumn]}>
                    {formatCurrency(gstSummary.reduce((sum, row) => sum + row.cgstAmount, 0))}
                  </Text>
                  <Text style={[styles.gstSummaryTotalText, styles.gstAmountSummaryColumn]}>
                    {formatCurrency(gstSummary.reduce((sum, row) => sum + row.sgstAmount, 0))}
                  </Text>
                  <Text style={[styles.gstSummaryTotalText, styles.gstAmountSummaryColumn]}>
                    {formatCurrency(gstSummary.reduce((sum, row) => sum + row.igstAmount, 0))}
                  </Text>
                  <Text
                    style={[
                      styles.gstSummaryTotalText,
                      styles.gstAmountSummaryColumn,
                      styles.gstGrandTotalCell,
                    ]}>
                    {formatCurrency(gstSummary.reduce((sum, row) => sum + row.gstAmount, 0))}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* ----------------- PAYMENT INFORMATION CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Payment Information</Text>

          <Text style={styles.fieldLabel}>Payment Mode</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={PaymentMode}
              mode="dropdown"
              onValueChange={value => setPaymentMode(value)}
              style={styles.picker}
              dropdownIconColor="#64748b">
              <Picker.Item label="Cash" value="Cash" />
              <Picker.Item label="UPI" value="UPI" />
              <Picker.Item label="Card" value="Card" />
              <Picker.Item label="Credit" value="Credit" />
            </Picker>
          </View>
        </View>

        {/* ----------------- ORDER SUMMARY CARD ----------------- */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Sale Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.subtotal)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.discountValue}>- {formatCurrency(summary.discountAmount)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxable Amount</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.taxableAmount)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total GST</Text>
            <Text style={styles.summaryValue}>{formatCurrency(summary.gstAmount)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(summary.grandTotal)}</Text>
          </View>
        </View>

        {/* ----------------- SAVE BUTTON ----------------- */}
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.disabledButton]}
          disabled={saving}
          activeOpacity={0.85}
          onPress={handleSaveSale}>
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Sale' : 'Save Sale'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>

      {/* ================================================= */}
      {/* 3. ADD / EDIT PRODUCT MODAL                       */}
      {/* ================================================= */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {/* MODAL HEADER */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {editingIndex !== null ? 'Edit Product' : 'Add Product'}
                </Text>

                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseBtn}
                  hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Text style={styles.modalCloseText}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                style={styles.modalScrollBody}>
                {/* PRODUCT NAME INPUT + DROPDOWN */}
                <Text style={styles.modalFieldLabel}>Product *</Text>
                <View style={styles.modalDropdownContainer}>
                  <TouchableOpacity
                    style={styles.modalSelectBtn}
                    onPress={() =>
                      setModalProductDropdownOpen(!modalProductDropdownOpen)
                    }
                    activeOpacity={0.8}>
                    <Text
                      style={[
                        styles.modalSelectText,
                        !modalProduct && styles.placeholderText,
                      ]}>
                      {modalProduct || 'Select product'}
                    </Text>
                    <Text style={styles.arrowIcon}>
                      {modalProductDropdownOpen ? '▲' : '▼'}
                    </Text>
                  </TouchableOpacity>

                  {modalProductDropdownOpen && (
                    <View style={styles.modalDropdownMenu}>
                      <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                        style={{maxHeight: 160}}>
                        {filteredModalProducts.length === 0 ? (
                          <Text style={styles.emptyText}>No products found</Text>
                        ) : (
                          filteredModalProducts.map((prod: Product) => (
                            <TouchableOpacity
                              key={prod.id}
                              style={styles.dropdownMenuItem}
                              onPress={() => handleSelectModalProduct(prod)}>
                              <Text style={styles.dropdownMainText}>{prod.name}</Text>
                              <Text style={styles.dropdownSubText}>
                                Rate: {formatCurrency(numberValue(prod.selling_price ?? prod.rate))}
                                {'  '}•{'  '}GST: {numberValue(prod.gst) || 0}%
                              </Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* QUANTITY & RATE ROW */}
                <View style={styles.modalRow}>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Quantity *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalQuantity}
                      onChangeText={setModalQuantity}
                      keyboardType="numeric"
                      placeholder="1"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Rate (₹) *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalRate}
                      onChangeText={setModalRate}
                      keyboardType="decimal-pad"
                      placeholder="0.00"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {/* DISCOUNT & GST ROW */}
                <View style={styles.modalRow}>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Discount (%)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalDiscount}
                      onChangeText={setModalDiscount}
                      keyboardType="decimal-pad"
                      placeholder="0"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>GST (%)</Text>
                    <View style={styles.modalPickerContainer}>
                      <Picker
                        selectedValue={modalGst}
                        mode="dropdown"
                        onValueChange={value => setModalGst(String(value))}
                        style={styles.modalPicker}
                        dropdownIconColor="#64748b">
                        <Picker.Item label="0%" value="0" />
                        <Picker.Item label="5%" value="5" />
                        <Picker.Item label="12%" value="12" />
                        <Picker.Item label="18%" value="18" />
                        <Picker.Item label="28%" value="28" />
                      </Picker>
                    </View>
                  </View>
                </View>

                {/* HSN & TAX SPLIT ROW */}
                <View style={styles.modalRow}>
                  <View style={{flex: 1.2}}>
                    <Text style={styles.modalFieldLabel}>HSN Code</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalHsn}
                      onChangeText={setModalHsn}
                      placeholder="Enter HSN"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={{flex: 1.8, flexDirection: 'row', gap: 6}}>
                    <View style={{flex: 1}}>
                      <Text style={styles.gstSplitLabel}>CGST</Text>
                      <TextInput
                        style={styles.gstSplitInput}
                        value={`${modalCgstPercent}%`}
                        editable={false}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.gstSplitLabel}>SGST</Text>
                      <TextInput
                        style={styles.gstSplitInput}
                        value={`${modalSgstPercent}%`}
                        editable={false}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Text style={styles.gstSplitLabel}>IGST</Text>
                      <TextInput
                        style={styles.gstSplitInput}
                        value={`${modalIgstPercent}%`}
                        editable={false}
                      />
                    </View>
                  </View>
                </View>

                {/* CALCULATION SUMMARY CARD */}
                <View style={styles.modalCalcCard}>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Subtotal:</Text>
                    <Text style={styles.modalCalcVal}>{formatCurrency(modalSubtotalNum)}</Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Discount ({modalDiscount || 0}%):</Text>
                    <Text style={styles.modalCalcDiscount}>- {formatCurrency(modalDiscountAmount)}</Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Taxable Amount:</Text>
                    <Text style={styles.modalCalcVal}>{formatCurrency(modalTaxableAmount)}</Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>GST Amount:</Text>
                    <Text style={styles.modalCalcVal}>{formatCurrency(modalGstAmount)}</Text>
                  </View>
                  <View style={[styles.modalCalcRow, styles.modalCalcTotalRow]}>
                    <Text style={styles.modalCalcTotalLabel}>Item Total:</Text>
                    <Text style={styles.modalCalcTotalVal}>{formatCurrency(modalTotal)}</Text>
                  </View>
                </View>

                {/* MODAL ACTION BUTTONS */}
                <View style={styles.modalActionRow}>
                  <TouchableOpacity
                    style={styles.modalCancelBtn}
                    onPress={() => setModalVisible(false)}
                    activeOpacity={0.7}>
                    <Text style={styles.modalCancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.modalSaveBtn}
                    onPress={handleSaveModalItem}
                    activeOpacity={0.85}>
                    <Text style={styles.modalSaveBtnText}>
                      {editingIndex !== null ? 'Update Product' : 'Add Product'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default AddSaleScreen;

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

  // ---- 2. SCROLL CONTENT ----
  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },

  // ---- CARDS ----
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  cardHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    letterSpacing: -0.2,
  },

  // ---- INPUTS ----
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  halfInputCol: {
    flex: 1,
  },

  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },

  textInput: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },

  textAreaInput: {
    height: 68,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },

  datePickerBtn: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  datePickerText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },

  calendarIconText: {
    fontSize: 16,
  },

  // ---- SELECT & DROPDOWNS ----
  dropdownContainer: {
    position: 'relative',
    zIndex: 20,
  },

  selectBtn: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  selectBtnText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },

  placeholderText: {
    color: '#94a3b8',
  },

  arrowIcon: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 8,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 50,
    overflow: 'hidden',
  },

  dropdownMenuItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  dropdownMainText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  dropdownSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  loaderContainer: {
    padding: 20,
    alignItems: 'center',
  },

  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: 15,
    fontSize: 13,
  },

  pickerContainer: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  picker: {
    height: 48,
    width: '100%',
    color: '#0f172a',
  },

  taxTypeBox: {
    height: 48,
    backgroundColor: '#fff7ed',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  taxTypeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#c2410c',
  },

  // ---- PRODUCT TABLE IN CARD ----
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemBadge: {
    backgroundColor: '#ffedd5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 12,
  },

  itemBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#c2410c',
  },

  addItemBtn: {
    backgroundColor: '#ea7e30',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 12,
  },

  addItemBtnText: {
    fontSize: 12.5,
    fontWeight: '800',
    color: '#ffffff',
  },

  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 6,
  },

  swipeHintArrow: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: 'bold',
  },

  swipeHintText: {
    fontSize: 11.5,
    color: '#94a3b8',
    fontWeight: '600',
  },

  tableCardWrapper: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },

  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1.5,
    borderBottomColor: '#fed7aa',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  thText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c2410c',
    letterSpacing: 0.3,
  },

  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  rowEven: {
    backgroundColor: '#ffffff',
  },

  rowOdd: {
    backgroundColor: '#fafbfc',
  },

  blankRow: {
    opacity: 0.85,
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  // Table Column Widths
  colProduct: {
    width: 140,
    paddingRight: 6,
    justifyContent: 'center',
  },
  colQty: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colRate: {
    width: 80,
    paddingRight: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colDiscount: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colHsn: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colGst: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colTax: {
    width: 75,
    paddingRight: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colTotal: {
    width: 85,
    paddingRight: 6,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  colAction: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Table Cell Typographies
  cellProductText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  cellPlaceholderText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  cellCenterText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },

  cellRightText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'right',
  },

  cellTotalText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'right',
  },

  cellMuted: {
    color: '#94a3b8',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  actionIconBtn: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editIconText: {
    fontSize: 11,
  },

  // ---- GST SUMMARY CARD ----
  gstSummaryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#64748b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  gstSummaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },

  gstSummaryTable: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },

  gstSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderBottomWidth: 1.5,
    borderBottomColor: '#fed7aa',
    paddingVertical: 9,
    paddingHorizontal: 8,
  },

  gstSummaryHeaderText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#c2410c',
    textAlign: 'center',
    textTransform: 'uppercase',
  },

  gstSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 9,
    paddingHorizontal: 8,
  },

  gstSummaryCell: {
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
    fontWeight: '500',
  },

  gstRateSummaryColumn: {
    width: 75,
  },

  gstTaxableSummaryColumn: {
    width: 115,
  },

  gstAmountSummaryColumn: {
    width: 90,
  },

  gstTotalCell: {
    fontWeight: '800',
    color: '#ea7e30',
  },

  gstSummaryTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    borderTopWidth: 1.5,
    borderTopColor: '#fed7aa',
    paddingVertical: 10,
    paddingHorizontal: 8,
  },

  gstSummaryTotalText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0f172a',
    textAlign: 'center',
  },

  gstGrandTotalCell: {
    color: '#ea7e30',
    fontWeight: '900',
  },

  gstEmptyRow: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gstEmptyText: {
    fontSize: 12.5,
    color: '#94a3b8',
    fontWeight: '600',
  },

  // ---- SUMMARY CARD ----
  summaryCard: {
    backgroundColor: '#fff7ed',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    padding: 16,
    marginBottom: 16,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  summaryTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#c2410c',
    marginBottom: 12,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4.5,
  },

  summaryLabel: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#64748b',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },

  summaryDivider: {
    height: 1,
    backgroundColor: '#fed7aa',
    marginVertical: 8,
  },

  grandTotalLabel: {
    fontSize: 15.5,
    fontWeight: '800',
    color: '#0f172a',
  },

  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#ea7e30',
  },

  // ---- SAVE BUTTON ----
  saveButton: {
    backgroundColor: '#ea7e30',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    marginTop: 6,
  },

  disabledButton: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  // ---- MODAL ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 380,
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 12,
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0f172a',
  },

  modalCloseBtn: {
    padding: 4,
  },

  modalCloseText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#94a3b8',
  },

  modalScrollBody: {
    maxHeight: 460,
  },

  modalFieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 5,
  },

  modalDropdownContainer: {
    position: 'relative',
    zIndex: 30,
    marginBottom: 12,
  },

  modalSelectBtn: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalSelectText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },

  modalDropdownMenu: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    maxHeight: 160,
    zIndex: 60,
    overflow: 'hidden',
  },

  modalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  modalHalf: {
    flex: 1,
  },

  modalInput: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },

  modalPickerContainer: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  modalPicker: {
    height: 46,
    width: '100%',
    color: '#0f172a',
  },

  gstSplitLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },

  gstSplitInput: {
    height: 46,
    backgroundColor: '#f1f5f9',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 4,
    fontSize: 12.5,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'center',
  },

  modalCalcCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
    marginBottom: 16,
  },

  modalCalcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },

  modalCalcLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },

  modalCalcVal: {
    fontSize: 12.5,
    color: '#1e293b',
    fontWeight: '700',
  },

  modalCalcDiscount: {
    fontSize: 12.5,
    color: '#16a34a',
    fontWeight: '700',
  },

  modalCalcTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    marginTop: 4,
  },

  modalCalcTotalLabel: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#0f172a',
  },

  modalCalcTotalVal: {
    fontSize: 15,
    fontWeight: '900',
    color: '#ea7e30',
  },

  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
  },

  modalCancelBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },

  modalSaveBtn: {
    flex: 1.5,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  modalSaveBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
  },
});
