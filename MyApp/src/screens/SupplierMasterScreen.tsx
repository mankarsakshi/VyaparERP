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
//   ActivityIndicator,
// } from 'react-native';
// import {API_BASE_URL} from '../api/config';

// type Props = {
//   navigation: any;
//   route: any;
// };

// interface Supplier {
//   id: string | number;
//   name: string;
//   mobile: string;
//   email: string;
//   address?: string;
//   city?: string;
//   state?: string;
//   pincode?: string;
//   gstin?: string;
//   status?: string;
//   currentPayable?: number;
//   openingBalance?: number;
// }

// const SupplierMasterScreen = ({navigation, route}: Props) => {
//   // =========================================================
//   // STATES
//   // =========================================================

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const [editingSupplierId, setEditingSupplierId] =
//     useState<string | number | null>(null);

//   const [name, setName] = useState('');
//   const [mobile, setMobile] = useState('');
//   const [email, setEmail] = useState('');
//   const [address, setAddress] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [pincode, setPincode] = useState('');
//   const [hasGst, setHasGst] = useState<boolean>(false);
//   const [gstin, setGstin] = useState('');
//   const [openingBalance, setOpeningBalance] = useState('');

//   // =========================================================
//   // LOAD SUPPLIERS
//   // =========================================================

//   useEffect(() => {
//     loadSuppliers();
//     if (route?.params?.openAddModal) {
//       openAddSupplier();
//     }
//   }, [route?.params?.openAddModal]);

//   const loadSuppliers = async () => {
//     try {
//       setLoading(true);

//       const response = await fetch(
//         `${API_BASE_URL}/api/suppliers`,
//       );

//       if (!response.ok) {
//         throw new Error(
//           `Server returned ${response.status}`,
//         );
//       }

//       const result = await response.json();

//       console.log('Supplier API response:', result);

//       let supplierData: any[] = [];

//       if (Array.isArray(result)) {
//         supplierData = result;
//       } else if (Array.isArray(result?.data)) {
//         supplierData = result.data;
//       } else if (Array.isArray(result?.suppliers)) {
//         supplierData = result.suppliers;
//       }

//       const formattedSuppliers: Supplier[] =
//         supplierData.map(item => ({
//           id:
//             item.id ??
//             item.supplier_id ??
//             item.supplierId,

//           name:
//             item.name ??
//             item.supplier_name ??
//             item.supplierName ??
//             '',

//           mobile:
//             item.mobile ??
//             item.phone ??
//             item.phone_number ??
//             '',

//           email: item.email ?? '',

//           address: item.address ?? '',

//           city: item.city ?? '',

//           state: item.state ?? '',

//           pincode: item.pincode ?? '',

//           gstin: item.gstin ?? '',

//           status: item.status ?? 'active',

//           currentPayable:
//             Number(
//               item.currentPayable ??
//                 item.current_payable ??
//                 item.payable ??
//                 0,
//             ) || 0,

//           openingBalance:
//             Number(
//               item.openingBalance ??
//                 item.opening_balance ??
//                 0,
//             ) || 0,
//         }));

//       setSuppliers(formattedSuppliers);
//     } catch (error) {
//       console.error(
//         'Load suppliers error:',
//         error,
//       );

//       Alert.alert(
//         'Connection Error',
//         'Unable to fetch suppliers from the server. Please make sure your backend is running.',
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================================================
//   // RESET FORM
//   // =========================================================

//   const resetForm = () => {
//     setName('');
//     setMobile('');
//     setEmail('');
//     setAddress('');
//     setCity('');
//     setState('');
//     setPincode('');
//     setHasGst(false);
//     setGstin('');
//     setOpeningBalance('');
//     setEditingSupplierId(null);
//   };

//   // =========================================================
//   // OPEN ADD SUPPLIER
//   // =========================================================

//   const openAddSupplier = () => {
//     resetForm();
//     setModalVisible(true);
//   };

//   // =========================================================
//   // SAVE / UPDATE SUPPLIER
//   // =========================================================

//   const handleSaveSupplier = async () => {
//     if (!name.trim() || !mobile.trim()) {
//       Alert.alert(
//         'Validation Error',
//         'Supplier Name and Phone are required.',
//       );
//       return;
//     }

//     const openingAmount =
//       parseFloat(openingBalance) || 0;

//     const finalGstin = hasGst ? gstin.trim() : '';

//     const supplierData = {
//       supplier_name: name.trim(),
//       name: name.trim(),

//       phone: mobile.trim(),
//       mobile: mobile.trim(),

//       email: email.trim(),

//       address: address.trim(),
//       city: city.trim(),
//       state: state.trim(),
//       pincode: pincode.trim(),

//       gstin: finalGstin,

//       status: 'active',

//       current_payable: 0,
//       currentPayable: 0,

//       opening_balance: openingAmount,
//       openingBalance: openingAmount,
//     };

//     try {
//       const isEditing =
//         editingSupplierId !== null;

//       const url = isEditing
//         ? `${API_BASE_URL}/api/suppliers/${editingSupplierId}`
//         : `${API_BASE_URL}/api/suppliers`;

//       const response = await fetch(url, {
//         method: isEditing ? 'PUT' : 'POST',

//         headers: {
//           'Content-Type': 'application/json',
//         },

//         body: JSON.stringify(supplierData),
//       });

//       const result = await response.json();

//       console.log(
//         'Supplier save response:',
//         result,
//       );

//       if (!response.ok) {
//         throw new Error(
//           result?.message ||
//             `Server returned ${response.status}`,
//         );
//       }

//       if (isEditing) {
//         const updatedSupplier: Supplier = {
//           id: editingSupplierId,

//           name: name.trim(),
//           mobile: mobile.trim(),
//           email: email.trim(),

//           address: address.trim(),
//           city: city.trim(),
//           state: state.trim(),
//           pincode: pincode.trim(),

//           gstin: finalGstin,

//           status: 'active',

//           currentPayable: 0,

//           openingBalance: openingAmount,
//         };

//         setSuppliers(prev =>
//           prev.map(item =>
//             item.id === editingSupplierId
//               ? updatedSupplier
//               : item,
//           ),
//         );

//         Alert.alert(
//           'Success',
//           'Supplier updated successfully.',
//         );
//       } else {
//         const serverSupplier =
//           result?.data ??
//           result?.supplier ??
//           result;

//         const createdSupplier: Supplier = {
//           id:
//             serverSupplier?.id ??
//             serverSupplier?.supplier_id ??
//             Date.now().toString(),

