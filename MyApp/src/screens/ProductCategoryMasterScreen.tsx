// // import React, {useState} from 'react';
// // import {
// //   View,
// //   Text,
// //   TextInput,
// //   TouchableOpacity,
// //   StyleSheet,
// //   ScrollView,
// //   SafeAreaView,
// //   Alert,
// //   Modal,
// // } from 'react-native';

// // type Props = {
// //   navigation: any;
// //   route: any;
// // };

// // interface Category {
// //   id: string;
// //   name: string;
// //   description: string;
// //   code: string;
// //   productCount: number;
// //   subCategories?: string[];
// // }

// // const DEFAULT_CATEGORIES: Category[] = [
// //   {
// //     id: '1',
// //     name: 'Electronics',
// //     description: 'Electronic hardware, accessories and consumer gadgets',
// //     code: 'CAT-ELEC',
// //     productCount: 45,
// //     subCategories: ['Laptop', 'Mouse', 'Keyboard', 'Monitor'],
// //   },
// //   {
// //     id: '2',
// //     name: 'Grocery',
// //     description: 'Daily household food grains, staples and essential groceries',
// //     code: 'CAT-GROC',
// //     productCount: 120,
// //     subCategories: ['Rice', 'Sugar', 'Oil', 'Flour'],
// //   },
// //   {
// //     id: '3',
// //     name: 'Clothing',
// //     description: 'Men, Women & Kids apparel and fashion wear',
// //     code: 'CAT-CLOTH',
// //     productCount: 38,
// //     subCategories: ['Shirts', 'Jeans', 'Jackets'],
// //   },
// //   {
// //     id: '4',
// //     name: 'Furniture',
// //     description: 'Office desks, chairs and home furniture items',
// //     code: 'CAT-FURN',
// //     productCount: 19,
// //     subCategories: ['Chairs', 'Tables', 'Cabinets'],
// //   },
// // ];

// // const ProductCategoryMasterScreen = ({navigation}: Props) => {
// //   const [categories, setCategories] = useState<Category[]>([]);
// //   const [searchQuery, setSearchQuery] = useState('');

// //   // Form Modal state
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [editingId, setEditingId] = useState<string | null>(null);
// //   const [catName, setCatName] = useState('');
// //   const [catDesc, setCatDesc] = useState('');

// //   const openAddModal = () => {
// //     setEditingId(null);
// //     setCatName('');
// //     setCatDesc('');
// //     setModalVisible(true);
// //   };

// //   const openEditModal = (cat: Category) => {
// //     setEditingId(cat.id);
// //     setCatName(cat.name);
// //     setCatDesc(cat.description);
// //     setModalVisible(true);
// //   };

// //   const handleSaveCategory = () => {
// //     if (!catName.trim()) {
// //       Alert.alert('Validation Error', 'Please enter a Category Name');
// //       return;
// //     }

// //     if (editingId) {
// //       // Edit existing
// //       setCategories(prev =>
// //         prev.map(c =>
// //           c.id === editingId
// //             ? {...c, name: catName.trim(), description: catDesc.trim()}
// //             : c,
// //         ),
// //       );
// //       Alert.alert('Success', 'Category updated successfully!');
// //     } else {
// //       // Add new
// //       const newCat: Category = {
// //         id: Date.now().toString(),
// //         name: catName.trim(),
// //         description: catDesc.trim() || 'No description provided',
// //         code: `CAT-${catName.substring(0, 4).toUpperCase()}`,
// //         productCount: 0,
// //         subCategories: [],
// //       };
// //       setCategories([newCat, ...categories]);
// //       Alert.alert('Success', `Category "${newCat.name}" added to Master!`);
// //     }

// //     setModalVisible(false);
// //   };

// //   const handleDeleteCategory = (id: string, name: string) => {
// //     Alert.alert(
// //       'Delete Category',
// //       `Are you sure you want to delete "${name}" from Category Master?`,
// //       [
// //         {text: 'Cancel', style: 'cancel'},
// //         {
// //           text: 'Delete',
// //           style: 'destructive',
// //           onPress: () => {
// //             setCategories(prev => prev.filter(c => c.id !== id));
// //             Alert.alert('Deleted', `Category "${name}" removed.`);
// //           },
// //         },
// //       ],
// //     );
// //   };

// //   const filteredCategories = categories.filter(c =>
// //     c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
// //     c.code.toLowerCase().includes(searchQuery.toLowerCase()),
// //   );

// //   return (
// //     <SafeAreaView style={styles.container}>
// //       {/* HEADER */}
// //       <View style={styles.header}>
// //         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
// //           <Text style={styles.backText}>←</Text>
// //         </TouchableOpacity>
// //         <View style={styles.headerTitleBox}>
// //           <Text style={styles.headerTitle}>Product Category Master</Text>
// //           <Text style={styles.headerSubtitle}>Group similar products together</Text>
// //         </View>
// //         <TouchableOpacity style={styles.addBtn} onPress={openAddModal}>
// //           <Text style={styles.addBtnText}>+ Add</Text>
// //         </TouchableOpacity>
// //       </View>

// //       <ScrollView contentContainerStyle={styles.content}>
// //         {/* SEARCH BAR */}
// //         <View style={styles.searchBox}>
// //           <Text style={styles.searchIcon}></Text>
// //           <TextInput
// //             style={styles.searchInput}
// //             placeholder="Search category name or code..."
// //             value={searchQuery}
// //             onChangeText={setSearchQuery}
// //             placeholderTextColor="#94a3b8"
// //           />
// //         </View>

