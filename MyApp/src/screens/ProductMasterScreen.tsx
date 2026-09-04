// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
//   Alert,
//   Modal,
//   Platform,
//   RefreshControl,
//   ActivityIndicator,
// } from 'react-native';
// import {API_BASE_URL} from '../api/config';
// import {downloadProducts} from '../utils/exportHelper';

// type Props = {
//   navigation: any;
//   route: any;
// };

// export interface Product {
//   id: string;
//   name: string;
//   sku: string;
//   category: string;
//   unit: string;
//   purchasePrice?: number;
//   sellingPrice?: number;
//   cgst?: string;
//   sgst?: string;
//   igst?: string;
//   gstRate: string;
//   openingStock: number;
//   currentStock: number;
//   lowStockLevel: number;
//   hsnCode?: string;
//   description?: string;
// }

// const DEFAULT_CATEGORIES = [
//   'Electronics',
//   'Office Supplies',
//   'Furniture',
//   'Clothing',
//   'Food',
//   'Grocery',
//   'Stationery',
//   'Cosmetics',
//   'Hardware',
//   'Software',
//   'Beverages',
//   'Medical',
//   'Automobile',
//   'General',
// ];

// const DEFAULT_PRODUCTS: Product[] = [
//   {
//     id: '1',
//     name: 'Laptop i7 16GB',
//     sku: 'PROD-1001',
//     category: 'Electronics',
//     unit: 'PCS',
//     purchasePrice: 45000,
//     sellingPrice: 52000,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 25,
//     currentStock: 25,
//     lowStockLevel: 5,
//     hsnCode: '8471',
//     description: 'High performance 16GB RAM Intel Core i7 laptop',
//   },
//   {
//     id: '2',
//     name: 'Wireless Keyboard',
//     sku: 'PROD-1002',
//     category: 'Office Supplies',
//     unit: 'PCS',
//     purchasePrice: 1200,
//     sellingPrice: 1500,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 50,
//     currentStock: 50,
//     lowStockLevel: 10,
//     hsnCode: '8471',
//     description: 'Ergonomic 2.4GHz wireless membrane keyboard',
//   },
//   {
//     id: '3',
//     name: 'Ergonomic Office Chair',
//     sku: 'PROD-1003',
//     category: 'Furniture',
//     unit: 'PCS',
//     purchasePrice: 7500,
//     sellingPrice: 9500,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 15,
//     currentStock: 15,
//     lowStockLevel: 2,
//     hsnCode: '9401',
//     description: 'Adjustable lumbar support breathable mesh chair',
//   },
//   {
//     id: '4',
//     name: 'Dell 24-inch IPS Monitor',
//     sku: 'PROD-1004',
//     category: 'Electronics',
//     unit: 'PCS',
//     purchasePrice: 11000,
//     sellingPrice: 13500,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 18,
//     currentStock: 18,
//     lowStockLevel: 3,
//     hsnCode: '8528',
//     description: 'Full HD 1080p borderless display monitor',
//   },
//   {
//     id: '5',
//     name: 'A4 Copier Paper Ream (500 sheets)',
//     sku: 'PROD-1005',
//     category: 'Office Supplies',
//     unit: 'Pack',
//     purchasePrice: 220,
//     sellingPrice: 280,
//     cgst: '6',
//     sgst: '6',
//     igst: '0',
//     gstRate: '12%',
//     openingStock: 120,
//     currentStock: 120,
//     lowStockLevel: 20,
//     hsnCode: '4802',
//     description: '75 GSM multipurpose white copier paper',
//   },
//   {
//     id: '6',
//     name: 'Logitech Optical Mouse M90',
//     sku: 'PROD-1006',
//     category: 'Electronics',
//     unit: 'PCS',
//     purchasePrice: 280,
//     sellingPrice: 380,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 65,
//     currentStock: 65,
//     lowStockLevel: 10,
//     hsnCode: '8471',
//     description: 'USB wired optical high precision mouse',
//   },
//   {
//     id: '7',
//     name: 'Executive Wooden Desk 4x2 ft',
//     sku: 'PROD-1007',
//     category: 'Furniture',
//     unit: 'PCS',
//     purchasePrice: 12500,
//     sellingPrice: 16000,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 8,
//     currentStock: 8,
//     lowStockLevel: 2,
//     hsnCode: '9403',
//     description: 'Engineered wood office executive workstation',
//   },
//   {
//     id: '8',
//     name: 'Basmati Rice Premium 25kg',
//     sku: 'PROD-1008',
//     category: 'Grocery',
//     unit: 'Bag',
//     purchasePrice: 2200,
//     sellingPrice: 2600,
//     cgst: '2.5',
//     sgst: '2.5',
//     igst: '0',
//     gstRate: '5%',
//     openingStock: 40,
//     currentStock: 40,
//     lowStockLevel: 5,
//     hsnCode: '1006',
//     description: 'Long grain aged aromatic royal basmati rice',
//   },
//   {
//     id: '9',
//     name: 'Schneider Ballpoint Pens (Pack of 10)',
//     sku: 'PROD-1009',
//     category: 'Stationery',
//     unit: 'Pack',
//     purchasePrice: 90,
//     sellingPrice: 130,
//     cgst: '6',
//     sgst: '6',
//     igst: '0',
//     gstRate: '12%',
//     openingStock: 85,
//     currentStock: 85,
//     lowStockLevel: 15,
//     hsnCode: '9608',
//     description: 'Smooth ink blue flow ballpoint pens',
//   },
//   {
//     id: '10',
//     name: 'Thermal Receipt Paper Roll 80mm',
//     sku: 'PROD-1010',
//     category: 'Office Supplies',
//     unit: 'Box',
//     purchasePrice: 450,
//     sellingPrice: 650,
//     cgst: '6',
//     sgst: '6',
//     igst: '0',
//     gstRate: '12%',
//     openingStock: 35,
//     currentStock: 35,
//     lowStockLevel: 8,
//     hsnCode: '4811',
//     description: 'Standard 80mm POS billing receipt rolls',
//   },
//   {
//     id: '11',
//     name: 'HP LaserJet Toner Cartridge 88A',
//     sku: 'PROD-1011',
//     category: 'Electronics',
//     unit: 'PCS',
//     purchasePrice: 850,
//     sellingPrice: 1200,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 22,
//     currentStock: 22,
//     lowStockLevel: 4,
//     hsnCode: '8443',
//     description: 'High yield black monochrome toner cartridge',
//   },
//   {
//     id: '12',
//     name: 'Metal File Cabinet 4 Drawers',
//     sku: 'PROD-1012',
//     category: 'Furniture',
//     unit: 'PCS',
//     purchasePrice: 8200,
//     sellingPrice: 10500,
//     cgst: '9',
//     sgst: '9',
//     igst: '0',
//     gstRate: '18%',
//     openingStock: 6,
//     currentStock: 6,
//     lowStockLevel: 2,
//     hsnCode: '9403',
//     description: 'Heavy duty cold rolled steel lockable file cabinet',
//   },
// ];

// /**
//  * Candidate URLs for backend API connection across Android Emulator & Physical Device
//  */
// const getCandidateUrls = (path: string): string[] => {
//   const list = [`${API_BASE_URL}${path}`];
//   if (Platform.OS === 'android') {
//     const emu = `http://10.0.2.2:8080${path}`;
//     const ip = `http://10.85.57.27:8080${path}`;
//     const loc = `http://localhost:8080${path}`;
//     if (!list.includes(emu)) list.push(emu);
//     if (!list.includes(ip)) list.push(ip);
//     if (!list.includes(loc)) list.push(loc);
//   } else {
//     const loc = `http://localhost:8080${path}`;
//     if (!list.includes(loc)) list.push(loc);
//   }
//   return list;
// };

// const fetchWithFallback = async (
//   path: string,
//   options?: RequestInit,
// ): Promise<Response> => {
//   const urls = getCandidateUrls(path);
//   let lastErr: any = null;

//   for (const url of urls) {
//     try {
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 3500);

//       const res = await fetch(url, {
//         ...(options || {}),
//         signal: controller.signal,
//       });
//       clearTimeout(timeoutId);

//       if (res.ok || res.status < 500) {
//         return res;
//       }
//     } catch (err) {
//       lastErr = err;
//     }
//   }

//   throw lastErr || new Error(`Unable to reach backend for ${path}`);
// };

// const ProductMasterScreen = ({navigation}: Props) => {
//   const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const PRODUCTS_PER_PAGE = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingProductId, setEditingProductId] = useState<string | null>(null);

//   // FORM
//   const [name, setName] = useState('');
//   const [sku, setSku] = useState('');
//   const [category, setCategory] = useState('');
//   const [unit, setUnit] = useState('Piece');

//   const [purchasePrice, setPurchasePrice] = useState('');
//   const [sellingPrice, setSellingPrice] = useState('');

//   const [cgst, setCgst] = useState('');
//   const [sgst, setSgst] = useState('');
//   const [igst, setIgst] = useState('');
//   const [gstRate, setGstRate] = useState('');
//   const [openingStock, setOpeningStock] = useState('');

//   // CATEGORY
//   const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
//   const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

//   // ============================================================
//   // LOAD DATA FROM DATABASE
//   // ============================================================

//   const loadCategories = async () => {
//     try {
//       const response = await fetchWithFallback('/api/categories');

//       if (response && response.ok) {
//         const result = await response.json();

