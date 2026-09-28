import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StatusBar,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { API_BASE_URL } from '../api/config';
import { addPaymentReceivedRecord, getPaymentReceivedSync } from '../utils/paymentReceivedStore';

// Vector Back Arrow Icon
const BackArrowIcon = () => (
  <View style={{ width: 18, height: 18, justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ position: 'absolute', width: 11, height: 2, backgroundColor: '#0f172a', borderRadius: 1 }} />
    <View
      style={{
        position: 'absolute',
        left: 3,
        width: 6.5,
        height: 6.5,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#0f172a',
        borderRadius: 1,
        transform: [{ rotate: '-45deg' }],
      }}
    />
  </View>
);

type Customer = {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  gstin?: string;
  address?: string;
};

const DEMO_CUSTOMERS: Customer[] = [
  {
    id: '1',
    name: 'Mankar Sakshi Traders',
    phone: '9876543210',
    email: 'sakshi.traders@gmail.com',
    gstin: '27AAAAA0000A1Z5',
    address: 'Shop 12, Market Yard, Pune',
  },
  {
    id: '2',
    name: 'Sharma Electricals & Hardware',
    phone: '9812345678',
    email: 'sharma.elec@yahoo.com',
    gstin: '27BBBBB1111B1Z2',
    address: 'Plot 45, MIDC, Mumbai',
  },
  {
    id: '3',
    name: 'Gupta Wholesale Suppliers',
    phone: '9765432109',
    email: 'gupta.wholesale@gmail.com',
    gstin: '09CCCCC2222C1Z8',
    address: 'Shop 88, Sector 18, Noida',
  },
  {
    id: '4',
    name: 'Rahul Verma',
    phone: '9845612300',
    email: 'rahul.verma@outlook.com',
    gstin: '29DDDDD3333D1Z4',
    address: 'MG Road, Bengaluru',
  },
  {
    id: '5',
    name: 'Priya Sharma Enterprises',
    phone: '9712345678',
    email: 'priya.ent@gmail.com',
    gstin: '27EEEEE4444E1Z1',
    address: 'Kothrud, Pune',
  },
];

const PAYMENT_MODES = [
  'Cash',
  'UPI',
  'Cheque',
  'Bank Transfer',
  'Card',
  'Net Banking',
];

type SaleInvoice = {
  id: string;
  invoice_number: string;
  total_amount: number;
  received_amount: number;
  customer_name?: string;
};

const DEMO_SALE_INVOICES: SaleInvoice[] = [
  { id: '1', invoice_number: 'INV-1025', total_amount: 50000, received_amount: 25000, customer_name: 'Mankar Sakshi Traders' },
  { id: '2', invoice_number: 'INV-1026', total_amount: 35000, received_amount: 15000, customer_name: 'Sharma Electricals & Hardware' },
  { id: '3', invoice_number: 'INV-1028', total_amount: 80000, received_amount: 38000, customer_name: 'Gupta Wholesale Suppliers' },
  { id: '4', invoice_number: 'INV-1030', total_amount: 25000, received_amount: 13000, customer_name: 'Rahul Verma' },
  { id: '5', invoice_number: 'INV-1035', total_amount: 60000, received_amount: 25000, customer_name: 'Priya Sharma Enterprises' },
  { id: '6', invoice_number: 'None / Advance Payment', total_amount: 0, received_amount: 0 },
];

const formatDateDisplay = (date: Date): string => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

const generateVoucherNo = (): string => {
  try {
    const records = getPaymentReceivedSync ? getPaymentReceivedSync() : [];
    const nextNum = (records.length + 1).toString().padStart(3, '0');
    return `REC-2026-${nextNum}`;
  } catch (e) {
    const random = Math.floor(100 + Math.random() * 900);
    return `REC-2026-${random}`;
  }
};

