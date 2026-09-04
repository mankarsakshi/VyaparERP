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
// } from 'react-native';
// import {downloadSuppliers} from '../utils/exportHelper';

// type Props = {
//   navigation: any;
//   route?: any;
// };

// export interface Supplier {
//   id: string;
//   name: string;
//   phone: string;
//   email: string;
//   address: string;
//   city: string;
//   state: string;
//   pincode: string;
//   hasGstin: boolean;
//   gstin: string;
//   openingBalance: number;
//   bankName: string;
//   accountNumber: string;
//   ifscCode: string;
// }

// const DEFAULT_SUPPLIERS: Supplier[] = [
//   {
//     id: '1',
//     name: 'Omkar Traders',
//     phone: '9822114455',
//     email: 'omkar.traders@gmail.com',
//     address: 'Plot 12, Market Yard, Gultekdi',
//     city: 'Pune',
//     state: 'Maharashtra',
//     pincode: '411037',
//     hasGstin: true,
//     gstin: '27AABCO1234F1Z5',
//     openingBalance: 45000,
//     bankName: 'HDFC Bank',
//     accountNumber: '50200012345678',
//     ifscCode: 'HDFC0000123',
//   },
//   {
//     id: '2',
//     name: 'Rajeshwari Enterprises',
//     phone: '9820011223',
//     email: 'sales@rajeshwarient.com',
//     address: 'Gala 8, MIDC Industrial Area, Andheri East',
//     city: 'Mumbai',
//     state: 'Maharashtra',
//     pincode: '400093',
//     hasGstin: true,
//     gstin: '27AABCR5678G1Z2',
//     openingBalance: 68000,
//     bankName: 'State Bank of India',
//     accountNumber: '32145678901',
//     ifscCode: 'SBIN0001234',
//   },
//   {
//     id: '3',
//     name: 'Vardhman Textiles',
//     phone: '9825123456',
//     email: 'vardhman.textiles@yahoo.com',
//     address: 'Ring Road Textile Market, Shop 104',
//     city: 'Surat',
//     state: 'Gujarat',
//     pincode: '395002',
//     hasGstin: true,
//     gstin: '24AAACV1234L1Z9',
//     openingBalance: 92000,
//     bankName: 'Bank of Baroda',
//     accountNumber: '12450200003456',
//     ifscCode: 'BARB0TEXTIL',
//   },
//   {
//     id: '4',
//     name: 'Balaji Hardware & Tools',
//     phone: '9845012399',
//     email: 'balajihardware@gmail.com',
//     address: '56 SP Road, Kalasipalyam',
//     city: 'Bengaluru',
//     state: 'Karnataka',
//     pincode: '560002',
//     hasGstin: false,
//     gstin: '',
//     openingBalance: 12000,
//     bankName: 'Canara Bank',
//     accountNumber: '0421101004567',
//     ifscCode: 'CNRB0000421',
//   },
//   {
//     id: '5',
//     name: 'Metro Electronics & Electricals',
//     phone: '9811098765',
//     email: 'contact@metroelec.in',
//     address: '204 Bhagirath Palace, Chandni Chowk',
//     city: 'Delhi',
//     state: 'Delhi',
//     pincode: '110006',
//     hasGstin: true,
//     gstin: '07AACCM5678P1ZQ',
//     openingBalance: 115000,
//     bankName: 'ICICI Bank',
//     accountNumber: '002105001234',
//     ifscCode: 'ICIC0000021',
//   },
//   {
//     id: '6',
//     name: 'Sri Krishna Agro Supplies',
//     phone: '9764512345',
//     email: 'krishna.agro@rediffmail.com',
//     address: 'Grain Market Road, Cotton Market',
//     city: 'Nagpur',
//     state: 'Maharashtra',
//     pincode: '440018',
//     hasGstin: false,
//     gstin: '',
//     openingBalance: 8500,
//     bankName: 'Bank of Maharashtra',
//     accountNumber: '60012345678',
//     ifscCode: 'MAHB0000045',
//   },
//   {
//     id: '7',
//     name: 'Gupta Paper & Packaging',
//     phone: '9712034567',
//     email: 'guptapaperjaipur@gmail.com',
//     address: 'Industrial Area, VKIA Road 9',
//     city: 'Jaipur',
//     state: 'Rajasthan',
//     pincode: '302013',
//     hasGstin: true,
//     gstin: '08AAACG4321K1Z3',
//     openingBalance: 34000,
//     bankName: 'Punjab National Bank',
//     accountNumber: '1542000100234567',
//     ifscCode: 'PUNB0154200',
//   },
//   {
//     id: '8',
//     name: 'Apex Chemical Industries',
//     phone: '9879012345',
//     email: 'orders@apexchemicals.co.in',
//     address: 'Phase 4, GIDC Vatva',
//     city: 'Ahmedabad',
//     state: 'Gujarat',
//     pincode: '382445',
//     hasGstin: true,
//     gstin: '24AAACA9876D1Z7',
//     openingBalance: 76000,
//     bankName: 'Axis Bank',
//     accountNumber: '915020045678912',
//     ifscCode: 'UTIB0000150',
//   },
//   {
//     id: '9',
//     name: 'Royal Steel Corporation',
//     phone: '9831098765',
//     email: 'royalsteelkol@gmail.com',
//     address: '22 Brabourne Road, 3rd Floor',
//     city: 'Kolkata',
//     state: 'West Bengal',
//     pincode: '700001',
//     hasGstin: true,
//     gstin: '19AAACR1234M1Z4',
//     openingBalance: 145000,
//     bankName: 'Union Bank of India',
//     accountNumber: '312402010045678',
//     ifscCode: 'UBIN0531243',
//   },
//   {
//     id: '10',
//     name: 'Lakshmi Silk Mills',
//     phone: '9415012345',
//     email: 'lakshmisilk@yahoo.co.in',
//     address: 'Chowk, Near Vishwanath Gali',
//     city: 'Varanasi',
//     state: 'Uttar Pradesh',
//     pincode: '221001',
//     hasGstin: false,
//     gstin: '',
//     openingBalance: 18000,
//     bankName: 'Indian Bank',
//     accountNumber: '50012345678',
//     ifscCode: 'IDIB000V012',
//   },
//   {
//     id: '11',
//     name: 'Sunrise Auto Parts',
//     phone: '9815012345',
//     email: 'sunriseauto.ldh@gmail.com',
//     address: 'Focal Point, Phase 5',
//     city: 'Ludhiana',
//     state: 'Punjab',
//     pincode: '141010',
//     hasGstin: true,
//     gstin: '03AAACS5678J1Z1',
//     openingBalance: 53000,
//     bankName: 'HDFC Bank',
//     accountNumber: '50100234561234',
//     ifscCode: 'HDFC0000567',
//   },
//   {
//     id: '12',
//     name: 'Deccan Plastics Ltd',
//     phone: '9848012345',
//     email: 'info@deccanplastics.in',
//     address: 'Cherlapally IDA, Phase II',
//     city: 'Hyderabad',
//     state: 'Telangana',
//     pincode: '500051',
//     hasGstin: true,
//     gstin: '36AAACD1234N1Z8',
//     openingBalance: 61000,
//     bankName: 'Kotak Mahindra Bank',
//     accountNumber: '7812034567',
//     ifscCode: 'KKBK0007812',
//   },
//   {
//     id: '13',
//     name: 'Premier Timber Mart',
//     phone: '9840012345',
//     email: 'premiertimber@gmail.com',
//     address: 'Sydenhams Road, Periamet',
//     city: 'Chennai',
//     state: 'Tamil Nadu',
//     pincode: '600003',
//     hasGstin: false,
//     gstin: '',
//     openingBalance: 22000,
//     bankName: 'Indian Overseas Bank',
//     accountNumber: '012402000001234',
//     ifscCode: 'IOBA0000124',
//   },
//   {
//     id: '14',
//     name: 'Malabar Spices Wholesale',
//     phone: '9446012345',
//     email: 'malabarspices@gmail.com',
//     address: 'Jew Town, Mattancherry',
//     city: 'Kochi',
//     state: 'Kerala',
//     pincode: '682002',
//     hasGstin: true,
//     gstin: '32AAACM4321E1Z6',
//     openingBalance: 39000,
//     bankName: 'Federal Bank',
//     accountNumber: '11450100456789',
//     ifscCode: 'FDRL0001145',
//   },
// ];

