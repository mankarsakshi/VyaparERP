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
  Platform,
  Dimensions,
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

const INITIAL_DEMO_CATEGORIES: ProductCategory[] = [
  {id: '1', categoryName: 'Dairy', description: 'Milk, Butter, Cheese & Curd products', status: 'active'},
  {id: '2', categoryName: 'Snacks', description: 'Chips, Namkeen, Biscuits & Cookies', status: 'active'},
  {id: '3', categoryName: 'Stationery', description: 'Notebooks, Pens, Files & Office items', status: 'active'},
  {id: '4', categoryName: 'Beverages', description: 'Tea, Coffee, Juices & Soft drinks', status: 'active'},
  {id: '5', categoryName: 'Personal Care', description: 'Soaps, Shampoos, Toothpaste & Skincare', status: 'active'},
  {id: '6', categoryName: 'Household', description: 'Detergents, Cleaners & Disinfectants', status: 'active'},
  {id: '7', categoryName: 'Chocolates', description: 'Bars, Candies, Sweets & Confectionery', status: 'active'},
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

const ProductCategoryMasterScreen = ({navigation}: Props) => {
  const [categories, setCategories] = useState<ProductCategory[]>(INITIAL_DEMO_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form states
  const [categoryName, setCategoryName] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'active' | 'inactive'>('active');

  const loadCategoriesFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetchWithFallback('/api/categories');

      if (response && response.ok) {
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategoriesFromDB();
  }, []);

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setStatus('active');
    setEditingCategoryId(null);
  };

  const openAddCategoryModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditCategoryModal = (category: ProductCategory) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.categoryName || '');
    setDescription(category.description || '');
    setStatus(category.status === 'inactive' ? 'inactive' : 'active');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();
    if (!trimmedName) {
      Alert.alert('Validation Error', 'Category Name is required');
      return;
    }

    const payload = {
      category_name: trimmedName,
      description: description.trim(),
      status: status,
    };

    try {
      if (editingCategoryId) {
        await fetchWithFallback(`/api/categories/${editingCategoryId}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
      } else {
        await fetchWithFallback('/api/categories', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        });
      }
    } catch (err) {
      console.log('Category save backend offline:', err);
    }

    const categoryData: ProductCategory = {
      id: editingCategoryId || Date.now().toString(),
      categoryName: trimmedName,
      description: description.trim(),
      status: status,
    };

    if (editingCategoryId) {
      setCategories(prev =>
        prev.map(c => (c.id === editingCategoryId ? categoryData : c)),
      );
      Alert.alert('Success', `Category "${trimmedName}" updated successfully!`);
    } else {
      setCategories(prev => [categoryData, ...prev]);
      setCurrentPage(1);
      Alert.alert('Success', `Category "${trimmedName}" added successfully!`);
    }

    closeModal();
  };

  const handleDeleteCategory = (category: ProductCategory) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete "${category.categoryName}"?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await fetchWithFallback(`/api/categories/${category.id}`, {
                method: 'DELETE',
              });
            } catch (err) {
              console.log('Delete category offline:', err);
            }
            setCategories(prev => prev.filter(c => c.id !== category.id));
          },
        },
      ],
    );
  };

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);
    const targetList =
      filteredCategories.length > 0 ? filteredCategories : categories;
    downloadCategories(targetList, format);
  };

  const filteredCategories = categories.filter(cat => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (cat.categoryName && cat.categoryName.toLowerCase().includes(q)) ||
      (cat.description && cat.description.toLowerCase().includes(q)) ||
      (cat.status && cat.status.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCategories.length / CATEGORIES_PER_PAGE),
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * CATEGORIES_PER_PAGE;
  const endIndex = Math.min(
    startIndex + CATEGORIES_PER_PAGE,
    filteredCategories.length,
  );
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

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
          <Text style={styles.headerTitle}>Product Category Master</Text>
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
            placeholder="Search categories..."
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
              <Text style={[styles.columnHeader, styles.colName]}>
                CATEGORY NAME
              </Text>
              <Text style={[styles.columnHeader, styles.colStatus]}>
                STATUS
              </Text>
              <Text style={[styles.columnHeader, styles.colActions]}>
                ACTIONS
              </Text>
            </View>

            {/* TABLE BODY ROWS */}
            {currentCategories.map((item, index) => {
              const globalIndex = startIndex + index + 1;
              const isActive = item.status === 'active';

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.tableRow,
                    index === currentCategories.length - 1 && styles.tableRowLast,
                  ]}>
                  {/* # Column */}
                  <View style={styles.colIndex}>
                    <Text style={styles.cellIndexText}>{globalIndex}</Text>
                  </View>

                  {/* Category Name Column */}
                  <View style={styles.colName}>
                    <Text style={styles.cellNameText} numberOfLines={1}>
                      {item.categoryName}
                    </Text>
                  </View>

                  {/* Status Column */}
                  <View style={styles.colStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        isActive ? styles.statusBadgeActive : styles.statusBadgeInactive,
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isActive ? styles.statusTextActive : styles.statusTextInactive,
                        ]}>
                        {isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  {/* Actions Column */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => openEditCategoryModal(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <PencilIcon size={14} color="#ea7e30" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleDeleteCategory(item)}
                      hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
                      <DustbinIcon size={14} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentCategories.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>No categories found.</Text>
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
        {filteredCategories.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredCategories.length}`}
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
        onPress={openAddCategoryModal}>
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
            <Text style={styles.exportMenuTitle}>Export Categories</Text>
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
      {/* 8. ADD / EDIT CATEGORY MODAL                      */}
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
                {editingCategoryId ? 'Edit Category' : 'Add New Category'}
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
              <Text style={styles.inputLabel}>Category Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Dairy, Snacks..."
                value={categoryName}
                onChangeText={setCategoryName}
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.formInput, styles.textAreaInput]}
                placeholder="Brief description of this category..."
                multiline
                numberOfLines={3}
                value={description}
                onChangeText={setDescription}
              />

              <Text style={styles.inputLabel}>Status</Text>
              <View style={styles.statusToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    status === 'active' && styles.statusToggleBtnActive,
                  ]}
                  onPress={() => setStatus('active')}>
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'active' && styles.statusToggleTextActive,
                    ]}>
                    Active
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    status === 'inactive' && styles.statusToggleBtnInactive,
                  ]}
                  onPress={() => setStatus('inactive')}>
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'inactive' && styles.statusToggleTextInactive,
                    ]}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.formModalFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveCategory}>
                <Text style={styles.saveBtnText}>
                  {editingCategoryId ? 'Update Category' : 'Save Category'}
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
    width: 220,
    justifyContent: 'center',
    paddingRight: 10,
  },
  colStatus: {
    width: 90,
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
    paddingVertical: 14,
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

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },

  statusBadgeActive: {
    backgroundColor: '#ecfdf5',
  },

  statusBadgeInactive: {
    backgroundColor: '#f1f5f9',
  },

  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },

  statusTextActive: {
    color: '#059669',
  },

  statusTextInactive: {
    color: '#64748b',
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
    borderBottomColor: '#f1f1f4',
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

  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },

  statusToggleRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },

  statusToggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  statusToggleBtnActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },

  statusToggleBtnInactive: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },

  statusToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  statusToggleTextActive: {
    color: '#059669',
    fontWeight: '700',
  },

  statusToggleTextInactive: {
    color: '#ef4444',
    fontWeight: '700',
  },

  formModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f4',
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