// //         <Text style={styles.sectionTitle}>
// //           Category List ({filteredCategories.length})
// //         </Text>

// //         {filteredCategories.map(cat => (
// //           <View key={cat.id} style={styles.catCard}>
// //             <View style={styles.catCardHeader}>
// //               <View style={styles.catIconCircle}>
// //                 <Text style={styles.catIconText}></Text>
// //               </View>
// //               <View style={styles.catHeaderInfo}>
// //                 <View style={styles.catTitleRow}>
// //                   <Text style={styles.catName}>{cat.name}</Text>
// //                   <Text style={styles.catCode}>{cat.code}</Text>
// //                 </View>
// //                 <Text style={styles.catDesc}>{cat.description}</Text>
// //               </View>
// //             </View>

// //             {/* Sub-item tags preview */}
// //             {cat.subCategories && cat.subCategories.length > 0 && (
// //               <View style={styles.subTagsRow}>
// //                 {cat.subCategories.map((sub, idx) => (
// //                   <View key={idx} style={styles.subTag}>
// //                     <Text style={styles.subTagText}>• {sub}</Text>
// //                   </View>
// //                 ))}
// //               </View>
// //             )}

// //             {/* CARD FOOTER WITH ACTIONS */}
// //             <View style={styles.cardFooter}>
// //               <Text style={styles.productCountText}>
// //                 * {cat.productCount} Linked Products
// //               </Text>
// //               <View style={styles.actionsRow}>
// //                 <TouchableOpacity
// //                   style={styles.editBtn}
// //                   onPress={() => openEditModal(cat)}>
// //                   <Text style={styles.editBtnText}>Edit</Text>
// //                 </TouchableOpacity>
// //                 <TouchableOpacity
// //                   style={styles.deleteBtn}
// //                   onPress={() => handleDeleteCategory(cat.id, cat.name)}>
// //                   <Text style={styles.deleteBtnText}>Delete</Text>
// //                 </TouchableOpacity>
// //               </View>
// //             </View>
// //           </View>
// //         ))}
// //       </ScrollView>

// //       {/* ADD / EDIT MODAL */}
// //       <Modal visible={modalVisible} animationType="slide" transparent={true}>
// //         <View style={styles.modalOverlay}>
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalHeader}>
// //               <Text style={styles.modalTitle}>
// //                 {editingId ? 'Edit Category' : 'Add New Category'}
// //               </Text>
// //               <TouchableOpacity onPress={() => setModalVisible(false)}>
// //                 <Text style={styles.modalCloseText}>✕</Text>
// //               </TouchableOpacity>
// //             </View>

// //             <ScrollView style={styles.modalBody}>
// //               <Text style={styles.inputLabel}>Category Name *</Text>
// //               <TextInput
// //                 style={styles.input}
// //                 placeholder="Enter category name"
// //                 placeholderTextColor="#94a3b8"
// //                 value={catName}
// //                 onChangeText={setCatName}
// //               />

// //               <Text style={styles.inputLabel}>Description</Text>
// //               <TextInput
// //                 style={[styles.input, styles.textArea]}
// //                 placeholder="Enter category description"
// //                 placeholderTextColor="#94a3b8"
// //                 value={catDesc}
// //                 onChangeText={setCatDesc}
// //                 multiline={true}
// //                 numberOfLines={3}
// //               />
// //             </ScrollView>

// //             <View style={styles.modalFooter}>
// //               <TouchableOpacity
// //                 style={styles.cancelModalBtn}
// //                 onPress={() => setModalVisible(false)}>
// //                 <Text style={styles.cancelModalBtnText}>Cancel</Text>
// //               </TouchableOpacity>
// //               <TouchableOpacity
// //                 style={styles.saveModalBtn}
// //                 onPress={handleSaveCategory}>
// //                 <Text style={styles.saveModalBtnText}>
// //                   {editingId ? 'Update' : 'Save'} Category
// //                 </Text>
// //               </TouchableOpacity>
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </SafeAreaView>
// //   );
// // };