// const SupplierMasterScreen = ({navigation, route}: Props) => {
//   const [suppliers, setSuppliers] = useState<Supplier[]>(DEFAULT_SUPPLIERS);
//   const [searchQuery, setSearchQuery] = useState('');

//   const SUPPLIERS_PER_PAGE = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingSupplierId, setEditingSupplierId] = useState<string | null>(null);

//   // Supplier Details Form
//   const [name, setName] = useState('');
//   const [phone, setPhone] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [hasGstin, setHasGstin] = useState<boolean>(false);
//   const [gstin, setGstin] = useState('');
//   const [openingBalance, setOpeningBalance] = useState('');

//   // Bank Details Form
//   const [bankName, setBankName] = useState('');
//   const [accountNumber, setAccountNumber] = useState('');
//   const [ifscCode, setIfscCode] = useState('');

//   // Handle route params (e.g. openAddModal from AddPurchase or PurchaseOrder)
//   useEffect(() => {
//     if (route?.params?.openAddModal) {
//       openAddSupplierModal();
//     }
//   }, [route?.params?.openAddModal]);

//   // ============================================================
//   // RESET FORM
//   // ============================================================

//   const resetForm = () => {
//     setName('');
//     setPhone('');
//     setEmail('');
//     setAddress('');
//     setCity('');
//     setState('');
//     setPincode('');
//     setHasGstin(false);
//     setGstin('');
//     setOpeningBalance('');
//     setBankName('');
//     setAccountNumber('');
//     setIfscCode('');
//     setEditingSupplierId(null);
//   };

//   // ============================================================
//   // ADD SUPPLIER
//   // ============================================================

//   const openAddSupplierModal = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   // ============================================================
//   // EDIT SUPPLIER
//   // ============================================================

//   const openEditSupplierModal = (supplier: Supplier) => {
//     setEditingSupplierId(supplier.id);

//     setName(supplier.name || '');
//     setPhone(supplier.phone || '');
//     setEmail(supplier.email || '');
//     setAddress(supplier.address || '');
//     setCity(supplier.city || '');
//     setState(supplier.state || '');
//     setPincode(supplier.pincode || '');
//     setHasGstin(supplier.hasGstin);
//     setGstin(supplier.hasGstin ? supplier.gstin : '');
//     setOpeningBalance(
//       supplier.openingBalance !== undefined ? String(supplier.openingBalance) : '',
//     );
//     setBankName(supplier.bankName || '');
//     setAccountNumber(supplier.accountNumber || '');
//     setIfscCode(supplier.ifscCode || '');

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
//   // SAVE SUPPLIER
//   // ============================================================

//   const handleSaveSupplier = () => {
//     if (!name.trim()) {
//       Alert.alert('Validation Error', 'Supplier Name is required');
//       return;
//     }
//     if (!phone.trim()) {
//       Alert.alert('Validation Error', 'Phone Number is required');
//       return;
//     }

//     if (hasGstin && !gstin.trim()) {
//       Alert.alert('Validation Error', 'Please enter the GSTIN number or select "No"');
//       return;
//     }

