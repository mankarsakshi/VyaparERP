import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {pick, types} from '@react-native-documents/picker';
import {purchaseOrderAPI} from '../api/purchaseOrderService';
import {API_BASE_URL} from '../api/config';

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
  quantity?: number | string;
  purchase_price?: number | string;
  rate?: number | string;
  hsn?: string;
  hsn_code?: string;
  discount?: number | string;
  discount_percent?: number | string;
  tax_rate?: number | string;
  tax_amount?: number | string;
  total_amount?: number | string;
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
  tax_id?: string;
  supplier_address?: string;
  address?: string;

  purchase_order_no?: string;
  po_number?: string;
  po_no?: string;

  order_number?: string;
  invoice_number?: string;
  bill_number?: string;

  po_date?: string;
  purchase_date?: string;
  expected_date?: string;
  delivery_date?: string;

  subtotal?: number | string;
  discount?: number | string;
  discount_percent?: number | string;
  tax_amount?: number | string;
  tax_rate?: number | string;
  total_amount?: number | string;

  status?: string;
  payment_status?: string;
  payment_method?: string;
  notes?: string;
  document_name?: string;
  created_at?: string;
  updated_at?: string;

  items?: PurchaseOrderItem[];
};

type OrderItem = {
  id?: number | string;
  productId?: number | string | null;
  product: string;
  quantity: string;
  rate: string;
  hsn: string;
  discount: string;
};

type CatalogProduct = {
  id: string;
  name: string;
  hsn: string;
  rate?: string | number;
  discount?: string | number;
};

const products: CatalogProduct[] = [
  {id: '1', name: 'Laptop', hsn: '8471', rate: '500', discount: '5'},
  {id: '2', name: 'Mouse', hsn: '8471', rate: '200', discount: '2'},
  {id: '3', name: 'Keyboard', hsn: '8471', rate: '300', discount: '0'},
  {id: '4', name: 'Monitor', hsn: '8528', rate: '4500', discount: '0'},
  {id: '5', name: 'Mobile Phone', hsn: '8517', rate: '12000', discount: '0'},
  {id: '6', name: 'Printer', hsn: '8443', rate: '6000', discount: '0'},
  {id: '7', name: 'Headphones', hsn: '8518', rate: '800', discount: '0'},
  {id: '8', name: 'USB Cable', hsn: '8544', rate: '150', discount: '0'},
  {id: '9', name: 'Webcam', hsn: '8525', rate: '1200', discount: '0'},
  {id: '10', name: 'Power Bank', hsn: '8504', rate: '900', discount: '0'},
];

type SupplierItem = {
  id: string | number;
  name: string;
  supplier_name?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  status?: string;
  currentPayable?: number;
  openingBalance?: number;
};

const createEmptyItem = (): OrderItem => ({
  productId: null,
  product: '',
  quantity: '',
  rate: '',
  hsn: '',
  discount: '',
});

