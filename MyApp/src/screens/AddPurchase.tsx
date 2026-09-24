import { Picker } from '@react-native-picker/picker';
import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
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
  phone?: string;
  state?: string;
  city?: string;
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

const createEmptyItem = (): PurchaseItem => ({
  productId: null,
  product: '',
  quantity: '',
  rate: '',
  discount: '0',
  hsn: '',
  gst: '0',
});

const isItemBlank = (item: PurchaseItem): boolean => {
  return (
    !item.product?.trim() &&
    !item.quantity?.trim() &&
    !item.rate?.trim()
  );
};

const defaultProducts: Product[] = [];

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

  if (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(value)
  ) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const date = new Date(value);

  if (!isNaN(date.getTime())) {
    return date;
  }

  return new Date();
};

const formatCurrency = (val: number): string => {
  const num = Number(val) || 0;

  try {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return num.toFixed(2);
  }
};

const formatTableNumber = (val: any): string => {
  const num = Number(val);

  if (!Number.isFinite(num)) {
    return '0';
  }

  return num % 1 === 0 ? String(num) : num.toFixed(2);
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

  const [purchaseId, setPurchaseId] = useState<
    string | number | null
  >(routePurchaseId);

  const [PurchaseNo, setPurchaseNo] = useState('');
  const [PurchaseDate, setPurchaseDate] = useState(getCurrentDate());

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date>(
    new Date(),
  );

  // =====================================================
  // SUPPLIER STATE
  // =====================================================

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);

  const [Supplier, setSupplier] = useState('');
  const [supplierId, setSupplierId] = useState<
    string | number | null
  >(null);
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierState, setSupplierState] = useState('');
  const [supplierCity, setSupplierCity] = useState('');

  const [showSuppliers, setShowSuppliers] = useState(false);

  // =====================================================
  // PRODUCTS STATE
  // =====================================================

  const [productsList, setProductsList] =
    useState<Product[]>(defaultProducts);

  // =====================================================
  // INVOICE STATE
  // =====================================================

  const [InvoiceNo, setInvoiceNo] = useState('');

  // =====================================================
  // ITEMS LIST
  // =====================================================

  const [items, setItems] = useState<PurchaseItem[]>(
    Array.from({length: 5}, createEmptyItem),
  );

  // =====================================================
  // MODAL STATE
  // =====================================================

  const [modalVisible, setModalVisible] = useState(false);

  const [editingIndex, setEditingIndex] =
    useState<number | null>(null);

  const [modalProduct, setModalProduct] = useState('');
  const [modalProductId, setModalProductId] = useState<
    string | number | null
  >(null);

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
  // LOADING / SAVING
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
  // LOAD SUPPLIERS
  // =====================================================

  const loadSuppliersFromDB = async () => {
    try {
      setLoadingSuppliers(true);

      const response = await fetch(
        `${API_BASE_URL}/api/suppliers`,
      );

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
        id: String(
          item.id ??
            item.supplier_id ??
            item.supplierId,
        ),
        name:
          item.name ??
          item.supplier_name ??
          item.supplierName ??
          '',
        phone:
          item.phone ??
          item.mobile ??
          item.phone_number ??
          '',
        state: item.state ?? '',
        city: item.city ?? item.district ?? '',
      }));

      setSuppliers(formatted);
    } catch (error) {
      console.log(
        'Error fetching suppliers from DB in AddPurchase:',
        error,
      );
    } finally {
      setLoadingSuppliers(false);
    }
  };

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  const loadProductsFromDB = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/products`,
      );

      if (!response.ok) {
        return;
      }

      const result = await response.json();

      let list: any[] = [];

      if (Array.isArray(result)) {
        list = result;
      } else if (Array.isArray(result?.data)) {
        list = result.data;
      } else if (Array.isArray(result?.products)) {
        list = result.products;
      }

      if (list.length > 0) {
        const fetchedProducts: Product[] = list.map(item => ({
          id: String(
            item.id ?? item.product_id,
          ),
          name:
            item.name ??
            item.product_name ??
            '',
          hsn: String(
            item.hsn ??
              item.hsn_code ??
              '',
          ),
          rate:
            item.purchase_price ??
            item.price ??
            item.rate,
          discount:
            item.discount ?? 0,
          gst:
            item.gst ??
            item.tax_rate ??
            item.gst_percent ??
            0,
        }));

        const map = new Map<string, Product>();

        fetchedProducts.forEach(p => {
          map.set(
            p.name.toLowerCase().trim(),
            p,
          );
        });

        setProductsList(
          Array.from(map.values()),
        );
      } else {
        setProductsList([]);
      }
    } catch (error) {
      setProductsList([]);
    }
  };

  useEffect(() => {
    loadSuppliersFromDB();
    loadProductsFromDB();

    const unsubscribe =
      navigation?.addListener?.('focus', () => {
        loadSuppliersFromDB();
        loadProductsFromDB();
      });

    return unsubscribe;
  }, [navigation]);

  // =====================================================
  // NEW SUPPLIER
  // =====================================================

  useEffect(() => {
    if (route?.params?.newSupplier) {
      const newSupp = route.params.newSupplier;

      const suppName =
        newSupp.name ||
        newSupp.supplier_name ||
        '';

      setSupplier(suppName);
      setSupplierId(newSupp.id ?? null);
      setSupplierName(suppName);
      setSupplierPhone(newSupp.phone || newSupp.mobile || '');
      setSupplierState(newSupp.state || '');
      setSupplierCity(newSupp.city || '');

      setSuppliers(prev => {
        if (
          !prev.some(
            s =>
              String(s.id) ===
                String(newSupp.id) ||
              s.name === suppName,
          )
        ) {
          return [
            {
              id: String(newSupp.id),
              name: suppName,
            },
            ...prev,
          ];
        }

        return prev;
      });
    }
  }, [route?.params?.newSupplier]);

  // =====================================================
  // ITEM CALCULATION
  // =====================================================

  const calculateItem = (item: PurchaseItem) => {
    const quantity = numberValue(item.quantity);
    const rate = numberValue(item.rate);
    const gstPercent = numberValue(item.gst);
    const discountPercent = numberValue(
      item.discount,
    );

    const subtotal = quantity * rate;

    const discountAmount =
      (subtotal * discountPercent) / 100;

    const taxableAmount = Math.max(
      0,
      subtotal - discountAmount,
    );

    const gstAmount =
      (taxableAmount * gstPercent) / 100;

    const totalAmount =
      taxableAmount + gstAmount;

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
      if (isItemBlank(item)) {
        return;
      }

      const calculation =
        calculateItem(item);

      subtotal += calculation.subtotal;
      discountAmount +=
        calculation.discountAmount;
      taxableAmount +=
        calculation.taxableAmount;
      gstAmount +=
        calculation.gstAmount;
      grandTotal +=
        calculation.totalAmount;
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
  // OPEN ADD MODAL
  // =====================================================

  const openAddModal = () => {
    const firstBlankIndex =
      items.findIndex(isItemBlank);

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
    setModalGst('0');
    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  // =====================================================
  // OPEN EDIT MODAL
  // =====================================================

  const openEditModal = (index: number) => {
    const item = items[index];

    if (!item) {
      return;
    }

    setEditingIndex(index);
    setModalProduct(item.product || '');
    setModalProductId(
      item.productId ?? null,
    );
    setModalQuantity(
      item.quantity
        ? String(item.quantity)
        : '1',
    );
    setModalRate(
      item.rate
        ? String(item.rate)
        : '',
    );
    setModalDiscount(
      item.discount
        ? String(item.discount)
        : '0',
    );
    setModalHsn(
      item.hsn
        ? String(item.hsn)
        : '',
    );
    setModalGst(
      item.gst
        ? String(item.gst)
        : '0',
    );

    setModalProductDropdownOpen(false);
    setModalVisible(true);
  };

  // =====================================================
  // SELECT PRODUCT
  // =====================================================

  const handleSelectModalProduct = (
    prod: Product,
  ) => {
    setModalProduct(prod.name);
    setModalProductId(prod.id);

    if (prod.hsn) {
      setModalHsn(prod.hsn);
    }

    if (prod.rate !== undefined) {
      setModalRate(String(prod.rate));
    }

    if (prod.discount !== undefined) {
      setModalDiscount(
        String(prod.discount),
      );
    }

    if (prod.gst !== undefined) {
      setModalGst(String(prod.gst));
    }

    setModalProductDropdownOpen(false);
  };

  // =====================================================
  // SAVE MODAL ITEM
  // =====================================================

  const handleSaveModalItem = () => {
    if (!modalProduct.trim()) {
      Alert.alert(
        'Validation Error',
        'Please select or enter a product name.',
      );
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
      Alert.alert(
        'Validation Error',
        'Please enter a valid purchase rate.',
      );
      return;
    }

    const disc = Number(modalDiscount);

    if (
      Number.isFinite(disc) &&
      (disc < 0 || disc > 100)
    ) {
      Alert.alert(
        'Validation Error',
        'Discount percentage must be between 0 and 100.',
      );
      return;
    }

    const gstVal = Number(modalGst);

    if (
      Number.isFinite(gstVal) &&
      (gstVal < 0 || gstVal > 100)
    ) {
      Alert.alert(
        'Validation Error',
        'GST percentage must be between 0 and 100.',
      );
      return;
    }

    let resolvedHsn =
      modalHsn.trim();

    if (!resolvedHsn) {
      const match = productsList.find(
        p =>
          p.name
            .toLowerCase()
            .trim() ===
          modalProduct
            .trim()
            .toLowerCase(),
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
      discount:
        modalDiscount.trim() || '0',
      hsn: resolvedHsn,
      gst: modalGst.trim() || '0',
    };

    if (editingIndex !== null) {
      setItems(prev =>
        prev.map((item, idx) =>
          idx === editingIndex
            ? {
                ...item,
                ...newItemData,
              }
            : item,
        ),
      );
    } else {
      setItems(prev => {
        const firstBlankIndex =
          prev.findIndex(isItemBlank);

        if (firstBlankIndex !== -1) {
          return prev.map(
            (item, idx) =>
              idx === firstBlankIndex
                ? {
                    ...item,
                    ...newItemData,
                  }
                : item,
          );
        }

        return [...prev, newItemData];
      });
    }

    setModalVisible(false);
  };

  // =====================================================
  // DELETE ITEM
  // =====================================================

  const handleDeleteItem = (
    index: number,
  ) => {
    const item = items[index];

    const itemName =
      item?.product ||
      `Row ${index + 1}`;

    Alert.alert(
      'Delete Product',
      `Are you sure you want to remove "${itemName}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setItems(prev => {
              const filtered =
                prev.filter(
                  (_, idx) =>
                    idx !== index,
                );

              const updated = [
                ...filtered,
              ];

              while (
                updated.length < 5
              ) {
                updated.push(
                  createEmptyItem(),
                );
              }

              return updated;
            });
          },
        },
      ],
    );
  };

  // =====================================================
  // POPULATE PURCHASE
  // =====================================================

  const populatePurchaseFields = (
    purchase: any,
  ) => {
    if (!purchase) {
      return;
    }

    const id =
      purchase.id ||
      purchase.purchase_id ||
      null;

    setPurchaseId(id);

    const purchaseNumber =
      purchase.PurchaseNo ||
      purchase.purchase_no ||
      purchase.invoice_number ||
      purchase.bill_number ||
      '';

    setPurchaseNo(
      String(purchaseNumber),
    );

    const invoiceNumber =
      purchase.invoice_number ||
      purchase.InvoiceNo ||
      purchase.invoice_no ||
      purchase.bill_number ||
      '';

    setInvoiceNo(
      String(invoiceNumber),
    );

    const databaseDate =
      purchase.purchase_date ||
      purchase.PurchaseDate ||
      purchase.date ||
      purchase.created_at ||
      null;

    if (databaseDate) {
      const dateObject =
        parseExistingDate(
          databaseDate,
        );

      setSelectedDate(dateObject);

      setPurchaseDate(
        formatDateForMySQL(
          dateObject,
        ),
      );
    }

    const dbSupplierId =
      purchase.supplier_id ||
      purchase.SupplierId ||
      null;

    if (dbSupplierId) {
      setSupplierId(
        String(dbSupplierId),
      );
    }

    const supplierName =
      purchase.supplier_name ||
      purchase.supplier ||
      purchase.Supplier ||
      purchase.vendor_name ||
      '';

    setSupplier(
      String(supplierName),
    );
    setSupplierName(String(supplierName));
    setSupplierPhone(String(purchase.supplier_phone || purchase.phone || purchase.mobile || ''));
    setSupplierState(String(purchase.supplier_state || purchase.state || ''));
    setSupplierCity(String(purchase.supplier_city || purchase.city || ''));

    if (
      !dbSupplierId &&
      supplierName
    ) {
      const matchedSupplier =
        suppliers.find(
          item =>
            item.name
              .toLowerCase()
              .trim() ===
            String(
              supplierName,
            )
              .toLowerCase()
              .trim(),
        );

      if (matchedSupplier) {
        setSupplierId(
          matchedSupplier.id,
        );
      }
    }

    // =====================================================
    // POPULATE ITEMS
    // =====================================================

    let databaseItems: any[] = [];

    if (Array.isArray(purchase)) {
      databaseItems = purchase;
    } else if (
      Array.isArray(purchase.items)
    ) {
      databaseItems =
        purchase.items;
    } else if (
      typeof purchase.items ===
      'string'
    ) {
      try {
        const parsed =
          JSON.parse(
            purchase.items,
          );

        if (Array.isArray(parsed)) {
          databaseItems = parsed;
        }
      } catch (e) {}
    } else if (
      Array.isArray(
        purchase.purchase_items,
      )
    ) {
      databaseItems =
        purchase.purchase_items;
    } else if (
      typeof purchase.purchase_items ===
      'string'
    ) {
      try {
        const parsed =
          JSON.parse(
            purchase.purchase_items,
          );

        if (Array.isArray(parsed)) {
          databaseItems = parsed;
        }
      } catch (e) {}
    } else if (
      Array.isArray(
        purchase.products,
      )
    ) {
      databaseItems =
        purchase.products;
    }

    if (databaseItems.length > 0) {
      const populatedItems: PurchaseItem[] =
        databaseItems.map(
          (
            item: any,
          ): PurchaseItem => {
            const dbProductId =
              item.product_id ||
              item.ProductId ||
              null;

            const productName =
              item.product_name ||
              item.product ||
              item.Product ||
              item.name ||
              '';

            let resolvedProductId =
              dbProductId;

            let resolvedHsn =
              item.hsn ||
              item.hsn_code ||
              item.product_hsn_code ||
              '';

            if (productName) {
              const matchedProduct =
                productsList.find(
                  prod =>
                    prod.name
                      .toLowerCase()
                      .trim() ===
                    String(
                      productName,
                    )
                      .toLowerCase()
                      .trim(),
                );

              if (matchedProduct) {
                if (
                  !resolvedProductId
                ) {
                  resolvedProductId =
                    matchedProduct.id;
                }

                if (!resolvedHsn) {
                  resolvedHsn =
                    matchedProduct.hsn;
                }
              }
            }

            const databaseQty =
              item.quantity ??
              item.qty ??
              '';

            const databaseRate =
              item.purchase_price ??
              item.purchasePrice ??
              item.rate ??
              item.Rate ??
              '';

            let discountPercent =
              item.discount_percent ??
              item.discount_percentage ??
              null;

            if (
              discountPercent ===
                null ||
              discountPercent ===
                undefined
            ) {
              const itemSubtotal =
                numberValue(
                  databaseQty,
                ) *
                numberValue(
                  databaseRate,
                );

              const discountAmount =
                numberValue(
                  item.discount,
                );

              if (
                itemSubtotal > 0 &&
                discountAmount > 0
              ) {
                discountPercent =
                  (discountAmount /
                    itemSubtotal) *
                  100;
              }
            }

            let gstPercent =
              item.tax_rate ??
              item.gst_percent ??
              item.GST ??
              null;

            return {
              id: item.id,

              productId:
                resolvedProductId
                  ? String(
                      resolvedProductId,
                    )
                  : null,

              product:
                String(
                  productName,
                ),

              quantity:
                databaseQty === ''
                  ? ''
                  : String(
                      databaseQty,
                    ),

              rate:
                databaseRate === ''
                  ? ''
                  : String(
                      databaseRate,
                    ),

              discount:
                discountPercent ===
                    null ||
                discountPercent ===
                    undefined
                  ? ''
                  : String(
                      Number(
                        discountPercent,
                      ),
                    ),

              hsn: String(
                resolvedHsn || '',
              ),

              gst:
                gstPercent ===
                    null ||
                gstPercent ===
                    undefined
                  ? ''
                  : String(
                      Number(
                        gstPercent,
                      ),
                    ),
            };
          },
        );

      const padded: PurchaseItem[] =
        [...populatedItems];

      while (
        padded.length < 5
      ) {
        padded.push(
          createEmptyItem(),
        );
      }

      setItems(padded);
    } else {
      setItems(
        Array.from(
          {length: 5},
          createEmptyItem,
        ),
      );
    }

    // =====================================================
    // PAYMENT
    // =====================================================

    const paymentMode =
      purchase.payment_method ||
      purchase.PaymentMode ||
      purchase.payment_mode ||
      'Card';

    setPaymentMode(
      String(paymentMode),
    );

    const paymentStatus =
      purchase.payment_status ||
      purchase.PaymentStatus ||
      'Paid';

    setPaymentStatus(
      String(paymentStatus),
    );
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {
    const today =
      getCurrentDate();

    setPurchaseId(null);
    setPurchaseNo('');
    setInvoiceNo('');

    setPurchaseDate(today);
    setSelectedDate(
      parseExistingDate(today),
    );

    setSupplier('');
    setSupplierId(null);
    setSupplierName('');
    setSupplierPhone('');
    setSupplierState('');
    setSupplierCity('');

    setShowSuppliers(false);

    setItems(
      Array.from(
        {length: 5},
        createEmptyItem,
      ),
    );

    setPaymentMode('Card');
    setPaymentStatus('Paid');
  };

  // =====================================================
  // INITIALIZE SCREEN
  // =====================================================

  useEffect(() => {
    const purchase =
      route?.params?.purchase ||
      route?.params?.item ||
      null;

    if (purchase) {
      populatePurchaseFields(
        purchase,
      );
    } else if (
      route?.params?.mode !==
        'edit' &&
      !route?.params?.purchaseId
    ) {
      resetForm();
    }
  }, [
    route?.params?.purchase,
    route?.params?.item,
    route?.params?.mode,
    route?.params?.purchaseId,
  ]);

  // =====================================================
  // FOCUS EFFECT
  // =====================================================

  useFocusEffect(
    useCallback(() => {
      const isEdit =
        route?.params?.mode ===
          'edit' ||
        !!route?.params?.purchaseId ||
        !!route?.params?.purchase ||
        !!route?.params?.item;

      if (
        !isEdit &&
        purchaseId !== null
      ) {
        resetForm();
      }
    }, [
      route?.params,
      purchaseId,
    ]),
  );

  // =====================================================
  // LOAD PURCHASE BY ID
  // =====================================================

  useEffect(() => {
    const loadPurchaseFromDatabase =
      async () => {
        const purchaseIdFromRoute =
          route?.params?.purchaseId;

        const existingPurchase =
          route?.params?.purchase ||
          route?.params?.item;

        if (
          !purchaseIdFromRoute ||
          existingPurchase
        ) {
          return;
        }

        try {
          setLoadingPurchase(true);

          if (
            typeof purchaseAPI.getPurchaseById !==
            'function'
          ) {
            return;
          }

          const response =
            await purchaseAPI.getPurchaseById(
              Number(
                purchaseIdFromRoute,
              ),
            );

          const databasePurchase =
            response?.purchase ||
            response?.data ||
            response;

          if (databasePurchase) {
            populatePurchaseFields(
              databasePurchase,
            );
          }
        } catch (error: any) {
          Alert.alert(
            'Error',
            error?.message ||
              'Failed to load purchase from database.',
          );
        } finally {
          setLoadingPurchase(false);
        }
      };

    loadPurchaseFromDatabase();
  }, [
    route?.params?.purchaseId,
  ]);

  // =====================================================
  // SAVE / UPDATE PURCHASE
  // =====================================================

  const handleSavePurchase =
    async () => {
      if (!Supplier.trim()) {
        Alert.alert(
          'Validation Error',
          'Please select or enter a supplier.',
        );
        return;
      }

      const validItems =
        items.filter(
          item =>
            item.product?.trim() &&
            Number(item.quantity) >
              0 &&
            Number(item.rate) > 0,
        );

      if (
        validItems.length === 0
      ) {
        Alert.alert(
          'Validation Error',
          'Please add at least one product.',
        );
        return;
      }

      for (
        let index = 0;
        index < validItems.length;
        index++
      ) {
        const item =
          validItems[index];

        const productName =
          item.product.trim();

        const quantity =
          Number(item.quantity);

        const rate =
          Number(item.rate);

        if (!productName) {
          Alert.alert(
            'Validation Error',
            `Please provide a name for Product ${
              index + 1
            }.`,
          );
          return;
        }

        if (
          !Number.isFinite(
            quantity,
          ) ||
          quantity <= 0
        ) {
          Alert.alert(
            'Validation Error',
            `Please enter a valid quantity for "${productName}".`,
          );
          return;
        }

        if (
          !Number.isFinite(rate) ||
          rate < 0
        ) {
          Alert.alert(
            'Validation Error',
            `Please enter a valid purchase rate for "${productName}".`,
          );
          return;
        }
      }

      const summary =
        calculatePurchaseSummary();

      let resolvedSupplierId =
        supplierId;

      if (!resolvedSupplierId) {
        const matchedSupplier =
          suppliers.find(
            item =>
              item.name
                .toLowerCase()
                .trim() ===
              Supplier.trim()
                .toLowerCase(),
          );

        if (matchedSupplier) {
          resolvedSupplierId =
            matchedSupplier.id;
        }
      }

      const purchaseItems =
        validItems.map(item => {
          const calculation =
            calculateItem(item);

          let resolvedProductId =
            item.productId;

          if (!resolvedProductId) {
            const matchedProduct =
              productsList.find(
                product =>
                  product.name
                    .toLowerCase()
                    .trim() ===
                  item.product
                    .trim()
                    .toLowerCase(),
              );

            if (matchedProduct) {
              resolvedProductId =
                matchedProduct.id;
            }
          }

          return {
            id: item.id
              ? Number(item.id)
              : undefined,

            product_id:
              resolvedProductId
                ? Number(
                    resolvedProductId,
                  )
                : undefined,

            product:
              item.product.trim(),

            product_name:
              item.product.trim(),

            hsn:
              item.hsn?.trim() ||
              '',

            hsn_code:
              item.hsn?.trim() ||
              '',

            quantity:
              calculation.quantity,

            purchase_price:
              calculation.rate,

            discount:
              Number(
                calculation.discountAmount.toFixed(
                  2,
                ),
              ),

            discount_percent:
              Number(
                calculation.discountPercent.toFixed(
                  2,
                ),
              ),

            tax_rate:
              calculation.gstPercent,

            gst_percent:
              calculation.gstPercent,

            tax_amount:
              Number(
                calculation.gstAmount.toFixed(
                  2,
                ),
              ),

            taxable_amount:
              Number(
                calculation.taxableAmount.toFixed(
                  2,
                ),
              ),

            subtotal:
              Number(
                calculation.subtotal.toFixed(
                  2,
                ),
              ),

            total_amount:
              Number(
                calculation.totalAmount.toFixed(
                  2,
                ),
              ),
          };
        });

      const fallbackBillNo =
        `PUR-${Date.now()}`;

      const finalBillNo =
        PurchaseNo.trim() ||
        fallbackBillNo;

      const finalInvoiceNo =
        InvoiceNo.trim() ||
        finalBillNo;

      const purchasePayload = {
        id: purchaseId
          ? Number(purchaseId)
          : undefined,

        purchase_id: purchaseId
          ? Number(purchaseId)
          : undefined,

        supplier_id:
          resolvedSupplierId
            ? Number(
                resolvedSupplierId,
              )
            : undefined,

        supplier:
          (supplierName || Supplier).trim(),

        Supplier:
          (supplierName || Supplier).trim(),

        supplier_name:
          (supplierName || Supplier).trim(),

        supplier_phone:
          supplierPhone.trim(),

        supplier_state:
          supplierState.trim(),

        supplier_city:
          supplierCity.trim(),

        invoice_number:
          finalInvoiceNo,

        invoice_no:
          finalInvoiceNo,

        PurchaseNo:
          finalBillNo,

        purchase_no:
          finalBillNo,

        purchase_date:
          PurchaseDate,

        subtotal:
          Number(
            summary.subtotal.toFixed(
              2,
            ),
          ),

        discount:
          Number(
            summary.discountAmount.toFixed(
              2,
            ),
          ),

        discount_percent: 0,

        taxable_amount:
          Number(
            summary.taxableAmount.toFixed(
              2,
            ),
          ),

        tax_amount:
          Number(
            summary.gstAmount.toFixed(
              2,
            ),
          ),

        total_amount:
          Number(
            summary.grandTotal.toFixed(
              2,
            ),
          ),

        GrandTotal:
          Number(
            summary.grandTotal.toFixed(
              2,
            ),
          ),

        payment_status:
          PaymentStatus,

        payment_method:
          PaymentMode,

        notes: null,

        items:
          purchaseItems,

        purchase_items:
          purchaseItems,

        products:
          purchaseItems,

        purchaseItems:
          purchaseItems,

        order_items:
          purchaseItems,
      };

      try {
        setSaving(true);

        let result;

        if (
          isEditing &&
          purchaseId
        ) {
          result =
            await purchaseAPI.updatePurchase(
              purchasePayload,
            );
        } else {
          result =
            await purchaseAPI.createPurchase(
              purchasePayload,
            );
        }

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
                navigation.navigate(
                  'AllPurchases',
                  {
                    user:
                      route?.params?.user,
                  },
                );
              },
            },
          ],
        );
      } catch (error: any) {
        Alert.alert(
          'Failed to Save Purchase',
          error?.message ||
            'Unable to save purchase.',
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
      <View
        style={
          styles.loadingScreen
        }>
        <ActivityIndicator
          size="large"
          color="#ea6c08"
        />

        <Text
          style={
            styles.loadingText
          }>
          Loading purchase data...
        </Text>
      </View>
    );
  }

  // =====================================================
  // SUMMARY
  // =====================================================

  const summary =
    calculatePurchaseSummary();

  // =====================================================
  // FILTER PRODUCTS
  // =====================================================

  const filteredModalProducts =
    productsList.filter(p =>
      p.name
        .toLowerCase()
        .includes(
          modalProduct
            .toLowerCase(),
        ),
    );

  // =====================================================
  // MODAL CALCULATIONS
  // =====================================================

  const modalSubtotalNum =
    (Number(modalQuantity) ||
      0) *
    (Number(modalRate) || 0);

  const modalDiscountAmtNum =
    (modalSubtotalNum *
      (Number(modalDiscount) ||
        0)) /
    100;

  const modalTaxableNum =
    Math.max(
      0,
      modalSubtotalNum -
        modalDiscountAmtNum,
    );

  const modalGstAmtNum =
    (modalTaxableNum *
      (Number(modalGst) || 0)) /
    100;

  const modalTotalNum =
    modalTaxableNum +
    modalGstAmtNum;

  // =====================================================
  // MAIN UI
  // =====================================================

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
          <Text style={styles.headerTitle}>
            {isEditing ? 'Edit Purchase' : 'Add Purchase'}
          </Text>
        </View>
      </View>

      {/* 2. BODY / SCROLL CONTENT */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">
        {/* PURCHASE INFORMATION CARD */}
        <View style={[styles.formCard, {zIndex: 5000}]}>
          <Text style={styles.cardHeaderTitle}>Purchase Information</Text>

          {/* BILL NUMBER & PURCHASE DATE ROW */}
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Bill Number</Text>
              <TextInput
                style={styles.formInput}
                value={PurchaseNo}
                onChangeText={setPurchaseNo}
                placeholder="PUR-001"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Purchase Date</Text>
              <TouchableOpacity
                style={styles.dateInputContainer}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}>
                <Text style={styles.dateInputText}>
                  {PurchaseDate || getCurrentDate()}
                </Text>
                <Text style={styles.calendarIcon}>🗓</Text>
              </TouchableOpacity>
            </View>
          </View>

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

          {/* SUPPLIER */}
          <Text style={styles.inputLabel}>Supplier *</Text>
          <View style={styles.supplierContainer}>
            <View style={styles.supplierInputWrapper}>
              <TextInput
                style={styles.supplierInput}
                placeholder="Select or enter Supplier"
                placeholderTextColor="#94a3b8"
                value={Supplier}
                onFocus={() => setShowSuppliers(true)}
                onChangeText={text => {
                  setSupplier(text);
                  setSupplierName(text);
                  setSupplierId(null);
                  setShowSuppliers(true);
                }}
              />
              <TouchableOpacity
                onPress={() => setShowSuppliers(prev => !prev)}
                style={styles.supplierArrowBtn}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.dropdownArrow}>
                  {showSuppliers ? '▲' : '▼'}
                </Text>
              </TouchableOpacity>
            </View>

            {showSuppliers && (
              <View style={styles.supplierDropdown}>
                <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 180}}>
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
                          setSupplierName(item.name);
                          setSupplierPhone(item.phone ?? '');
                          setSupplierState(item.state ?? '');
                          setSupplierCity(item.city ?? '');
                          setShowSuppliers(false);
                        }}>
                        <Text style={styles.supplierText}>{item.name}</Text>
                      </TouchableOpacity>
                    ))}

                  <TouchableOpacity
                    style={styles.addSupplierItem}
                    onPress={() => {
                      setShowSuppliers(false);
                      navigation.navigate('SupplierMaster', {
                        openAddModal: true,
                        returnTo: 'AddPurchase',
                      });
                    }}>
                    <Text style={styles.addSupplierText}>+ Add Supplier</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            )}
          </View>

          {/* SUPPLIER DETAILS (SUPPLIER NAME, PHONE NO, STATE, CITY) */}
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Supplier Name</Text>
              <TextInput
                style={styles.formInput}
                value={supplierName}
                onChangeText={setSupplierName}
                placeholder="Enter Supplier Name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Phone No.</Text>
              <TextInput
                style={styles.formInput}
                value={supplierPhone}
                onChangeText={setSupplierPhone}
                placeholder="Enter Phone No."
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>State</Text>
              <TextInput
                style={styles.formInput}
                value={supplierState}
                onChangeText={setSupplierState}
                placeholder="Enter State"
                placeholderTextColor="#94a3b8"
              />
            </View>

            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>City</Text>
              <TextInput
                style={styles.formInput}
                value={supplierCity}
                onChangeText={setSupplierCity}
                placeholder="Enter City"
                placeholderTextColor="#94a3b8"
              />
            </View>
          </View>

          {/* INVOICE NUMBER */}
          <Text style={styles.inputLabel}>Invoice Number</Text>
          <TextInput
            style={styles.formInput}
            value={InvoiceNo}
            onChangeText={setInvoiceNo}
            placeholder="INV-001"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* PRODUCT INFORMATION CARD */}
        <View style={styles.formCard}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.sectionTitleWithBadge}>
              <Text style={styles.cardHeaderTitle}>Product Information</Text>
              <View style={styles.itemBadge}>
                <Text style={styles.itemCountText}>
                  {items.filter(item => !isItemBlank(item)).length}{' '}
                  {items.filter(item => !isItemBlank(item)).length === 1 ? 'Item' : 'Items'}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addBtn}
              onPress={openAddModal}
              activeOpacity={0.8}
              accessibilityLabel="Add Item">
              <Text style={styles.addBtnText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

        {/* PRODUCT TABLE */}

        <View
          style={
            styles.tableCardContainer
          }>
          <View
            style={
              styles.tableCard
            }>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={
                true
              }
              persistentScrollbar={
                true
              }
              nestedScrollEnabled>
              <View
                style={
                  styles.tableInner
                }>
                {/* HEADER */}

                <View
                  style={
                    styles.tableHeaderRow
                  }>
                  <View
                    style={
                      styles.colProduct
                    }>
                    <Text
                      style={
                        styles.thText
                      }>
                      Product
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colQty
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textCenter,
                      ]}>
                      Qty
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colRate
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textRight,
                      ]}>
                      Rate
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colDiscount
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textCenter,
                      ]}>
                      Discount
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colHsn
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textCenter,
                      ]}>
                      HSN
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colTotal
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textRight,
                      ]}>
                      Total
                    </Text>
                  </View>

                  <View
                    style={
                      styles.colAction
                    }>
                    <Text
                      style={[
                        styles.thText,
                        styles.textCenter,
                      ]}>
                      Action
                    </Text>
                  </View>
                </View>

                {/* BODY */}

                {items.map(
                  (
                    item,
                    index,
                  ) => {
                    const isBlank =
                      isItemBlank(
                        item,
                      );

                    const calc =
                      calculateItem(
                        item,
                      );

                    const isEven =
                      index % 2 === 0;

                    return (
                      <View
                        key={
                          item.id
                            ? `db-${item.id}`
                            : `item-${index}`
                        }
                        style={[
                          styles.tableDataRow,
                          isEven
                            ? styles.rowEven
                            : styles.rowOdd,
                          isBlank &&
                            styles.blankRow,
                          index ===
                            items.length -
                              1 &&
                            styles.lastRow,
                        ]}>
                        <TouchableOpacity
                          style={
                            styles.tableRowTouchableContent
                          }
                          activeOpacity={
                            0.7
                          }
                          onPress={() =>
                            openEditModal(
                              index,
                            )
                          }>
                          <View
                            style={
                              styles.colProduct
                            }>
                            {isBlank ? (
                              <Text
                                style={
                                  styles.cellPlaceholderText
                                }>
                                Select Product...
                              </Text>
                            ) : (
                              <Text
                                style={
                                  styles.cellProductText
                                }
                                numberOfLines={
                                  2
                                }>
                                {item.product ||
                                  '-'}
                              </Text>
                            )}
                          </View>

                          <View
                            style={
                              styles.colQty
                            }>
                            <Text
                              style={[
                                styles.cellCenterText,
                                isBlank &&
                                  styles.cellMuted,
                              ]}>
                              {isBlank
                                ? '—'
                                : item.quantity ||
                                  '0'}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.colRate
                            }>
                            <Text
                              style={[
                                styles.cellRightText,
                                isBlank &&
                                  styles.cellMuted,
                              ]}>
                              {isBlank
                                ? '—'
                                : formatTableNumber(
                                    item.rate,
                                  )}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.colDiscount
                            }>
                            <Text
                              style={[
                                styles.cellCenterText,
                                isBlank &&
                                  styles.cellMuted,
                              ]}>
                              {isBlank
                                ? '—'
                                : item.discount &&
                                  Number(
                                    item.discount,
                                  ) >
                                    0
                                ? `${formatTableNumber(
                                    item.discount,
                                  )}%`
                                : '0%'}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.colHsn
                            }>
                            <Text
                              style={[
                                styles.cellCenterText,
                                isBlank &&
                                  styles.cellMuted,
                              ]}>
                              {isBlank
                                ? '—'
                                : item.hsn ||
                                  '-'}
                            </Text>
                          </View>

                          <View
                            style={
                              styles.colTotal
                            }>
                            <Text
                              style={[
                                styles.cellTotalText,
                                isBlank &&
                                  styles.cellMuted,
                              ]}>
                              {isBlank
                                ? '—'
                                : formatTableNumber(
                                    calc.totalAmount,
                                  )}
                            </Text>
                          </View>
                        </TouchableOpacity>

                        {/* ACTION */}

                        <View
                          style={
                            styles.colAction
                          }>
                          <View
                            style={
                              styles.actionButtonsRow
                            }>
                            <TouchableOpacity
                              onPress={() =>
                                openEditModal(
                                  index,
                                )
                              }
                              style={
                                styles.editActionBtn
                              }
                              activeOpacity={
                                0.7
                              }
                              hitSlop={{
                                top: 8,
                                bottom: 8,
                                left: 8,
                                right: 8,
                              }}>
                              <PencilIcon size={14} color="#ea7e30" />
                            </TouchableOpacity>

                            {(!isBlank ||
                              items.length >
                                1) && (
                              <TouchableOpacity
                                onPress={() =>
                                  handleDeleteItem(
                                    index,
                                  )
                                }
                                style={
                                  styles.deleteActionBtn
                                }
                                activeOpacity={
                                  0.7
                                }
                                hitSlop={{
                                  top: 8,
                                  bottom: 8,
                                  left: 8,
                                  right: 8,
                                }}>
                                <DustbinIcon
                                  size={14}
                                  color="#dc2626"
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    );
                  },
                )}
              </View>
            </ScrollView>

            <View
              style={
                styles.scrollBottomShadow
              }
            />
          </View>
        </View>
        </View>

        {/* PAYMENT & SUMMARY CARD */}
        <View style={styles.formCard}>
          <Text style={styles.cardHeaderTitle}>Payment Information</Text>

          <View style={styles.formRow}>
            {/* PAYMENT MODE */}
            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Payment Mode</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={PaymentMode}
                  onValueChange={value => setPaymentMode(String(value))}
                  style={styles.picker}
                  mode="dropdown"
                  dropdownIconColor="#64748b">
                  <Picker.Item label="Card" value="Card" />
                  <Picker.Item label="UPI" value="UPI" />
                  <Picker.Item label="Cash" value="Cash" />
                  <Picker.Item label="Credit" value="Credit" />
                </Picker>
              </View>
            </View>

            {/* PAYMENT STATUS */}
            <View style={styles.formCol}>
              <Text style={styles.inputLabel}>Payment Status</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={PaymentStatus}
                  onValueChange={value => setPaymentStatus(String(value))}
                  style={styles.picker}
                  mode="dropdown"
                  dropdownIconColor="#64748b">
                  <Picker.Item label="Paid" value="Paid" />
                  <Picker.Item label="Pending" value="Pending" />
                  <Picker.Item label="Partial" value="Partial" />
                </Picker>
              </View>
            </View>
          </View>

          <Text style={[styles.cardHeaderTitle, {marginTop: 18, marginBottom: 10}]}>
            Purchase Summary
          </Text>

          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹ {formatCurrency(summary.subtotal)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Discount</Text>
              <Text style={styles.discountValue}>- ₹ {formatCurrency(summary.discountAmount)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxable Amount</Text>
              <Text style={styles.summaryValue}>₹ {formatCurrency(summary.taxableAmount)}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total GST</Text>
              <Text style={styles.gstValue}>+ ₹ {formatCurrency(summary.gstAmount)}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.summaryRow}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotal}>₹ {formatCurrency(summary.grandTotal)}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && {
              opacity: 0.7,
            },
          ]}
          onPress={
            handleSavePurchase
          }
          disabled={saving}
          activeOpacity={0.8}>
          {saving ? (
            <ActivityIndicator
              color="#ffffff"
            />
          ) : (
            <Text
              style={
                styles.saveButtonText
              }>
              {isEditing
                ? 'Update Purchase'
                : 'Save Purchase'}
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
        onRequestClose={() =>
          setModalVisible(false)
        }>
        <View
          style={
            styles.modalOverlay
          }>
          <KeyboardAvoidingView
            behavior={
              Platform.OS === 'ios'
                ? 'padding'
                : undefined
            }
            style={
              styles.modalContainer
            }>
            <View
              style={
                styles.modalContent
              }>
              {/* MODAL HEADER */}

              <View
                style={
                  styles.modalHeader
                }>
                <Text
                  style={
                    styles.modalTitle
                  }>
                  {editingIndex !==
                    null &&
                  !isItemBlank(
                    items[
                      editingIndex
                    ] ||
                      createEmptyItem(),
                  )
                    ? 'Edit Item'
                    : 'Add Item'}
                </Text>

                <TouchableOpacity
                  onPress={() =>
                    setModalVisible(
                      false,
                    )
                  }
                  style={
                    styles.modalCloseBtn
                  }
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}>
                  <Text
                    style={
                      styles.modalCloseText
                    }>
                    ✕
                  </Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={
                  false
                }
                keyboardShouldPersistTaps="handled"
                style={
                  styles.modalScrollBody
                }>
                {/* PRODUCT NAME */}

                <Text
                  style={
                    styles.modalFieldLabel
                  }>
                  Product Name *
                </Text>

                <View
                  style={
                    styles.modalDropdownContainer
                  }>
                  <TextInput
                    style={
                      styles.modalInput
                    }
                    placeholder="Search or enter product name"
                    placeholderTextColor="#d1d5db"
                    value={
                      modalProduct
                    }
                    onFocus={() =>
                      setModalProductDropdownOpen(
                        true,
                      )
                    }
                    onChangeText={text => {
                      setModalProduct(
                        text,
                      );

                      setModalProductId(
                        null,
                      );

                      setModalProductDropdownOpen(
                        true,
                      );
                    }}
                  />

                  {modalProductDropdownOpen && (
                    <View
                      style={
                        styles.modalDropdown
                      }>
                      <ScrollView
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled">
                        {filteredModalProducts.length >
                        0 ? (
                          filteredModalProducts.map(
                            item => (
                              <TouchableOpacity
                                key={
                                  item.id
                                }
                                style={
                                  styles.modalDropdownItem
                                }
                                onPress={() =>
                                  handleSelectModalProduct(
                                    item,
                                  )
                                }>
                                <Text
                                  style={
                                    styles.modalDropdownText
                                  }>
                                  {
                                    item.name
                                  }
                                </Text>

                                <Text
                                  style={
                                    styles.modalDropdownSub
                                  }>
                                  HSN:{' '}
                                  {
                                    item.hsn
                                  }{' '}
                                  | Rate:
                                  ₹
                                  {item.rate ||
                                    0}
                                </Text>
                              </TouchableOpacity>
                            ),
                          )
                        ) : (
                          <View
                            style={
                              styles.modalDropdownEmpty
                            }>
                            <Text
                              style={
                                styles.modalDropdownEmptyText
                              }>
                              Custom product:
                              "
                              {
                                modalProduct
                              }
                              "
                            </Text>
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* QUANTITY + RATE */}

                <View
                  style={
                    styles.modalRow
                  }>
                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      Quantity *
                    </Text>

                    <TextInput
                      style={
                        styles.modalInput
                      }
                      value={
                        modalQuantity
                      }
                      onChangeText={
                        setModalQuantity
                      }
                      placeholder="e.g. 2"
                      placeholderTextColor="#d1d5db"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      Purchase Rate (₹) *
                    </Text>

                    <TextInput
                      style={
                        styles.modalInput
                      }
                      value={
                        modalRate
                      }
                      onChangeText={
                        setModalRate
                      }
                      placeholder="e.g. 500"
                      placeholderTextColor="#d1d5db"
                      keyboardType="decimal-pad"
                    />
                  </View>
                </View>

                {/* DISCOUNT + HSN */}

                <View
                  style={
                    styles.modalRow
                  }>
                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      Discount (%)
                    </Text>

                    <TextInput
                      style={
                        styles.modalInput
                      }
                      value={
                        modalDiscount
                      }
                      onChangeText={
                        setModalDiscount
                      }
                      placeholder="e.g. 5"
                      placeholderTextColor="#d1d5db"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      HSN Code
                    </Text>

                    <TextInput
                      style={
                        styles.modalInput
                      }
                      value={
                        modalHsn
                      }
                      onChangeText={
                        setModalHsn
                      }
                      placeholder="e.g. 8471"
                      placeholderTextColor="#d1d5db"
                    />
                  </View>
                </View>

                {/* GST + ESTIMATED TOTAL */}

                <View
                  style={
                    styles.modalRow
                  }>
                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      GST Rate (%)
                    </Text>

                    <TextInput
                      style={
                        styles.modalInput
                      }
                      value={
                        modalGst
                      }
                      onChangeText={
                        setModalGst
                      }
                      placeholder="e.g. 0, 5, 18"
                      placeholderTextColor="#d1d5db"
                      keyboardType="decimal-pad"
                    />
                  </View>

                  <View
                    style={
                      styles.modalHalf
                    }>
                    <Text
                      style={
                        styles.modalFieldLabel
                      }>
                      Estimated Total
                    </Text>

                    <View
                      style={
                        styles.modalTotalPreviewBox
                      }>
                      <Text
                        style={
                          styles.modalTotalPreviewValue
                        }>
                        ₹{' '}
                        {modalTotalNum.toFixed(
                          2,
                        )}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* CALCULATION SUMMARY */}

                <View
                  style={
                    styles.modalCalcCard
                  }>
                  <View
                    style={
                      styles.modalCalcRow
                    }>
                    <Text
                      style={
                        styles.modalCalcLabel
                      }>
                      Subtotal:
                    </Text>

                    <Text
                      style={
                        styles.modalCalcVal
                      }>
                      ₹{' '}
                      {modalSubtotalNum.toFixed(
                        2,
                      )}
                    </Text>
                  </View>

                  <View
                    style={
                      styles.modalCalcRow
                    }>
                    <Text
                      style={
                        styles.modalCalcLabel
                      }>
                      Discount:
                    </Text>

                    <Text
                      style={
                        styles.modalCalcDiscount
                      }>
                      - ₹{' '}
                      {modalDiscountAmtNum.toFixed(
                        2,
                      )}
                    </Text>
                  </View>

                  {Number(
                    modalGst,
                  ) > 0 && (
                    <View
                      style={
                        styles.modalCalcRow
                      }>
                      <Text
                        style={
                          styles.modalCalcLabel
                        }>
                        GST Amount:
                      </Text>

                      <Text
                        style={
                          styles.modalCalcGst
                        }>
                        + ₹{' '}
                        {modalGstAmtNum.toFixed(
                          2,
                        )}
                      </Text>
                    </View>
                  )}

                  <View
                    style={[
                      styles.modalCalcRow,
                      styles.modalCalcTotalRow,
                    ]}>
                    <Text
                      style={
                        styles.modalCalcTotalLabel
                      }>
                      Line Total:
                    </Text>

                    <Text
                      style={
                        styles.modalCalcTotalVal
                      }>
                      ₹{' '}
                      {modalTotalNum.toFixed(
                        2,
                      )}
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* MODAL FOOTER */}

              <View
                style={
                  styles.modalFooter
                }>
                <TouchableOpacity
                  style={
                    styles.modalCancelBtn
                  }
                  onPress={() =>
                    setModalVisible(
                      false,
                    )
                  }>
                  <Text
                    style={
                      styles.modalCancelText
                    }>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    styles.modalSaveBtn
                  }
                  onPress={
                    handleSaveModalItem
                  }
                  activeOpacity={0.8}>
                  <Text
                    style={
                      styles.modalSaveText
                    }>
                    {editingIndex !==
                      null &&
                    !isItemBlank(
                      items[
                        editingIndex
                      ] ||
                        createEmptyItem(),
                    )
                      ? 'Update Item'
                      : 'Add Item'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
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
    fontWeight: '600',
  },

  // HEADER
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

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 35,
  },

  // FORM CARD
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    marginBottom: 16,
  },

  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  sectionTitleWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  itemBadge: {
    backgroundColor: '#fff7ed',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  itemCountText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#ea7e30',
  },

  addBtn: {
    backgroundColor: '#ea7e30',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // FORM ROWS & COLS
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },

  formCol: {
    flex: 1,
  },

  // INPUT LABELS & FIELDS
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },

  formInput: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
  },

  // DATE INPUT
  dateInputContainer: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  dateInputText: {
    fontSize: 14,
    color: '#1e293b',
  },

  calendarIcon: {
    fontSize: 16,
  },

  // SUPPLIER DROPDOWN
  supplierContainer: {
    position: 'relative',
    zIndex: 5000,
  },

  supplierInputWrapper: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },

  supplierInput: {
    flex: 1,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
  },

  supplierArrowBtn: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  dropdownArrow: {
    color: '#64748b',
    fontSize: 12,
  },

  supplierDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    maxHeight: 200,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 5000,
    overflow: 'hidden',
  },

  supplierItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  supplierText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },

  addSupplierItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: '#fff7ed',
  },

  addSupplierText: {
    color: '#ea7e30',
    fontWeight: '700',
    fontSize: 14,
  },

  // ===================================================
  // PRODUCT TABLE
  // ===================================================

  tableCardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    marginTop: 6,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
  },

  scrollBottomShadow: {
    height: 4,
    width: '100%',
    backgroundColor: '#000000',
    opacity: 0.04,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  tableInner: {
    minWidth: 575,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 10,
  },

  tableDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 44,
  },

  tableRowTouchableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  rowEven: {
    backgroundColor: '#ffffff',
  },

  rowOdd: {
    backgroundColor: '#f8fafc',
  },

  blankRow: {
    backgroundColor: '#ffffff',
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  thText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  colProduct: {
    width: 130,
    paddingLeft: 12,
    paddingRight: 6,
    justifyContent: 'center',
  },

  colQty: {
    width: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colRate: {
    width: 80,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },

  colDiscount: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colHsn: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colTotal: {
    width: 90,
    alignItems: 'flex-end',
    paddingRight: 10,
    justifyContent: 'center',
  },

  colAction: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cellProductText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },

  cellPlaceholderText: {
    fontSize: 13,
    color: '#0f172a',
    fontWeight: '600',
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
    color: '#64748b',
    fontWeight: '500',
  },

  // ===================================================
  // ACTION BUTTONS
  // ===================================================

  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  editActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#fff7ed',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  editIconText: {
    fontSize: 13,
  },

  deleteActionBtn: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  emptyTableBox: {
    paddingVertical: 26,
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  picker: {
    height: 44,
    width: '100%',
    color: '#0f172a',
    paddingVertical: 0,
  },

  // ===================================================
  // SUMMARY
  // ===================================================

  summaryBox: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 16,
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
    fontWeight: '500',
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
    marginVertical: 10,
  },

  grandTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  grandTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: '#ea7e30',
  },

  // ===================================================
  // SAVE BUTTON
  // ===================================================

  saveButton: {
    backgroundColor: '#ea7e30',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 30,
    elevation: 3,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  // ===================================================
  // MODAL
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
    borderRadius: 16,
    overflow: 'hidden',
    maxHeight: '90%',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  modalHeader: {
    backgroundColor: '#ea7e30',
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  modalCloseBtn: {
    padding: 4,
  },

  modalCloseText: {
    color: '#ffffff',
    fontSize: 18,
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
  },

  modalDropdownContainer: {
    position: 'relative',
    zIndex: 3000,
  },

  modalDropdown: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    maxHeight: 160,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.12,
    shadowRadius: 8,
    zIndex: 3000,
  },

  modalDropdownItem: {
    paddingVertical: 10,
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
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },

  modalTotalPreviewValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ea7e30',
  },

  modalCalcCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 14,
    marginTop: 14,
    marginBottom: 6,
  },

  modalCalcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },

  modalCalcLabel: {
    fontSize: 13,
    color: '#64748b',
  },

  modalCalcVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  modalCalcDiscount: {
    fontSize: 13,
    fontWeight: '600',
    color: '#dc2626',
  },

  modalCalcGst: {
    fontSize: 13,
    fontWeight: '600',
    color: '#16a34a',
  },

  modalCalcTotalRow: {
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 8,
    marginTop: 6,
  },

  modalCalcTotalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  modalCalcTotalVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#ea7e30',
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    gap: 10,
  },

  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
  },

  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },

  modalSaveBtn: {
    backgroundColor: '#ea7e30',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },

  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});

export default AddPurchaseScreen;