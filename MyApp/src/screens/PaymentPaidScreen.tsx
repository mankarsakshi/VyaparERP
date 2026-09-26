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
import { API_BASE_URL } from '../api/config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { pick, types } from '@react-native-documents/picker';
import { addPaymentPaidRecord } from '../utils/paymentPaidStore';

// Vector Back Arrow Icon matching the screenshot style (rounded container arrow)
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

// Reset Icon
const ResetIcon = () => (
  <Text style={{ fontSize: 14 }}>🔄</Text>
);

// History Icon
const HistoryIcon = () => (
  <Text style={{ fontSize: 14 }}>📋</Text>
);

type Supplier = {
  id: string;
  name: string;
  phone?: string;
  company?: string;
  email?: string;
  gstin?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
};

type PurchaseBill = {
  id: string;
  invoice_number: string;
  purchase_date?: string;
  total_amount: number;
  paid_amount: number;
  supplier_id?: string;
  supplier_name?: string;
};

const DEMO_SUPPLIERS: Supplier[] = [
  { id: '1', name: 'Mankar Sakshi Traders', phone: '9876543210', company: 'Sakshi Trading Co.', email: 'sakshi@traders.com', gstin: '27AAAAA0000A1Z5', address: 'Shop 12, Market Yard, Pune, Maharashtra' },
  { id: '2', name: 'Sharma Electricals & Hardware', phone: '9812345678', company: 'Sharma Hardware', email: 'sharma@hardware.com', gstin: '27BBBBB1111B1Z2', address: 'Plot 45, MIDC Area, Mumbai, Maharashtra' },
  { id: '3', name: 'Gupta Wholesale Suppliers', phone: '9765432109', company: 'Gupta & Sons', email: 'gupta@wholesale.com', gstin: '27CCCCC2222C1Z9', address: 'Shop 88, Sector 18, Noida, Uttar Pradesh' },
  { id: '4', name: 'Apex Industrial Corporation', phone: '9654321098', company: 'Apex Corp', email: 'apex@corp.com', gstin: '27DDDDD3333D1Z4', address: 'Industrial Estate, Phase II, New Delhi' },
];

const DEMO_BILLS: PurchaseBill[] = [
  { id: 'b1', invoice_number: 'PUR-2026-001', total_amount: 50000, paid_amount: 20000, supplier_id: '1', supplier_name: 'Mankar Sakshi Traders' },
  { id: 'b2', invoice_number: 'PUR-2026-002', total_amount: 75000, paid_amount: 45000, supplier_id: '1', supplier_name: 'Mankar Sakshi Traders' },
  { id: 'b3', invoice_number: 'INV-1088', total_amount: 32000, paid_amount: 12000, supplier_id: '2', supplier_name: 'Sharma Electricals & Hardware' },
  { id: 'b4', invoice_number: 'INV-1092', total_amount: 120000, paid_amount: 80000, supplier_id: '3', supplier_name: 'Gupta Wholesale Suppliers' },
];

const PAYMENT_MODES = ['UPI', 'Cash', 'Net Banking', 'Cheque', 'Bank Transfer', 'Card'];

