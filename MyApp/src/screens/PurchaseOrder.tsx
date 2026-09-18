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
  SafeAreaView,
  Dimensions,
} from 'react-native';
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
  taxRate: string;
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
  taxRate: '0',
});

const isItemBlank = (item: OrderItem): boolean => {
  return (
    !item.product.trim() &&
    !item.quantity.trim() &&
    !item.rate.trim()
  );
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

      setSuppliers(prev => {
        if (!prev.some(s => String(s.id) === String(newSupp.id) || s.name === name)) {
          return [newSupp, ...prev];
        }
        return prev;
      });
    }
  }, [route?.params?.newSupplier]);

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

  // =========================================================
  // MULTIPLE PRODUCT ITEMS
  // =========================================================
  const [items, setItems] = useState<OrderItem[]>(Array.from({length: 5}, createEmptyItem));

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
  const [modalTaxRate, setModalTaxRate] = useState('0');
  const [modalProductDropdownOpen, setModalProductDropdownOpen] = useState(false);

  // =========================================================
  // PAYMENT & DOCUMENT
  // =========================================================
  const [paymentMode, setPaymentMode] = useState(
    editPurchaseOrder?.payment_method || '',
  );

  const [selectedFile, setSelectedFile] = useState<any>(
    editPurchaseOrder?.document_name
      ? {
          name: editPurchaseOrder.document_name,
        }
      : null,
  );

  const numberValue = (value: any, fallback = 0): number => {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  };

  const populatePurchaseOrderFields = (orderData: any) => {
    if (!orderData) return;

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
          taxRate: String(item.tax_rate ?? item.taxRate ?? '0'),
        };
      });

      const padded = [...populatedItems];
      while (padded.length < 5) padded.push(createEmptyItem());
      setItems(padded);
    } else if (orderData.product_name || orderData.product) {
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
          taxRate: String(orderData.tax_rate ?? '0'),
        },
      ]);
      setItems(prev => {
        const padded = [...prev];
        while (padded.length < 5) padded.push(createEmptyItem());
        return padded;
      });
    } else {
      setItems(Array.from({length: 5}, createEmptyItem));
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
        populatePurchaseOrderFields(editPurchaseOrder);
      }

      if (!orderIdToLoad || !isEditing) {
        if (!isEditing) {
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
          setItems(Array.from({length: 5}, createEmptyItem));
        }
        return;
      }

      try {
        setLoadingPurchaseOrder(true);
        const response = await purchaseOrderAPI.getPurchaseOrderById(
          orderIdToLoad,
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
    setModalTaxRate('0');
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
    setModalTaxRate(item.taxRate ? String(item.taxRate) : '0');
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
      taxRate: modalTaxRate.trim() || '0',
    };

    if (editingIndex !== null) {
      setItems(prev =>
        prev.map((item, idx) =>
          idx === editingIndex ? {...item, ...newItemData} : item,
        ),
      );
    } else {
      setItems(prev => {
        const firstBlankIndex = prev.findIndex(isItemBlank);
        if (firstBlankIndex !== -1) {
          return prev.map((item, idx) =>
            idx === firstBlankIndex ? {...item, ...newItemData} : item,
          );
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
              const updated = [...filtered];
              while (updated.length < 5) {
                updated.push(createEmptyItem());
              }
              return updated;
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

  const calculateTaxableAmount = () => {
    return Math.max(0, calculateSubtotal() - calculateTotalDiscount());
  };

  const calculateGST = () => {
    return items.reduce((total, item) => {
      const qty = numberValue(item.quantity);
      const rate = numberValue(item.rate);
      const discount = numberValue(item.discount);
      const taxRate = numberValue(item.taxRate);
      const itemSubtotal = qty * rate;
      const itemDiscount = (itemSubtotal * discount) / 100;
      const taxable = Math.max(0, itemSubtotal - itemDiscount);
      return total + (taxable * taxRate) / 100;
    }, 0);
  };

  const calculateGrandTotal = () => {
    return calculateTaxableAmount() + calculateGST();
  };

  const selectDocument = async () => {
    try {
      const result = await pick({
        type: [types.pdf, types.doc, types.docx],
      });

      if (result && result.length > 0) {
        setSelectedFile(result[0]);
      }
    } catch (error) {
      console.log('Document selection cancelled:', error);
    }
  };

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

    const validItems = items.filter(
      item => item.product.trim() && Number(item.quantity) > 0 && Number(item.rate) > 0,
    );

    if (validItems.length === 0) {
      Alert.alert(
        'Validation Error',
        'Please add at least one product by clicking on the table row or "+ Add Item".',
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
    const gstAmount = validItems.reduce((acc, item) => {
      const st = numberValue(item.quantity) * numberValue(item.rate);
      const disc = (st * numberValue(item.discount)) / 100;
      const taxable = Math.max(0, st - disc);
      return acc + (taxable * numberValue(item.taxRate)) / 100;
    }, 0);
    const grandTotal = taxableAmount + gstAmount;

    const targetId =
      currentPurchaseOrderId ||
      params.purchaseOrderId ||
      editPurchaseOrder?.id ||
      editPurchaseOrder?.purchase_order_id;

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
        tax_rate: numberValue(item.taxRate),
        tax_amount: Number(((itemTotal * numberValue(item.taxRate)) / 100).toFixed(2)),
        total_amount: Number((itemTotal + (itemTotal * numberValue(item.taxRate)) / 100).toFixed(2)),
      };
    });

    const purchaseOrderPayload = {
      id: targetId ? Number(targetId) : undefined,
      purchase_order_id: targetId ? Number(targetId) : undefined,

      purchase_order_no: PONumber.trim(),
      po_number: PONumber.trim(),
      po_no: PONumber.trim(),

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

      po_date: convertToMySQLDate(PODate),
      purchase_date: convertToMySQLDate(PODate),
      expected_date: DeliveryDate ? convertToMySQLDate(DeliveryDate) : null,
      delivery_date: DeliveryDate ? convertToMySQLDate(DeliveryDate) : null,

      status: status || 'Draft',
      payment_method: paymentMode || null,

      subtotal: Number(subtotal.toFixed(2)),
      discount: Number(discountAmount.toFixed(2)),
      taxable_amount: Number(taxableAmount.toFixed(2)),
      tax_amount: Number(gstAmount.toFixed(2)),
      total_amount: Number(grandTotal.toFixed(2)),

      document_name:
        selectedFile?.name ||
        editPurchaseOrder?.document_name ||
        null,

      items: formattedItems,
      purchase_order_items: formattedItems,
      order_items: formattedItems,
      purchaseOrderItems: formattedItems,
      products: formattedItems,
    };

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

  const modalSubtotalNum =
    (Number(modalQuantity) || 0) * (Number(modalRate) || 0);
  const modalDiscountAmtNum =
    (modalSubtotalNum * (Number(modalDiscount) || 0)) / 100;
  const modalLineTotalNum = Math.max(0, modalSubtotalNum - modalDiscountAmtNum);
  const modalGSTNum = (modalLineTotalNum * (Number(modalTaxRate) || 0)) / 100;
  const modalGrandTotalNum = modalLineTotalNum + modalGSTNum;

  const filteredModalProducts = products.filter(p =>
    p.name.toLowerCase().includes(modalProduct.toLowerCase()),
  );

  const filledItemsCount = items.filter(i => i.product.trim()).length;

  if (loadingPurchaseOrder) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ea7e30" />
        <Text style={styles.loadingText}>Loading purchase order...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================= */}
      {/* 1. FIXED HEADER                                   */}
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
            {isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'}
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

        {/* ----------------- ORDER DETAILS CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Order Details</Text>

          <View style={styles.inputRow}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>PO Number *</Text>
              <TextInput
                style={styles.textInput}
                value={PONumber}
                onChangeText={setPONumber}
                placeholder="e.g. PO-1001"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>PO Date *</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => setShowPODatePicker(true)}
                activeOpacity={0.8}>
                <Text style={styles.datePickerText}>{PODate || 'Select Date'}</Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputRow, {marginTop: 12}]}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Expected Delivery Date</Text>
              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() => setShowDeliveryDatePicker(true)}
                activeOpacity={0.8}>
                <Text style={[styles.datePickerText, !DeliveryDate && {color: '#94a3b8'}]}>
                  {DeliveryDate || 'DD/MM/YYYY'}
                </Text>
                <Text style={styles.calendarIcon}>📅</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Status</Text>
              <TextInput
                style={styles.textInput}
                value={status}
                onChangeText={setStatus}
                placeholder="Draft / Pending"
                placeholderTextColor="#94a3b8"
              />
            </View>
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
            onChange={(event, date) => {
              setShowDeliveryDatePicker(false);
              if (date) {
                setSelectedDeliveryDate(date);
                setDeliveryDate(formatDate(date));
              }
            }}
          />
        )}

        {/* ----------------- SUPPLIER CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Supplier Information</Text>

          <Text style={styles.fieldLabel}>Supplier Name *</Text>
          <View style={styles.dropdownContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Search or enter supplier name..."
              placeholderTextColor="#94a3b8"
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
              <View style={styles.dropdownMenu}>
                <ScrollView
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                  style={{maxHeight: 180}}>
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
                        style={styles.dropdownMenuItem}
                        onPress={() => handleSupplierSelect(item)}>
                        <Text style={styles.dropdownMainText}>{item.name}</Text>
                        {item.phone ? (
                          <Text style={styles.dropdownSubText}>
                            {item.phone}
                            {item.city ? ` • ${item.city}` : ''}
                          </Text>
                        ) : null}
                      </TouchableOpacity>
                    ))}
                  <TouchableOpacity
                    style={[styles.dropdownMenuItem, styles.addSupplierRow]}
                    onPress={() => {
                      setShowSupplierDropdown(false);
                      navigation.navigate('SupplierMaster', {
                        openAddModal: true,
                        returnTo: 'PurchaseOrder',
                      });
                    }}>
                    <Text style={styles.addSupplierText}>+ Add New Supplier</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          <View style={[styles.inputRow, {marginTop: 12}]}>
            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={supplierPhone}
                onChangeText={setSupplierPhone}
                placeholder="Phone number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.halfInputCol}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={supplierEmail}
                onChangeText={setSupplierEmail}
                placeholder="Email address"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Text style={[styles.fieldLabel, {marginTop: 12}]}>GSTIN / Tax ID</Text>
          <TextInput
            style={styles.textInput}
            value={supplierGSTIN}
            onChangeText={setSupplierGSTIN}
            placeholder="Enter GSTIN / Tax ID"
            placeholderTextColor="#94a3b8"
            autoCapitalize="characters"
          />

          <Text style={[styles.fieldLabel, {marginTop: 12}]}>Supplier Address</Text>
          <TextInput
            style={styles.textAreaInput}
            value={supplierAddress}
            onChangeText={setSupplierAddress}
            placeholder="Enter supplier address"
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* ----------------- PRODUCT TABLE CARD ----------------- */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithBadge}>
              <Text style={styles.cardHeaderTitle}>Product Items</Text>
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
              <Text style={styles.addItemBtnText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.swipeHintRow}>
            <Text style={styles.swipeHintArrow}>➔</Text>
            <Text style={styles.swipeHintText}>Tap any row to edit</Text>
          </View>

          <View style={styles.tableCardWrapper}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled>
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
                  <View style={styles.colTotal}>
                    <Text style={[styles.thText, styles.textRight]}>TOTAL (₹)</Text>
                  </View>
                  <View style={styles.colAction}>
                    <Text style={[styles.thText, styles.textCenter]}>ACTION</Text>
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
                            + Select Product...
                          </Text>
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
                          {isBlank ? '—' : Number(item.rate || 0).toFixed(2)}
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

                      {/* GST % */}
                      <View style={styles.colGst}>
                        <Text style={[styles.cellCenterText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : `${item.taxRate || '0'}%`}
                        </Text>
                      </View>

                      {/* Total */}
                      <View style={styles.colTotal}>
                        <Text style={[styles.cellTotalText, isBlank && styles.cellMuted]}>
                          {isBlank ? '—' : `₹${lineTotal.toFixed(2)}`}
                        </Text>
                      </View>

                      {/* ACTIONS */}
                      <View style={styles.colAction}>
                        <View style={styles.actionButtonsRow}>
                          <TouchableOpacity
                            onPress={() => openEditModal(index)}
                            style={styles.actionIconBtn}
                            activeOpacity={0.7}
                            hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                            <PencilIcon size={14} color="#ea7e30" />
                          </TouchableOpacity>
                          {(!isBlank || items.length > 1) ? (
                            <TouchableOpacity
                              onPress={() => handleDeleteItem(index)}
                              style={styles.actionIconBtn}
                              activeOpacity={0.7}
                              hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                              <DustbinIcon size={14} color="#ef4444" />
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* ----------------- ORDER SUMMARY CARD ----------------- */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{calculateSubtotal().toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Discount</Text>
            <Text style={styles.discountValue}>- ₹{calculateTotalDiscount().toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Taxable Amount</Text>
            <Text style={styles.summaryValue}>₹{calculateTaxableAmount().toFixed(2)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST Amount</Text>
            <Text style={styles.summaryValue}>₹{calculateGST().toFixed(2)}</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>₹{calculateGrandTotal().toFixed(2)}</Text>
          </View>
        </View>

        {/* ----------------- ATTACHMENT CARD ----------------- */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Upload Order Document</Text>

          <TouchableOpacity
            style={styles.uploadBox}
            onPress={selectDocument}
            activeOpacity={0.7}>
            <Text style={styles.uploadIcon}>📎</Text>
            <Text style={styles.uploadBoxText}>Attach PDF or Word Document</Text>
            <Text style={styles.uploadSubText}>Max 10MB (PDF, DOC, DOCX)</Text>
          </TouchableOpacity>

          {selectedFile && (
            <View style={styles.attachedFileBox}>
              <View style={styles.attachedFileInfo}>
                <Text style={styles.attachedFileIcon}>📄</Text>
                <Text style={styles.attachedFileName} numberOfLines={1}>
                  {selectedFile.name}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedFile(null)}
                style={styles.removeFileBtn}>
                <Text style={styles.removeFileText}>✕ Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* ----------------- SUBMIT BUTTON ----------------- */}
        <TouchableOpacity
          style={[styles.saveButton, saving && {opacity: 0.7}]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}>
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Purchase Order' : 'Save Purchase Order'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={{height: 40}} />
      </ScrollView>

      {/* ================================================= */}
      {/* 3. ADD / EDIT PRODUCT MODAL POPUP                 */}
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
                    ? 'Edit Product Item'
                    : 'Add Product Item'}
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
                              Custom: "{modalProduct}"
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

                {/* DISCOUNT, HSN & GST ROW */}
                <View style={styles.modalRow}>
                  <View style={styles.modalThird}>
                    <Text style={styles.modalFieldLabel}>Discount (%)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalDiscount}
                      onChangeText={setModalDiscount}
                      placeholder="0"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View style={styles.modalThird}>
                    <Text style={styles.modalFieldLabel}>HSN Code</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalHsn}
                      onChangeText={setModalHsn}
                      placeholder="8471"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>

                  <View style={styles.modalThird}>
                    <Text style={styles.modalFieldLabel}>GST (%)</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={modalTaxRate}
                      onChangeText={setModalTaxRate}
                      placeholder="0"
                      placeholderTextColor="#94a3b8"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* CALCULATION SUMMARY PREVIEW */}
                <View style={styles.modalCalcCard}>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>Subtotal:</Text>
                    <Text style={styles.modalCalcVal}>
                      ₹{modalSubtotalNum.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>
                      Discount ({modalDiscount || 0}%):
                    </Text>
                    <Text style={styles.modalCalcDiscount}>
                      - ₹{modalDiscountAmtNum.toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.modalCalcRow}>
                    <Text style={styles.modalCalcLabel}>GST ({modalTaxRate || 0}%):</Text>
                    <Text style={styles.modalCalcVal}>₹{modalGSTNum.toFixed(2)}</Text>
                  </View>
                  <View style={[styles.modalCalcRow, styles.modalCalcTotalRow]}>
                    <Text style={styles.modalCalcTotalLabel}>Item Total:</Text>
                    <Text style={styles.modalCalcTotalVal}>₹{modalGrandTotalNum.toFixed(2)}</Text>
                  </View>
                </View>

                {/* ACTION BUTTONS */}
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
                    <Text style={styles.modalSaveBtnText}>Save Item</Text>
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

export default PurchaseOrderScreen;

// =====================================================
// STYLESHEET
// =====================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  loadingScreen: {
    flex: 1,
    backgroundColor: '#f8f9fb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
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

  calendarIcon: {
    fontSize: 16,
  },

  // ---- DROPDOWNS ----
  dropdownContainer: {
    position: 'relative',
    zIndex: 20,
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

  addSupplierRow: {
    backgroundColor: '#fff7ed',
  },

  addSupplierText: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#ea7e30',
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
    width: 75,
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

  // ---- ATTACHMENT BOX ----
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
  },

  uploadIcon: {
    fontSize: 22,
    marginBottom: 4,
  },

  uploadBoxText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },

  uploadSubText: {
    fontSize: 11.5,
    color: '#94a3b8',
    marginTop: 2,
  },

  attachedFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  attachedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },

  attachedFileIcon: {
    fontSize: 16,
    marginRight: 8,
  },

  attachedFileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
    flex: 1,
  },

  removeFileBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
  },

  removeFileText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#ef4444',
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

  modalDropdown: {
    position: 'absolute',
    top: 48,
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
    maxHeight: 140,
    zIndex: 60,
    overflow: 'hidden',
  },

  modalDropdownItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  modalDropdownText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0f172a',
  },

  modalDropdownSub: {
    fontSize: 11.5,
    color: '#64748b',
    marginTop: 2,
  },

  modalDropdownEmpty: {
    padding: 10,
    alignItems: 'center',
  },

  modalDropdownEmptyText: {
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },

  modalRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },

  modalHalf: {
    flex: 1,
  },

  modalThird: {
    flex: 1,
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