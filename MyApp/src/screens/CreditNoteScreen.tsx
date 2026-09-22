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
};

const CreditNoteScreen = ({ navigation }: any) => {
  const [creditNoteNo, setCreditNoteNo] = useState('CN-001');
  const [date, setDate] = useState('22-09-2026');
  const [reason, setReason] = useState('');
  
  const [customer, setCustomer] = useState('');
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');
  
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);

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
      }));
      setCustomers(formattedCustomers);
    } catch (error) {
      console.log('Load customers error:', error);
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadCustomersFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadCustomersFromDB();
    });
    return unsubscribe;
  }, [navigation]);

  const [invoice, setInvoice] = useState('');
  
  const [adjustmentType, setAdjustmentType] = useState('Customer Credit');
  const [paymentStatus, setPaymentStatus] = useState('Pending');
  
  const [notes, setNotes] = useState('Product returned due to quality issue...');

  type ProductItem = { product: string; hsn: string; sold: string; returnQty: string; rate: string; disc: string; gst: string; amt: string };
  const emptyItem = (): ProductItem => ({ product: '', hsn: '', sold: '0', returnQty: '0', rate: '0.00', disc: '0', gst: '0', amt: '0.00' });
  const [items, setItems] = useState<ProductItem[]>(Array.from({ length: 5 }, emptyItem));

  const [modalVisible, setModalVisible] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const [mProduct, setMProduct] = useState('');
  const [mHsn, setMHsn] = useState('');
  const [mSold, setMSold] = useState('0');
  const [mReturnQty, setMReturnQty] = useState('1');
  const [mRate, setMRate] = useState('0');
  const [mDisc, setMDisc] = useState('0');
  const [mGst, setMGst] = useState('0');

  const handleRowPress = (index: number) => {
    const itm = items[index];
    setEditingIndex(index);
    setMProduct(itm.product);
    setMHsn(itm.hsn);
    setMSold(itm.sold);
    setMReturnQty(itm.returnQty || '1');
    setMRate(itm.rate);
    setMDisc(itm.disc);
    setMGst(itm.gst);
    setModalVisible(true);
  };

  const handleSaveModalItem = () => {
    setItems(prev => {
      const newItems = [...prev];
      let targetIndex = editingIndex;
      
      // If adding from [+] button or directly saving, and editingIndex is somehow null or points to a non-empty,
      // the instruction says "add in the first row" (first empty row).
      if (targetIndex === null || (targetIndex !== null && newItems[targetIndex].product !== '' && mProduct !== newItems[targetIndex].product)) {
        const firstEmpty = newItems.findIndex(i => i.product.trim() === '');
        if (firstEmpty !== -1) targetIndex = firstEmpty;
        else targetIndex = newItems.length; // append if full
      }

      const qty = Number(mReturnQty) || 0;
      const rate = Number(mRate) || 0;
      const disc = Number(mDisc) || 0;
      const gst = Number(mGst) || 0;
      
      const sub = qty * rate;
      const discAmt = (sub * disc) / 100;
      const taxAmt = sub - discAmt;
      const gstAmt = (taxAmt * gst) / 100;
      const amt = (taxAmt + gstAmt).toFixed(2);

      const newItemData = {
        product: mProduct,
        hsn: mHsn,
        sold: mSold,
        returnQty: mReturnQty,
        rate: mRate,
        disc: mDisc,
        gst: mGst,
        amt
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
        const gstPercent = Number(item.gst) || 0;

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

    const cgst = totalGstAmount / 2;
    const sgst = totalGstAmount / 2;
    const totalCreditAmount = Math.round(taxableAmount + totalGstAmount);

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: '0.00',
      totalCreditAmount: totalCreditAmount.toFixed(2),
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
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>CREDIT NOTE DETAILS</Text>
            
            <Text style={styles.inputLabel}>Credit Note No.</Text>
            <TextInput style={styles.formInput} value={creditNoteNo} onChangeText={setCreditNoteNo} />
            
            <Text style={styles.inputLabel}>Date</Text>
            <View style={styles.inputWithIcon}>
              <TextInput style={styles.formInputFlex} value={date} onChangeText={setDate} />
              <Text style={{marginRight: 12}}>📅</Text>
            </View>

            <Text style={styles.inputLabel}>Reason</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={[styles.dropdownText, !reason && styles.placeholderText]}>{reason || 'Select reason'}</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
          </View>

          {/* CUSTOMER */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>CUSTOMER</Text>
            
            <Text style={styles.inputLabel}>Select Customer</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowCustomers(!showCustomers)}>
                <Text style={[styles.dropdownText, !customer && styles.placeholderText]}>{customer || 'Select Customer'}</Text>
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
                                setPhone(cust.phone ?? '');
                                setGstin(cust.gstin ?? '');
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

            <Text style={styles.inputLabel}>Phone</Text>
            <TextInput style={styles.formInput} value={phone} onChangeText={setPhone} />
            
            <Text style={styles.inputLabel}>GSTIN</Text>
            <TextInput style={styles.formInput} value={gstin} onChangeText={setGstin} />
          </View>

          {/* ORIGINAL SALE */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>ORIGINAL SALE</Text>
            
            <Text style={styles.inputLabel}>Select Invoice</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={[styles.dropdownText, !invoice && styles.placeholderText]}>{invoice || 'Select Invoice'}</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <View style={{flexDirection: 'row', marginTop: 12}}>
              <Text style={{width: 100, color: '#475569', fontWeight: '600'}}>Invoice No.</Text>
              <Text style={{color: '#1e293b'}}>INV-005</Text>
            </View>
            <View style={{flexDirection: 'row', marginTop: 6}}>
              <Text style={{width: 100, color: '#475569', fontWeight: '600'}}>Invoice Date</Text>
              <Text style={{color: '#1e293b'}}>20-09-2026</Text>
            </View>
          </View>

          {/* RETURNED PRODUCTS */}
          <View style={styles.formCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Text style={styles.cardHeaderTitle}>RETURNED PRODUCTS</Text>
              <TouchableOpacity style={styles.addBtn} onPress={() => {
                setEditingIndex(null);
                setMProduct('');
                setMHsn('');
                setMSold('0');
                setMReturnQty('1');
                setMRate('0');
                setMDisc('0');
                setMGst('0');
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
                  <Text style={[styles.th, {width: 60}]}>Sold</Text>
                  <Text style={[styles.th, {width: 70}]}>Return</Text>
                  <Text style={[styles.th, {width: 80}]}>Rate</Text>
                  <Text style={[styles.th, {width: 60}]}>Disc</Text>
                  <Text style={[styles.th, {width: 60}]}>GST</Text>
                  <Text style={[styles.th, {width: 80}]}>Amt</Text>
                  <View style={{width: 40, alignItems: 'center'}}><TrashIcon /></View>
                </View>

                {items.map((item, index) => {
                  const isFilled = !!item.product;
                  const color = isFilled ? '#0f172a' : '#94a3b8';
                  const fontWeight = isFilled ? '700' : '400';
                  
                  return (
                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 40, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 120, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.hsn}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.sold}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.returnQty}</Text>
                      <Text style={[styles.td, {width: 80, color, fontWeight}]}>{item.rate}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.disc}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.gst}</Text>
                      <Text style={[styles.td, {width: 80, color, fontWeight}]}>{item.amt}</Text>
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

          {/* ADJUSTMENT */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>ADJUSTMENT</Text>
            
            <Text style={styles.inputLabel}>Adjustment Type</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{adjustmentType}</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <Text style={styles.inputLabel}>Payment Status</Text>
            <TouchableOpacity style={styles.dropdown}>
              <Text style={styles.dropdownText}>{paymentStatus}</Text>
              <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>
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

              <Text style={styles.inputLabel}>Product</Text>
              <TextInput style={styles.formInput} value={mProduct} onChangeText={setMProduct} placeholder="Product Name" />
              
              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Return Qty</Text>
                  <TextInput style={styles.formInput} value={mReturnQty} onChangeText={setMReturnQty} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Rate (₹)</Text>
                  <TextInput style={styles.formInput} value={mRate} onChangeText={setMRate} keyboardType="decimal-pad" />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Discount (%)</Text>
                  <TextInput style={styles.formInput} value={mDisc} onChangeText={setMDisc} keyboardType="decimal-pad" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>GST (%)</Text>
                  <TextInput style={styles.formInput} value={mGst} onChangeText={setMGst} keyboardType="numeric" />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
                <TouchableOpacity style={[styles.modalCancelBtn, {flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10, alignItems: 'center'}]} onPress={() => setModalVisible(false)}>
                  <Text style={{fontWeight: '700', color: '#64748b'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalSaveBtn, {flex: 1.5, backgroundColor: '#ea7e30', padding: 12, borderRadius: 10, alignItems: 'center'}]} onPress={handleSaveModalItem}>
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
