// import React, {useState} from 'react';
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
//   Dimensions,
// } from 'react-native';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';

// type Props = {
//   navigation: any;
//   route?: any;
// };

// export interface FinancialYearItem {
//   id: string;
//   financialYear: string;
//   startDate: string;
//   endDate: string;
//   status: 'Active' | 'Inactive';
// }

// const {width: SCREEN_WIDTH} = Dimensions.get('window');

// // Professional vector back arrow icon
// const BackArrowIcon = () => (
//   <View style={{width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
//     <View style={{position: 'absolute', width: 14, height: 2.6, backgroundColor: '#1e293b', borderRadius: 1.3}} />
//     <View
//       style={{
//         position: 'absolute',
//         left: 4,
//         width: 9,
//         height: 9,
//         borderLeftWidth: 2.6,
//         borderTopWidth: 2.6,
//         borderColor: '#1e293b',
//         borderRadius: 1.2,
//         transform: [{rotate: '-45deg'}],
//       }}
//     />
//   </View>
// );

// const PencilIcon = ({size = 14, color = '#ea7e30'}: {size?: number; color?: string}) => (
//   <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
//     <View
//       style={{
//         width: size * 0.85,
//         height: size * 0.85,
//         alignItems: 'center',
//         justifyContent: 'center',
//         transform: [{rotate: '45deg'}],
//       }}>
//       <View
//         style={{
//           width: size * 0.36,
//           height: size * 0.14,
//           borderWidth: 1.2,
//           borderColor: color,
//           borderBottomWidth: 0,
//           borderTopLeftRadius: 1.5,
//           borderTopRightRadius: 1.5,
//           marginBottom: 0.5,
//         }}
//       />
//       <View
//         style={{
//           width: size * 0.36,
//           height: size * 0.44,
//           borderWidth: 1.2,
//           borderColor: color,
//           borderBottomWidth: 0,
//         }}
//       />
//       <View
//         style={{
//           width: 0,
//           height: 0,
//           borderLeftWidth: size * 0.18,
//           borderRightWidth: size * 0.18,
//           borderTopWidth: size * 0.22,
//           borderLeftColor: 'transparent',
//           borderRightColor: 'transparent',
//           borderTopColor: color,
//         }}
//       />
//     </View>
//   </View>
// );

// const DustbinIcon = ({size = 14, color = '#ef4444'}: {size?: number; color?: string}) => (
//   <View style={{width: size, height: size + 2, alignItems: 'center', justifyContent: 'center'}}>
//     <View
//       style={{
//         width: size * 0.36,
//         height: 1.5,
//         backgroundColor: color,
//         borderTopLeftRadius: 1,
//         borderTopRightRadius: 1,
//       }}
//     />
//     <View
//       style={{
//         width: size * 0.88,
//         height: 1.5,
//         backgroundColor: color,
//         borderRadius: 0.75,
//         marginVertical: 1,
//       }}
//     />
//     <View
//       style={{
//         width: size * 0.68,
//         height: size * 0.66,
//         borderWidth: 1.3,
//         borderColor: color,
//         borderTopWidth: 0,
//         borderBottomLeftRadius: 2.5,
//         borderBottomRightRadius: 2.5,
//         flexDirection: 'row',
//         justifyContent: 'space-evenly',
//         alignItems: 'center',
//         paddingVertical: 1,
//       }}>
//       <View style={{width: 1.1, height: '65%', backgroundColor: color, borderRadius: 0.5}} />
//       <View style={{width: 1.1, height: '65%', backgroundColor: color, borderRadius: 0.5}} />
//     </View>
//   </View>
// );

// const INITIAL_DEMO_FINANCIAL_YEARS: FinancialYearItem[] = [
//   {id: '1', financialYear: '2026-2027', startDate: '01-Apr-2026', endDate: '31-Mar-2027', status: 'Active'},
//   {id: '2', financialYear: '2025-2026', startDate: '01-Apr-2025', endDate: '31-Mar-2026', status: 'Inactive'},
//   {id: '3', financialYear: '2024-2025', startDate: '01-Apr-2024', endDate: '31-Mar-2025', status: 'Inactive'},
//   {id: '4', financialYear: '2023-2024', startDate: '01-Apr-2023', endDate: '31-Mar-2024', status: 'Inactive'},
//   {id: '5', financialYear: '2022-2023', startDate: '01-Apr-2022', endDate: '31-Mar-2023', status: 'Inactive'},
// ];

// const formatDateToDisplay = (date: Date): string => {
//   const day = String(date.getDate()).padStart(2, '0');
//   const months = [
//     'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
//   ];
//   const month = months[date.getMonth()];
//   const year = date.getFullYear();
//   return `${day}-${month}-${year}`;
// };

// const parseDisplayDate = (str: string): Date => {
//   if (!str) return new Date();
//   const parts = str.split('-');
//   if (parts.length === 3) {
//     const day = parseInt(parts[0], 10);
//     const months = [
//       'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
//       'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
//     ];
//     const monthIdx = months.findIndex(
//       m => m.toLowerCase() === parts[1].toLowerCase(),
//     );
//     const year = parseInt(parts[2], 10);
//     if (!isNaN(day) && monthIdx !== -1 && !isNaN(year)) {
//       return new Date(year, monthIdx, day);
//     }
//   }
//   return new Date();
// };

// const FinancialYearMaster = ({navigation}: Props) => {
//   const [data, setData] = useState<FinancialYearItem[]>(INITIAL_DEMO_FINANCIAL_YEARS);
//   const [searchQuery, setSearchQuery] = useState('');

//   const ITEMS_PER_PAGE = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

//   // Financial Year Filter Dropdown
//   const [selectedYear, setSelectedYear] = useState<string>('');
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // Modal State
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);

//   // Form Fields
//   const [financialYear, setFinancialYear] = useState('');
//   const [startDate, setStartDate] = useState('01-Apr-2026');
//   const [endDate, setEndDate] = useState('31-Mar-2027');
//   const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

//   // Date Pickers
//   const [startDateObj, setStartDateObj] = useState<Date>(new Date(2026, 3, 1));
//   const [endDateObj, setEndDateObj] = useState<Date>(new Date(2027, 2, 31));
//   const [showStartDatePicker, setShowStartDatePicker] = useState(false);
//   const [showEndDatePicker, setShowEndDatePicker] = useState(false);

//   const resetForm = () => {
//     setFinancialYear('');
//     const defaultStart = new Date(2026, 3, 1);
//     const defaultEnd = new Date(2027, 2, 31);
//     setStartDateObj(defaultStart);
//     setEndDateObj(defaultEnd);
//     setStartDate(formatDateToDisplay(defaultStart));
//     setEndDate(formatDateToDisplay(defaultEnd));
//     setStatus('Active');
//     setEditingId(null);
//     setShowStartDatePicker(false);
//     setShowEndDatePicker(false);
//   };

