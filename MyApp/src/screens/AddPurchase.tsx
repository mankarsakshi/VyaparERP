import {Picker} from '@react-native-picker/picker';
import React, {useCallback, useEffect, useState} from 'react';
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
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import DateTimePicker from '@react-native-community/datetimepicker';
import {purchaseAPI} from '../api/purchaseService';
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
  discount?: string | number;
  gst?: string | number;
};

type Supplier = {
  id: string;
  name: string;
};

type PurchaseItem = {
  id?: string | number;
  productId?: string | number | null;
  product: string;
  quantity: string;
  rate: string;
  discount: string;
  hsn: string;
  gst: string;
};

const products: Product[] = [
  {id: '1', name: 'Laptop', hsn: '8471', rate: '500', discount: '5', gst: '0'},
  {id: '2', name: 'Mouse', hsn: '8471', rate: '200', discount: '2', gst: '0'},
  {id: '3', name: 'Keyboard', hsn: '8471', rate: '300', discount: '0', gst: '18'},
  {id: '4', name: 'Monitor', hsn: '8528', rate: '4500', discount: '0', gst: '18'},
  {id: '5', name: 'Mobile Phone', hsn: '8517', rate: '12000', discount: '0', gst: '18'},
  {id: '6', name: 'Headphones', hsn: '8518', rate: '800', discount: '0', gst: '18'},
  {id: '7', name: 'Printer', hsn: '8443', rate: '6000', discount: '0', gst: '18'},
  {id: '8', name: 'USB Cable', hsn: '8544', rate: '150', discount: '0', gst: '18'},
  {id: '9', name: 'Webcam', hsn: '8525', rate: '1200', discount: '0', gst: '18'},
  {id: '10', name: 'Power Bank', hsn: '8504', rate: '900', discount: '0', gst: '18'},
];

const getCurrentDate = (): string => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatDateForMySQL = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const parseExistingDate = (value: any): Date => {
  if (!value) {
    return new Date();
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);
  if (!isNaN(date.getTime())) {
    return date;
  }

  return new Date();
};

const DustbinIcon = ({size = 16, color = '#dc2626'}: {size?: number; color?: string}) => {
  return (
    <View style={{width: size, height: size + 2, alignItems: 'center', justifyContent: 'center'}}>
      {/* Lid Handle */}
      <View
        style={{
          width: size * 0.35,
          height: 2,
          backgroundColor: color,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 1,
        }}
      />
      {/* Lid Top Bar */}
      <View
        style={{
          width: size * 0.85,
          height: 2,
          backgroundColor: color,
          borderRadius: 1,
          marginVertical: 1,
        }}
      />
      {/* Trash Body */}
      <View
        style={{
          width: size * 0.7,
          height: size * 0.68,
          borderWidth: 1.5,
          borderColor: color,
          borderTopWidth: 0,
          borderBottomLeftRadius: 3,
          borderBottomRightRadius: 3,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          paddingVertical: 1.5,
        }}>
        <View style={{width: 1.2, height: '70%', backgroundColor: color, borderRadius: 0.5}} />
        <View style={{width: 1.2, height: '70%', backgroundColor: color, borderRadius: 0.5}} />
      </View>
    </View>
  );
};