// // export default ProductCategoryMasterScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f8fafc',
// //   },
// //   header: {
// //     backgroundColor: '#4338ca',
// //     paddingTop: 42,
// //     paddingBottom: 16,
// //     paddingHorizontal: 16,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   backBtn: {
// //     paddingRight: 12,
// //   },
// //   backText: {
// //     fontSize: 22,
// //     color: '#ffffff',
// //     fontWeight: 'bold',
// //   },
// //   headerTitleBox: {
// //     flex: 1,
// //   },
// //   headerTitle: {
// //     fontSize: 18,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   headerSubtitle: {
// //     fontSize: 12,
// //     color: '#c7d2fe',
// //   },
// //   addBtn: {
// //     backgroundColor: 'rgba(255, 255, 255, 0.25)',
// //     paddingHorizontal: 14,
// //     paddingVertical: 7,
// //     borderRadius: 8,
// //   },
// //   addBtnText: {
// //     color: '#ffffff',
// //     fontWeight: '700',
// //     fontSize: 13,
// //   },
// //   content: {
// //     padding: 16,
// //   },
// //   searchBox: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 10,
// //     borderWidth: 1,
// //     borderColor: '#cbd5e1',
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     paddingHorizontal: 12,
// //     marginBottom: 16,
// //   },
// //   searchIcon: {
// //     marginRight: 8,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     paddingVertical: 10,
// //     fontSize: 14,
// //     color: '#0f172a',
// //   },
// //   sectionTitle: {
// //     fontSize: 14,
// //     fontWeight: '700',
// //     color: '#334155',
// //     marginBottom: 10,
// //   },
// //   catCard: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 12,
// //     padding: 14,
// //     marginBottom: 12,
// //     borderWidth: 1,
// //     borderColor: '#e2e8f0',
// //     elevation: 1,
// //   },
// //   catCardHeader: {
// //     flexDirection: 'row',
// //     alignItems: 'flex-start',
// //   },
// //   catIconCircle: {
// //     width: 38,
// //     height: 38,
// //     borderRadius: 9,
// //     backgroundColor: '#e0e7ff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     marginRight: 12,
// //   },
// //   catIconText: {
// //     fontSize: 18,
// //   },
// //   catHeaderInfo: {
// //     flex: 1,
// //   },
// //   catTitleRow: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   catName: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: '#0f172a',
// //   },
// //   catCode: {
// //     fontSize: 11,
// //     color: '#4338ca',
// //     fontWeight: '600',
// //     backgroundColor: '#e0e7ff',
// //     paddingHorizontal: 6,
// //     paddingVertical: 2,
// //     borderRadius: 4,
// //   },
// //   catDesc: {
// //     fontSize: 12,
// //     color: '#64748b',
// //     marginTop: 4,
// //   },
// //   subTagsRow: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginTop: 10,
// //     paddingTop: 8,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f1f5f9',
// //   },
// //   subTag: {
// //     backgroundColor: '#f1f5f9',
// //     paddingHorizontal: 8,
// //     paddingVertical: 3,
// //     borderRadius: 6,
// //     marginRight: 6,
// //     marginBottom: 4,
// //   },
// //   subTagText: {
// //     fontSize: 11,
// //     color: '#475569',
// //     fontWeight: '500',
// //   },
// //   cardFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     marginTop: 10,
// //     paddingTop: 8,
// //     borderTopWidth: 1,
// //     borderTopColor: '#f1f5f9',
// //   },
// //   productCountText: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: '#334155',
// //   },
// //   actionsRow: {
// //     flexDirection: 'row',
// //   },
// //   editBtn: {
// //     backgroundColor: '#eff6ff',
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 6,
// //     marginRight: 8,
// //   },
// //   editBtnText: {
// //     fontSize: 12,
// //     color: '#2563eb',
// //     fontWeight: '600',
// //   },
// //   deleteBtn: {
// //     backgroundColor: '#fef2f2',
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 6,
// //   },
// //   deleteBtnText: {
// //     fontSize: 12,
// //     color: '#ef4444',
// //     fontWeight: '600',
// //   },
// //   modalOverlay: {
// //     flex: 1,
// //     backgroundColor: 'rgba(15, 23, 42, 0.5)',
// //     justifyContent: 'center',
// //     padding: 16,
// //   },
// //   modalContainer: {
// //     backgroundColor: '#ffffff',
// //     borderRadius: 14,
// //     maxHeight: '80%',
// //     overflow: 'hidden',
// //   },
// //   modalHeader: {
// //     backgroundColor: '#4338ca',
// //     padding: 16,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   modalTitle: {
// //     fontSize: 16,
// //     fontWeight: '700',
// //     color: '#ffffff',
// //   },
// //   modalCloseText: {
// //     fontSize: 18,
// //     color: '#ffffff',
// //     fontWeight: 'bold',
// //   },
// //   modalBody: {
// //     padding: 16,
// //   },
// //   inputLabel: {
// //     fontSize: 12,
// //     fontWeight: '600',
// //     color: '#475569',
// //     marginBottom: 4,
// //     marginTop: 8,
// //   },
// //   input: {
// //     backgroundColor: '#f8fafc',
// //     borderWidth: 1,
// //     borderColor: '#cbd5e1',
// //     borderRadius: 8,
// //     paddingHorizontal: 12,
// //     paddingVertical: 8,
// //     fontSize: 14,
// //     color: '#0f172a',
// //   },
// //   textArea: {
// //     height: 70,
// //     textAlignVertical: 'top',
// //   },
// //   modalFooter: {
// //     flexDirection: 'row',
// //     justifyContent: 'flex-end',
// //     padding: 16,
// //     borderTopWidth: 1,
// //     borderTopColor: '#e2e8f0',
// //     backgroundColor: '#f8fafc',
// //   },
// //   cancelModalBtn: {
// //     paddingHorizontal: 14,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //     marginRight: 8,
// //   },
// //   cancelModalBtnText: {
// //     color: '#64748b',
// //     fontWeight: '600',
// //   },
// //   saveModalBtn: {
// //     backgroundColor: '#4338ca',
// //     paddingHorizontal: 16,
// //     paddingVertical: 8,
// //     borderRadius: 8,
// //   },
// //   saveModalBtnText: {
// //     color: '#ffffff',
// //     fontWeight: '700',
// //   },
// // });


// import React, {useMemo, useState} from 'react';
// import {
//   Alert,
//   Modal,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';

// export interface ProductCategory {
//   id: string;
//   categoryName: string;
//   description: string;
//   productCount: number;
//   status: 'Active' | 'Inactive';
// }

// const ProductCategoryMasterScreen = ({navigation}: any) => {
//   const [categories, setCategories] = useState<ProductCategory[]>([]);

//   const [searchText, setSearchText] = useState('');

//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingCategory, setEditingCategory] =
//     useState<ProductCategory | null>(null);

//   const [categoryName, setCategoryName] = useState('');
//   const [description, setDescription] = useState('');
//   const [status, setStatus] =
//     useState<'Active' | 'Inactive'>('Active');