//   const openAddModal = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   const openEditModal = (item: FinancialYearItem) => {
//     setEditingId(item.id);
//     setFinancialYear(item.financialYear);
//     setStartDate(item.startDate);
//     setEndDate(item.endDate);
//     setStatus(item.status);
//     setStartDateObj(parseDisplayDate(item.startDate));
//     setEndDateObj(parseDisplayDate(item.endDate));
//     setShowStartDatePicker(false);
//     setShowEndDatePicker(false);
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//     resetForm();
//   };

//   const onStartDateChange = (_event: any, selectedDate?: Date) => {
//     setShowStartDatePicker(false);
//     if (selectedDate) {
//       setStartDateObj(selectedDate);
//       setStartDate(formatDateToDisplay(selectedDate));
//       const autoEnd = new Date(
//         selectedDate.getFullYear() + 1,
//         selectedDate.getMonth(),
//         0,
//       );
//       setEndDateObj(autoEnd);
//       setEndDate(formatDateToDisplay(autoEnd));
//     }
//   };

//   const onEndDateChange = (_event: any, selectedDate?: Date) => {
//     setShowEndDatePicker(false);
//     if (selectedDate) {
//       setEndDateObj(selectedDate);
//       setEndDate(formatDateToDisplay(selectedDate));
//     }
//   };

//   const handleSave = () => {
//     const trimmedYear = financialYear.trim();

//     if (!trimmedYear) {
//       Alert.alert('Validation Error', 'Financial Year Name is required.');
//       return;
//     }

//     if (!startDate || !endDate) {
//       Alert.alert('Validation Error', 'Start Date and End Date are required.');
//       return;
//     }

//     if (startDateObj > endDateObj) {
//       Alert.alert('Validation Error', 'Start Date cannot be after End Date.');
//       return;
//     }

//     const duplicate = data.find(
//       item =>
//         item.financialYear.toLowerCase() === trimmedYear.toLowerCase() &&
//         item.id !== editingId,
//     );

//     if (duplicate) {
//       Alert.alert(
//         'Duplicate Entry',
//         'A Financial Year with this name already exists.',
//       );
//       return;
//     }

//     if (editingId !== null) {
//       setData(prev =>
//         prev.map(item =>
//           item.id === editingId
//             ? {
//                 ...item,
//                 financialYear: trimmedYear,
//                 startDate,
//                 endDate,
//                 status,
//               }
//             : item,
//         ),
//       );

//       closeModal();
//       Alert.alert('Success', `Financial Year "${trimmedYear}" updated successfully.`);
//       return;
//     }

//     const newItem: FinancialYearItem = {
//       id: Date.now().toString(),
//       financialYear: trimmedYear,
//       startDate,
//       endDate,
//       status,
//     };

//     setData(prev => [newItem, ...prev]);
//     setCurrentPage(1);
//     closeModal();
//     Alert.alert('Success', `Financial Year "${trimmedYear}" added successfully.`);
//   };

//   const handleDelete = (item: FinancialYearItem) => {
//     Alert.alert(
//       'Delete Financial Year',
//       `Are you sure you want to delete "${item.financialYear}"?`,
//       [
//         {text: 'Cancel', style: 'cancel'},
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setData(prev => prev.filter(i => i.id !== item.id));
//           },
//         },
//       ],
//     );
//   };

//   const handleExportPDF = async () => {
//     setDownloadMenuVisible(false);
//     const targetList = filteredData.length > 0 ? filteredData : data;

//     const columns = [
//       {title: '#', width: 25, align: 'center' as const},
//       {title: 'Financial Year', width: 100},
//       {title: 'Start Date', width: 75},
//       {title: 'End Date', width: 75},
//       {title: 'Status', width: 60, align: 'center' as const},
//     ];

//     const rows = targetList.map((item, idx) => [
//       String(idx + 1),
//       item.financialYear,
//       item.startDate,
//       item.endDate,
//       item.status,
//     ]);

//     try {
//       const pdfBase64 = generatePurePDF(
//         'Financial Year Report',
//         columns,
//         rows,
//       );
//       const filename = `FinancialYears_${Date.now()}.pdf`;
//       await saveFileToDevice(filename, pdfBase64, 'base64');
//       Alert.alert('Success', `PDF saved successfully as ${filename}`);
//     } catch (e: any) {
//       Alert.alert('Export Error', e.message || 'Failed to export PDF');
//     }
//   };

//   const filteredData = data.filter(item => {
//     // Filter by selected financial year dropdown
//     if (selectedYear && item.financialYear !== selectedYear) {
//       return false;
//     }
//     const q = searchQuery.toLowerCase().trim();
//     if (!q) return true;
//     return (
//       item.financialYear.toLowerCase().includes(q) ||
//       item.startDate.toLowerCase().includes(q) ||
//       item.endDate.toLowerCase().includes(q) ||
//       item.status.toLowerCase().includes(q)
//     );
//   });

//   const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
//   const safeCurrentPage = Math.min(currentPage, totalPages);
//   const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
//   const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredData.length);
//   const currentItems = filteredData.slice(startIndex, endIndex);

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* ================================================= */}
//       {/* 1. HEADER                                         */}
//       {/* ================================================= */}
//       <View style={styles.header}>
//         {/* Back Button */}
//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() => navigation.goBack()}
//           activeOpacity={0.7}
//           hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
//           <BackArrowIcon />
//         </TouchableOpacity>

//         {/* Title */}
//         <View style={styles.headerTitleArea}>
//           <Text style={styles.headerTitle}>Financial Year Master</Text>
//         </View>
//       </View>

//       {/* ================================================= */}
//       {/* 2. SEARCH BAR & EXPORT BUTTON                     */}
//       {/* ================================================= */}
//       <View style={styles.searchRow}>
//         <View style={styles.searchContainer}>
//           <Text style={styles.searchIcon}>🔍</Text>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search financial year..."
//             placeholderTextColor="#94a3b8"
//             value={searchQuery}
//             onChangeText={t => {
//               setSearchQuery(t);
//               setCurrentPage(1);
//             }}
//           />
//           {searchQuery.length > 0 && (
//             <TouchableOpacity
//               onPress={() => {
//                 setSearchQuery('');
//                 setCurrentPage(1);
//               }}
//               style={styles.clearBtn}>
//               <Text style={styles.clearBtnText}>✕</Text>
//             </TouchableOpacity>
//           )}
//         </View>

//         {/* Export / Document Button */}
//         <TouchableOpacity
//           style={styles.exportButton}
//           activeOpacity={0.8}
//           onPress={() => setDownloadMenuVisible(true)}>
//           <Text style={styles.exportIcon}>📄</Text>
//         </TouchableOpacity>
//       </View>

//       {/* ================================================= */}
//       {/* 3. SWIPE HINT                                     */}
//       {/* ================================================= */}
//       <View style={styles.swipeHintRow}>
//         <Text style={styles.swipeHintArrow}>➔</Text>
//         <Text style={styles.swipeHintText}>
//           Swipe the table to see all columns
//         </Text>
//       </View>

