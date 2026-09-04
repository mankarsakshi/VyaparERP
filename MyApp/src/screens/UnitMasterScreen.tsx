// import React, {useState, useEffect} from 'react';
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
// import {downloadUnits} from '../utils/exportHelper';

// type Props = {
//   navigation: any;
//   route?: any;
// };

// export interface UnitItem {
//   id: string;
//   name: string;
//   unit: string;
//   description: string;
// }

// const DEFAULT_UNITS: UnitItem[] = [
//   {
//     id: '1',
//     name: 'Piece',
//     unit: 'PCS',
//     description: 'Standard single piece or item count',
//   },
//   {
//     id: '2',
//     name: 'Kilogram',
//     unit: 'KG',
//     description: 'Base metric unit of mass (1000 grams)',
//   },
//   {
//     id: '3',
//     name: 'Gram',
//     unit: 'GM',
//     description: 'Metric weight unit for smaller quantities',
//   },
//   {
//     id: '4',
//     name: 'Litre',
//     unit: 'LTR',
//     description: 'Standard unit of volume for liquids',
//   },
//   {
//     id: '5',
//     name: 'Millilitre',
//     unit: 'ML',
//     description: 'Metric volume unit for smaller liquid measures',
//   },
//   {
//     id: '6',
//     name: 'Box',
//     unit: 'BOX',
//     description: 'Packaging container containing multiple items',
//   },
//   {
//     id: '7',
//     name: 'Packet',
//     unit: 'PKT',
//     description: 'Small pre-packaged commercial unit',
//   },
//   {
//     id: '8',
//     name: 'Meter',
//     unit: 'MTR',
//     description: 'Metric unit of length and fabric measurement',
//   },
//   {
//     id: '9',
//     name: 'Centimeter',
//     unit: 'CM',
//     description: 'Metric length unit for smaller dimensions',
//   },
//   {
//     id: '10',
//     name: 'Dozen',
//     unit: 'DOZ',
//     description: 'Collection of 12 individual items',
//   },
//   {
//     id: '11',
//     name: 'Square Meter',
//     unit: 'SQM',
//     description: 'Unit of area measurement for floor and surfaces',
//   },
//   {
//     id: '12',
//     name: 'Tonne',
//     unit: 'TON',
//     description: 'Metric ton unit of weight (1000 kilograms)',
//   },
//   {
//     id: '13',
//     name: 'Bundle',
//     unit: 'BDL',
//     description: 'Group of items bound or tied together',
//   },
//   {
//     id: '14',
//     name: 'Roll',
//     unit: 'ROL',
//     description: 'Continuous length of material wound on a spool',
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

// const UnitMasterScreen = ({navigation}: Props) => {
//   const [units, setUnits] = useState<UnitItem[]>(DEFAULT_UNITS);
//   const [loading, setLoading] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');

//   const UNITS_PER_PAGE = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

//   // Form States
//   const [name, setName] = useState('');
//   const [unit, setUnit] = useState('');
//   const [description, setDescription] = useState('');

//   // ============================================================
//   // LOAD DATA FROM DATABASE / PRODUCTS
//   // ============================================================

//   const loadUnitsFromDB = async () => {
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
//           const dbUnitCodes: string[] = Array.from(
//             new Set(
//               productData
//                 .map((p: any) => String(p.unit || '').trim())
//                 .filter(Boolean),
//             ),
//           );

//           setUnits(prev => {
//             const existingCodes = new Set(
//               prev.map(u => u.unit.toUpperCase()),
//             );
//             const extraUnits: UnitItem[] = [];

//             dbUnitCodes.forEach(code => {
//               if (!existingCodes.has(code.toUpperCase())) {
//                 existingCodes.add(code.toUpperCase());
//                 extraUnits.push({
//                   id: `db-${Date.now()}-${code}`,
//                   name: code,
//                   unit: code.toUpperCase(),
//                   description: `Imported from active product records`,
//                 });
//               }
//             });

//             return extraUnits.length > 0 ? [...prev, ...extraUnits] : prev;
//           });
//         }
//       }
//     } catch (err) {
//       console.log('Error loading units from DB:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadUnitsFromDB();

//     const unsubscribe = navigation?.addListener
//       ? navigation.addListener('focus', () => {
//           loadUnitsFromDB();
//         })
//       : undefined;

//     return unsubscribe;
//   }, [navigation]);