//         const data = Array.isArray(result?.data)
//           ? result.data
//           : Array.isArray(result)
//           ? result
//           : [];

//         const dbCatNames: string[] = data
//           .map((c: any) => c.category_name || c.name)
//           .filter(Boolean);

//         const merged = Array.from(
//           new Set([...dbCatNames, ...DEFAULT_CATEGORIES]),
//         );

//         setCategories(merged);
//       }
//     } catch (err) {
//       console.log('Error loading categories:', err);
//     }
//   };

//   const loadProducts = async () => {
//     try {
//       setLoading(true);

//       const response = await fetchWithFallback('/api/products');

//       if (response && response.ok) {
//         const result = await response.json();

//         const productData = Array.isArray(result?.data)
//           ? result.data
//           : Array.isArray(result?.products)
//           ? result.products
//           : Array.isArray(result)
//           ? result
//           : [];

//         if (productData.length > 0) {
//           const formatted: Product[] = productData.map((item: any) => {
//             const pPrice =
//               Number(
//                 item.purchase_price ??
//                   item.purchasePrice ??
//                   item.rate ??
//                   0,
//               ) || 0;
//             const sPrice =
//               Number(
//                 item.selling_price ??
//                   item.sellingPrice ??
//                   item.price ??
//                   0,
//               ) || 0;
//             const oStock =
//               Number(
//                 item.opening_stock ??
//                   item.openingStock ??
//                   item.stock ??
//                   0,
//               ) || 0;
//             const cStock =
//               Number(
//                 item.current_stock !== undefined &&
//                   item.current_stock !== null
//                   ? item.current_stock
//                   : item.currentStock !== undefined &&
//                     item.currentStock !== null
//                   ? item.currentStock
//                   : oStock,
//               ) || 0;
//             const minStock =
//               Number(
//                 item.minimum_stock ??
//                   item.minimumStock ??
//                   item.lowStockLevel ??
//                   5,
//               ) || 5;

//             const rawGst =
//               item.gst_rate ??
//               item.gstRate ??
//               item.tax_rate ??
//               0;
//             const gstStr = String(rawGst).includes('%')
//               ? String(rawGst)
//               : `${rawGst}%`;

//             return {
//               id: String(item.id ?? Date.now()),
//               name:
//                 item.product_name ||
//                 item.name ||
//                 item.productName ||
//                 'Product',
//               sku: item.sku || item.product_code || item.code || '-',
//               category:
//                 item.category_name ||
//                 item.category ||
//                 'General',
//               unit: item.unit || 'Piece',
//               purchasePrice: pPrice,
//               sellingPrice: sPrice,
//               cgst:
//                 item.cgst !== undefined && item.cgst !== null
//                   ? String(item.cgst)
//                   : '0',
//               sgst:
//                 item.sgst !== undefined && item.sgst !== null
//                   ? String(item.sgst)
//                   : '0',
//               igst:
//                 item.igst !== undefined && item.igst !== null
//                   ? String(item.igst)
//                   : '0',
//               gstRate: gstStr,
//               openingStock: oStock,
//               currentStock: cStock,
//               lowStockLevel: minStock,
//               hsnCode: item.hsn_code || item.hsnCode || '',
//               description: item.description || '',
//             };
//           });

//           setProducts(formatted);
//         }
//       }
//     } catch (err) {
//       console.log('Error loading products from DB:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Run on mount and on screen focus
//   useEffect(() => {
//     loadProducts();
//     loadCategories();

//     const unsubscribe = navigation?.addListener
//       ? navigation.addListener('focus', () => {
//           loadProducts();
//           loadCategories();
//         })
//       : undefined;

//     return unsubscribe;
//   }, [navigation]);

//   const filteredCategories = categories.filter(item =>
//     item.toLowerCase().includes(category.toLowerCase().trim()),
//   );

//   // ============================================================
//   // RESET FORM
//   // ============================================================

//   const resetForm = () => {
//     setName('');
//     setSku('');
//     setCategory('');
//     setUnit('Piece');

//     setPurchasePrice('');
//     setSellingPrice('');

//     setCgst('');
//     setSgst('');
//     setIgst('');
//     setGstRate('');
//     setOpeningStock('');

//     setEditingProductId(null);
//     setCategoryDropdownVisible(false);
//   };

//   // ============================================================
//   // ADD PRODUCT
//   // ============================================================

//   const openAddProductModal = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   // ============================================================
//   // EDIT PRODUCT
//   // ============================================================

//   const openEditProductModal = (product: Product) => {
//     setEditingProductId(product.id);

//     setName(product.name || '');
//     setSku(product.sku || '');
//     setCategory(product.category || '');
//     setUnit(product.unit || 'Piece');

//     setPurchasePrice(
//       product.purchasePrice !== undefined
//         ? String(product.purchasePrice)
//         : '',
//     );

//     setSellingPrice(
//       product.sellingPrice !== undefined
//         ? String(product.sellingPrice)
//         : '',
//     );

//     setCgst(product.cgst || '');
//     setSgst(product.sgst || '');
//     setIgst(product.igst || '');
//     setGstRate(product.gstRate || '');

//     setOpeningStock(
//       product.openingStock !== undefined
//         ? String(product.openingStock)
//         : '',
//     );

//     setCategoryDropdownVisible(false);
//     setModalVisible(true);
//   };

//   // ============================================================
//   // CLOSE MODAL
//   // ============================================================

//   const closeModal = () => {
//     setModalVisible(false);
//     resetForm();
//   };

//   // ============================================================
//   // SAVE PRODUCT (DATABASE + STATE)
//   // ============================================================

//   const handleSaveProduct = async () => {
//     if (!name.trim()) {
//       Alert.alert('Validation Error', 'Product Name is required');
//       return;
//     }

//     const stockValue = parseInt(openingStock, 10) || 0;
//     const purchasePriceValue = parseFloat(purchasePrice) || 0;
//     const sellingPriceValue = parseFloat(sellingPrice) || 0;
//     const cleanGstRate = parseFloat(gstRate.replace('%', '')) || 0;

//     const payload = {
//       product_name: name.trim(),
//       sku: sku.trim() || undefined,
//       category_name: category.trim() || 'General',
//       unit: unit.trim() || 'Piece',
//       purchase_price: purchasePriceValue,
//       selling_price: sellingPriceValue,
//       opening_stock: stockValue,
//       current_stock: stockValue,
//       gst_rate: cleanGstRate,
//       cgst: parseFloat(cgst) || 0,
//       sgst: parseFloat(sgst) || 0,
//       igst: parseFloat(igst) || 0,
//       minimum_stock: 5,
//     };

//     try {
//       if (editingProductId) {
//         await fetchWithFallback(`/api/products/${editingProductId}`, {
//           method: 'PUT',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });

//         Alert.alert(
//           'Success',
//           `Product "${name.trim()}" updated successfully!`,
//         );
//       } else {
//         await fetchWithFallback('/api/products', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(payload),
//         });

//         Alert.alert(
//           'Success',
//           `Product "${name.trim()}" added successfully!`,
//         );
//       }

//       closeModal();
//       await loadProducts();
//       await loadCategories();
//     } catch (err: any) {
//       console.error('Save product error:', err);

//       // Fallback local update
//       const newProd: Product = {
//         id: editingProductId || Date.now().toString(),
//         name: name.trim(),
//         sku: sku.trim() || `PROD-${Date.now().toString().slice(-4)}`,
//         category: category.trim() || 'General',
//         unit: unit.trim() || 'Piece',
//         purchasePrice: purchasePriceValue,
//         sellingPrice: sellingPriceValue,
//         cgst: cgst || '0',
//         sgst: sgst || '0',
//         igst: igst || '0',
//         gstRate: gstRate || '0%',
//         openingStock: stockValue,
//         currentStock: stockValue,
//         lowStockLevel: 5,
//       };

//       if (editingProductId) {
//         setProducts(prev =>
//           prev.map(p => (p.id === editingProductId ? newProd : p)),
//         );
//         Alert.alert('Success', `Product "${name.trim()}" updated successfully!`);
//       } else {
//         setProducts(prev => [newProd, ...prev]);
//         setCurrentPage(1);
//         Alert.alert('Success', `Product "${name.trim()}" added successfully!`);
//       }

//       closeModal();
//     }
//   };

//   // ============================================================
//   // DELETE
//   // ============================================================

//   const handleDeleteProduct = (product: Product) => {
//     Alert.alert(
//       'Delete Product',
//       `Are you sure you want to delete "${product.name}"?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: async () => {
//             try {
//               await fetchWithFallback(`/api/products/${product.id}`, {
//                 method: 'DELETE',
//               });
//             } catch (err: any) {
//               console.error('Delete product error:', err);
//             }
//             setProducts(prev => prev.filter(p => p.id !== product.id));
//           },
//         },
//       ],
//     );
//   };

//   // ============================================================
//   // DOWNLOAD LIST (PDF & EXCEL)
//   // ============================================================

//   const handleDownload = (format: 'pdf' | 'excel') => {
//     setDownloadMenuVisible(false);

//     const targetList =
//       filteredProducts.length > 0 ? filteredProducts : products;

//     downloadProducts(targetList, format);
//   };

//   // ============================================================
//   // SEARCH
//   // ============================================================

//   const filteredProducts = products.filter(product => {
//     const query = searchQuery.toLowerCase().trim();

//     if (!query) {
//       return true;
//     }