//       {/* ================================================= */}
//       {/* 4. MAIN DATA TABLE CARD                           */}
//       {/* ================================================= */}
//       <View style={styles.tableCard}>
//         <ScrollView
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           contentContainerStyle={styles.horizontalTableScroll}>
//           <View>
//             {/* TABLE HEADER */}
//             <View style={styles.tableHeaderRow}>
//               <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
//               <Text style={[styles.columnHeader, styles.colYear]}>
//                 FINANCIAL YEAR
//               </Text>
//               <Text style={[styles.columnHeader, styles.colDate]}>
//                 START DATE
//               </Text>
//               <Text style={[styles.columnHeader, styles.colDate]}>
//                 END DATE
//               </Text>
//               <Text style={[styles.columnHeader, styles.colStatus]}>
//                 STATUS
//               </Text>
//               <Text style={[styles.columnHeader, styles.colActions]}>
//                 ACTIONS
//               </Text>
//             </View>

//             {/* TABLE BODY ROWS */}
//             {currentItems.map((item, index) => {
//               const globalIndex = startIndex + index + 1;
//               const isActive = item.status === 'Active';

//               return (
//                 <View
//                   key={item.id || index}
//                   style={[
//                     styles.tableRow,
//                     index === currentItems.length - 1 && styles.tableRowLast,
//                   ]}>
//                   {/* # Column */}
//                   <View style={styles.colIndex}>
//                     <Text style={styles.cellIndexText}>{globalIndex}</Text>
//                   </View>

//                   {/* Financial Year Column */}
//                   <View style={styles.colYear}>
//                     <Text style={styles.cellNameText} numberOfLines={1}>
//                       {item.financialYear}
//                     </Text>
//                   </View>

//                   {/* Start Date Column */}
//                   <View style={styles.colDate}>
//                     <Text style={styles.cellDateText}>{item.startDate}</Text>
//                   </View>

//                   {/* End Date Column */}
//                   <View style={styles.colDate}>
//                     <Text style={styles.cellDateText}>{item.endDate}</Text>
//                   </View>

//                   {/* Status Column */}
//                   <View style={styles.colStatus}>
//                     <View
//                       style={[
//                         styles.statusBadge,
//                         isActive ? styles.statusBadgeActive : styles.statusBadgeInactive,
//                       ]}>
//                       <Text
//                         style={[
//                           styles.statusBadgeText,
//                           isActive ? styles.statusTextActive : styles.statusTextInactive,
//                         ]}>
//                         {item.status}
//                       </Text>
//                     </View>
//                   </View>

//                   {/* Actions Column */}
//                   <View style={styles.colActions}>
//                     <TouchableOpacity
//                       style={styles.actionBtn}
//                       onPress={() => openEditModal(item)}
//                       hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
//                       <PencilIcon size={14} color="#ea7e30" />
//                     </TouchableOpacity>

//                     <TouchableOpacity
//                       style={styles.actionBtn}
//                       onPress={() => handleDelete(item)}
//                       hitSlop={{top: 8, bottom: 8, left: 8, right: 8}}>
//                       <DustbinIcon size={14} color="#ef4444" />
//                     </TouchableOpacity>
//                   </View>
//                 </View>
//               );
//             })}

//             {/* Empty State */}
//             {currentItems.length === 0 && (
//               <View style={styles.emptyTable}>
//                 <Text style={styles.emptyText}>No financial years found.</Text>
//               </View>
//             )}
//           </View>
//         </ScrollView>

//         {/* Scroll Bar Track Indicator */}
//         <View style={styles.scrollTrack}>
//           <View style={styles.scrollThumb} />
//         </View>

//         {/* ============================================= */}
//         {/* 5. PAGINATION FOOTER (Only when count > 10)  */}
//         {/* ============================================= */}
//         {filteredData.length > 10 && (
//           <View style={styles.paginationFooter}>
//             <Text style={styles.paginationInfoText}>
//               {`${startIndex + 1}–${endIndex} of ${filteredData.length}`}
//             </Text>

//             <View style={styles.paginationControls}>
//               {/* Previous Page */}
//               <TouchableOpacity
//                 style={[
//                   styles.pageBtn,
//                   safeCurrentPage <= 1 && styles.pageBtnDisabled,
//                 ]}
//                 disabled={safeCurrentPage <= 1}
//                 onPress={() => setCurrentPage(p => Math.max(1, p - 1))}>
//                 <Text
//                   style={[
//                     styles.pageBtnText,
//                     safeCurrentPage <= 1 && styles.pageBtnTextDisabled,
//                   ]}>
//                   ‹
//                 </Text>
//               </TouchableOpacity>

//               {/* Page Count */}
//               <Text style={styles.pageCountText}>
//                 {safeCurrentPage}/{totalPages}
//               </Text>

//               {/* Next Page */}
//               <TouchableOpacity
//                 style={[
//                   styles.pageBtn,
//                   safeCurrentPage >= totalPages && styles.pageBtnDisabled,
//                 ]}
//                 disabled={safeCurrentPage >= totalPages}
//                 onPress={() => setCurrentPage(p => Math.min(totalPages, p + 1))}>
//                 <Text
//                   style={[
//                     styles.pageBtnText,
//                     safeCurrentPage >= totalPages && styles.pageBtnTextDisabled,
//                   ]}>
//                   ›
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       </View>

//       {/* ================================================= */}
//       {/* 6. FLOATING ADD BUTTON (+)                        */}
//       {/* ================================================= */}
//       <TouchableOpacity
//         style={styles.floatingAddButton}
//         activeOpacity={0.8}
//         onPress={openAddModal}>
//         <View style={styles.addIconH} />
//         <View style={styles.addIconV} />
//       </TouchableOpacity>

//       {/* ================================================= */}
//       {/* 7. EXPORT MENU MODAL                              */}
//       {/* ================================================= */}
//       <Modal
//         visible={downloadMenuVisible}
//         transparent
//         animationType="fade"
//         onRequestClose={() => setDownloadMenuVisible(false)}>
//         <TouchableOpacity
//           style={styles.modalOverlay}
//           activeOpacity={1}
//           onPress={() => setDownloadMenuVisible(false)}>
//           <View style={styles.exportMenuCard}>
//             <Text style={styles.exportMenuTitle}>Export Report</Text>
//             <TouchableOpacity
//               style={styles.exportOptionRow}
//               onPress={handleExportPDF}>
//               <Text style={styles.exportOptionIcon}>📄</Text>
//               <Text style={styles.exportOptionText}>Download as PDF</Text>
//             </TouchableOpacity>
//           </View>
//         </TouchableOpacity>
//       </Modal>

//       {/* ================================================= */}
//       {/* 8. ADD / EDIT FINANCIAL YEAR MODAL                */}
//       {/* ================================================= */}
//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.formModalCard}>
//             <View style={styles.formModalHeader}>
//               <Text style={styles.formModalTitle}>
//                 {editingId ? 'Edit Financial Year' : 'Add Financial Year'}
//               </Text>
//               <TouchableOpacity
//                 onPress={closeModal}
//                 hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//                 <Text style={styles.formModalClose}>✕</Text>
//               </TouchableOpacity>
//             </View>

