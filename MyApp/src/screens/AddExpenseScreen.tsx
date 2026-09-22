import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

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

const AddExpenseScreen = ({ navigation }: any) => {
  const [expenseDate, setExpenseDate] = useState('');
  const [category, setCategory] = useState('');
  const [paidTo, setPaidTo] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [referenceNo, setReferenceNo] = useState('');
  const [gstApplicable, setGstApplicable] = useState('');
  const [gstRate, setGstRate] = useState('');
  const [notes, setNotes] = useState('');

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveExpense = () => {
    if (!expenseDate || !amount || !paymentMethod) {
      Alert.alert(
        'Required Fields',
        'Please fill Expense Date, Amount and Payment Method.'
      );
      return;
    }

    const expenseData = {
      expenseDate,
      category,
      paidTo,
      description,
      amount,
      paymentMethod,
      referenceNo,
      gstApplicable,
      gstRate,
      notes,
    };

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      navigation.goBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        
        {/* ================================================= */}
        {/* 1. HEADER                                         */}
        {/* ================================================= */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <BackArrowIcon />
          </TouchableOpacity>

          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle}>Add Expense</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {savedSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✓ Expense saved successfully!
              </Text>
            </View>
          )}

          {/* ================================================= */}
          {/* 2. FORM CARD                                      */}
          {/* ================================================= */}
          <View style={styles.formCard}>
            
            {/* Expense Date */}
            <Text style={styles.inputLabel}>Expense Date *</Text>
            <TextInput
              style={styles.formInput}
              placeholder="DD/MM/YYYY"
              placeholderTextColor="#94a3b8"
              value={expenseDate}
              onChangeText={setExpenseDate}
            />

            {/* Category */}
            <Text style={styles.inputLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              placeholder="e.g. Rent, Office Supplies"
              placeholderTextColor="#94a3b8"
              value={category}
              onChangeText={setCategory}
            />

            {/* Paid To */}
            <Text style={styles.inputLabel}>Paid To</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Vendor / Person"
              placeholderTextColor="#94a3b8"
              value={paidTo}
              onChangeText={setPaidTo}
            />

            {/* Description */}
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.formInput, styles.textAreaInput]}
              placeholder="Expense Description"
              placeholderTextColor="#94a3b8"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            {/* Amount */}
            <Text style={styles.inputLabel}>Amount *</Text>
            <View style={styles.amountContainer}>
              <Text style={styles.currency}>₹</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
              />
            </View>

            {/* Payment Method */}
            <Text style={styles.inputLabel}>Payment Method *</Text>
            <View style={styles.toggleRow}>
              {['Cash', 'UPI', 'Bank', 'Card'].map(method => (
                <TouchableOpacity
                  key={method}
                  style={[
                    styles.toggleBtn,
                    paymentMethod === method && styles.toggleBtnActive,
                  ]}
                  onPress={() => setPaymentMethod(method)}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      paymentMethod === method && styles.toggleTextActive,
                    ]}
                  >
                    {method}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <View style={styles.divider} />

            {/* Reference Number */}
            <Text style={styles.inputLabel}>Reference No.</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Optional"
              placeholderTextColor="#94a3b8"
              value={referenceNo}
              onChangeText={setReferenceNo}
            />

            {/* GST Applicable */}
            <Text style={styles.inputLabel}>GST Applicable</Text>
            <View style={styles.toggleRow}>
              {['Yes', 'No'].map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.toggleBtn,
                    gstApplicable === opt && styles.toggleBtnActive,
                  ]}
                  onPress={() => {
                    setGstApplicable(opt);
                    if (opt === 'No') setGstRate('');
                  }}
                >
                  <Text
                    style={[
                      styles.toggleText,
                      gstApplicable === opt && styles.toggleTextActive,
                    ]}
                  >
                    {opt}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* GST Rate */}
            {gstApplicable === 'Yes' && (
              <View>
                <Text style={styles.inputLabel}>GST Rate</Text>
                <View style={[styles.toggleRow, { flexWrap: 'wrap' }]}>
                  {['0%', '5%', '12%', '18%', '28%'].map(rate => (
                    <TouchableOpacity
                      key={rate}
                      style={[
                        styles.toggleBtn,
                        { minWidth: 60, marginBottom: 8 },
                        gstRate === rate && styles.toggleBtnActive,
                      ]}
                      onPress={() => setGstRate(rate)}
                    >
                      <Text
                        style={[
                          styles.toggleText,
                          gstRate === rate && styles.toggleTextActive,
                        ]}
                      >
                        {rate}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* Notes */}
            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textAreaInput]}
              placeholder="Optional"
              placeholderTextColor="#94a3b8"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
            />

            {/* ================================================= */}
            {/* 3. FORM FOOTER                                    */}
            {/* ================================================= */}
            <View style={styles.formFooter}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleSaveExpense}>
                <Text style={styles.saveBtnText}>Save Expense</Text>
              </TouchableOpacity>
            </View>

          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddExpenseScreen;

// =========================================================
// STYLES
// =========================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // ---- 1. HEADER ----
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 28 : 22,
    paddingBottom: 14,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    marginTop: 4,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },

  headerTitleArea: {
    flex: 1,
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 40,
  },

  successBanner: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  successBannerText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },

  // ---- 2. FORM CARD ----
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
  },

  formInput: {
    height: 44,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e293b',
  },

  textAreaInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: 10,
  },

  dropdown: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
    fontSize: 14,
    color: '#1e293b',
  },

  placeholderText: {
    color: '#94a3b8',
  },

  arrow: {
    fontSize: 20,
    color: '#94a3b8',
    marginTop: -5,
  },

  amountContainer: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
  },

  currency: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },

  amountInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#1e293b',
  },

  toggleRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },

  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  toggleBtnActive: {
    backgroundColor: '#fff7ed',
    borderColor: '#fed7aa',
  },

  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  toggleTextActive: {
    color: '#ea7e30',
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 18,
  },

  // ---- 3. FORM FOOTER ----
  formFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingTop: 20,
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f1f4',
  },

  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
  },

  cancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },

  saveBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ea7e30',
  },

  saveBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
  },
});