//   const [showStatusDropdown, setShowStatusDropdown] = useState(false);
//   const [actionMenuId, setActionMenuId] = useState<string | null>(null);

//   const filteredCategories = useMemo(() => {
//     const search = searchText.toLowerCase().trim();

//     if (!search) {
//       return categories;
//     }

//     return categories.filter(item =>
//       item.categoryName.toLowerCase().includes(search) ||
//       item.description.toLowerCase().includes(search) ||
//       item.status.toLowerCase().includes(search),
//     );
//   }, [categories, searchText]);

//   const resetForm = () => {
//     setCategoryName('');
//     setDescription('');
//     setStatus('Active');
//     setEditingCategory(null);
//     setShowStatusDropdown(false);
//   };

//   const openAddCategoryModal = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   const openEditCategoryModal = (category: ProductCategory) => {
//     setEditingCategory(category);
//     setCategoryName(category.categoryName);
//     setDescription(category.description);
//     setStatus(category.status);
//     setShowStatusDropdown(false);
//     setActionMenuId(null);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     resetForm();
//   };

//   const saveCategory = () => {
//     const trimmedName = categoryName.trim();

//     if (!trimmedName) {
//       Alert.alert('Validation', 'Please enter category name.');
//       return;
//     }

//     const duplicate = categories.some(
//       item =>
//         item.categoryName.toLowerCase() === trimmedName.toLowerCase() &&
//         item.id !== editingCategory?.id,
//     );

//     if (duplicate) {
//       Alert.alert('Duplicate Category', 'This category already exists.');
//       return;
//     }

//     if (editingCategory) {
//       setCategories(prev =>
//         prev.map(item =>
//           item.id === editingCategory.id
//             ? {
//                 ...item,
//                 categoryName: trimmedName,
//                 description: description.trim(),
//                 status,
//               }
//             : item,
//         ),
//       );
//     } else {
//       const newCategory: ProductCategory = {
//         id: Date.now().toString(),
//         categoryName: trimmedName,
//         description: description.trim(),
//         productCount: 0,
//         status,
//       };

//       setCategories(prev => [...prev, newCategory]);
//     }

//     closeModal();
//   };

//   const deleteCategory = (category: ProductCategory) => {
//     setActionMenuId(null);

//     if (category.productCount > 0) {
//       Alert.alert(
//         'Cannot Delete',
//         'This category contains products and cannot be deleted.',
//       );
//       return;
//     }

//     Alert.alert(
//       'Delete Category',
//       `Are you sure you want to delete "${category.categoryName}"?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setCategories(prev =>
//               prev.filter(item => item.id !== category.id),
//             );
//           },
//         },
//       ],
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity
//           style={styles.backButton}
//           activeOpacity={0.7}
//           onPress={() => navigation?.goBack()}>
//           <Text style={styles.backIcon}>‹</Text>
//         </TouchableOpacity>

//         <View style={styles.headerTextContainer}>
//           <Text style={styles.headerTitle}>Product Category Master</Text>
//           <Text style={styles.headerSubtitle}>
//             Manage your product categories
//           </Text>
//         </View>
//       </View>

//       {/* Search */}
//       <View style={styles.searchSection}>
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>⌕</Text>

//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search category..."
//             placeholderTextColor="#94a3b8"
//             value={searchText}
//             onChangeText={setSearchText}
//           />

//           {searchText.length > 0 && (
//             <TouchableOpacity
//               onPress={() => setSearchText('')}
//               style={styles.clearSearch}>
//               <Text style={styles.clearSearchText}>×</Text>
//             </TouchableOpacity>
//           )}
//         </View>
//       </View>

//       {/* Table Section */}
//       <View style={styles.tableSection}>
//         {/* Top Table Bar */}
//         <View style={styles.tableTopBar}>
//           <View style={styles.tableTitleContainer}>
//             <Text style={styles.tableSectionTitle}>Category List</Text>

//             <Text style={styles.tableSectionCount}>
//               Total Categories: {filteredCategories.length}
//             </Text>
//           </View>

//           {/* ONLY ADD CATEGORY BUTTON */}
//           <TouchableOpacity
//             style={styles.addCategoryTopButton}
//             activeOpacity={0.8}
//             onPress={openAddCategoryModal}>
//             <Text style={styles.addCategoryTopPlus}>+</Text>
//             <Text style={styles.addCategoryTopText}>
//               Add Category
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Horizontal Table */}
//         <View style={styles.tableWrapper}>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={true}
//             persistentScrollbar={true}
//             contentContainerStyle={styles.horizontalTableContent}>
//             <View style={styles.tableContainer}>
//               {/* Table Header */}
//               <View style={styles.tableHeader}>
//                 <View style={[styles.cell, styles.colNumber]}>
//                   <Text style={styles.headerText}>#</Text>
//                 </View>

//                 <View style={[styles.cell, styles.colCategory]}>
//                   <Text style={styles.headerText}>Category Name</Text>
//                 </View>

//                 <View style={[styles.cell, styles.colDescription]}>
//                   <Text style={styles.headerText}>Description</Text>
//                 </View>

//                 <View style={[styles.cell, styles.colProducts]}>
//                   <Text style={styles.headerText}>Products</Text>
//                 </View>

//                 <View style={[styles.cell, styles.colStatus]}>
//                   <Text style={styles.headerText}>Status</Text>
//                 </View>

//                 <View style={[styles.cell, styles.colAction]}>
//                   <Text style={styles.headerText}>Action</Text>
//                 </View>
//               </View>