//   // ============================================================
//   // RESET FORM
//   // ============================================================

//   const resetForm = () => {
//     setName('');
//     setUnit('');
//     setDescription('');
//     setEditingUnitId(null);
//   };

//   // ============================================================
//   // ADD UNIT
//   // ============================================================

//   const openAddModal = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   // ============================================================
//   // EDIT UNIT
//   // ============================================================

//   const openEditModal = (item: UnitItem) => {
//     setEditingUnitId(item.id);
//     setName(item.name);
//     setUnit(item.unit);
//     setDescription(item.description);
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
//   // SAVE UNIT
//   // ============================================================

//   const handleSaveUnit = () => {
//     const trimmedName = name.trim();
//     const trimmedUnit = unit.trim();

//     if (!trimmedName) {
//       Alert.alert('Validation Error', 'Unit Name is required.');
//       return;
//     }

//     if (!trimmedUnit) {
//       Alert.alert('Validation Error', 'Unit Symbol / Code is required.');
//       return;
//     }

//     // Duplicate check
//     const duplicate = units.find(
//       u =>
//         (u.name.toLowerCase() === trimmedName.toLowerCase() ||
//           u.unit.toLowerCase() === trimmedUnit.toLowerCase()) &&
//         u.id !== editingUnitId,
//     );

//     if (duplicate) {
//       Alert.alert(
//         'Duplicate Unit',
//         'A unit with this name or symbol already exists.',
//       );
//       return;
//     }

//     if (editingUnitId !== null) {
//       setUnits(prev =>
//         prev.map(item =>
//           item.id === editingUnitId
//             ? {
//                 ...item,
//                 name: trimmedName,
//                 unit: trimmedUnit.toUpperCase(),
//                 description: description.trim(),
//               }
//             : item,
//         ),
//       );

//       closeModal();
//       Alert.alert('Success', `Unit "${trimmedName}" updated successfully.`);
//       return;
//     }

//     const newUnit: UnitItem = {
//       id: Date.now().toString(),
//       name: trimmedName,
//       unit: trimmedUnit.toUpperCase(),
//       description: description.trim(),
//     };

//     setUnits(prev => [newUnit, ...prev]);
//     setCurrentPage(1);
//     closeModal();
//     Alert.alert('Success', `Unit "${trimmedName}" added successfully.`);
//   };

//   // ============================================================
//   // DELETE UNIT
//   // ============================================================

//   const handleDeleteUnit = (item: UnitItem) => {
//     Alert.alert(
//       'Delete Unit',
//       `Are you sure you want to delete unit "${item.name} (${item.unit})"?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setUnits(prev => prev.filter(u => u.id !== item.id));
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

//     const targetList = filteredUnits.length > 0 ? filteredUnits : units;

//     downloadUnits(targetList, format);
//   };

//   // ============================================================
//   // SEARCH
//   // ============================================================

//   const filteredUnits = units.filter(item => {
//     const query = searchQuery.trim().toLowerCase();
//     if (!query) {
//       return true;
//     }

//     return (
//       item.name.toLowerCase().includes(query) ||
//       item.unit.toLowerCase().includes(query) ||
//       item.description.toLowerCase().includes(query)
//     );
//   });

//   // ============================================================
//   // PAGINATION
//   // ============================================================

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredUnits.length / UNITS_PER_PAGE),
//   );

//   const paginatedUnits = filteredUnits.slice(
//     (currentPage - 1) * UNITS_PER_PAGE,
//     currentPage * UNITS_PER_PAGE,
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
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}>
//           <Text style={styles.backText}>←</Text>
//         </TouchableOpacity>

//         <View style={styles.headerTitleBox}>
//           <Text style={styles.headerTitle} numberOfLines={1}>
//             Unit Master
//           </Text>
//           <Text style={styles.headerSubtitle} numberOfLines={1}>
//             Manage measurement units & symbols
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
//               placeholder="Search unit name, symbol or description"
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
//             onPress={() => setDownloadMenuVisible(prev => !prev)}>
//             <View style={styles.fileIcon}>
//               <View style={styles.fileIconFold} />
//               <View style={styles.fileIconLine} />
//               <View style={styles.fileIconLine} />
//               <View style={styles.fileIconLineShort} />
//             </View>
//           </TouchableOpacity>

