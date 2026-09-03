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
} from 'react-native';
import {API_BASE_URL} from '../api/config';

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

const ProductMasterScreen = ({navigation}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
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
  const [categoryDropdownVisible, setCategoryDropdownVisible] =
    useState(false);

  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  // ============================================================
  // LOAD DATA
  // ============================================================

  const loadCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);

      if (response.ok) {
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

      const response = await fetch(`${API_BASE_URL}/api/products`);

      if (response.ok) {
        const result = await response.json();

        const productData = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        const formatted: Product[] = productData.map((item: any) => ({
          id: String(item.id),
          name: item.product_name || item.name || '',
          sku: item.sku || '-',
          category: item.category_name || item.category || 'General',
          unit: item.unit || 'Piece',

          purchasePrice: Number(item.purchase_price) || 0,
          sellingPrice: Number(item.selling_price) || 0,

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

          gstRate:
            item.gst_rate !== undefined && item.gst_rate !== null
              ? `${item.gst_rate}%`
              : '0%',

          openingStock: Number(item.opening_stock) || 0,

          currentStock:
            Number(
              item.current_stock !== undefined &&
                item.current_stock !== null
                ? item.current_stock
                : item.opening_stock,
            ) || 0,

          lowStockLevel: Number(item.minimum_stock) || 5,
          hsnCode: item.hsn_code || '',
          description: item.description || '',
        }));

        setProducts(formatted);
      }
    } catch (err) {
      console.log('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

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
  // SAVE PRODUCT
  // ============================================================

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
        const response = await fetch(
          `${API_BASE_URL}/api/products/${editingProductId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        Alert.alert(
          'Success',
          `Product "${name.trim()}" updated successfully!`,
        );
      } else {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

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

      Alert.alert(
        'Error',
        err?.message || 'Failed to save product',
      );
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
              const res = await fetch(
                `${API_BASE_URL}/api/products/${product.id}`,
                {
                  method: 'DELETE',
                },
              );

              if (!res.ok) {
                throw new Error('Failed to delete product');
              }

              await loadProducts();
            } catch (err: any) {
              console.error('Delete product error:', err);

              Alert.alert(
                'Error',
                err?.message || 'Failed to delete product',
              );
            }
          },
        },
      ],
    );
  };

  // ============================================================
  // DOWNLOAD LIST
  // ============================================================

  const handleDownloadList = () => {
    setDownloadMenuVisible(false);

    Alert.alert(
      'Download List',
      'Choose a format to download the product list.',
      [
        {
          text: 'PDF',
          onPress: () =>
            Alert.alert(
              'PDF',
              'PDF download option selected.',
            ),
        },
        {
          text: 'Excel',
          onPress: () =>
            Alert.alert(
              'Excel',
              'Excel download option selected.',
            ),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
    );
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
                <Text style={styles.clearBtnText}>
                  ✕
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* FILE BUTTON OUTSIDE SEARCH BOX */}

          <TouchableOpacity
            style={styles.fileButton}
            activeOpacity={0.7}
            onPress={() =>
              setDownloadMenuVisible(
                prev => !prev,
              )
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
                onPress={handleDownloadList}>

                <Text style={styles.downloadMenuIcon}>
                  ⇩
                </Text>

                <Text style={styles.downloadMenuText}>
                  Download List
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

          <TouchableOpacity
            style={styles.addProductButton}
            activeOpacity={0.8}
            onPress={openAddProductModal}>

            <Text style={styles.addProductPlus}>
              +
            </Text>

            <Text style={styles.addProductButtonText}>
              Add Product
            </Text>
          </TouchableOpacity>
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
                showsVerticalScrollIndicator={true}>

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
                              openEditProductModal(
                                product,
                              );
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
                              handleDeleteProduct(
                                product,
                              );
                            }}>

                            <View style={styles.binIcon}>
                              <View style={styles.binLid}>
                                <View
                                  style={
                                    styles.binHandle
                                  }
                                />
                              </View>

                              <View style={styles.binBody}>
                                <View
                                  style={
                                    styles.binInnerLine
                                  }
                                />

                                <View
                                  style={
                                    styles.binInnerLine
                                  }
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
                  {
                    length: totalPages,
                  },
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

              {/* PRODUCT NAME */}

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

              {/* PRODUCT CODE */}

              <Text style={styles.inputLabel}>
                Product Code
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter SKU / product code"
                placeholderTextColor="#94a3b8"
                value={sku}
                onChangeText={setSku}
              />

              {/* CATEGORY */}

              <Text style={styles.inputLabel}>
                Category
              </Text>

              <View style={styles.categoryDropdownContainer}>

                <TextInput
                  style={[
                    styles.input,
                    styles.categoryInput,
                  ]}
                  placeholder="Select or type category"
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
                  style={styles.categoryArrowButton}
                  onPress={() =>
                    setCategoryDropdownVisible(
                      !categoryDropdownVisible,
                    )
                  }>

                  <Text style={styles.categoryArrow}>
                    {categoryDropdownVisible
                      ? '▲'
                      : '▼'}
                  </Text>
                </TouchableOpacity>

                {categoryDropdownVisible && (
                  <View
                    style={
                      styles.categorySuggestions
                    }>

                    <ScrollView
                      keyboardShouldPersistTaps="handled"
                      nestedScrollEnabled
                      showsVerticalScrollIndicator={false}
                      style={
                        styles.categorySuggestionScroll
                      }>

                      {filteredCategories.length > 0 ? (
                        filteredCategories.map(item => (
                          <TouchableOpacity
                            key={item}
                            style={
                              styles.categorySuggestionItem
                            }
                            onPress={() => {
                              setCategory(item);
                              setCategoryDropdownVisible(
                                false,
                              );
                            }}>

                            <Text
                              style={
                                styles.categorySuggestionText
                              }>
                              {item}
                            </Text>
                          </TouchableOpacity>
                        ))
                      ) : (
                        <View
                          style={
                            styles.noCategoryContainer
                          }>
                          <Text
                            style={
                              styles.noCategoryText
                            }>
                            No matching category
                          </Text>
                        </View>
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* UNIT + GST */}

              <View style={styles.rowTwo}>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Unit
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Piece"
                    placeholderTextColor="#94a3b8"
                    value={unit}
                    onChangeText={setUnit}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    GST Rate
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="0%"
                    placeholderTextColor="#94a3b8"
                    value={gstRate}
                    onChangeText={setGstRate}
                  />
                </View>
              </View>

              {/* PRICES */}

              <View style={styles.rowTwo}>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Purchase Price
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter purchase price"
                    placeholderTextColor="#94a3b8"
                    value={purchasePrice}
                    onChangeText={setPurchasePrice}
                    keyboardType="decimal-pad"
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Selling Price
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter selling price"
                    placeholderTextColor="#94a3b8"
                    value={sellingPrice}
                    onChangeText={setSellingPrice}
                    keyboardType="decimal-pad"
                  />
                </View>
              </View>

              {/* TAX */}

              <View style={styles.rowThree}>

                <View style={styles.colThird}>
                  <Text style={styles.inputLabel}>
                    CGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={cgst}
                    onChangeText={setCgst}
                  />
                </View>

                <View style={styles.colThird}>
                  <Text style={styles.inputLabel}>
                    SGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={sgst}
                    onChangeText={setSgst}
                  />
                </View>

                <View style={styles.colThird}>
                  <Text style={styles.inputLabel}>
                    IGST
                  </Text>

                  <TextInput
                    style={styles.input}
                    value={igst}
                    onChangeText={setIgst}
                  />
                </View>
              </View>

              {/* OPENING STOCK */}

              <Text style={styles.inputLabel}>
                Opening Stock Quantity
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter opening stock"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={openingStock}
                onChangeText={setOpeningStock}
              />

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
    paddingVertical: 11,
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

  // ADD PRODUCT

  addProductButton: {
    height: 38,
    paddingHorizontal: 14,
    backgroundColor: '#4338ca',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addProductPlus: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 21,
    marginRight: 6,
  },

  addProductButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
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
    minWidth: 1220,
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
    color: '#334155',
    fontWeight: '600',
  },

  // STOCK

  stockCell: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  stockBadge: {
    minWidth: 42,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    alignItems: 'center',
  },

  stockText: {
    fontSize: 11,
    color: '#15803d',
    fontWeight: '700',
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
    width: 165,
  },

  colSku: {
    width: 105,
  },

  colPrice: {
    width: 115,
  },

  colCategory: {
    width: 125,
  },

  colUnit: {
    width: 75,
  },

  colGst: {
    width: 75,
  },

  colTax: {
    width: 72,
  },

  colStock: {
    width: 90,
  },

  colAction: {
    width: 88,
  },

  // EMPTY

  emptyContainer: {
    width: 1200,
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
    maxHeight: '88%',
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

  // CATEGORY

  categoryDropdownContainer: {
    position: 'relative',
    zIndex: 1000,
  },

  categoryInput: {
    paddingRight: 38,
  },

  categoryArrowButton: {
    position: 'absolute',
    right: 4,
    top: 5,
    width: 34,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },

  categoryArrow: {
    fontSize: 10,
    color: '#64748b',
  },

  categorySuggestions: {
    position: 'absolute',
    top: 44,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    maxHeight: 160,
    zIndex: 9999,
    elevation: 8,
  },

  categorySuggestionScroll: {
    maxHeight: 158,
  },

  categorySuggestionItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
  },

  categorySuggestionText: {
    fontSize: 13,
    color: '#334155',
  },

  noCategoryContainer: {
    paddingVertical: 14,
    paddingHorizontal: 12,
  },

  noCategoryText: {
    fontSize: 12,
    color: '#94a3b8',
  },

  // FORM

  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colHalf: {
    width: '48.5%',
  },

  rowThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  colThird: {
    width: '31%',
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