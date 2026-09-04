import React, {useState, useEffect} from 'react';
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
import {downloadCategories} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface ProductCategory {
  id: string;
  categoryName: string;
  description: string;
  status: string;
}

const DEFAULT_CATEGORIES: ProductCategory[] = [
  {
    id: '1',
    categoryName: 'Electronics',
    description: 'Computers, smartphones, accessories and gadgets',
    status: 'active',
  },
  {
    id: '2',
    categoryName: 'Grocery',
    description: 'Food grains, pulses, spices and daily household items',
    status: 'active',
  },
  {
    id: '3',
    categoryName: 'Office Supplies',
    description: 'Stationery, printer paper, files, folders and desk tools',
    status: 'active',
  },
  {
    id: '4',
    categoryName: 'Clothing & Apparel',
    description: 'Menswear, womenswear, kids garments and fashion items',
    status: 'active',
  },
  {
    id: '5',
    categoryName: 'Furniture',
    description: 'Office chairs, workstations, tables and storage cabinets',
    status: 'active',
  },
  {
    id: '6',
    categoryName: 'Hardware & Tools',
    description: 'Hand tools, power tools, fasteners and building fittings',
    status: 'active',
  },
  {
    id: '7',
    categoryName: 'Stationery',
    description: 'Notebooks, pens, registers and printing materials',
    status: 'active',
  },
  {
    id: '8',
    categoryName: 'Cosmetics & Personal Care',
    description: 'Skincare, haircare, beauty products and perfumes',
    status: 'active',
  },
  {
    id: '9',
    categoryName: 'Beverages',
    description: 'Tea, coffee, packaged juices and soft drinks',
    status: 'active',
  },
  {
    id: '10',
    categoryName: 'Medical & Pharma',
    description: 'First aid kits, health monitors and wellness supplies',
    status: 'active',
  },
  {
    id: '11',
    categoryName: 'Automobile Parts',
    description: 'Vehicle spare parts, lubricants and maintenance tools',
    status: 'active',
  },
  {
    id: '12',
    categoryName: 'Software & Subscriptions',
    description: 'Digital tools, software licenses and cloud services',
    status: 'active',
  },
  {
    id: '13',
    categoryName: 'Electricals',
    description: 'Wires, switches, LED lights and circuit breakers',
    status: 'active',
  },
  {
    id: '14',
    categoryName: 'General Merchandise',
    description: 'Miscellaneous items, packaging materials and gifts',
    status: 'active',
  },
];

