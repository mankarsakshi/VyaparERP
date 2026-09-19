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
import {downloadCustomers} from '../utils/exportHelper';

type Props = {
  navigation: any;
  route?: any;
};

export interface Customer {
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
  bankName: string;
  accountNumber: string;
  ifscCode: string;
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

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul.sharma@gmail.com',
    address: 'Flat 402, Sunshine Heights, FC Road',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411005',
    hasGstin: true,
    gstin: '27AAAAA0000A1Z5',
    openingBalance: 12500,
    bankName: 'HDFC Bank',
    accountNumber: '50100234567891',
    ifscCode: 'HDFC0001234',
  },
  {
    id: '2',
    name: 'Amit Enterprises',
    phone: '9822012345',
    email: 'contact@amittraders.in',
    address: 'Shop 12, APMC Market, Vashi',
    city: 'Navi Mumbai',
    state: 'Maharashtra',
    pincode: '400703',
    hasGstin: true,
    gstin: '27BBBCA1234B1Z2',
    openingBalance: 45000,
    bankName: 'State Bank of India',
    accountNumber: '30248596123',
    ifscCode: 'SBIN0004521',
  },
  {
    id: '3',
    name: 'Pooja Verma',
    phone: '9765432109',
    email: 'pooja.verma@yahoo.com',
    address: 'B-14, Civil Lines, Near Bus Stand',
    city: 'Nagpur',
    state: 'Maharashtra',
    pincode: '440001',
    hasGstin: false,
    gstin: '',
    openingBalance: 5000,
    bankName: 'ICICI Bank',
    accountNumber: '001205012456',
    ifscCode: 'ICIC0000012',
  },
  {
    id: '4',
    name: 'Suresh Patel',
    phone: '9898012345',
    email: 'suresh.patel@gmail.com',
    address: 'Plot 45, GIDC Industrial Estate',
    city: 'Surat',
    state: 'Gujarat',
    pincode: '395003',
    hasGstin: true,
    gstin: '24AABCS1429B1Z4',
    openingBalance: 82000,
    bankName: 'Bank of Baroda',
    accountNumber: '25480200001548',
    ifscCode: 'BARB0SURATX',
  },
  {
    id: '5',
    name: 'Ananya Gupta',
    phone: '9811223344',
    email: 'ananya.gupta@outlook.com',
    address: '42 South Extension Part II',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110049',
    hasGstin: false,
    gstin: '',
    openingBalance: 15000,
    bankName: 'Axis Bank',
    accountNumber: '918020034567890',
    ifscCode: 'UTIB0000245',
  },
  {
    id: '6',
    name: 'Venkatesh Rao',
    phone: '9845098765',
    email: 'venkatesh.rao@gmail.com',
    address: '15/3, 4th Block, Jayanagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560011',
    hasGstin: true,
    gstin: '29ABCDE1234F1Z5',
    openingBalance: 32000,
    bankName: 'Canara Bank',
    accountNumber: '112233445566',
    ifscCode: 'CNRB0001234',
  },
  {
    id: '7',
    name: 'Deepak Joshi',
    phone: '9712345678',
    email: 'deepak.joshi@rediffmail.com',
    address: '88 Malviya Nagar',
    city: 'Jaipur',
    state: 'Rajasthan',
    pincode: '302017',
    hasGstin: false,
    gstin: '',
    openingBalance: 7500,
    bankName: 'Punjab National Bank',
    accountNumber: '4123000100023456',
    ifscCode: 'PUNB0412300',
  },

];