//     return (
//       product.name.toLowerCase().includes(query) ||
//       product.category.toLowerCase().includes(query) ||
//       product.sku.toLowerCase().includes(query)
//     );
//   });

//   // ============================================================
//   // PAGINATION
//   // ============================================================

//   const totalPages = Math.max(
//     1,
//     Math.ceil(
//       filteredProducts.length / PRODUCTS_PER_PAGE,
//     ),
//   );

//   const paginatedProducts = filteredProducts.slice(
//     (currentPage - 1) * PRODUCTS_PER_PAGE,
//     currentPage * PRODUCTS_PER_PAGE,
//   );

//   useEffect(() => {
//     if (currentPage > totalPages) {
//       setCurrentPage(totalPages);
//     }
//   }, [currentPage, totalPages]);

//   const handleSearchChange = (text: string) => {
//     setSearchQuery(text);
//     setCurrentPage(1);
//   };

//   const goToPreviousPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage(prev => prev - 1);
//     }
//   };

//   const goToNextPage = () => {
//     if (currentPage < totalPages) {
//       setCurrentPage(prev => prev + 1);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backBtn}
//           onPress={() => navigation.goBack()}>
//           <Text style={styles.backText}>←</Text>
//         </TouchableOpacity>

//         <View style={styles.headerTitleBox}>
//           <Text style={styles.headerTitle}>
//             Product Directory
//           </Text>

//           <Text style={styles.headerSubtitle}>
//             Manage all products
//           </Text>
//         </View>

//         {loading && (
//           <ActivityIndicator size="small" color="#ffffff" style={styles.headerLoader} />
//         )}
//       </View>

//       {/* CONTENT */}
//       <View style={styles.content}>
//         {/* SEARCH ROW */}
//         <View style={styles.searchRow}>
//           {/* SEARCH BOX */}
//           <View style={styles.searchBox}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search product name, SKU or category"
//               placeholderTextColor="#94a3b8"
//               value={searchQuery}
//               onChangeText={handleSearchChange}
//             />

//             {searchQuery.length > 0 && (
//               <TouchableOpacity
//                 style={styles.clearBtn}
//                 activeOpacity={0.7}
//                 onPress={() => {
//                   setSearchQuery('');
//                   setCurrentPage(1);
//                 }}>
//                 <Text style={styles.clearBtnText}>✕</Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* FILE BUTTON OUTSIDE SEARCH BOX */}
//           <TouchableOpacity
//             style={styles.fileButton}
//             activeOpacity={0.7}
//             onPress={() =>
//               setDownloadMenuVisible(
//                 prev => !prev,
//               )
//             }>
//             <View style={styles.fileIcon}>
//               <View style={styles.fileIconFold} />
//               <View style={styles.fileIconLine} />
//               <View style={styles.fileIconLine} />
//               <View style={styles.fileIconLineShort} />
//             </View>
//           </TouchableOpacity>

//           {/* DOWNLOAD MENU */}
//           {downloadMenuVisible && (
//              <View style={styles.downloadMenu}>
//                <TouchableOpacity
//                  style={styles.downloadMenuItem}
//                  activeOpacity={0.7}
//                  onPress={() => handleDownload('pdf')}>
//                  <Text style={styles.downloadMenuIcon}>📄</Text>
//                  <Text style={styles.downloadMenuText}>PDF</Text>
//                </TouchableOpacity>

//                <View style={styles.downloadMenuDivider} />

//                <TouchableOpacity
//                  style={styles.downloadMenuItem}
//                  activeOpacity={0.7}
//                  onPress={() => handleDownload('excel')}>
//                  <Text style={styles.downloadMenuIcon}>📊</Text>
//                  <Text style={styles.downloadMenuText}>Excel</Text>
//                </TouchableOpacity>
//              </View>
//            )}
//         </View>

//         {/* SECTION HEADER */}
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>
//               Product Directory
//             </Text>

//             <Text style={styles.totalText}>
//               Total Products: {products.length}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.addProductButton}
//             activeOpacity={0.8}
//             onPress={openAddProductModal}>
//             <Text style={styles.addProductPlus}>+</Text>
//             <Text style={styles.addProductButtonText}></Text>
//           </TouchableOpacity>
//         </View>

//         {/* TABLE */}
//         <View style={styles.tableWrapper}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={true}>
//             <View style={styles.tableContainer}>
//               {/* TABLE HEADER */}
//               <View style={styles.tableHeaderRow}>
//                 <Text style={[styles.headerCell, styles.colNumber]}>#</Text>
//                 <Text style={[styles.headerCell, styles.colName]}>Product Name</Text>
//                 <Text style={[styles.headerCell, styles.colSku]}>Product Code</Text>
//                 <Text style={[styles.headerCell, styles.colPrice]}>Purchase Price</Text>
//                 <Text style={[styles.headerCell, styles.colPrice]}>Selling Price</Text>
//                 <Text style={[styles.headerCell, styles.colCategory]}>Category</Text>
//                 <Text style={[styles.headerCell, styles.colUnit]}>Unit</Text>
//                 <Text style={[styles.headerCell, styles.colGst]}>GST</Text>
//                 <Text style={[styles.headerCell, styles.colTax]}>CGST</Text>
//                 <Text style={[styles.headerCell, styles.colTax]}>SGST</Text>
//                 <Text style={[styles.headerCell, styles.colTax]}>IGST</Text>
//                 <Text style={[styles.headerCell, styles.colStock]}>Stock</Text>
//                 <Text style={[styles.headerCell, styles.colAction]}>Action</Text>
//               </View>

//               {/* TABLE BODY */}
//               <ScrollView
//                 style={styles.tableBody}
//                 showsVerticalScrollIndicator={true}
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={loading}
//                     onRefresh={() => {
//                       loadProducts();
//                       loadCategories();
//                     }}
//                     colors={['#4338ca']}
//                   />
//                 }>
//                 {filteredProducts.length === 0 ? (
//                   <View style={styles.emptyContainer}>
//                     <Text style={styles.emptyText}>
//                       {products.length === 0
//                         ? 'No products added yet.'
//                         : 'No products found.'}
//                     </Text>

//                     <TouchableOpacity
//                       style={styles.emptyAddBtn}
//                       onPress={openAddProductModal}>
//                       <Text style={styles.emptyAddBtnText}>+ Add Product</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   paginatedProducts.map(
//                     (product, index) => (
//                       <TouchableOpacity
//                         key={product.id}
//                         activeOpacity={0.7}
//                         style={[
//                           styles.tableRow,
//                           index % 2 === 1 && styles.tableRowAlternate,
//                         ]}
//                         onPress={() => openEditProductModal(product)}>
//                         <Text style={[styles.bodyCell, styles.colNumber]}>
//                           {(currentPage - 1) * PRODUCTS_PER_PAGE + index + 1}
//                         </Text>

//                         <View style={[styles.nameCell, styles.colName]}>
//                           <Text style={styles.productName} numberOfLines={1}>
//                             {product.name}
//                           </Text>
//                         </View>

//                         <Text style={[styles.bodyCell, styles.colSku]} numberOfLines={1}>
//                           {product.sku || '-'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colPrice, styles.priceText]}>
//                           ₹ {Number(product.purchasePrice || 0).toFixed(2)}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colPrice, styles.priceText]}>
//                           ₹ {Number(product.sellingPrice || 0).toFixed(2)}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colCategory]} numberOfLines={1}>
//                           {product.category || '-'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colUnit]}>
//                           {product.unit || 'Piece'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colGst, styles.boldText]}>
//                           {product.gstRate || '0%'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colTax]}>
//                           {product.cgst || '-'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colTax]}>
//                           {product.sgst || '-'}
//                         </Text>

//                         <Text style={[styles.bodyCell, styles.colTax]}>
//                           {product.igst || '-'}
//                         </Text>

//                         <View style={[styles.stockCell, styles.colStock]}>
//                           <View style={styles.stockBadge}>
//                             <Text style={styles.stockText}>
//                               {product.currentStock ?? 0}
//                             </Text>
//                           </View>
//                         </View>

//                         {/* ACTION */}
//                         <View style={[styles.actionCell, styles.colAction]}>
//                           {/* EDIT */}
//                           <TouchableOpacity
//                             style={styles.editButton}
//                             activeOpacity={0.7}
//                             onPress={event => {
//                               event.stopPropagation();
//                               openEditProductModal(product);
//                             }}>
//                             <Text style={styles.editIcon}>✎</Text>
//                           </TouchableOpacity>

//                           {/* DELETE */}
//                           <TouchableOpacity
//                             style={styles.deleteButton}
//                             activeOpacity={0.7}
//                             onPress={event => {
//                               event.stopPropagation();
//                               handleDeleteProduct(product);
//                             }}>
//                             <View style={styles.binIcon}>
//                               <View style={styles.binLid}>
//                                 <View style={styles.binHandle} />
//                               </View>
//                               <View style={styles.binBody}>
//                                 <View style={styles.binInnerLine} />
//                                 <View style={styles.binInnerLine} />
//                               </View>
//                             </View>
//                           </TouchableOpacity>
//                         </View>
//                       </TouchableOpacity>
//                     ),
//                   )
//                 )}
//               </ScrollView>
//             </View>
//           </ScrollView>