//           {/* DOWNLOAD MENU */}
//           {downloadMenuVisible && (
//             <View style={styles.downloadMenu}>
//               <TouchableOpacity
//                 style={styles.downloadMenuItem}
//                 activeOpacity={0.7}
//                 onPress={() => handleDownload('pdf')}>
//                 <Text style={styles.downloadMenuIcon}>📄</Text>
//                 <Text style={styles.downloadMenuText}>PDF</Text>
//               </TouchableOpacity>

//               <View style={styles.downloadMenuDivider} />

//               <TouchableOpacity
//                 style={styles.downloadMenuItem}
//                 activeOpacity={0.7}
//                 onPress={() => handleDownload('excel')}>
//                 <Text style={styles.downloadMenuIcon}>📊</Text>
//                 <Text style={styles.downloadMenuText}>Excel</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </View>

//         {/* SECTION HEADER */}
//         <View style={styles.sectionHeader}>
//           <View>
//             <Text style={styles.sectionTitle}>Unit Directory</Text>
//             <Text style={styles.totalText}>
//               Total Units: {units.length}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.addUnitButton}
//             activeOpacity={0.8}
//             onPress={openAddModal}>
//             <Text style={styles.addUnitPlus}>+</Text>
//             <Text style={styles.addUnitButtonText}></Text>
//           </TouchableOpacity>
//         </View>

//         {/* TABLE */}
//         <View style={styles.tableWrapper}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//             <View style={styles.tableContainer}>
//               {/* TABLE HEADER */}
//               <View style={styles.tableHeaderRow}>
//                 <Text style={[styles.headerCell, styles.colNumber]}>#</Text>
//                 <Text style={[styles.headerCell, styles.colName]}>Unit Name</Text>
//                 <Text style={[styles.headerCell, styles.colUnit]}>Symbol / Code</Text>
//                 <Text style={[styles.headerCell, styles.colDescription]}>Description</Text>
//                 <Text style={[styles.headerCell, styles.colAction]}>Action</Text>
//               </View>

//               {/* TABLE BODY */}
//               <ScrollView
//                 style={styles.tableBody}
//                 showsVerticalScrollIndicator={true}
//                 refreshControl={
//                   <RefreshControl
//                     refreshing={loading}
//                     onRefresh={loadUnitsFromDB}
//                     colors={['#4338ca']}
//                   />
//                 }>
//                 {filteredUnits.length === 0 ? (
//                   <View style={styles.emptyContainer}>
//                     <Text style={styles.emptyText}>
//                       {units.length === 0
//                         ? 'No units added yet.'
//                         : 'No units found matching search.'}
//                     </Text>

//                     <TouchableOpacity
//                       style={styles.emptyAddBtn}
//                       onPress={openAddModal}>
//                       <Text style={styles.emptyAddBtnText}>+ Add Unit</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   paginatedUnits.map((item, index) => (
//                     <TouchableOpacity
//                       key={item.id}
//                       activeOpacity={0.7}
//                       style={[
//                         styles.tableRow,
//                         index % 2 === 1 && styles.tableRowAlternate,
//                       ]}
//                       onPress={() => openEditModal(item)}>
//                       {/* NUMBER */}
//                       <Text style={[styles.bodyCell, styles.colNumber]}>
//                         {(currentPage - 1) * UNITS_PER_PAGE + index + 1}
//                       </Text>

//                       {/* NAME */}
//                       <View style={[styles.nameCell, styles.colName]}>
//                         <Text style={styles.unitName} numberOfLines={1}>
//                           {item.name}
//                         </Text>
//                       </View>

//                       {/* UNIT CODE BADGE */}
//                       <View style={[styles.unitCell, styles.colUnit]}>
//                         <View style={styles.unitBadge}>
//                           <Text style={styles.unitBadgeText} numberOfLines={1}>
//                             {item.unit}
//                           </Text>
//                         </View>
//                       </View>

//                       {/* DESCRIPTION */}
//                       <Text
//                         style={[
//                           styles.bodyCell,
//                           styles.colDescription,
//                           styles.alignLeft,
//                         ]}
//                         numberOfLines={2}>
//                         {item.description || '-'}
//                       </Text>