//             <ScrollView
//               showsVerticalScrollIndicator={false}
//               contentContainerStyle={styles.formContent}>
//               <Text style={styles.inputLabel}>Financial Year *</Text>
//               <TextInput
//                 style={styles.formInput}
//                 placeholder="e.g. 2026-2027"
//                 value={financialYear}
//                 onChangeText={setFinancialYear}
//               />

//               <Text style={styles.inputLabel}>Start Date *</Text>
//               <TouchableOpacity
//                 style={styles.datePickerBtn}
//                 onPress={() => setShowStartDatePicker(true)}>
//                 <Text style={styles.datePickerText}>{startDate}</Text>
//                 <Text style={styles.calendarIcon}>📅</Text>
//               </TouchableOpacity>
//               {showStartDatePicker && (
//                 <DateTimePicker
//                   value={startDateObj}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={onStartDateChange}
//                 />
//               )}

//               <Text style={styles.inputLabel}>End Date *</Text>
//               <TouchableOpacity
//                 style={styles.datePickerBtn}
//                 onPress={() => setShowEndDatePicker(true)}>
//                 <Text style={styles.datePickerText}>{endDate}</Text>
//                 <Text style={styles.calendarIcon}>📅</Text>
//               </TouchableOpacity>
//               {showEndDatePicker && (
//                 <DateTimePicker
//                   value={endDateObj}
//                   mode="date"
//                   display={Platform.OS === 'ios' ? 'spinner' : 'default'}
//                   onChange={onEndDateChange}
//                 />
//               )}

