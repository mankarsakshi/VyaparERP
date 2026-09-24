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
  Modal,
} from 'react-native';
import { API_BASE_URL } from '../api/config';

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

const TrashIcon = () => (
  <View style={{ width: 16, height: 18, alignItems: 'center', marginTop: 2 }}>
    {/* Handle */}
    <View style={{ width: 5, height: 2, borderWidth: 1.5, borderBottomWidth: 0, borderColor: '#ef4444', borderTopLeftRadius: 1.5, borderTopRightRadius: 1.5 }} />
    {/* Lid */}
    <View style={{ width: 14, height: 2, backgroundColor: '#ef4444', borderRadius: 1, marginBottom: 1.5 }} />
    {/* Body */}
    <View style={{ width: 10, height: 11, borderWidth: 1.5, borderTopWidth: 0, borderColor: '#ef4444', borderBottomLeftRadius: 2, borderBottomRightRadius: 2, flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 1.5 }}>
      <View style={{ width: 1.2, height: 6, backgroundColor: '#ef4444', borderRadius: 1 }} />
      <View style={{ width: 1.2, height: 6, backgroundColor: '#ef4444', borderRadius: 1 }} />
    </View>
  </View>
);

type Customer = {
  id: string;
  name: string;
  phone: string;
  gstin: string;
  address?: string;
  state?: string;
  pincode?: string;
};

