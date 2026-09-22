import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Platform,
  RefreshControl,
  ActivityIndicator,
  Dimensions,
} from 'react-native';

import {API_BASE_URL} from '../api/config';
import {
  downloadProducts,
  generatePurePDF,
  saveFileToDevice,
} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  unit: string;
  purchasePrice?: number;
  sellingPrice?: number;
  cgst?: string;
  sgst?: string;
  igst?: string;
  gstRate: string;
  openingStock: number;
  currentStock: number;
  lowStockLevel: number;
  hsnCode?: string;
  description?: string;
}

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

const INITIAL_DEMO_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Amul Taaza Milk 1L',
    sku: 'DRY-1042',
    category: 'Dairy',
    unit: 'Liter',
    purchasePrice: 52.0,
    sellingPrice: 56.0,
    gstRate: '5%',
    openingStock: 45,
    currentStock: 45,
    lowStockLevel: 10,
  },
  {
    id: '2',
    name: "Lay's Classic Salted 52g",
    sku: 'SNK-0087',
    category: 'Snacks',
    unit: 'Piece',
    purchasePrice: 16.0,
    sellingPrice: 20.0,
    gstRate: '12%',
    openingStock: 80,
    currentStock: 80,
    lowStockLevel: 15,
  },
  {
    id: '3',
    name: 'Classmate Notebook 172...',
    sku: 'STN-0231',
    category: 'Stationery',
    unit: 'Piece',
    purchasePrice: 36.0,
    sellingPrice: 45.0,
    gstRate: '18%',
    openingStock: 60,
    currentStock: 60,
    lowStockLevel: 10,
  },
  {
    id: '4',
    name: 'Tata Tea Gold 250g',
    sku: 'DRY-0567',
    category: 'Beverages',
    unit: 'Piece',
    purchasePrice: 114.0,
    sellingPrice: 135.0,
    gstRate: '5%',
    openingStock: 30,
    currentStock: 30,
    lowStockLevel: 5,
  },
  {
    id: '5',
    name: 'Parle-G Biscuit 200g',
    sku: 'SNK-0014',
    category: 'Snacks',
    unit: 'Piece',
    purchasePrice: 28.0,
    sellingPrice: 30.0,
    gstRate: '12%',
    openingStock: 120,
    currentStock: 120,
    lowStockLevel: 20,
  },
  {
    id: '6',
    name: 'Colgate Strong Teeth 10...',
    sku: 'PRC-0098',
    category: 'Personal Care',
    unit: 'Piece',
    purchasePrice: 38.0,
    sellingPrice: 45.0,
    gstRate: '18%',
    openingStock: 25,
    currentStock: 4,
    lowStockLevel: 10,
  },
  {
    id: '7',
    name: 'Surf Excel 1kg',
    sku: 'HHD-0331',
    category: 'Household',
    unit: 'Piece',
    purchasePrice: 98.0,
    sellingPrice: 120.0,
    gstRate: '18%',
    openingStock: 40,
    currentStock: 3,
    lowStockLevel: 8,
  },
  {
    id: '8',
    name: 'Cadbury Dairy Milk 55g',
    sku: 'SNK-0142',
    category: 'Chocolates',
    unit: 'Piece',
    purchasePrice: 35.0,
    sellingPrice: 40.0,
    gstRate: '18%',
    openingStock: 50,
    currentStock: 2,
    lowStockLevel: 10,
  },
];

const getCandidateUrls = (path: string): string[] => {
  const list = [`${API_BASE_URL}${path}`];

  if (Platform.OS === 'android') {
    const emu = `http://10.0.2.2:8080${path}`;
    const ip = `http://10.85.57.27:8080${path}`;
    const loc = `http://localhost:8080${path}`;

    if (!list.includes(emu)) list.push(emu);
    if (!list.includes(ip)) list.push(ip);
    if (!list.includes(loc)) list.push(loc);
  } else {
    const loc = `http://localhost:8080${path}`;
    if (!list.includes(loc)) list.push(loc);
  }

  return list;
};

