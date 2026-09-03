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
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

interface SaleItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  gstRate: number;
}

const PAYMENT_MODES = [
  {id: 'cash', label: 'Cash'},
  {id: 'upi', label: 'UPI / QR'},
  {id: 'card', label: 'Card'},
  {id: 'credit', label: 'Credit (Due)'},
  {id: 'bank', label: 'Bank Transfer'},
];

const GST_PRESETS = [0, 5, 12, 18, 28];

// Safe date formatter (never calls Intl or toLocaleDateString which breaks Hermes)
const getFormattedDate = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const now = new Date();
  const d = String(now.getDate()).padStart(2, '0');
  const m = months[now.getMonth()];
  const y = now.getFullYear();
  return `${d} ${m}, ${y}`;
};

// Safe number formatters (avoids Hermes toLocaleString issues)
const formatMoney = (val: number | string): string => {
  const num = typeof val === 'number' ? val : parseFloat(val) || 0;
  const parts = num.toFixed(2).split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const formatInteger = (val: number | string): string => {
  const num = typeof val === 'number' ? Math.round(val) : parseInt(val, 10) || 0;
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// ======================================================
// SIMPLE VECTOR ICONS
// ======================================================

const VectorChevronLeft = () => (
  <View style={styles.backArrowBox}>
    <View style={styles.backArrowLine} />
    <View style={styles.backArrowHead} />
  </View>
);

const RadioIndicator = ({selected}: {selected: boolean}) => (
  <View style={[styles.radioRing, selected && styles.activeRadioRing]}>
    {selected && <View style={styles.radioDot} />}
  </View>
);


const BottomNavIcon = ({
  type,
  isActive = false,
}: {
  type: string;
  isActive?: boolean;
}) => {
  const color = isActive ? '#2563eb' : '#64748b';

  return (
    <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
      {type === 'home' && (
        <View style={{width: 18, height: 18, alignItems: 'center', justifyContent: 'flex-end'}}>
          <View style={{width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color}} />
          <View style={{width: 14, height: 8, backgroundColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, alignItems: 'center'}}>
            <View style={{width: 4, height: 5, backgroundColor: '#ffffff', position: 'absolute', bottom: 0}} />
          </View>
        </View>
      )}

      {type === 'add_sale' && (
        <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: isActive ? '#2563eb' : '#eff6ff',
              borderWidth: 1.5,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 2,
                backgroundColor: isActive ? '#ffffff' : color,
                borderRadius: 1,
              }}
            />
            <View
              style={{
                position: 'absolute',
                width: 2,
                height: 10,
                backgroundColor: isActive ? '#ffffff' : color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'menu' && (
        <View style={{width: 18, height: 14, justifyContent: 'space-between', alignItems: 'center'}}>
          <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
        </View>
      )}

      {type === 'profile' && (
        <View style={{width: 18, height: 18, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 7, height: 7, borderRadius: 3.5, backgroundColor: color, marginBottom: 1}} />
          <View style={{width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: color}} />
        </View>
      )}
    </View>
  );
};

const AddSaleScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  // Invoice identifiers
  const [invoiceNumber] = useState(`INV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [invoiceDate] = useState(getFormattedDate());

  // Customer form state
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Item input form state
  const [itemName, setItemName] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemQty, setItemQty] = useState('1');
  const [itemGst, setItemGst] = useState('18');

  // Items in current bill
  const [items, setItems] = useState<SaleItem[]>([]);

  // Payment & summary state
  const [selectedPayment, setSelectedPayment] = useState('cash');
  const [discountVal, setDiscountVal] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Financial calculations
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalTax = items.reduce(
    (sum, item) => sum + ((item.price * item.quantity * item.gstRate) / 100),
    0,
  );
  const discountNum = parseFloat(discountVal) || 0;
  const grandTotal = Math.max(0, subtotal + totalTax - discountNum);

  // Add Item to cart
  const handleAddItem = () => {
    if (!itemName.trim()) {
      Alert.alert('Missing Item Name', 'Please enter the item or product name.');
      return;
    }
    const priceNum = parseFloat(itemPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid selling price.');
      return;
    }
    const qtyNum = parseInt(itemQty, 10) || 1;

    const newItem: SaleItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      quantity: qtyNum,
      price: priceNum,
      gstRate: parseFloat(itemGst) || 0,
    };

    setItems(prev => [newItem, ...prev]);
    setItemName('');
    setItemPrice('');
    setItemQty('1');
    setItemGst('18');
  };

  const handleRemoveItem = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setItems(prev =>
      prev
        .map(it => {
          if (it.id === id) {
            const nextQty = it.quantity + delta;
            return nextQty > 0 ? {...it, quantity: nextQty} : null;
          }
          return it;
        })
        .filter(Boolean) as SaleItem[],
    );
  };

  const handleSaveSale = () => {
    if (items.length === 0) {
      Alert.alert('Empty Bill', 'Please add at least one item to save the sale.');
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);

    Alert.alert(
      'Invoice Saved',
      `Invoice #${invoiceNumber} for ₹${formatMoney(grandTotal)} was created successfully.`,
      [
        {
          text: 'Go to Home',
          onPress: () => navigation.navigate('Home', {user}),
        },
        {
          text: 'Create Another Sale',
          onPress: () => {
            setCustomerName('');
            setCustomerPhone('');
            setDiscountVal('');
            setItems([]);
          },
        },
      ],
    );
  };

  const openPage = (screenName: string) => {
    navigation.navigate(screenName, {user});
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>

        {/* ===================================================== */}
        {/* TOP APP BAR */}
        {/* ===================================================== */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <VectorChevronLeft />
          </TouchableOpacity>

          <View style={styles.topBarContent}>
            <Text style={styles.screenTitle}>Add Sale</Text>
            <Text style={styles.screenSubtitle}>New Sales Bill & Invoice</Text>
          </View>

          <View style={styles.invoicePill}>
            <Text style={styles.invoicePillText}>{invoiceNumber}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* SUCCESS BANNER */}
          {savedSuccess && (
            <View style={styles.successBanner}>
              <View style={styles.successCircle}>
                <View style={styles.successCheckmark} />
              </View>
              <Text style={styles.successBannerText}>
                Invoice {invoiceNumber} saved successfully!
              </Text>
            </View>
          )}

          {/* ===================================================== */}
          {/* 1. CUSTOMER INFORMATION */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>1</Text>
              </View>
              <Text style={styles.cardSectionTitle}>Customer Information</Text>
            </View>

            <View style={styles.inputStack}>
              <View style={styles.inputWrapper}>
                <Text style={styles.fieldLabel}>Customer Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter customer name"
                  placeholderTextColor="#94a3b8"
                  value={customerName}
                  onChangeText={setCustomerName}
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.fieldLabel}>Mobile Number</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodeBadge}>
                    <Text style={styles.countryCodeText}>+91</Text>
                  </View>
                  <TextInput
                    style={[styles.textInput, styles.phoneInput]}
                    placeholder="10-digit mobile number"
                    placeholderTextColor="#94a3b8"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={customerPhone}
                    onChangeText={setCustomerPhone}
                  />
                </View>
              </View>
            </View>

            {/* INVOICE META STRIP */}
            <View style={styles.metaStrip}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Date</Text>
                <Text style={styles.metaValue}>{invoiceDate}</Text>
              </View>
              <View style={styles.metaDivider} />
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Invoice ID</Text>
                <Text style={styles.metaValue}>{invoiceNumber}</Text>
              </View>
            </View>
          </View>

          {/* ===================================================== */}
          {/* 2. ITEM ENTRY CARD */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>2</Text>
              </View>
              <Text style={styles.cardSectionTitle}>Add Items</Text>
            </View>

            {/* ITEM NAME */}
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>
                Item / Product Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter item name"
                placeholderTextColor="#94a3b8"
                value={itemName}
                onChangeText={setItemName}
              />
            </View>

            {/* PRICE & QUANTITY ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputWrapper, {flex: 1.6, marginRight: 10}]}>
                <Text style={styles.fieldLabel}>
                  Rate / Unit Price (₹) <Text style={styles.requiredAsterisk}>*</Text>
                </Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="0.00"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={itemPrice}
                  onChangeText={setItemPrice}
                />
              </View>

              <View style={[styles.inputWrapper, {flex: 1}]}>
                <Text style={styles.fieldLabel}>Quantity</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="1"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={itemQty}
                  onChangeText={setItemQty}
                />
              </View>
            </View>

            {/* GST RATE PILLS */}
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>GST Tax Rate</Text>
              <View style={styles.gstPillRow}>
                {GST_PRESETS.map(rate => {
                  const isSelected = itemGst === rate.toString();
                  return (
                    <TouchableOpacity
                      key={rate}
                      style={[styles.gstPill, isSelected && styles.activeGstPill]}
                      onPress={() => setItemGst(rate.toString())}
                      activeOpacity={0.7}>
                      <Text style={[styles.gstPillText, isSelected && styles.activeGstPillText]}>
                        {rate}%
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ADD ITEM ACTION BUTTON */}
            <TouchableOpacity
              style={styles.addSingleItemBtn}
              onPress={handleAddItem}
              activeOpacity={0.8}>
              <Text style={styles.addSingleItemBtnText}>+ Add Item</Text>
            </TouchableOpacity>

            {/* ADDED ITEMS LIST SECTION */}
            {items.length > 0 && (
              <View style={styles.addedItemsContainer}>
                <Text style={styles.addedItemsTitle}>
                  Added Items ({items.length})
                </Text>

                {items.map((item, index) => {
                  const lineTotal = item.price * item.quantity;
                  return (
                    <View key={item.id} style={styles.itemCardRow}>
                      <View style={styles.itemIndexCircle}>
                        <Text style={styles.itemIndexText}>{index + 1}</Text>
                      </View>

                      <View style={styles.itemMainInfo}>
                        <Text style={styles.itemCardName}>{item.name}</Text>
                        <Text style={styles.itemCardPriceBreakdown}>
                          ₹{formatMoney(item.price)} × {item.quantity} • GST {item.gstRate}%
                        </Text>
                      </View>

                      {/* QUANTITY CHANGER */}
                      <View style={styles.qtyStepper}>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => handleUpdateQty(item.id, -1)}
                          activeOpacity={0.7}>
                          <Text style={styles.stepperBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.stepperCount}>{item.quantity}</Text>
                        <TouchableOpacity
                          style={styles.stepperBtn}
                          onPress={() => handleUpdateQty(item.id, 1)}
                          activeOpacity={0.7}>
                          <Text style={styles.stepperBtnText}>+</Text>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.itemTotalCol}>
                        <Text style={styles.itemTotalNumber}>
                          ₹{formatMoney(lineTotal)}
                        </Text>
                        <TouchableOpacity
                          onPress={() => handleRemoveItem(item.id)}
                          style={styles.removeBtn}
                          activeOpacity={0.6}>
                          <Text style={styles.removeBtnText}>Remove</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* ===================================================== */}
          {/* 3. PAYMENT & FINAL SUMMARY */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.stepBadge}>
                <Text style={styles.stepBadgeText}>3</Text>
              </View>
              <Text style={styles.cardSectionTitle}>Payment & Calculation</Text>
            </View>

            {/* PAYMENT MODE SELECTOR (RADIO INTERACTIVE PILLS) */}
            <Text style={styles.fieldLabel}>Payment Mode</Text>
            <View style={styles.paymentModeGrid}>
              {PAYMENT_MODES.map(mode => {
                const isSelected = selectedPayment === mode.id;
                return (
                  <TouchableOpacity
                    key={mode.id}
                    style={[
                      styles.paymentModeCard,
                      isSelected && styles.activePaymentModeCard,
                    ]}
                    onPress={() => setSelectedPayment(mode.id)}
                    activeOpacity={0.7}>
                    <RadioIndicator selected={isSelected} />
                    <Text
                      style={[
                        styles.paymentModeLabel,
                        isSelected && styles.activePaymentModeLabel,
                      ]}>
                      {mode.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* DISCOUNT ROW */}
            <View style={styles.inputWrapper}>
              <Text style={styles.fieldLabel}>Discount (₹)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="0.00 (Optional)"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                value={discountVal}
                onChangeText={setDiscountVal}
              />
            </View>

            {/* BILL RECEIPT SUMMARY */}
            <View style={styles.receiptContainer}>
              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Taxable Subtotal</Text>
                <Text style={styles.receiptValue}>₹{formatMoney(subtotal)}</Text>
              </View>

              <View style={styles.receiptRow}>
                <Text style={styles.receiptLabel}>Total Tax (GST)</Text>
                <Text style={styles.receiptValue}>+ ₹{formatMoney(totalTax)}</Text>
              </View>

              {discountNum > 0 && (
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Discount</Text>
                  <Text style={styles.discountReceiptValue}>
                    − ₹{formatMoney(discountNum)}
                  </Text>
                </View>
              )}

              <View style={styles.receiptDivider} />

              <View style={styles.receiptGrandRow}>
                <View>
                  <Text style={styles.grandTotalTitle}>Grand Total</Text>
                  <Text style={styles.grandTotalItemsCount}>
                    {items.length} {items.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>
                <Text style={styles.grandTotalValue}>
                  ₹{formatMoney(grandTotal)}
                </Text>
              </View>
            </View>

            {/* CONFIRM & SAVE BUTTON */}
            <TouchableOpacity
              style={[
                styles.saveSaleButton,
                items.length === 0 && styles.disabledSaveButton,
              ]}
              onPress={handleSaveSale}
              disabled={items.length === 0}
              activeOpacity={0.85}>
              <Text style={styles.saveSaleButtonText}>
                Save & Record Sale (₹{formatInteger(grandTotal)})
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* ===================================================== */}
      {/* BOTTOM NAVBAR */}
      {/* ===================================================== */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('Home')}>
          <BottomNavIcon type="home" isActive={false} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}>
          <BottomNavIcon type="add_sale" isActive={true} />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Add Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('Menu')}>
          <BottomNavIcon type="menu" isActive={false} />
          <Text style={styles.navLabel}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('BusinessProfile')}>
          <BottomNavIcon type="profile" isActive={false} />
          <Text style={styles.navLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddSaleScreen;

// ======================================================
// SIMPLE, INTERACTIVE & CLEAN STYLES
// ======================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  // TOP BAR
  topBar: {
    backgroundColor: '#2563eb',
    paddingTop: 42,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backArrowBox: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrowLine: {
    width: 12,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },

  backArrowHead: {
    position: 'absolute',
    left: 1,
    width: 6,
    height: 6,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ffffff',
    transform: [{rotate: '45deg'}],
  },

  topBarContent: {
    flex: 1,
  },

  screenTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: -0.3,
  },

  screenSubtitle: {
    fontSize: 12,
    color: '#bfdbfe',
    marginTop: 2,
  },

  invoicePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  invoicePillText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 90,
  },

  // SUCCESS BANNER
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  successCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#15803d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  successCheckmark: {
    width: 6,
    height: 10,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: '#ffffff',
    transform: [{rotate: '45deg'}],
    marginTop: -2,
  },

  successBannerText: {
    fontSize: 13,
    color: '#15803d',
    fontWeight: '600',
    flex: 1,
  },

  // FORM CARD
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  stepBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563eb',
  },

  cardSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },

  // INPUTS
  inputStack: {
    gap: 12,
  },

  inputWrapper: {
    marginBottom: 12,
  },

  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },

  requiredAsterisk: {
    color: '#ef4444',
  },

  textInput: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },

  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  countryCodeBadge: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRightWidth: 0,
  },

  countryCodeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },

  phoneInput: {
    flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },

  rowInputs: {
    flexDirection: 'row',
  },

  // META STRIP
  metaStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingVertical: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  metaItem: {
    alignItems: 'center',
  },

  metaLabel: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  metaValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginTop: 1,
  },

  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e2e8f0',
  },

  // GST PILLS
  gstPillRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },

  gstPill: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 3,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    alignItems: 'center',
  },

  activeGstPill: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  gstPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  activeGstPillText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  // ADD ITEM BUTTON
  addSingleItemBtn: {
    backgroundColor: '#eff6ff',
    borderWidth: 1.5,
    borderColor: '#93c5fd',
    borderRadius: 8,
    paddingVertical: 11,
    alignItems: 'center',
    marginTop: 6,
  },

  addSingleItemBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },

  // ADDED ITEMS LIST
  addedItemsContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  addedItemsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
  },

  itemCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  itemIndexCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  itemIndexText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
  },

  itemMainInfo: {
    flex: 1,
  },

  itemCardName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },

  itemCardPriceBreakdown: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 2,
  },

  qtyStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },

  stepperBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  stepperBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#334155',
    marginTop: -1,
  },

  stepperCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0f172a',
    marginHorizontal: 6,
  },

  itemTotalCol: {
    alignItems: 'flex-end',
    minWidth: 65,
  },

  itemTotalNumber: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16a34a',
  },

  removeBtn: {
    marginTop: 3,
  },

  removeBtnText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ef4444',
  },


  // PAYMENT MODES (RADIO SELECTORS)
  paymentModeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 2,
    marginBottom: 12,
  },

  paymentModeCard: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },

  activePaymentModeCard: {
    backgroundColor: '#eff6ff',
    borderColor: '#2563eb',
  },

  radioRing: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.8,
    borderColor: '#cbd5e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  activeRadioRing: {
    borderColor: '#2563eb',
  },

  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563eb',
  },

  paymentModeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },

  activePaymentModeLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },

  // RECEIPT SUMMARY
  receiptContainer: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  receiptLabel: {
    fontSize: 12,
    color: '#64748b',
  },

  receiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
  },

  discountReceiptValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ef4444',
  },

  receiptDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },

  receiptGrandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  grandTotalTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0f172a',
  },

  grandTotalItemsCount: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 1,
  },

  grandTotalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563eb',
  },

  // SAVE BUTTON
  saveSaleButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#2563eb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  disabledSaveButton: {
    backgroundColor: '#94a3b8',
    shadowOpacity: 0,
    elevation: 0,
  },

  saveSaleButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },

  // BOTTOM NAVBAR
  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },

  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500',
  },

  activeNavLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },
});