//               {/* Table Rows */}
//               {filteredCategories.length > 0 ? (
//                 filteredCategories.map((item, index) => (
//                   <View key={item.id} style={styles.tableRow}>
//                     <View style={[styles.cell, styles.colNumber]}>
//                       <Text style={styles.cellText}>{index + 1}</Text>
//                     </View>

//                     <View style={[styles.cell, styles.colCategory]}>
//                       <Text
//                         style={styles.categoryNameText}
//                         numberOfLines={1}>
//                         {item.categoryName}
//                       </Text>
//                     </View>

//                     <View style={[styles.cell, styles.colDescription]}>
//                       <Text
//                         style={styles.cellText}
//                         numberOfLines={1}>
//                         {item.description || '-'}
//                       </Text>
//                     </View>

//                     <View style={[styles.cell, styles.colProducts]}>
//                       <Text style={styles.cellText}>
//                         {item.productCount}
//                       </Text>
//                     </View>

//                     <View style={[styles.cell, styles.colStatus]}>
//                       <View
//                         style={[
//                           styles.statusBadge,
//                           item.status === 'Active'
//                             ? styles.activeBadge
//                             : styles.inactiveBadge,
//                         ]}>
//                         <Text
//                           style={[
//                             styles.statusText,
//                             item.status === 'Active'
//                               ? styles.activeText
//                               : styles.inactiveText,
//                           ]}>
//                           {item.status}
//                         </Text>
//                       </View>
//                     </View>

//                     <View style={[styles.cell, styles.colAction]}>
//                       <TouchableOpacity
//                         style={styles.actionButton}
//                         activeOpacity={0.7}
//                         onPress={() =>
//                           setActionMenuId(
//                             actionMenuId === item.id
//                               ? null
//                               : item.id,
//                           )
//                         }>
//                         <Text style={styles.actionDots}>⋮</Text>
//                       </TouchableOpacity>

//                       {actionMenuId === item.id && (
//                         <View style={styles.actionMenu}>
//                           <TouchableOpacity
//                             style={styles.menuItem}
//                             onPress={() =>
//                               openEditCategoryModal(item)
//                             }>
//                             <Text style={styles.menuEditIcon}>✎</Text>
//                             <Text style={styles.menuItemText}>
//                               Edit
//                             </Text>
//                           </TouchableOpacity>

//                           <TouchableOpacity
//                             style={styles.menuItem}
//                             onPress={() => deleteCategory(item)}>
//                             <Text style={styles.menuDeleteIcon}>
//                               🗑
//                             </Text>
//                             <Text style={styles.menuDeleteText}>
//                               Delete
//                             </Text>
//                           </TouchableOpacity>
//                         </View>
//                       )}
//                     </View>
//                   </View>
//                 ))
//               ) : (
//                 <View style={styles.emptyState}>
//                   <Text style={styles.emptyIcon}>▤</Text>

//                   <Text style={styles.emptyTitle}>
//                     No Categories Found
//                   </Text>

//                   <Text style={styles.emptyDescription}>
//                     {searchText
//                       ? 'Try changing your search.'
//                       : 'Add your first product category using the button above.'}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </ScrollView>
//         </View>
//       </View>

//       {/* Add / Edit Modal */}
//       <Modal
//         visible={modalVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>
//                   {editingCategory
//                     ? 'Edit Category'
//                     : 'Add Category'}
//                 </Text>

//                 <Text style={styles.modalSubtitle}>
//                   {editingCategory
//                     ? 'Update category information'
//                     : 'Create a new product category'}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 style={styles.modalCloseButton}
//                 onPress={closeModal}>
//                 <Text style={styles.modalCloseText}>×</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Category Name */}
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>
//                 Category Name <Text style={styles.required}>*</Text>
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter category name"
//                 placeholderTextColor="#94a3b8"
//                 value={categoryName}
//                 onChangeText={setCategoryName}
//               />
//             </View>

//             {/* Description */}
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Description</Text>

//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Enter description"
//                 placeholderTextColor="#94a3b8"
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline
//                 textAlignVertical="top"
//               />
//             </View>

//             {/* Status */}
//             <View style={styles.formGroup}>
//               <Text style={styles.label}>Status</Text>

//               <TouchableOpacity
//                 style={styles.dropdown}
//                 activeOpacity={0.8}
//                 onPress={() =>
//                   setShowStatusDropdown(!showStatusDropdown)
//                 }>
//                 <Text style={styles.dropdownText}>{status}</Text>
//                 <Text style={styles.dropdownArrow}>⌄</Text>
//               </TouchableOpacity>

//               {showStatusDropdown && (
//                 <View style={styles.dropdownOptions}>
//                   <TouchableOpacity
//                     style={styles.dropdownOption}
//                     onPress={() => {
//                       setStatus('Active');
//                       setShowStatusDropdown(false);
//                     }}>
//                     <Text style={styles.dropdownOptionText}>
//                       Active
//                     </Text>
//                   </TouchableOpacity>

//                   <TouchableOpacity
//                     style={styles.dropdownOption}
//                     onPress={() => {
//                       setStatus('Inactive');
//                       setShowStatusDropdown(false);
//                     }}>
//                     <Text style={styles.dropdownOptionText}>
//                       Inactive
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//             </View>

//             {/* Modal Buttons */}
//             <View style={styles.modalActions}>
//               <TouchableOpacity
//                 style={styles.cancelButton}
//                 activeOpacity={0.8}
//                 onPress={closeModal}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.saveButton}
//                 activeOpacity={0.8}
//                 onPress={saveCategory}>
//                 <Text style={styles.saveButtonText}>
//                   {editingCategory
//                     ? 'Update Category'
//                     : 'Add Category'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },

