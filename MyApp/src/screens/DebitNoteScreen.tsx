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
    <View style={{ width: 5, height: 2, borderWidth: 1.5, borderBottomWidth: 0, borderColor: '#ef4444', borderTopLeftRadius: 1.5, borderTopRightRadius: 1.5 }} />
    <View style={{ width: 14, height: 2, backgroundColor: '#ef4444', borderRadius: 1, marginBottom: 1.5 }} />
    <View style={{ width: 10, height: 11, borderWidth: 1.5, borderTopWidth: 0, borderColor: '#ef4444', borderBottomLeftRadius: 2, borderBottomRightRadius: 2, flexDirection: 'row', justifyContent: 'space-evenly', paddingTop: 1.5 }}>
      <View style={{ width: 1.2, height: 6, backgroundColor: '#ef4444', borderRadius: 1 }} />
      <View style={{ width: 1.2, height: 6, backgroundColor: '#ef4444', borderRadius: 1 }} />
    </View>
  </View>
);

type Supplier = {
  id: string;
  name: string;
  phone?: string;
  gstin?: string;
  address?: string;
  state?: string;
  pincode?: string;
};

type ProductItem = {
  product: string;
  batchNo?: string;
  hsn: string;
  sold: string;
  returnQty: string;
  rate: string;
  disc: string;
  gst: string;
  amt: string;
  reason?: string;
};