const PaymentPaidScreen = ({ navigation }: any) => {
  // Form State
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [supplierGSTIN, setSupplierGSTIN] = useState('');
  const [supplierAddress, setSupplierAddress] = useState('');

  const [selectedBill, setSelectedBill] = useState<PurchaseBill | null>(null);

  const [billAmount, setBillAmount] = useState<number>(50000);
  const [previousPaid, setPreviousPaid] = useState<number>(20000);
  const [remainingAmount, setRemainingAmount] = useState<number>(30000);

  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const [paymentAmount, setPaymentAmount] = useState<string>('30000');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [paymentDate, setPaymentDate] = useState<string>(formatDate(new Date()));
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [paymentMode, setPaymentMode] = useState<string>('UPI');
  const [transactionNo, setTransactionNo] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);

  const selectDocument = async () => {
    try {
      const result = await pick({
        type: [types.pdf, types.doc, types.docx, types.images],
      });
      if (result && result.length > 0) {
        setSelectedAttachment(result[0]);
      }
    } catch (error) {
      console.log('Document selection cancelled or failed:', error);
    }
  };

  // Dropdown States
  const [showSupplierDropdown, setShowSupplierDropdown] = useState(false);
  const [showBillDropdown, setShowBillDropdown] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Search Inputs
  const [billSearch, setBillSearch] = useState('');

  // API State
  const [suppliers, setSuppliers] = useState<Supplier[]>(DEMO_SUPPLIERS);
  const [bills, setBills] = useState<PurchaseBill[]>(DEMO_BILLS);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [loadingBills, setLoadingBills] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  // Fetch Suppliers & Bills from API
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true);
        const res = await fetch(`${API_BASE_URL}/api/suppliers`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.suppliers || data?.data || [];
        if (list.length > 0) {
          const formatted: Supplier[] = list.map((item: any) => ({
            id: String(item.id ?? item.supplier_id ?? ''),
            name: item.name ?? item.supplier_name ?? item.company_name ?? 'Supplier',
            phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
            company: item.company_name ?? '',
            email: item.email ?? '',
            gstin: item.gstin ?? item.gst_number ?? '',
            address: item.address ?? '',
            city: item.city ?? '',
            state: item.state ?? '',
            pincode: item.pincode ?? '',
          }));
          setSuppliers(formatted);
        }
      } catch (err) {
        console.log('Error fetching suppliers:', err);
      } finally {
        setLoadingSuppliers(false);
      }
    };

    const fetchBills = async () => {
      try {
        setLoadingBills(true);
        const res = await fetch(`${API_BASE_URL}/api/purchases`);
        const data = await res.json();
        const list = Array.isArray(data) ? data : data?.purchases || data?.data || [];
        if (list.length > 0) {
          const formatted: PurchaseBill[] = list.map((item: any) => {
            const tot = Number(item.total_amount ?? item.subtotal ?? 0);
            const pd = Number(item.paid_amount ?? item.amount_paid ?? 0);
            return {
              id: String(item.id ?? item.purchase_id ?? ''),
              invoice_number: item.invoice_number ?? item.bill_no ?? `PUR-${item.id}`,
              purchase_date: item.purchase_date,
              total_amount: tot,
              paid_amount: pd,
              supplier_id: String(item.supplier_id ?? ''),
              supplier_name: item.supplier_name ?? '',
            };
          });
          setBills(formatted);
        }
      } catch (err) {
        console.log('Error fetching purchases:', err);
      } finally {
        setLoadingBills(false);
      }
    };

    fetchSuppliers();
    fetchBills();
  }, []);

  const toggleSupplierDropdown = () => {
    setShowSupplierDropdown(prev => !prev);
    setShowBillDropdown(false);
    setShowModeDropdown(false);
  };

  const toggleBillDropdown = () => {
    setShowBillDropdown(prev => !prev);
    setShowSupplierDropdown(false);
    setShowModeDropdown(false);
  };

  const toggleModeDropdown = () => {
    setShowModeDropdown(prev => !prev);
    setShowSupplierDropdown(false);
    setShowBillDropdown(false);
  };

  const closeAllDropdowns = () => {
    setShowSupplierDropdown(false);
    setShowBillDropdown(false);
    setShowModeDropdown(false);
  };

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setSupplierSearch(supplier.name);
    setSupplierPhone(supplier.phone || '');
    setSupplierEmail(supplier.email || '');
    setSupplierGSTIN(supplier.gstin || '');
    const addressParts = [supplier.address, supplier.city, supplier.state, supplier.pincode].filter(Boolean);
    setSupplierAddress(addressParts.length > 0 ? addressParts.join(', ') : (supplier.address || ''));
    setShowSupplierDropdown(false);
    if (selectedBill && selectedBill.supplier_id && selectedBill.supplier_id !== supplier.id && selectedBill.supplier_name !== supplier.name) {
      setSelectedBill(null);
      setBillSearch('');
    }
  };

  const handleSelectBill = (bill: PurchaseBill) => {
    setSelectedBill(bill);
    setBillSearch(bill.invoice_number);
    setBillAmount(bill.total_amount);
    setPreviousPaid(bill.paid_amount);
    const rem = Math.max(0, bill.total_amount - bill.paid_amount);
    setRemainingAmount(rem);
    setPaymentAmount(rem > 0 ? String(rem) : '');
    if (bill.supplier_id || bill.supplier_name) {
      const found = suppliers.find(s => s.id === bill.supplier_id || s.name === bill.supplier_name);
      if (found) {
        handleSelectSupplier(found);
      }
    }
    setShowBillDropdown(false);
  };

  const resetForm = () => {
    setSelectedSupplier(null);
    setSelectedBill(null);
    setSupplierSearch('');
    setSupplierPhone('');
    setSupplierEmail('');
    setSupplierGSTIN('');
    setSupplierAddress('');
    setBillSearch('');
    setBillAmount(50000);
    setPreviousPaid(20000);
    setRemainingAmount(30000);
    setPaymentAmount('30000');
    const today = new Date();
    setSelectedDate(today);
    setPaymentDate(formatDate(today));
    setPaymentMode('UPI');
    setTransactionNo('');
    setRemarks('');
    setSelectedAttachment(null);
    closeAllDropdowns();
    setShowDatePicker(false);
  };

  const filteredSuppliers = suppliers.filter(s => {
    const q = supplierSearch.toLowerCase().trim();
    if (!q) return true;
    return (
      (s.name || '').toLowerCase().includes(q) ||
      (s.company || '').toLowerCase().includes(q) ||
      (s.phone || '').includes(q) ||
      (s.email || '').toLowerCase().includes(q) ||
      (s.gstin || '').toLowerCase().includes(q)
    );
  });

  const filteredBills = bills.filter(b => {
    const q = billSearch.toLowerCase().trim();
    const matchesSearch = !q || (b.invoice_number || '').toLowerCase().includes(q);
    if (!selectedSupplier) return matchesSearch;
    return matchesSearch && (!b.supplier_id || b.supplier_id === selectedSupplier.id || b.supplier_name === selectedSupplier.name);
  });

  const handleSavePayment = async () => {
    let currentSupplier = selectedSupplier;
    if (!currentSupplier && supplierSearch.trim()) {
      const match = suppliers.find(s => s.name.toLowerCase().trim() === supplierSearch.toLowerCase().trim());
      if (match) currentSupplier = match;
    }

    let currentBill = selectedBill;
    if (!currentBill && billSearch.trim()) {
      const match = bills.find(b => b.invoice_number.toLowerCase().trim() === billSearch.toLowerCase().trim());
      if (match) currentBill = match;
    }

    if (!currentSupplier && !currentBill) {
      Alert.alert('Required Field', 'Please select a Supplier or Purchase Bill.');
      return;
    }

    if (!paymentAmount || Number(paymentAmount) <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid Payment Amount.');
      return;
    }

    if (!paymentMode) {
      Alert.alert('Required Field', 'Please select a Payment Mode.');
      return;
    }

    if (!selectedAttachment) {
      Alert.alert('Required Field', 'Attachment is mandatory. Please attach a payment receipt or proof document.');
      return;
    }

    try {
      const newRecord = {
        id: `pay_${Date.now()}`,
        voucherNo: `PAY-2026-${String(Math.floor(Math.random() * 900) + 100)}`,
        paymentDate: paymentDate,
        supplierName: currentSupplier?.name || supplierSearch.trim() || 'Supplier',
        supplierPhone: supplierPhone || currentSupplier?.phone || '',
        supplierEmail: supplierEmail || currentSupplier?.email || '',
        supplierGSTIN: supplierGSTIN || currentSupplier?.gstin || '',
        supplierAddress: supplierAddress || currentSupplier?.address || '',
        billNo: currentBill?.invoice_number || billSearch.trim() || '',
        billAmount: Number(billAmount) || 0,
        previousPaid: Number(previousPaid) || 0,
        remainingAmount: Math.max(0, Number(remainingAmount) - Number(paymentAmount)),
        paymentAmount: Number(paymentAmount) || 0,
        paymentMode: paymentMode,
        transactionNo: transactionNo || `TXN-${Date.now().toString().slice(-6)}`,
        remarks: remarks || '',
        attachmentName: selectedAttachment?.name || selectedAttachment?.fileName || 'Receipt_Doc.pdf',
        createdAt: new Date().toISOString(),
      };

      await addPaymentPaidRecord(newRecord);
    } catch (err) {
      console.log('Error saving payment record to store:', err);
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      Alert.alert(
        'Success',
        `Payment of ₹${Number(paymentAmount).toLocaleString('en-IN')} recorded successfully!`,
        [
          {
            text: 'View History',
            onPress: () => navigation.navigate('PaymentPaidHistory'),
          },
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    }, 800);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}>
        
        {/* ================================================= */}
        {/* HEADER (MATCHING SCREENSHOT STYLE)                */}
        {/* ================================================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.roundedBackButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <BackArrowIcon />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Payment Paid</Text>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.roundedHeaderActionButton}
              onPress={() => {
                Alert.alert('Reset Form', 'Clear all details?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Reset', style: 'destructive', onPress: resetForm },
                ]);
              }}
              activeOpacity={0.7}>
              <ResetIcon />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.roundedHeaderActionButton}
              onPress={() => navigation.navigate('PaymentPaidHistory')}
              activeOpacity={0.7}>
              <HistoryIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* ================================================= */}
        {/* FORM CONTENT WITH CARDS & INPUTS                 */}
        {/* ================================================= */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          onScrollBeginDrag={closeAllDropdowns}>

          {savedSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✓ Payment recorded successfully!
              </Text>
            </View>
          )}

          {/* ================================================= */}
          {/* CARD 1: SUPPLIER INFORMATION                      */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 1000 }]}>
            <Text style={styles.cardTitle}>Supplier Information</Text>

            {/* Supplier Name * */}
            <Text style={styles.fieldLabel}>Supplier Name *</Text>
            <View style={styles.dropdownContainer}>
              <View style={styles.searchableInputBox}>
                <TextInput
                  style={styles.searchableTextInput}
                  placeholder="Search or enter supplier name..."
                  placeholderTextColor="#94a3b8"
                  value={supplierSearch}
                  onFocus={() => {
                    setShowSupplierDropdown(true);
                    setShowBillDropdown(false);
                    setShowModeDropdown(false);
                  }}
                  onChangeText={text => {
                    setSupplierSearch(text);
                    if (selectedSupplier && text !== selectedSupplier.name) {
                      setSelectedSupplier(null);
                    }
                    setShowSupplierDropdown(true);
                  }}
                />
                <TouchableOpacity
                  style={styles.chevronTouchBtn}
                  onPress={toggleSupplierDropdown}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.chevronArrow}>{showSupplierDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              </View>

              {showSupplierDropdown && (
                <View style={styles.inlineDropdownMenu}>
                  {loadingSuppliers ? (
                    <ActivityIndicator size="small" color="#ea7e30" style={{ padding: 12 }} />
                  ) : filteredSuppliers.length === 0 ? (
                    <Text style={styles.emptyText}>No suppliers found</Text>
                  ) : (
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 180 }}>
                      {filteredSuppliers.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownMenuItem}
                          onPress={() => handleSelectSupplier(item)}>
                          <Text style={styles.menuMainText}>{item.name}</Text>
                          {!!item.phone && (
                            <Text style={styles.menuSubText}>
                              {item.phone}{item.company ? ` • ${item.company}` : ''}
                            </Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* Row: Phone Number & Email Address */}
            <View style={[styles.twoColRow, { marginTop: 12 }]}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput
                  style={styles.inputBoxText}
                  placeholder="Phone number"
                  placeholderTextColor="#94a3b8"
                  value={supplierPhone}
                  onChangeText={setSupplierPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Email Address</Text>
                <TextInput
                  style={styles.inputBoxText}
                  placeholder="Email address"
                  placeholderTextColor="#94a3b8"
                  value={supplierEmail}
                  onChangeText={setSupplierEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* GSTIN / Tax ID */}
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>GSTIN / Tax ID</Text>
            <TextInput
              style={styles.inputBoxText}
              placeholder="Enter GSTIN / Tax ID"
              placeholderTextColor="#94a3b8"
              value={supplierGSTIN}
              onChangeText={setSupplierGSTIN}
              autoCapitalize="characters"
            />

            {/* Supplier Address */}
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Supplier Address</Text>
            <TextInput
              style={[styles.inputBoxText, styles.addressTextArea]}
              placeholder="Enter supplier address"
              placeholderTextColor="#94a3b8"
              value={supplierAddress}
              onChangeText={setSupplierAddress}
              multiline
              numberOfLines={2}
              textAlignVertical="top"
            />
          </View>

          {/* ================================================= */}
          {/* CARD 2: BILL SUMMARY & BALANCES                   */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 900 }]}>
            <Text style={styles.cardTitle}>Bill Summary & Balance</Text>

            {/* Purchase / Bill No. * */}
            <Text style={styles.fieldLabel}>Purchase / Bill No. *</Text>
            <View style={[styles.dropdownContainer, { marginBottom: 12 }]}>
              <View style={styles.searchableInputBox}>
                <TextInput
                  style={styles.searchableTextInput}
                  placeholder="Search / select bill..."
                  placeholderTextColor="#94a3b8"
                  value={billSearch}
                  onFocus={() => {
                    setShowBillDropdown(true);
                    setShowSupplierDropdown(false);
                    setShowModeDropdown(false);
                  }}
                  onChangeText={text => {
                    setBillSearch(text);
                    if (selectedBill && text !== selectedBill.invoice_number) {
                      setSelectedBill(null);
                    }
                    setShowBillDropdown(true);
                  }}
                />
                <TouchableOpacity
                  style={styles.chevronTouchBtn}
                  onPress={toggleBillDropdown}
                  activeOpacity={0.7}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                  <Text style={styles.chevronArrow}>{showBillDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>
              </View>

              {showBillDropdown && (
                <View style={styles.inlineDropdownMenu}>
                  {loadingBills ? (
                    <ActivityIndicator size="small" color="#ea7e30" style={{ padding: 12 }} />
                  ) : filteredBills.length === 0 ? (
                    <Text style={styles.emptyText}>No bills found</Text>
                  ) : (
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 180 }}>
                      {filteredBills.map(item => (
                        <TouchableOpacity
                          key={item.id}
                          style={styles.dropdownMenuItem}
                          onPress={() => handleSelectBill(item)}>
                          <Text style={styles.menuMainText}>{item.invoice_number}</Text>
                          <Text style={styles.menuSubText}>
                            Bill: ₹{item.total_amount.toLocaleString('en-IN')} | Paid: ₹{item.paid_amount.toLocaleString('en-IN')}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  )}
                </View>
              )}
            </View>

            {/* Row: Bill Amount & Previous Paid */}
            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Bill Amount</Text>
                <View style={styles.readOnlyDisplayBox}>
                  <Text style={styles.readOnlyValueText}>₹{billAmount.toLocaleString('en-IN')}</Text>
                </View>
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Previous Paid</Text>
                <View style={styles.readOnlyDisplayBox}>
                  <Text style={styles.readOnlyValueText}>₹{previousPaid.toLocaleString('en-IN')}</Text>
                </View>
              </View>
            </View>

            {/* Outstanding Remaining Balance Badge */}
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Remaining Amount</Text>
            <View style={styles.remainingBadgeBox}>
              <Text style={styles.remainingBadgeLabel}>Outstanding Balance</Text>
              <Text style={styles.remainingBadgeValue}>₹{remainingAmount.toLocaleString('en-IN')}</Text>
            </View>
          </View>

          {/* ================================================= */}
          {/* CARD 3: PAYMENT DETAILS                           */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 700 }]}>
            <Text style={styles.cardTitle}>Payment Details</Text>

            {/* Row: Payment Amount * & Payment Date * */}
            <View style={styles.twoColRow}>
              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Payment Amount *</Text>
                <View style={styles.amountInputWrap}>
                  <Text style={styles.rupeePrefix}>₹</Text>
                  <TextInput
                    style={styles.amountTextInput}
                    placeholder="Enter amount"
                    placeholderTextColor="#94a3b8"
                    keyboardType="numeric"
                    value={paymentAmount}
                    onChangeText={setPaymentAmount}
                  />
                </View>
              </View>

              <View style={styles.colHalf}>
                <Text style={styles.fieldLabel}>Payment Date *</Text>
                <TouchableOpacity
                  style={styles.dateInputWrap}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.8}>
                  <TextInput
                    style={styles.dateTextInput}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor="#94a3b8"
                    value={paymentDate}
                    onChangeText={setPaymentDate}
                    onFocus={() => setShowDatePicker(true)}
                  />
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Text style={{ fontSize: 16, marginRight: 10 }}>📅</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              </View>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) {
                    setSelectedDate(date);
                    setPaymentDate(formatDate(date));
                  }
                }}
              />
            )}

            {/* Payment Mode * */}
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Payment Mode *</Text>
            <View style={[styles.dropdownContainer, { zIndex: 650 }]}>
              <TouchableOpacity
                style={styles.inputBox}
                onPress={toggleModeDropdown}
                activeOpacity={0.7}>
                <Text style={styles.inputText}>{paymentMode || 'Select Payment Mode'}</Text>
                <Text style={styles.chevronArrow}>{showModeDropdown ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showModeDropdown && (
                <View style={styles.inlineDropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{ maxHeight: 160 }}>
                    {PAYMENT_MODES.map(mode => (
                      <TouchableOpacity
                        key={mode}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setPaymentMode(mode);
                          setShowModeDropdown(false);
                        }}>
                        <Text style={styles.menuMainText}>{mode}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* ================================================= */}
          {/* CARD 4: TRANSACTION & REMARKS                     */}
          {/* ================================================= */}
          <View style={[styles.card, { zIndex: 500 }]}>
            <Text style={styles.cardTitle}>Transaction & Remarks</Text>

            {/* Reference / Transaction No. */}
            <Text style={styles.fieldLabel}>Reference / Transaction No.</Text>
            <TextInput
              style={styles.inputBoxText}
              placeholder="Enter transaction number"
              placeholderTextColor="#94a3b8"
              value={transactionNo}
              onChangeText={setTransactionNo}
            />

            {/* Notes / Remarks */}
            <Text style={[styles.fieldLabel, { marginTop: 12 }]}>Notes / Remarks</Text>
            <TextInput
              style={[styles.inputBoxText, styles.textAreaInput]}
              placeholder="Enter remarks..."
              placeholderTextColor="#94a3b8"
              value={remarks}
              onChangeText={setRemarks}
              multiline
              numberOfLines={3}
            />

            {/* Attachments * (Mandatory) */}
            <Text style={[styles.fieldLabel, { marginTop: 14 }]}>
              Attachments <Text style={styles.requiredAsterisk}></Text>
            </Text>

            <TouchableOpacity
              style={styles.uploadBox}
              onPress={selectDocument}
              activeOpacity={0.7}>
              <Text style={styles.uploadIcon}>📎</Text>
              <Text style={styles.uploadBoxText}>
                {selectedAttachment ? 'Change Attached Document' : 'Upload Payment Receipt / Proof'}
              </Text>
              <Text style={styles.uploadSubText}>
                Supports PDF, DOC, DOCX, Images (Mandatory)
              </Text>
            </TouchableOpacity>

            {selectedAttachment && (
              <View style={styles.attachedFileBox}>
                <View style={styles.attachedFileInfo}>
                  <Text style={styles.attachedFileIcon}>📄</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.attachedFileName} numberOfLines={1}>
                      {selectedAttachment.name || selectedAttachment.fileName || 'Attached Document'}
                    </Text>
                    {!!selectedAttachment.size && (
                      <Text style={styles.attachedFileSize}>
                        {(Number(selectedAttachment.size) / 1024).toFixed(1)} KB
                      </Text>
                    )}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedAttachment(null)}
                  style={styles.removeFileBtn}
                  activeOpacity={0.7}>
                  <Text style={styles.removeFileText}>✕ Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* ================================================= */}
          {/* SAVE PAYMENT BUTTON                               */}
          {/* ================================================= */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSavePayment}
            activeOpacity={0.8}>
            <Text style={styles.submitBtnText}>Save Payment</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PaymentPaidScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6fa',
  },

  /* HEADER (MATCHING SCREENSHOT STYLE WITH TOP STATUS BAR CLEARANCE) */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ? StatusBar.currentHeight + 6 : 26) : 12,
    paddingBottom: 10,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eef5',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 3,
  },
  roundedBackButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8eef5',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0b192c',
    flex: 1,
    marginLeft: 10,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roundedHeaderActionButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8eef5',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    paddingTop: 6,
  },
  successBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  successBannerText: {
    color: '#047857',
    fontWeight: '600',
    fontSize: 14,
  },

  /* CARD CONTAINERS (ROUNDED & SMOOTH) */
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eef5',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },

  /* TWO-COLUMN SIDE-BY-SIDE ROW */
  twoColRow: {
    flexDirection: 'row',
    gap: 12,
  },
  colHalf: {
    flex: 1,
  },

  /* INPUT FIELDS (SOFT BACKGROUND #f4f7fc) */
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  searchableInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 6,
    height: 48,
  },
  searchableTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    padding: 0,
    height: '100%',
  },
  chevronTouchBtn: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputBoxText: {
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 14,
    color: '#0f172a',
  },
  inputText: {
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
    flex: 1,
  },
  placeholderText: {
    color: '#94a3b8',
    fontWeight: '400',
  },
  chevronArrow: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '700',
    marginLeft: 6,
  },
  textAreaInput: {
    height: 80,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  addressTextArea: {
    height: 72,
    paddingVertical: 10,
    textAlignVertical: 'top',
  },

  /* READ ONLY DISPLAY BOX */
  readOnlyDisplayBox: {
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    justifyContent: 'center',
  },
  readOnlyValueText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  /* REMAINING BADGE BOX */
  remainingBadgeBox: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  remainingBadgeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#047857',
  },
  remainingBadgeValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#059669',
  },

  /* AMOUNT INPUT WITH RUPEE BADGE */
  amountInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 48,
  },
  rupeePrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: '#ea7e30',
    paddingLeft: 14,
    paddingRight: 4,
  },
  amountTextInput: {
    flex: 1,
    height: 48,
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
    paddingRight: 12,
  },

  /* DATE INPUT WRAP */
  dateInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f4f7fc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    height: 48,
  },
  dateTextInput: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
  },

  /* DROPDOWN MENU INLINE */
  dropdownContainer: {
    position: 'relative',
  },
  inlineDropdownMenu: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 12,
    marginTop: 4,
    padding: 6,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInputInsideMenu: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
    color: '#0f172a',
    marginBottom: 6,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuMainText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  menuSubText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 12,
  },

  /* SUBMIT BUTTON */
  submitBtn: {
    backgroundColor: '#ea7e30',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#ea7e30',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  /* ATTACHMENT SECTION STYLES */
  requiredAsterisk: {
    color: '#ef4444',
    fontWeight: '700',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    marginTop: 4,
  },
  uploadIcon: {
    fontSize: 22,
    marginBottom: 4,
  },
  uploadBoxText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#334155',
  },
  uploadSubText: {
    fontSize: 11.5,
    color: '#94a3b8',
    marginTop: 2,
  },
  attachedFileBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  attachedFileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  attachedFileIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  attachedFileName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0f172a',
  },
  attachedFileSize: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },
  removeFileBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderRadius: 6,
  },
  removeFileText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#ef4444',
  },
});