const CreditNoteScreen = ({ navigation }: any) => {
  const [creditNoteNo, setCreditNoteNo] = useState('CN-001');
  const [date, setDate] = useState('22-09-2026');
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showReasons, setShowReasons] = useState(false);
  const REASONS = [
    'Sales Return',
    'Post Sale Discount',
    'Deficiency in services',
    'Other'
  ];
  
  const [customer, setCustomer] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [defaultGstRate, setDefaultGstRate] = useState('18%');
  const [showDefaultGstRates, setShowDefaultGstRates] = useState(false);
  const DEFAULT_GST_RATES = ['0%', '5%', '12%', '18%', '28%'];
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  const loadCustomersFromDB = async () => {
    try {
      setLoadingCustomers(true);
      const response = await fetch(`${API_BASE_URL}/api/customers`);
      const data = await response.json();
      const customerData = Array.isArray(data) ? data : data?.customers || data?.data || [];
      const formattedCustomers: Customer[] = customerData.map((item: any) => ({
        id: String(item.id ?? item.customer_id ?? item.customerId ?? ''),
        name: item.name ?? item.customer_name ?? item.customerName ?? '',
        phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
        gstin: item.gstin ?? item.gst_number ?? '',
        address: item.address ?? '',
        state: item.state ?? '',
        pincode: item.pincode ?? '',
      }));
      setCustomers(formattedCustomers);
    } catch (error) {
      console.log('Load customers error:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  const loadProductsFromDB = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(`${API_BASE_URL}/api/products`);
      const data = await response.json();
      const productData = Array.isArray(data) ? data : data?.products || data?.data || [];
      setProductsList(productData);
    } catch (error) {
      console.log('Load products error:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadCustomersFromDB();
    loadProductsFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadCustomersFromDB();
      loadProductsFromDB();
    });
    return unsubscribe;
  }, [navigation]);

  const [invoice, setInvoice] = useState('');
  const [invoiceDate, setInvoiceDate] = useState('');
  const [showInvoices, setShowInvoices] = useState(false);
  const DUMMY_INVOICES = [
    { no: 'INV-001', date: '15-09-2026' },
    { no: 'INV-002', date: '16-09-2026' },
    { no: 'INV-003', date: '18-09-2026' },
    { no: 'INV-004', date: '19-09-2026' },
    { no: 'INV-005', date: '20-09-2026' },
  ];
  
  const [adjustmentType, setAdjustmentType] = useState('Customer Credit');
  const [showAdjustment, setShowAdjustment] = useState(false);
  const ADJUSTMENTS = ['Customer Credit', 'Refund', 'Adjust Against Invoice'];

  
  const [notes, setNotes] = useState('Product returned due to quality issue...');

  type ProductItem = { product: string; batchNo?: string; hsn: string; sold: string; returnQty: string; rate: string; disc: string; gst: string; amt: string; reason?: string };
  const emptyItem = (): ProductItem => ({ product: '', batchNo: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' });
  const [items, setItems] = useState<ProductItem[]>(Array.from({ length: 5 }, emptyItem));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [mProduct, setMProduct] = useState('');
  const [mBatchNo, setMBatchNo] = useState('');
  const [mHsn, setMHsn] = useState('');
  const [mSold, setMSold] = useState('0');
  const [mReturnQty, setMReturnQty] = useState('1');
  const [mRate, setMRate] = useState('0');
  const [mDisc, setMDisc] = useState('0');
  const [mGst, setMGst] = useState('18');
  const [showModalGst, setShowModalGst] = useState(false);
  const [mReason, setMReason] = useState('');
  const [mOtherReason, setMOtherReason] = useState('');
  const [showModalReason, setShowModalReason] = useState(false);

  const handleRowPress = (index: number) => {
    const itm = items[index];
    setEditingIndex(index);
    setMProduct(itm.product);
    setMBatchNo(itm.batchNo || '');
    setMHsn(itm.hsn);
    setMSold(itm.sold);
    setMReturnQty(itm.returnQty || '1');
    setMRate(itm.rate);
    setMDisc(itm.disc);
    setMGst(itm.gst);
    const isCustom = itm.reason && !REASONS.includes(itm.reason);
    setMReason(isCustom ? 'Other' : (itm.reason || ''));
    setMOtherReason(isCustom ? (itm.reason || '') : '');
    setModalVisible(true);
  };

  const handleSaveModalItem = () => {
    setItems(prev => {
      const newItems = [...prev];
      let targetIndex = editingIndex;
      
      if (targetIndex === null || (targetIndex !== null && newItems[targetIndex].product !== '' && mProduct !== newItems[targetIndex].product)) {
        const firstEmpty = newItems.findIndex(i => i.product.trim() === '');
        if (firstEmpty !== -1) targetIndex = firstEmpty;
        else targetIndex = newItems.length; // append if full
      }

      const qty = Number(mReturnQty) || 0;
      const rate = Number(mRate) || 0;
      const disc = Number(mDisc) || 0;
      const gst = Number((mGst || '').replace('%', '')) || 0;
      
      const sub = qty * rate;
      const discAmt = (sub * disc) / 100;
      const taxAmt = sub - discAmt;
      const gstAmt = (taxAmt * gst) / 100;
      const amt = (taxAmt + gstAmt).toFixed(2);

      const newItemData = {
        product: mProduct,
        batchNo: mBatchNo,
        hsn: mHsn,
        sold: mSold,
        returnQty: mReturnQty,
        rate: mRate,
        disc: mDisc,
        gst: mGst,
        amt,
        reason: mReason === 'Other' ? mOtherReason : mReason
      };

      if (targetIndex !== null && targetIndex < newItems.length) {
        newItems[targetIndex] = newItemData;
      } else {
        newItems.push(newItemData);
      }
      return newItems;
    });
    setModalVisible(false);
    setEditingIndex(null);
  };

  const handleRemoveItem = (index: number) => {
    setItems(prev => {
      const updated = prev.filter((_, i) => i !== index);
      while(updated.length < 5) updated.push(emptyItem());
      return updated;
    });
  };

  const calculateSummary = () => {
    let subtotal = 0;
    let discount = 0;
    let taxableAmount = 0;
    let totalGstAmount = 0;
    
    const gstMap: Record<string, { taxable: number; gstAmt: number }> = {};
    
    items.forEach(item => {
      if (item.product.trim()) {
        const qty = Number(item.returnQty) || 0;
        const rate = Number(item.rate) || 0;
        const discPercent = Number(item.disc) || 0;
        const gstStr = item.gst || '0';
        const gstPercent = Number(gstStr.replace('%', '')) || 0;

        const itemSub = qty * rate;
        const itemDisc = (itemSub * discPercent) / 100;
        const itemTax = itemSub - itemDisc;
        const itemGst = (itemTax * gstPercent) / 100;

        subtotal += itemSub;
        discount += itemDisc;
        taxableAmount += itemTax;
        totalGstAmount += itemGst;

        if (!gstMap[gstPercent]) {
          gstMap[gstPercent] = { taxable: 0, gstAmt: 0 };
        }
        gstMap[gstPercent].taxable += itemTax;
        gstMap[gstPercent].gstAmt += itemGst;
      }
    });

    const isInterState = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
    
    const cgst = isInterState ? 0 : totalGstAmount / 2;
    const sgst = isInterState ? 0 : totalGstAmount / 2;
    const igst = isInterState ? totalGstAmount : 0;
    
    const totalCreditAmount = Math.round(taxableAmount + totalGstAmount);

    const breakdown = Object.keys(gstMap).map(rate => {
      const gVal = Number(rate);
      const taxVal = gstMap[rate].taxable;
      const gstVal = gstMap[rate].gstAmt;
      const cAmt = isInterState ? 0 : gstVal / 2;
      const sAmt = isInterState ? 0 : gstVal / 2;
      const iAmt = isInterState ? gstVal : 0;
      return {
        rate: gVal,
        taxable: taxVal,
        cgst: cAmt,
        sgst: sAmt,
        igst: iAmt,
        totalGst: gstVal
      };
    }).filter(b => b.taxable > 0);

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      totalCreditAmount: totalCreditAmount.toFixed(2),
      breakdown
    };
  };

  const summary = calculateSummary();

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{flex: 1}}>
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
            <Text style={styles.headerTitle}>Credit Note</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* CREDIT NOTE DETAILS */}
          <View style={[styles.formCard, { zIndex: 1000 }]}>
            <Text style={styles.cardHeaderTitle}>CREDIT NOTE DETAILS</Text>
            
            <View style={{flexDirection: 'row', gap: 12}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Credit Note No.</Text>
                <TextInput style={styles.formInput} value={creditNoteNo} onChangeText={setCreditNoteNo} />
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Date</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput style={styles.formInputFlex} value={date} onChangeText={setDate} />
                  <Text style={{marginRight: 12}}>📅</Text>
                </View>
              </View>
            </View>
          </View>

          {/* CUSTOMER */}
          <View style={[styles.formCard, { zIndex: 999 }]}>
            <Text style={styles.cardHeaderTitle}>Customer Information</Text>
            
            <Text style={styles.inputLabel}>Select Customer</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowCustomers(!showCustomers)}>
                <Text style={[styles.dropdownText, !customer && styles.placeholderText]}>{customer || 'Select customer'}</Text>
                <Text style={styles.arrow}>{showCustomers ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showCustomers && (
                <View style={styles.dropdownMenu}>
                  {loadingCustomers ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color="#ea7e30" />
                    </View>
                  ) : (
                    (() => {
                      const filteredCustomers = customers.filter((cust: Customer) =>
                        (cust.name || '').toLowerCase().includes((customer || '').toLowerCase()),
                      );
                      if (filteredCustomers.length === 0) {
                        return <Text style={styles.emptyText}>No customers found</Text>;
                      }
                      return (
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          style={{maxHeight: 180}}>
                          {filteredCustomers.map((cust: Customer) => (
                            <TouchableOpacity
                              key={cust.id}
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                setCustomer(cust.name);
                                setCustomerName(cust.name);
                                setPhone(cust.phone ?? '');
                                setGstin(cust.gstin ?? '');
                                setAddress(cust.address ?? '');
                                setState(cust.state ?? '');
                                setPincode(cust.pincode ?? '');
                                setShowCustomers(false);
                              }}>
                              <Text style={styles.dropdownMainText}>{cust.name}</Text>
                              {!!cust.phone && (
                                <Text style={styles.dropdownSubText}>{cust.phone}</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      );
                    })()
                  )}
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Customer Name</Text>
                <TextInput style={styles.formInput} value={customerName} onChangeText={setCustomerName} placeholder="Enter customer name" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.formInput} value={phone} onChangeText={setPhone} placeholder="Enter phone no" />
              </View>
            </View>

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput style={[styles.formInput, {height: 60, textAlignVertical: 'top', paddingTop: 10}]} value={address} onChangeText={setAddress} placeholder="Enter customer address" multiline />

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput style={styles.formInput} value={state} onChangeText={setState} placeholder="Enter state" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Pincode</Text>
                <TextInput style={styles.formInput} value={pincode} onChangeText={setPincode} placeholder="Enter pincode" />
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={[styles.dropdownContainer, {flex: 1, zIndex: 11}]}>
                <Text style={styles.inputLabel}>Default GST Rate</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDefaultGstRates(!showDefaultGstRates)}>
                  <Text style={styles.dropdownText}>{defaultGstRate}</Text>
                  <Text style={styles.arrow}>{showDefaultGstRates ? '▲' : '▼'}</Text>
                </TouchableOpacity>
                {showDefaultGstRates && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                      {DEFAULT_GST_RATES.map((rate, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownMenuItem}
                          onPress={() => {
                            setDefaultGstRate(rate);
                            setShowDefaultGstRates(false);
                          }}>
                          <Text style={styles.dropdownMainText}>{rate}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Tax Type</Text>
                <View style={{
                  backgroundColor: '#fff7ed', 
                  borderWidth: 1, 
                  borderColor: '#fed7aa',
                  borderRadius: 10,
                  minHeight: 44,
                  paddingVertical: 8,
                  justifyContent: 'center',
                  paddingHorizontal: 12
                }}>
                  <Text style={{color: '#c2410c', fontWeight: '700', fontSize: 13, lineHeight: 18}}>
                    {(!state || state.trim().toLowerCase() === 'maharashtra') ? 'CGST + SGST\n(Intra-state)' : 'IGST\n(Inter-state)'}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.inputLabel}>GSTIN</Text>
            <TextInput style={styles.formInput} value={gstin} onChangeText={setGstin} placeholder="Enter GSTIN" />
          </View>

          {/* ORIGINAL SALE */}
          <View style={[styles.formCard, { zIndex: 998 }]}>
            <Text style={styles.cardHeaderTitle}>ORIGINAL SALE</Text>
            
            <Text style={styles.inputLabel}>Select Invoice</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowInvoices(!showInvoices)}>
                <Text style={[styles.dropdownText, !invoice && styles.placeholderText]}>{invoice || 'Select Invoice'}</Text>
                <Text style={styles.arrow}>{showInvoices ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showInvoices && (
                <View style={styles.dropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                    {DUMMY_INVOICES.map((inv, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setInvoice(inv.no);
                          setInvoiceDate(inv.date);
                          setShowInvoices(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{inv.no}</Text>
                        <Text style={styles.dropdownSubText}>{inv.date}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {!!invoice && (
              <>
                <View style={{flexDirection: 'row', marginTop: 12}}>
                  <Text style={{width: 100, color: '#475569', fontWeight: '600'}}>Invoice No.</Text>
                  <Text style={{color: '#1e293b'}}>{invoice}</Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 6}}>
                  <Text style={{width: 100, color: '#475569', fontWeight: '600'}}>Invoice Date</Text>
                  <Text style={{color: '#1e293b'}}>{invoiceDate}</Text>
                </View>
              </>
            )}
          </View>

          {/* RETURNED PRODUCTS */}
          <View style={styles.formCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.cardHeaderTitle}>RETURNED PRODUCTS</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => {
                setEditingIndex(null);
                setMProduct('');
                setMBatchNo('');
                setMHsn('');
                setMSold('0');
                setMReturnQty('1');
                setMRate('0');
                setMDisc('0');
                setMGst('18');
                setMReason('');
                setMOtherReason('');
                setModalVisible(true);
              }}>
                <Text style={styles.addBtnText}>[+]</Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 12, color: '#94a3b8', marginBottom: 10}}>← Horizontally Scrollable →</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8}}>
              <View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, {width: 40}]}>#</Text>
                  <Text style={[styles.th, {width: 120}]}>Product</Text>
                  <Text style={[styles.th, {width: 70}]}>HSN</Text>
                  <Text style={[styles.th, {width: 100}]}>Reason</Text>
                  <Text style={[styles.th, {width: 60}]}>Sold</Text>
                  <Text style={[styles.th, {width: 60}]}>Return</Text>
                  <Text style={[styles.th, {width: 70}]}>Rate</Text>
                  <Text style={[styles.th, {width: 60}]}>Disc</Text>
                  <Text style={[styles.th, {width: 60}]}>GST</Text>
                  <Text style={[styles.th, {width: 70}]}>Taxable</Text>
                  <Text style={[styles.th, {width: 60}]}>CGST</Text>
                  <Text style={[styles.th, {width: 60}]}>SGST</Text>
                  <Text style={[styles.th, {width: 60}]}>IGST</Text>
                  <Text style={[styles.th, {width: 80}]}>Amt</Text>
                  <View style={{width: 40, alignItems: 'center'}}><TrashIcon /></View>
                </View>

                {items.map((item, index) => {
                  const isFilled = !!item.product;
                  const color = isFilled ? '#0f172a' : '#94a3b8';
                  const fontWeight = isFilled ? '700' : '400';
                  
                  const qty = Number(item.returnQty) || 0;
                  const rate = Number(item.rate) || 0;
                  const disc = Number(item.disc) || 0;
                  const gVal = Number((item.gst || '').replace('%', '')) || 0;
                  
                  const sub = qty * rate;
                  const discAmt = (sub * disc) / 100;
                  const taxAmt = sub - discAmt;
                  const gstAmt = (taxAmt * gVal) / 100;
                  const total = taxAmt + gstAmt;
                  
                  const isInter = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
                  const cAmt = isInter ? 0 : gstAmt / 2;
                  const sAmt = isInter ? 0 : gstAmt / 2;
                  const iAmt = isInter ? gstAmt : 0;
                  
                  return (
                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 40, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 120, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.hsn}</Text>
                      <Text style={[styles.td, {width: 100, color, fontWeight}]}>{item.reason || ''}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.sold}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.returnQty}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.rate}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.disc}%</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.gst}%</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{isFilled ? taxAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? cAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? sAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? iAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 80, color, fontWeight}]}>{isFilled ? total.toFixed(2) : '0.00'}</Text>
                      <TouchableOpacity style={{width: 40, alignItems: 'center'}} onPress={() => handleRemoveItem(index)}>
                        <TrashIcon />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {/* CREDIT SUMMARY */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>CREDIT SUMMARY</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{summary.subtotal}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.summaryValue}>₹{summary.discount}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Taxable Amount</Text><Text style={styles.summaryValue}>₹{summary.taxableAmount}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>CGST</Text><Text style={styles.summaryValue}>₹{summary.cgst}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>SGST</Text><Text style={styles.summaryValue}>₹{summary.sgst}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>IGST</Text><Text style={styles.summaryValue}>₹{summary.igst}</Text></View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>TOTAL CREDIT AMOUNT</Text>
              <Text style={styles.totalValue}>₹{summary.totalCreditAmount}</Text>
            </View>
          </View>

          {/* GST BREAKDOWN SUMMARY */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>GST Breakdown Summary</Text>
            
            <Text style={{fontSize: 12, color: '#94a3b8', marginBottom: 10}}>← Horizontally Scrollable →</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12}}>
              <View>
                <View style={{flexDirection: 'row', backgroundColor: '#fff7ed', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#fed7aa'}}>
                  <Text style={{width: 80, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>GST RATE</Text>
                  <Text style={{width: 130, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TAXABLE AMOUNT</Text>
                  <Text style={{width: 90, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>CGST</Text>
                  <Text style={{width: 90, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>SGST</Text>
                  <Text style={{width: 90, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>IGST</Text>
                  <Text style={{width: 100, fontSize: 12, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TOTAL GST</Text>
                </View>

                {summary.breakdown.length === 0 ? (
                  <View style={{paddingVertical: 24, alignItems: 'center'}}>
                    <Text style={{color: '#94a3b8', fontSize: 14, fontWeight: '600'}}>No GST applicable</Text>
                  </View>
                ) : (
                  summary.breakdown.map((b, i) => (
                    <View key={i} style={{flexDirection: 'row', paddingVertical: 14, borderBottomWidth: i === summary.breakdown.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9'}}>
                      <Text style={{width: 80, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '600'}}>{b.rate}%</Text>
                      <Text style={{width: 130, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>₹{b.taxable.toFixed(2)}</Text>
                      <Text style={{width: 90, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>₹{b.cgst.toFixed(2)}</Text>
                      <Text style={{width: 90, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>₹{b.sgst.toFixed(2)}</Text>
                      <Text style={{width: 90, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>₹{b.igst.toFixed(2)}</Text>
                      <Text style={{width: 100, fontSize: 13, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>₹{b.totalGst.toFixed(2)}</Text>
                    </View>
                  ))
                )}
              </View>
            </ScrollView>
          </View>

          {/* ADJUSTMENT */}
          <View style={[styles.formCard, { zIndex: 996 }]}>
            <Text style={styles.cardHeaderTitle}>ADJUSTMENT</Text>
            
            <Text style={styles.inputLabel}>Adjustment Type</Text>
            <View style={[styles.dropdownContainer, { zIndex: 20 }]}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowAdjustment(!showAdjustment)}>
                <Text style={styles.dropdownText}>{adjustmentType}</Text>
                <Text style={styles.arrow}>{showAdjustment ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showAdjustment && (
                <View style={styles.dropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                    {ADJUSTMENTS.map((adj, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setAdjustmentType(adj);
                          setShowAdjustment(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{adj}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>


          </View>

          {/* NOTES */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>NOTES</Text>
            <TextInput
              style={[styles.formInput, styles.textAreaInput]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* SUBMIT */}
          <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.saveBtnText}>CREATE CREDIT NOTE</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'center', padding: 20}}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{backgroundColor: '#fff', borderRadius: 20, padding: 20}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 10}}>
                <Text style={{fontSize: 17, fontWeight: '800', color: '#0f172a'}}>
                  {editingIndex !== null && items[editingIndex]?.product ? 'Edit Product' : 'Add Product'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{fontSize: 16, color: '#94a3b8', fontWeight: 'bold'}}>✕</Text></TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Product *</Text>
              <View style={[styles.dropdownContainer, { zIndex: 50 }]}>
                <TextInput 
                  style={[styles.formInput, { paddingRight: 30 }]} 
                  value={mProduct} 
                  onChangeText={(text) => {
                    setMProduct(text);
                    setShowProductsDropdown(true);
                  }} 
                  onFocus={() => setShowProductsDropdown(true)}
                  placeholder="Select product" 
                />
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setShowProductsDropdown(!showProductsDropdown)}
                >
                  <Text style={[styles.arrow]}>{showProductsDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showProductsDropdown && (
                  <View style={[styles.dropdownMenu, { top: 46 }]}>
                    {loadingProducts ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color="#ea7e30" />
                      </View>
                    ) : (
                      (() => {
                        const listToSearch = productsList.length > 0 ? productsList : [
                          { product_name: 'Wireless Mouse', hsn_code: '8471', sales_price: 450, gst_rate: '18', batch_no: 'BATCH-101' },
                          { product_name: 'Mechanical Keyboard', hsn_code: '8471', sales_price: 2500, gst_rate: '18', batch_no: 'BATCH-102' },
                          { product_name: 'USB-C Cable', hsn_code: '8544', sales_price: 299, gst_rate: '18', batch_no: 'BATCH-103' },
                          { product_name: '27-inch Monitor', hsn_code: '8528', sales_price: 18500, gst_rate: '18', batch_no: 'BATCH-104' },
                          { product_name: 'Bluetooth Speaker', hsn_code: '8518', sales_price: 1200, gst_rate: '18', batch_no: 'BATCH-105' },
                        ];
                        const filtered = listToSearch.filter((p: any) => 
                          (p.product_name || p.name || p.title || '').toLowerCase().includes((mProduct || '').toLowerCase())
                        );
                        if (filtered.length === 0) {
                          return <Text style={styles.emptyText}>No products found</Text>;
                        }
                        return (
                          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 200}}>
                            {filtered.map((p: any, idx: number) => {
                              const pName = p.product_name || p.name || p.title || '';
                              const pHsn = p.hsn_code || p.hsn || '';
                              const pRate = (p.sales_price ?? p.rate ?? p.price ?? 0).toString();
                              const pGst = (p.gst_rate ?? p.tax_rate ?? p.gst ?? '18').toString();
                              const pBatch = (p.batch_no ?? p.batch ?? p.batchNo ?? '').toString();
                              return (
                                <TouchableOpacity
                                  key={p.id || p.product_id || idx}
                                  style={styles.dropdownMenuItem}
                                  onPress={() => {
                                    setMProduct(pName);
                                    setMHsn(pHsn);
                                    setMRate(pRate);
                                    setMGst(pGst);
                                    if (pBatch) setMBatchNo(pBatch);
                                    setShowProductsDropdown(false);
                                  }}>
                                  <Text style={styles.dropdownMainText}>{pName}</Text>
                                  <Text style={styles.dropdownSubText}>HSN: {pHsn || '-'} | Rate: ₹{pRate} | GST: {pGst}%</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </ScrollView>
                        );
                      })()
                    )}
                  </View>
                )}
              </View>

              <View style={{ marginTop: 10 }}>
                <Text style={styles.inputLabel}>Batch No.</Text>
                <TextInput
                  style={styles.formInput}
                  value={mBatchNo}
                  onChangeText={setMBatchNo}
                  placeholder="Enter Batch No."
                />
              </View>
              
              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Sold Qty</Text>
                  <TextInput style={styles.formInput} value={mSold} onChangeText={setMSold} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Return Qty *</Text>
                  <TextInput style={styles.formInput} value={mReturnQty} onChangeText={setMReturnQty} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Rate (₹) *</Text>
                  <TextInput style={styles.formInput} value={mRate} onChangeText={setMRate} keyboardType="decimal-pad" />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Discount (%)</Text>
                  <TextInput style={styles.formInput} value={mDisc} onChangeText={setMDisc} keyboardType="decimal-pad" />
                </View>
                <View style={[styles.dropdownContainer, {flex: 1, zIndex: 40}]}>
                  <Text style={styles.inputLabel}>GST (%)</Text>
                  <TouchableOpacity style={styles.dropdown} onPress={() => setShowModalGst(!showModalGst)}>
                    <Text style={styles.dropdownText}>{mGst}{mGst.includes('%') ? '' : '%'}</Text>
                    <Text style={styles.arrow}>{showModalGst ? '▲' : '▼'}</Text>
                  </TouchableOpacity>
                  {showModalGst && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 120}}>
                        {['0', '5', '12', '18', '28'].map((rate, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownMenuItem}
                            onPress={() => {
                              setMGst(rate);
                              setShowModalGst(false);
                            }}>
                            <Text style={styles.dropdownMainText}>{rate}%</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.inputLabel}>HSN Code</Text>
                  <TextInput style={styles.formInput} value={mHsn} onChangeText={setMHsn} placeholder="Enter HSN" />
                </View>
                
                {(() => {
                  const isInter = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
                  const gVal = Number(mGst.replace('%', '')) || 0;
                  const cPercent = isInter ? 0 : gVal / 2;
                  const sPercent = isInter ? 0 : gVal / 2;
                  const iPercent = isInter ? gVal : 0;
                  
                  return (
                    <View style={{flex: 2, flexDirection: 'row', gap: 6}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>CGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{cPercent}%</Text>
                        </View>
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>SGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{sPercent}%</Text>
                        </View>
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>IGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{iPercent}%</Text>
                        </View>
                      </View>
                    </View>
                  );
                })()}
              </View>

              <View style={[styles.dropdownContainer, {zIndex: 35, marginTop: 10}]}>
                <Text style={styles.inputLabel}>Reason</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowModalReason(!showModalReason)}>
                  <Text style={[styles.dropdownText, !mReason && styles.placeholderText]}>{mReason || 'Select reason'}</Text>
                  <Text style={styles.arrow}>{showModalReason ? '\u25B2' : '\u25BC'}</Text>
                </TouchableOpacity>
                {showModalReason && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 200}}>
                      {REASONS.map((r, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownMenuItem}
                          onPress={() => {
                            setMReason(r);
                            setShowModalReason(false);
                          }}>
                          <Text style={styles.dropdownMainText}>{r}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              {mReason === 'Other' && (
                <TextInput
                  style={[styles.formInput, { marginTop: 10 }]}
                  placeholder="Type your reason here..."
                  value={mOtherReason}
                  onChangeText={setMOtherReason}
                />
              )}

              {(() => {
                const qty = Number(mReturnQty) || 0;
                const rate = Number(mRate) || 0;
                const disc = Number(mDisc) || 0;
                const gVal = Number(mGst.replace('%', '')) || 0;
                
                const sub = qty * rate;
                const discAmt = (sub * disc) / 100;
                const taxAmt = sub - discAmt;
                const gstAmt = (taxAmt * gVal) / 100;
                const total = taxAmt + gstAmt;
                
                return (
                  <View style={{marginTop: 20, backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Subtotal:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>₹{sub.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Discount ({disc}%):</Text>
                      <Text style={{fontSize: 13, color: '#22c55e', fontWeight: '700'}}>- ₹{discAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Taxable Amount:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>₹{taxAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>GST Amount:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>₹{gstAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#e2e8f0', marginBottom: 12}} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{fontSize: 15, color: '#0f172a', fontWeight: '800'}}>Item Total:</Text>
                      <Text style={{fontSize: 15, color: '#ea580c', fontWeight: '800'}}>₹{total.toFixed(2)}</Text>
                    </View>
                  </View>
                );
              })()}

              <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
                <TouchableOpacity style={{flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10, alignItems: 'center'}} onPress={() => setModalVisible(false)}>
                  <Text style={{fontWeight: '700', color: '#64748b'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1.5, backgroundColor: '#ea7e30', padding: 12, borderRadius: 10, alignItems: 'center'}} onPress={handleSaveModalItem}>
                  <Text style={{fontWeight: '800', color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CreditNoteScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 28 : 22, paddingBottom: 14 },
  backButton: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginRight: 14, borderWidth: 1.5, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.06, shadowRadius: 4, elevation: 3 },
  headerTitleArea: { flex: 1, justifyContent: 'center' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#0f172a', letterSpacing: -0.2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: {width: 0, height: 6}, shadowOpacity: 0.1, shadowRadius: 12, elevation: 8, marginBottom: 20 },
  cardHeaderTitle: { fontSize: 16, fontWeight: '800', color: '#0f172a', marginBottom: 16, letterSpacing: -0.2 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 10 },
  formInput: { height: 44, backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', paddingHorizontal: 12, fontSize: 14, color: '#1e293b' },
  inputWithIcon: { height: 44, backgroundColor: '#f8fafc', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', alignItems: 'center' },
  formInputFlex: { flex: 1, paddingHorizontal: 12, fontSize: 14, color: '#1e293b' },
  dropdown: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12, height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dropdownText: { fontSize: 14, color: '#1e293b' },
  placeholderText: { color: '#94a3b8' },
  arrow: { fontSize: 12, color: '#94a3b8' },
  dropdownContainer: { position: 'relative', zIndex: 10 },
  dropdownMenu: { position: 'absolute', top: 46, left: 0, right: 0, backgroundColor: '#ffffff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0', shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.1, shadowRadius: 6, elevation: 8, overflow: 'hidden', zIndex: 20 },
  dropdownMenuItem: { paddingVertical: 10, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  dropdownMainText: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  dropdownSubText: { fontSize: 12, color: '#64748b', marginTop: 2 },
  loaderContainer: { padding: 20, alignItems: 'center' },
  emptyText: { textAlign: 'center', color: '#94a3b8', padding: 15, fontSize: 13 },
  textAreaInput: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  summaryLabel: { fontSize: 14, color: '#475569', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#1e293b', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
  totalLabel: { fontSize: 15, color: '#0f172a', fontWeight: '800' },
  totalValue: { fontSize: 16, color: '#ea7e30', fontWeight: '800' },
  saveBtn: { backgroundColor: '#ea7e30', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#ea7e30', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '800', letterSpacing: 0.5 },
  addBtn: { backgroundColor: '#ea7e30', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 10 },
  th: { fontSize: 12, fontWeight: 'bold', color: '#475569', textAlign: 'center' },
  tableDataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 12, alignItems: 'center' },
  td: { fontSize: 12, color: '#1e293b', textAlign: 'center' }
});