//                       {/* ACTION */}
//                       <View style={[styles.actionCell, styles.colAction]}>
//                         {/* EDIT */}
//                         <TouchableOpacity
//                           style={styles.editButton}
//                           activeOpacity={0.7}
//                           onPress={event => {
//                             event.stopPropagation();
//                             openEditModal(item);
//                           }}>
//                           <Text style={styles.editIcon}>✎</Text>
//                         </TouchableOpacity>

//                         {/* DELETE */}
//                         <TouchableOpacity
//                           style={styles.deleteButton}
//                           activeOpacity={0.7}
//                           onPress={event => {
//                             event.stopPropagation();
//                             handleDeleteUnit(item);
//                           }}>
//                           <View style={styles.binIcon}>
//                             <View style={styles.binLid}>
//                               <View style={styles.binHandle} />
//                             </View>
//                             <View style={styles.binBody}>
//                               <View style={styles.binInnerLine} />
//                               <View style={styles.binInnerLine} />
//                             </View>
//                           </View>
//                         </TouchableOpacity>
//                       </View>
//                     </TouchableOpacity>
//                   ))
//                 )}
//               </ScrollView>
//             </View>
//           </ScrollView>

//           {/* PAGINATION */}
//           {filteredUnits.length > 0 && (
//             <View style={styles.paginationContainer}>
//               <Text style={styles.paginationInfo}>
//                 Showing{' '}
//                 {(currentPage - 1) * UNITS_PER_PAGE + 1} -{' '}
//                 {Math.min(
//                   currentPage * UNITS_PER_PAGE,
//                   filteredUnits.length,
//                 )}{' '}
//                 of {filteredUnits.length}
//               </Text>

//               <View style={styles.paginationControls}>
//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === 1 && styles.paginationButtonDisabled,
//                   ]}
//                   disabled={currentPage === 1}
//                   onPress={goToPreviousPage}>
//                   <Text
//                     style={[
//                       styles.paginationButtonText,
//                       currentPage === 1 && styles.paginationButtonTextDisabled,
//                     ]}>
//                     ‹
//                   </Text>
//                 </TouchableOpacity>

//                 {Array.from({length: totalPages}, (_, index) => index + 1).map(
//                   page => (
//                     <TouchableOpacity
//                       key={page}
//                       style={[
//                         styles.pageNumberButton,
//                         currentPage === page && styles.pageNumberButtonActive,
//                       ]}
//                       onPress={() => setCurrentPage(page)}>
//                       <Text
//                         style={[
//                           styles.pageNumberText,
//                           currentPage === page && styles.pageNumberTextActive,
//                         ]}>
//                         {page}
//                       </Text>
//                     </TouchableOpacity>
//                   ),
//                 )}

//                 <TouchableOpacity
//                   style={[
//                     styles.paginationButton,
//                     currentPage === totalPages && styles.paginationButtonDisabled,
//                   ]}
//                   disabled={currentPage === totalPages}
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
//         transparent
//         animationType="slide"
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* MODAL HEADER */}
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>
//                   {editingUnitId ? 'Edit Unit' : 'Add Unit'}
//                 </Text>
//                 <Text style={styles.modalSubtitle}>
//                   {editingUnitId
//                     ? 'Update unit information'
//                     : 'Enter new measurement unit details'}
//                 </Text>
//               </View>

//               <TouchableOpacity
//                 onPress={closeModal}
//                 style={styles.modalCloseButton}>
//                 <Text style={styles.modalCloseText}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             {/* MODAL BODY */}
//             <ScrollView
//               style={styles.modalBody}
//               showsVerticalScrollIndicator={false}
//               keyboardShouldPersistTaps="handled">
//               <Text style={styles.inputLabel}>Unit Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. Kilogram"
//                 placeholderTextColor="#94a3b8"
//                 value={name}
//                 onChangeText={setName}
//               />

//               <Text style={styles.inputLabel}>Unit Symbol / Code *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="e.g. KG, PCS, LTR"
//                 placeholderTextColor="#94a3b8"
//                 value={unit}
//                 onChangeText={setUnit}
//                 autoCapitalize="characters"
//               />

//               <Text style={styles.inputLabel}>Description</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea]}
//                 placeholder="Brief description of this unit..."
//                 placeholderTextColor="#94a3b8"
//                 value={description}
//                 onChangeText={setDescription}
//                 multiline
//                 numberOfLines={3}
//               />

//               <View style={styles.bottomSpace} />
//             </ScrollView>