//   header: {
//     height: 72,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },

//   backButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#f1f5f9',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },

//   backIcon: {
//     color: '#334155',
//     fontSize: 30,
//     lineHeight: 32,
//     marginTop: -3,
//   },

//   headerTextContainer: {
//     flex: 1,
//   },

//   headerTitle: {
//     color: '#0f172a',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   headerSubtitle: {
//     color: '#64748b',
//     fontSize: 12,
//     marginTop: 3,
//   },

//   searchSection: {
//     paddingHorizontal: 14,
//     paddingVertical: 12,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },

//   searchContainer: {
//     height: 42,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//   },

//   searchIcon: {
//     fontSize: 23,
//     color: '#64748b',
//     marginRight: 8,
//   },

//   searchInput: {
//     flex: 1,
//     height: 40,
//     color: '#1e293b',
//     fontSize: 13,
//   },

//   clearSearch: {
//     width: 28,
//     height: 28,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   clearSearchText: {
//     fontSize: 22,
//     color: '#64748b',
//   },

//   tableSection: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },

//   tableTopBar: {
//     minHeight: 64,
//     paddingHorizontal: 14,
//     paddingVertical: 10,
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   tableTitleContainer: {
//     flex: 1,
//   },

//   tableSectionTitle: {
//     color: '#1e293b',
//     fontSize: 14,
//     fontWeight: '700',
//   },

//   tableSectionCount: {
//     color: '#94a3b8',
//     fontSize: 11,
//     marginTop: 3,
//   },

//   addCategoryTopButton: {
//     height: 38,
//     paddingHorizontal: 14,
//     borderRadius: 8,
//     backgroundColor: '#4338ca',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     elevation: 2,
//   },

//   addCategoryTopPlus: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '400',
//     marginRight: 5,
//     lineHeight: 21,
//   },

//   addCategoryTopText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   tableWrapper: {
//     flex: 1,
//   },

//   horizontalTableContent: {
//     flexGrow: 1,
//     paddingBottom: 12,
//   },

//   tableContainer: {
//     minWidth: 850,
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },

//   tableHeader: {
//     height: 48,
//     backgroundColor: '#f1f5f9',
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     borderBottomColor: '#cbd5e1',
//   },

//   tableRow: {
//     minHeight: 58,
//     flexDirection: 'row',
//     backgroundColor: '#ffffff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },

//   cell: {
//     paddingHorizontal: 12,
//     justifyContent: 'center',
//     borderRightWidth: 1,
//     borderRightColor: '#e2e8f0',
//   },

//   colNumber: {
//     width: 55,
//     alignItems: 'center',
//   },

//   colCategory: {
//     width: 180,
//   },

//   colDescription: {
//     width: 300,
//   },

//   colProducts: {
//     width: 100,
//     alignItems: 'center',
//   },

//   colStatus: {
//     width: 110,
//     alignItems: 'center',
//   },

//   colAction: {
//     width: 105,
//     alignItems: 'center',
//     position: 'relative',
//   },

//   headerText: {
//     color: '#475569',
//     fontSize: 11,
//     fontWeight: '700',
//   },

//   cellText: {
//     color: '#475569',
//     fontSize: 12,
//   },

//   categoryNameText: {
//     color: '#1e293b',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 20,
//     minWidth: 68,
//     alignItems: 'center',
//   },

//   activeBadge: {
//     backgroundColor: '#dcfce7',
//   },

//   inactiveBadge: {
//     backgroundColor: '#fee2e2',
//   },

//   statusText: {
//     fontSize: 10,
//     fontWeight: '700',
//   },

//   activeText: {
//     color: '#15803d',
//   },

//   inactiveText: {
//     color: '#dc2626',
//   },

//   actionButton: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f8fafc',
//   },

//   actionDots: {
//     color: '#475569',
//     fontSize: 22,
//     fontWeight: '700',
//     lineHeight: 24,
//   },

//   actionMenu: {
//     position: 'absolute',
//     right: 8,
//     top: 42,
//     width: 125,
//     backgroundColor: '#ffffff',
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     elevation: 8,
//     zIndex: 100,
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 3,
//     },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//   },

//   menuItem: {
//     height: 42,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   menuEditIcon: {
//     color: '#475569',
//     fontSize: 15,
//     width: 25,
//   },

//   menuDeleteIcon: {
//     fontSize: 14,
//     width: 25,
//   },

//   menuItemText: {
//     color: '#334155',
//     fontSize: 12,
//     fontWeight: '500',
//   },

//   menuDeleteText: {
//     color: '#dc2626',
//     fontSize: 12,
//     fontWeight: '500',
//   },

//   emptyState: {
//     minHeight: 300,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingHorizontal: 20,
//   },

//   emptyIcon: {
//     fontSize: 42,
//     color: '#cbd5e1',
//     marginBottom: 12,
//   },

//   emptyTitle: {
//     color: '#334155',
//     fontSize: 15,
//     fontWeight: '700',
//   },

//   emptyDescription: {
//     color: '#94a3b8',
//     fontSize: 12,
//     textAlign: 'center',
//     marginTop: 6,
//     maxWidth: 320,
//   },

//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(15, 23, 42, 0.45)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     padding: 20,
//   },

//   modalContainer: {
//     width: '100%',
//     maxWidth: 500,
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 20,
//     elevation: 10,
//   },