//           {/* PAGINATION */}
//           {filteredProducts.length > 0 && (
//             <View style={styles.paginationContainer}>
//               <Text style={styles.paginationInfo}>
//                 Showing{' '}
//                 {(currentPage - 1) *
//                   PRODUCTS_PER_PAGE +
//                   1}{' '}
//                 -{' '}
//                 {Math.min(
//                   currentPage *
//                     PRODUCTS_PER_PAGE,
//                   filteredProducts.length,
//                 )}{' '}
//                 of {filteredProducts.length}
//               </Text>

//               <View
//                 style={styles.paginationControls}>
//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === 1 &&
//                       styles.paginationButtonDisabled,
//                   ]}
//                   disabled={currentPage === 1}
//                   onPress={goToPreviousPage}>
//                   <Text
//                     style={[
//                       styles.paginationButtonText,
//                       currentPage === 1 &&
//                         styles.paginationButtonTextDisabled,
//                     ]}>
//                     ‹
//                   </Text>
//                 </TouchableOpacity>

//                 {Array.from(
//                   {length: totalPages},
//                   (_, index) => index + 1,
//                 ).map(page => (
//                   <TouchableOpacity
//                     key={page}
//                     style={[
//                       styles.pageNumberButton,
//                       currentPage === page &&
//                         styles.pageNumberButtonActive,
//                     ]}
//                     onPress={() =>
//                       setCurrentPage(page)
//                     }>
//                     <Text
//                       style={[
//                         styles.pageNumberText,
//                         currentPage === page &&
//                           styles.pageNumberTextActive,
//                       ]}>
//                       {page}
//                     </Text>
//                   </TouchableOpacity>
//                 ))}

//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === totalPages &&
//                       styles.paginationButtonDisabled,
//                   ]}
//                   disabled={
//                     currentPage === totalPages
//                   }
//                   onPress={goToNextPage}>
//                   <Text
//                     style={[
//                       styles.paginationButtonText,
//                       currentPage === totalPages &&
//                         styles.paginationButtonTextDisabled,
//                     ]}>
//                     ›
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//         </View>
//       </View>

//       {/* ADD / EDIT MODAL */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent={true}
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* MODAL HEADER */}
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>
//                   {editingProductId
//                     ? 'Edit Product'
//                     : 'Add Product'}
//                 </Text>
//                 <Text style={styles.modalSubtitle}>
//                   {editingProductId
//                     ? 'Update product information'
//                     : 'Enter product information'}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={closeModal}
//                 style={styles.modalCloseButton}>
//                 <Text style={styles.modalCloseText}>
//                   ✕
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* MODAL BODY */}
//             <ScrollView
//               style={styles.modalBody}
//               showsVerticalScrollIndicator={false}
//               keyboardShouldPersistTaps="handled">
//               <Text style={styles.inputLabel}>
//                 Product Name *
//               </Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter product name"
//                 placeholderTextColor="#94a3b8"
//                 value={name}
//                 onChangeText={setName}
//               />

//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     Product Code (SKU)
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter SKU"
//                     placeholderTextColor="#94a3b8"
//                     value={sku}
//                     onChangeText={setSku}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     Unit
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g. Piece, Box, Kg"
//                     placeholderTextColor="#94a3b8"
//                     value={unit}
//                     onChangeText={setUnit}
//                   />
//                 </View>
//               </View>