//           name: name.trim(),
//           mobile: mobile.trim(),
//           email: email.trim(),

//           address: address.trim(),
//           city: city.trim(),
//           state: state.trim(),
//           pincode: pincode.trim(),

//           gstin: finalGstin,

//           status: 'active',

//           currentPayable: 0,

//           openingBalance: openingAmount,
//         };

//         setSuppliers(prev => [
//           createdSupplier,
//           ...prev,
//         ]);

//         Alert.alert(
//           'Success',
//           'Supplier added successfully.',
//           [
//             {
//               text: 'OK',
//               onPress: () => {
//                 if (route?.params?.returnTo) {
//                   navigation.navigate(route.params.returnTo, {
//                     newSupplier: createdSupplier,
//                   });
//                 }
//               },
//             },
//           ],
//         );
//       }

//       resetForm();
//       setModalVisible(false);
//     } catch (error) {
//       console.error(
//         'Save supplier error:',
//         error,
//       );

//       Alert.alert(
//         'Error',
//         editingSupplierId !== null
//           ? 'Unable to update supplier. Please check your backend.'
//           : 'Unable to add supplier. Please check your backend connection.',
//       );
//     }
//   };

//   // =========================================================
//   // EDIT SUPPLIER
//   // =========================================================

//   const handleEditSupplier = (
//     supplier: Supplier,
//   ) => {
//     setEditingSupplierId(supplier.id);

//     setName(supplier.name || '');
//     setMobile(supplier.mobile || '');
//     setEmail(supplier.email || '');

//     setAddress(supplier.address || '');
//     setCity(supplier.city || '');
//     setState(supplier.state || '');
//     setPincode(supplier.pincode || '');

//     const hasExistingGst = Boolean(
//       supplier.gstin &&
//       supplier.gstin.trim() !== '' &&
//       supplier.gstin.toLowerCase() !== 'unregistered' &&
//       supplier.gstin !== '-',
//     );
//     setHasGst(hasExistingGst);
//     setGstin(hasExistingGst ? (supplier.gstin || '') : '');

//     setOpeningBalance(
//       supplier.openingBalance !== undefined
//         ? String(supplier.openingBalance)
//         : '',
//     );

//     setModalVisible(true);
//   };

//   // =========================================================
//   // DELETE SUPPLIER
//   // =========================================================

//   const handleDeleteSupplier = (
//     supplier: Supplier,
//   ) => {
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

//           onPress: async () => {
//             try {
//               const response =
//                 await fetch(
//                   `${API_BASE_URL}/api/suppliers/${supplier.id}`,
//                   {
//                     method: 'DELETE',
//                   },
//                 );

//               const result =
//                 await response.json();

//               console.log(
//                 'Delete supplier response:',
//                 result,
//               );

//               if (!response.ok) {
//                 throw new Error(
//                   result?.message ||
//                     `Server returned ${response.status}`,
//                 );
//               }

//               setSuppliers(prev =>
//                 prev.filter(
//                   item =>
//                     item.id !== supplier.id,
//                 ),
//               );

//               Alert.alert(
//                 'Success',
//                 'Supplier deleted successfully.',
//               );
//             } catch (error) {
//               console.error(
//                 'Delete supplier error:',
//                 error,
//               );

//               Alert.alert(
//                 'Error',
//                 'Unable to delete supplier. Please check your backend.',
//               );
//             }
//           },
//         },
//       ],
//     );
//   };

//   // =========================================================
//   // SEARCH
//   // =========================================================

//   const filteredSuppliers =
//     suppliers.filter(supplier => {
//       const query =
//         searchQuery
//           .toLowerCase()
//           .trim();

//       if (!query) {
//         return true;
//       }

//       return (
//         supplier.name
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.mobile
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.email
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.address
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.city
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.state
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.pincode
//           ?.toLowerCase()
//           .includes(query) ||

//         supplier.gstin
//           ?.toLowerCase()
//           .includes(query)
//       );
//     });

//   // =========================================================
//   // TABLE ROW
//   // =========================================================

//   const renderSupplierRow = (
//     supplier: Supplier,
//     index: number,
//   ) => {
//     return (
//       <View
//         key={String(supplier.id)}
//         style={[
//           styles.tableRow,
//           index % 2 === 0 &&
//             styles.tableRowAlternate,
//         ]}
//       >
//         {/* SUPPLIER NAME */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.nameCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.name || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* PHONE */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.mobileCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.mobile || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* EMAIL */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.emailCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.email || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* ADDRESS */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.addressCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.address || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* CITY */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.cityCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.city || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* STATE */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.stateCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.state || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* PINCODE */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.pincodeCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.pincode || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* GSTIN */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.gstinCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text style={styles.tableCell}>
//             {supplier.gstin || '-'}
//           </Text>
//         </TouchableOpacity>

//         {/* OPENING BALANCE */}
//         <TouchableOpacity
//           activeOpacity={0.7}
//           onPress={() =>
//             handleEditSupplier(supplier)
//           }
//           style={[
//             styles.openingBalanceCell,
//             styles.clickableCell,
//           ]}
//         >
//           <Text
//             style={[
//               styles.tableCell,
//               styles.rightText,
//             ]}
//           >
//             ₹
//             {Number(
//               supplier.openingBalance ?? 0,
//             ).toFixed(2)}
//           </Text>
//         </TouchableOpacity>

//         {/* DELETE */}
//         <View style={styles.actionCell}>
//           <TouchableOpacity
//             style={styles.deleteButton}
//             onPress={() =>
//               handleDeleteSupplier(supplier)
//             }
//           >
//             <Text style={styles.deleteIcon}>
//               Delete
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   // =========================================================
//   // UI
//   // =========================================================

//   return (
//     <SafeAreaView style={styles.container}>

//       {/* HEADER */}
//       <View style={styles.header}>

//         <TouchableOpacity
//           style={styles.backButton}
//           onPress={() =>
//             navigation.goBack()
//           }
//         >
//           <Text style={styles.backButtonText}>
//             Back
//           </Text>
//         </TouchableOpacity>

//         <View
//           style={
//             styles.headerTitleContainer
//           }
//         >
//           <Text style={styles.headerTitle}>
//             Supplier Directory
//           </Text>

//           <Text
//             style={
//               styles.headerSubtitle
//             }
//           >
//             Manage all suppliers
//           </Text>
//         </View>
//       </View>

//       {/* LOADING */}
//       {loading ? (
//         <View
//           style={
//             styles.loadingContainer
//           }
//         >
//           <ActivityIndicator
//             size="large"
//             color="#4338ca"
//           />

