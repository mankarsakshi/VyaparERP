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
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

interface Customer {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  state: string;
  address?: string;
  pincode?: string;
  gstin?: string;
  customerType: string;
  openingBalance: number;
  creditLimit: number;
  paymentTerms?: string;
}

const DEFAULT_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Rahul Sharma',
    mobile: '9876543210',
    email: 'rahul@gmail.com',
    city: 'Pune',
    state: 'Maharashtra',
    address: 'Flat 402, Sunshine Heights, FC Road',
    pincode: '411005',
    gstin: '27AAAAA0000A1Z5',
    customerType: 'Retail',
    openingBalance: 10000,
    creditLimit: 50000,
    paymentTerms: 'Net 30 Days',
  },
  {
    id: '2',
    name: 'Amit Traders',
    mobile: '9822012345',
    email: 'contact@amittraders.in',
    city: 'Mumbai',
    state: 'Maharashtra',
    address: 'Shop 12, APMC Market, Vashi',
    pincode: '400703',
    gstin: '27BBBCA1234B1Z2',
    customerType: 'B2B',
    openingBalance: 45000,
    creditLimit: 200000,
    paymentTerms: 'Net 15 Days',
  },
  {
    id: '3',
    name: 'ABC Store',
    mobile: '9765432109',
    email: 'abcstore@yahoo.com',
    city: 'Nagpur',
    state: 'Maharashtra',
    address: 'Main Market Road',
    pincode: '440001',
    customerType: 'Retail',
    openingBalance: 5000,
    creditLimit: 25000,
    paymentTerms: 'Immediate',
  },
];

const CustomerMasterScreen = ({navigation}: Props) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [gstin, setGstin] = useState('');
  const [customerType, setCustomerType] = useState('');
  const [openingBalance, setOpeningBalance] = useState('');
  const [creditLimit, setCreditLimit] = useState('');

  const resetForm = () => {
    setName('');
    setMobile('');
    setEmail('');
    setAddress('');
    setCity('');
    setState('');
    setPincode('');
    setGstin('');
    setCustomerType('');
    setOpeningBalance('');
    setCreditLimit('');
  };

  const handleAddCustomer = () => {
    if (!name.trim() || !mobile.trim()) {
      Alert.alert('Validation Error', 'Customer Name and Mobile are required');
      return;
    }

    const newCust: Customer = {
      id: Date.now().toString(),
      name: name.trim(),
      mobile: mobile.trim(),
      email: email.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      gstin: gstin.trim(),
      customerType,
      openingBalance: parseFloat(openingBalance) || 0,
      creditLimit: parseFloat(creditLimit) || 0,
    };

    setCustomers([newCust, ...customers]);
    resetForm();
    setModalVisible(false);
    Alert.alert('Success', `Customer "${newCust.name}" added to Customer Master!`);
  };

  const filteredCustomers = customers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.mobile.includes(searchQuery) ||
    c.city.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>â†</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Customer Master</Text>
          <Text style={styles.headerSubtitle}>People & businesses who buy from you</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Customer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>ðŸ”</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customer name, mobile or city..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        <Text style={styles.sectionTitle}>
          Customer Directory ({filteredCustomers.length})
        </Text>

        {filteredCustomers.map(cust => (
          <View key={cust.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <View style={styles.custIconCircle}>
                <Text style={styles.custIconText}>ðŸ‘¤</Text>
              </View>
              <View style={styles.custHeaderInfo}>
                <View style={styles.nameRow}>
                  <Text style={styles.custName}>{cust.name}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>{cust.customerType}</Text>
                  </View>
                </View>
                <Text style={styles.subText}>ðŸ“± {cust.mobile} â€¢ {cust.city}, {cust.state}</Text>
              </View>
            </View>

            {/* DETAILS GRID */}
            <View style={styles.detailsGrid}>
              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>GSTIN</Text>
                <Text style={styles.detailVal}>{cust.gstin || 'Unregistered'}</Text>
              </View>

              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Opening Balance</Text>
                <Text style={styles.detailValGreen}>â‚¹{cust.openingBalance.toLocaleString()}</Text>
              </View>

              <View style={styles.detailCol}>
                <Text style={styles.detailLabel}>Credit Limit</Text>
                <Text style={styles.detailVal}>â‚¹{cust.creditLimit.toLocaleString()}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* ADD CUSTOMER MODAL */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Customer Master</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.modalCloseText}>âœ•</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* SECTION: BASIC INFO */}
              <Text style={styles.formSectionHeader}>1. Basic Information</Text>
              <Text style={styles.inputLabel}>Customer Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter customer name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Mobile Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    value={mobile}
                    onChangeText={setMobile}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Email</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter email address"
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
              </View>

              {/* SECTION: ADDRESS */}
              <Text style={styles.formSectionHeader}>2. Address Information</Text>
              <Text style={styles.inputLabel}>Address</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter address"
                placeholderTextColor="#94a3b8"
                value={address}
                onChangeText={setAddress}
              />

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>City</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    placeholderTextColor="#94a3b8"
                    value={city}
                    onChangeText={setCity}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>State</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter state"
                    placeholderTextColor="#94a3b8"
                    value={state}
                    onChangeText={setState}
                  />
                </View>
              </View>

              {/* SECTION: TAX & FINANCIAL */}
              <Text style={styles.formSectionHeader}>3. Tax & Financial</Text>
              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>GSTIN</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter GSTIN"
                    placeholderTextColor="#94a3b8"
                    autoCapitalize="characters"
                    value={gstin}
                    onChangeText={setGstin}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Customer Type</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter customer type"
                    placeholderTextColor="#94a3b8"
                    value={customerType}
                    onChangeText={setCustomerType}
                  />
                </View>
              </View>

              <View style={styles.rowTwo}>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Opening Balance (â‚¹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter opening balance"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={openingBalance}
                    onChangeText={setOpeningBalance}
                  />
                </View>
                <View style={styles.colHalf}>
                  <Text style={styles.inputLabel}>Credit Limit (â‚¹)</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter credit limit"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={creditLimit}
                    onChangeText={setCreditLimit}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveModalBtn}
                onPress={handleAddCustomer}>
                <Text style={styles.saveModalBtnText}>Save Customer</Text>
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
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 42,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingRight: 12,
  },
  backText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#c7d2fe',
  },
  addBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    padding: 16,
  },
  searchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  custIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  custIconText: {
    fontSize: 18,
  },
  custHeaderInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  custName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  typeBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4338ca',
  },
  subText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
  },
  detailVal: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
  },
  detailValGreen: {
    fontSize: 12,
    fontWeight: '700',
    color: '#16a34a',
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#4338ca',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  formSectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4338ca',
    marginTop: 10,
    marginBottom: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginTop: 6,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  rowTwo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  colHalf: {
    width: '48.5%',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  cancelModalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelModalBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  saveModalBtn: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveModalBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