//     const supplierData: Supplier = {
//       id: editingSupplierId || Date.now().toString(),
//       name: name.trim(),
//       phone: phone.trim(),
//       email: email.trim(),
//       address: address.trim(),
//       city: city.trim(),
//       state: state.trim(),
//       pincode: pincode.trim(),
//       hasGstin: hasGstin,
//       gstin: hasGstin ? gstin.trim().toUpperCase() : '',
//       openingBalance: parseFloat(openingBalance) || 0,
//       bankName: bankName.trim(),
//       accountNumber: accountNumber.trim(),
//       ifscCode: ifscCode.trim().toUpperCase(),
//     };

//     if (editingSupplierId) {
//       setSuppliers(prev =>
//         prev.map(s => (s.id === editingSupplierId ? supplierData : s)),
//       );
//       Alert.alert('Success', `Supplier "${supplierData.name}" updated successfully!`);
//     } else {
//       setSuppliers(prev => [supplierData, ...prev]);
//       setCurrentPage(1);
//       Alert.alert('Success', `Supplier "${supplierData.name}" added successfully!`);

//       // If returning to AddPurchase or PurchaseOrder
//       if (route?.params?.returnTo) {
//         closeModal();
//         navigation.navigate(route.params.returnTo, {
//           newSupplier: supplierData,
//         });
//         return;
//       }
//     }

//     closeModal();
//   };

//   // ============================================================
//   // DELETE
//   // ============================================================

//   const handleDeleteSupplier = (supplier: Supplier) => {
//     Alert.alert(
//       'Delete Supplier',
//       `Are you sure you want to delete "${supplier.name}"?`,
//       [
//         {
//           text: 'Cancel',
//           style: 'cancel',
//         },
//         {
//           text: 'Delete',
//           style: 'destructive',
//           onPress: () => {
//             setSuppliers(prev => prev.filter(s => s.id !== supplier.id));
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
//       filteredSuppliers.length > 0 ? filteredSuppliers : suppliers;

//     downloadSuppliers(targetList, format);
//   };

//   // ============================================================
//   // SEARCH
//   // ============================================================

//   const filteredSuppliers = suppliers.filter(supplier => {
//     const query = searchQuery.toLowerCase().trim();

//     if (!query) {
//       return true;
//     }

//     return (
//       supplier.name.toLowerCase().includes(query) ||
//       supplier.phone.includes(query) ||
//       supplier.email.toLowerCase().includes(query) ||
//       supplier.city.toLowerCase().includes(query) ||
//       supplier.state.toLowerCase().includes(query) ||
//       supplier.bankName.toLowerCase().includes(query) ||
//       supplier.gstin.toLowerCase().includes(query)
//     );
//   });

//   // ============================================================
//   // PAGINATION
//   // ============================================================

//   const totalPages = Math.max(
//     1,
//     Math.ceil(filteredSuppliers.length / SUPPLIERS_PER_PAGE),
//   );

//   const paginatedSuppliers = filteredSuppliers.slice(
//     (currentPage - 1) * SUPPLIERS_PER_PAGE,
//     currentPage * SUPPLIERS_PER_PAGE,
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
//           <Text style={styles.headerTitle}>Supplier Directory</Text>
//           <Text style={styles.headerSubtitle}>Manage all suppliers</Text>
//         </View>
//       </View>

//       {/* CONTENT */}
//       <View style={styles.content}>
//         {/* SEARCH ROW */}
//         <View style={styles.searchRow}>
//           {/* SEARCH BOX */}
//           <View style={styles.searchBox}>
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search supplier name, phone or city"
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
//             <Text style={styles.sectionTitle}>Supplier Directory</Text>
//             <Text style={styles.totalText}>
//               Total Suppliers: {suppliers.length}
//             </Text>
//           </View>

//           <TouchableOpacity
//             style={styles.addSupplierButton}
//             activeOpacity={0.8}
//             onPress={openAddSupplierModal}>
//             <Text style={styles.addSupplierPlus}>+</Text>
//             <Text style={styles.addSupplierButtonText}></Text>
//           </TouchableOpacity>
//         </View>

//         {/* TABLE */}
//         <View style={styles.tableWrapper}>
//           <ScrollView horizontal showsHorizontalScrollIndicator={true}>
//             <View style={styles.tableContainer}>
//               {/* TABLE HEADER */}
//               <View style={styles.tableHeaderRow}>
//                 <Text style={[styles.headerCell, styles.colNumber]}>#</Text>
//                 <Text style={[styles.headerCell, styles.colName]}>Supplier Name</Text>
//                 <Text style={[styles.headerCell, styles.colPhone]}>Phone</Text>
//                 <Text style={[styles.headerCell, styles.colEmail]}>Email</Text>
//                 <Text style={[styles.headerCell, styles.colAddress]}>Address</Text>
//                 <Text style={[styles.headerCell, styles.colCity]}>City</Text>
//                 <Text style={[styles.headerCell, styles.colState]}>State</Text>
//                 <Text style={[styles.headerCell, styles.colPincode]}>Pincode</Text>
//                 <Text style={[styles.headerCell, styles.colGstin]}>GSTIN</Text>
//                 <Text style={[styles.headerCell, styles.colBalance]}>Opening Balance</Text>
//                 <Text style={[styles.headerCell, styles.colBank]}>Bank Name</Text>
//                 <Text style={[styles.headerCell, styles.colAccount]}>Account No</Text>
//                 <Text style={[styles.headerCell, styles.colIfsc]}>IFSC Code</Text>
//                 <Text style={[styles.headerCell, styles.colAction]}>Action</Text>
//               </View>

//               {/* TABLE BODY */}
//               <ScrollView
//                 style={styles.tableBody}
//                 showsVerticalScrollIndicator={true}>
//                 {filteredSuppliers.length === 0 ? (
//                   <View style={styles.emptyContainer}>
//                     <Text style={styles.emptyText}>
//                       {suppliers.length === 0
//                         ? 'No suppliers added yet.'
//                         : 'No suppliers found.'}
//                     </Text>