//           <Text
//             style={
//               styles.loadingText
//             }
//           >
//             Loading suppliers...
//           </Text>
//         </View>
//       ) : (
//         <ScrollView
//           style={styles.mainScroll}
//           contentContainerStyle={
//             styles.mainContent
//           }
//           keyboardShouldPersistTaps="handled"
//         >

//           {/* SEARCH */}
//           <View
//             style={
//               styles.searchContainer
//             }
//           >
//             <TextInput
//               style={styles.searchInput}
//               placeholder="Search supplier name, phone, email, city or GSTIN"
//               placeholderTextColor="#94a3b8"
//               value={searchQuery}
//               onChangeText={
//                 setSearchQuery
//               }
//             />
//           </View>

//           {/* SUMMARY */}
//           <View
//             style={
//               styles.summaryHeader
//             }
//           >
//             <View>
//               <Text
//                 style={
//                   styles.directoryTitle
//                 }
//               >
//                 Supplier Directory
//               </Text>

//               <Text
//                 style={
//                   styles.directoryCount
//                 }
//               >
//                 Total Suppliers:{' '}
//                 {filteredSuppliers.length}
//               </Text>
//             </View>

//             <TouchableOpacity
//               style={
//                 styles.smallAddButton
//               }
//               onPress={
//                 openAddSupplier
//               }
//             >
//               <Text
//                 style={
//                   styles.smallAddButtonText
//                 }
//               >
//                 + Add Supplier
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* EMPTY */}
//           {filteredSuppliers.length ===
//           0 ? (
//             <View
//               style={
//                 styles.emptyContainer
//               }
//             >
//               <Text
//                 style={
//                   styles.emptyTitle
//                 }
//               >
//                 No suppliers found
//               </Text>

//               <Text
//                 style={
//                   styles.emptyText
//                 }
//               >
//                 Click + Add Supplier to
//                 add a supplier.
//               </Text>
//             </View>
//           ) : (
//             <View
//               style={
//                 styles.tableOuterContainer
//               }
//             >
//               <ScrollView
//                 horizontal
//                 showsHorizontalScrollIndicator
//                 nestedScrollEnabled
//               >
//                 <View
//                   style={
//                     styles.tableContainer
//                   }
//                 >

//                   {/* TABLE HEADER */}
//                   <View
//                     style={
//                       styles.tableHeader
//                     }
//                   >
//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.nameCell,
//                       ]}
//                     >
//                       Supplier Name
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.mobileCell,
//                       ]}
//                     >
//                       Phone
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.emailCell,
//                       ]}
//                     >
//                       Email
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.addressCell,
//                       ]}
//                     >
//                       Address
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.cityCell,
//                       ]}
//                     >
//                       City
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.stateCell,
//                       ]}
//                     >
//                       State
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.pincodeCell,
//                       ]}
//                     >
//                       Pincode
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.gstinCell,
//                       ]}
//                     >
//                       GSTIN
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.openingBalanceCell,
//                       ]}
//                     >
//                       Opening Balance
//                     </Text>

//                     <Text
//                       style={[
//                         styles.headerCell,
//                         styles.actionCell,
//                       ]}
//                     >
//                       Action
//                     </Text>
//                   </View>

//                   {/* DATA */}
//                   {filteredSuppliers.map(
//                     (supplier, index) =>
//                       renderSupplierRow(
//                         supplier,
//                         index,
//                       ),
//                   )}
//                 </View>
//               </ScrollView>
//             </View>
//           )}
//         </ScrollView>
//       )}

//       {/* =====================================================
//           ADD / EDIT MODAL
//           ===================================================== */}

//       <Modal
//         visible={modalVisible}
//         animationType="slide"
//         transparent
//         onRequestClose={() => {
//           resetForm();
//           setModalVisible(false);
//         }}
//       >
//         <View
//           style={
//             styles.modalOverlay
//           }
//         >
//           <View
//             style={
//               styles.modalContainer
//             }
//           >

//             {/* MODAL HEADER */}
//             <View
//               style={
//                 styles.modalHeader
//               }
//             >
//               <Text
//                 style={
//                   styles.modalTitle
//                 }
//               >
//                 {editingSupplierId !== null
//                   ? 'Edit Supplier'
//                   : 'Add Supplier'}
//               </Text>

//               <TouchableOpacity
//                 onPress={() => {
//                   resetForm();
//                   setModalVisible(false);
//                 }}
//               >
//                 <Text
//                   style={
//                     styles.closeText
//                   }
//                 >
//                   Close
//                 </Text>
//               </TouchableOpacity>
//             </View>

//             {/* MODAL BODY */}
//             <ScrollView
//               style={styles.modalBody}
//               keyboardShouldPersistTaps="handled"
//             >

//               <Text
//                 style={
//                   styles.formSectionTitle
//                 }
//               >
//                 Supplier Information
//               </Text>

//               {/* NAME */}
//               <Text
//                 style={
//                   styles.inputLabel
//                 }
//               >
//                 Supplier Name *
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter supplier name"
//                 placeholderTextColor="#94a3b8"
//                 value={name}
//                 onChangeText={setName}
//               />

//               {/* PHONE + EMAIL */}
//               <View
//                 style={styles.formRow}
//               >
//                 <View
//                   style={
//                     styles.formColumn
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.inputLabel
//                     }
//                   >
//                     Phone *
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.input
//                     }
//                     placeholder="Enter phone number"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="phone-pad"
//                     value={mobile}
//                     onChangeText={
//                       setMobile
//                     }
//                   />
//                 </View>

//                 <View
//                   style={
//                     styles.formColumn
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.inputLabel
//                     }
//                   >
//                     Email
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.input
//                     }
//                     placeholder="Enter email"
//                     placeholderTextColor="#94a3b8"
//                     keyboardType="email-address"
//                     autoCapitalize="none"
//                     value={email}
//                     onChangeText={
//                       setEmail
//                     }
//                   />
//                 </View>
//               </View>

//               {/* ADDRESS */}
//               <Text
//                 style={
//                   styles.inputLabel
//                 }
//               >
//                 Address
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter address"
//                 placeholderTextColor="#94a3b8"
//                 value={address}
//                 onChangeText={
//                   setAddress
//                 }
//               />