const DebitNoteScreen = ({ navigation }: any) => {
  // Debit Note Information State
  const [debitNoteNo, setDebitNoteNo] = useState('DN-001');
  const [date, setDate] = useState('23-09-2026');
  
  const [supplier, setSupplier] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  const [address, setAddress] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loadingSuppliers, setLoadingSuppliers] = useState(false);
  const [showSuppliers, setShowSuppliers] = useState(false);

  const [invoiceNo, setInvoiceNo] = useState('INV-1025');
  const [invoiceDate, setInvoiceDate] = useState('20-09-2026');

  const [reason, setReason] = useState('Purchase Return');
  const [otherReason, setOtherReason] = useState('');
  const [showReasons, setShowReasons] = useState(false);
  const REASONS = [
    'Purchase Return',
    'Post Purchase Discount',
    'Deficiency in services',
    'Other'
  ];

  const [notes, setNotes] = useState('Damaged products returned');

  // Products List API State
  const [productsList, setProductsList] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);

  // Initial demo items as requested
  const initialItems: ProductItem[] = [
    { product: 'Laptop', batchNo: 'BATCH-8471', hsn: '8471', sold: '1', returnQty: '1', rate: '50000', disc: '5', gst: '18', amt: '56050.00', reason: 'Damaged' },
    { product: 'Keyboard', batchNo: 'BATCH-8472', hsn: '8471', sold: '2', returnQty: '2', rate: '1000', disc: '0', gst: '18', amt: '2360.00', reason: 'Defective' },
    { product: '', batchNo: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' },
    { product: '', batchNo: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' },
    { product: '', batchNo: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' },
  ];

  const emptyItem = (): ProductItem => ({ product: '', batchNo: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' });
  const [items, setItems] = useState<ProductItem[]>(initialItems);

  // Modal State
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

  // Adjustment State
  const [adjustmentType, setAdjustmentType] = useState('Adjust Against Invoice');
  const [showAdjustment, setShowAdjustment] = useState(false);
  const ADJUSTMENTS = ['Adjust Against Invoice', 'Supplier Credit', 'Refund'];

  const [paymentStatus, setPaymentStatus] = useState('Pending');
  const [showPaymentStatus, setShowPaymentStatus] = useState(false);
  const PAYMENT_STATUSES = ['Pending', 'Partially Paid', 'Paid'];

  const loadSuppliersFromDB = async () => {
    try {
      setLoadingSuppliers(true);
      const response = await fetch(`${API_BASE_URL}/api/suppliers`);
      const data = await response.json();
      const supplierData = Array.isArray(data) ? data : data?.suppliers || data?.data || [];
      const formattedSuppliers: Supplier[] = supplierData.map((item: any) => ({
        id: String(item.id ?? item.supplier_id ?? item.supplierId ?? ''),
        name: item.name ?? item.supplier_name ?? item.company_name ?? '',
        phone: item.phone ?? item.mobile ?? item.phone_number ?? '',
        gstin: item.gstin ?? item.gst_number ?? '',
        address: item.address ?? '',
        state: item.state ?? '',
        pincode: item.pincode ?? '',
      }));
      setSuppliers(formattedSuppliers);
    } catch (error) {
      console.log('Load suppliers error:', error);
    } finally {
      setLoadingSuppliers(false);
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
    loadSuppliersFromDB();
    loadProductsFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadSuppliersFromDB();
      loadProductsFromDB();
    });
    return unsubscribe;
  }, [navigation]);

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
        else targetIndex = newItems.length;
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
      }
    });

    const isInterState = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
    
    const cgst = isInterState ? 0 : totalGstAmount / 2;
    const sgst = isInterState ? 0 : totalGstAmount / 2;
    const igst = isInterState ? totalGstAmount : 0;
    
    const debitNoteTotal = Math.round(taxableAmount + totalGstAmount);
    const itemCount = items.filter(i => i.product.trim() !== '').length;

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      debitNoteTotal: debitNoteTotal.toFixed(2),
      itemCount,
      isInterState,
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
            <Text style={styles.headerTitle}>Add Debit Note</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* DEBIT NOTE INFORMATION */}
          <View style={[styles.formCard, { zIndex: 1000 }]}>
            <Text style={styles.cardHeaderTitle}>Debit Note Information</Text>
            
            <View style={{flexDirection: 'row', gap: 12}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Debit Note No.</Text>
                <TextInput style={styles.formInput} value={debitNoteNo} onChangeText={setDebitNoteNo} />
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Debit Note Date</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput style={styles.formInputFlex} value={date} onChangeText={setDate} />
                  <Text style={{marginRight: 12}}>📅</Text>
                </View>
              </View>
            </View>

            {/* SUPPLIER */}
            <Text style={[styles.inputLabel, {marginTop: 14}]}>Supplier</Text>
            <View style={[styles.dropdownContainer, { zIndex: 999 }]}>
              <TextInput
                style={[styles.formInput, { paddingRight: 30 }]}
                value={supplier}
                onChangeText={(text) => {
                  setSupplier(text);
                  setSupplierName(text);
                  setShowSuppliers(true);
                }}
                placeholder="Select or enter Supplier"
                placeholderTextColor="#94a3b8"
                onFocus={() => setShowSuppliers(true)}
              />
              <TouchableOpacity
                style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center' }}
                onPress={() => setShowSuppliers(!showSuppliers)}
              >
                <Text style={styles.arrow}>{showSuppliers ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {showSuppliers && (
                <View style={styles.dropdownMenu}>
                  {loadingSuppliers ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color="#ea7e30" />
                    </View>
                  ) : (
                    (() => {
                      const listToDisplay = suppliers.length > 0 ? suppliers : [
                        { id: '1', name: 'Ramesh Suppliers', phone: '9823012345', address: 'Shop 12, Market Yard', state: 'Maharashtra', pincode: '411001', gstin: '27AABCR12341ZB' },
                        { id: '2', name: 'Mahavir Electronics', phone: '9890123456', address: 'Plot 45, MIDC Area', state: 'Maharashtra', pincode: '400001', gstin: '27AABCS56782ZC' },
                        { id: '3', name: 'Sun Distributors', phone: '9765432109', address: 'Main Road, Station Area', state: 'Maharashtra', pincode: '411002', gstin: '27AABCV90123ZD' },
                        { id: '4', name: 'Global Tech Components', phone: '9123456789', address: 'Tech Park, Whitefield', state: 'Karnataka', pincode: '560066', gstin: '29AABCG34564ZE' },
                      ];
                      const filtered = listToDisplay.filter((s: Supplier) =>
                        (s.name || '').toLowerCase().includes((supplier || '').toLowerCase())
                      );
                      if (filtered.length === 0) {
                        return <Text style={styles.emptyText}>No suppliers found</Text>;
                      }
                      return (
                        <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 180}}>
                          {filtered.map((s: Supplier) => (
                            <TouchableOpacity
                              key={s.id}
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                setSupplier(s.name);
                                setSupplierName(s.name);
                                setPhone(s.phone ?? '');
                                setGstin(s.gstin ?? '');
                                setAddress(s.address ?? '');
                                setState(s.state ?? '');
                                setPincode(s.pincode ?? '');
                                setShowSuppliers(false);
                              }}>
                              <Text style={styles.dropdownMainText}>{s.name}</Text>
                              {!!s.phone && <Text style={styles.dropdownSubText}>{s.phone}</Text>}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      );
                    })()
                  )}
                </View>
              )}
            </View>

            {/* ORIGINAL INVOICE NO & DATE */}
            <View style={{flexDirection: 'row', gap: 12, marginTop: 14}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Original Invoice No.</Text>
                <TextInput style={styles.formInput} value={invoiceNo} onChangeText={setInvoiceNo} placeholder="e.g. INV-1025" />
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Invoice Date</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput style={styles.formInputFlex} value={invoiceDate} onChangeText={setInvoiceDate} />
                  <Text style={{marginRight: 12}}>📅</Text>
                </View>
              </View>
            </View>

            {/* REASON */}
            <Text style={[styles.inputLabel, {marginTop: 14}]}>Reason</Text>
            <View style={[styles.dropdownContainer, { zIndex: 998 }]}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowReasons(!showReasons)}>
                <Text style={[styles.dropdownText, !reason && styles.placeholderText]}>{reason || 'Select reason'}</Text>
                <Text style={styles.arrow}>{showReasons ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showReasons && (
                <View style={styles.dropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 180}}>
                    {REASONS.map((r, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setReason(r);
                          setShowReasons(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{r}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {reason === 'Other' && (
              <TextInput 
                style={[styles.formInput, { marginTop: 10 }]} 
                placeholder="Type your reason here..." 
                value={otherReason} 
                onChangeText={setOtherReason} 
              />
            )}

            {/* NOTES */}
            <Text style={[styles.inputLabel, {marginTop: 14}]}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textAreaInput]}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              placeholder="Damaged products returned"
            />
          </View>

          {/* PRODUCT INFORMATION */}
          <View style={styles.formCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={styles.cardHeaderTitle}>Product Information</Text>
                <Text style={{fontSize: 12, color: '#64748b', marginTop: -10, marginBottom: 8, fontWeight: '600'}}>{summary.itemCount} Items</Text>
              </View>
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
                <Text style={styles.addBtnText}>[ + ]</Text>
              </TouchableOpacity>
            </View>
            <Text style={{fontSize: 12, color: '#94a3b8', marginBottom: 10}}>← Horizontal Scroll →</Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8}}>
              <View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, {width: 35}]}>#</Text>
                  <Text style={[styles.th, {width: 110}]}>Product</Text>
                  <Text style={[styles.th, {width: 90}]}>Batch No.</Text>
                  <Text style={[styles.th, {width: 50}]}>Qty</Text>
                  <Text style={[styles.th, {width: 70}]}>Rate</Text>
                  <Text style={[styles.th, {width: 50}]}>Disc</Text>
                  <Text style={[styles.th, {width: 65}]}>HSN</Text>
                  <Text style={[styles.th, {width: 75}]}>Taxable</Text>
                  <Text style={[styles.th, {width: 60}]}>CGST</Text>
                  <Text style={[styles.th, {width: 60}]}>SGST</Text>
                  <Text style={[styles.th, {width: 60}]}>IGST</Text>
                  <Text style={[styles.th, {width: 80}]}>Total</Text>
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
                  
                  const isInter = summary.isInterState;
                  const cAmt = isInter ? 0 : gstAmt / 2;
                  const sAmt = isInter ? 0 : gstAmt / 2;
                  const iAmt = isInter ? gstAmt : 0;
                  
                  return (
                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 35, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 110, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 90, color, fontWeight}]}>{item.batchNo || '-'}</Text>
                      <Text style={[styles.td, {width: 50, color, fontWeight}]}>{item.returnQty}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.rate}</Text>
                      <Text style={[styles.td, {width: 50, color, fontWeight}]}>{item.disc}%</Text>
                      <Text style={[styles.td, {width: 65, color, fontWeight}]}>{item.hsn || '-'}</Text>
                      <Text style={[styles.td, {width: 75, color, fontWeight}]}>{isFilled ? taxAmt.toFixed(2) : '0.00'}</Text>
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

          {/* TAX & AMOUNT SUMMARY */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>Tax & Amount Summary</Text>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Subtotal</Text><Text style={styles.summaryValue}>₹{summary.subtotal}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Discount</Text><Text style={styles.discountValue}>- ₹{summary.discount}</Text></View>
            <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Taxable Amount</Text><Text style={styles.summaryValue}>₹{summary.taxableAmount}</Text></View>
            {!summary.isInterState ? (
              <>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>CGST 9%</Text><Text style={styles.summaryValue}>₹{summary.cgst}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>SGST 9%</Text><Text style={styles.summaryValue}>₹{summary.sgst}</Text></View>
              </>
            ) : (
              <View style={styles.summaryRow}><Text style={styles.summaryLabel}>IGST 18%</Text><Text style={styles.summaryValue}>₹{summary.igst}</Text></View>
            )}
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Debit Note Total</Text>
              <Text style={styles.totalValue}>₹{summary.debitNoteTotal}</Text>
            </View>
          </View>

          {/* ADJUSTMENT */}
          <View style={[styles.formCard, { zIndex: 10 }]}>
            <Text style={styles.cardHeaderTitle}>Adjustment</Text>
            
            <Text style={styles.inputLabel}>Adjustment Type</Text>
            <View style={[styles.dropdownContainer, { zIndex: 20 }]}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowAdjustment(!showAdjustment)}>
                <Text style={styles.dropdownText}>{adjustmentType}</Text>
                <Text style={styles.arrow}>{showAdjustment ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showAdjustment && (
                <View style={styles.dropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                    {ADJUSTMENTS.map((type, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setAdjustmentType(type);
                          setShowAdjustment(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{type}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <Text style={[styles.inputLabel, {marginTop: 14}]}>Payment Status</Text>
            <View style={[styles.dropdownContainer, { zIndex: 10 }]}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowPaymentStatus(!showPaymentStatus)}>
                <Text style={styles.dropdownText}>{paymentStatus}</Text>
                <Text style={styles.arrow}>{showPaymentStatus ? '▲' : '▼'}</Text>
              </TouchableOpacity>
              {showPaymentStatus && (
                <View style={styles.dropdownMenu}>
                  <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                    {PAYMENT_STATUSES.map((status, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.dropdownMenuItem}
                        onPress={() => {
                          setPaymentStatus(status);
                          setShowPaymentStatus(false);
                        }}>
                        <Text style={styles.dropdownMainText}>{status}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>
          </View>

          {/* ACTION BUTTONS */}
          <View style={{flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 20}}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.saveBtnText}>Save Debit Note</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ADD / EDIT PRODUCT MODAL */}
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
                          { product_name: 'Laptop', hsn_code: '8471', sales_price: 50000, gst_rate: '18', batch_no: 'BATCH-8471' },
                          { product_name: 'Keyboard', hsn_code: '8471', sales_price: 1000, gst_rate: '18', batch_no: 'BATCH-8472' },
                          { product_name: 'Wireless Mouse', hsn_code: '8471', sales_price: 450, gst_rate: '18', batch_no: 'BATCH-101' },
                          { product_name: 'USB-C Cable', hsn_code: '8544', sales_price: 299, gst_rate: '18', batch_no: 'BATCH-103' },
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
                  <Text style={styles.inputLabel}>Quantity *</Text>
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

export default DebitNoteScreen;

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
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5 },
  summaryLabel: { fontSize: 14, color: '#475569', fontWeight: '500' },
  summaryValue: { fontSize: 14, color: '#1e293b', fontWeight: '700' },
  discountValue: { fontSize: 14, color: '#22c55e', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
  totalLabel: { fontSize: 15, color: '#0f172a', fontWeight: '800' },
  totalValue: { fontSize: 16, color: '#ea7e30', fontWeight: '800' },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', paddingVertical: 16, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  cancelBtnText: { color: '#64748b', fontSize: 15, fontWeight: '700' },
  saveBtn: { flex: 1.5, backgroundColor: '#ea7e30', paddingVertical: 16, borderRadius: 12, alignItems: 'center', shadowColor: '#ea7e30', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  saveBtnText: { color: '#ffffff', fontSize: 15, fontWeight: '800', letterSpacing: 0.3 },
  addBtn: { backgroundColor: '#ea7e30', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  addBtnText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingVertical: 10 },
  th: { fontSize: 12, fontWeight: 'bold', color: '#475569', textAlign: 'center' },
  tableDataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingVertical: 12, alignItems: 'center' },
  td: { fontSize: 12, color: '#1e293b', textAlign: 'center' }
});