//               <Text style={styles.inputLabel}>Status</Text>
//               <View style={styles.statusToggleRow}>
//                 <TouchableOpacity
//                   style={[
//                     styles.statusToggleBtn,
//                     status === 'Active' && styles.statusToggleBtnActive,
//                   ]}
//                   onPress={() => setStatus('Active')}>
//                   <Text
//                     style={[
//                       styles.statusToggleText,
//                       status === 'Active' && styles.statusToggleTextActive,
//                     ]}>
//                     Active
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   style={[
//                     styles.statusToggleBtn,
//                     status === 'Inactive' && styles.statusToggleBtnInactive,
//                   ]}
//                   onPress={() => setStatus('Inactive')}>
//                   <Text
//                     style={[
//                       styles.statusToggleText,
//                       status === 'Inactive' && styles.statusToggleTextInactive,
//                     ]}>
//                     Inactive
//                   </Text>
//                 </TouchableOpacity>
//               </View>
//             </ScrollView>

//             <View style={styles.formModalFooter}>
//               <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
//                 <Text style={styles.cancelBtnText}>Cancel</Text>
//               </TouchableOpacity>
//               <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
//                 <Text style={styles.saveBtnText}>
//                   {editingId ? 'Update Year' : 'Save Year'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default FinancialYearMaster;

// // =====================================================
// // STYLESHEET
// // =====================================================
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fb',
//   },

//   // ---- 1. HEADER ----
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingTop: Platform.OS === 'android' ? 28 : 22,
//     paddingBottom: 14,
//   },

//   backButton: {
//     width: 44,
//     height: 44,
//     borderRadius: 14,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 14,
//     borderWidth: 1.5,
//     borderColor: '#e2e8f0',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   headerTitleArea: {
//     flex: 1,
//     justifyContent: 'center',
//   },

//   headerTitle: {
//     fontSize: 22,
//     fontWeight: '800',
//     color: '#0f172a',
//     letterSpacing: -0.2,
//   },

//   // ---- 2. SEARCH & EXPORT ROW ----
//   searchRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     marginTop: 6,
//     marginBottom: 8,
//   },

//   searchContainer: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f1f5f9',
//     borderRadius: 14,
//     paddingHorizontal: 12,
//     height: 48,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },

//   searchIcon: {
//     fontSize: 15,
//     color: '#94a3b8',
//     marginRight: 8,
//   },

//   searchInput: {
//     flex: 1,
//     fontSize: 14,
//     color: '#1e293b',
//     paddingVertical: 0,
//   },

//   clearBtn: {
//     padding: 4,
//   },

//   clearBtnText: {
//     fontSize: 13,
//     color: '#94a3b8',
//     fontWeight: '700',
//   },

//   exportButton: {
//     width: 48,
//     height: 48,
//     borderRadius: 14,
//     backgroundColor: '#ea7e30',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10,
//     shadowColor: '#ea7e30',
//     shadowOffset: {width: 0, height: 3},
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 4,
//   },

//   exportIcon: {
//     fontSize: 20,
//   },

//   // ---- 3. SWIPE HINT ----
//   swipeHintRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 18,
//     marginBottom: 10,
//   },

//   swipeHintArrow: {
//     fontSize: 13,
//     color: '#94a3b8',
//     marginRight: 6,
//     fontWeight: '700',
//   },

//   swipeHintText: {
//     fontSize: 12,
//     color: '#64748b',
//     fontWeight: '500',
//   },

//   // ---- 4. TABLE CARD ----
//   tableCard: {
//     flex: 1,
//     marginHorizontal: 16,
//     marginBottom: 16,
//     backgroundColor: '#ffffff',
//     borderRadius: 18,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//     overflow: 'hidden',
//   },

//   horizontalTableScroll: {
//     minWidth: '100%',
//   },

//   // Column Widths
//   colIndex: {
//     width: 44,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   colYear: {
//     width: 160,
//     justifyContent: 'center',
//     paddingRight: 10,
//   },
//   colDate: {
//     width: 125,
//     justifyContent: 'center',
//   },
//   colStatus: {
//     width: 95,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   colActions: {
//     width: 85,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 8,
//   },

//   // Table Header
//   tableHeaderRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#fff7ed',
//     paddingVertical: 14,
//     paddingHorizontal: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#fed7aa',
//   },

//   columnHeader: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#c2410c',
//     letterSpacing: 0.5,
//   },

//   // Table Body Rows
//   tableRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 14,
//     paddingHorizontal: 6,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f5f9',
//     backgroundColor: '#ffffff',
//   },

//   tableRowLast: {
//     borderBottomWidth: 0,
//   },

//   cellIndexText: {
//     fontSize: 14,
//     color: '#475569',
//     fontWeight: '500',
//   },

//   cellNameText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#1e293b',
//   },

//   cellDateText: {
//     fontSize: 13,
//     color: '#475569',
//     fontWeight: '500',
//   },

//   statusBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: 8,
//   },

//   statusBadgeActive: {
//     backgroundColor: '#ecfdf5',
//   },

//   statusBadgeInactive: {
//     backgroundColor: '#f1f5f9',
//   },

//   statusBadgeText: {
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   statusTextActive: {
//     color: '#059669',
//   },

//   statusTextInactive: {
//     color: '#64748b',
//   },

//   actionBtn: {
//     padding: 4,
//   },

//   editActionIcon: {
//     fontSize: 14,
//   },

//   deleteActionIcon: {
//     fontSize: 14,
//   },

//   emptyTable: {
//     padding: 30,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   emptyText: {
//     fontSize: 14,
//     color: '#94a3b8',
//   },

//   // Scroll Bar Track
//   scrollTrack: {
//     height: 4,
//     backgroundColor: '#f1f5f9',
//     marginHorizontal: 16,
//     borderRadius: 2,
//     marginBottom: 8,
//   },

//   scrollThumb: {
//     width: 80,
//     height: 4,
//     backgroundColor: '#ea7e30',
//     borderRadius: 2,
//   },

//   // ---- 5. PAGINATION FOOTER ----
//   paginationFooter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderTopWidth: 1,
//     borderTopColor: '#f1f5f9',
//     backgroundColor: '#ffffff',
//   },

//   paginationInfoText: {
//     fontSize: 13,
//     color: '#64748b',
//     fontWeight: '500',
//   },

//   paginationControls: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },

//   pageBtn: {
//     width: 32,
//     height: 32,
//     borderRadius: 10,
//     backgroundColor: '#f1f5f9',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   pageBtnDisabled: {
//     opacity: 0.4,
//   },

//   pageBtnText: {
//     fontSize: 16,
//     color: '#334155',
//     fontWeight: '700',
//   },

//   pageBtnTextDisabled: {
//     color: '#94a3b8',
//   },

//   pageCountText: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#1e293b',
//     paddingHorizontal: 4,
//   },

//   // ---- 6. FLOATING ADD BUTTON ----
//   floatingAddButton: {
//     position: 'absolute',
//     bottom: 50,
//     right: 20,
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: '#ea7e30',
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#ea7e30',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.35,
//     shadowRadius: 8,
//     elevation: 6,
//     zIndex: 99,
//   },

//   addIconH: {
//     position: 'absolute',
//     width: 22,
//     height: 3.2,
//     backgroundColor: '#ffffff',
//     borderRadius: 2,
//   },

//   addIconV: {
//     position: 'absolute',
//     width: 3.2,
//     height: 22,
//     backgroundColor: '#ffffff',
//     borderRadius: 2,
//   },

//   // ---- MODAL OVERLAYS & FORMS ----
//   modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(15, 23, 42, 0.45)',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },

//   exportMenuCard: {
//     width: 260,
//     backgroundColor: '#ffffff',
//     borderRadius: 18,
//     padding: 18,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 4},
//     shadowOpacity: 0.15,
//     shadowRadius: 10,
//     elevation: 8,
//   },

//   exportMenuTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#1e293b',
//     marginBottom: 14,
//   },

//   exportOptionRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f1f4',
//   },

//   exportOptionIcon: {
//     fontSize: 18,
//     marginRight: 12,
//   },

//   exportOptionText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#334155',
//   },

//   formModalCard: {
//     width: '100%',
//     maxHeight: '85%',
//     backgroundColor: '#ffffff',
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 6},
//     shadowOpacity: 0.2,
//     shadowRadius: 12,
//     elevation: 10,
//   },

//   formModalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingBottom: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: '#f1f1f4',
//   },

//   formModalTitle: {
//     fontSize: 18,
//     fontWeight: '800',
//     color: '#0f172a',
//   },

//   formModalClose: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#94a3b8',
//     padding: 4,
//   },

//   formContent: {
//     paddingVertical: 14,
//   },

//   inputLabel: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#475569',
//     marginBottom: 6,
//     marginTop: 10,
//   },

//   formInput: {
//     height: 44,
//     backgroundColor: '#f8fafc',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     paddingHorizontal: 12,
//     fontSize: 14,
//     color: '#1e293b',
//   },

//   datePickerBtn: {
//     height: 44,
//     backgroundColor: '#f8fafc',
//     borderRadius: 10,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     paddingHorizontal: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   datePickerText: {
//     fontSize: 14,
//     color: '#1e293b',
//     fontWeight: '500',
//   },

//   calendarIcon: {
//     fontSize: 16,
//   },

//   statusToggleRow: {
//     flexDirection: 'row',
//     gap: 12,
//     marginTop: 4,
//   },

//   statusToggleBtn: {
//     flex: 1,
//     paddingVertical: 10,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: '#f1f5f9',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },

//   statusToggleBtnActive: {
//     backgroundColor: '#ecfdf5',
//     borderColor: '#a7f3d0',
//   },

//   statusToggleBtnInactive: {
//     backgroundColor: '#f1f5f9',
//     borderColor: '#e2e8f0',
//   },

//   statusToggleText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#64748b',
//   },

//   statusToggleTextActive: {
//     color: '#059669',
//     fontWeight: '700',
//   },

//   statusToggleTextInactive: {
//     color: '#64748b',
//     fontWeight: '700',
//   },

//   formModalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     gap: 10,
//     paddingTop: 14,
//     borderTopWidth: 1,
//     borderTopColor: '#f1f1f4',
//   },

//   cancelBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     backgroundColor: '#f1f5f9',
//   },

//   cancelBtnText: {
//     fontSize: 14,
//     fontWeight: '600',
//     color: '#64748b',
//   },

//   saveBtn: {
//     paddingVertical: 10,
//     paddingHorizontal: 18,
//     borderRadius: 10,
//     backgroundColor: '#ea7e30',
//   },

//   saveBtnText: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#ffffff',
//   },
// });





import React, {useState} from 'react';
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
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface FinancialYearItem {
  id: string;
  financialYear: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Inactive';
};

// Professional vector back arrow icon
const BackArrowIcon = () => (
  <View
    style={{
      width: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <View
      style={{
        position: 'absolute',
        width: 14,
        height: 2.6,
        backgroundColor: '#1e293b',
        borderRadius: 1.3,
      }}
    />

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

const PencilIcon = ({
  size = 14,
  color = '#ea7e30',
}: {
  size?: number;
  color?: string;
}) => (
  <View
    style={{
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
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

const DustbinIcon = ({
  size = 14,
  color = '#ef4444',
}: {
  size?: number;
  color?: string;
}) => (
  <View
    style={{
      width: size,
      height: size + 2,
      alignItems: 'center',
      justifyContent: 'center',
    }}>
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
      <View
        style={{
          width: 1.1,
          height: '65%',
          backgroundColor: color,
          borderRadius: 0.5,
        }}
      />

      <View
        style={{
          width: 1.1,
          height: '65%',
          backgroundColor: color,
          borderRadius: 0.5,
        }}
      />
    </View>
  </View>
);

const INITIAL_DEMO_FINANCIAL_YEARS: FinancialYearItem[] = [
  {
    id: '1',
    financialYear: '2026-2027',
    startDate: '01-Apr-2026',
    endDate: '31-Mar-2027',
    status: 'Active',
  },
  {
    id: '2',
    financialYear: '2025-2026',
    startDate: '01-Apr-2025',
    endDate: '31-Mar-2026',
    status: 'Inactive',
  },
  {
    id: '3',
    financialYear: '2024-2025',
    startDate: '01-Apr-2024',
    endDate: '31-Mar-2025',
    status: 'Inactive',
  },
  {
    id: '4',
    financialYear: '2023-2024',
    startDate: '01-Apr-2023',
    endDate: '31-Mar-2024',
    status: 'Inactive',
  },
  {
    id: '5',
    financialYear: '2022-2023',
    startDate: '01-Apr-2022',
    endDate: '31-Mar-2023',
    status: 'Inactive',
  },
];

const formatDateToDisplay = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

const parseDisplayDate = (str: string): Date => {
  if (!str) return new Date();

  const parts = str.split('-');

  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);

    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthIdx = months.findIndex(
      m => m.toLowerCase() === parts[1].toLowerCase(),
    );

    const year = parseInt(parts[2], 10);

    if (!isNaN(day) && monthIdx !== -1 && !isNaN(year)) {
      return new Date(year, monthIdx, day);
    }
  }

  return new Date();
};

const FinancialYearMaster = ({navigation}: Props) => {
  const [data, setData] = useState<FinancialYearItem[]>(
    INITIAL_DEMO_FINANCIAL_YEARS,
  );

  const [searchQuery, setSearchQuery] = useState('');

  const ITEMS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);

  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  // Financial Year Filter Dropdown
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [financialYear, setFinancialYear] = useState('');
  const [startDate, setStartDate] = useState('01-Apr-2026');
  const [endDate, setEndDate] = useState('31-Mar-2027');
  const [status, setStatus] =
    useState<'Active' | 'Inactive'>('Active');

  // Date Pickers
  const [startDateObj, setStartDateObj] = useState<Date>(
    new Date(2026, 3, 1),
  );

  const [endDateObj, setEndDateObj] = useState<Date>(
    new Date(2027, 2, 31),
  );

  const [showStartDatePicker, setShowStartDatePicker] =
    useState(false);

  const [showEndDatePicker, setShowEndDatePicker] =
    useState(false);

  // =====================================================
  // UNIQUE FINANCIAL YEARS FOR DROPDOWN
  // =====================================================

  const financialYearOptions = Array.from(
    new Set(data.map(item => item.financialYear)),
  ).sort((a, b) => {
    const yearA = parseInt(a.split('-')[0], 10);
    const yearB = parseInt(b.split('-')[0], 10);

    return yearB - yearA;
  });

  const resetForm = () => {
    setFinancialYear('');

    const defaultStart = new Date(2026, 3, 1);
    const defaultEnd = new Date(2027, 2, 31);

    setStartDateObj(defaultStart);
    setEndDateObj(defaultEnd);

    setStartDate(formatDateToDisplay(defaultStart));
    setEndDate(formatDateToDisplay(defaultEnd));

    setStatus('Active');
    setEditingId(null);

    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item: FinancialYearItem) => {
    setEditingId(item.id);
    setFinancialYear(item.financialYear);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setStatus(item.status);

    setStartDateObj(parseDisplayDate(item.startDate));
    setEndDateObj(parseDisplayDate(item.endDate));

    setShowStartDatePicker(false);
    setShowEndDatePicker(false);

    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const onStartDateChange = (
    _event: any,
    selectedDate?: Date,
  ) => {
    setShowStartDatePicker(false);

    if (selectedDate) {
      setStartDateObj(selectedDate);
      setStartDate(formatDateToDisplay(selectedDate));

      const autoEnd = new Date(
        selectedDate.getFullYear() + 1,
        selectedDate.getMonth(),
        0,
      );

      setEndDateObj(autoEnd);
      setEndDate(formatDateToDisplay(autoEnd));
    }
  };

  const onEndDateChange = (
    _event: any,
    selectedDate?: Date,
  ) => {
    setShowEndDatePicker(false);

    if (selectedDate) {
      setEndDateObj(selectedDate);
      setEndDate(formatDateToDisplay(selectedDate));
    }
  };

  const handleSave = () => {
    const trimmedYear = financialYear.trim();

    if (!trimmedYear) {
      Alert.alert(
        'Validation Error',
        'Financial Year Name is required.',
      );
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert(
        'Validation Error',
        'Start Date and End Date are required.',
      );
      return;
    }

    if (startDateObj > endDateObj) {
      Alert.alert(
        'Validation Error',
        'Start Date cannot be after End Date.',
      );
      return;
    }

    const duplicate = data.find(
      item =>
        item.financialYear.toLowerCase() ===
          trimmedYear.toLowerCase() &&
        item.id !== editingId,
    );

    if (duplicate) {
      Alert.alert(
        'Duplicate Entry',
        'A Financial Year with this name already exists.',
      );
      return;
    }

    if (editingId !== null) {
      setData(prev =>
        prev.map(item =>
          item.id === editingId
            ? {
                ...item,
                financialYear: trimmedYear,
                startDate,
                endDate,
                status,
              }
            : item,
        ),
      );

      closeModal();

      Alert.alert(
        'Success',
        `Financial Year "${trimmedYear}" updated successfully.`,
      );

      return;
    }

    const newItem: FinancialYearItem = {
      id: Date.now().toString(),
      financialYear: trimmedYear,
      startDate,
      endDate,
      status,
    };

    setData(prev => [newItem, ...prev]);
    setCurrentPage(1);

    closeModal();

    Alert.alert(
      'Success',
      `Financial Year "${trimmedYear}" added successfully.`,
    );
  };

  const handleDelete = (item: FinancialYearItem) => {
    Alert.alert(
      'Delete Financial Year',
      `Are you sure you want to delete "${item.financialYear}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setData(prev =>
              prev.filter(i => i.id !== item.id),
            );

            if (selectedYear === item.financialYear) {
              setSelectedYear('');
            }
          },
        },
      ],
    );
  };

  const handleExportPDF = async () => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredData.length > 0 ? filteredData : data;

    const columns = [
      {
        title: '#',
        width: 25,
        align: 'center' as const,
      },
      {
        title: 'Financial Year',
        width: 100,
      },
      {
        title: 'Start Date',
        width: 75,
      },
      {
        title: 'End Date',
        width: 75,
      },
      {
        title: 'Status',
        width: 60,
        align: 'center' as const,
      },
    ];

    const rows = targetList.map((item, idx) => [
      String(idx + 1),
      item.financialYear,
      item.startDate,
      item.endDate,
      item.status,
    ]);

    try {
      const pdfBase64 = generatePurePDF(
        'Financial Year Report',
        columns,
        rows,
      );

      const filename = `FinancialYears_${Date.now()}.pdf`;

      await saveFileToDevice(
        filename,
        pdfBase64,
        'base64',
      );

      Alert.alert(
        'Success',
        `PDF saved successfully as ${filename}`,
      );
    } catch (e: any) {
      Alert.alert(
        'Export Error',
        e.message || 'Failed to export PDF',
      );
    }
  };

  // =====================================================
  // FILTER + SORT TABLE DATA
  // =====================================================

  const filteredData = data
    .filter(item => {
      // Selected Financial Year filter
      if (
        selectedYear &&
        item.financialYear !== selectedYear
      ) {
        return false;
      }

      // Search filter
      const q = searchQuery.toLowerCase().trim();

      if (!q) {
        return true;
      }

      return (
        item.financialYear.toLowerCase().includes(q) ||
        item.startDate.toLowerCase().includes(q) ||
        item.endDate.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      // Selected year stays first
      if (selectedYear) {
        if (a.financialYear === selectedYear) return -1;
        if (b.financialYear === selectedYear) return 1;
      }

      // Sort financial years from newest to oldest
      const yearA = parseInt(
        a.financialYear.split('-')[0],
        10,
      );

      const yearB = parseInt(
        b.financialYear.split('-')[0],
        10,
      );

      return yearB - yearA;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / ITEMS_PER_PAGE),
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages,
  );

  const startIndex =
    (safeCurrentPage - 1) * ITEMS_PER_PAGE;

  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    filteredData.length,
  );

  const currentItems = filteredData.slice(
    startIndex,
    endIndex,
  );

  return (
    <SafeAreaView style={styles.container}>

      {/* ================================================= */}
      {/* 1. HEADER */}
      {/* ================================================= */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{
            top: 12,
            bottom: 12,
            left: 12,
            right: 12,
          }}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>
            Financial Year Master
          </Text>
        </View>
      </View>

      {/* ================================================= */}
      {/* 2. SEARCH BAR & EXPORT BUTTON */}
      {/* ================================================= */}

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search financial year..."
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

        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.8}
          onPress={() =>
            setDownloadMenuVisible(true)
          }>
          <Text style={styles.exportIcon}>📄</Text>
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* 3. FINANCIAL YEAR DROPDOWN */}
      {/* ================================================= */}

      <View style={styles.yearDropdownWrapper}>
        <TouchableOpacity
          style={[
            styles.yearDropdown,
            dropdownOpen && styles.yearDropdownOpen,
          ]}
          activeOpacity={0.8}
          onPress={() =>
            setDropdownOpen(!dropdownOpen)
          }>

          <View style={styles.dropdownLeft}>
            <Text style={styles.dropdownLabel}>
              Financial Year
            </Text>

            <Text
              style={[
                styles.dropdownSelectedText,
                !selectedYear &&
                  styles.dropdownPlaceholder,
              ]}>
              {selectedYear ||
                'All Financial Years'}
            </Text>
          </View>

          <Text style={styles.dropdownArrow}>
            {dropdownOpen ? '▲' : '▼'}
          </Text>
        </TouchableOpacity>

        {dropdownOpen && (
          <View style={styles.dropdownMenu}>

            {/* All Financial Years */}
            <TouchableOpacity
              style={[
                styles.dropdownOption,
                !selectedYear &&
                  styles.dropdownOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedYear('');
                setCurrentPage(1);
                setDropdownOpen(false);
              }}>
              <Text
                style={[
                  styles.dropdownOptionText,
                  !selectedYear &&
                    styles.dropdownOptionTextSelected,
                ]}>
                All Financial Years
              </Text>

              {!selectedYear && (
                <Text style={styles.checkMark}>✓</Text>
              )}
            </TouchableOpacity>

            {/* Financial Year Options */}
            {financialYearOptions.map(year => (
              <TouchableOpacity
                key={year}
                style={[
                  styles.dropdownOption,
                  selectedYear === year &&
                    styles.dropdownOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedYear(year);
                  setCurrentPage(1);
                  setDropdownOpen(false);
                }}>
                <Text
                  style={[
                    styles.dropdownOptionText,
                    selectedYear === year &&
                      styles.dropdownOptionTextSelected,
                  ]}>
                  {year}
                </Text>

                {selectedYear === year && (
                  <Text style={styles.checkMark}>
                    ✓
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ================================================= */}
      {/* 4. SWIPE HINT */}
      {/* ================================================= */}

      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintArrow}>➔</Text>

        <Text style={styles.swipeHintText}>
          Swipe the table to see all columns
        </Text>
      </View>

      {/* ================================================= */}
      {/* 5. MAIN DATA TABLE CARD */}
      {/* ================================================= */}

      <View style={styles.tableCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.horizontalTableScroll
          }>

          <View>

            {/* TABLE HEADER */}
            <View style={styles.tableHeaderRow}>
              <Text
                style={[
                  styles.columnHeader,
                  styles.colIndex,
                ]}>
                #
              </Text>

              <Text
                style={[
                  styles.columnHeader,
                  styles.colYear,
                ]}>
                FINANCIAL YEAR
              </Text>

              <Text
                style={[
                  styles.columnHeader,
                  styles.colDate,
                ]}>
                START DATE
              </Text>

              <Text
                style={[
                  styles.columnHeader,
                  styles.colDate,
                ]}>
                END DATE
              </Text>

              <Text
                style={[
                  styles.columnHeader,
                  styles.colStatus,
                ]}>
                STATUS
              </Text>

              <Text
                style={[
                  styles.columnHeader,
                  styles.colActions,
                ]}>
                ACTIONS
              </Text>
            </View>

            {/* TABLE BODY */}
            {currentItems.map((item, index) => {
              const globalIndex =
                startIndex + index + 1;

              const isActive =
                item.status === 'Active';

              return (
                <View
                  key={item.id || index}
                  style={[
                    styles.tableRow,
                    index ===
                      currentItems.length - 1 &&
                      styles.tableRowLast,
                  ]}>

                  <View style={styles.colIndex}>
                    <Text
                      style={styles.cellIndexText}>
                      {globalIndex}
                    </Text>
                  </View>

                  <View style={styles.colYear}>
                    <Text
                      style={styles.cellNameText}
                      numberOfLines={1}>
                      {item.financialYear}
                    </Text>
                  </View>

                  <View style={styles.colDate}>
                    <Text
                      style={styles.cellDateText}>
                      {item.startDate}
                    </Text>
                  </View>

                  <View style={styles.colDate}>
                    <Text
                      style={styles.cellDateText}>
                      {item.endDate}
                    </Text>
                  </View>

                  <View style={styles.colStatus}>
                    <View
                      style={[
                        styles.statusBadge,
                        isActive
                          ? styles.statusBadgeActive
                          : styles.statusBadgeInactive,
                      ]}>
                      <Text
                        style={[
                          styles.statusBadgeText,
                          isActive
                            ? styles.statusTextActive
                            : styles.statusTextInactive,
                        ]}>
                        {item.status}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        openEditModal(item)
                      }
                      hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8,
                      }}>
                      <PencilIcon
                        size={14}
                        color="#ea7e30"
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() =>
                        handleDelete(item)
                      }
                      hitSlop={{
                        top: 8,
                        bottom: 8,
                        left: 8,
                        right: 8,
                      }}>
                      <DustbinIcon
                        size={14}
                        color="#ef4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}

            {/* Empty State */}
            {currentItems.length === 0 && (
              <View style={styles.emptyTable}>
                <Text style={styles.emptyText}>
                  No financial years found.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Scroll Bar */}
        <View style={styles.scrollTrack}>
          <View style={styles.scrollThumb} />
        </View>

        {/* Pagination */}
        {filteredData.length > 10 && (
          <View style={styles.paginationFooter}>
            <Text style={styles.paginationInfoText}>
              {`${startIndex + 1}–${endIndex} of ${filteredData.length}`}
            </Text>

            <View style={styles.paginationControls}>
              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  safeCurrentPage <= 1 &&
                    styles.pageBtnDisabled,
                ]}
                disabled={safeCurrentPage <= 1}
                onPress={() =>
                  setCurrentPage(p =>
                    Math.max(1, p - 1),
                  )
                }>
                <Text
                  style={[
                    styles.pageBtnText,
                    safeCurrentPage <= 1 &&
                      styles.pageBtnTextDisabled,
                  ]}>
                  ‹
                </Text>
              </TouchableOpacity>

              <Text style={styles.pageCountText}>
                {safeCurrentPage}/{totalPages}
              </Text>

              <TouchableOpacity
                style={[
                  styles.pageBtn,
                  safeCurrentPage >= totalPages &&
                    styles.pageBtnDisabled,
                ]}
                disabled={
                  safeCurrentPage >= totalPages
                }
                onPress={() =>
                  setCurrentPage(p =>
                    Math.min(totalPages, p + 1),
                  )
                }>
                <Text
                  style={[
                    styles.pageBtnText,
                    safeCurrentPage >= totalPages &&
                      styles.pageBtnTextDisabled,
                  ]}>
                  ›
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* ================================================= */}
      {/* 6. FLOATING ADD BUTTON */}
      {/* ================================================= */}

      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={openAddModal}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* ================================================= */}
      {/* 7. EXPORT MENU */}
      {/* ================================================= */}

      <Modal
        visible={downloadMenuVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDownloadMenuVisible(false)
        }>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() =>
            setDownloadMenuVisible(false)
          }>

          <View style={styles.exportMenuCard}>
            <Text style={styles.exportMenuTitle}>
              Export Report
            </Text>

            <TouchableOpacity
              style={styles.exportOptionRow}
              onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>
                📄
              </Text>

              <Text style={styles.exportOptionText}>
                Download as PDF
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ================================================= */}
      {/* 8. ADD / EDIT FINANCIAL YEAR MODAL */}
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
                {editingId
                  ? 'Edit Financial Year'
                  : 'Add Financial Year'}
              </Text>

              <TouchableOpacity
                onPress={closeModal}
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10,
                }}>
                <Text style={styles.formModalClose}>
                  ✕
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                styles.formContent
              }>

              <Text style={styles.inputLabel}>
                Financial Year *
              </Text>

              <TextInput
                style={styles.formInput}
                placeholder="e.g. 2026-2027"
                value={financialYear}
                onChangeText={setFinancialYear}
              />

              <Text style={styles.inputLabel}>
                Start Date *
              </Text>

              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() =>
                  setShowStartDatePicker(true)
                }>
                <Text style={styles.datePickerText}>
                  {startDate}
                </Text>

                <Text style={styles.calendarIcon}>
                  📅
                </Text>
              </TouchableOpacity>

              {showStartDatePicker && (
                <DateTimePicker
                  value={startDateObj}
                  mode="date"
                  display={
                    Platform.OS === 'ios'
                      ? 'spinner'
                      : 'default'
                  }
                  onChange={onStartDateChange}
                />
              )}

              <Text style={styles.inputLabel}>
                End Date *
              </Text>

              <TouchableOpacity
                style={styles.datePickerBtn}
                onPress={() =>
                  setShowEndDatePicker(true)
                }>
                <Text style={styles.datePickerText}>
                  {endDate}
                </Text>

                <Text style={styles.calendarIcon}>
                  📅
                </Text>
              </TouchableOpacity>

              {showEndDatePicker && (
                <DateTimePicker
                  value={endDateObj}
                  mode="date"
                  display={
                    Platform.OS === 'ios'
                      ? 'spinner'
                      : 'default'
                  }
                  onChange={onEndDateChange}
                />
              )}

              <Text style={styles.inputLabel}>
                Status
              </Text>

              <View style={styles.statusToggleRow}>
                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    status === 'Active' &&
                      styles.statusToggleBtnActive,
                  ]}
                  onPress={() =>
                    setStatus('Active')
                  }>
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'Active' &&
                        styles.statusToggleTextActive,
                    ]}>
                    Active
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusToggleBtn,
                    status === 'Inactive' &&
                      styles.statusToggleBtnInactive,
                  ]}
                  onPress={() =>
                    setStatus('Inactive')
                  }>
                  <Text
                    style={[
                      styles.statusToggleText,
                      status === 'Inactive' &&
                        styles.statusToggleTextInactive,
                    ]}>
                    Inactive
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.formModalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={closeModal}>
                <Text style={styles.cancelBtnText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSave}>
                <Text style={styles.saveBtnText}>
                  {editingId
                    ? 'Update Year'
                    : 'Save Year'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default FinancialYearMaster;

// =====================================================
// STYLESHEET
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // ---- HEADER ----

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
    shadowOffset: {
      width: 0,
      height: 2,
    },
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

  // ---- SEARCH ----

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
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },

  exportIcon: {
    fontSize: 20,
  },

  // ---- FINANCIAL YEAR DROPDOWN ----

  yearDropdownWrapper: {
    marginHorizontal: 16,
    marginBottom: 10,
    zIndex: 100,
  },

  yearDropdown: {
    height: 54,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  yearDropdownOpen: {
    borderColor: '#ea7e30',
  },

  dropdownLeft: {
    flex: 1,
  },

  dropdownLabel: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 2,
  },

  dropdownSelectedText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
  },

  dropdownPlaceholder: {
    color: '#64748b',
    fontWeight: '500',
  },

  dropdownArrow: {
    fontSize: 11,
    color: '#64748b',
    marginLeft: 10,
  },

  dropdownMenu: {
    position: 'absolute',
    top: 58,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },

  dropdownOption: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  dropdownOptionSelected: {
    backgroundColor: '#fff7ed',
  },

  dropdownOptionText: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
  },

  dropdownOptionTextSelected: {
    color: '#ea7e30',
    fontWeight: '700',
  },

  checkMark: {
    fontSize: 15,
    color: '#ea7e30',
    fontWeight: '800',
  },

  // ---- SWIPE HINT ----

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

  // ---- TABLE ----

  tableCard: {
    flex: 1,
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },

  horizontalTableScroll: {
    minWidth: '100%',
  },

  colIndex: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },

  colYear: {
    width: 160,
    justifyContent: 'center',
    paddingRight: 10,
  },

  colDate: {
    width: 125,
    justifyContent: 'center',
  },

  colStatus: {
    width: 95,
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

  cellDateText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
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

  emptyTable: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
  },

  // ---- SCROLL BAR ----

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

  // ---- PAGINATION ----

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

  // ---- FLOATING ADD BUTTON ----

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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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

  // ---- MODAL ----

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
    shadowOffset: {
      width: 0,
      height: 4,
    },
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
    borderBottomColor: '#f1f1f4',
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
    shadowOffset: {
      width: 0,
      height: 6,
    },
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

  datePickerBtn: {
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

  datePickerText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },

  calendarIcon: {
    fontSize: 16,
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
    backgroundColor: '#f1f5f9',
    borderColor: '#e2e8f0',
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
    color: '#64748b',
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