//               {/* CITY + STATE */}
//               <View
//                 style={styles.formRow}
//               >
//                 <View
//                   style={
//                     styles.formColumn
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.inputLabel
//                     }
//                   >
//                     City
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.input
//                     }
//                     placeholder="Enter city"
//                     placeholderTextColor="#94a3b8"
//                     value={city}
//                     onChangeText={
//                       setCity
//                     }
//                   />
//                 </View>

//                 <View
//                   style={
//                     styles.formColumn
//                   }
//                 >
//                   <Text
//                     style={
//                       styles.inputLabel
//                     }
//                   >
//                     State
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.input
//                     }
//                     placeholder="Enter state"
//                     placeholderTextColor="#94a3b8"
//                     value={state}
//                     onChangeText={
//                       setState
//                     }
//                   />
//                 </View>
//               </View>

//               {/* PINCODE */}
//               <Text
//                 style={
//                   styles.inputLabel
//                 }
//               >
//                 Pincode
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter pincode"
//                 placeholderTextColor="#94a3b8"
//                 keyboardType="numeric"
//                 value={pincode}
//                 onChangeText={
//                   setPincode
//                 }
//               />

//               {/* GST INFORMATION */}
//               <Text
//                 style={
//                   styles.formSectionTitle
//                 }
//               >
//                 Tax Information
//               </Text>

//               <Text
//                 style={
//                   styles.inputLabel
//                 }
//               >
//                 Do you have GST? *
//               </Text>

//               {/* YES / NO TOGGLE */}
//               <View style={styles.gstToggleContainer}>
//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   style={[
//                     styles.gstToggleButton,
//                     hasGst && styles.gstToggleButtonActive,
//                   ]}
//                   onPress={() => setHasGst(true)}
//                 >
//                   <Text
//                     style={[
//                       styles.gstToggleText,
//                       hasGst && styles.gstToggleTextActive,
//                     ]}
//                   >
//                     Yes
//                   </Text>
//                 </TouchableOpacity>

//                 <TouchableOpacity
//                   activeOpacity={0.8}
//                   style={[
//                     styles.gstToggleButton,
//                     !hasGst && styles.gstToggleButtonActive,
//                   ]}
//                   onPress={() => {
//                     setHasGst(false);
//                     setGstin('');
//                   }}
//                 >
//                   <Text
//                     style={[
//                       styles.gstToggleText,
//                       !hasGst && styles.gstToggleTextActive,
//                     ]}
//                   >
//                     No
//                   </Text>
//                 </TouchableOpacity>
//               </View>

//               {/* DYNAMIC GSTIN FIELD (OPENED ONLY IF YES) */}
//               {hasGst && (
//                 <View style={styles.gstinFieldBox}>
//                   <Text
//                     style={
//                       styles.inputLabel
//                     }
//                   >
//                     GSTIN *
//                   </Text>

//                   <TextInput
//                     style={
//                       styles.input
//                     }
//                     placeholder="Enter 15-digit GSTIN"
//                     placeholderTextColor="#94a3b8"
//                     autoCapitalize="characters"
//                     value={gstin}
//                     onChangeText={
//                       setGstin
//                     }
//                   />
//                 </View>
//               )}

//               {/* FINANCIAL INFORMATION */}
//               <Text
//                 style={
//                   styles.formSectionTitle
//                 }
//               >
//                 Financial Information
//               </Text>

//               <Text
//                 style={
//                   styles.inputLabel
//                 }
//               >
//                 Opening Balance
//               </Text>

//               <TextInput
//                 style={styles.input}
//                 placeholder="Enter opening balance"
//                 placeholderTextColor="#94a3b8"
//                 keyboardType="decimal-pad"
//                 value={
//                   openingBalance
//                 }
//                 onChangeText={
//                   setOpeningBalance
//                 }
//               />

//               <View
//                 style={{height: 30}}
//               />
//             </ScrollView>

//             {/* FOOTER */}
//             <View
//               style={
//                 styles.modalFooter
//               }
//             >
//               <TouchableOpacity
//                 style={
//                   styles.cancelButton
//                 }
//                 onPress={() => {
//                   resetForm();
//                   setModalVisible(false);
//                 }}
//               >
//                 <Text
//                   style={
//                     styles.cancelButtonText
//                   }
//                 >
//                   Cancel
//                 </Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 style={
//                   styles.saveButton
//                 }
//                 onPress={
//                   handleSaveSupplier
//                 }
//               >
//                 <Text
//                   style={
//                     styles.saveButtonText
//                   }
//                 >
//                   {editingSupplierId !== null
//                     ? 'Update Supplier'
//                     : 'Save Supplier'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// };

// // =========================================================
// // STYLES
// // =========================================================

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },

//   // HEADER
//   header: {
//     backgroundColor: '#4338ca',
//     paddingTop: 42,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

//   backButton: {
//     paddingRight: 14,
//   },

//   backButtonText: {
//     color: '#ffffff',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   headerTitleContainer: {
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