const isItemBlank = (item: OrderItem): boolean => {
  return (
    !item.product.trim() &&
    !item.quantity.trim() &&
    !item.rate.trim()
  );
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

const PurchaseOrderScreen = ({navigation, route}: Props) => {
  const params = route?.params || {};

  const editPurchaseOrder: PurchaseOrder | null =
    params.purchaseOrder || params.order || null;

  const isEditing =
    params.mode === 'edit' || params.isEditing === true || !!params.purchaseOrderId;

  const [currentPurchaseOrderId, setCurrentPurchaseOrderId] = useState<
    string | number | null
  >(
    params.purchaseOrderId ||
      editPurchaseOrder?.id ||
      editPurchaseOrder?.purchase_order_id ||
      null,
  );

  const [loadingPurchaseOrder, setLoadingPurchaseOrder] = useState(false);

  // =========================================================
  // DATE FUNCTIONS
  // =========================================================

  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const parseDate = (value: any): Date => {
    if (!value) {
      return new Date();
    }

    const stringValue = String(value);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(stringValue)) {
      const [day, month, year] = stringValue.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
      const [year, month, day] = stringValue.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    const date = new Date(stringValue);
    if (!isNaN(date.getTime())) {
      return date;
    }

    return new Date();
  };

  const formatDatabaseDate = (value: any) => {
    if (!value) {
      return '';
    }

    const stringValue = String(value);

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(stringValue)) {
      return stringValue;
    }

    return formatDate(parseDate(stringValue));
  };

  const convertToMySQLDate = (value: string) => {
    if (!value) {
      return null;
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/');
      return `${year}-${month}-${day}`;
    }

    return value;
  };

  // =========================================================
  // PURCHASE ORDER INFORMATION
  // =========================================================

  const [PONumber, setPONumber] = useState(
    editPurchaseOrder?.purchase_order_no ||
      editPurchaseOrder?.po_number ||
      editPurchaseOrder?.po_no ||
      `PO-${Date.now()}`,
  );

  const [PODate, setPODate] = useState(
    formatDatabaseDate(
      editPurchaseOrder?.po_date ||
        editPurchaseOrder?.purchase_date,
    ) || formatDate(new Date()),
  );

  const [selectedPODate, setSelectedPODate] = useState<Date>(
    parseDate(
      editPurchaseOrder?.po_date ||
        editPurchaseOrder?.purchase_date,
    ),
  );

  const [showPODatePicker, setShowPODatePicker] = useState(false);

  // =========================================================
  // DELIVERY DATE
  // =========================================================

  const [DeliveryDate, setDeliveryDate] = useState(
    formatDatabaseDate(
      editPurchaseOrder?.expected_date ||
        editPurchaseOrder?.delivery_date,
    ),
  );

  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date>(
    parseDate(
      editPurchaseOrder?.expected_date ||
        editPurchaseOrder?.delivery_date,
    ),
  );

  const [showDeliveryDatePicker, setShowDeliveryDatePicker] = useState(false);

  // =========================================================
  // STATUS
  // =========================================================

  const [status, setStatus] = useState(
    editPurchaseOrder?.status || 'Draft',
  );

  // =========================================================
  // SUPPLIER
  // =========================================================

  const [suppliers, setSuppliers] = useState<SupplierItem[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);

  const [Supplier, setSupplier] = useState(
    editPurchaseOrder?.supplier_name ||
      editPurchaseOrder?.supplier ||
      '',
  );

  const [supplierId, setSupplierId] = useState<string | number | null>(
    editPurchaseOrder?.supplier_id || null,
  );

  const [supplierPhone, setSupplierPhone] = useState(
    editPurchaseOrder?.supplier_phone ||
      editPurchaseOrder?.phone_number ||
      '',
  );

  const [supplierEmail, setSupplierEmail] = useState(
    editPurchaseOrder?.supplier_email ||
      editPurchaseOrder?.email_address ||
      '',
  );

  const [supplierGSTIN, setSupplierGSTIN] = useState(
    editPurchaseOrder?.supplier_gstin ||
      editPurchaseOrder?.gstin ||
      editPurchaseOrder?.tax_id ||
      '',
  );

  const [supplierAddress, setSupplierAddress] = useState(
    editPurchaseOrder?.supplier_address ||
      editPurchaseOrder?.address ||
      '',
  );

  const [orderNumber, setOrderNumber] = useState(
    editPurchaseOrder?.order_number ||
      editPurchaseOrder?.invoice_number ||
      editPurchaseOrder?.bill_number ||
      '',
  );

  // =========================================================
  // LOAD SUPPLIERS FROM DATABASE
  // =========================================================

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

      const formatted: SupplierItem[] = list.map(item => ({
        id: item.id ?? item.supplier_id ?? item.supplierId,
        name: item.name ?? item.supplier_name ?? item.supplierName ?? '',
        phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
        mobile: item.mobile ?? item.phone ?? '',
        email: item.email ?? '',
        address: item.address ?? '',
        city: item.city ?? '',
        state: item.state ?? '',
        pincode: item.pincode ?? '',
        gstin: item.gstin ?? '',
        status: item.status ?? 'active',
        currentPayable:
          Number(
            item.currentPayable ??
              item.current_payable ??
              item.payable ??
              0,
          ) || 0,
        openingBalance:
          Number(
            item.openingBalance ??
              item.opening_balance ??
              0,
          ) || 0,
      }));

      setSuppliers(formatted);
    } catch (error) {
      console.log('Error fetching suppliers from DB in PurchaseOrder:', error);
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
      const name = newSupp.name || newSupp.supplier_name || '';
      setSupplier(name);
      setSupplierId(newSupp.id ?? null);
      setSupplierPhone(newSupp.phone || newSupp.mobile || '');
      setSupplierEmail(newSupp.email || '');
      setSupplierGSTIN(newSupp.gstin || '');

      let fullAddress = newSupp.address || '';
      if (newSupp.city && !fullAddress.includes(newSupp.city)) {
        fullAddress = fullAddress ? `${fullAddress}, ${newSupp.city}` : newSupp.city;
      }
      if (newSupp.state && !fullAddress.includes(newSupp.state)) {
        fullAddress = fullAddress ? `${fullAddress}, ${newSupp.state}` : newSupp.state;
      }
      setSupplierAddress(fullAddress);

      // Add to local supplier list if not exists
      setSuppliers(prev => {
        if (!prev.some(s => String(s.id) === String(newSupp.id) || s.name === name)) {
          return [newSupp, ...prev];
        }
        return prev;
      });
    }
  }, [route?.params?.newSupplier]);

  // Handle supplier selection and automatic data filling
  const handleSupplierSelect = (selected: SupplierItem) => {
    const suppName = selected.name || selected.supplier_name || '';
    setSupplier(suppName);
    setSupplierId(selected.id ?? null);
    setSupplierPhone(selected.phone || selected.mobile || '');
    setSupplierEmail(selected.email || '');
    setSupplierGSTIN(selected.gstin || '');

    let fullAddress = selected.address || '';
    if (selected.city && !fullAddress.includes(selected.city)) {
      fullAddress = fullAddress ? `${fullAddress}, ${selected.city}` : selected.city;
    }
    if (selected.state && !fullAddress.includes(selected.state)) {
      fullAddress = fullAddress ? `${fullAddress}, ${selected.state}` : selected.state;
    }
    setSupplierAddress(fullAddress);
    setShowSupplierDropdown(false);
  };

  const handleSupplierChange = (value: string) => {
    if (value === 'add') {
      navigation.navigate('SupplierMaster', {
        openAddModal: true,
        returnTo: 'PurchaseOrder',
      });
      return;
    }

    setSupplier(value);

    if (!value || value.trim() === '') {
      setSupplierId(null);
      setSupplierPhone('');
      setSupplierEmail('');
      setSupplierGSTIN('');
      setSupplierAddress('');
      return;
    }

    const selected = suppliers.find(
      item =>
        item.name === value ||
        String(item.id) === String(value),
    );

    if (selected) {
      handleSupplierSelect(selected);
    }
  };

  // =========================================================
  // MULTIPLE PRODUCT ITEMS (TABLE VIEW - STARTS BLANK)
  // =========================================================

  const [items, setItems] = useState<OrderItem[]>([createEmptyItem()]);

  // =========================================================
  // ADD / EDIT PRODUCT MODAL STATE
  // =========================================================

  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [modalProduct, setModalProduct] = useState('');
  const [modalProductId, setModalProductId] = useState<string | number | null>(null);
  const [modalQuantity, setModalQuantity] = useState('1');
  const [modalRate, setModalRate] = useState('');
  const [modalDiscount, setModalDiscount] = useState('0');
  const [modalHsn, setModalHsn] = useState('');
  const [modalProductDropdownOpen, setModalProductDropdownOpen] = useState(false);

  // =========================================================
  // PAYMENT
  // =========================================================

  const [paymentMode, setPaymentMode] = useState(
    editPurchaseOrder?.payment_method || '',
  );

  // =========================================================
  // DOCUMENT
  // =========================================================

  const [selectedFile, setSelectedFile] = useState<any>(
    editPurchaseOrder?.document_name
      ? {
          name: editPurchaseOrder.document_name,
        }
      : null,
  );

  // =========================================================
  // HELPER FUNCTIONS
  // =========================================================

  const numberValue = (value: any, fallback = 0): number => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  // =========================================================
  // POPULATE PURCHASE ORDER FIELDS
  // =========================================================

  const populatePurchaseOrderFields = (orderData: any) => {
    if (!orderData) return;

    console.log(
      'POPULATING PURCHASE ORDER:',
      JSON.stringify(orderData, null, 2),
    );

    const orderId =
      orderData.id ||
      orderData.purchase_order_id ||
      orderData.purchaseOrderId ||
      null;

    setCurrentPurchaseOrderId(orderId);

    const poNumber =
      orderData.purchase_order_no ||
      orderData.po_number ||
      orderData.po_no ||
      orderData.invoice_number ||
      '';

    if (poNumber) {
      setPONumber(String(poNumber));
    }

    const rawPoDate =
      orderData.po_date ||
      orderData.purchase_date ||
      orderData.created_at ||
      null;

    if (rawPoDate) {
      const parsedPoDate = parseDate(rawPoDate);
      setSelectedPODate(parsedPoDate);
      setPODate(formatDate(parsedPoDate));
    }

    const rawExpDate =
      orderData.expected_date ||
      orderData.delivery_date ||
      null;

    if (rawExpDate) {
      const parsedExpDate = parseDate(rawExpDate);
      setSelectedDeliveryDate(parsedExpDate);
      setDeliveryDate(formatDate(parsedExpDate));
    } else {
      setDeliveryDate('');
    }

    if (orderData.status) {
      setStatus(String(orderData.status));
    }

    const suppName =
      orderData.supplier_name ||
      orderData.supplier ||
      orderData.vendor_name ||
      '';

    setSupplier(String(suppName));

    const suppId =
      orderData.supplier_id ||
      orderData.supplierId ||
      null;

    setSupplierId(suppId ? String(suppId) : null);

    setSupplierPhone(
      String(
        orderData.supplier_phone ||
          orderData.phone_number ||
          orderData.phone ||
          '',
      ),
    );

    setSupplierEmail(
      String(
        orderData.supplier_email ||
          orderData.email_address ||
          orderData.email ||
          '',
      ),
    );

    setSupplierGSTIN(
      String(
        orderData.supplier_gstin ||
          orderData.gstin ||
          orderData.tax_id ||
          '',
      ),
    );

    setSupplierAddress(
      String(
        orderData.supplier_address ||
          orderData.address ||
          '',
      ),
    );

    setOrderNumber(
      String(
        orderData.order_number ||
          orderData.invoice_number ||
          orderData.bill_number ||
          orderData.invoice_no ||
          '',
      ),
    );

    setPaymentMode(
      String(
        orderData.payment_method ||
          orderData.payment_mode ||
          orderData.paymentMode ||
          '',
      ),
    );

    if (orderData.document_name) {
      setSelectedFile({
        name: orderData.document_name,
      });
    }

    // -------------------------------------------------------
    // EXTRACT MULTIPLE ITEMS SAFELY
    // -------------------------------------------------------
    let databaseItems: any[] = [];

    if (Array.isArray(orderData)) {
      databaseItems = orderData;
    } else if (Array.isArray(orderData.items)) {
      databaseItems = orderData.items;
    } else if (typeof orderData.items === 'string') {
      try {
        const parsed = JSON.parse(orderData.items);
        if (Array.isArray(parsed)) databaseItems = parsed;
      } catch (e) {}
    } else if (Array.isArray(orderData.purchase_order_items)) {
      databaseItems = orderData.purchase_order_items;
    } else if (typeof orderData.purchase_order_items === 'string') {
      try {
        const parsed = JSON.parse(orderData.purchase_order_items);
        if (Array.isArray(parsed)) databaseItems = parsed;
      } catch (e) {}
    } else if (Array.isArray(orderData.order_items)) {
      databaseItems = orderData.order_items;
    } else if (Array.isArray(orderData.purchaseOrderItems)) {
      databaseItems = orderData.purchaseOrderItems;
    } else if (Array.isArray(orderData.products)) {
      databaseItems = orderData.products;
    } else if (Array.isArray(orderData.details)) {
      databaseItems = orderData.details;
    }

    if (databaseItems.length > 0) {
      const populatedItems: OrderItem[] = databaseItems.map(item => {
        const qty = item.quantity ?? item.qty ?? '';
        const rate =
          item.purchase_price ??
          item.purchasePrice ??
          item.rate ??
          '';

        const prodName =
          item.product_name ||
          item.product ||
          item.name ||
          '';

        let prodId =
          item.product_id ||
          item.productId ||
          null;

        let hsnVal =
          item.hsn_code ||
          item.hsn ||
          item.sku ||
          '';

        // Auto-match product details if missing
        if (!prodId && prodName) {
          const matched = products.find(
            p =>
              p.name.toLowerCase().trim() ===
              String(prodName).toLowerCase().trim(),
          );
          if (matched) {
            prodId = matched.id;
            if (!hsnVal) hsnVal = matched.hsn;
          }
        }

        let discountPercent = '';
        if (
          item.discount_percent !== undefined &&
          item.discount_percent !== null &&
          String(item.discount_percent).trim() !== ''
        ) {
          discountPercent = String(Number(item.discount_percent));
        } else if (
          item.discount !== undefined &&
          item.discount !== null &&
          String(item.discount).trim() !== ''
        ) {
          const numQty = Number(qty) || 0;
          const numRate = Number(rate) || 0;
          const itemSubtotal = numQty * numRate;
          const discountAmount = Number(item.discount);

          if (itemSubtotal > 0 && discountAmount > 0) {
            const calculatedPercent =
              (discountAmount / itemSubtotal) * 100;
            discountPercent = String(
              parseFloat(calculatedPercent.toFixed(2)),
            );
          } else if (
            discountAmount > 0 &&
            discountAmount <= 100
          ) {
            discountPercent = String(discountAmount);
          }
        }

        return {
          id: item.id,
          productId: prodId ? String(prodId) : null,
          product: String(prodName),
          quantity: qty === '' ? '' : String(qty),
          rate: rate === '' ? '' : String(rate),
          hsn: String(hsnVal),
          discount: discountPercent,
        };
      });

      setItems(populatedItems.length > 0 ? populatedItems : [createEmptyItem()]);
    } else if (orderData.product_name || orderData.product) {
      // Single item fallback
      const prodName =
        orderData.product_name ||
        orderData.product ||
        '';

      const qty =
        orderData.quantity ?? orderData.qty ?? '';

      const rate =
        orderData.purchase_price ??
        orderData.purchasePrice ??
        orderData.rate ??
        '';

      let prodId =
        orderData.product_id || orderData.productId || null;

      let hsnVal =
        orderData.hsn_code ||
        orderData.hsn ||
        orderData.sku ||
        '';

      if (!prodId && prodName) {
        const matched = products.find(
          p =>
            p.name.toLowerCase().trim() ===
            String(prodName).toLowerCase().trim(),
        );
        if (matched) {
          prodId = matched.id;
          if (!hsnVal) hsnVal = matched.hsn;
        }
      }

      setItems([
        {
          productId: prodId ? String(prodId) : null,
          product: String(prodName),
          quantity: qty === '' ? '' : String(qty),
          rate: rate === '' ? '' : String(rate),
          hsn: String(hsnVal),
          discount: '',
        },
      ]);
    } else {
      setItems([createEmptyItem()]);
    }
  };

  // =========================================================
  // LOAD PURCHASE ORDER FROM DATABASE
  // =========================================================

  useEffect(() => {
    const loadPurchaseOrder = async () => {
      const orderIdToLoad =
        params.purchaseOrderId ||
        editPurchaseOrder?.id ||
        editPurchaseOrder?.purchase_order_id;

      if (editPurchaseOrder) {
        // Prepopulate immediately from passed params for instant UI
        populatePurchaseOrderFields(editPurchaseOrder);
      }

      if (!orderIdToLoad || !isEditing) {
        if (!isEditing) {
          // ADD MODE reset (Keep single blank row)
          setPONumber(`PO-${Date.now()}`);
          setPODate(formatDate(new Date()));
          setSelectedPODate(new Date());
          setDeliveryDate('');
          setStatus('Draft');
          setSupplier('');
          setSupplierId(null);
          setSupplierPhone('');
          setSupplierEmail('');
          setSupplierGSTIN('');
          setSupplierAddress('');
          setOrderNumber('');
          setPaymentMode('');
          setSelectedFile(null);
          setItems([createEmptyItem()]);
        }
        return;
      }

      // Fetch full details and items from database
      try {
        setLoadingPurchaseOrder(true);
        console.log(
          'FETCHING FULL PURCHASE ORDER DETAILS FROM DB FOR ID:',
          orderIdToLoad,
        );

        const response = await purchaseOrderAPI.getPurchaseOrderById(
          orderIdToLoad,
        );

        console.log(
          'GET PURCHASE ORDER BY ID RESPONSE:',
          JSON.stringify(response, null, 2),
        );

        const dbOrder =
          response?.purchaseOrder ||
          response?.order ||
          response?.data ||
          response;

        if (dbOrder) {
          populatePurchaseOrderFields(dbOrder);
        }
      } catch (error: any) {
        console.log('LOAD PURCHASE ORDER BY ID ERROR:', error);
      } finally {
        setLoadingPurchaseOrder(false);
      }
    };

    loadPurchaseOrder();
  }, [params.purchaseOrderId, params.mode]);

  // =========================================================
  // MODAL HANDLERS
  // =========================================================

  const openAddModal = () => {
    // If table currently has only 1 blank row, reuse that index
    if (items.length === 1 && isItemBlank(items[0])) {
      setEditingIndex(0);
    } else {
      setEditingIndex(null); // Will append a new row
    }
    setModalProduct('');
    setModalProductId(null);
    setModalQuantity('1');
    setModalRate('');
    setModalDiscount('0');
    setModalHsn('');
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const openEditModal = (index: number) => {
    const item = items[index];
    if (!item) return;

    setEditingIndex(index);
    setModalProduct(item.product || '');
    setModalProductId(item.productId || null);
    setModalQuantity(item.quantity ? String(item.quantity) : '1');
    setModalRate(item.rate ? String(item.rate) : '');
    setModalDiscount(item.discount ? String(item.discount) : '0');
    setModalHsn(item.hsn ? String(item.hsn) : '');
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  const handleSelectModalProduct = (catalogItem: CatalogProduct) => {
    setModalProduct(catalogItem.name);
    setModalProductId(catalogItem.id);
    setModalHsn(catalogItem.hsn || '');

    if (catalogItem.rate && !modalRate) {
      setModalRate(String(catalogItem.rate));
    }
    if (
      catalogItem.discount !== undefined &&
      (!modalDiscount || modalDiscount === '0')
    ) {
      setModalDiscount(String(catalogItem.discount));
    }

    setModalProductDropdownOpen(false);
  };

  const handleSaveModalItem = () => {
    if (!modalProduct.trim()) {
      Alert.alert('Validation Error', 'Please enter or select a product name.');
      return;
    }

    const qty = Number(modalQuantity);
    if (!modalQuantity || isNaN(qty) || qty <= 0) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid quantity greater than 0.',
      );
      return;
    }

    const rate = Number(modalRate);
    if (!modalRate || isNaN(rate) || rate <= 0) {
      Alert.alert(
        'Validation Error',
        'Please enter a valid rate greater than 0.',
      );
      return;
    }

    const discount = Number(modalDiscount || 0);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      Alert.alert('Validation Error', 'Discount must be between 0% and 100%.');
      return;
    }

    let resolvedHsn = modalHsn.trim();
    if (!resolvedHsn) {
      const match = products.find(
        p => p.name.toLowerCase().trim() === modalProduct.toLowerCase().trim(),
      );
      if (match?.hsn) {
        resolvedHsn = match.hsn;
      }
    }

    const newItemData: OrderItem = {
      id: editingIndex !== null ? items[editingIndex]?.id : undefined,
      productId: modalProductId,
      product: modalProduct.trim(),
      quantity: modalQuantity.trim(),
      rate: modalRate.trim(),
      discount: modalDiscount.trim() || '0',
      hsn: resolvedHsn,
    };

    if (editingIndex !== null) {
      // Update existing item at index
      setItems(prev =>
        prev.map((item, idx) =>
          idx === editingIndex ? {...item, ...newItemData} : item,
        ),
      );
    } else {
      // Add new row: if there was only 1 blank item, replace it
      setItems(prev => {
        if (prev.length === 1 && isItemBlank(prev[0])) {
          return [newItemData];
        }
        return [...prev, newItemData];
      });
    }

    setModalVisible(false);
  };

  const handleDeleteItem = (index: number) => {
    const item = items[index];
    const itemName = item?.product || `Row ${index + 1}`;

    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${itemName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(prev => {
              const filtered = prev.filter((_, idx) => idx !== index);
              // If all rows were removed, reset to one blank row
              return filtered.length > 0 ? filtered : [createEmptyItem()];
            });
          },
        },
      ],
    );
  };

  // =========================================================
  // CALCULATIONS
  // =========================================================

  const calculateItemTotal = (item: OrderItem) => {
    const qty = numberValue(item.quantity);
    const rate = numberValue(item.rate);
    const discount = numberValue(item.discount);

    const subtotal = qty * rate;
    const discountAmount = (subtotal * discount) / 100;

    return Math.max(0, subtotal - discountAmount);
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      const qty = numberValue(item.quantity);
      const rate = numberValue(item.rate);
      return total + qty * rate;
    }, 0);
  };

  const calculateTotalDiscount = () => {
    return items.reduce((total, item) => {
      const qty = numberValue(item.quantity);
      const rate = numberValue(item.rate);
      const discount = numberValue(item.discount);

      const subtotal = qty * rate;
      return total + (subtotal * discount) / 100;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return items.reduce(
      (total, item) => total + calculateItemTotal(item),
      0,
    );
  };

  // =========================================================
  // SELECT DOCUMENT
  // =========================================================

  const selectDocument = async () => {
    try {
      const result = await pick({
        type: [
          types.pdf,
          types.doc,
          types.docx,
        ],
      });

      if (result && result.length > 0) {
        setSelectedFile(result[0]);
      }
    } catch (error) {
      console.log('Document selection cancelled:', error);
    }
  };

  // =========================================================
  // SAVING
  // =========================================================

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!PONumber.trim()) {
      Alert.alert('Validation Error', 'Please enter PO Number.');
      return;
    }

    if (!PODate) {
      Alert.alert('Validation Error', 'Please select PO Date.');
      return;
    }

    if (!Supplier.trim()) {
      Alert.alert('Validation Error', 'Please select Supplier.');
      return;
    }

    // Filter out blank rows
    const validItems = items.filter(
      item => item.product.trim() && Number(item.quantity) > 0 && Number(item.rate) > 0,
    );

    if (validItems.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one product by clicking on the table row or "+ Add Product".',
      );
      return;
    }

    for (let index = 0; index < validItems.length; index++) {
      const item = validItems[index];

      const discount = Number(item.discount || 0);
      if (discount < 0 || discount > 100) {
        Alert.alert(
          'Validation Error',
          `Discount for ${item.product} must be between 0 and 100%.`,
        );
        return;
      }
    }

    const subtotal = validItems.reduce(
      (acc, item) => acc + numberValue(item.quantity) * numberValue(item.rate),
      0,
    );

    const discountAmount = validItems.reduce((acc, item) => {
      const st = numberValue(item.quantity) * numberValue(item.rate);
      return acc + (st * numberValue(item.discount)) / 100;
    }, 0);

    const taxableAmount = Math.max(0, subtotal - discountAmount);

    const targetId =
      currentPurchaseOrderId ||
      params.purchaseOrderId ||
      editPurchaseOrder?.id ||
      editPurchaseOrder?.purchase_order_id;

    // =====================================================
    // DATABASE ITEMS
    // =====================================================

    const formattedItems = validItems.map(item => {
      const qty = numberValue(item.quantity);
      const rateValue = numberValue(item.rate);
      const discountPercent = numberValue(item.discount);

      const itemSubtotal = qty * rateValue;
      const itemDiscount = (itemSubtotal * discountPercent) / 100;
      const itemTotal = Math.max(0, itemSubtotal - itemDiscount);

      return {
        id: item.id ? Number(item.id) : undefined,
        purchase_order_id: targetId ? Number(targetId) : undefined,
        product_id: item.productId ? Number(item.productId) : undefined,
        product: item.product.trim(),
        product_name: item.product.trim(),
        quantity: qty,
        purchase_price: rateValue,
        rate: rateValue,
        hsn: (item.hsn || '').trim(),
        hsn_code: (item.hsn || '').trim(),
        discount: Number(itemDiscount.toFixed(2)),
        discount_percent: Number(discountPercent.toFixed(2)),
        tax_rate: 0,
        tax_amount: 0,
        total_amount: Number(itemTotal.toFixed(2)),
      };
    });

    // =====================================================
    // PURCHASE ORDER PAYLOAD
    // =====================================================

    const purchaseOrderPayload = {
      id: targetId ? Number(targetId) : undefined,
      purchase_order_id: targetId ? Number(targetId) : undefined,

      purchase_order_no: PONumber.trim(),
      po_number: PONumber.trim(),
      po_no: PONumber.trim(),

      // SUPPLIER
      supplier_id: supplierId ? Number(supplierId) : undefined,
      supplier: Supplier.trim(),
      supplier_name: Supplier.trim(),
      supplier_phone: supplierPhone.trim(),
      phone_number: supplierPhone.trim(),
      supplier_email: supplierEmail.trim(),
      email_address: supplierEmail.trim(),
      supplier_gstin: supplierGSTIN.trim(),
      gstin: supplierGSTIN.trim(),
      tax_id: supplierGSTIN.trim(),
      supplier_address: supplierAddress.trim(),
      address: supplierAddress.trim(),

      order_number: orderNumber.trim(),
      invoice_number: orderNumber.trim(),
      bill_number: orderNumber.trim(),

      // DATES
      po_date: convertToMySQLDate(PODate),
      purchase_date: convertToMySQLDate(PODate),
      expected_date: DeliveryDate ? convertToMySQLDate(DeliveryDate) : null,
      delivery_date: DeliveryDate ? convertToMySQLDate(DeliveryDate) : null,

      // STATUS
      status: status || 'Draft',
      payment_method: paymentMode || null,

      // TOTALS
      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      taxable_amount: Number(taxableAmount.toFixed(2)),
      tax_amount: 0,
      total_amount: Number(taxableAmount.toFixed(2)),

      document_name:
        selectedFile?.name ||
        editPurchaseOrder?.document_name ||
        null,

      // ITEMS
      items: formattedItems,
      purchase_order_items: formattedItems,
      order_items: formattedItems,
      purchaseOrderItems: formattedItems,
      products: formattedItems,
    };

    console.log(
      'PURCHASE ORDER PAYLOAD:',
      JSON.stringify(purchaseOrderPayload, null, 2),
    );

    // =====================================================
    // API
    // =====================================================

    try {
      setSaving(true);
      let response;

      if (isEditing && targetId) {
        response = await purchaseOrderAPI.updatePurchaseOrder(
          targetId,
          purchaseOrderPayload,
        );
      } else {
        response = await purchaseOrderAPI.createPurchaseOrder(
          purchaseOrderPayload,
        );
      }

      console.log(
        'PURCHASE ORDER RESPONSE:',
        JSON.stringify(response, null, 2),
      );

      Alert.alert(
        'Success',
        isEditing
          ? 'Purchase Order updated successfully.'
          : 'Purchase Order created successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (error: any) {
      console.log('PURCHASE ORDER ERROR:', error);
      Alert.alert(
        'Error',
        error?.message || 'Unable to save Purchase Order.',
      );
    } finally {
      setSaving(false);
    }
  };

  // Live calculation for the modal
  const modalSubtotalNum =
    (Number(modalQuantity) || 0) * (Number(modalRate) || 0);
  const modalDiscountAmtNum =
    (modalSubtotalNum * (Number(modalDiscount) || 0)) / 100;
  const modalLineTotalNum = Math.max(0, modalSubtotalNum - modalDiscountAmtNum);

  const filteredModalProducts = products.filter(p =>
    p.name.toLowerCase().includes(modalProduct.toLowerCase()),
  );

  const filledItemsCount = items.filter(i => i.product.trim()).length;

  // =========================================================
  // UI
  // =========================================================

  if (loadingPurchaseOrder) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#4338ca" />
        <Text style={styles.loadingText}>Loading purchase order data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* FIXED HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.arrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          {isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'}
        </Text>
      </View>

      {/* SCROLLABLE BODY */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ================================================= */}
        {/* PURCHASE INFORMATION */}
        {/* ================================================= */}

        <Text style={styles.sectionHeader}>Purchase Information</Text>

        <Text style={styles.label}>PO Number *</Text>
        <TextInput
          style={styles.input}
          value={PONumber}
          onChangeText={setPONumber}
          placeholder="Enter PO number"
          placeholderTextColor="#999"
        />

        {/* PO DATE & EXPECTED DELIVERY DATE IN ONE ROW */}
        <View style={styles.row}>
          <View style={styles.half}>
            <Text style={styles.rowLabel}>PO Date *</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowPODatePicker(true)}>
              <TextInput
                style={styles.dateInput}
                value={PODate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
                editable={false}
                pointerEvents="none"
              />
              <Text style={styles.calendarIcon}>🗓</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.half}>
            <Text style={styles.rowLabel}>Expected Delivery Date</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setShowDeliveryDatePicker(true)}>
              <TextInput
                style={styles.dateInput}
                value={DeliveryDate}
                placeholder="DD/MM/YYYY"
                placeholderTextColor="#999"
                editable={false}
                pointerEvents="none"
              />
              <Text style={styles.calendarIcon}>🗓</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showPODatePicker && (
          <DateTimePicker
            value={selectedPODate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, date) => {
              setShowPODatePicker(false);
              if (date) {
                setSelectedPODate(date);
                setPODate(formatDate(date));
              }
            }}
          />
        )}

        {showDeliveryDatePicker && (
          <DateTimePicker
            value={selectedDeliveryDate}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            minimumDate={selectedPODate}
            onChange={(event, date) => {
              setShowDeliveryDatePicker(false);
              if (date) {
                setSelectedDeliveryDate(date);
                setDeliveryDate(formatDate(date));
              }
            }}
          />
        )}

        {/* ================================================= */}
        {/* SUPPLIER INFORMATION */}
        {/* ================================================= */}

        <Text style={styles.sectionHeader}>Supplier Information</Text>

        {/* SUPPLIER NAME */}
        <Text style={styles.label}>Supplier Name *</Text>
        <View style={styles.supplierContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type supplier name..."
            placeholderTextColor="#999"
            value={Supplier}
            onFocus={() => setShowSupplierDropdown(true)}
            onChangeText={text => {
              setSupplier(text);
              if (!text.trim()) {
                setSupplierId(null);
                setSupplierPhone('');
                setSupplierEmail('');
                setSupplierGSTIN('');
                setSupplierAddress('');
              }
              setShowSupplierDropdown(true);
            }}
          />

          {showSupplierDropdown && (
            <View style={styles.supplierDropdown}>
              <ScrollView
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled">
                {suppliers
                  .filter(item => {
                    const q = Supplier.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      item.name.toLowerCase().includes(q) ||
                      (item.phone && item.phone.includes(q)) ||
                      (item.email && item.email.toLowerCase().includes(q))
                    );
                  })
                  .map(item => (
                    <TouchableOpacity
                      key={`supp-${item.id}`}
                      style={styles.supplierItem}
                      onPress={() => handleSupplierSelect(item)}>
                      <Text style={styles.supplierText}>{item.name}</Text>
                      {item.phone ? (
                        <Text style={styles.supplierSubText}>
                          {item.phone}
                          {item.city ? ` • ${item.city}` : ''}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                  ))}
                <TouchableOpacity
                  style={[styles.supplierItem, styles.addSupplierItem]}
                  onPress={() => {
                    setShowSupplierDropdown(false);
                    navigation.navigate('SupplierMaster', {
                      openAddModal: true,
                      returnTo: 'PurchaseOrder',
                    });
                  }}>
                  <Text style={styles.addSupplierText}>+ Add Supplier</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          )}
        </View>

        {/* PHONE NUMBER */}
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={supplierPhone}
          onChangeText={setSupplierPhone}
          placeholder="Enter supplier phone number"
          placeholderTextColor="#999"
          keyboardType="phone-pad"
        />

        {/* EMAIL */}
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={supplierEmail}
          onChangeText={setSupplierEmail}
          placeholder="Enter supplier email address"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* GSTIN */}
        <Text style={styles.label}>GSTIN / Tax ID</Text>
        <TextInput
          style={styles.input}
          value={supplierGSTIN}
          onChangeText={setSupplierGSTIN}
          placeholder="Enter GSTIN / Tax ID"
          placeholderTextColor="#999"
          autoCapitalize="characters"
        />

        {/* SUPPLIER ADDRESS */}
        <Text style={styles.label}>Supplier Address</Text>
        <TextInput
          style={styles.addressInput}
          value={supplierAddress}
          onChangeText={setSupplierAddress}
          placeholder="Enter supplier address"
          placeholderTextColor="#999"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />

        {/* ORDER NUMBER */}
        <Text style={styles.label}>Order Number</Text>
        <TextInput
          style={styles.input}
          value={orderNumber}
          onChangeText={setOrderNumber}
          placeholder="Enter order number"
          placeholderTextColor="#999"
        />

        {/* ================================================= */}
        {/* PRODUCT INFORMATION (TABLE VIEW) */}
        {/* ================================================= */}

        <View style={styles.sectionHeaderRow}>
          <View style={styles.sectionTitleWithBadge}>
            <Text style={styles.sectionHeader}>Product Information</Text>
            <View style={styles.itemBadge}>
              <Text style={styles.itemCountBadgeText}>
                {filledItemsCount} {filledItemsCount === 1 ? 'Item' : 'Items'}
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

        {/* HORIZONTALLY SCROLLABLE PRODUCT TABLE */}
        <View style={styles.tableCardContainer}>
          <View style={styles.tableCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              persistentScrollbar={true}
              nestedScrollEnabled>
              <View style={styles.tableInner}>
                {/* TABLE HEADER */}
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
                    <Text style={[styles.thText, styles.textCenter]}>Discount</Text>
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

                {/* TABLE ROWS */}
                {items.map((item, index) => {
                  const isBlank = isItemBlank(item);
                  const lineTotal = calculateItemTotal(item);
                  const isEven = index % 2 === 0;

                  return (
                    <TouchableOpacity
                      key={item.id ? `db-${item.id}` : `item-${index}`}
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
                          <Text style={styles.cellPlaceholderText}>
                            Select Product...
                          </Text>
                        ) : (
                          <Text style={styles.cellProductText} numberOfLines={2}>
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
                          {isBlank
                            ? '—'
                            : numberValue(item.rate).toFixed(0) ===
                              String(numberValue(item.rate))
                            ? numberValue(item.rate)
                            : numberValue(item.rate).toFixed(2)}
                        </Text>
                      </View>

                      {/* Discount */}
                      <View style={styles.colDiscount}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank
                            ? '—'
                            : item.discount && Number(item.discount) > 0
                            ? `${item.discount}%`
                            : '0%'}
                        </Text>
                      </View>

                      {/* HSN */}
                      <View style={styles.colHsn}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : item.hsn || '-'}
                        </Text>
                      </View>

                      {/* Total */}
                      <View style={styles.colTotal}>
                        <Text style={[styles.cellTotalText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : lineTotal.toFixed(2)}
                        </Text>
                      </View>

                      {/* Action (Dustbin Icon Only - Edit Removed) */}
                      <View style={styles.colAction}>
                        {(!isBlank || items.length > 1) ? (
                          <TouchableOpacity
                            onPress={() => handleDeleteItem(index)}
                            style={styles.deleteActionBtn}
                            activeOpacity={0.7}
                            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                            <DustbinIcon size={16} color="#dc2626" />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            {/* BLACK SHADOW AT BOTTOM OF SCROLL */}
            <View style={styles.scrollBottomShadow} />
          </View>
        </View>

        {/* ================================================= */}
        {/* PURCHASE SUMMARY */}
        {/* ================================================= */}

        <View style={styles.orderSummary}>
          <Text style={styles.summaryTitle}>Purchase Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              ₹ {calculateSubtotal().toFixed(2)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.discountValue}>
              - ₹ {calculateTotalDiscount().toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              ₹ {calculateGrandTotal().toFixed(2)}
            </Text>
          </View>
        </View>

        {/* ================================================= */}
        {/* PAYMENT INFORMATION */}
        {/* ================================================= */}

        <Text style={styles.sectionHeader}>Payment Information</Text>

        <Text style={styles.label}>Payment Mode</Text>
        <View style={styles.pickerBox}>
          <Picker
            selectedValue={paymentMode}
            onValueChange={(value: string) => setPaymentMode(value)}>
            <Picker.Item label="Select Payment Mode" value="" />
            <Picker.Item label="Cash" value="Cash" />
            <Picker.Item label="UPI" value="UPI" />
            <Picker.Item label="Card" value="Card" />
            <Picker.Item label="Cheque" value="Cheque" />
            <Picker.Item label="Bank Transfer" value="Bank Transfer" />
            <Picker.Item label="Credit" value="Credit" />
          </Picker>
        </View>

        {/* ================================================= */}
        {/* SUPPORTING DOCUMENT */}
        {/* ================================================= */}

        <Text style={styles.sectionHeader}>Supporting Document</Text>

        <Text style={styles.label}>Upload Document</Text>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={selectDocument}>
          <Text style={styles.uploadIcon}>📎</Text>
          <Text style={styles.uploadButtonText}>Upload PDF / Word File</Text>
        </TouchableOpacity>

        {selectedFile && (
          <View style={styles.fileBox}>
            <View style={styles.fileInfo}>
              <Text style={styles.fileIcon}>📄</Text>
              <Text style={styles.fileName} numberOfLines={1}>
                {selectedFile.name}
              </Text>
            </View>

            <TouchableOpacity onPress={() => setSelectedFile(null)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.supportText}>
          Supported formats: PDF, DOC, DOCX
        </Text>

        {/* ================================================= */}
        {/* SAVE / UPDATE BUTTON */}
        {/* ================================================= */}

        <TouchableOpacity
          style={[styles.saveButton, saving && {opacity: 0.7}]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Purchase Order' : 'Save Purchase Order'}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ================================================= */}
      {/* ADD / EDIT PRODUCT MODAL POPUP */}
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
                  {editingIndex !== null && !isItemBlank(items[editingIndex] || createEmptyItem())
                    ? 'Edit Item'
                    : 'Add Item'}
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
                          filteredModalProducts.map(catalogItem => (
                            <TouchableOpacity
                              key={catalogItem.id}
                              style={styles.modalDropdownItem}
                              onPress={() =>
                                handleSelectModalProduct(catalogItem)
                              }>
                              <Text style={styles.modalDropdownText}>
                                {catalogItem.name}
                              </Text>
                              <Text style={styles.modalDropdownSub}>
                                HSN: {catalogItem.hsn} | Rate: ₹
                                {catalogItem.rate || 0}
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
                    <Text style={styles.modalFieldLabel}>Rate (₹) *</Text>
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

                {/* ESTIMATED TOTAL */}
                <View style={{marginTop: 6}}>
                  <Text style={styles.modalFieldLabel}>Estimated Total</Text>
                  <View style={styles.modalTotalPreviewBox}>
                    <Text style={styles.modalTotalPreviewValue}>
                      ₹ {modalLineTotalNum.toFixed(2)}
                    </Text>
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
                    <Text style={styles.modalCalcLabel}>
                      Discount ({modalDiscount || 0}%):
                    </Text>
                    <Text style={styles.modalCalcDiscount}>
                      - ₹ {modalDiscountAmtNum.toFixed(2)}
                    </Text>
                  </View>
                  <View style={[styles.modalCalcRow, styles.modalCalcTotalRow]}>
                    <Text style={styles.modalCalcTotalLabel}>Line Total:</Text>
                    <Text style={styles.modalCalcTotalVal}>
                      ₹ {modalLineTotalNum.toFixed(2)}
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
                    {editingIndex !== null && !isItemBlank(items[editingIndex] || createEmptyItem())
                      ? 'Update Item'
                      : 'Add Item'}
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

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  scrollContent: {
    flex: 1,
  },

  scrollContentContainer: {
    paddingBottom: 30,
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
  },

  arrow: {
    color: '#ffffff',
    fontSize: 30,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 8,
  },

  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sectionHeader: {
    marginLeft:8,
    padding:8,
    fontSize: 16,
    fontWeight: '700',
    color: '#4338ca',
  },

  itemBadge: {
    backgroundColor: '#e0e7ff',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginLeft: 8,
  },

  itemCountBadgeText: {
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

  label: {
    fontSize: 14,
    marginTop: 14,
    marginBottom: 6,
    marginHorizontal: 16,
    color: '#333333',
    fontWeight: '600',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginTop: 14,
  },

  half: {
    width: '48.5%',
  },

  rowLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333333',
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#111827',
  },

  addressInput: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginHorizontal: 16,
    fontSize: 14,
    backgroundColor: '#ffffff',
    color: '#111827',
    minHeight: 80,
  },

  dateInputContainer: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    height: 48,
  },

  dateInput: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333333',
  },

  calendarIcon: {
    fontSize: 18,
    marginRight: 10,
  },

  supplierContainer: {
    position: 'relative',
    zIndex: 5000,
  },

  supplierDropdown: {
    position: 'absolute',
    top: 48,
    left: 16,
    right: 16,
    maxHeight: 200,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    elevation: 10,
    zIndex: 5000,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  supplierItem: {
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  supplierText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '600',
  },

  supplierSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  addSupplierItem: {
    backgroundColor: '#eef2ff',
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
  },

  addSupplierText: {
    fontSize: 14,
    color: '#4338ca',
    fontWeight: '700',
  },

  pickerBox: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    marginHorizontal: 16,
    height: 50,
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: '#ffffff',
  },

  // =========================================================
  // TABLE STYLES (HORIZONTALLY SCROLLABLE)
  // =========================================================

  tableCardContainer: {
    marginHorizontal: 16,
    marginTop: 6,
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
    borderColor: '#e2e8f0',
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
    minWidth: 540,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#4338ca',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#3730a3',
  },

  thText: {
    color: '#ffffff',
    fontSize: 12.5,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  rowEven: {
    backgroundColor: '#ffffff',
  },

  rowOdd: {
    backgroundColor: '#f8fafc',
  },

  blankRow: {
    backgroundColor: '#fafafa',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  colProduct: {
    width: 120,
    paddingLeft: 4,
    justifyContent: 'center',
  },

  colQty: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colRate: {
    width: 75,
    alignItems: 'flex-end',
    paddingRight: 8,
    justifyContent: 'center',
  },

  colDiscount: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colHsn: {
    width: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colTotal: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 8,
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

  cellPlaceholderText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
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

  cellMuted: {
    color: '#94a3b8',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
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

  // =========================================================
  // SUMMARY BOX
  // =========================================================

  orderSummary: {
    marginHorizontal: 16,
    marginTop: 15,
    padding: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4338ca',
    marginBottom: 8,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },

  summaryLabel: {
    fontSize: 13,
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

  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },

  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4338ca',
  },

  uploadButton: {
    borderWidth: 1,
    borderColor: '#4338ca',
    borderRadius: 5,
    marginHorizontal: 16,
    marginTop: 5,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },

  uploadIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  uploadButtonText: {
    color: '#4338ca',
    fontSize: 15,
    fontWeight: '600',
  },

  fileBox: {
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  fileInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },

  fileIcon: {
    fontSize: 20,
    marginRight: 8,
  },

  fileName: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
  },

  removeText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },

  supportText: {
    marginHorizontal: 16,
    marginTop: 6,
    fontSize: 12,
    color: '#777777',
  },

  saveButton: {
    backgroundColor: '#4338ca',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 13,
    borderRadius: 5,
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#4338ca',
    fontWeight: '600',
  },

  // =========================================================
  // ADD / EDIT PRODUCT MODAL
  // =========================================================

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
    gap: 10,
    backgroundColor: '#ffffff',
  },

  modalCancelBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },

  modalCancelText: {
    fontSize: 13.5,
    fontWeight: '600',
    color: '#475569',
  },

  modalSaveBtn: {
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#4338ca',
  },

  modalSaveText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default PurchaseOrderScreen;