//                     <TouchableOpacity
//                       style={styles.emptyAddBtn}
//                       onPress={openAddSupplierModal}>
//                       <Text style={styles.emptyAddBtnText}>+ Add Supplier</Text>
//                     </TouchableOpacity>
//                   </View>
//                 ) : (
//                   paginatedSuppliers.map((supplier, index) => (
//                     <TouchableOpacity
//                       key={supplier.id}
//                       activeOpacity={0.7}
//                       style={[
//                         styles.tableRow,
//                         index % 2 === 1 && styles.tableRowAlternate,
//                       ]}
//                       onPress={() => openEditSupplierModal(supplier)}>
//                       {/* NUMBER */}
//                       <Text style={[styles.bodyCell, styles.colNumber]}>
//                         {(currentPage - 1) * SUPPLIERS_PER_PAGE + index + 1}
//                       </Text>

//                       {/* NAME */}
//                       <View style={[styles.nameCell, styles.colName]}>
//                         <Text style={styles.supplierName} numberOfLines={1}>
//                           {supplier.name}
//                         </Text>
//                       </View>

//                       {/* PHONE */}
//                       <Text
//                         style={[styles.bodyCell, styles.colPhone]}
//                         numberOfLines={1}>
//                         {supplier.phone || '-'}
//                       </Text>

//                       {/* EMAIL */}
//                       <Text
//                         style={[styles.bodyCell, styles.colEmail]}
//                         numberOfLines={1}>
//                         {supplier.email || '-'}
//                       </Text>

//                       {/* ADDRESS */}
//                       <Text
//                         style={[styles.bodyCell, styles.colAddress]}
//                         numberOfLines={1}>
//                         {supplier.address || '-'}
//                       </Text>

//                       {/* CITY */}
//                       <Text
//                         style={[styles.bodyCell, styles.colCity]}
//                         numberOfLines={1}>
//                         {supplier.city || '-'}
//                       </Text>

//                       {/* STATE */}
//                       <Text
//                         style={[styles.bodyCell, styles.colState]}
//                         numberOfLines={1}>
//                         {supplier.state || '-'}
//                       </Text>

//                       {/* PINCODE */}
//                       <Text
//                         style={[styles.bodyCell, styles.colPincode]}
//                         numberOfLines={1}>
//                         {supplier.pincode || '-'}
//                       </Text>

//                       {/* GSTIN */}
//                       <Text
//                         style={[
//                           styles.bodyCell,
//                           styles.colGstin,
//                           supplier.hasGstin && supplier.gstin ? styles.boldText : null,
//                         ]}
//                         numberOfLines={1}>
//                         {supplier.hasGstin && supplier.gstin ? supplier.gstin : '-'}
//                       </Text>

//                       {/* OPENING BALANCE */}
//                       <Text
//                         style={[
//                           styles.bodyCell,
//                           styles.colBalance,
//                           styles.balanceText,
//                         ]}>
//                         ₹ {Number(supplier.openingBalance || 0).toFixed(2)}
//                       </Text>

//                       {/* BANK NAME */}
//                       <Text
//                         style={[styles.bodyCell, styles.colBank]}
//                         numberOfLines={1}>
//                         {supplier.bankName || '-'}
//                       </Text>

//                       {/* ACCOUNT NUMBER */}
//                       <Text
//                         style={[styles.bodyCell, styles.colAccount]}
//                         numberOfLines={1}>
//                         {supplier.accountNumber || '-'}
//                       </Text>

//                       {/* IFSC CODE */}
//                       <Text
//                         style={[styles.bodyCell, styles.colIfsc]}
//                         numberOfLines={1}>
//                         {supplier.ifscCode || '-'}
//                       </Text>

//                       {/* ACTION */}
//                       <View style={[styles.actionCell, styles.colAction]}>
//                         {/* EDIT */}
//                         <TouchableOpacity
//                           style={styles.editButton}
//                           activeOpacity={0.7}
//                           onPress={event => {
//                             event.stopPropagation();
//                             openEditSupplierModal(supplier);
//                           }}>
//                           <Text style={styles.editIcon}>✎</Text>
//                         </TouchableOpacity>

//                         {/* DELETE */}
//                         <TouchableOpacity
//                           style={styles.deleteButton}
//                           activeOpacity={0.7}
//                           onPress={event => {
//                             event.stopPropagation();
//                             handleDeleteSupplier(supplier);
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
//           {filteredSuppliers.length > 0 && (
//             <View style={styles.paginationContainer}>
//               <Text style={styles.paginationInfo}>
//                 Showing{' '}
//                 {(currentPage - 1) * SUPPLIERS_PER_PAGE + 1} -{' '}
//                 {Math.min(
//                   currentPage * SUPPLIERS_PER_PAGE,
//                   filteredSuppliers.length,
//                 )}{' '}
//                 of {filteredSuppliers.length}
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
//         animationType="slide"
//         transparent={true}
//         onRequestClose={closeModal}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContainer}>
//             {/* MODAL HEADER */}
//             <View style={styles.modalHeader}>
//               <View>
//                 <Text style={styles.modalTitle}>
//                   {editingSupplierId ? 'Edit Supplier' : 'Add Supplier'}
//                 </Text>
//                 <Text style={styles.modalSubtitle}>
//                   {editingSupplierId
//                     ? 'Update supplier information'
//                     : 'Enter supplier information'}
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
//               {/* SECTION: SUPPLIER DETAILS */}
//               <Text style={styles.sectionHeaderTitle}>Supplier Details</Text>

//               {/* SUPPLIER NAME */}
//               <Text style={styles.inputLabel}>Supplier Name *</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter supplier name"
//                 placeholderTextColor="#94a3b8"
//                 value={name}
//                 onChangeText={setName}
//               />