//   // LOADING
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   loadingText: {
//     marginTop: 10,
//     color: '#64748b',
//     fontSize: 14,
//   },

//   // MAIN
//   mainScroll: {
//     flex: 1,
//   },

//   mainContent: {
//     padding: 16,
//     paddingBottom: 40,
//   },

//   searchContainer: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     marginBottom: 16,
//   },

//   searchInput: {
//     height: 44,
//     paddingHorizontal: 12,
//     fontSize: 13,
//     color: '#0f172a',
//   },

//   // SUMMARY
//   summaryHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     marginBottom: 12,
//   },

//   directoryTitle: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#0f172a',
//   },

//   directoryCount: {
//     fontSize: 12,
//     color: '#64748b',
//     marginTop: 3,
//   },

//   smallAddButton: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 12,
//     paddingVertical: 9,
//     borderRadius: 7,
//   },

//   smallAddButtonText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '700',
//   },

//   // TABLE
//   tableOuterContainer: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 8,
//     overflow: 'hidden',
//   },

//   tableContainer: {
//     minWidth: 1580,
//   },

//   tableHeader: {
//     flexDirection: 'row',
//     backgroundColor: '#eef2ff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#cbd5e1',
//     minHeight: 48,
//     alignItems: 'center',
//   },

//   tableRow: {
//     flexDirection: 'row',
//     minHeight: 58,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e2e8f0',
//   },

//   tableRowAlternate: {
//     backgroundColor: '#f8fafc',
//   },

//   headerCell: {
//     fontSize: 12,
//     fontWeight: '700',
//     color: '#334155',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },

//   tableCell: {
//     fontSize: 12,
//     color: '#334155',
//     paddingHorizontal: 10,
//     paddingVertical: 10,
//   },

//   clickableCell: {
//     justifyContent: 'center',
//     minHeight: 58,
//   },

//   nameCell: {
//     width: 180,
//   },

//   mobileCell: {
//     width: 130,
//   },

//   emailCell: {
//     width: 220,
//   },

//   addressCell: {
//     width: 220,
//   },

//   cityCell: {
//     width: 120,
//   },

//   stateCell: {
//     width: 120,
//   },

//   pincodeCell: {
//     width: 100,
//   },

//   gstinCell: {
//     width: 170,
//   },

//   openingBalanceCell: {
//     width: 160,
//   },

//   rightText: {
//     textAlign: 'right',
//   },

//   // ACTION
//   actionCell: {
//     width: 100,
//     minHeight: 58,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   deleteButton: {
//     width: 50,
//     height: 32,
//     borderRadius: 6,
//     backgroundColor: '#fee2e2',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   deleteIcon: {
//     fontSize: 11,
//     color: '#dc2626',
//     fontWeight: '700',
//   },

//   // EMPTY
//   emptyContainer: {
//     backgroundColor: '#ffffff',
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     borderRadius: 8,
//     paddingVertical: 50,
//     alignItems: 'center',
//   },

//   emptyTitle: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#334155',
//   },

//   emptyText: {
//     fontSize: 13,
//     color: '#64748b',
//     marginTop: 6,
//   },

//   // MODAL
//   modalOverlay: {
//     flex: 1,
//     backgroundColor:
//       'rgba(15, 23, 42, 0.5)',
//     justifyContent: 'center',
//     padding: 16,
//   },

//   modalContainer: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     maxHeight: '90%',
//     overflow: 'hidden',
//   },

//   modalHeader: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 16,
//     paddingVertical: 15,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },

//   modalTitle: {
//     color: '#ffffff',
//     fontSize: 17,
//     fontWeight: '700',
//   },

//   closeText: {
//     color: '#ffffff',
//     fontSize: 12,
//     fontWeight: '600',
//   },

//   modalBody: {
//     paddingHorizontal: 16,
//   },

//   formSectionTitle: {
//     color: '#4338ca',
//     fontSize: 14,
//     fontWeight: '700',
//     marginTop: 14,
//     marginBottom: 6,
//   },

//   inputLabel: {
//     color: '#475569',
//     fontSize: 12,
//     fontWeight: '600',
//     marginTop: 7,
//     marginBottom: 4,
//   },

//   input: {
//     backgroundColor: '#f8fafc',
//     borderWidth: 1,
//     borderColor: '#cbd5e1',
//     borderRadius: 7,
//     paddingHorizontal: 11,
//     paddingVertical: 9,
//     fontSize: 13,
//     color: '#0f172a',
//   },

//   formRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },

//   formColumn: {
//     width: '48.5%',
//   },

//   // GST TOGGLE BUTTONS
//   gstToggleContainer: {
//     flexDirection: 'row',
//     marginTop: 6,
//     marginBottom: 4,
//     justifyContent: 'space-between',
//   },

//   gstToggleButton: {
//     width: '48.5%',
//     paddingVertical: 10,
//     borderRadius: 7,
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
//     marginTop: 6,
//   },

//   // MODAL FOOTER
//   modalFooter: {
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     padding: 14,
//     borderTopWidth: 1,
//     borderTopColor: '#e2e8f0',
//     backgroundColor: '#f8fafc',
//   },

//   cancelButton: {
//     paddingHorizontal: 16,
//     paddingVertical: 9,
//     marginRight: 8,
//   },

//   cancelButtonText: {
//     color: '#64748b',
//     fontSize: 13,
//     fontWeight: '600',
//   },

//   saveButton: {
//     backgroundColor: '#4338ca',
//     paddingHorizontal: 18,
//     paddingVertical: 9,
//     borderRadius: 7,
//   },

//   saveButtonText: {
//     color: '#ffffff',
//     fontSize: 13,
//     fontWeight: '700',
//   },
// });

// export default SupplierMasterScreen;




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
  ActivityIndicator,
} from 'react-native';
import {API_BASE_URL} from '../api/config';

type Props = {
  navigation: any;
  route: any;
};

interface Supplier {
  id: string | number;
  name: string;
  mobile: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstin?: string;
  status?: string;
  currentPayable?: number;
  openingBalance?: number;
}