const ProductCategoryMasterScreen = ({navigation}: Props) => {
  const [categories, setCategories] =
    useState<ProductCategory[]>(DEFAULT_CATEGORIES);

  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null,
  );

  // FORM FIELDS
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  // ============================================================
  // LOAD FROM DATABASE
  // ============================================================

  const loadCategoriesFromDB = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/categories`);

      if (response.ok) {
        const result = await response.json();

        const data = Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result)
          ? result
          : [];

        if (data.length > 0) {
          setCategories(
            data.map((item: any) => ({
              id: String(item.id),
              categoryName: item.category_name || item.name || '',
              description: item.description || '',
              status: item.status || 'active',
            })),
          );
        }
      }
    } catch (err) {
      console.log('Error loading categories from DB:', err);
    }
  };

  useEffect(() => {
    loadCategoriesFromDB();
  }, []);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setStatus('active');
    setEditingCategoryId(null);
  };

  // ============================================================
  // ADD CATEGORY
  // ============================================================

  const openAddCategoryModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // ============================================================
  // EDIT CATEGORY
  // ============================================================

  const openEditCategoryModal = (category: ProductCategory) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.categoryName || '');
    setDescription(category.description || '');
    setStatus(category.status === 'inactive' ? 'inactive' : 'active');
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
  // SAVE CATEGORY
  // ============================================================

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Category Name is required');
      return;
    }

    const categoryData: ProductCategory = {
      id: editingCategoryId || Date.now().toString(),
      categoryName: trimmedName,
      description: description.trim(),
      status: status,
    };

    try {
      if (editingCategoryId) {
        const res = await fetch(
          `${API_BASE_URL}/api/categories/${editingCategoryId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              category_name: trimmedName,
              description: description.trim(),
              status: status,
            }),
          },
        );

        if (res.ok) {
          const resJson = await res.json();

          if (resJson?.data?.id) {
            categoryData.id = String(resJson.data.id);
          }
        }

        setCategories(prev =>
          prev.map(c =>
            c.id === editingCategoryId ? categoryData : c,
          ),
        );

        Alert.alert(
          'Success',
          `Category "${trimmedName}" updated successfully!`,
        );
      } else {
        const res = await fetch(`${API_BASE_URL}/api/categories`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            category_name: trimmedName,
            description: description.trim(),
            status: status,
          }),
        });

        if (res.ok) {
          const resJson = await res.json();

          if (resJson?.data?.id) {
            categoryData.id = String(resJson.data.id);
          }
        }

        setCategories(prev => [categoryData, ...prev]);
        setCurrentPage(1);

        Alert.alert(
          'Success',
          `Category "${trimmedName}" added successfully!`,
        );
      }
    } catch (err) {
      if (editingCategoryId) {
        setCategories(prev =>
          prev.map(c =>
            c.id === editingCategoryId ? categoryData : c,
          ),
        );

        Alert.alert(
          'Success',
          `Category "${trimmedName}" updated successfully!`,
        );
      } else {
        setCategories(prev => [categoryData, ...prev]);
        setCurrentPage(1);

        Alert.alert(
          'Success',
          `Category "${trimmedName}" added successfully!`,
        );
      }
    }

    closeModal();
  };

  // ============================================================
  // DELETE CATEGORY
  // ============================================================

  const handleDeleteCategory = (category: ProductCategory) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.categoryName}"?`,
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
              await fetch(
                `${API_BASE_URL}/api/categories/${category.id}`,
                {
                  method: 'DELETE',
                },
              );
            } catch (err) {
              console.log('Delete category error:', err);
            }

            setCategories(prev =>
              prev.filter(c => c.id !== category.id),
            );
          },
        },
      ],
    );
  };

  // ============================================================
  // DOWNLOAD LIST
  // ============================================================

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredCategories.length > 0
        ? filteredCategories
        : categories;

    downloadCategories(targetList, format);
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredCategories = categories.filter(category => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      category.categoryName.toLowerCase().includes(query) ||
      category.description.toLowerCase().includes(query) ||
      category.status.toLowerCase().includes(query)
    );
  });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredCategories.length / CATEGORIES_PER_PAGE,
    ),
  );

  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * CATEGORIES_PER_PAGE,
    currentPage * CATEGORIES_PER_PAGE,
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
            Product Category Directory
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage all product categories
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
              placeholder="Search category name..."
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

          {/* FILE BUTTON */}
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
              Product Category Directory
            </Text>

            <Text style={styles.totalText}>
              Total Categories: {categories.length}
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
                  Category Name
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colStatus,
                  ]}>
                  Status
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

                {filteredCategories.length === 0 ? (
                  <View style={styles.emptyContainer}>

                    <Text style={styles.emptyText}>
                      {categories.length === 0
                        ? 'No categories added yet.'
                        : 'No categories found.'}
                    </Text>

                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={openAddCategoryModal}>

                      <Text style={styles.emptyAddBtnText}>
                        + 
                      </Text>

                    </TouchableOpacity>

                  </View>
                ) : (
                  paginatedCategories.map(
                    (category, index) => (
                      <TouchableOpacity
                        key={category.id}
                        activeOpacity={0.7}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 &&
                            styles.tableRowAlternate,
                        ]}
                        onPress={() =>
                          openEditCategoryModal(category)
                        }>

                        {/* NUMBER */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colNumber,
                          ]}>
                          {(currentPage - 1) *
                            CATEGORIES_PER_PAGE +
                            index +
                            1}
                        </Text>

                        {/* NAME */}
                        <View
                          style={[
                            styles.nameCell,
                            styles.colName,
                          ]}>
                          <Text
                            style={styles.categoryName}
                            numberOfLines={1}>
                            {category.categoryName}
                          </Text>
                        </View>

                        {/* STATUS */}
                        <View
                          style={[
                            styles.statusCell,
                            styles.colStatus,
                          ]}>

                          <View
                            style={[
                              styles.statusBadge,
                              category.status === 'inactive'
                                ? styles.statusBadgeInactive
                                : styles.statusBadgeActive,
                            ]}>

                            <Text
                              style={[
                                styles.statusText,
                                category.status === 'inactive'
                                  ? styles.statusTextInactive
                                  : styles.statusTextActive,
                              ]}>
                              {category.status === 'inactive'
                                ? 'Inactive'
                                : 'Active'}
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
                              openEditCategoryModal(category);
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
                              handleDeleteCategory(category);
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

          {/* ================================================== */}
          {/* ADD CATEGORY BUTTON - BOTTOM */}
          {/* ================================================== */}

          <View style={styles.bottomAddContainer}>

            <TouchableOpacity
              style={styles.addCategoryButton}
              activeOpacity={0.8}
              onPress={openAddCategoryModal}>

              <Text style={styles.addCategoryPlus}>
                +
              </Text>

              <Text style={styles.addCategoryButtonText}>
                
              </Text>

            </TouchableOpacity>

          </View>

          {/* PAGINATION */}
          {filteredCategories.length > 0 && (
            <View style={styles.paginationContainer}>

              <Text style={styles.paginationInfo}>
                Showing{' '}
                {(currentPage - 1) *
                  CATEGORIES_PER_PAGE +
                  1}{' '}
                -{' '}
                {Math.min(
                  currentPage * CATEGORIES_PER_PAGE,
                  filteredCategories.length,
                )}{' '}
                of {filteredCategories.length}
              </Text>

              <View style={styles.paginationControls}>

                {/* PREVIOUS */}
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

                {/* PAGE NUMBERS */}
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
                    onPress={() => setCurrentPage(page)}>

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

                {/* NEXT */}
                <TouchableOpacity
                  style={[
                    styles.paginationButton,
                    currentPage === totalPages &&
                      styles.paginationButtonDisabled,
                  ]}
                  disabled={currentPage === totalPages}
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

      {/* ====================================================== */}
      {/* ADD / EDIT MODAL */}
      {/* ====================================================== */}

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
                  {editingCategoryId
                    ? 'Edit Category'
                    : 'Add Category'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {editingCategoryId
                    ? 'Update category information'
                    : 'Enter category information'}
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

              {/* CATEGORY NAME */}
              <Text style={styles.inputLabel}>
                Category Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter category name"
                placeholderTextColor="#94a3b8"
                value={categoryName}
                onChangeText={setCategoryName}
              />

              {/* DESCRIPTION */}
              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                ]}
                placeholder="Enter category description"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              {/* STATUS */}
              <Text style={styles.inputLabel}>
                Status
              </Text>

              <View style={styles.statusToggleRow}>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.statusToggleBtn,
                    status === 'active' &&
                      styles.statusToggleBtnActive,
                  ]}
                  onPress={() => setStatus('active')}>

                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'active' &&
                        styles.statusToggleTextActive,
                    ]}>
                    Active
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.statusToggleBtn,
                    status === 'inactive' &&
                      styles.statusToggleBtnInactive,
                  ]}
                  onPress={() => setStatus('inactive')}>

                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'inactive' &&
                        styles.statusToggleTextInactive,
                    ]}>
                    Inactive
                  </Text>

                </TouchableOpacity>

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
                onPress={handleSaveCategory}>

                <Text style={styles.saveButtonText}>
                  {editingCategoryId
                    ? 'Update Category'
                    : 'Save Category'}
                </Text>

              </TouchableOpacity>

            </View>

          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
};

