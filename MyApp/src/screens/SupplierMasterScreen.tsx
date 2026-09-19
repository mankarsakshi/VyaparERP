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
  // {
  //   id: '8',
  //   name: 'Apex Chemical Industries',
  //   phone: '9879012345',
  //   email: 'orders@apexchemicals.co.in',
  //   address: 'Phase 4, GIDC Vatva',
  //   city: 'Ahmedabad',
  //   state: 'Gujarat',
  //   pincode: '382445',
  //   hasGstin: true,
  //   gstin: '24AAACA9876D1Z7',
  //   openingBalance: 76000,
  // },
  // {
  //   id: '9',
  //   name: 'Royal Steel Corporation',
  //   phone: '9831098765',
  //   email: 'royalsteelkol@gmail.com',
  //   address: '22 Brabourne Road, 3rd Floor',
  //   city: 'Kolkata',
  //   state: 'West Bengal',
  //   pincode: '700001',
  //   hasGstin: true,
  //   gstin: '19AAACR1234M1Z4',
  //   openingBalance: 145000,
  // },
  // {
  //   id: '10',
  //   name: 'Lakshmi Silk Mills',
  //   phone: '9415012345',
  //   email: 'lakshmisilk@yahoo.co.in',
  //   address: 'Chowk, Near Vishwanath Gali',
  //   city: 'Varanasi',
  //   state: 'Uttar Pradesh',
  //   pincode: '221001',
  //   hasGstin: false,
  //   gstin: '',
  //   openingBalance: 18000,
  // },
  // {
  //   id: '11',
  //   name: 'Sunrise Auto Parts',
  //   phone: '9815012345',
  //   email: 'sunriseauto.ldh@gmail.com',
  //   address: 'Focal Point, Phase 5',
  //   city: 'Ludhiana',
  //   state: 'Punjab',
  //   pincode: '141010',
  //   hasGstin: true,
  //   gstin: '03AAACS5678J1Z1',
  //   openingBalance: 53000,
  // },
  // {
  //   id: '12',
  //   name: 'Deccan Plastics Ltd',
  //   phone: '9848012345',
  //   email: 'info@deccanplastics.in',
  //   address: 'Cherlapally IDA, Phase II',
  //   city: 'Hyderabad',
  //   state: 'Telangana',
  //   pincode: '500051',
  //   hasGstin: true,
  //   gstin: '36AAACD1234N1Z8',
  //   openingBalance: 61000,
  // },
  // {
  //   id: '13',
  //   name: 'Premier Timber Mart',
  //   phone: '9840012345',
  //   email: 'premiertimber@gmail.com',
  //   address: 'Sydenhams Road, Periamet',
  //   city: 'Chennai',
  //   state: 'Tamil Nadu',
  //   pincode: '600003',
  //   hasGstin: false,
  //   gstin: '',
  //   openingBalance: 22000,
  // },
  // {
  //   id: '14',
  //   name: 'Malabar Spices Wholesale',
  //   phone: '9446012345',
  //   email: 'malabarspices@gmail.com',
  //   address: 'Jew Town, Mattancherry',
  //   city: 'Kochi',
  //   state: 'Kerala',
  //   pincode: '682002',
  //   hasGstin: true,
  //   gstin: '32AAACM4321E1Z6',
  //   openingBalance: 39000,
  // },
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

  useEffect(() => {
    if (route?.params?.openAddModal) {
      openAddSupplierModal();
    }
  }, [route?.params?.openAddModal]);

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

  const openAddSupplierModal = () => {
    resetForm();
    setModalVisible(true);
  };

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

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

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
      hasGstin,
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

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredSuppliers.length > 0
        ? filteredSuppliers
        : suppliers;

    downloadSuppliers(targetList, format);
  };

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
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>Supplier Directory</Text>
          <Text style={styles.headerSubtitle}>Manage all suppliers</Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search supplier name, phone or city..."
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
                <Text style={styles.clearBtnText}>✖</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.exportButton}
            activeOpacity={0.8}
            onPress={() => setDownloadMenuVisible(prev => !prev)}>
            <Text style={styles.exportIcon}>📄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.swipeHintRow}>
          <Text style={styles.swipeHintArrow}>↔</Text>
          <Text style={styles.swipeHintText}>
            Swipe the table to see all columns
          </Text>
        </View>

          {/* DOWNLOAD MENU */}
          {downloadMenuVisible && (
            <View style={styles.downloadMenu}>
              <TouchableOpacity
                style={styles.downloadMenuItem}
                activeOpacity={0.7}
                onPress={() => handleDownload('pdf')}>
                <Text style={styles.downloadMenuIcon}>
                  PDF
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
                  XLS
                </Text>

                <Text style={styles.downloadMenuText}>
                  Excel
                </Text>
              </TouchableOpacity>
            </View>
          )}

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
                      <View
                        key={supplier.id}
                        style={[
                          styles.tableRow,
                          index % 2 === 1 &&
                            styles.tableRowAlternate,
                        ]}>
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

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPhone,
                          ]}
                          numberOfLines={1}>
                          {supplier.phone || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colEmail,
                          ]}
                          numberOfLines={1}>
                          {supplier.email || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colAddress,
                          ]}
                          numberOfLines={1}>
                          {supplier.address || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colCity,
                          ]}
                          numberOfLines={1}>
                          {supplier.city || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colState,
                          ]}
                          numberOfLines={1}>
                          {supplier.state || '-'}
                        </Text>

                        <Text
                          style={[
                            styles.bodyCell,
                            styles.colPincode,
                          ]}
                          numberOfLines={1}>
                          {supplier.pincode || '-'}
                        </Text>

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

                        <View
                          style={[
                            styles.actionCell,
                            styles.colAction,
                          ]}>
                          <TouchableOpacity
                            style={styles.editButton}
                            activeOpacity={0.7}
                            onPress={() => openEditSupplierModal(supplier)}>
                            <PencilIcon size={14} color="#ea7e30" />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.deleteButton}
                            activeOpacity={0.7}
                            onPress={() => handleDeleteSupplier(supplier)}>
                            <DustbinIcon size={14} color="#ef4444" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ),
                  )
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {/* FLOATING + BUTTON */}
          {filteredSuppliers.length > 0 && (
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity
                style={styles.bottomAddButton}
                activeOpacity={0.8}
                onPress={openAddSupplierModal}>
                <Text style={styles.bottomAddPlus}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* PAGINATION */}
          {filteredSuppliers.length > 10 && (
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
                placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
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
                    placeholderTextColor="#d1d5db"
                    autoCapitalize="characters"
                    value={gstin}
                    onChangeText={setGstin}
                  />
                </View>
              )}

              <View style={styles.bottomSpace} />
            </ScrollView>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitleArea: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
    letterSpacing: 0.2,
  },
  headerSubtitle: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },

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
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  exportIcon: {
    color: '#ffffff',
    fontSize: 20,
  },
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

  fileIconLine: {
    width: 9,
    height: 1.2,
    backgroundColor: '#ea6c08',
    marginBottom: 2,
  },

  fileIconLineShort: {
    width: 6,
    height: 1.2,
    backgroundColor: '#ea6c08',
  },

  downloadMenu: {
    position: 'absolute',
    right: 0,
    top: 48,
    width: 160,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
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
    backgroundColor: '#ffffff',
    marginHorizontal: 8,
  },

  downloadMenuIcon: {
    width: 30,
    fontSize: 10,
    fontWeight: '800',
    color: '#ea6c08',
    textAlign: 'center',
    marginRight: 4,
  },

  downloadMenuText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

  tableWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  tableContainer: {
    minWidth: 1180,
  },

  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
  },

  headerCell: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
    letterSpacing: 0.5,
  },

  tableBody: {
    flex: 1,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    backgroundColor: '#ffffff',
    alignItems: 'center',
  },

  tableRowAlternate: {
    backgroundColor: '#ffffff',
  },

  bodyCell: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  nameCell: {
    justifyContent: 'center',
    paddingHorizontal: 8,
  },

  supplierName: {
    fontSize: 14,
    fontWeight: '700',
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
    backgroundColor: '#fff7ed',
  },

  editIcon: {
    fontSize: 16,
    color: '#ea6c08',
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

  emptyContainer: {
    width: 1200,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 10,
  },

  emptyAddBtn: {
    backgroundColor: '#ea6c08',
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
  // FLOATING + BUTTON
  // ============================================================

  bottomAddContainer: {
    position: 'absolute',
    right: 16,
    bottom: 70,
    width: 62,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    elevation: 12,
  },

  bottomAddButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ea6c08',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.28,
    shadowRadius: 6,
  },

  bottomAddPlus: {
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '400',
    lineHeight: 40,
    textAlign: 'center',
    includeFontPadding: false,
  },

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
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paginationButtonDisabled: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
  },

  paginationButtonText: {
    fontSize: 20,
    color: '#ea6c08',
    lineHeight: 22,
    fontWeight: '600',
  },

  paginationButtonTextDisabled: {
    color: '#d1d5db',
  },

  pageNumberButton: {
    minWidth: 32,
    height: 32,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pageNumberButtonActive: {
    backgroundColor: '#ea6c08',
    borderColor: '#ea6c08',
  },

  pageNumberText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },

  pageNumberTextActive: {
    color: '#ffffff',
  },

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
    backgroundColor: '#ea7e30',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },

  
  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  
  modalSubtitle: {
    color: '#FCE0D0',
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
    color: '#ea6c08',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
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
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  gstToggleButtonActive: {
    borderColor: '#ea6c08',
    backgroundColor: '#fff7ed',
  },

  gstToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  gstToggleTextActive: {
    color: '#ea6c08',
    fontWeight: '700',
  },

  gstinFieldBox: {
    marginTop: 2,
  },

  bottomSpace: {
    height: 20,
  },

  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#ffffff',
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
    backgroundColor: '#ea6c08',
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