const fetchWithFallback = async (
  path: string,
  options?: RequestInit,
): Promise<Response> => {
  const urls = getCandidateUrls(path);
  let lastErr: any = null;

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        ...(options || {}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error(`Unable to reach backend for ${path}`);
};

const ProductMasterScreen = ({navigation}: Props) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_DEMO_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const PRODUCTS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('Piece');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [igst, setIgst] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [openingStock, setOpeningStock] = useState('');

  const DEFAULT_CATEGORIES = [
    'Electronics',
    'Grocery',
    'Apparel',
    'Hardware',
    'Pharmacy',
    'FMCG',
    'Other',
  ];
  const DEFAULT_UNITS = [
    'Piece',
    'Kg',
    'Litre',
    'Box',
    'Meter',
    'Gram',
    'Pack',
    'Dozen',
  ];

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);
  const [units, setUnits] = useState<string[]>(DEFAULT_UNITS);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const loadCategories = async () => {
    try {
      const response = await fetchWithFallback('/api/categories');
      if (response && response.ok) {
        const result = await response.json();
        const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
        const dbCatNames: string[] = data.map((c: any) => c.category_name || c.name).filter(Boolean);
        if (dbCatNames.length > 0) {
          setCategories(Array.from(new Set([...DEFAULT_CATEGORIES, ...dbCatNames])));
        }
      }
    } catch (err) {
      console.log('Error loading categories:', err);
    }
  };

  const loadUnits = async () => {
    try {
      const response = await fetchWithFallback('/api/units');
      if (response && response.ok) {
        const result = await response.json();
        const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
        const dbUnitNames: string[] = data.map((u: any) => u.unit_name || u.name).filter(Boolean);
        if (dbUnitNames.length > 0) {
          setUnits(Array.from(new Set([...DEFAULT_UNITS, ...dbUnitNames])));
        }
      }
    } catch (err) {
      console.log('Error loading units:', err);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await fetchWithFallback('/api/products');

      if (response && response.ok) {
        const result = await response.json();
        const productData = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.products)
          ? result.products
          : Array.isArray(result)
          ? result
          : [];

        if (productData.length > 0) {
          const formatted: Product[] = productData.map((item: any) => {
            const pPrice =
              Number(
                item.purchase_price ?? item.purchasePrice ?? item.rate ?? 0,
              ) || 0;
            const sPrice =
              Number(
                item.selling_price ?? item.sellingPrice ?? item.price ?? 0,
              ) || 0;
            const oStock =
              Number(
                item.opening_stock ?? item.openingStock ?? item.stock ?? 0,
              ) || 0;
            const cStock =
              Number(
                item.current_stock ?? item.currentStock ?? oStock,
              ) || 0;
            const minStock =
              Number(
                item.minimum_stock ?? item.minimumStock ?? item.lowStockLevel ?? 5,
              ) || 5;

            const rawGst =
              item.gst_rate ?? item.gstRate ?? item.tax_rate ?? 0;
            const gstStr = String(rawGst).includes('%')
              ? String(rawGst)
              : `${rawGst}%`;

            return {
              id: String(item.id ?? Date.now()),
              name: item.product_name || item.name || item.productName || 'Product',
              sku: item.sku || item.product_code || item.code || '-',
              category: item.category_name || item.category || 'General',
              unit: item.unit || 'Piece',
              purchasePrice: pPrice,
              sellingPrice: sPrice,
              cgst: item.cgst !== undefined ? String(item.cgst) : '0',
              sgst: item.sgst !== undefined ? String(item.sgst) : '0',
              igst: item.igst !== undefined ? String(item.igst) : '0',
              gstRate: gstStr,
              openingStock: oStock,
              currentStock: cStock,
              lowStockLevel: minStock,
              hsnCode: item.hsn_code || item.hsnCode || '',
              description: item.description || '',
            };
          });

          setProducts(formatted);
        }
      }
    } catch (err) {
      console.log('Error loading products from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadUnits();
  }, []);

  const resetForm = () => {
    setName('');
    setSku('');
    setCategory('');
    setUnit('Piece');
    setPurchasePrice('');
    setSellingPrice('');
    setCgst('');
    setSgst('');
    setIgst('');
    setGstRate('');
    setOpeningStock('');
    setEditingProductId(null);
  };

  const openAddProductModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);
    setName(product.name || '');
    setSku(product.sku || '');
    setCategory(product.category || '');
    setUnit(product.unit || 'Piece');
    setPurchasePrice(
      product.purchasePrice !== undefined ? String(product.purchasePrice) : '',
    );
    setSellingPrice(
      product.sellingPrice !== undefined ? String(product.sellingPrice) : '',
    );
    setCgst(product.cgst || '');
    setSgst(product.sgst || '');
    setIgst(product.igst || '');
    setGstRate(product.gstRate || '');
    setOpeningStock(
      product.openingStock !== undefined ? String(product.openingStock) : '',
    );
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSaveProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Product Name is required');
      return;
    }

    const stockValue = parseInt(openingStock, 10) || 0;
    const purchasePriceValue = parseFloat(purchasePrice) || 0;
    const sellingPriceValue = parseFloat(sellingPrice) || 0;
    const cleanGstRate = parseFloat(gstRate.replace('%', '')) || 0;

    const payload = {
      product_name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category_name: category.trim() || 'General',
      unit: unit.trim() || 'Piece',
      purchase_price: purchasePriceValue,
      selling_price: sellingPriceValue,
      opening_stock: stockValue,
      current_stock: stockValue,
      gst_rate: cleanGstRate,
      cgst: parseFloat(cgst) || 0,
      sgst: parseFloat(sgst) || 0,
      igst: parseFloat(igst) || 0,
      minimum_stock: 5,
    };

    try {
      if (editingProductId) {
        await fetchWithFallback(`/api/products/${editingProductId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithFallback('/api/products', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.log('Backend sync skipped or offline:', err);
    }

    // Local state update
    const newProd: Product = {
      id: editingProductId || Date.now().toString(),
      name: name.trim(),
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      category: category.trim() || 'General',
      unit: unit.trim() || 'Piece',
      purchasePrice: purchasePriceValue,
      sellingPrice: sellingPriceValue,
      cgst: cgst || '0',
      sgst: sgst || '0',
      igst: igst || '0',
      gstRate: gstRate ? `${cleanGstRate}%` : '0%',
      openingStock: stockValue,
      currentStock: stockValue,
      lowStockLevel: 5,
    };

    if (editingProductId) {
      setProducts(prev =>
        prev.map(p => (p.id === editingProductId ? newProd : p)),
      );
      Alert.alert('Success', `Product "${name.trim()}" updated successfully!`);
    } else {
      setProducts(prev => [newProd, ...prev]);
      setCurrentPage(1);
      Alert.alert('Success', `Product "${name.trim()}" added successfully!`);
    }

    closeModal();
  };

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetchWithFallback(`/api/products/${product.id}`, {
                method: 'DELETE',
              });
            } catch (err) {
              console.log('Delete offline:', err);
            }
            setProducts(prev => prev.filter(p => p.id !== product.id));
          },
        },
      ],
    );
  };

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);
    const targetList =
      filteredProducts.length > 0 ? filteredProducts : products;
    downloadProducts(targetList, format);
  };

  // Filter products by search query
  const filteredProducts = products.filter(item => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (item.name && item.name.toLowerCase().includes(q)) ||
      (item.sku && item.sku.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q))
    );
  });

  const lowStockCount = products.filter(
    p => (p.currentStock ?? 0) <= (p.lowStockLevel ?? 5),
  ).length;

  // Pagination calculation
  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + PRODUCTS_PER_PAGE,
    filteredProducts.length,
  );
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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
          <Text style={styles.headerTitle}>Product Master</Text>
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
            placeholder="Search products, SKU..."
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

        {/* Export / Document Button */}
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
              <Text style={[styles.columnHeader, styles.colName]}>PRODUCT NAME</Text>
              <Text style={[styles.columnHeader, styles.colCode]}>CODE</Text>
              <Text style={[styles.columnHeader, styles.colPrice]}>PURCHASE</Text>
              <Text style={[styles.columnHeader, styles.colPrice]}>SELLING</Text>
              <Text style={[styles.columnHeader, styles.colCategory]}>CATEGORY</Text>
              <Text style={[styles.columnHeader, styles.colUnit]}>UNIT</Text>
              <Text style={[styles.columnHeader, styles.colGST]}>GST</Text>
              <Text style={[styles.columnHeader, styles.colGST]}>CGST</Text>
              <Text style={[styles.columnHeader, styles.colGST]}>SGST</Text>
              <Text style={[styles.columnHeader, styles.colGST]}>IGST</Text>
              <Text style={[styles.columnHeader, styles.colStock]}>STOCK</Text>
              <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentProducts.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const isLowStock = (item.currentStock ?? 0) <= (item.lowStockLevel ?? 5);

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.tableRow,
                    index === currentProducts.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* Product Name Column */}
                  <View style={styles.colName}>
                    <Text style={styles.cellNameText} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text style={styles.cellSkuSubtext} numberOfLines={1}>
                      {item.sku}
                    </Text>
                  </View>

                  {/* Code Column */}
                  <View style={styles.colCode}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.sku}
                    </Text>
                  </View>

                  {/* Purchase Price Column */}
                  <View style={styles.colPrice}>
                    <Text style={styles.cellPurchaseText}>
                      ₹{(item.purchasePrice ?? 0).toFixed(1)}
                    </Text>
                  </View>

                  {/* Selling Price Column */}
                  <View style={styles.colPrice}>
                    <Text style={styles.cellSellingText}>
                      ₹{(item.sellingPrice ?? 0).toFixed(1)}
                    </Text>
                  </View>

                  {/* Category Column */}
                  <View style={styles.colCategory}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.category || '-'}
                    </Text>
                  </View>

                  {/* Unit Column */}
                  <View style={styles.colUnit}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.unit || '-'}
                    </Text>
                  </View>

                  {/* GST Column */}
                  <View style={styles.colGST}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.gstRate || '0%'}
                    </Text>
                  </View>

                  {/* CGST Column */}
                  <View style={styles.colGST}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.cgst || '0'}
                    </Text>
                  </View>

                  {/* SGST Column */}
                  <View style={styles.colGST}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.sgst || '0'}
                    </Text>
                  </View>

                  {/* IGST Column */}
                  <View style={styles.colGST}>
                    <Text style={styles.cellCodeText} numberOfLines={1}>
                      {item.igst || '0'}
                    </Text>
                  </View>

                  {/* Stock Column */}
                  <View style={styles.colStock}>
                    <View
                      style={[
                        styles.stockBadge,
                        isLowStock && styles.stockBadgeLow,
                      ]}>
                      <Text
                        style={[
                          styles.stockBadgeText,
                          isLowStock && styles.stockBadgeTextLow,
                        ]}>
                        {item.currentStock ?? 0}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditProductModal(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleDeleteProduct(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentProducts.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No products found.</Text>
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
        {filteredProducts.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredProducts.length}`}
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
        onPress={openAddProductModal}>
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
            <Text style={styles.exportMenuTitle}>Export Products</Text>
            <TouchableOpacity
              style={styles.exportOptionRow}
              onPress={() => handleDownload('pdf')}>
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={styles.exportOptionText}>Download as PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.exportOptionRow}
              onPress={() => handleDownload('excel')}>
              <Text style={styles.exportOptionIcon}>📊</Text>
              <Text style={styles.exportOptionText}>Download as Excel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================================================= */}
      {/* 8. ADD / EDIT PRODUCT MODAL                       */}
      {/* ================================================= */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.formModalCard}>
            <View style={styles.formModalHeader}>
              <Text style={styles.formModalTitle}>
                {editingProductId ? 'Edit Product' : 'Add New Product'}
              </Text>
              <TouchableOpacity
                onPress={closeModal}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Text style={styles.formModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.formContent}>
              <Text style={styles.inputLabel}>Product Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter product name"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Product Code</Text>
              <TextInput
                style={styles.formInput}
                placeholder="Enter product code"
                value={sku}
                onChangeText={setSku}
              />

              <View style={styles.twoColumnRow}>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>Purchase Price</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                  />
                </View>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>Selling Price</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0.00"
                    keyboardType="numeric"
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                  />
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>Category</Text>
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.selectBtn}
                      onPress={() => {
                        setShowCategoryDropdown(!showCategoryDropdown);
                        setShowUnitDropdown(false);
                      }}
                      activeOpacity={0.8}>
                      <Text style={[styles.selectBtnText, !category && styles.placeholderText]}>
                        {category || 'Select category'}
                      </Text>
                      <Text style={styles.arrowIcon}>{showCategoryDropdown ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {showCategoryDropdown && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                          {categories.length === 0 ? (
                            <Text style={[styles.emptyText, {padding: 10}]}>No categories found</Text>
                          ) : (
                            categories.map((c) => (
                              <TouchableOpacity
                                key={c}
                                style={styles.dropdownMenuItem}
                                onPress={() => {
                                  setCategory(c);
                                  setShowCategoryDropdown(false);
                                }}>
                                <Text style={styles.dropdownMainText}>{c}</Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
                
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>Unit</Text>
                  <View style={styles.dropdownContainer}>
                    <TouchableOpacity
                      style={styles.selectBtn}
                      onPress={() => {
                        setShowUnitDropdown(!showUnitDropdown);
                        setShowCategoryDropdown(false);
                      }}
                      activeOpacity={0.8}>
                      <Text style={[styles.selectBtnText, !unit && styles.placeholderText]}>
                        {unit || 'Select unit'}
                      </Text>
                      <Text style={styles.arrowIcon}>{showUnitDropdown ? '▲' : '▼'}</Text>
                    </TouchableOpacity>

                    {showUnitDropdown && (
                      <View style={styles.dropdownMenu}>
                        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                          {units.length === 0 ? (
                            <Text style={[styles.emptyText, {padding: 10}]}>No units found</Text>
                          ) : (
                            units.map((u) => (
                              <TouchableOpacity
                                key={u}
                                style={styles.dropdownMenuItem}
                                onPress={() => {
                                  setUnit(u);
                                  setShowUnitDropdown(false);
                                }}>
                                <Text style={styles.dropdownMainText}>{u}</Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>GST (%)</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={gstRate}
                    onChangeText={setGstRate}
                  />
                </View>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>CGST</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={cgst}
                    onChangeText={setCgst}
                  />
                </View>
              </View>

              <View style={styles.twoColumnRow}>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>SGST</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={sgst}
                    onChangeText={setSgst}
                  />
                </View>
                <View style={styles.halfColumn}>
                  <Text style={styles.inputLabel}>IGST</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="0"
                    keyboardType="numeric"
                    value={igst}
                    onChangeText={setIgst}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Stock</Text>
              <TextInput
                style={styles.formInput}
                placeholder="0"
                keyboardType="numeric"
                value={openingStock}
                onChangeText={setOpeningStock}
              />
            </ScrollView>

            <View style={styles.formModalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveProduct}>
                <Text style={styles.saveBtnText}>
                  {editingProductId ? 'Update Product' : 'Save Product'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductMasterScreen;

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

  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginTop: 2,
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

  // ---- 3. SWIPE HINT ----
  swipeHintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    marginBottom: 10,
  },

  swipeHintArrow: {
    fontSize: 13,
    color: '#94a3b8',
    marginRight: 6,
    fontWeight: '700',
  },

  swipeHintText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // ---- 4. TABLE CARD ----
  tableCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },

  horizontalTableScroll: {
    minWidth: '100%',
  },

  // Column Widths
  colIndex: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colName: {
    width: 190,
    justifyContent: 'center',
    paddingRight: 10,
  },
  colCode: {
    width: 110,
    justifyContent: 'center',
  },
  colPrice: {
    width: 95,
    justifyContent: 'center',
  },
  colStock: {
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colActions: {
    width: 85,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  colCategory: {
    width: 120,
    justifyContent: 'center',
    paddingRight: 10,
  },
  colUnit: {
    width: 80,
    justifyContent: 'center',
  },
  colGST: {
    width: 75,
    justifyContent: 'center',
  },

  // Table Header
  tableHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff7ed',
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },

  columnHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
    letterSpacing: 0.5,
  },

  // Table Body Rows
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },

  tableRowLast: {
    borderBottomWidth: 0,
  },

  cellIndexText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },

  cellNameText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  cellSkuSubtext: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
    fontWeight: '500',
  },

  cellCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  cellPurchaseText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  cellSellingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },

  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },

  stockBadgeLow: {
    backgroundColor: '#fef2f2',
  },

  stockBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },

  stockBadgeTextLow: {
    color: '#ef4444',
  },

  actionBtn: {
    padding: 4,
  },

  editActionIcon: {
    fontSize: 14,
  },

  deleteActionIcon: {
    fontSize: 14,
  },

  emptyTable: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },

  // Scroll Bar Track
  scrollTrack: {
    height: 4,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 16,
    borderRadius: 2,
    marginBottom: 8,
  },

  scrollThumb: {
    width: 80,
    height: 4,
    backgroundColor: '#ea7e30',
    borderRadius: 2,
  },

  // ---- 5. PAGINATION FOOTER ----
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
    color: '#64748b',
    fontWeight: '500',
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
  },

  pageBtnDisabled: {
    opacity: 0.4,
  },

  pageBtnText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '700',
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

  // ---- 6. FLOATING ADD BUTTON ----
  floatingAddButton: {
    position: 'absolute',
    bottom: 50,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },

  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3.2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  addIconV: {
    position: 'absolute',
    width: 3.2,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },

  // ---- MODAL OVERLAYS & FORMS ----
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  exportMenuCard: {
    width: 260,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },

  exportMenuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 14,
  },

  exportOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  exportOptionIcon: {
    fontSize: 18,
    marginRight: 12,
  },

  exportOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },

  formModalCard: {
    width: '100%',
    maxHeight: '85%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },

  formModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  formModalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },

  formModalClose: {
    fontSize: 16,
    fontWeight: '700',
    color: '#94a3b8',
    padding: 4,
  },

  formContent: {
    paddingVertical: 14,
  },

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

  twoColumnRow: {
    flexDirection: 'row',
    gap: 12,
  },

  halfColumn: {
    flex: 1,
  },

  dropdownContainer: {
    position: 'relative',
    zIndex: 9999,
  },
  selectBtn: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBtnText: {
    fontSize: 14,
    color: '#1e293b',
    flex: 1,
  },
  placeholderText: {
    color: '#94a3b8',
  },
  arrowIcon: {
    fontSize: 10,
    color: '#64748b',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 9999,
    overflow: 'hidden',
    maxHeight: 150,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownMainText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },

  formModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },

  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },

  saveBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: '#ea7e30',
  },

  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