const SupplierMasterScreen = ({navigation, route}: Props) => {
  // =========================================================
  // STATES
  // =========================================================

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingSupplierId, setEditingSupplierId] =
    useState<string | number | null>(null);

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [hasGst, setHasGst] = useState<boolean>(false);
  const [gstin, setGstin] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');

  // =========================================================
  // LOAD SUPPLIERS
  // =========================================================

  useEffect(() => {
    loadSuppliers();

    if (route?.params?.openAddModal) {
      openAddSupplier();
    }
  }, [route?.params?.openAddModal]);

  const loadSuppliers = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_BASE_URL}/api/suppliers`,
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`,
        );
      }

      const result = await response.json();

      console.log('Supplier API response:', result);

      let supplierData: any[] = [];

      if (Array.isArray(result)) {
        supplierData = result;
      } else if (Array.isArray(result?.data)) {
        supplierData = result.data;
      } else if (Array.isArray(result?.suppliers)) {
        supplierData = result.suppliers;
      }

      const formattedSuppliers: Supplier[] =
        supplierData.map(item => ({
          id:
            item.id ??
            item.supplier_id ??
            item.supplierId,

          name:
            item.name ??
            item.supplier_name ??
            item.supplierName ??
            '',

          mobile:
            item.mobile ??
            item.phone ??
            item.phone_number ??
            '',

          email: item.email ?? '',

          address: item.address ?? '',

          city: item.city ?? '',

          state: item.state ?? '',

          pincode: item.pincode ?? '',

          gstin: item.gstin ?? '',

          status: item.status ?? 'active',

          currentPayable:
            Number(
              item.currentPayable ??
                item.current_payable ??
                item.payable ??
                0,
            ) || 0,

          openingBalance:
            Number(
              item.openingBalance ??
                item.opening_balance ??
                0,
            ) || 0,
        }));

      setSuppliers(formattedSuppliers);
    } catch (error) {
      console.error(
        'Load suppliers error:',
        error,
      );

      Alert.alert(
        'Connection Error',
        'Unable to fetch suppliers from the server. Please make sure your backend is running.',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setName('');
    setMobile('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setHasGst(false);
    setGstin('');
    setOpeningBalance('');
    setEditingSupplierId(null);
  };

  // =========================================================
  // OPEN ADD SUPPLIER
  // =========================================================

  const openAddSupplier = () => {
    resetForm();
    setModalVisible(true);
  };

  // =========================================================
  // SAVE / UPDATE SUPPLIER
  // =========================================================

  const handleSaveSupplier = async () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert(
        'Validation Error',
        'Supplier Name and Phone are required.',
      );
      return;
    }

    const openingAmount =
      parseFloat(openingBalance) || 0;

    const finalGstin = hasGst ? gstin.trim() : '';

    const supplierData = {
      supplier_name: name.trim(),
      name: name.trim(),

      phone: mobile.trim(),
      mobile: mobile.trim(),

      email: email.trim(),

      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),

      gstin: finalGstin,

      status: 'active',

      current_payable: 0,
      currentPayable: 0,

      opening_balance: openingAmount,
      openingBalance: openingAmount,
    };

    try {
      const isEditing =
        editingSupplierId !== null;

      const url = isEditing
        ? `${API_BASE_URL}/api/suppliers/${editingSupplierId}`
        : `${API_BASE_URL}/api/suppliers`;

      const response = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(supplierData),
      });

      const result = await response.json();

      console.log(
        'Supplier save response:',
        result,
      );

      if (!response.ok) {
        throw new Error(
          result?.message ||
            `Server returned ${response.status}`,
        );
      }

      if (isEditing) {
        const updatedSupplier: Supplier = {
          id: editingSupplierId,

          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim(),

          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),

          gstin: finalGstin,

          status: 'active',

          currentPayable: 0,

          openingBalance: openingAmount,
        };

        setSuppliers(prev =>
          prev.map(item =>
            item.id === editingSupplierId
              ? updatedSupplier
              : item,
          ),
        );

        Alert.alert(
          'Success',
          'Supplier updated successfully.',
        );
      } else {
        const serverSupplier =
          result?.data ??
          result?.supplier ??
          result;

        const createdSupplier: Supplier = {
          id:
            serverSupplier?.id ??
            serverSupplier?.supplier_id ??
            Date.now().toString(),

          name: name.trim(),
          mobile: mobile.trim(),
          email: email.trim(),

          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),

          gstin: finalGstin,

          status: 'active',

          currentPayable: 0,

          openingBalance: openingAmount,
        };

        setSuppliers(prev => [
          createdSupplier,
          ...prev,
        ]);

        Alert.alert(
          'Success',
          'Supplier added successfully.',
          [
            {
              text: 'OK',
              onPress: () => {
                if (route?.params?.returnTo) {
                  navigation.navigate(
                    route.params.returnTo,
                    {
                      newSupplier:
                        createdSupplier,
                    },
                  );
                }
              },
            },
          ],
        );
      }

      resetForm();
      setModalVisible(false);
    } catch (error) {
      console.error(
        'Save supplier error:',
        error,
      );

      Alert.alert(
        'Error',
        editingSupplierId !== null
          ? 'Unable to update supplier. Please check your backend.'
          : 'Unable to add supplier. Please check your backend connection.',
      );
    }
  };

  // =========================================================
  // EDIT SUPPLIER
  // =========================================================

  const handleEditSupplier = (
    supplier: Supplier,
  ) => {
    setEditingSupplierId(supplier.id);

    setName(supplier.name || '');
    setMobile(supplier.mobile || '');
    setEmail(supplier.email || '');

    setAddress(supplier.address || '');
    setCity(supplier.city || '');
    setState(supplier.state || '');
    setPincode(supplier.pincode || '');

    const hasExistingGst = Boolean(
      supplier.gstin &&
        supplier.gstin.trim() !== '' &&
        supplier.gstin.toLowerCase() !==
          'unregistered' &&
        supplier.gstin !== '-',
    );

    setHasGst(hasExistingGst);
    setGstin(
      hasExistingGst
        ? supplier.gstin || ''
        : '',
    );

    setOpeningBalance(
      supplier.openingBalance !== undefined
        ? String(supplier.openingBalance)
        : '',
    );

    setModalVisible(true);
  };

  // =========================================================
  // DELETE SUPPLIER
  // =========================================================

  const handleDeleteSupplier = (
    supplier: Supplier,
  ) => {
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

          onPress: async () => {
            try {
              const response =
                await fetch(
                  `${API_BASE_URL}/api/suppliers/${supplier.id}`,
                  {
                    method: 'DELETE',
                  },
                );

              const result =
                await response.json();

              console.log(
                'Delete supplier response:',
                result,
              );

              if (!response.ok) {
                throw new Error(
                  result?.message ||
                    `Server returned ${response.status}`,
                );
              }

              setSuppliers(prev =>
                prev.filter(
                  item =>
                    item.id !== supplier.id,
                ),
              );

              Alert.alert(
                'Success',
                'Supplier deleted successfully.',
              );
            } catch (error) {
              console.error(
                'Delete supplier error:',
                error,
              );

              Alert.alert(
                'Error',
                'Unable to delete supplier. Please check your backend.',
              );
            }
          },
        },
      ],
    );
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredSuppliers =
    suppliers.filter(supplier => {
      const query =
        searchQuery
          .toLowerCase()
          .trim();

      if (!query) {
        return true;
      }

      return (
        supplier.name
          ?.toLowerCase()
          .includes(query) ||

        supplier.mobile
          ?.toLowerCase()
          .includes(query) ||

        supplier.email
          ?.toLowerCase()
          .includes(query) ||

        supplier.address
          ?.toLowerCase()
          .includes(query) ||

        supplier.city
          ?.toLowerCase()
          .includes(query) ||

        supplier.state
          ?.toLowerCase()
          .includes(query) ||

        supplier.pincode
          ?.toLowerCase()
          .includes(query) ||

        supplier.gstin
          ?.toLowerCase()
          .includes(query)
      );
    });

  // =========================================================
  // TABLE ROW
  // =========================================================

  const renderSupplierRow = (
    supplier: Supplier,
    index: number,
  ) => {
    return (
      <View
        key={String(supplier.id)}
        style={[
          styles.tableRow,
          index % 2 === 0 &&
            styles.tableRowAlternate,
        ]}>

        {/* SUPPLIER NAME */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.nameCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.name || '-'}
          </Text>
        </TouchableOpacity>

        {/* PHONE */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.mobileCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.mobile || '-'}
          </Text>
        </TouchableOpacity>

        {/* EMAIL */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.emailCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.email || '-'}
          </Text>
        </TouchableOpacity>

        {/* ADDRESS */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.addressCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.address || '-'}
          </Text>
        </TouchableOpacity>

        {/* CITY */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.cityCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.city || '-'}
          </Text>
        </TouchableOpacity>

        {/* STATE */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.stateCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.state || '-'}
          </Text>
        </TouchableOpacity>

        {/* PINCODE */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.pincodeCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.pincode || '-'}
          </Text>
        </TouchableOpacity>

        {/* GSTIN */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.gstinCell,
            styles.clickableCell,
          ]}>
          <Text style={styles.tableCell}>
            {supplier.gstin || '-'}
          </Text>
        </TouchableOpacity>

        {/* OPENING BALANCE */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            handleEditSupplier(supplier)
          }
          style={[
            styles.openingBalanceCell,
            styles.clickableCell,
          ]}>
          <Text
            style={[
              styles.tableCell,
              styles.rightText,
            ]}>
            ₹
            {Number(
              supplier.openingBalance ?? 0,
            ).toFixed(2)}
          </Text>
        </TouchableOpacity>

        {/* ACTION COLUMN - LAST */}
        <View style={styles.actionCell}>
          {/* PENCIL EDIT BUTTON */}
          <TouchableOpacity
            style={styles.editIconButton}
            activeOpacity={0.7}
            onPress={() =>
              handleEditSupplier(supplier)
            }>
            <Text style={styles.editIcon}>✎</Text>
          </TouchableOpacity>

          {/* DUSTBIN DELETE BUTTON */}
          <TouchableOpacity
            style={styles.deleteIconButton}
            activeOpacity={0.7}
            onPress={() =>
              handleDeleteSupplier(supplier)
            }>
            <View style={styles.bin}>
              <View style={styles.binTop}>
                <View style={styles.binHandle} />
              </View>
              <View style={styles.binBody}>
                <View style={styles.binLine} />
                <View style={styles.binLine} />
              </View>
            </View>
          </TouchableOpacity>
        </View>

      </View>
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() =>
            navigation.goBack()
          }>
          <Text style={styles.backButtonText}>
            ←
          </Text>
        </TouchableOpacity>

        <View
          style={
            styles.headerTitleContainer
          }>
          <Text style={styles.headerTitle}>
            Supplier Directory
          </Text>

          <Text
            style={
              styles.headerSubtitle
            }>
            Manage all suppliers
          </Text>
        </View>
      </View>

      {/* LOADING */}
      {loading ? (
        <View
          style={
            styles.loadingContainer
          }>
          <ActivityIndicator
            size="large"
            color="#4338ca"
          />

          <Text
            style={
              styles.loadingText
            }>
            Loading suppliers...
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.mainScroll}
          contentContainerStyle={
            styles.mainContent
          }
          keyboardShouldPersistTaps="handled">

          {/* SEARCH */}
          <View
            style={
              styles.searchContainer
            }>
            <TextInput
              style={styles.searchInput}
              placeholder="Search supplier name, phone, email, city or GSTIN"
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={
                setSearchQuery
              }
            />
          </View>

          {/* SUMMARY */}
          <View
            style={
              styles.summaryHeader
            }>
            <View>
              <Text
                style={
                  styles.directoryTitle
                }>
                Supplier Directory
              </Text>

              <Text
                style={
                  styles.directoryCount
                }>
                Total Suppliers:{' '}
                {filteredSuppliers.length}
              </Text>
            </View>

            <TouchableOpacity
              style={
                styles.smallAddButton
              }
              onPress={
                openAddSupplier
              }>
              <Text
                style={
                  styles.smallAddButtonText
                }>
                + Add Supplier
              </Text>
            </TouchableOpacity>
          </View>

          {/* EMPTY */}
          {filteredSuppliers.length ===
          0 ? (
            <View
              style={
                styles.emptyContainer
              }>
              <Text
                style={
                  styles.emptyTitle
                }>
                No suppliers found
              </Text>

              <Text
                style={
                  styles.emptyText
                }>
                Click + Add Supplier to
                add a supplier.
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.tableOuterContainer
              }>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                nestedScrollEnabled>

                <View
                  style={
                    styles.tableContainer
                  }>

                  {/* TABLE HEADER */}
                  <View
                    style={
                      styles.tableHeader
                    }>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.nameCell,
                      ]}>
                      Supplier Name
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.mobileCell,
                      ]}>
                      Phone
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.emailCell,
                      ]}>
                      Email
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.addressCell,
                      ]}>
                      Address
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.cityCell,
                      ]}>
                      City
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.stateCell,
                      ]}>
                      State
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.pincodeCell,
                      ]}>
                      Pincode
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.gstinCell,
                      ]}>
                      GSTIN
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.openingBalanceCell,
                      ]}>
                      Opening Balance
                    </Text>

                    <Text
                      style={[
                        styles.headerCell,
                        styles.actionCell,
                      ]}>
                      Action
                    </Text>
                  </View>

                  {/* DATA */}
                  {filteredSuppliers.map(
                    (supplier, index) =>
                      renderSupplierRow(
                        supplier,
                        index,
                      ),
                  )}
                </View>
              </ScrollView>
            </View>
          )}
        </ScrollView>
      )}

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => {
          resetForm();
          setModalVisible(false);
        }}>

        <View
          style={
            styles.modalOverlay
          }>

          <View
            style={
              styles.modalContainer
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
                {editingSupplierId !== null
                  ? 'Edit Supplier'
                  : 'Add Supplier'}
              </Text>

              <TouchableOpacity
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}>

                <Text
                  style={
                    styles.closeText
                  }>
                  Close
                </Text>
              </TouchableOpacity>
            </View>

            {/* MODAL BODY */}
            <ScrollView
              style={styles.modalBody}
              keyboardShouldPersistTaps="handled">

              <Text
                style={
                  styles.formSectionTitle
                }>
                Supplier Information
              </Text>

              {/* NAME */}
              <Text
                style={
                  styles.inputLabel
                }>
                Supplier Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter supplier name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              {/* PHONE + EMAIL */}
              <View
                style={styles.formRow}>

                <View
                  style={
                    styles.formColumn
                  }>
                  <Text
                    style={
                      styles.inputLabel
                    }>
                    Phone *
                  </Text>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter phone number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={
                      setMobile
                    }
                  />
                </View>

                <View
                  style={
                    styles.formColumn
                  }>
                  <Text
                    style={
                      styles.inputLabel
                    }>
                    Email
                  </Text>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter email"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={
                      setEmail
                    }
                  />
                </View>
              </View>

              {/* ADDRESS */}
              <Text
                style={
                  styles.inputLabel
                }>
                Address
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#94a3b8"
                value={address}
                onChangeText={
                  setAddress
                }
              />

              {/* CITY + STATE */}
              <View
                style={styles.formRow}>

                <View
                  style={
                    styles.formColumn
                  }>
                  <Text
                    style={
                      styles.inputLabel
                    }>
                    City
                  </Text>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter city"
                    placeholderTextColor="#94a3b8"
                    value={city}
                    onChangeText={
                      setCity
                    }
                  />
                </View>

                <View
                  style={
                    styles.formColumn
                  }>
                  <Text
                    style={
                      styles.inputLabel
                    }>
                    State
                  </Text>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter state"
                    placeholderTextColor="#94a3b8"
                    value={state}
                    onChangeText={
                      setState
                    }
                  />
                </View>
              </View>

              {/* PINCODE */}
              <Text
                style={
                  styles.inputLabel
                }>
                Pincode
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter pincode"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={pincode}
                onChangeText={
                  setPincode
                }
              />

              {/* GST INFORMATION */}
              <Text
                style={
                  styles.formSectionTitle
                }>
                Tax Information
              </Text>

              <Text
                style={
                  styles.inputLabel
                }>
                Do you have GSTIN? *
              </Text>

              {/* YES / NO TOGGLE */}
              <View
                style={
                  styles.gstToggleContainer
                }>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.gstToggleButton,
                    hasGst &&
                      styles.gstToggleButtonActive,
                  ]}
                  onPress={() =>
                    setHasGst(true)
                  }>

                  <Text
                    style={[
                      styles.gstToggleText,
                      hasGst &&
                        styles.gstToggleTextActive,
                    ]}>
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[
                    styles.gstToggleButton,
                    !hasGst &&
                      styles.gstToggleButtonActive,
                  ]}
                  onPress={() => {
                    setHasGst(false);
                    setGstin('');
                  }}>

                  <Text
                    style={[
                      styles.gstToggleText,
                      !hasGst &&
                        styles.gstToggleTextActive,
                    ]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>

              {/* GSTIN */}
              {hasGst && (
                <View
                  style={
                    styles.gstinFieldBox
                  }>

                  <Text
                    style={
                      styles.inputLabel
                    }>
                    GSTIN *
                  </Text>

                  <TextInput
                    style={
                      styles.input
                    }
                    placeholder="Enter 15-digit GSTIN"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="characters"
                    value={gstin}
                    onChangeText={
                      setGstin
                    }
                  />
                </View>
              )}

              {/* FINANCIAL INFORMATION */}
              <Text
                style={
                  styles.formSectionTitle
                }>
                Financial Information
              </Text>

              <Text
                style={
                  styles.inputLabel
                }>
                Opening Balance
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter opening balance"
                placeholderTextColor="#94a3b8"
                keyboardType="decimal-pad"
                value={
                  openingBalance
                }
                onChangeText={
                  setOpeningBalance
                }
              />

              <View
                style={{height: 30}}
              />
            </ScrollView>

            {/* FOOTER */}
            <View
              style={
                styles.modalFooter
              }>

              <TouchableOpacity
                style={
                  styles.cancelButton
                }
                onPress={() => {
                  resetForm();
                  setModalVisible(false);
                }}>

                <Text
                  style={
                    styles.cancelButtonText
                  }>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.saveButton
                }
                onPress={
                  handleSaveSupplier
                }>

                <Text
                  style={
                    styles.saveButtonText
                  }>
                  {editingSupplierId !== null
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

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // HEADER
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 42,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    paddingRight: 14,
  },

  backButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '600',
  },

  headerTitleContainer: {
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

  // LOADING
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748b',
    fontSize: 14,
  },

  // MAIN
  mainScroll: {
    flex: 1,
  },

  mainContent: {
    padding: 16,
    paddingBottom: 40,
  },

  searchContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 16,
  },

  searchInput: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
  },

  // SUMMARY
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  directoryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },

  directoryCount: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },

  smallAddButton: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 7,
  },

  smallAddButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // TABLE
  tableOuterContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableContainer: {
    minWidth: 1510,
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    minHeight: 48,
    alignItems: 'center',
  },

  tableRow: {
    flexDirection: 'row',
    minHeight: 58,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  tableRowAlternate: {
    backgroundColor: '#f8fafc',
  },

  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  tableCell: {
    fontSize: 12,
    color: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },

  clickableCell: {
    justifyContent: 'center',
    minHeight: 58,
  },

  nameCell: {
    width: 180,
  },

  mobileCell: {
    width: 130,
  },

  emailCell: {
    width: 220,
  },

  addressCell: {
    width: 220,
  },

  cityCell: {
    width: 120,
  },

  stateCell: {
    width: 120,
  },

  pincodeCell: {
    width: 100,
  },

  gstinCell: {
    width: 170,
  },

  openingBalanceCell: {
    width: 160,
  },

  rightText: {
    textAlign: 'right',
  },

  // ACTION - LAST COLUMN
  actionCell: {
    width: 90,
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  editIconButton: {
    width: 30,
    height: 30,
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

  deleteIconButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bin: {
    width: 18,
    height: 20,
    alignItems: 'center',
  },

  binTop: {
    width: 16,
    height: 3,
    backgroundColor: '#dc2626',
    borderRadius: 1,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  binHandle: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 2,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  binBody: {
    width: 13,
    height: 14,
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
    height: 8,
    backgroundColor: '#dc2626',
  },

  // EMPTY
  emptyContainer: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 50,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },

  emptyText: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 6,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor:
      'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    maxHeight: '90%',
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  closeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },

  modalBody: {
    paddingHorizontal: 16,
  },

  formSectionTitle: {
    color: '#4338ca',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 14,
    marginBottom: 6,
  },

  inputLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 7,
    marginBottom: 4,
  },

  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 7,
    paddingHorizontal: 11,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0f172a',
  },

  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  formColumn: {
    width: '48.5%',
  },

  // GST TOGGLE BUTTONS
  gstToggleContainer: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 4,
    justifyContent: 'space-between',
  },

  gstToggleButton: {
    width: '48.5%',
    paddingVertical: 10,
    borderRadius: 7,
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
    marginTop: 6,
  },

  // MODAL FOOTER
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },

  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    marginRight: 8,
  },

  cancelButtonText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 7,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default SupplierMasterScreen;