//   modalHeader: {
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     justifyContent: 'space-between',
//     marginBottom: 20,
//   },

//   modalTitle: {
//     color: '#0f172a',
//     fontSize: 18,
//     fontWeight: '700',
//   },

//   modalSubtitle: {
//     color: '#64748b',
//     fontSize: 11,
//     marginTop: 4,
//   },

//   modalCloseButton: {
//     width: 32,
//     height: 32,
//     borderRadius: 16,
//     backgroundColor: '#f1f5f9',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   modalCloseText: {
//     color: '#475569',
//     fontSize: 22,
//     lineHeight: 24,
//   },

//   formGroup: {
//     marginBottom: 16,
//   },

//   label: {
//     color: '#334155',
//     fontSize: 12,
//     fontWeight: '600',
//     marginBottom: 7,
//   },

//   required: {
//     color: '#dc2626',
//   },

//   input: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     color: '#1e293b',
//     fontSize: 13,
//     backgroundColor: '#ffffff',
//   },

//   textArea: {
//     height: 90,
//     paddingTop: 12,
//   },

//   dropdown: {
//     height: 44,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     backgroundColor: '#ffffff',
//   },

//   dropdownText: {
//     color: '#334155',
//     fontSize: 13,
//   },

//   dropdownArrow: {
//     color: '#64748b',
//     fontSize: 20,
//   },

//   dropdownOptions: {
//     marginTop: 4,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     backgroundColor: '#ffffff',
//     overflow: 'hidden',
//   },

//   dropdownOption: {
//     height: 42,
//     justifyContent: 'center',
//     paddingHorizontal: 12,
//   },

//   dropdownOptionText: {
//     color: '#334155',
//     fontSize: 13,
//   },

//   modalActions: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     marginTop: 8,
//   },

//   cancelButton: {
//     height: 42,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10,
//   },

//   cancelButtonText: {
//     color: '#475569',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   saveButton: {
//     height: 42,
//     paddingHorizontal: 18,
//     borderRadius: 8,
//     backgroundColor: '#4338ca',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   saveButtonText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '700',
//   },
// });

// export default ProductCategoryMasterScreen;

import React, {useEffect, useMemo, useState} from 'react';
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
  route?: any;
};

type ProductCategory = {
  id: string;
  categoryName: string;
  description: string;
};