const AddPurchaseScreen = ({navigation, route}: Props) => {
  // =====================================================
  // ROUTE DATA
  // =====================================================
  const routePurchase =
    route?.params?.purchase || route?.params?.item || null;

  const routePurchaseId =
    route?.params?.purchaseId ||
    routePurchase?.id ||
    routePurchase?.purchase_id ||
    null;

  const isEditing =
    route?.params?.mode === 'edit' || !!routePurchaseId;

  // =====================================================
  // PURCHASE STATE
  // =====================================================
  const [purchaseId, setPurchaseId] = useState<string | number | null>(
    routePurchaseId,
  );
  const [PurchaseNo, setPurchaseNo] = useState('');
  const [PurchaseDate, setPurchaseDate] = useState(getCurrentDate());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // =====================================================
  // SUPPLIER STATE
  // =====================================================
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [Supplier, setSupplier] = useState('');
  const [supplierId, setSupplierId] = useState<string | number | null>(null);
  const [showSuppliers, setShowSuppliers] = useState(false);

  // =====================================================
  // LOAD SUPPLIERS FROM DATABASE
  // =====================================================
  const loadSuppliersFromDB = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await fetch(`${API_BASE_URL}/api/suppliers`);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const result = await response.json();
      let list: any[] = [];
      if (Array.isArray(result)) {
        list = result;
      } else if (Array.isArray(result?.data)) {
        list = result.data;
      } else if (Array.isArray(result?.suppliers)) {
        list = result.suppliers;
      }

      const formatted: Supplier[] = list.map(item => ({
        id: String(item.id ?? item.supplier_id ?? item.supplierId),
        name: item.name ?? item.supplier_name ?? item.supplierName ?? '',
      }));

      setSuppliers(formatted);
    } catch (error) {
      console.log('Error fetching suppliers from DB in AddPurchase:', error);
    } finally {
      setLoadingSuppliers(false);
    }
  };

  useEffect(() => {
    loadSuppliersFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadSuppliersFromDB();
    });
    return unsubscribe;
  }, [navigation]);

  // Handle newSupplier passed from SupplierMaster
  useEffect(() => {
    if (route?.params?.newSupplier) {
      const newSupp = route.params.newSupplier;
      const suppName = newSupp.name || newSupp.supplier_name || '';
      setSupplier(suppName);
      setSupplierId(newSupp.id ?? null);

      setSuppliers(prev => {
        if (!prev.some(s => String(s.id) === String(newSupp.id) || s.name === suppName)) {
          return [{ id: String(newSupp.id), name: suppName }, ...prev];
        }
        return prev;
      });
    }
  }, [route?.params?.newSupplier]);

  // =====================================================
  // INVOICE STATE
  // =====================================================
  const [InvoiceNo, setInvoiceNo] = useState('');

  // =====================================================
  // MULTIPLE PRODUCTS
  // =====================================================
  const [items, setItems] = useState<PurchaseItem[]>([]);

  // =====================================================
  // ADD / EDIT PRODUCT MODAL STATE
  // =====================================================
  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalProduct, setModalProduct] = useState('');
  const [modalProductId, setModalProductId] = useState<string | number | null>(
    null,
  );
  const [modalQuantity, setModalQuantity] = useState('1');
  const [modalRate, setModalRate] = useState('');
  const [modalDiscount, setModalDiscount] = useState('0');
  const [modalHsn, setModalHsn] = useState('');
  const [modalGst, setModalGst] = useState('0');
  const [modalProductDropdownOpen, setModalProductDropdownOpen] =
    useState(false);

  // =====================================================
  // PAYMENT STATE
  // =====================================================
  const [PaymentMode, setPaymentMode] = useState('Card');
  const [PaymentStatus, setPaymentStatus] = useState('Paid');

  // =====================================================
  // LOADING STATE
  // =====================================================
  const [loadingPurchase, setLoadingPurchase] = useState(false);
  const [saving, setSaving] = useState(false);

  // =====================================================
  // NUMBER HELPER
  // =====================================================
  const numberValue = (value: any, fallback = 0): number => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  // =====================================================
  // ITEM CALCULATION
  // =====================================================
  const calculateItem = (item: PurchaseItem) => {
    const quantity = numberValue(item.quantity);
    const rate = numberValue(item.rate);
    const gstPercent = numberValue(item.gst);
    const discountPercent = numberValue(item.discount);

    const subtotal = quantity * rate;
    const discountAmount = (subtotal * discountPercent) / 100;
    const taxableAmount = Math.max(0, subtotal - discountAmount);
    const gstAmount = (taxableAmount * gstPercent) / 100;
    const totalAmount = taxableAmount + gstAmount;

    return {
      quantity,
      rate,
      gstPercent,
      discountPercent,
      subtotal,
      discountAmount,
      taxableAmount,
      gstAmount,
      totalAmount,
    };
  };

  // =====================================================
  // PURCHASE SUMMARY
  // =====================================================
  const calculatePurchaseSummary = () => {
    let subtotal = 0;
    let discountAmount = 0;
    let taxableAmount = 0;
    let gstAmount = 0;
    let grandTotal = 0;

    items.forEach(item => {
      const calculation = calculateItem(item);
      subtotal += calculation.subtotal;
      discountAmount += calculation.discountAmount;
      taxableAmount += calculation.taxableAmount;
      gstAmount += calculation.gstAmount;
      grandTotal += calculation.totalAmount;
    });

    return {
      subtotal,
      discountAmount,
      taxableAmount,
      gstAmount,
      grandTotal,
    };
  };

  // =====================================================
  // MODAL HANDLERS
  // =====================================================
  const openAddModal = () => {
    setEditingIndex(null);
    setModalProduct('');
    setModalProductId(null);
    setModalQuantity('1');
    setModalRate('');
    setModalDiscount('0');
    setModalHsn('');
    setModalGst('0');
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    const item = items[index];
    if (!item) return;

    setEditingIndex(index);
    setModalProduct(item.product);
    setModalProductId(item.productId ?? null);
    setModalQuantity(item.quantity);
    setModalRate(item.rate);
    setModalDiscount(item.discount || '0');
    setModalHsn(item.hsn || '');
    setModalGst(item.gst || '0');
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const handleSelectModalProduct = (prod: Product) => {
    setModalProduct(prod.name);
    setModalProductId(prod.id);
    if (prod.hsn) setModalHsn(prod.hsn);
    if (prod.rate !== undefined) setModalRate(String(prod.rate));
    if (prod.discount !== undefined) setModalDiscount(String(prod.discount));
    if (prod.gst !== undefined) setModalGst(String(prod.gst));
    setModalProductDropdownOpen(false);
  };

  const handleSaveModalItem = () => {
    if (!modalProduct.trim()) {
      Alert.alert('Validation Error', 'Please select or enter a product name.');
      return;
    }

    const qty = Number(modalQuantity);
    if (!Number.isFinite(qty) || qty <= 0) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid quantity greater than 0.',
      );
      return;
    }

    const rate = Number(modalRate);
    if (!Number.isFinite(rate) || rate < 0) {
      Alert.alert('Validation Error', 'Please enter a valid purchase rate.');
      return;
    }

    const disc = Number(modalDiscount);
    if (Number.isFinite(disc) && (disc < 0 || disc > 100)) {
      Alert.alert(
        'Validation Error',
        'Discount percentage must be between 0 and 100.',
      );
      return;
    }

    const gstVal = Number(modalGst);
    if (Number.isFinite(gstVal) && (gstVal < 0 || gstVal > 100)) {
      Alert.alert(
        'Validation Error',
        'GST percentage must be between 0 and 100.',
      );
      return;
    }

    // Attempt auto-resolving HSN if missing
    let resolvedHsn = modalHsn.trim();
    if (!resolvedHsn) {
      const match = products.find(
        p => p.name.toLowerCase().trim() === modalProduct.trim().toLowerCase(),
      );
      if (match?.hsn) {
        resolvedHsn = match.hsn;
      }
    }

    const newItemData: PurchaseItem = {
      productId: modalProductId,
      product: modalProduct.trim(),
      quantity: modalQuantity.trim(),
      rate: modalRate.trim(),
      discount: modalDiscount.trim() || '0',
      hsn: resolvedHsn,
      gst: modalGst.trim() || '0',
    };

    if (editingIndex !== null) {
      // Update existing item
      setItems(prev =>
        prev.map((item, idx) =>
          idx === editingIndex ? {...item, ...newItemData} : item,
        ),
      );
    } else {
      // Add new item
      setItems(prev => [...prev, newItemData]);
    }

    setModalVisible(false);
  };

  const handleDeleteItem = (index: number) => {
    const itemName = items[index]?.product || 'this product';
    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${itemName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(prev => prev.filter((_, idx) => idx !== index));
          },
        },
      ],
    );
  };

  // =====================================================
  // POPULATE PURCHASE FOR EDIT
  // =====================================================
  const populatePurchaseFields = (purchase: any) => {
    if (!purchase) return;

    const id = purchase.id || purchase.purchase_id || null;
    setPurchaseId(id);

    const purchaseNumber =
      purchase.PurchaseNo ||
      purchase.purchase_no ||
      purchase.invoice_number ||
      purchase.bill_number ||
      '';
    setPurchaseNo(String(purchaseNumber));

    const invoiceNumber =
      purchase.invoice_number ||
      purchase.InvoiceNo ||
      purchase.invoice_no ||
      purchase.bill_number ||
      '';
    setInvoiceNo(String(invoiceNumber));

    const databaseDate =
      purchase.purchase_date ||
      purchase.PurchaseDate ||
      purchase.date ||
      purchase.created_at ||
      null;

    if (databaseDate) {
      const dateObject = parseExistingDate(databaseDate);
      setSelectedDate(dateObject);
      setPurchaseDate(formatDateForMySQL(dateObject));
    }

    const dbSupplierId = purchase.supplier_id || purchase.SupplierId || null;
    if (dbSupplierId) {
      setSupplierId(String(dbSupplierId));
    }

    const supplierName =
      purchase.supplier_name ||
      purchase.supplier ||
      purchase.Supplier ||
      purchase.vendor_name ||
      '';
    setSupplier(String(supplierName));

    if (!dbSupplierId && supplierName) {
      const matchedSupplier = suppliers.find(
        item =>
          item.name.toLowerCase().trim() ===
          String(supplierName).toLowerCase().trim(),
      );
      if (matchedSupplier) {
        setSupplierId(matchedSupplier.id);
      }
    }

    // Populate multiple items
    let databaseItems: any[] = [];
    if (Array.isArray(purchase)) {
      databaseItems = purchase;
    } else if (Array.isArray(purchase.items)) {
      databaseItems = purchase.items;
    } else if (typeof purchase.items === 'string') {
      try {
        const parsed = JSON.parse(purchase.items);
        if (Array.isArray(parsed)) databaseItems = parsed;
      } catch (e) {}
    } else if (Array.isArray(purchase.purchase_items)) {
      databaseItems = purchase.purchase_items;
    } else if (typeof purchase.purchase_items === 'string') {
      try {
        const parsed = JSON.parse(purchase.purchase_items);
        if (Array.isArray(parsed)) databaseItems = parsed;
      } catch (e) {}
    } else if (Array.isArray(purchase.products)) {
      databaseItems = purchase.products;
    }

    if (databaseItems.length > 0) {
      const populatedItems = databaseItems.map((item: any) => {
        const dbProductId = item.product_id || item.ProductId || null;
        const productName =
          item.product_name ||
          item.product ||
          item.Product ||
          item.name ||
          '';

        let resolvedProductId = dbProductId;
        let resolvedHsn =
          item.hsn ||
          item.hsn_code ||
          item.product_hsn_code ||
          '';

        if (productName) {
          const matchedProduct = products.find(
            prod =>
              prod.name.toLowerCase().trim() ===
              String(productName).toLowerCase().trim(),
          );
          if (matchedProduct) {
            if (!resolvedProductId) resolvedProductId = matchedProduct.id;
            if (!resolvedHsn) resolvedHsn = matchedProduct.hsn;
          }
        }

        const databaseQty = item.quantity ?? item.qty ?? '';
        const databaseRate =
          item.purchase_price ??
          item.purchasePrice ??
          item.rate ??
          item.Rate ??
          '';

        let discountPercent =
          item.discount_percent ?? item.discount_percentage ?? null;

        if (discountPercent === null || discountPercent === undefined) {
          const itemSubtotal =
            numberValue(databaseQty) * numberValue(databaseRate);
          const discountAmount = numberValue(item.discount);
          if (itemSubtotal > 0 && discountAmount > 0) {
            discountPercent = (discountAmount / itemSubtotal) * 100;
          }
        }

        let gstPercent =
          item.tax_rate ?? item.gst_percent ?? item.GST ?? null;

        return {
          id: item.id,
          productId: resolvedProductId ? String(resolvedProductId) : null,
          product: String(productName),
          quantity: databaseQty === '' ? '' : String(databaseQty),
          rate: databaseRate === '' ? '' : String(databaseRate),
          discount:
            discountPercent === null || discountPercent === undefined
              ? ''
              : String(Number(discountPercent)),
          hsn: String(resolvedHsn || ''),
          gst:
            gstPercent === null || gstPercent === undefined
              ? ''
              : String(Number(gstPercent)),
        };
      });

      setItems(populatedItems);
    }

    const paymentMode =
      purchase.payment_method ||
      purchase.PaymentMode ||
      purchase.payment_mode ||
      'Card';
    setPaymentMode(String(paymentMode));

    const paymentStatus =
      purchase.payment_status || purchase.PaymentStatus || 'Paid';
    setPaymentStatus(String(paymentStatus));
  };

  // =====================================================
  // RESET FORM TO EMPTY
  // =====================================================
  const resetForm = () => {
    const today = getCurrentDate();
    setPurchaseId(null);
    setPurchaseNo(`PUR-${Date.now()}`);
    setInvoiceNo('');
    setPurchaseDate(today);
    setSelectedDate(parseExistingDate(today));
    setSupplier('');
    setSupplierId(null);
    setShowSuppliers(false);
    setItems([]);
    setPaymentMode('Card');
    setPaymentStatus('Paid');
  };

  // =====================================================
  // INITIALIZE SCREEN
  // =====================================================
  useEffect(() => {
    const purchase =
      route?.params?.purchase || route?.params?.item || null;

    if (purchase) {
      populatePurchaseFields(purchase);
    } else if (route?.params?.mode !== 'edit' && !route?.params?.purchaseId) {
      resetForm();
    }
  }, [
    route?.params?.purchase,
    route?.params?.item,
    route?.params?.mode,
    route?.params?.purchaseId,
  ]);

  useFocusEffect(
    useCallback(() => {
      const isEdit =
        route?.params?.mode === 'edit' ||
        !!route?.params?.purchaseId ||
        !!route?.params?.purchase ||
        !!route?.params?.item;

      if (!isEdit && purchaseId !== null) {
        resetForm();
      }
    }, [route?.params, purchaseId]),
  );

  // =====================================================
  // LOAD PURCHASE BY ID
  // =====================================================
  useEffect(() => {
    const loadPurchaseFromDatabase = async () => {
      const purchaseIdFromRoute = route?.params?.purchaseId;
      const existingPurchase =
        route?.params?.purchase || route?.params?.item;

      if (!purchaseIdFromRoute || existingPurchase) {
        return;
      }

      try {
        setLoadingPurchase(true);

        if (typeof purchaseAPI.getPurchaseById !== 'function') {
          return;
        }

        const response = await purchaseAPI.getPurchaseById(
          Number(purchaseIdFromRoute),
        );

        const databasePurchase =
          response?.purchase || response?.data || response;

        if (databasePurchase) {
          populatePurchaseFields(databasePurchase);
        }
      } catch (error: any) {
        Alert.alert(
          'Error',
          error?.message || 'Failed to load purchase from database.',
        );
      } finally {
        setLoadingPurchase(false);
      }
    };

    loadPurchaseFromDatabase();
  }, [route?.params?.purchaseId]);

  // =====================================================
  // SAVE / UPDATE PURCHASE
  // =====================================================
  const handleSavePurchase = async () => {
    if (!Supplier.trim()) {
      Alert.alert('Validation Error', 'Please select or enter a supplier.');
      return;
    }

    if (items.length === 0) {
      Alert.alert('Validation Error', 'Please add at least one product.');
      return;
    }

    for (let index = 0; index < items.length; index++) {
      const item = items[index];
      const productName = item.product.trim();
      const quantity = Number(item.quantity);
      const rate = Number(item.rate);

      if (!productName) {
        Alert.alert(
          'Validation Error',
          `Please provide a name for Product ${index + 1}.`,
        );
        return;
      }

      if (!Number.isFinite(quantity) || quantity <= 0) {
        Alert.alert(
          'Validation Error',
          `Please enter a valid quantity for "${productName}".`,
        );
        return;
      }

      if (!Number.isFinite(rate) || rate < 0) {
        Alert.alert(
          'Validation Error',
          `Please enter a valid purchase rate for "${productName}".`,
        );
        return;
      }
    }

    const summary = calculatePurchaseSummary();

    let resolvedSupplierId = supplierId;
    if (!resolvedSupplierId) {
      const matchedSupplier = suppliers.find(
        item =>
          item.name.toLowerCase().trim() === Supplier.trim().toLowerCase(),
      );
      if (matchedSupplier) {
        resolvedSupplierId = matchedSupplier.id;
      }
    }

    const purchaseItems = items.map(item => {
      const calculation = calculateItem(item);
      let resolvedProductId = item.productId;

      if (!resolvedProductId) {
        const matchedProduct = products.find(
          product =>
            product.name.toLowerCase().trim() ===
            item.product.trim().toLowerCase(),
        );
        if (matchedProduct) {
          resolvedProductId = matchedProduct.id;
        }
      }

      return {
        id: item.id ? Number(item.id) : undefined,
        product_id: resolvedProductId ? Number(resolvedProductId) : undefined,
        product: item.product.trim(),
        product_name: item.product.trim(),
        hsn: item.hsn?.trim() || '',
        hsn_code: item.hsn?.trim() || '',
        quantity: calculation.quantity,
        purchase_price: calculation.rate,
        discount: Number(calculation.discountAmount.toFixed(2)),
        discount_percent: Number(calculation.discountPercent.toFixed(2)),
        tax_rate: calculation.gstPercent,
        gst_percent: calculation.gstPercent,
        tax_amount: Number(calculation.gstAmount.toFixed(2)),
        taxable_amount: Number(calculation.taxableAmount.toFixed(2)),
        subtotal: Number(calculation.subtotal.toFixed(2)),
        total_amount: Number(calculation.totalAmount.toFixed(2)),
      };
    });

    const purchasePayload = {
      id: purchaseId ? Number(purchaseId) : undefined,
      purchase_id: purchaseId ? Number(purchaseId) : undefined,
      supplier_id: resolvedSupplierId ? Number(resolvedSupplierId) : undefined,
      supplier: Supplier.trim(),
      Supplier: Supplier.trim(),
      supplier_name: Supplier.trim(),
      invoice_number: InvoiceNo.trim() || PurchaseNo.trim(),
      invoice_no: InvoiceNo.trim() || PurchaseNo.trim(),
      PurchaseNo: PurchaseNo.trim(),
      purchase_no: PurchaseNo.trim(),
      purchase_date: PurchaseDate,
      subtotal: Number(summary.subtotal.toFixed(2)),
      discount: Number(summary.discountAmount.toFixed(2)),
      discount_percent: 0,
      taxable_amount: Number(summary.taxableAmount.toFixed(2)),
      tax_amount: Number(summary.gstAmount.toFixed(2)),
      total_amount: Number(summary.grandTotal.toFixed(2)),
      GrandTotal: Number(summary.grandTotal.toFixed(2)),
      payment_status: PaymentStatus,
      payment_method: PaymentMode,
      notes: null,
      items: purchaseItems,
      purchase_items: purchaseItems,
      products: purchaseItems,
      purchaseItems: purchaseItems,
      order_items: purchaseItems,
    };

    try {
      setSaving(true);

      let result;
      if (isEditing && purchaseId) {
        result = await purchaseAPI.updatePurchase(purchasePayload);
      } else {
        result = await purchaseAPI.createPurchase(purchasePayload);
      }

      // Reset form so Add Purchase becomes empty and not filled with past data
      resetForm();

      Alert.alert(
        'Success',
        result?.message ||
          (isEditing
            ? 'Purchase updated successfully!'
            : 'Purchase saved successfully!'),
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('AllPurchases', {
                user: route?.params?.user,
              });
            },
          },
        ],
      );
    } catch (error: any) {
      Alert.alert(
        'Failed to Save Purchase',
        error?.message || 'Unable to save purchase.',
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING SCREEN
  // =====================================================
  if (loadingPurchase) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#4338ca" />
        <Text style={styles.loadingText}>Loading purchase data...</Text>
      </View>
    );
  }

  // =====================================================
  // SUMMARY CALCULATIONS
  // =====================================================
  const summary = calculatePurchaseSummary();

  // Filter products for modal dropdown
  const filteredModalProducts = products.filter(p =>
    p.name.toLowerCase().includes(modalProduct.toLowerCase()),
  );

  // Live calculation for the modal
  const modalSubtotalNum =
    (Number(modalQuantity) || 0) * (Number(modalRate) || 0);
  const modalDiscountAmtNum =
    (modalSubtotalNum * (Number(modalDiscount) || 0)) / 100;
  const modalTaxableNum = Math.max(0, modalSubtotalNum - modalDiscountAmtNum);
  const modalGstAmtNum = (modalTaxableNum * (Number(modalGst) || 0)) / 100;
  const modalTotalNum = modalTaxableNum + modalGstAmtNum;

  // =====================================================
  // MAIN UI
  // =====================================================
  return (
    <View style={styles.container}>
      {/* ================================================= */}
      {/* FIXED HEADER */}
      {/* ================================================= */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Purchase' : 'Add Purchase'}
        </Text>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* ================================================= */}
        {/* PURCHASE INFORMATION */}
        {/* ================================================= */}
        <Text style={styles.sectionTitle}>Purchase Information</Text>

        {/* BILL NUMBER + DATE */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Bill Number</Text>
            <TextInput
              style={styles.input}
              value={PurchaseNo}
              onChangeText={setPurchaseNo}
              placeholder="Bill Number"
              placeholderTextColor="#94a3b8"
            />
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Purchase Date</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={styles.dateInput}
                value={PurchaseDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#94a3b8"
                editable={false}
                pointerEvents="none"
              />
              <Text style={styles.calendarIcon}>🗓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DATE PICKER */}
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) {
                setSelectedDate(date);
                setPurchaseDate(formatDateForMySQL(date));
              }
            }}
          />
        )}

        {/* ================================================= */}
        {/* SUPPLIER */}
        {/* ================================================= */}
        <Text style={styles.label}>Supplier</Text>
        <View style={styles.supplierContainer}>
          <TextInput
            style={styles.fullInput}
            placeholder="Select or enter Supplier"
            placeholderTextColor="#94a3b8"
            value={Supplier}
            onFocus={() => setShowSuppliers(true)}
            onChangeText={text => {
              setSupplier(text);
              setSupplierId(null);
              setShowSuppliers(true);
            }}
          />

          {showSuppliers && (
            <View style={styles.supplierDropdown}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                {suppliers
                  .filter(item => {
                    const q = Supplier.toLowerCase().trim();
                    if (!q) return true;
                    return item.name.toLowerCase().includes(q);
                  })
                  .map(item => (
                    <TouchableOpacity
                      key={`${item.id}-${item.name}`}
                      style={styles.supplierItem}
                      onPress={() => {
                        setSupplier(item.name);
                        setSupplierId(item.id);
                        setShowSuppliers(false);
                      }}>
                      <Text style={styles.supplierText}>{item.name}</Text>
                    </TouchableOpacity>
                  ))}
                <TouchableOpacity
                  style={[
                    styles.supplierItem,
                    {
                      backgroundColor: '#eef2ff',
                      borderTopWidth: 1,
                      borderTopColor: '#cbd5e1',
                    },
                  ]}
                  onPress={() => {
                    setShowSuppliers(false);
                    navigation.navigate('SupplierMaster', {
                      openAddModal: true,
                      returnTo: 'AddPurchase',
                    });
                  }}>
                  <Text
                    style={[
                      styles.supplierText,
                      {color: '#4338ca', fontWeight: '700'},
                    ]}>
                    + Add Supplier
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>

        {/* ================================================= */}
        {/* INVOICE NUMBER */}
        {/* ================================================= */}
        <Text style={styles.label}>Invoice Number</Text>
        <TextInput
          style={styles.fullInput}
          value={InvoiceNo}
          onChangeText={setInvoiceNo}
          placeholder="Invoice Number"
          placeholderTextColor="#94a3b8"
        />

        {/* ================================================= */}
        {/* PRODUCT INFORMATION (TABLE VIEW) */}
        {/* ================================================= */}
        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={styles.sectionTitle}>Product Information</Text>
            <View style={styles.itemBadge}>
              <Text style={styles.itemCountText}>
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </Text>
            </View>
          </View>

          {/* [+ ICON BUTTON ON TOP OF THE BOX] */}
          <TouchableOpacity
            style={styles.addIconButton}
            onPress={openAddModal}
            activeOpacity={0.8}
            accessibilityLabel="Add Item">
            <Text style={styles.plusIconText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* PRODUCT TABLE CONTAINER */}
        <View style={styles.tableCardContainer}>
          <View style={styles.tableCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              persistentScrollbar={true}
              nestedScrollEnabled>
              <View style={styles.tableInner}>
                {/* TABLE HEADER ROW */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.colProduct}>
                    <Text style={styles.thText}>Product</Text>
                  </View>
                  <View style={styles.colQty}>
                    <Text style={[styles.thText, styles.textCenter]}>Qty</Text>
                  </View>
                  <View style={styles.colRate}>
                    <Text style={[styles.thText, styles.textRight]}>Rate</Text>
                  </View>
                  <View style={styles.colDiscount}>
                    <Text style={[styles.thText, styles.textCenter]}>
                      Discount
                    </Text>
                  </View>
                  <View style={styles.colHsn}>
                    <Text style={[styles.thText, styles.textCenter]}>HSN</Text>
                  </View>
                  <View style={styles.colTotal}>
                    <Text style={[styles.thText, styles.textRight]}>Total</Text>
                  </View>
                  <View style={styles.colAction}>
                    <Text style={[styles.thText, styles.textCenter]}>Action</Text>
                  </View>
                </View>

                {/* TABLE BODY ROWS */}
                {items.length === 0 ? (
                  <View style={styles.emptyTableBox}>
                    <Text style={styles.emptyTableText}>
                      No products added yet. Click '+' above to add items.
                    </Text>
                  </View>
                ) : (
                  items.map((item, index) => {
                    const calc = calculateItem(item);
                    const isEven = index % 2 === 0;

                    return (
                      <TouchableOpacity
                        key={item.id ? `db-${item.id}` : `item-${index}`}
                        activeOpacity={0.7}
                        onPress={() => openEditModal(index)}
                        style={[
                          styles.tableDataRow,
                          isEven ? styles.rowEven : styles.rowOdd,
                          index === items.length - 1 && styles.lastRow,
                        ]}>
                        {/* Product */}
                        <View style={styles.colProduct}>
                          <Text style={styles.cellProductText} numberOfLines={2}>
                            {item.product || '-'}
                          </Text>
                        </View>

                        {/* Qty */}
                        <View style={styles.colQty}>
                          <Text style={styles.cellCenterText}>
                            {item.quantity || '0'}
                          </Text>
                        </View>

                        {/* Rate */}
                        <View style={styles.colRate}>
                          <Text style={styles.cellRightText}>
                            {numberValue(item.rate).toFixed(0) ===
                            String(numberValue(item.rate))
                              ? numberValue(item.rate)
                              : numberValue(item.rate).toFixed(2)}
                          </Text>
                        </View>

                        {/* Discount */}
                        <View style={styles.colDiscount}>
                          <Text style={styles.cellCenterText}>
                            {item.discount && Number(item.discount) > 0
                              ? `${item.discount}%`
                              : '0%'}
                          </Text>
                        </View>

                        {/* HSN */}
                        <View style={styles.colHsn}>
                          <Text style={styles.cellCenterText}>
                            {item.hsn || '-'}
                          </Text>
                        </View>

                        {/* Total */}
                        <View style={styles.colTotal}>
                          <Text style={styles.cellTotalText}>
                            {calc.totalAmount.toFixed(2)}
                          </Text>
                        </View>

                        {/* Action - Dustbin Icon Only (Edit removed) */}
                        <View style={styles.colAction}>
                          <TouchableOpacity
                            onPress={() => handleDeleteItem(index)}
                            style={styles.deleteActionBtn}
                            activeOpacity={0.7}
                            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                            <DustbinIcon size={16} color="#dc2626" />
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            </ScrollView>
            {/* BLACK SHADOW AT BOTTOM OF SCROLL */}
            <View style={styles.scrollBottomShadow} />
          </View>
        </View>

        {/* ================================================= */}
        {/* PAYMENT */}
        {/* ================================================= */}
        <Text style={styles.sectionTitle}>Payment</Text>

        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.label}>Payment Mode</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={PaymentMode}
                onValueChange={value => setPaymentMode(value)}
                style={styles.picker}>
                <Picker.Item label="Card" value="Card" />
                <Picker.Item label="UPI" value="UPI" />
                <Picker.Item label="Cash" value="Cash" />
                <Picker.Item label="Credit" value="Credit" />
              </Picker>
            </View>
          </View>

          <View style={styles.half}>
            <Text style={styles.label}>Payment Status</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={PaymentStatus}
                onValueChange={value => setPaymentStatus(value)}
                style={styles.picker}>
                <Picker.Item label="Paid" value="Paid" />
                <Picker.Item label="Pending" value="Pending" />
                <Picker.Item label="Partial" value="Partial" />
              </Picker>
            </View>
          </View>
        </View>

        {/* ================================================= */}
        {/* PURCHASE SUMMARY */}
        {/* ================================================= */}
        <Text style={styles.sectionTitle}>Purchase Summary</Text>

        <View style={styles.summaryBox}>
          {/* SUBTOTAL */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₹ {summary.subtotal.toFixed(2)}
            </Text>
          </View>

          {/* DISCOUNT */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Discount</Text>
            <Text style={styles.discountValue}>
              - ₹ {summary.discountAmount.toFixed(2)}
            </Text>
          </View>

          {/* TAXABLE */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxable Amount</Text>
            <Text style={styles.summaryValue}>
              ₹ {summary.taxableAmount.toFixed(2)}
            </Text>
          </View>

          {/* GST */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total GST</Text>
            <Text style={styles.gstValue}>
              + ₹ {summary.gstAmount.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* GRAND TOTAL */}
          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotal}>
              ₹ {summary.grandTotal.toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ================================================= */}
        {/* SAVE / UPDATE BUTTON */}
        {/* ================================================= */}
        <TouchableOpacity
          style={[styles.saveButton, saving && {opacity: 0.7}]}
          onPress={handleSavePurchase}
          disabled={saving}
          activeOpacity={0.8}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Purchase' : 'Save Purchase'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ================================================= */}
      {/* ADD / EDIT PRODUCT MODAL */}
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
                  {editingIndex !== null ? 'Edit Item' : 'Add Item'}
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
                {/* PRODUCT NAME INPUT + CATALOG DROPDOWN */}
                <Text style={styles.modalFieldLabel}>Product Name *</Text>
                <View style={styles.modalDropdownContainer}>
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Search or enter product name"
                    placeholderTextColor="#94a3b8"
                    value={modalProduct}
                    onFocus={() => setModalProductDropdownOpen(true)}
                    onChangeText={text => {
                      setModalProduct(text);
                      setModalProductId(null);
                      setModalProductDropdownOpen(true);
                    }}
                  />

                  {modalProductDropdownOpen && (
                    <View style={styles.modalDropdown}>
                      <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled">
                        {filteredModalProducts.length > 0 ? (
                          filteredModalProducts.map(item => (
                            <TouchableOpacity
                              key={item.id}
                              style={styles.modalDropdownItem}
                              onPress={() => handleSelectModalProduct(item)}>
                              <Text style={styles.modalDropdownText}>
                                {item.name}
                              </Text>
                              <Text style={styles.modalDropdownSub}>
                                HSN: {item.hsn} | Rate: ₹{item.rate || 0}
                              </Text>
                            </TouchableOpacity>
                          ))
                        ) : (
                          <View style={styles.modalDropdownEmpty}>
                            <Text style={styles.modalDropdownEmptyText}>
                              Custom product: "{modalProduct}"
                            </Text>
                          </View>
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
                      placeholder="e.g. 2"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Purchase Rate (₹) *</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalRate}
                      onChangeText={setModalRate}
                      placeholder="e.g. 500"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* DISCOUNT & HSN ROW */}
                <View style={styles.modalRow}>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Discount (%)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalDiscount}
                      onChangeText={setModalDiscount}
                      placeholder="e.g. 5"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>HSN Code</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalHsn}
                      onChangeText={setModalHsn}
                      placeholder="e.g. 8471"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>

                {/* GST (%) */}
                <View style={styles.modalRow}>
                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>GST Rate (%)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalGst}
                      onChangeText={setModalGst}
                      placeholder="e.g. 0, 5, 18"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.modalHalf}>
                    <Text style={styles.modalFieldLabel}>Estimated Total</Text>
                    <View style={styles.modalTotalPreviewBox}>
                      <Text style={styles.modalTotalPreviewValue}>
                        ₹ {modalTotalNum.toFixed(2)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* CALCULATION SUMMARY PREVIEW */}
                <View style={styles.modalCalcCard}>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Subtotal:</Text>
                    <Text style={styles.modalCalcVal}>
                      ₹ {modalSubtotalNum.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Discount:</Text>
                    <Text style={styles.modalCalcDiscount}>
                      - ₹ {modalDiscountAmtNum.toFixed(2)}
                    </Text>
                  </View>
                  {Number(modalGst) > 0 && (
                    <View style={styles.modalCalcRow}>
                      <Text style={styles.modalCalcLabel}>GST Amount:</Text>
                      <Text style={styles.modalCalcGst}>
                        + ₹ {modalGstAmtNum.toFixed(2)}
                      </Text>
                    </View>
                  )}
                  <View style={[styles.modalCalcRow, styles.modalCalcTotalRow]}>
                    <Text style={styles.modalCalcTotalLabel}>Line Total:</Text>
                    <Text style={styles.modalCalcTotalVal}>
                      ₹ {modalTotalNum.toFixed(2)}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* MODAL ACTION BUTTONS */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCancelText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveModalItem}
                  activeOpacity={0.8}>
                  <Text style={styles.modalSaveText}>
                    {editingIndex !== null ? 'Update Item' : 'Add Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
};

// =====================================================
// STYLES
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingBottom: 30,
  },

  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },

  loadingText: {
    marginTop: 12,
    color: '#64748b',
    fontSize: 14,
  },

  // ===================================================
  // HEADER
  // ===================================================
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 45,
    paddingBottom: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    marginRight: 12,
  },

  arrow: {
    color: '#ffffff',
    fontSize: 28,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },

  // ===================================================
  // SECTION HEADERS
  // ===================================================
  sectionTitle: {
    padding:8,
    marginLeft:10,
    fontSize: 16,
    fontWeight: '700',
    color: '#4338ca',
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 4,
  },

  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },

  itemCountText: {
    fontSize: 12,
    color: '#4338ca',
    fontWeight: '700',
  },

  addIconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4338ca',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    shadowColor: '#4338ca',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },

  plusIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 22,
    textAlign: 'center',
  },

  // ===================================================
  // LABELS & INPUTS
  // ===================================================
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#00040a',
    marginBottom: 3,
    marginTop: 4,
    marginHorizontal: 10,
  },

  fullInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    marginHorizontal: 10,
    marginBottom: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
  },

  half: {
    width: '49%',
  },

  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
    marginHorizontal: 4,
    marginBottom: 3,
  },

  // ===================================================
  // DATE INPUT
  // ===================================================
  dateInputContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    marginHorizontal: 4,
    marginBottom: 3,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
  },

  dateInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 13,
    color: '#0f172a',
  },

  calendarIcon: {
    fontSize: 17,
    marginRight: 8,
  },

  // ===================================================
  // SUPPLIER DROPDOWN
  // ===================================================
  supplierContainer: {
    width: '100%',
    position: 'relative',
    zIndex: 5000,
  },

  supplierDropdown: {
    position: 'absolute',
    top: 45,
    left: 10,
    right: 10,
    maxHeight: 180,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    elevation: 10,
    zIndex: 5000,
  },

  supplierItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  supplierText: {
    fontSize: 14,
    color: '#334155',
  },

  // ===================================================
  // PRODUCT INFORMATION TABLE
  // ===================================================
  tableCardContainer: {
    marginHorizontal: 10,
    marginTop: 4,
    marginBottom: 10,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    // BLACK SHADOW AT THE BOTTOM OF SCROLL CONTAINER
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.35,
    shadowRadius: 7,
    elevation: 8,
  },

  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    overflow: 'hidden',
  },

  scrollBottomShadow: {
    height: 5,
    width: '100%',
    backgroundColor: '#000000',
    opacity: 0.15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  tableInner: {
    minWidth: 520,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1.5,
    borderBottomColor: '#cbd5e1',
    paddingVertical: 10,
  },

  thText: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },

  rowEven: {
    backgroundColor: '#ffffff',
  },

  rowOdd: {
    backgroundColor: '#f8fafc',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  // COLUMN WIDTHS & ALIGNMENTS
  colProduct: {
    width: 120,
    paddingLeft: 10,
    paddingRight: 6,
    justifyContent: 'center',
  },

  colQty: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colRate: {
    width: 70,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },

  colDiscount: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colHsn: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colTotal: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },

  colAction: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CELL TEXTS
  cellProductText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },

  cellCenterText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
  },

  cellRightText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'right',
  },

  cellTotalText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'right',
  },

  // ACTION BUTTONS
  deleteActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  emptyTableBox: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTableText: {
    fontSize: 13,
    color: '#64748b',
    fontStyle: 'italic',
  },

  // ===================================================
  // PAYMENT PICKERS
  // ===================================================
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    marginHorizontal: 4,
    marginBottom: 3,
    overflow: 'hidden',
    height: 42,
  },

  picker: {
    height: 42,
    width: '100%',
    marginTop: -1,
  },

  // ===================================================
  // SUMMARY BOX
  // ===================================================
  summaryBox: {
    backgroundColor: '#ffffff',
    marginHorizontal: 10,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 1,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },

  summaryLabel: {
    fontSize: 14,
    color: '#475569',
  },

  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },

  discountValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
  },

  gstValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
  },

  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 7,
  },

  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  grandTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4338ca',
  },

  // ===================================================
  // SAVE BUTTON
  // ===================================================
  saveButton: {
    backgroundColor: '#4338ca',
    marginHorizontal: 10,
    marginTop: 16,
    marginBottom: 25,
    paddingVertical: 12,
    borderRadius: 7,
    alignItems: 'center',
    elevation: 2,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  // ===================================================
  // ADD / EDIT PRODUCT MODAL
  // ===================================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  modalContainer: {
    width: '100%',
    maxWidth: 480,
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4338ca',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
  },

  modalCloseBtn: {
    padding: 4,
  },

  modalCloseText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '700',
  },

  modalScrollBody: {
    padding: 16,
  },

  modalFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
    marginTop: 6,
  },

  modalInput: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },

  modalDropdownContainer: {
    position: 'relative',
    zIndex: 3000,
  },

  modalDropdown: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    maxHeight: 160,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 6,
    elevation: 8,
    zIndex: 3000,
  },

  modalDropdownItem: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  modalDropdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },

  modalDropdownSub: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },

  modalDropdownEmpty: {
    padding: 12,
    alignItems: 'center',
  },

  modalDropdownEmptyText: {
    fontSize: 12.5,
    color: '#64748b',
    fontStyle: 'italic',
  },

  modalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  modalHalf: {
    width: '48%',
  },

  modalTotalPreviewBox: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 6,
    height: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  modalTotalPreviewValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4338ca',
  },

  modalCalcCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    marginTop: 14,
    marginBottom: 6,
  },

  modalCalcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  modalCalcLabel: {
    fontSize: 12.5,
    color: '#64748b',
  },

  modalCalcVal: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
  },

  modalCalcDiscount: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#dc2626',
  },

  modalCalcGst: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#16a34a',
  },

  modalCalcTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 6,
    marginTop: 6,
  },

  modalCalcTotalLabel: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },

  modalCalcTotalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#4338ca',
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 10,
  },

  modalCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },

  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },

  modalSaveBtn: {
    backgroundColor: '#4338ca',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 6,
  },

  modalSaveText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default AddPurchaseScreen;