const CustomerMasterScreen = ({navigation}: Props) => {
  const [customers, setCustomers] =
    useState<Customer[]>(DEFAULT_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState('');

  const CUSTOMERS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCustomerId, setEditingCustomerId] =
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

  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('');

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
    setBankName('');
    setAccountNumber('');
    setIfscCode('');
    setEditingCustomerId(null);
  };

  const openAddCustomerModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditCustomerModal = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setName(customer.name || '');
    setPhone(customer.phone || '');
    setEmail(customer.email || '');
    setAddress(customer.address || '');
    setCity(customer.city || '');
    setState(customer.state || '');
    setPincode(customer.pincode || '');
    setHasGstin(customer.hasGstin);
    setGstin(customer.hasGstin ? customer.gstin : '');
    setOpeningBalance(
      customer.openingBalance !== undefined
        ? String(customer.openingBalance)
        : '',
    );
    setBankName(customer.bankName || '');
    setAccountNumber(customer.accountNumber || '');
    setIfscCode(customer.ifscCode || '');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSaveCustomer = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Customer Name is required');
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

    const customerData: Customer = {
      id: editingCustomerId || Date.now().toString(),
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
      bankName: bankName.trim(),
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
    };

    if (editingCustomerId) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === editingCustomerId ? customerData : c,
        ),
      );

      Alert.alert(
        'Success',
        `Customer "${customerData.name}" updated successfully!`,
      );
    } else {
      setCustomers(prev => [customerData, ...prev]);
      setCurrentPage(1);

      Alert.alert(
        'Success',
        `Customer "${customerData.name}" added successfully!`,
      );
    }

    closeModal();
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Alert.alert(
      'Delete Customer',
      `Are you sure you want to delete "${customer.name}"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setCustomers(prev =>
              prev.filter(c => c.id !== customer.id),
            );
          },
        },
      ],
    );
  };

  const handleDownload = (format: 'pdf' | 'excel') => {
    setDownloadMenuVisible(false);

    const targetList =
      filteredCustomers.length > 0 ? filteredCustomers : customers;

    downloadCustomers(targetList, format);
  };

  const filteredCustomers = customers.filter(customer => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.city.toLowerCase().includes(query) ||
      customer.state.toLowerCase().includes(query) ||
      customer.bankName.toLowerCase().includes(query) ||
      customer.gstin.toLowerCase().includes(query)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCustomers.length / CUSTOMERS_PER_PAGE),
  );

  const paginatedCustomers = filteredCustomers.slice(
    (currentPage - 1) * CUSTOMERS_PER_PAGE,
    currentPage * CUSTOMERS_PER_PAGE,
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
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>

        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>Customer Directory</Text>
          <Text style={styles.headerSubtitle}>Manage all customers</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search customer name, phone or city..."
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
            onPress={() => setDownloadMenuVisible(true)}>
            <Text style={styles.exportIcon}>📄</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.swipeHintRow}>
          <Text style={styles.swipeHintArrow}>↔</Text>
          <Text style={styles.swipeHintText}>
            Swipe the table to see all columns
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Customer Directory
            </Text>
            <Text style={styles.totalText}>
              Total Customers: {customers.length}
            </Text>
          </View>
        </View>

        <View style={styles.tableWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}>
            <View style={styles.tableContainer}>
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
                  Customer Name
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
                    styles.colBank,
                  ]}>
                  Bank Name
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.colAccount,
                  ]}>
                  Account No
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.colIfsc,
                  ]}>
                  IFSC Code
                </Text>
                <Text
                  style={[
                    styles.headerCell,
                    styles.colAction,
                  ]}>
                  Action
                </Text>
              </View>

              <ScrollView
                style={styles.tableBody}
                showsVerticalScrollIndicator={true}>
                {filteredCustomers.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>
                      {customers.length === 0
                        ? 'No customers added yet.'
                        : 'No customers found.'}
                    </Text>

                    <TouchableOpacity
                      style={styles.emptyAddBtn}
                      onPress={openAddCustomerModal}>
                      <Text style={styles.emptyAddBtnText}>
                        + Add Customer
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  paginatedCustomers.map((customer, index) => (
                    <View
                      key={customer.id}
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
                          CUSTOMERS_PER_PAGE +
                          index +
                          1}
                      </Text>

                      <View
                        style={[
                          styles.nameCell,
                          styles.colName,
                        ]}>
                        <Text
                          style={styles.customerName}
                          numberOfLines={1}>
                          {customer.name}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colPhone,
                        ]}
                        numberOfLines={1}>
                        {customer.phone || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colEmail,
                        ]}
                        numberOfLines={1}>
                        {customer.email || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colAddress,
                        ]}
                        numberOfLines={1}>
                        {customer.address || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colCity,
                        ]}
                        numberOfLines={1}>
                        {customer.city || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colState,
                        ]}
                        numberOfLines={1}>
                        {customer.state || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colPincode,
                        ]}
                        numberOfLines={1}>
                        {customer.pincode || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colGstin,
                          customer.hasGstin && customer.gstin
                            ? styles.boldText
                            : null,
                        ]}
                        numberOfLines={1}>
                        {customer.hasGstin && customer.gstin
                          ? customer.gstin
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
                          customer.openingBalance || 0,
                        ).toFixed(2)}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colBank,
                        ]}
                        numberOfLines={1}>
                        {customer.bankName || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colAccount,
                        ]}
                        numberOfLines={1}>
                        {customer.accountNumber || '-'}
                      </Text>

                      <Text
                        style={[
                          styles.bodyCell,
                          styles.colIfsc,
                        ]}
                        numberOfLines={1}>
                        {customer.ifscCode || '-'}
                      </Text>

                      <View
                        style={[
                          styles.actionCell,
                          styles.colAction,
                        ]}>
                        <TouchableOpacity
                          style={styles.editButton}
                          activeOpacity={0.7}
                          onPress={() => openEditCustomerModal(customer)}>
                          <PencilIcon size={14} color="#ea7e30" />
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.deleteButton}
                          activeOpacity={0.7}
                          onPress={() => handleDeleteCustomer(customer)}>
                          <DustbinIcon size={14} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))
                )}
              </ScrollView>
            </View>
          </ScrollView>

          {filteredCustomers.length > 0 && (
            <View style={styles.bottomAddContainer}>
              <TouchableOpacity
                style={styles.bottomAddButton}
                activeOpacity={0.8}
                onPress={openAddCustomerModal}>
                <Text style={styles.bottomAddPlus}>+</Text>
              </TouchableOpacity>
            </View>
          )}

          {filteredCustomers.length > 10 && (
            <View style={styles.paginationContainer}>
              <Text style={styles.paginationInfo}>
                Showing{' '}
                {(currentPage - 1) * CUSTOMERS_PER_PAGE + 1} -{' '}
                {Math.min(
                  currentPage * CUSTOMERS_PER_PAGE,
                  filteredCustomers.length,
                )}{' '}
                of {filteredCustomers.length}
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
                  {editingCustomerId
                    ? 'Edit Customer'
                    : 'Add Customer'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingCustomerId
                    ? 'Update customer information'
                    : 'Enter customer information'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.sectionHeaderTitle}>
                Customer Details
              </Text>

              <Text style={styles.inputLabel}>
                Customer Name *
              </Text>

              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                placeholderTextColor="#d1d5db"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Phone *</Text>
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
                  <Text style={styles.inputLabel}>Email</Text>
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

              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#d1d5db"
                value={address}
                onChangeText={setAddress}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    placeholderTextColor="#d1d5db"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>State</Text>
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
                  <Text style={styles.inputLabel}>Pincode</Text>
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

              <Text
                style={[
                  styles.sectionHeaderTitle,
                  {marginTop: 18},
                ]}>
                Bank Details
              </Text>

              <Text style={styles.inputLabel}>Bank Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter bank name"
                placeholderTextColor="#d1d5db"
                value={bankName}
                onChangeText={setBankName}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    Account Number
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter account number"
                    placeholderTextColor="#d1d5db"
                    keyboardType="numeric"
                    value={accountNumber}
                    onChangeText={setAccountNumber}
                  />
                </View>

                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>
                    IFSC Code
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter IFSC code"
                    placeholderTextColor="#d1d5db"
                    autoCapitalize="characters"
                    value={ifscCode}
                    onChangeText={setIfscCode}
                  />
                </View>
              </View>

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
                onPress={handleSaveCustomer}>
                <Text style={styles.saveButtonText}>
                  {editingCustomerId
                    ? 'Update Customer'
                    : 'Save Customer'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CustomerMasterScreen;

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
    fontSize: 16,
    fontWeight: '700',
    color: '#ea6c08',
    textAlign: 'center',
    marginRight: 4,
  },

  downloadMenuText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },

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
    minWidth: 1420,
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

  customerName: {
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

  colBank: {
    width: 130,
  },

  colAccount: {
    width: 130,
  },

  colIfsc: {
    width: 110,
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

  // FLOATING ADD BUTTON
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