const ProductCategoryMasterScreen = ({
  navigation,
}: Props) => {
  const [categories, setCategories] = useState<ProductCategory[]>(
    [],
  );

  const [searchQuery, setSearchQuery] = useState('');

  const [modalVisible, setModalVisible] = useState(false);

  const [editingCategoryId, setEditingCategoryId] =
    useState<string | null>(null);

  const [categoryName, setCategoryName] = useState('');

  const [description, setDescription] = useState('');

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
        setCategories(
          data.map((item: any) => ({
            id: String(item.id),
            categoryName: item.category_name || item.name || '',
            description: item.description || '',
          })),
        );
      }
    } catch (err) {
      console.log('Error loading categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (query.length === 0) {
      return categories;
    }

    return categories.filter(category => {
      return (
        category.categoryName
          .toLowerCase()
          .includes(query) ||
        category.description
          .toLowerCase()
          .includes(query)
      );
    });
  }, [categories, searchQuery]);

  const resetForm = () => {
    setCategoryName('');
    setDescription('');
    setEditingCategoryId(null);
  };

  const openAddCategoryModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditCategoryModal = (
    category: ProductCategory,
  ) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.categoryName);
    setDescription(category.description);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSaveCategory = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName) {
      Alert.alert(
        'Validation Error',
        'Category Name is required.',
      );
      return;
    }

    const duplicateCategory = categories.find(
      category =>
        category.categoryName.toLowerCase() ===
          trimmedName.toLowerCase() &&
        category.id !== editingCategoryId,
    );

    if (duplicateCategory) {
      Alert.alert(
        'Duplicate Category',
        'This category already exists.',
      );
      return;
    }

    try {
      if (editingCategoryId !== null) {
        const response = await fetch(
          `${API_BASE_URL}/api/categories/${editingCategoryId}`,
          {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              category_name: trimmedName,
              description: description.trim(),
            }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to update category');
        }

        Alert.alert(
          'Success',
          'Category updated successfully.',
        );
      } else {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            category_name: trimmedName,
            description: description.trim(),
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add category');
        }

        Alert.alert(
          'Success',
          'Category added successfully.',
        );
      }

      closeModal();
      await loadCategories();
    } catch (err: any) {
      console.error('Save category error:', err);
      Alert.alert('Error', err?.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = (
    category: ProductCategory,
  ) => {
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
              const res = await fetch(
                `${API_BASE_URL}/api/categories/${category.id}`,
                {
                  method: 'DELETE',
                },
              );
              if (!res.ok) {
                throw new Error('Failed to delete category');
              }
              await loadCategories();
            } catch (err: any) {
              console.error('Delete category error:', err);
              Alert.alert('Error', err?.message || 'Failed to delete category');
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text
            style={styles.headerTitle}
            numberOfLines={1}>
            Product Category Directory
          </Text>

          <Text
            style={styles.headerSubtitle}
            numberOfLines={1}>
            Manage all product categories
          </Text>
        </View>
      </View>

      {/* MAIN CONTENT */}
      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search category name or description"
            placeholderTextColor="#94a3b8"
          />

          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
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

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={openAddCategoryModal}>
            <Text style={styles.addButtonPlus}>+</Text>

            <Text style={styles.addButtonText}>
              Add Category
            </Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableContainer}>
            {/* TABLE HEADER */}
            <View style={styles.tableHeader}>
              <Text
                style={[
                  styles.headerCell,
                  styles.columnNumber,
                ]}>
                #
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.columnCategory,
                  styles.headerCategory,
                ]}>
                Category Name
              </Text>

              <Text
                style={[
                  styles.headerCell,
                  styles.columnAction,
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
                </View>
              ) : (
                filteredCategories.map(
                  (category, index) => (
                    <TouchableOpacity
                      key={category.id}
                      activeOpacity={0.7}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 &&
                          styles.alternateRow,
                      ]}
                      onPress={() =>
                        openEditCategoryModal(category)
                      }>
                      {/* NUMBER */}
                      <Text
                        style={[
                          styles.bodyCell,
                          styles.columnNumber,
                        ]}>
                        {index + 1}
                      </Text>

                      {/* CATEGORY NAME */}
                      <View
                        style={[
                          styles.categoryCell,
                          styles.columnCategory,
                        ]}>
                        <Text
                          style={styles.categoryText}
                          numberOfLines={1}>
                          {category.categoryName}
                        </Text>
                      </View>

                      {/* ACTION */}
                      <View
                        style={[
                          styles.actionCell,
                          styles.columnAction,
                        ]}>
                        {/* EDIT ICON BUTTON */}
                        <TouchableOpacity
                          style={styles.editButton}
                          activeOpacity={0.7}
                          onPress={event => {
                            event.stopPropagation();
                            openEditCategoryModal(category);
                          }}>
                          <Text style={styles.editIcon}>✎</Text>
                        </TouchableOpacity>

                        {/* DELETE ICON BUTTON */}
                        <TouchableOpacity
                          style={styles.deleteButton}
                          activeOpacity={0.7}
                          onPress={event => {
                            event.stopPropagation();
                            handleDeleteCategory(category);
                          }}>
                          <View style={styles.bin}>
                            <View style={styles.binTop}>
                              <View
                                style={styles.binHandle}
                              />
                            </View>

                            <View
                              style={styles.binBody}>
                              <View
                                style={styles.binLine}
                              />

                              <View
                                style={styles.binLine}
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
        </View>
      </View>

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingCategoryId !== null
                    ? 'Edit Category'
                    : 'Add Category'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {editingCategoryId !== null
                    ? 'Update category information'
                    : 'Enter category information'}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeModal}>
                <Text style={styles.modalCloseText}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            {/* MODAL BODY */}
            <ScrollView
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>
                Category Name *
              </Text>

              <TextInput
                style={styles.input}
                value={categoryName}
                onChangeText={setCategoryName}
                placeholder="Enter category name"
                placeholderTextColor="#94a3b8"
              />

              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.descriptionInput,
                ]}
                value={description}
                onChangeText={setDescription}
                placeholder="Enter category description"
                placeholderTextColor="#94a3b8"
                multiline
                textAlignVertical="top"
              />

              <View style={styles.modalBottomSpace} />
            </ScrollView>

            {/* MODAL FOOTER */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveCategory}>
                <Text style={styles.saveText}>
                  {editingCategoryId !== null
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

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  backArrow: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '300',
    lineHeight: 38,
    marginTop: -4,
  },

  headerTextContainer: {
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

  searchContainer: {
    height: 42,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13,
    paddingVertical: 0,
  },

  clearButton: {
    padding: 5,
  },

  clearText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },

  // SECTION HEADER

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  // ADD BUTTON

  addButton: {
    height: 38,
    paddingHorizontal: 14,
    backgroundColor: '#4338ca',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonPlus: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    marginRight: 6,
    lineHeight: 21,
  },

  addButtonText: {
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
    flex: 1,
    width: '100%',
  },

  tableHeader: {
    height: 54,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },

  headerCell: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 7,
  },

  headerCategory: {
    textAlign: 'left',
    paddingHorizontal: 8,
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

  alternateRow: {
    backgroundColor: '#f8fafc',
  },

  bodyCell: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 7,
  },

  // COLUMNS

  columnNumber: {
    width: 45,
  },

  columnCategory: {
    flex: 1,
  },

  columnAction: {
    width: 96,
  },

  // CATEGORY

  categoryCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  categoryText: {
    color: '#1e293b',
    fontSize: 11,
    fontWeight: '600',
  },

  descriptionText: {
    textAlign: 'left',
  },

  // ACTION

  actionCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  editButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editIcon: {
    fontSize: 16,
    color: '#4338ca',
    fontWeight: '700',
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bin: {
    width: 20,
    height: 22,
    alignItems: 'center',
  },

  binTop: {
    width: 18,
    height: 3,
    backgroundColor: '#dc2626',
    borderRadius: 1,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  binHandle: {
    position: 'absolute',
    top: -3,
    width: 7,
    height: 2,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderBottomWidth: 0,
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

  binLine: {
    width: 1,
    height: 9,
    backgroundColor: '#dc2626',
  },

  // EMPTY

  emptyContainer: {
    width: '100%',
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: '#64748b',
    fontSize: 13,
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
    maxHeight: '70%',
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    color: '#475569',
    fontSize: 12,
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
    color: '#0f172a',
    fontSize: 13,
  },

  descriptionInput: {
    height: 100,
    paddingTop: 11,
    textAlignVertical: 'top',
  },

  modalBottomSpace: {
    height: 20,
  },

  // MODAL FOOTER

  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
    borderRadius: 7,
  },

  cancelText: {
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

  saveText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});