//               {/* PHONE + EMAIL */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>Phone *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="phone-pad"
//                     value={phone}
//                     onChangeText={setPhone}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>Email</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter email"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     value={email}
//                     onChangeText={setEmail}
//                   />
//                 </View>
//               </View>

//               {/* ADDRESS */}
//               <Text style={styles.inputLabel}>Address</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter address"
//                 placeholderTextColor="#94a3b8"
//                 value={address}
//                 onChangeText={setAddress}
//               />

//               {/* CITY + STATE */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>City</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter city"
//                     placeholderTextColor="#94a3b8"
//                     value={city}
//                     onChangeText={setCity}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>State</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter state"
//                     placeholderTextColor="#94a3b8"
//                     value={state}
//                     onChangeText={setState}
//                   />
//                 </View>
//               </View>

//               {/* PINCODE + OPENING BALANCE */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>Pincode</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter pincode"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="numeric"
//                     value={pincode}
//                     onChangeText={setPincode}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>Opening Balance (₹)</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="0.00"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="decimal-pad"
//                     value={openingBalance}
//                     onChangeText={setOpeningBalance}
//                   />
//                 </View>
//               </View>

//               {/* ASK FOR GSTIN TOGGLE */}
//               <Text style={styles.inputLabel}>Ask for GSTIN? *</Text>
//               <View style={styles.gstToggleContainer}>
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   style={[
//                     styles.gstToggleButton,
//                     hasGstin && styles.gstToggleButtonActive,
//                   ]}
//                   onPress={() => setHasGstin(true)}>
//                   <Text
//                     style={[
//                       styles.gstToggleText,
//                       hasGstin && styles.gstToggleTextActive,
//                     ]}>
//                     Yes
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   style={[
//                     styles.gstToggleButton,
//                     !hasGstin && styles.gstToggleButtonActive,
//                   ]}
//                   onPress={() => {
//                     setHasGstin(false);
//                     setGstin('');
//                   }}>
//                   <Text
//                     style={[
//                       styles.gstToggleText,
//                       !hasGstin && styles.gstToggleTextActive,
//                     ]}>
//                     No
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* GSTIN (CONDITIONAL) */}
//               {hasGstin && (
//                 <View style={styles.gstinFieldBox}>
//                   <Text style={styles.inputLabel}>GSTIN *</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter 15-digit GSTIN"
//                     placeholderTextColor="#94a3b8"
//                     autoCapitalize="characters"
//                     value={gstin}
//                     onChangeText={setGstin}
//                   />
//                 </View>
//               )}

//               {/* SECTION: BANK DETAILS */}
//               <Text style={[styles.sectionHeaderTitle, {marginTop: 18}]}>
//                 Bank Details
//               </Text>

//               {/* BANK NAME */}
//               <Text style={styles.inputLabel}>Bank Name</Text>
//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter bank name"
//                 placeholderTextColor="#94a3b8"
//                 value={bankName}
//                 onChangeText={setBankName}
//               />

//               {/* ACCOUNT NUMBER + IFSC */}
//               <View style={styles.rowTwo}>
//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>Account Number</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter account number"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="numeric"
//                     value={accountNumber}
//                     onChangeText={setAccountNumber}
//                   />
//                 </View>

//                 <View style={styles.colHalf}>
//                   <Text style={styles.inputLabel}>IFSC Code</Text>
//                   <TextInput
//                     style={styles.input}
//                     placeholder="Enter IFSC code"
//                     placeholderTextColor="#94a3b8"
//                     autoCapitalize="characters"
//                     value={ifscCode}
//                     onChangeText={setIfscCode}
//                   />
//                 </View>
//               </View>

//               <View style={styles.bottomSpace} />
//             </ScrollView>

//             {/* FOOTER */}
//             <View style={styles.modalFooter}>
//               <TouchableOpacity style={styles.cancelButton} onPress={closeModal}>
//                 <Text style={styles.cancelButtonText}>Cancel</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={styles.saveButton}
//                 onPress={handleSaveSupplier}>
//                 <Text style={styles.saveButtonText}>
//                   {editingSupplierId ? 'Update Supplier' : 'Save Supplier'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// export default SupplierMasterScreen;

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

//   // ADD SUPPLIER BUTTON
//   addSupplierButton: {
//     height: 38,
//     paddingHorizontal: 14,
//     backgroundColor: '#4338ca',
//     borderRadius: 7,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   addSupplierPlus: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '500',
//     lineHeight: 21,
//     marginRight: 6,
//   },

//   addSupplierButtonText: {
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
//     minWidth: 1420,
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

//   supplierName: {
//     fontSize: 11,
//     fontWeight: '600',
//     color: '#1e293b',
//   },

//   boldText: {
//     fontWeight: '700',
//     color: '#0f172a',
//   },

//   balanceText: {
//     color: '#15803d',
//     fontWeight: '700',
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
//     width: 160,
//   },

//   colPhone: {
//     width: 110,
//   },

//   colEmail: {
//     width: 155,
//   },

//   colAddress: {
//     width: 170,
//   },

//   colCity: {
//     width: 100,
//   },

//   colState: {
//     width: 105,
//   },

//   colPincode: {
//     width: 80,
//   },

//   colGstin: {
//     width: 140,
//   },

//   colBalance: {
//     width: 115,
//   },

//   colBank: {
//     width: 130,
//   },

//   colAccount: {
//     width: 130,
//   },

//   colIfsc: {
//     width: 110,
//   },

//   colAction: {
//     width: 88,
//   },

//   // EMPTY
//   emptyContainer: {
//     width: 1200,
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
//     maxHeight: '88%',
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

//   sectionHeaderTitle: {
//     fontSize: 13,
//     fontWeight: '700',
//     color: '#4338ca',
//     textTransform: 'uppercase',
//     letterSpacing: 0.5,
//     marginTop: 10,
//     marginBottom: 4,
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

//   // GST Toggle
//   gstToggleContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 4,
//     marginBottom: 4,
//   },

//   gstToggleButton: {
//     width: '48.5%',
//     height: 40,
//     borderRadius: 8,
//     borderWidth: 1.5,
//     borderColor: '#cbd5e1',
//     backgroundColor: '#f8fafc',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   gstToggleButtonActive: {
//     borderColor: '#4338ca',
//     backgroundColor: '#eef2ff',
//   },

//   gstToggleText: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#64748b',
//   },

//   gstToggleTextActive: {
//     color: '#4338ca',
//     fontWeight: '700',
//   },

//   gstinFieldBox: {
//     marginTop: 2,
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
} from 'react-native';
import {downloadSuppliers} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface Supplier {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  hasGstin: boolean;
  gstin: string;
  openingBalance: number;
}

const DEFAULT_SUPPLIERS: Supplier[] = [
  {
    id: '1',
    name: 'Omkar Traders',
    phone: '9822114455',
    email: 'omkar.traders@gmail.com',
    address: 'Plot 12, Market Yard, Gultekdi',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411037',
    hasGstin: true,
    gstin: '27AABCO1234F1Z5',
    openingBalance: 45000,
  },
  {
    id: '2',
    name: 'Rajeshwari Enterprises',
    phone: '9820011223',
    email: 'sales@rajeshwarient.com',
    address: 'Gala 8, MIDC Industrial Area, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400093',
    hasGstin: true,
    gstin: '27AABCR5678G1Z2',
    openingBalance: 68000,
  },
  {
    id: '3',
    name: 'Vardhman Textiles',
    phone: '9825123456',
    email: 'vardhman.textiles@yahoo.com',
    address: 'Ring Road Textile Market, Shop 104',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395002',
    hasGstin: true,
    gstin: '24AAACV1234L1Z9',
    openingBalance: 92000,
  },
  {
    id: '4',
    name: 'Balaji Hardware & Tools',
    phone: '9845012399',
    email: 'balajihardware@gmail.com',
    address: '56 SP Road, Kalasipalyam',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560002',
    hasGstin: false,
    gstin: '',
    openingBalance: 12000,
  },
  {
    id: '5',
    name: 'Metro Electronics & Electricals',
    phone: '9811098765',
    email: 'contact@metroelec.in',
    address: '204 Bhagirath Palace, Chandni Chowk',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '110006',
    hasGstin: true,
    gstin: '07AACCM5678P1ZQ',
    openingBalance: 115000,
  },
  {
    id: '6',
    name: 'Sri Krishna Agro Supplies',
    phone: '9764512345',
    email: 'krishna.agro@rediffmail.com',
    address: 'Grain Market Road, Cotton Market',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440018',
    hasGstin: false,
    gstin: '',
    openingBalance: 8500,
  },
  {
    id: '7',
    name: 'Gupta Paper & Packaging',
    phone: '9712034567',
    email: 'guptapaperjaipur@gmail.com',
    address: 'Industrial Area, VKIA Road 9',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302013',
    hasGstin: true,
    gstin: '08AAACG4321K1Z3',
    openingBalance: 34000,
  },
  {
    id: '8',
    name: 'Apex Chemical Industries',
    phone: '9879012345',
    email: 'orders@apexchemicals.co.in',
    address: 'Phase 4, GIDC Vatva',
    city: 'Ahmedabad',
    state: 'Gujarat',
    pincode: '382445',
    hasGstin: true,
    gstin: '24AAACA9876D1Z7',
    openingBalance: 76000,
  },
  {
    id: '9',
    name: 'Royal Steel Corporation',
    phone: '9831098765',
    email: 'royalsteelkol@gmail.com',
    address: '22 Brabourne Road, 3rd Floor',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700001',
    hasGstin: true,
    gstin: '19AAACR1234M1Z4',
    openingBalance: 145000,
  },
  {
    id: '10',
    name: 'Lakshmi Silk Mills',
    phone: '9415012345',
    email: 'lakshmisilk@yahoo.co.in',
    address: 'Chowk, Near Vishwanath Gali',
    city: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    hasGstin: false,
    gstin: '',
    openingBalance: 18000,
  },
  {
    id: '11',
    name: 'Sunrise Auto Parts',
    phone: '9815012345',
    email: 'sunriseauto.ldh@gmail.com',
    address: 'Focal Point, Phase 5',
    city: 'Ludhiana',
    state: 'Punjab',
    pincode: '141010',
    hasGstin: true,
    gstin: '03AAACS5678J1Z1',
    openingBalance: 53000,
  },
  {
    id: '12',
    name: 'Deccan Plastics Ltd',
    phone: '9848012345',
    email: 'info@deccanplastics.in',
    address: 'Cherlapally IDA, Phase II',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500051',
    hasGstin: true,
    gstin: '36AAACD1234N1Z8',
    openingBalance: 61000,
  },
  {
    id: '13',
    name: 'Premier Timber Mart',
    phone: '9840012345',
    email: 'premiertimber@gmail.com',
    address: 'Sydenhams Road, Periamet',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600003',
    hasGstin: false,
    gstin: '',
    openingBalance: 22000,
  },
  {
    id: '14',
    name: 'Malabar Spices Wholesale',
    phone: '9446012345',
    email: 'malabarspices@gmail.com',
    address: 'Jew Town, Mattancherry',
    city: 'Kochi',
    state: 'Kerala',
    pincode: '682002',
    hasGstin: true,
    gstin: '32AAACM4321E1Z6',
    openingBalance: 39000,
  },
];

const SupplierMasterScreen = ({navigation, route}: Props) => {
  const [suppliers, setSuppliers] =
    useState<Supplier[]>(DEFAULT_SUPPLIERS);

  const [searchQuery, setSearchQuery] = useState('');

  const SUPPLIERS_PER_PAGE = 10;

  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplierId, setEditingSupplierId] =
    useState<string | null>(null);

  // Supplier Details Form
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [hasGstin, setHasGstin] = useState<boolean>(false);
  const [gstin, setGstin] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  // Handle route params
  useEffect(() => {
    if (route?.params?.openAddModal) {
      openAddSupplierModal();
    }
  }, [route?.params?.openAddModal]);

  // RESET FORM
  const resetForm = () => {
    setName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setHasGstin(false);
    setGstin('');
    setOpeningBalance('');
    setEditingSupplierId(null);
  };

  // ADD SUPPLIER
  const openAddSupplierModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // EDIT SUPPLIER
  const openEditSupplierModal = (supplier: Supplier) => {
    setEditingSupplierId(supplier.id);

    setName(supplier.name || '');
    setPhone(supplier.phone || '');
    setEmail(supplier.email || '');
    setAddress(supplier.address || '');
    setCity(supplier.city || '');
    setState(supplier.state || '');
    setPincode(supplier.pincode || '');
    setHasGstin(supplier.hasGstin);
    setGstin(supplier.hasGstin ? supplier.gstin : '');
    setOpeningBalance(
      supplier.openingBalance !== undefined
        ? String(supplier.openingBalance)
        : '',
    );

    setModalVisible(true);
  };

  // CLOSE MODAL
  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // SAVE SUPPLIER
  const handleSaveSupplier = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Supplier Name is required');
      return;
    }

    if (!phone.trim()) {
      Alert.alert('Validation Error', 'Phone Number is required');
      return;
    }

    if (hasGstin && !gstin.trim()) {
      Alert.alert(
        'Validation Error',
        'Please enter the GSTIN number or select "No"',
      );
      return;
    }

    const supplierData: Supplier = {
      id: editingSupplierId || Date.now().toString(),
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      hasGstin: hasGstin,
      gstin: hasGstin ? gstin.trim().toUpperCase() : '',
      openingBalance: parseFloat(openingBalance) || 0,
    };

    if (editingSupplierId) {
      setSuppliers(prev =>
        prev.map(s =>
          s.id === editingSupplierId ? supplierData : s,
        ),
      );

      Alert.alert(
        'Success',
        `Supplier "${supplierData.name}" updated successfully!`,
      );
    } else {
      setSuppliers(prev => [supplierData, ...prev]);
      setCurrentPage(1);

      Alert.alert(
        'Success',
        `Supplier "${supplierData.name}" added successfully!`,
      );

      if (route?.params?.returnTo) {
        closeModal();

        navigation.navigate(route.params.returnTo, {
          newSupplier: supplierData,
        });

        return;
      }
    }

    closeModal();
  };

  // DELETE
  const handleDeleteSupplier = (supplier: Supplier) => {
    Alert.alert(
      'Delete Supplier',
      `Are you sure you want to delete "${supplier.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setSuppliers(prev =>
              prev.filter(s => s.id !== supplier.id),
            );
          },
        },
      ],
    );
  };

  // DOWNLOAD LIST
  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredSuppliers.length > 0
        ? filteredSuppliers
        : suppliers;

    downloadSuppliers(targetList, format);
  };

  // SEARCH
  const filteredSuppliers = suppliers.filter(supplier => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      supplier.name.toLowerCase().includes(query) ||
      supplier.phone.includes(query) ||
      supplier.email.toLowerCase().includes(query) ||
      supplier.city.toLowerCase().includes(query) ||
      supplier.state.toLowerCase().includes(query) ||
      supplier.gstin.toLowerCase().includes(query)
    );
  });

  // PAGINATION
  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSuppliers.length / SUPPLIERS_PER_PAGE,
    ),
  );

  const paginatedSuppliers = filteredSuppliers.slice(
    (currentPage - 1) * SUPPLIERS_PER_PAGE,
    currentPage * SUPPLIERS_PER_PAGE,
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
            Supplier Directory
          </Text>

          <Text style={styles.headerSubtitle}>
            Manage all suppliers
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        {/* SEARCH ROW */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search supplier name, phone or city"
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
              Supplier Directory
            </Text>

            <Text style={styles.totalText}>
              Total Suppliers: {suppliers.length}
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
                  Supplier Name
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colPhone,
                  ]}>
                  Phone
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colEmail,
                  ]}>
                  Email
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colAddress,
                  ]}>
                  Address
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colCity,
                  ]}>
                  City
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colState,
                  ]}>
                  State
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colPincode,
                  ]}>
                  Pincode
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colGstin,
                  ]}>
                  GSTIN
                </Text>

                <Text
                  style={[
                    styles.headerCell,
                    styles.colBalance,
                  ]}>
                  Opening Balance
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

                {filteredSuppliers.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {suppliers.length === 0
                        ? 'No suppliers added yet.'
                        : 'No suppliers found.'}
                    </Text>

                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={openAddSupplierModal}>
                      <Text style={styles.emptyAddBtnText}>
                        + Add Supplier
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  paginatedSuppliers.map(
                    (supplier, index) => (
                      <TouchableOpacity
                        key={supplier.id}
                        activeOpacity={0.7}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 &&
                            styles.tableRowAlternate,
                        ]}
                        onPress={() =>
                          openEditSupplierModal(supplier)
                        }>

                        {/* NUMBER */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colNumber,
                          ]}>
                          {(currentPage - 1) *
                            SUPPLIERS_PER_PAGE +
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
                            style={styles.supplierName}
                            numberOfLines={1}>
                            {supplier.name}
                          </Text>
                        </View>

                        {/* PHONE */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPhone,
                          ]}
                          numberOfLines={1}>
                          {supplier.phone || '-'}
                        </Text>

                        {/* EMAIL */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colEmail,
                          ]}
                          numberOfLines={1}>
                          {supplier.email || '-'}
                        </Text>

                        {/* ADDRESS */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colAddress,
                          ]}
                          numberOfLines={1}>
                          {supplier.address || '-'}
                        </Text>

                        {/* CITY */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colCity,
                          ]}
                          numberOfLines={1}>
                          {supplier.city || '-'}
                        </Text>

                        {/* STATE */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colState,
                          ]}
                          numberOfLines={1}>
                          {supplier.state || '-'}
                        </Text>

                        {/* PINCODE */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPincode,
                          ]}
                          numberOfLines={1}>
                          {supplier.pincode || '-'}
                        </Text>

                        {/* GSTIN */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colGstin,
                            supplier.hasGstin &&
                            supplier.gstin
                              ? styles.boldText
                              : null,
                          ]}
                          numberOfLines={1}>
                          {supplier.hasGstin &&
                          supplier.gstin
                            ? supplier.gstin
                            : '-'}
                        </Text>

                        {/* OPENING BALANCE */}
                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colBalance,
                            styles.balanceText,
                          ]}>
                          ₹{' '}
                          {Number(
                            supplier.openingBalance || 0,
                          ).toFixed(2)}
                        </Text>

                        {/* ACTION */}
                        <View
                          style={[
                            styles.actionCell,
                            styles.colAction,
                          ]}>
                          <TouchableOpacity
                            style={styles.editButton}
                            activeOpacity={0.7}
                            onPress={event => {
                              event.stopPropagation();
                              openEditSupplierModal(
                                supplier,
                              );
                            }}>
                            <Text
                              style={styles.editIcon}>
                              ✎
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                            onPress={event => {
                              event.stopPropagation();
                              handleDeleteSupplier(
                                supplier,
                              );
                            }}>
                            <View
                              style={styles.binIcon}>
                              <View
                                style={styles.binLid}>
                                <View
                                  style={
                                    styles.binHandle
                                  }
                                />
                              </View>

                              <View
                                style={styles.binBody}>
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

          {/* + BUTTON - BELOW TABLE, ABOVE PAGINATION */}
          {filteredSuppliers.length > 0 && (
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity
                style={styles.bottomAddButton}
                activeOpacity={0.8}
                onPress={openAddSupplierModal}>
                <Text style={styles.bottomAddPlus}>
                  +
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PAGINATION */}
          {filteredSuppliers.length > 0 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationInfo}>
                Showing{' '}
                {(currentPage - 1) *
                  SUPPLIERS_PER_PAGE +
                  1}{' '}
                -{' '}
                {Math.min(
                  currentPage * SUPPLIERS_PER_PAGE,
                  filteredSuppliers.length,
                )}{' '}
                of {filteredSuppliers.length}
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
                  {editingSupplierId
                    ? 'Edit Supplier'
                    : 'Add Supplier'}
                </Text>

                <Text style={styles.modalSubtitle}>
                  {editingSupplierId
                    ? 'Update supplier information'
                    : 'Enter supplier information'}
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

              <Text style={styles.sectionHeaderTitle}>
                Supplier Details
              </Text>

              <Text style={styles.inputLabel}>
                Supplier Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter supplier name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Phone *
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter phone number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Email
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter email"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>
                Address
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#94a3b8"
                value={address}
                onChangeText={setAddress}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    City
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    placeholderTextColor="#94a3b8"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    State
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter state"
                    placeholderTextColor="#94a3b8"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Pincode
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter pincode"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={pincode}
                    onChangeText={setPincode}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Opening Balance (₹)
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="0.00"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={openingBalance}
                    onChangeText={setOpeningBalance}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>
                Ask for GSTIN? *
              </Text>

              <View style={styles.gstToggleContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.gstToggleButton,
                    hasGstin &&
                      styles.gstToggleButtonActive,
                  ]}
                  onPress={() => setHasGstin(true)}>
                  <Text
                    style={[
                      styles.gstToggleText,
                      hasGstin &&
                        styles.gstToggleTextActive,
                    ]}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.gstToggleButton,
                    !hasGstin &&
                      styles.gstToggleButtonActive,
                  ]}
                  onPress={() => {
                    setHasGstin(false);
                    setGstin('');
                  }}>
                  <Text
                    style={[
                      styles.gstToggleText,
                      !hasGstin &&
                        styles.gstToggleTextActive,
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>

              {hasGstin && (
                <View style={styles.gstinFieldBox}>
                  <Text style={styles.inputLabel}>
                    GSTIN *
                  </Text>

                  <TextInput
                    style={styles.input}
                    placeholder="Enter 15-digit GSTIN"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="characters"
                    value={gstin}
                    onChangeText={setGstin}
                  />
                </View>
              )}

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
                onPress={handleSaveSupplier}>
                <Text style={styles.saveButtonText}>
                  {editingSupplierId
                    ? 'Update Supplier'
                    : 'Save Supplier'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SupplierMasterScreen;

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

  // FILE ICON
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

  supplierName: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
  },

  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },

  balanceText: {
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
    width: 160,
  },

  colPhone: {
    width: 110,
  },

  colEmail: {
    width: 155,
  },

  colAddress: {
    width: 170,
  },

  colCity: {
    width: 100,
  },

  colState: {
    width: 105,
  },

  colPincode: {
    width: 80,
  },

  colGstin: {
    width: 140,
  },

  colBalance: {
    width: 115,
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

  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338ca',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 10,
    marginBottom: 4,
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

  // GST Toggle
  gstToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    marginBottom: 4,
  },

  gstToggleButton: {
    width: '48.5%',
    height: 40,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gstToggleButtonActive: {
    borderColor: '#4338ca',
    backgroundColor: '#eef2ff',
  },

  gstToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  gstToggleTextActive: {
    color: '#4338ca',
    fontWeight: '700',
  },

  gstinFieldBox: {
    marginTop: 2,
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