//               {/* CATEGORY INPUT WITH DROPDOWN */}
//               <Text style={styles.inputLabel}>
//                 Category
//               </Text>
//               <View style={styles.categoryInputContainer}>
//                 <TextInput
//                   style={styles.input}
//                   placeholder="Select or enter category"
//                   placeholderTextColor="#94a3b8"
//                   value={category}
//                   onChangeText={text => {
//                     setCategory(text);
//                     setCategoryDropdownVisible(true);
//                   }}
//                   onFocus={() =>
//                     setCategoryDropdownVisible(true)
//                   }
//                 />
//                 <TouchableOpacity
//                   style={styles.dropdownToggle}
//                   onPress={() =>
//                     setCategoryDropdownVisible(
//                       prev => !prev,
//                     )
//                   }>
//                   <Text style={styles.dropdownArrow}>
//                     {categoryDropdownVisible
//                       ? '▲'
//                       : '▼'}
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {categoryDropdownVisible && (
//                 <View style={styles.dropdownList}>
//                   <ScrollView
//                     style={{maxHeight: 130}}
//                     nestedScrollEnabled={true}>
//                     {filteredCategories.map(
//                       (cat, index) => (
//                         <TouchableOpacity
//                           key={index}
//                           style={styles.dropdownItem}
//                           onPress={() => {
//                             setCategory(cat);
//                             setCategoryDropdownVisible(
//                               false,
//                             );
//                           }}>
//                           <Text
//                             style={
//                               styles.dropdownItemText
//                             }>
//                             {cat}
//                           </Text>
//                         </TouchableOpacity>
//                       ),
//                     )}
//                   </ScrollView>
//                 </View>
//               )}

//               {/* PRICING */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     Purchase Price (₹)
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0.00"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="numeric"
//                     value={purchasePrice}
//                     onChangeText={setPurchasePrice}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     Selling Price (₹)
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0.00"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="numeric"
//                     value={sellingPrice}
//                     onChangeText={setSellingPrice}
//                   />
//                 </View>
//               </View>

//               {/* STOCK */}
//               <Text style={styles.inputLabel}>
//                 Opening Stock
//               </Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="0"
//                 placeholderTextColor="#94a3b8"
//                 keyboardType="numeric"
//                 value={openingStock}
//                 onChangeText={setOpeningStock}
//               />

//               {/* TAXES */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     GST Rate (%)
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g. 18%"
//                     placeholderTextColor="#94a3b8"
//                     value={gstRate}
//                     onChangeText={setGstRate}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     CGST
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g. 9"
//                     placeholderTextColor="#94a3b8"
//                     value={cgst}
//                     onChangeText={setCgst}
//                   />
//                 </View>
//               </View>

//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     SGST
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g. 9"
//                     placeholderTextColor="#94a3b8"
//                     value={sgst}
//                     onChangeText={setSgst}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>
//                     IGST
//                   </Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="e.g. 0"
//                     placeholderTextColor="#94a3b8"
//                     value={igst}
//                     onChangeText={setIgst}
//                   />
//                 </View>
//               </View>

//               <View style={styles.bottomSpace} />
//             </ScrollView>

//             {/* FOOTER */}
//             <View style={styles.modalFooter}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 onPress={closeModal}>
//                 <Text style={styles.cancelButtonText}>
//                   Cancel
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.saveButton}
//                 onPress={handleSaveProduct}>
//                 <Text style={styles.saveButtonText}>
//                   {editingProductId
//                     ? 'Update Product'
//                     : 'Save Product'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default ProductMasterScreen;

// // ============================================================
// // STYLES
// // ============================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },

//   // HEADER
//   header: {
//     backgroundColor: '#4338ca',
//     paddingTop: 38,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   backBtn: {
//     paddingRight: 12,
//     paddingVertical: 5,
//   },

//   backText: {
//     color: '#ffffff',
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   headerTitleBox: {
//     flex: 1,
//   },

//   headerTitle: {
//     color: '#ffffff',
//     fontSize: 19,
//     fontWeight: '700',
//   },

//   headerSubtitle: {
//     color: '#c7d2fe',
//     fontSize: 12,
//     marginTop: 2,
//   },

//   headerLoader: {
//     marginLeft: 8,
//   },

//   // CONTENT
//   content: {
//     flex: 1,
//     paddingHorizontal: 14,
//     paddingTop: 14,
//     paddingBottom: 10,
//   },

//   // SEARCH ROW
//   searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 14,
//     position: 'relative',
//     zIndex: 1000,
//   },

//   searchBox: {
//     flex: 1,
//     height: 42,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 13,
//     color: '#0f172a',
//     paddingVertical: 0,
//   },

//   clearBtn: {
//     padding: 5,
//   },

//   clearBtnText: {
//     color: '#64748b',
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   // FILE BUTTON
//   fileButton: {
//     width: 42,
//     height: 42,
//     marginLeft: 8,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   // CUSTOM FILE ICON
//   fileIcon: {
//     width: 17,
//     height: 20,
//     borderWidth: 1.7,
//     borderColor: '#4338ca',
//     borderRadius: 2,
//     backgroundColor: '#eef2ff',
//     alignItems: 'flex-start',
//     justifyContent: 'flex-end',
//     paddingBottom: 3,
//     paddingLeft: 3,
//     position: 'relative',
//   },

//   fileIconFold: {
//     position: 'absolute',
//     top: -1.5,
//     right: -1.5,
//     width: 7,
//     height: 7,
//     backgroundColor: '#ffffff',
//     borderLeftWidth: 1.7,
//     borderBottomWidth: 1.7,
//     borderColor: '#4338ca',
//   },

//   fileIconLine: {
//     width: 9,
//     height: 1.2,
//     backgroundColor: '#4338ca',
//     marginBottom: 2,
//   },

//   fileIconLineShort: {
//     width: 6,
//     height: 1.2,
//     backgroundColor: '#4338ca',
//   },

//   // DOWNLOAD MENU
//   downloadMenu: {
//     position: 'absolute',
//     right: 0,
//     top: 48,
//     width: 160,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     paddingVertical: 6,
//     zIndex: 9999,
//     elevation: 8,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 6,
//   },

//   downloadMenuItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//   },

//   downloadMenuDivider: {
//     height: 1,
//     backgroundColor: '#f1f5f9',
//     marginHorizontal: 8,
//   },

//   downloadMenuIcon: {
//     width: 30,
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#4338ca',
//     textAlign: 'center',
//     marginRight: 4,
//   },

//   downloadMenuText: {
//     fontSize: 12,
//     color: '#334155',
//     fontWeight: '600',
//   },

//   // SECTION HEADER
//   sectionHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 9,
//   },

//   sectionTitle: {
//     color: '#1e293b',
//     fontSize: 16,
//     fontWeight: '700',
//   },

//   totalText: {
//     color: '#64748b',
//     fontSize: 11,
//     marginTop: 3,
//   },

//   // ADD PRODUCT BUTTON
//   addProductButton: {
//     height: 38,
//     paddingHorizontal: 14,
//     backgroundColor: '#4338ca',
//     borderRadius: 7,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   addProductPlus: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '500',
//     lineHeight: 21,
//     marginRight: 6,
//   },

//   addProductButtonText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   // TABLE
//   tableWrapper: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },

//   tableContainer: {
//     minWidth: 1180,
//   },

//   tableHeaderRow: {
//     height: 54,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#eef2ff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#cbd5e1',
//   },

//   headerCell: {
//     fontSize: 11,
//     color: '#334155',
//     fontWeight: '700',
//     textAlign: 'center',
//     paddingHorizontal: 7,
//   },

//   tableBody: {
//     flex: 1,
//   },

//   tableRow: {
//     minHeight: 54,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },

//   tableRowAlternate: {
//     backgroundColor: '#f8fafc',
//   },

//   bodyCell: {
//     fontSize: 11,
//     color: '#475569',
//     textAlign: 'center',
//     paddingHorizontal: 7,
//   },

//   nameCell: {
//     justifyContent: 'center',
//     paddingHorizontal: 8,
//   },

//   productName: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#1e293b',
//   },

//   boldText: {
//     fontWeight: '700',
//     color: '#0f172a',
//   },

//   priceText: {
//     fontWeight: '700',
//     color: '#15803d',
//   },

//   stockCell: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   stockBadge: {
//     paddingHorizontal: 7,
//     paddingVertical: 3,
//     backgroundColor: '#e0e7ff',
//     borderRadius: 4,
//   },

//   stockText: {
//     fontSize: 11,
//     fontWeight: '700',
//     color: '#4338ca',
//   },

//   // ACTION
//   actionCell: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: 6,
//   },

//   editButton: {
//     width: 32,
//     height: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 6,
//     backgroundColor: '#e0e7ff',
//   },

//   editIcon: {
//     fontSize: 16,
//     color: '#4338ca',
//     fontWeight: '700',
//   },

//   deleteButton: {
//     width: 32,
//     height: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderRadius: 6,
//     backgroundColor: '#fee2e2',
//   },

//   binIcon: {
//     width: 20,
//     height: 22,
//     alignItems: 'center',
//     justifyContent: 'flex-start',
//   },

//   binLid: {
//     width: 18,
//     height: 3,
//     backgroundColor: '#dc2626',
//     borderRadius: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 2,
//   },

//   binHandle: {
//     width: 7,
//     height: 2,
//     borderWidth: 1,
//     borderColor: '#dc2626',
//     borderBottomWidth: 0,
//     position: 'absolute',
//     top: -3,
//     borderTopLeftRadius: 2,
//     borderTopRightRadius: 2,
//   },

//   binBody: {
//     width: 14,
//     height: 16,
//     borderWidth: 1.5,
//     borderColor: '#dc2626',
//     borderTopWidth: 0,
//     borderBottomLeftRadius: 2,
//     borderBottomRightRadius: 2,
//     alignItems: 'center',
//     justifyContent: 'space-evenly',
//   },

//   binInnerLine: {
//     width: 1,
//     height: 9,
//     backgroundColor: '#dc2626',
//   },

//   // COLUMNS
//   colNumber: {
//     width: 42,
//   },

//   colName: {
//     width: 155,
//   },

//   colSku: {
//     width: 95,
//   },

//   colPrice: {
//     width: 95,
//   },

//   colCategory: {
//     width: 105,
//   },

//   colUnit: {
//     width: 65,
//   },

//   colGst: {
//     width: 60,
//   },

//   colTax: {
//     width: 55,
//   },

//   colStock: {
//     width: 65,
//   },

//   colAction: {
//     width: 88,
//   },

//   // EMPTY
//   emptyContainer: {
//     width: 1000,
//     minHeight: 200,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   emptyText: {
//     fontSize: 13,
//     color: '#64748b',
//     marginBottom: 12,
//   },

//   emptyAddBtn: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     borderRadius: 7,
//   },

//   emptyAddBtnText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   // PAGINATION
//   paginationContainer: {
//     minHeight: 52,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#e2e8f0',
//     backgroundColor: '#ffffff',
//   },

//   paginationInfo: {
//     fontSize: 11,
//     color: '#64748b',
//   },

//   paginationControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 5,
//   },

//   paginationButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   paginationButtonDisabled: {
//     backgroundColor: '#f1f5f9',
//     borderColor: '#e2e8f0',
//   },

//   paginationButtonText: {
//     fontSize: 20,
//     color: '#4338ca',
//     lineHeight: 22,
//     fontWeight: '600',
//   },

//   paginationButtonTextDisabled: {
//     color: '#94a3b8',
//   },

//   pageNumberButton: {
//     minWidth: 32,
//     height: 32,
//     paddingHorizontal: 8,
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     backgroundColor: '#ffffff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   pageNumberButtonActive: {
//     backgroundColor: '#4338ca',
//     borderColor: '#4338ca',
//   },

//   pageNumberText: {
//     fontSize: 11,
//     color: '#475569',
//     fontWeight: '600',
//   },

//   pageNumberTextActive: {
//     color: '#ffffff',
//   },

//   // MODAL
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(15, 23, 42, 0.5)',
//     justifyContent: 'center',
//     paddingHorizontal: 14,
//   },

//   modalContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 14,
//     maxHeight: '85%',
//     overflow: 'hidden',
//   },

//   modalHeader: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

//   modalTitle: {
//     color: '#ffffff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

//   modalSubtitle: {
//     color: '#c7d2fe',
//     fontSize: 11,
//     marginTop: 2,
//   },

//   modalCloseButton: {
//     width: 32,
//     height: 32,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   modalCloseText: {
//     color: '#ffffff',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   modalBody: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//   },

//   inputLabel: {
//     fontSize: 12,
//     color: '#475569',
//     fontWeight: '600',
//     marginTop: 9,
//     marginBottom: 5,
//   },

//   input: {
//     height: 42,
//     backgroundColor: '#f8fafc',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     paddingHorizontal: 11,
//     fontSize: 13,
//     color: '#0f172a',
//   },

//   rowTwo: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   colHalf: {
//     width: '48.5%',
//   },

//   // Category Dropdown
//   categoryInputContainer: {
//     position: 'relative',
//   },

//   dropdownToggle: {
//     position: 'absolute',
//     right: 12,
//     top: 12,
//   },

//   dropdownArrow: {
//     fontSize: 10,
//     color: '#64748b',
//   },

//   dropdownList: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     marginTop: 4,
//     elevation: 4,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },

//   dropdownItem: {
//     paddingVertical: 9,
//     paddingHorizontal: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//   },

//   dropdownItemText: {
//     fontSize: 12,
//     color: '#334155',
//   },

//   bottomSpace: {
//     height: 20,
//   },

//   // FOOTER
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#e2e8f0',
//     backgroundColor: '#f8fafc',
//   },

//   cancelButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 9,
//     marginRight: 8,
//     borderRadius: 7,
//   },

//   cancelButtonText: {
//     color: '#64748b',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   saveButton: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 17,
//     paddingVertical: 9,
//     borderRadius: 7,
//   },

//   saveButtonText: {
//     color: '#ffffff',
//     fontSize: 13,
//     fontWeight: '700',
//   },
// });





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
} from 'react-native';
import {API_BASE_URL} from '../api/config';
import {downloadProducts} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route: any;
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

const DEFAULT_CATEGORIES = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'Clothing',
  'Food',
  'Grocery',
  'Stationery',
  'Cosmetics',
  'Hardware',
  'Software',
  'Beverages',
  'Medical',
  'Automobile',
  'General',
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Laptop i7 16GB',
    sku: 'PROD-1001',
    category: 'Electronics',
    unit: 'PCS',
    purchasePrice: 45000,
    sellingPrice: 52000,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 25,
    currentStock: 25,
    lowStockLevel: 5,
    hsnCode: '8471',
    description: 'High performance 16GB RAM Intel Core i7 laptop',
  },
  {
    id: '2',
    name: 'Wireless Keyboard',
    sku: 'PROD-1002',
    category: 'Office Supplies',
    unit: 'PCS',
    purchasePrice: 1200,
    sellingPrice: 1500,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 50,
    currentStock: 50,
    lowStockLevel: 10,
    hsnCode: '8471',
    description: 'Ergonomic 2.4GHz wireless membrane keyboard',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    sku: 'PROD-1003',
    category: 'Furniture',
    unit: 'PCS',
    purchasePrice: 7500,
    sellingPrice: 9500,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 15,
    currentStock: 15,
    lowStockLevel: 2,
    hsnCode: '9401',
    description: 'Adjustable lumbar support breathable mesh chair',
  },
  {
    id: '4',
    name: 'Dell 24-inch IPS Monitor',
    sku: 'PROD-1004',
    category: 'Electronics',
    unit: 'PCS',
    purchasePrice: 11000,
    sellingPrice: 13500,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 18,
    currentStock: 18,
    lowStockLevel: 3,
    hsnCode: '8528',
    description: 'Full HD 1080p borderless display monitor',
  },
  {
    id: '5',
    name: 'A4 Copier Paper Ream (500 sheets)',
    sku: 'PROD-1005',
    category: 'Office Supplies',
    unit: 'Pack',
    purchasePrice: 220,
    sellingPrice: 280,
    cgst: '6',
    sgst: '6',
    igst: '0',
    gstRate: '12%',
    openingStock: 120,
    currentStock: 120,
    lowStockLevel: 20,
    hsnCode: '4802',
    description: '75 GSM multipurpose white copier paper',
  },
  {
    id: '6',
    name: 'Logitech Optical Mouse M90',
    sku: 'PROD-1006',
    category: 'Electronics',
    unit: 'PCS',
    purchasePrice: 280,
    sellingPrice: 380,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 65,
    currentStock: 65,
    lowStockLevel: 10,
    hsnCode: '8471',
    description: 'USB wired optical high precision mouse',
  },
  {
    id: '7',
    name: 'Executive Wooden Desk 4x2 ft',
    sku: 'PROD-1007',
    category: 'Furniture',
    unit: 'PCS',
    purchasePrice: 12500,
    sellingPrice: 16000,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 8,
    currentStock: 8,
    lowStockLevel: 2,
    hsnCode: '9403',
    description: 'Engineered wood office executive workstation',
  },
  {
    id: '8',
    name: 'Basmati Rice Premium 25kg',
    sku: 'PROD-1008',
    category: 'Grocery',
    unit: 'Bag',
    purchasePrice: 2200,
    sellingPrice: 2600,
    cgst: '2.5',
    sgst: '2.5',
    igst: '0',
    gstRate: '5%',
    openingStock: 40,
    currentStock: 40,
    lowStockLevel: 5,
    hsnCode: '1006',
    description: 'Long grain aged aromatic royal basmati rice',
  },
  {
    id: '9',
    name: 'Schneider Ballpoint Pens (Pack of 10)',
    sku: 'PROD-1009',
    category: 'Stationery',
    unit: 'Pack',
    purchasePrice: 90,
    sellingPrice: 130,
    cgst: '6',
    sgst: '6',
    igst: '0',
    gstRate: '12%',
    openingStock: 85,
    currentStock: 85,
    lowStockLevel: 15,
    hsnCode: '9608',
    description: 'Smooth ink blue flow ballpoint pens',
  },
  {
    id: '10',
    name: 'Thermal Receipt Paper Roll 80mm',
    sku: 'PROD-1010',
    category: 'Office Supplies',
    unit: 'Box',
    purchasePrice: 450,
    sellingPrice: 650,
    cgst: '6',
    sgst: '6',
    igst: '0',
    gstRate: '12%',
    openingStock: 35,
    currentStock: 35,
    lowStockLevel: 8,
    hsnCode: '4811',
    description: 'Standard 80mm POS billing receipt rolls',
  },
  {
    id: '11',
    name: 'HP LaserJet Toner Cartridge 88A',
    sku: 'PROD-1011',
    category: 'Electronics',
    unit: 'PCS',
    purchasePrice: 850,
    sellingPrice: 1200,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 22,
    currentStock: 22,
    lowStockLevel: 4,
    hsnCode: '8443',
    description: 'High yield black monochrome toner cartridge',
  },
  {
    id: '12',
    name: 'Metal File Cabinet 4 Drawers',
    sku: 'PROD-1012',
    category: 'Furniture',
    unit: 'PCS',
    purchasePrice: 8200,
    sellingPrice: 10500,
    cgst: '9',
    sgst: '9',
    igst: '0',
    gstRate: '18%',
    openingStock: 6,
    currentStock: 6,
    lowStockLevel: 2,
    hsnCode: '9403',
    description: 'Heavy duty cold rolled steel lockable file cabinet',
  },
];