//             {/* FOOTER */}
//             <View style={styles.modalFooter}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.saveButton} onPress={handleSaveUnit}>
//                 <Text style={styles.saveButtonText}>
//                   {editingUnitId ? 'Update Unit' : 'Save Unit'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default UnitMasterScreen;

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

//   // ADD UNIT BUTTON
//   addUnitButton: {
//     height: 38,
//     paddingHorizontal: 14,
//     backgroundColor: '#4338ca',
//     borderRadius: 7,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   addUnitPlus: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '500',
//     lineHeight: 21,
//     marginRight: 6,
//   },

//   addUnitButtonText: {
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
//     minWidth: 780,
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

//   alignLeft: {
//     textAlign: 'left',
//     paddingHorizontal: 10,
//   },

//   nameCell: {
//     justifyContent: 'center',
//     paddingHorizontal: 10,
//   },

//   unitName: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#1e293b',
//   },

//   unitCell: {
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   unitBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 3,
//     backgroundColor: '#e0e7ff',
//     borderRadius: 12,
//   },

//   unitBadgeText: {
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
//     width: 50,
//   },

//   colName: {
//     width: 180,
//   },

//   colUnit: {
//     width: 120,
//   },

//   colDescription: {
//     width: 340,
//   },

//   colAction: {
//     width: 90,
//   },

//   // EMPTY
//   emptyContainer: {
//     width: 760,
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
//     paddingVertical: 10,
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

//   textArea: {
//     height: 80,
//     paddingTop: 8,
//     textAlignVertical: 'top',
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
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import {API_BASE_URL} from '../api/config';
import {downloadUnits} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface UnitItem {
  id: string;
  name: string;
  unit: string;
  description: string;
}

const DEFAULT_UNITS: UnitItem[] = [
  {
    id: '1',
    name: 'Piece',
    unit: 'PCS',
    description: 'Standard single piece or item count',
  },
  {
    id: '2',
    name: 'Kilogram',
    unit: 'KG',
    description: 'Base metric unit of mass (1000 grams)',
  },
  {
    id: '3',
    name: 'Gram',
    unit: 'GM',
    description: 'Metric weight unit for smaller quantities',
  },
  {
    id: '4',
    name: 'Litre',
    unit: 'LTR',
    description: 'Standard unit of volume for liquids',
  },
  {
    id: '5',
    name: 'Millilitre',
    unit: 'ML',
    description: 'Metric volume unit for smaller liquid measures',
  },
  {
    id: '6',
    name: 'Box',
    unit: 'BOX',
    description: 'Packaging container containing multiple items',
  },
  {
    id: '7',
    name: 'Packet',
    unit: 'PKT',
    description: 'Small pre-packaged commercial unit',
  },
  {
    id: '8',
    name: 'Meter',
    unit: 'MTR',
    description: 'Metric unit of length and fabric measurement',
  },
  {
    id: '9',
    name: 'Centimeter',
    unit: 'CM',
    description: 'Metric length unit for smaller dimensions',
  },
  {
    id: '10',
    name: 'Dozen',
    unit: 'DOZ',
    description: 'Collection of 12 individual items',
  },
  {
    id: '11',
    name: 'Square Meter',
    unit: 'SQM',
    description: 'Unit of area measurement for floor and surfaces',
  },
  {
    id: '12',
    name: 'Tonne',
    unit: 'TON',
    description: 'Metric ton unit of weight (1000 kilograms)',
  },
  {
    id: '13',
    name: 'Bundle',
    unit: 'BDL',
    description: 'Group of items bound or tied together',
  },
  {
    id: '14',
    name: 'Roll',
    unit: 'ROL',
    description: 'Continuous length of material wound on a spool',
  },
];