export default ProductCategoryMasterScreen;

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

  // SEARCH
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

  // ============================================================
  // ADD CATEGORY BUTTON - BOTTOM
  // ============================================================

  bottomAddContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
  },

  addCategoryButton: {
    height: 38,
    paddingHorizontal: 14,
    backgroundColor: '#4338ca',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCategoryPlus: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    lineHeight: 21,
    marginRight: 6,
  },

  addCategoryButtonText: {
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
    minWidth: 540,
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

  alignLeft: {
    textAlign: 'left',
    paddingHorizontal: 10,
  },

  nameCell: {
    justifyContent: 'center',
    paddingHorizontal: 10,
  },

  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },

  statusCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },

  statusBadgeActive: {
    backgroundColor: '#dcfce7',
  },

  statusBadgeInactive: {
    backgroundColor: '#fee2e2',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  statusTextActive: {
    color: '#15803d',
  },

  statusTextInactive: {
    color: '#b91c1c',
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
    width: 50,
  },

  colName: {
    width: 260,
  },

  colStatus: {
    width: 120,
  },

  colAction: {
    width: 110,
  },

  // EMPTY
  emptyContainer: {
    width: 540,
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
    paddingVertical: 10,
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

  textArea: {
    height: 80,
    paddingTop: 8,
    textAlignVertical: 'top',
  },

  statusToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },

  statusToggleBtn: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusToggleBtnActive: {
    borderColor: '#15803d',
    backgroundColor: '#dcfce7',
  },

  statusToggleBtnInactive: {
    borderColor: '#b91c1c',
    backgroundColor: '#fee2e2',
  },

  statusToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  statusToggleTextActive: {
    color: '#15803d',
    fontWeight: '700',
  },

  statusToggleTextInactive: {
    color: '#b91c1c',
    fontWeight: '700',
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