const PaymentReceivedScreen = ({ navigation, route }: any) => {
  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [voucherNo, setVoucherNo] = useState<string>(() => generateVoucherNo());

  // Section 1: Customer Info
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerGSTIN, setCustomerGSTIN] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Section 2: Bill / Invoice State
  const [againstInvoice, setAgainstInvoice] = useState<string>('INV-1025');
  const [invoiceAmount, setInvoiceAmount] = useState<number>(50000);
  const [previousReceived, setPreviousReceived] = useState<number>(25000);

  // Section 3: Payment Details
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [paymentDate, setPaymentDate] = useState<string>(formatDateDisplay(new Date()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [amountReceived, setAmountReceived] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<string>('Cash');
  const [referenceNumber, setReferenceNumber] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Dropdown visibility states
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showInvoiceDropdown, setShowInvoiceDropdown] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check for editItem in route params
  useEffect(() => {
    const editItem =
      route?.params?.editItem ||
      route?.params?.paymentRecord ||
      route?.params?.item ||
      route?.params?.record ||
      route?.params?.payment ||
      null;

    if (editItem) {
      setEditingId(editItem.id || null);
      setVoucherNo(editItem.voucherNo || generateVoucherNo());
      setCustomerSearch(editItem.customerName || editItem.customer_name || '');
      setCustomerPhone(editItem.customerPhone || editItem.customer_phone || editItem.phone || '');
      setCustomerEmail(editItem.customerEmail || editItem.customer_email || editItem.email || '');
      setCustomerAddress(editItem.customerAddress || editItem.customer_address || editItem.address || '');
      setPaymentDate(editItem.paymentDate || editItem.payment_date || formatDateDisplay(new Date()));
      setAmountReceived(String(editItem.receivedAmount || editItem.amountReceived || editItem.amount || ''));
      setPaymentMode(editItem.paymentMode || editItem.payment_mode || editItem.paymentMethod || 'Cash');
      setReferenceNumber(editItem.referenceNumber || editItem.reference_no || editItem.referenceNo || '');
      setAgainstInvoice(editItem.invoiceNo || editItem.invoice_number || '');
      setNotes(editItem.notes || editItem.note || editItem.remarks || editItem.description || '');

      // Check matching invoice
      const matchingInv = DEMO_SALE_INVOICES.find(
        inv => inv.invoice_number === (editItem.invoiceNo || editItem.invoice_number)
      );
      if (matchingInv) {
        setInvoiceAmount(matchingInv.total_amount);
        setPreviousReceived(matchingInv.received_amount);
      }
    } else {
      if (!voucherNo) {
        setVoucherNo(generateVoucherNo());
      }
    }
  }, [route?.params]);

  // Fetch customers from API with fallback
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);
        const res = await fetch(`${API_BASE_URL}/api/customers`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.customers || data?.data || [];
        if (list.length > 0) {
          const formatted: Customer[] = list.map((item: any) => ({
            id: String(item.id ?? item.customer_id ?? item._id ?? ''),
            name: item.name ?? item.customer_name ?? item.customerName ?? 'Customer',
            phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
            email: item.email ?? item.email_address ?? '',
            gstin: item.gstin ?? item.gst_number ?? item.gstNumber ?? '',
            address: item.address ?? item.customer_address ?? item.billing_address ?? '',
          }));
          setCustomers(formatted);
        }
      } catch (err) {
        console.log('Error loading customers for payment received:', err);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  const closeAllDropdowns = () => {
    setShowCustomerDropdown(false);
    setShowModeDropdown(false);
    setShowInvoiceDropdown(false);
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setPaymentDate(formatDateDisplay(date));
    }
  };

  const filteredCustomers = customers.filter(c => {
    const q = customerSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.phone || '').includes(q) ||
      (c.gstin || '').toLowerCase().includes(q)
    );
  });

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setCustomerSearch(customer.name);
    setCustomerPhone(customer.phone || '');
    setCustomerEmail(customer.email || '');
    setCustomerGSTIN(customer.gstin || '');
    setCustomerAddress(customer.address || '');
    setShowCustomerDropdown(false);

    // Auto-match invoice for customer if available
    const matchingInv = DEMO_SALE_INVOICES.find(
      inv => inv.customer_name && inv.customer_name.toLowerCase().includes(customer.name.toLowerCase())
    );
    if (matchingInv) {
      setAgainstInvoice(matchingInv.invoice_number);
      setInvoiceAmount(matchingInv.total_amount);
      setPreviousReceived(matchingInv.received_amount);
    }
  };

  const handleSelectInvoice = (inv: SaleInvoice) => {
    setAgainstInvoice(inv.invoice_number);
    setInvoiceAmount(inv.total_amount);
    setPreviousReceived(inv.received_amount);
    setShowInvoiceDropdown(false);
  };

  const handleSavePayment = async () => {
    if (!customerSearch.trim()) {
      Alert.alert('Validation', 'Please select a customer.');
      return;
    }

    if (!amountReceived.trim() || Number(amountReceived) <= 0) {
      Alert.alert('Validation', 'Please enter a valid received amount.');
      return;
    }

    setSaving(true);
    try {
      const noteText = (notes || '').trim();
      const newRecord = {
        id: editingId || `rec_${Date.now()}`,
        voucherNo: voucherNo || `REC-2026-${Math.floor(100 + Math.random() * 900)}`,
        paymentDate: paymentDate,
        customerName: customerSearch.trim(),
        customerPhone: customerPhone,
        customerEmail: customerEmail,
        customerAddress: customerAddress,
        invoiceNo: againstInvoice,
        receivedAmount: Number(amountReceived) || 0,
        paymentMode: paymentMode,
        referenceNumber: referenceNumber,
        notes: noteText,
        note: noteText,
        remarks: noteText,
        createdAt: new Date().toISOString(),
      };

      await addPaymentReceivedRecord(newRecord);

      setSaving(false);
      Alert.alert(
        'Success',
        `Payment of ₹${Number(amountReceived).toLocaleString('en-IN')} ${editingId ? 'updated' : 'recorded'} successfully!`,
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('PaymentReceivedHistory'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } catch (err: any) {
      setSaving(false);
      Alert.alert('Error', err?.message || 'Failed to save payment received.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        
        {/* ================================================= */}
        {/* HEADER                                            */}
        {/* ================================================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <BackArrowIcon />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            {editingId ? 'Edit Payment Received' : 'Payment Received'}
          </Text>
        </View>

        {/* ================================================= */}
        {/* SCROLLABLE FORM BODY                              */}
        {/* ================================================= */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeAllDropdowns}>
          
          {/* ================================================= */}
          {/* 1) CUSTOMER INFORMATION                           */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 1000 }]}>
            <Text style={styles.cardTitle}>Customer Information</Text>

            {/* Customer Dropdown */}
            <View style={[styles.fieldGroup, { zIndex: 1000 }]}>
              <Text style={styles.fieldLabel}>Customer *</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setShowModeDropdown(false);
                    setShowInvoiceDropdown(false);
                    setShowCustomerDropdown(!showCustomerDropdown);
                  }}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.selectText,
                      !customerSearch && styles.placeholderText,
                    ]}
                    numberOfLines={1}>
                    {customerSearch || 'Select Customer'}
                  </Text>
                  <Text style={styles.arrowIcon}>
                    {showCustomerDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showCustomerDropdown && (
                  <View style={styles.dropdownMenu}>
                    <TextInput
                      style={styles.dropdownSearchInput}
                      placeholder="Search customer..."
                      placeholderTextColor="#94a3b8"
                      value={customerSearch}
                      onChangeText={setCustomerSearch}
                      autoFocus
                    />
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 180 }}>
                      {loadingCustomers ? (
                        <View style={{ padding: 15, alignItems: 'center' }}>
                          <ActivityIndicator size="small" color="#ea7e30" />
                        </View>
                      ) : filteredCustomers.length === 0 ? (
                        <Text style={styles.emptyText}>No customers found</Text>
                      ) : (
                        filteredCustomers.map(cust => (
                          <TouchableOpacity
                            key={cust.id}
                            style={styles.dropdownMenuItem}
                            onPress={() => handleSelectCustomer(cust)}>
                            <Text style={styles.dropdownMainText}>{cust.name}</Text>
                            {!!(cust.phone || cust.gstin) && (
                              <Text style={styles.dropdownSubText}>
                                {cust.phone ? `📞 ${cust.phone}` : ''}
                                {cust.phone && cust.gstin ? '  •  ' : ''}
                                {cust.gstin ? `GSTIN: ${cust.gstin}` : ''}
                              </Text>
                            )}
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Customer Details: Phone Number & Email Address */}
            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Phone number"
                  placeholderTextColor="#94a3b8"
                  value={customerPhone}
                  onChangeText={setCustomerPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Email address"
                  placeholderTextColor="#94a3b8"
                  value={customerEmail}
                  onChangeText={setCustomerEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Address (Occupying Entire Row) */}
            <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
              <Text style={styles.fieldLabel}>Address</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Customer address"
                placeholderTextColor="#94a3b8"
                value={customerAddress}
                onChangeText={setCustomerAddress}
              />
            </View>
          </View>

          {/* ================================================= */}
          {/* 2) BILL AND SUMMARY BALANCE                       */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 900 }]}>
            <Text style={styles.cardTitle}>Bill and Summary Balance</Text>

            {/* Against Invoice Dropdown */}
            <View style={[styles.fieldGroup, { zIndex: 900 }]}>
              <Text style={styles.fieldLabel}>Against Invoice</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setShowCustomerDropdown(false);
                    setShowModeDropdown(false);
                    setShowInvoiceDropdown(!showInvoiceDropdown);
                  }}
                  activeOpacity={0.8}>
                  <Text
                    style={[
                      styles.selectText,
                      !againstInvoice && styles.placeholderText,
                    ]}
                    numberOfLines={1}>
                    {againstInvoice || 'Select Invoice'}
                  </Text>
                  <Text style={styles.arrowIcon}>
                    {showInvoiceDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showInvoiceDropdown && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 180 }}>
                      {DEMO_SALE_INVOICES.map(inv => (
                        <TouchableOpacity
                          key={inv.id}
                          style={[
                            styles.dropdownMenuItem,
                            againstInvoice === inv.invoice_number && { backgroundColor: '#fff7ed' },
                          ]}
                          onPress={() => handleSelectInvoice(inv)}>
                          <Text
                            style={[
                              styles.dropdownMainText,
                              againstInvoice === inv.invoice_number && { color: '#ea7e30', fontWeight: '700' },
                            ]}>
                            {inv.invoice_number}
                          </Text>
                          {inv.total_amount > 0 && (
                            <Text style={styles.dropdownSubText}>
                              Total: ₹{inv.total_amount.toLocaleString('en-IN')} | Recv: ₹{inv.received_amount.toLocaleString('en-IN')}
                              {inv.customer_name ? ` • ${inv.customer_name}` : ''}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Row: Invoice Amount & Previous Received */}
            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Invoice Amount</Text>
                <View style={styles.readOnlyDisplayBox}>
                  <Text style={styles.readOnlyValueText}>₹{invoiceAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Previous Received</Text>
                <View style={styles.readOnlyDisplayBox}>
                  <Text style={styles.readOnlyValueText}>₹{previousReceived.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            {/* Remaining Balance Summary Badge */}
            <View style={{ marginTop: 2 }}>
              <Text style={styles.fieldLabel}>Remaining Balance</Text>
              <View style={styles.remainingBadgeBox}>
                <Text style={styles.remainingBadgeLabel}>Outstanding Balance</Text>
                <Text style={styles.remainingBadgeValue}>
                  ₹{Math.max(0, invoiceAmount - previousReceived - (Number(amountReceived) || 0)).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>

          {/* ================================================= */}
          {/* 3) PAYMENT DETAILS                                */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 800 }]}>
            <Text style={styles.cardTitle}>Payment Details</Text>

            {/* Row: Payment Date & Voucher No (Autogenerated, Non-Editable) */}
            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Payment Date *</Text>
                <TouchableOpacity
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}>
                  <Text style={styles.datePickerText} numberOfLines={1}>{paymentDate}</Text>
                  <Text style={styles.dateCalendarIcon}>📅</Text>
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                  />
                )}
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Voucher No.</Text>
                <TextInput
                  style={[styles.textInput, styles.readOnlyInput]}
                  value={voucherNo}
                  editable={false}
                  placeholder="Auto-generated"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* Amount Received */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Amount Received *</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.rupeeBadge}>₹</Text>
                <TextInput
                  style={styles.amountInput}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  value={amountReceived}
                  onChangeText={setAmountReceived}
                  keyboardType="decimal-pad"
                />
              </View>
            </View>

            {/* Payment Mode Dropdown */}
            <View style={[styles.fieldGroup, { zIndex: 850 }]}>
              <Text style={styles.fieldLabel}>Payment Mode *</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.selectButton}
                  onPress={() => {
                    setShowCustomerDropdown(false);
                    setShowInvoiceDropdown(false);
                    setShowModeDropdown(!showModeDropdown);
                  }}
                  activeOpacity={0.8}>
                  <Text style={styles.selectText}>{paymentMode}</Text>
                  <Text style={styles.arrowIcon}>
                    {showModeDropdown ? '▲' : '▼'}
                  </Text>
                </TouchableOpacity>

                {showModeDropdown && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView
                      nestedScrollEnabled
                      keyboardShouldPersistTaps="handled"
                      style={{ maxHeight: 180 }}>
                      {PAYMENT_MODES.map(mode => (
                        <TouchableOpacity
                          key={mode}
                          style={[
                            styles.dropdownMenuItem,
                            paymentMode === mode && { backgroundColor: '#fff7ed' },
                          ]}
                          onPress={() => {
                            setPaymentMode(mode);
                            setShowModeDropdown(false);
                          }}>
                          <Text
                            style={[
                              styles.dropdownMainText,
                              paymentMode === mode && { color: '#ea7e30', fontWeight: '700' },
                            ]}>
                            {mode}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* Reference Number */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Reference Number</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Optional (e.g. UPI Ref / Cheque No)"
                placeholderTextColor="#94a3b8"
                value={referenceNumber}
                onChangeText={setReferenceNumber}
              />
            </View>

            {/* Notes */}
            <View style={[styles.fieldGroup, { marginBottom: 0 }]}>
              <Text style={styles.fieldLabel}>Notes</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Add a note..."
                placeholderTextColor="#94a3b8"
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ================================================= */}
          {/* ACTION BUTTONS ROW                                */}
          {/* ================================================= */}
          <View style={styles.actionsRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.saveButton, saving && { opacity: 0.7 }]}
              onPress={handleSavePayment}
              disabled={saving}
              activeOpacity={0.85}>
              {saving ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text style={styles.saveButtonText}>Save Payment</Text>
              )}
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentReceivedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? ((StatusBar.currentHeight || 24) + 8) : 12,
    paddingBottom: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    elevation: 2,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* SCROLL CONTAINER */
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },

  /* SECTION CARDS */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 3,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  /* FIELD GROUP */
  fieldGroup: {
    marginBottom: 16,
  },
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  colHalf: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
  },

  /* DROPDOWN CONTAINER & BUTTONS */
  dropdownContainer: {
    position: 'relative',
  },
  selectButton: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: '#94a3b8',
    fontWeight: '400',
  },
  arrowIcon: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 8,
  },

  /* DROPDOWN MENU OVERLAY */
  dropdownMenu: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 9999,
    overflow: 'hidden',
  },
  dropdownSearchInput: {
    height: 40,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    margin: 8,
    paddingHorizontal: 12,
    fontSize: 13,
    color: '#0f172a',
  },
  dropdownMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  dropdownSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: 16,
    fontSize: 13,
  },

  /* READ ONLY / SUMMARY DISPLAY BOXES */
  readOnlyDisplayBox: {
    height: 48,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  readOnlyValueText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
  },
  remainingBadgeBox: {
    backgroundColor: '#fff7ed',
    borderWidth: 1.5,
    borderColor: '#fed7aa',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  remainingBadgeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c2410c',
  },
  remainingBadgeValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ea7e30',
  },

  /* DATE PICKER BUTTON */
  datePickerButton: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  datePickerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  dateCalendarIcon: {
    fontSize: 16,
  },

  /* AMOUNT INPUT */
  amountInputContainer: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  rupeeBadge: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ea7e30',
    marginRight: 6,
  },
  amountInput: {
    flex: 1,
    height: 48,
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    padding: 0,
  },

  /* TEXT INPUT */
  textInput: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  readOnlyInput: {
    backgroundColor: '#eef2f6',
    color: '#334155',
    fontWeight: '700',
    borderColor: '#cbd5e1',
  },
  notesInput: {
    height: 80,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },

  /* ACTION BUTTONS */
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  saveButton: {
    flex: 1.6,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});