/**
 * Candidate URLs for backend API connection across Android Emulator & Physical Device
 */
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
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const PRODUCTS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(
    null,
  );

  // FORM
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

  // CATEGORY
  const [categoryDropdownVisible, setCategoryDropdownVisible] = useState(false);
  const [categories, setCategories] =
    useState<string[]>(DEFAULT_CATEGORIES);

  // ============================================================
  // LOAD DATA FROM DATABASE
  // ============================================================

  const loadCategories = async () => {
    try {
      const response = await fetchWithFallback('/api/categories');

      if (response && response.ok) {
        const result = await response.json();

        const data = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const dbCatNames: string[] = data
          .map((c: any) => c.category_name || c.name)
          .filter(Boolean);

        const merged = Array.from(
          new Set([...dbCatNames, ...DEFAULT_CATEGORIES]),
        );

        setCategories(merged);
      }
    } catch (err) {
      console.log('Error loading categories:', err);
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
                item.purchase_price ??
                  item.purchasePrice ??
                  item.rate ??
                  0,
              ) || 0;

            const sPrice =
              Number(
                item.selling_price ??
                  item.sellingPrice ??
                  item.price ??
                  0,
              ) || 0;

            const oStock =
              Number(
                item.opening_stock ??
                  item.openingStock ??
                  item.stock ??
                  0,
              ) || 0;

            const cStock =
              Number(
                item.current_stock !== undefined &&
                  item.current_stock !== null
                  ? item.current_stock
                  : item.currentStock !== undefined &&
                    item.currentStock !== null
                  ? item.currentStock
                  : oStock,
              ) || 0;

            const minStock =
              Number(
                item.minimum_stock ??
                  item.minimumStock ??
                  item.lowStockLevel ??
                  5,
              ) || 5;

            const rawGst =
              item.gst_rate ??
              item.gstRate ??
              item.tax_rate ??
              0;

            const gstStr = String(rawGst).includes('%')
              ? String(rawGst)
              : `${rawGst}%`;

            return {
              id: String(item.id ?? Date.now()),
              name:
                item.product_name ||
                item.name ||
                item.productName ||
                'Product',

              sku:
                item.sku ||
                item.product_code ||
                item.code ||
                '-',

              category:
                item.category_name ||
                item.category ||
                'General',

              unit: item.unit || 'Piece',

              purchasePrice: pPrice,
              sellingPrice: sPrice,

              cgst:
                item.cgst !== undefined && item.cgst !== null
                  ? String(item.cgst)
                  : '0',

              sgst:
                item.sgst !== undefined && item.sgst !== null
                  ? String(item.sgst)
                  : '0',

              igst:
                item.igst !== undefined && item.igst !== null
                  ? String(item.igst)
                  : '0',

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

  // Run on mount and on screen focus
  useEffect(() => {
    loadProducts();
    loadCategories();

    const unsubscribe = navigation?.addListener
      ? navigation.addListener('focus', () => {
          loadProducts();
          loadCategories();
        })
      : undefined;

    return unsubscribe;
  }, [navigation]);

  const filteredCategories = categories.filter(item =>
    item.toLowerCase().includes(category.toLowerCase().trim()),
  );

  // ============================================================
  // RESET FORM
  // ============================================================

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
    setCategoryDropdownVisible(false);
  };

  // ============================================================
  // ADD PRODUCT
  // ============================================================

  const openAddProductModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // ============================================================
  // EDIT PRODUCT
  // ============================================================

  const openEditProductModal = (product: Product) => {
    setEditingProductId(product.id);

    setName(product.name || '');
    setSku(product.sku || '');
    setCategory(product.category || '');
    setUnit(product.unit || 'Piece');

    setPurchasePrice(
      product.purchasePrice !== undefined
        ? String(product.purchasePrice)
        : '',
    );

    setSellingPrice(
      product.sellingPrice !== undefined
        ? String(product.sellingPrice)
        : '',
    );

    setCgst(product.cgst || '');
    setSgst(product.sgst || '');
    setIgst(product.igst || '');
    setGstRate(product.gstRate || '');

    setOpeningStock(
      product.openingStock !== undefined
        ? String(product.openingStock)
        : '',
    );

    setCategoryDropdownVisible(false);
    setModalVisible(true);
  };

  // ============================================================
  // CLOSE MODAL
  // ============================================================

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // ============================================================
  // SAVE PRODUCT (DATABASE + STATE)
  // ============================================================

  const handleSaveProduct = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Product Name is required');
      return;
    }

    const stockValue = parseInt(openingStock, 10) || 0;
    const purchasePriceValue = parseFloat(purchasePrice) || 0;
    const sellingPriceValue = parseFloat(sellingPrice) || 0;
    const cleanGstRate =
      parseFloat(gstRate.replace('%', '')) || 0;

    const payload = {
      product_name: name.trim(),
      sku: sku.trim() || undefined,
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
        await fetchWithFallback(
          `/api/products/${editingProductId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );

        Alert.alert(
          'Success',
          `Product "${name.trim()}" updated successfully!`,
        );
      } else {
        await fetchWithFallback('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        Alert.alert(
          'Success',
          `Product "${name.trim()}" added successfully!`,
        );
      }

      closeModal();
      await loadProducts();
      await loadCategories();
    } catch (err: any) {
      console.error('Save product error:', err);

      // Fallback local update
      const newProd: Product = {
        id: editingProductId || Date.now().toString(),
        name: name.trim(),
        sku:
          sku.trim() ||
          `PROD-${Date.now().toString().slice(-4)}`,
        category: category.trim() || 'General',
        unit: unit.trim() || 'Piece',
        purchasePrice: purchasePriceValue,
        sellingPrice: sellingPriceValue,
        cgst: cgst || '0',
        sgst: sgst || '0',
        igst: igst || '0',
        gstRate: gstRate || '0%',
        openingStock: stockValue,
        currentStock: stockValue,
        lowStockLevel: 5,
      };

      if (editingProductId) {
        setProducts(prev =>
          prev.map(p =>
            p.id === editingProductId ? newProd : p,
          ),
        );

        Alert.alert(
          'Success',
          `Product "${name.trim()}" updated successfully!`,
        );
      } else {
        setProducts(prev => [newProd, ...prev]);
        setCurrentPage(1);

        Alert.alert(
          'Success',
          `Product "${name.trim()}" added successfully!`,
        );
      }

      closeModal();
    }
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDeleteProduct = (product: Product) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${product.name}"?`,
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
              await fetchWithFallback(
                `/api/products/${product.id}`,
                {
                  method: 'DELETE',
                },
              );
            } catch (err: any) {
              console.error('Delete product error:', err);
            }

            setProducts(prev =>
              prev.filter(p => p.id !== product.id),
            );
          },
        },
      ],
    );
  };

  // ============================================================
  // DOWNLOAD LIST (PDF & EXCEL)
  // ============================================================

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredProducts.length > 0
        ? filteredProducts
        : products;

    downloadProducts(targetList, format);
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredProducts = products.filter(product => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.sku.toLowerCase().includes(query)
    );
  });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredProducts.length / PRODUCTS_PER_PAGE,
    ),
  );

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE,
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    setCurrentPage(1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>
            Product Directory
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage all products
          </Text>
        </View>

        {loading && (
          <ActivityIndicator
            size="small"
            color="#ffffff"
            style={styles.headerLoader}
          />
        )}
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* SEARCH ROW */}
        <View style={styles.searchRow}>
          {/* SEARCH BOX */}
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search product name, SKU or category"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={handleSearchChange}
            />

            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={styles.clearBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}>
                <Text style={styles.clearBtnText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* FILE BUTTON OUTSIDE SEARCH BOX */}
          <TouchableOpacity
            style={styles.fileButton}
            activeOpacity={0.7}
            onPress={() =>
              setDownloadMenuVisible(prev => !prev)
            }>
            <View style={styles.fileIcon}>
              <View style={styles.fileIconFold} />
              <View style={styles.fileIconLine} />
              <View style={styles.fileIconLine} />
              <View style={styles.fileIconLineShort} />
            </View>
          </TouchableOpacity>

          {/* DOWNLOAD MENU */}
          {downloadMenuVisible && (
            <View style={styles.downloadMenu}>
              <TouchableOpacity
                style={styles.downloadMenuItem}
                activeOpacity={0.7}
                onPress={() => handleDownload('pdf')}>
                <Text style={styles.downloadMenuIcon}>
                  📄
                </Text>
                <Text style={styles.downloadMenuText}>
                  PDF
                </Text>
              </TouchableOpacity>

              <View style={styles.downloadMenuDivider} />

              <TouchableOpacity
                style={styles.downloadMenuItem}
                activeOpacity={0.7}
                onPress={() => handleDownload('excel')}>
                <Text style={styles.downloadMenuIcon}>
                  📊
                </Text>
                <Text style={styles.downloadMenuText}>
                  Excel
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Product Directory
            </Text>

            <Text style={styles.totalText}>
              Total Products: {products.length}
            </Text>
          </View>
        </View>

        {/* TABLE */}
        <View style={styles.tableWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
              {/* TABLE HEADER */}
              <View style={styles.tableHeaderRow}>
                <Text
                  style={[
                    styles.headerCell,
                    styles.colNumber,
                  ]}>
                  #
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colName,
                  ]}>
                  Product Name
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colSku,
                  ]}>
                  Product Code
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colPrice,
                  ]}>
                  Purchase Price
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colPrice,
                  ]}>
                  Selling Price
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colCategory,
                  ]}>
                  Category
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colUnit,
                  ]}>
                  Unit
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colGst,
                  ]}>
                  GST
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colTax,
                  ]}>
                  CGST
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colTax,
                  ]}>
                  SGST
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colTax,
                  ]}>
                  IGST
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colStock,
                  ]}>
                  Stock
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colAction,
                  ]}>
                  Action
                </Text>
              </View>

              {/* TABLE BODY */}
              <ScrollView
                style={styles.tableBody}
                showsVerticalScrollIndicator={true}
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {
                      loadProducts();
                      loadCategories();
                    }}
                    colors={['#4338ca']}
                  />
                }>
                {filteredProducts.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {products.length === 0
                        ? 'No products added yet.'
                        : 'No products found.'}
                    </Text>

                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={openAddProductModal}>
                      <Text style={styles.emptyAddBtnText}>
                        + Add Product
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  paginatedProducts.map(
                    (product, index) => (
                      <TouchableOpacity
                        key={product.id}
                        activeOpacity={0.7}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 &&
                            styles.tableRowAlternate,
                        ]}
                        onPress={() =>
                          openEditProductModal(product)
                        }>
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colNumber,
                          ]}>
                          {(currentPage - 1) *
                            PRODUCTS_PER_PAGE +
                            index +
                            1}
                        </Text>

                        <View
                          style={[
                            styles.nameCell,
                            styles.colName,
                          ]}>
                          <Text
                            style={styles.productName}
                            numberOfLines={1}>
                            {product.name}
                          </Text>
                        </View>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colSku,
                          ]}
                          numberOfLines={1}>
                          {product.sku || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPrice,
                            styles.priceText,
                          ]}>
                          ₹{' '}
                          {Number(
                            product.purchasePrice || 0,
                          ).toFixed(2)}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPrice,
                            styles.priceText,
                          ]}>
                          ₹{' '}
                          {Number(
                            product.sellingPrice || 0,
                          ).toFixed(2)}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colCategory,
                          ]}
                          numberOfLines={1}>
                          {product.category || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colUnit,
                          ]}>
                          {product.unit || 'Piece'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colGst,
                            styles.boldText,
                          ]}>
                          {product.gstRate || '0%'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colTax,
                          ]}>
                          {product.cgst || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colTax,
                          ]}>
                          {product.sgst || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colTax,
                          ]}>
                          {product.igst || '-'}
                        </Text>

                        <View
                          style={[
                            styles.stockCell,
                            styles.colStock,
                          ]}>
                          <View style={styles.stockBadge}>
                            <Text style={styles.stockText}>
                              {product.currentStock ?? 0}
                            </Text>
                          </View>
                        </View>

                        {/* ACTION */}
                        <View
                          style={[
                            styles.actionCell,
                            styles.colAction,
                          ]}>
                          {/* EDIT */}
                          <TouchableOpacity
                            style={styles.editButton}
                            activeOpacity={0.7}
                            onPress={event => {
                              event.stopPropagation();
                              openEditProductModal(product);
                            }}>
                            <Text style={styles.editIcon}>
                              ✎
                            </Text>
                          </TouchableOpacity>

                          {/* DELETE */}
                          <TouchableOpacity
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                            onPress={event => {
                              event.stopPropagation();
                              handleDeleteProduct(product);
                            }}>
                            <View style={styles.binIcon}>
                              <View style={styles.binLid}>
                                <View
                                  style={styles.binHandle}
                                />
                              </View>

                              <View style={styles.binBody}>
                                <View
                                  style={styles.binInnerLine}
                                />
                                <View
                                  style={styles.binInnerLine}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    ),
                  )
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {/* + BUTTON - BELOW TABLE, ABOVE PAGINATION */}
          {filteredProducts.length > 0 && (
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity
                style={styles.bottomAddButton}
                activeOpacity={0.8}
                onPress={openAddProductModal}>
                <Text style={styles.bottomAddPlus}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PAGINATION */}
          {filteredProducts.length > 0 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationInfo}>
                Showing{' '}
                {(currentPage - 1) *
                  PRODUCTS_PER_PAGE +
                  1}{' '}
                -{' '}
                {Math.min(
                  currentPage * PRODUCTS_PER_PAGE,
                  filteredProducts.length,
                )}{' '}
                of {filteredProducts.length}
              </Text>

              <View style={styles.paginationControls}>
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === 1 &&
                      styles.paginationButtonDisabled,
                  ]}
                  disabled={currentPage === 1}
                  onPress={goToPreviousPage}>
                  <Text
                    style={[
                      styles.paginationButtonText,
                      currentPage === 1 &&
                        styles.paginationButtonTextDisabled,
                    ]}>
                    ‹
                  </Text>
                </TouchableOpacity>

                {Array.from(
                  {length: totalPages},
                  (_, index) => index + 1,
                ).map(page => (
                  <TouchableOpacity
                    key={page}
                    style={[
                      styles.pageNumberButton,
                      currentPage === page &&
                        styles.pageNumberButtonActive,
                    ]}
                    onPress={() =>
                      setCurrentPage(page)
                    }>
                    <Text
                      style={[
                        styles.pageNumberText,
                        currentPage === page &&
                          styles.pageNumberTextActive,
                      ]}>
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}

                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  disabled={
                    currentPage === totalPages
                  }
                  onPress={goToNextPage}>
                  <Text
                    style={[
                      styles.paginationButtonText,
                      currentPage === totalPages &&
                        styles.paginationButtonTextDisabled,
                    ]}>
                    ›
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingProductId
                    ? 'Edit Product'
                    : 'Add Product'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {editingProductId
                    ? 'Update product information'
                    : 'Enter product information'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* MODAL BODY */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>
                Product Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Product Code (SKU)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter SKU"
                    placeholderTextColor="#94a3b8"
                    value={sku}
                    onChangeText={setSku}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Unit
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Piece, Box, Kg"
                    placeholderTextColor="#94a3b8"
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>
              </View>

              {/* CATEGORY INPUT WITH DROPDOWN */}
              <Text style={styles.inputLabel}>
                Category
              </Text>

              <View style={styles.categoryInputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Select or enter category"
                  placeholderTextColor="#94a3b8"
                  value={category}
                  onChangeText={text => {
                    setCategory(text);
                    setCategoryDropdownVisible(true);
                  }}
                  onFocus={() =>
                    setCategoryDropdownVisible(true)
                  }
                />

                <TouchableOpacity
                  style={styles.dropdownToggle}
                  onPress={() =>
                    setCategoryDropdownVisible(
                      prev => !prev,
                    )
                  }>
                  <Text style={styles.dropdownArrow}>
                    {categoryDropdownVisible
                      ? '▲'
                      : '▼'}
                  </Text>
                </TouchableOpacity>
              </View>

              {categoryDropdownVisible && (
                <View style={styles.dropdownList}>
                  <ScrollView
                    style={{maxHeight: 130}}
                    nestedScrollEnabled={true}>
                    {filteredCategories.map(
                      (cat, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownItem}
                          onPress={() => {
                            setCategory(cat);
                            setCategoryDropdownVisible(
                              false,
                            );
                          }}>
                          <Text
                            style={
                              styles.dropdownItemText
                            }>
                            {cat}
                          </Text>
                        </TouchableOpacity>
                      ),
                    )}
                  </ScrollView>
                </View>
              )}

              {/* PRICING */}
              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Purchase Price (₹)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Selling Price (₹)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                  />
                </View>
              </View>

              {/* STOCK */}
              <Text style={styles.inputLabel}>
                Opening Stock
              </Text>

              <TextInput
                style={styles.input}
                placeholder="0"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={openingStock}
                onChangeText={setOpeningStock}
              />

              {/* TAXES */}
              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    GST Rate (%)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 18%"
                    placeholderTextColor="#94a3b8"
                    value={gstRate}
                    onChangeText={setGstRate}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    CGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 9"
                    placeholderTextColor="#94a3b8"
                    value={cgst}
                    onChangeText={setCgst}
                  />
                </View>
              </View>

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    SGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 9"
                    placeholderTextColor="#94a3b8"
                    value={sgst}
                    onChangeText={setSgst}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    IGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 0"
                    placeholderTextColor="#94a3b8"
                    value={igst}
                    onChangeText={setIgst}
                  />
                </View>
              </View>

              <View style={styles.bottomSpace} />
            </ScrollView>

            {/* FOOTER */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelButtonText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveProduct}>
                <Text style={styles.saveButtonText}>
                  {editingProductId
                    ? 'Update Product'
                    : 'Save Product'}
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

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // HEADER
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backBtn: {
    paddingRight: 12,
    paddingVertical: 5,
  },

  backText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },

  headerTitleBox: {
    flex: 1,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 12,
    marginTop: 2,
  },

  headerLoader: {
    marginLeft: 8,
  },

  // CONTENT
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },

  // SEARCH ROW
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    position: 'relative',
    zIndex: 1000,
  },

  searchBox: {
    flex: 1,
    height: 42,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0f172a',
    paddingVertical: 0,
  },

  clearBtn: {
    padding: 5,
  },

  clearBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },

  // FILE BUTTON
  fileButton: {
    width: 42,
    height: 42,
    marginLeft: 8,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // CUSTOM FILE ICON
  fileIcon: {
    width: 17,
    height: 20,
    borderWidth: 1.7,
    borderColor: '#4338ca',
    borderRadius: 2,
    backgroundColor: '#eef2ff',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingBottom: 3,
    paddingLeft: 3,
    position: 'relative',
  },

  fileIconFold: {
    position: 'absolute',
    top: -1.5,
    right: -1.5,
    width: 7,
    height: 7,
    backgroundColor: '#ffffff',
    borderLeftWidth: 1.7,
    borderBottomWidth: 1.7,
    borderColor: '#4338ca',
  },

  fileIconLine: {
    width: 9,
    height: 1.2,
    backgroundColor: '#4338ca',
    marginBottom: 2,
  },

  fileIconLineShort: {
    width: 6,
    height: 1.2,
    backgroundColor: '#4338ca',
  },

  // DOWNLOAD MENU
  downloadMenu: {
    position: 'absolute',
    right: 0,
    top: 48,
    width: 160,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingVertical: 6,
    zIndex: 9999,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  downloadMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  downloadMenuDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: 8,
  },

  downloadMenuIcon: {
    width: 30,
    fontSize: 16,
    fontWeight: '700',
    color: '#4338ca',
    textAlign: 'center',
    marginRight: 4,
  },

  downloadMenuText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  sectionTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },

  totalText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 3,
  },

  // TABLE
  tableWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableContainer: {
    minWidth: 1180,
  },

  tableHeaderRow: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },

  headerCell: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 7,
  },

  tableBody: {
    flex: 1,
  },

  tableRow: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  tableRowAlternate: {
    backgroundColor: '#f8fafc',
  },

  bodyCell: {
    fontSize: 11,
    color: '#475569',
    textAlign: 'center',
    paddingHorizontal: 7,
  },

  nameCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  productName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },

  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },

  priceText: {
    fontWeight: '700',
    color: '#15803d',
  },

  stockCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  stockBadge: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    backgroundColor: '#e0e7ff',
    borderRadius: 4,
  },

  stockText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },

  // ACTION
  actionCell: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },

  editButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
  },

  editIcon: {
    fontSize: 16,
    color: '#4338ca',
    fontWeight: '700',
  },

  deleteButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#fee2e2',
  },

  binIcon: {
    width: 20,
    height: 22,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  binLid: {
    width: 18,
    height: 3,
    backgroundColor: '#dc2626',
    borderRadius: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },

  binHandle: {
    width: 7,
    height: 2,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderBottomWidth: 0,
    position: 'absolute',
    top: -3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  binBody: {
    width: 14,
    height: 16,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  binInnerLine: {
    width: 1,
    height: 9,
    backgroundColor: '#dc2626',
  },

  // COLUMNS
  colNumber: {
    width: 42,
  },

  colName: {
    width: 155,
  },

  colSku: {
    width: 95,
  },

  colPrice: {
    width: 95,
  },

  colCategory: {
    width: 105,
  },

  colUnit: {
    width: 65,
  },

  colGst: {
    width: 60,
  },

  colTax: {
    width: 55,
  },

  colStock: {
    width: 65,
  },

  colAction: {
    width: 88,
  },

  // EMPTY
  emptyContainer: {
    width: 1000,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
  },

  emptyAddBtn: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 7,
  },

  emptyAddBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // + BUTTON BELOW TABLE
  bottomAddContainer: {
    height: 52,
    paddingHorizontal: 12,
    alignItems: 'flex-end',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  bottomAddButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#4338ca',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bottomAddPlus: {
    color: '#ffffff',
    fontSize: 25,
    fontWeight: '400',
    lineHeight: 29,
  },

  // PAGINATION
  paginationContainer: {
    minHeight: 52,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },

  paginationInfo: {
    fontSize: 11,
    color: '#64748b',
  },

  paginationControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  paginationButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paginationButtonDisabled: {
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
  },

  paginationButtonText: {
    fontSize: 20,
    color: '#4338ca',
    lineHeight: 22,
    fontWeight: '600',
  },

  paginationButtonTextDisabled: {
    color: '#94a3b8',
  },

  pageNumberButton: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageNumberButtonActive: {
    backgroundColor: '#4338ca',
    borderColor: '#4338ca',
  },

  pageNumberText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },

  pageNumberTextActive: {
    color: '#ffffff',
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    maxHeight: '85%',
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
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

  modalSubtitle: {
    color: '#c7d2fe',
    fontSize: 11,
    marginTop: 2,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCloseText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  inputLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
    marginTop: 9,
    marginBottom: 5,
  },

  input: {
    height: 42,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 11,
    fontSize: 13,
    color: '#0f172a',
  },

  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colHalf: {
    width: '48.5%',
  },

  // CATEGORY DROPDOWN
  categoryInputContainer: {
    position: 'relative',
  },

  dropdownToggle: {
    position: 'absolute',
    right: 12,
    top: 12,
  },

  dropdownArrow: {
    fontSize: 10,
    color: '#64748b',
  },

  dropdownList: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginTop: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  dropdownItem: {
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  dropdownItemText: {
    fontSize: 12,
    color: '#334155',
  },

  bottomSpace: {
    height: 20,
  },

  // FOOTER
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },

  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
    borderRadius: 7,
  },

  cancelButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 7,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