/**
 * Candidate URLs for backend API connection
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

      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 3500);

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

const UnitMasterScreen = ({navigation}: Props) => {
  const [units, setUnits] = useState<UnitItem[]>(DEFAULT_UNITS);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const UNITS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  // ============================================================
  // LOAD DATA FROM DATABASE / PRODUCTS
  // ============================================================

  const loadUnitsFromDB = async () => {
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
          const dbUnitCodes: string[] = Array.from(
            new Set(
              productData
                .map((p: any) => String(p.unit || '').trim())
                .filter(Boolean),
            ),
          );

          setUnits(prev => {
            const existingCodes = new Set(
              prev.map(u => u.unit.toUpperCase()),
            );

            const extraUnits: UnitItem[] = [];

            dbUnitCodes.forEach(code => {
              if (!existingCodes.has(code.toUpperCase())) {
                existingCodes.add(code.toUpperCase());

                extraUnits.push({
                  id: `db-${Date.now()}-${code}`,
                  name: code,
                  unit: code.toUpperCase(),
                  description: 'Imported from active product records',
                });
              }
            });

            return extraUnits.length > 0
              ? [...prev, ...extraUnits]
              : prev;
          });
        }
      }
    } catch (err) {
      console.log('Error loading units from DB:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUnitsFromDB();

    const unsubscribe = navigation?.addListener
      ? navigation.addListener('focus', () => {
          loadUnitsFromDB();
        })
      : undefined;

    return unsubscribe;
  }, [navigation]);

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setName('');
    setUnit('');
    setDescription('');
    setEditingUnitId(null);
  };

  // ============================================================
  // ADD UNIT
  // ============================================================

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // ============================================================
  // EDIT UNIT
  // ============================================================

  const openEditModal = (item: UnitItem) => {
    setEditingUnitId(item.id);
    setName(item.name);
    setUnit(item.unit);
    setDescription(item.description);
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
  // SAVE UNIT
  // ============================================================

  const handleSaveUnit = () => {
    const trimmedName = name.trim();
    const trimmedUnit = unit.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Unit Name is required.');
      return;
    }

    if (!trimmedUnit) {
      Alert.alert(
        'Validation Error',
        'Unit Symbol / Code is required.',
      );
      return;
    }

    const duplicate = units.find(
      u =>
        (u.name.toLowerCase() === trimmedName.toLowerCase() ||
          u.unit.toLowerCase() === trimmedUnit.toLowerCase()) &&
        u.id !== editingUnitId,
    );

    if (duplicate) {
      Alert.alert(
        'Duplicate Unit',
        'A unit with this name or symbol already exists.',
      );
      return;
    }

    if (editingUnitId !== null) {
      setUnits(prev =>
        prev.map(item =>
          item.id === editingUnitId
            ? {
                ...item,
                name: trimmedName,
                unit: trimmedUnit.toUpperCase(),
                description: description.trim(),
              }
            : item,
        ),
      );

      closeModal();

      Alert.alert(
        'Success',
        `Unit "${trimmedName}" updated successfully.`,
      );

      return;
    }

    const newUnit: UnitItem = {
      id: Date.now().toString(),
      name: trimmedName,
      unit: trimmedUnit.toUpperCase(),
      description: description.trim(),
    };

    setUnits(prev => [newUnit, ...prev]);
    setCurrentPage(1);

    closeModal();

    Alert.alert(
      'Success',
      `Unit "${trimmedName}" added successfully.`,
    );
  };

  // ============================================================
  // DELETE UNIT
  // ============================================================

  const handleDeleteUnit = (item: UnitItem) => {
    Alert.alert(
      'Delete Unit',
      `Are you sure you want to delete unit "${item.name} (${item.unit})"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUnits(prev =>
              prev.filter(u => u.id !== item.id),
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
      filteredUnits.length > 0 ? filteredUnits : units;

    downloadUnits(targetList, format);
  };

  // ============================================================
  // SEARCH
  // ============================================================

  const filteredUnits = units.filter(item => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      item.name.toLowerCase().includes(query) ||
      item.unit.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    );
  });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUnits.length / UNITS_PER_PAGE),
  );

  const paginatedUnits = filteredUnits.slice(
    (currentPage - 1) * UNITS_PER_PAGE,
    currentPage * UNITS_PER_PAGE,
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
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Unit Master
          </Text>

          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Manage measurement units & symbols
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
              placeholder="Search unit name, symbol or description"
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
                <Text style={styles.downloadMenuIcon}>📄</Text>
                <Text style={styles.downloadMenuText}>
                  PDF
                </Text>
              </TouchableOpacity>

              <View style={styles.downloadMenuDivider} />

              <TouchableOpacity
                style={styles.downloadMenuItem}
                activeOpacity={0.7}
                onPress={() => handleDownload('excel')}>
                <Text style={styles.downloadMenuIcon}>📊</Text>
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
              Unit Directory
            </Text>

            <Text style={styles.totalText}>
              Total Units: {units.length}
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
                  Unit Name
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colUnit,
                  ]}>
                  Symbol / Code
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colDescription,
                  ]}>
                  Description
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
                    onRefresh={loadUnitsFromDB}
                    colors={['#4338ca']}
                  />
                }>
                {filteredUnits.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {units.length === 0
                        ? 'No units added yet.'
                        : 'No units found matching search.'}
                    </Text>

                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={openAddModal}>
                      <Text style={styles.emptyAddBtnText}>
                        + Add Unit
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  paginatedUnits.map((item, index) => (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      style={[
                        styles.tableRow,
                        index % 2 === 1 &&
                          styles.tableRowAlternate,
                      ]}
                      onPress={() => openEditModal(item)}>
                      {/* NUMBER */}
                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colNumber,
                        ]}>
                        {(currentPage - 1) *
                          UNITS_PER_PAGE +
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
                          style={styles.unitName}
                          numberOfLines={1}>
                          {item.name}
                        </Text>
                      </View>

                      {/* UNIT CODE */}
                      <View
                        style={[
                          styles.unitCell,
                          styles.colUnit,
                        ]}>
                        <View style={styles.unitBadge}>
                          <Text
                            style={styles.unitBadgeText}
                            numberOfLines={1}>
                            {item.unit}
                          </Text>
                        </View>
                      </View>

                      {/* DESCRIPTION */}
                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colDescription,
                          styles.alignLeft,
                        ]}
                        numberOfLines={2}>
                        {item.description || '-'}
                      </Text>

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
                            openEditModal(item);
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
                            handleDeleteUnit(item);
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
                  ))
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {/* ==================================================
              + BUTTON
              BELOW TABLE
              ABOVE PAGINATION
              ================================================== */}
          {filteredUnits.length > 0 && (
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity
                style={styles.bottomAddButton}
                activeOpacity={0.8}
                onPress={openAddModal}>
                <Text style={styles.bottomAddPlus}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PAGINATION */}
          {filteredUnits.length > 0 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationInfo}>
                Showing{' '}
                {(currentPage - 1) * UNITS_PER_PAGE + 1} -{' '}
                {Math.min(
                  currentPage * UNITS_PER_PAGE,
                  filteredUnits.length,
                )}{' '}
                of {filteredUnits.length}
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
                  {editingUnitId ? 'Edit Unit' : 'Add Unit'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {editingUnitId
                    ? 'Update unit information'
                    : 'Enter new measurement unit details'}
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
                Unit Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. Kilogram"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>
                Unit Symbol / Code *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="e.g. KG, PCS, LTR"
                placeholderTextColor="#94a3b8"
                value={unit}
                onChangeText={setUnit}
                autoCapitalize="characters"
              />

              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                ]}
                placeholder="Brief description of this unit..."
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
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
                onPress={handleSaveUnit}>
                <Text style={styles.saveButtonText}>
                  {editingUnitId
                    ? 'Update Unit'
                    : 'Save Unit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UnitMasterScreen;

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // ============================================================
  // HEADER
  // ============================================================

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

  // ============================================================
  // CONTENT
  // ============================================================

  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },

  // ============================================================
  // SEARCH
  // ============================================================

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

  // ============================================================
  // FILE BUTTON
  // ============================================================

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

  // ============================================================
  // DOWNLOAD MENU
  // ============================================================

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

  // ============================================================
  // SECTION HEADER
  // ============================================================

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
  // TABLE
  // ============================================================

  tableWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableContainer: {
    minWidth: 780,
    flex: 1,
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

  unitName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },

  unitCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  unitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
  },

  unitBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },

  // ============================================================
  // ACTION
  // ============================================================

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

  // ============================================================
  // COLUMNS
  // ============================================================

  colNumber: {
    width: 50,
  },

  colName: {
    width: 180,
  },

  colUnit: {
    width: 120,
  },

  colDescription: {
    width: 340,
  },

  colAction: {
    width: 90,
  },

  // ============================================================
  // EMPTY
  // ============================================================

  emptyContainer: {
    width: 760,
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

  // ============================================================
  // + BUTTON BELOW TABLE
  // ============================================================

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

  // ============================================================
  // PAGINATION
  // ============================================================

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

  // ============================================================
  // MODAL
  // ============================================================

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

  bottomSpace: {
    height: 20,
  },

  // ============================================================
  // FOOTER
  // ============================================================

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