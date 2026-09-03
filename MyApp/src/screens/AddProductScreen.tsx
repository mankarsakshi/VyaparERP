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
  Switch,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

const CATEGORIES = [
  'Electronics',
  'Grocery',
  'Apparel',
  'Hardware',
  'Pharmacy',
  'FMCG',
  'Other',
];

const BRANDS = [
  'Dell',
  'HP',
  'Samsung',
  'Apple',
  'LG',
  'Tata',
  'Generic',
];

const UNITS = [
  'Piece',
  'Kg',
  'Litre',
  'Box',
  'Meter',
  'Gram',
  'Pack',
  'Dozen',
];

const GST_RATES = ['0%', '5%', '12%', '18%', '28%'];

const AddProductScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  // Basic Info States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [hsnCode, setHsnCode] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [brand, setBrand] = useState('Generic');
  const [unit, setUnit] = useState('Piece');
  const [description, setDescription] = useState('');

  // Pricing & Tax States
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [gstRate, setGstRate] = useState('18%');
  const [isTaxIncluded, setIsTaxIncluded] = useState(false);

  // Stock States
  const [openingStock, setOpeningStock] = useState('');
  const [lowStockLevel, setLowStockLevel] = useState('5');
  const [location, setLocation] = useState('');

  // Success State
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Auto-generate SKU Code
  const handleGenerateSKU = () => {
    const prefix = name ? name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '') || 'PRD' : 'PRD';
    const randomNum = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}${randomNum}`);
  };

  // Calculate profit margin
  const pPrice = parseFloat(purchasePrice) || 0;
  const sPrice = parseFloat(sellingPrice) || 0;
  const profit = sPrice - pPrice;
  const marginPercent = pPrice > 0 ? ((profit / pPrice) * 100).toFixed(1) : '0';

  const handleSaveProduct = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter the Product Name.');
      return;
    }
    if (!sellingPrice.trim()) {
      Alert.alert('Required Field', 'Please enter the Selling Price.');
      return;
    }

    const finalSku = sku.trim() || `PRD${Math.floor(100 + Math.random() * 900)}`;

    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      sku: finalSku,
      category,
      brand,
      unit,
      hsnCode: hsnCode.trim(),
      description: description.trim(),
      purchasePrice: pPrice,
      sellingPrice: sPrice,
      gstRate,
      isTaxIncluded,
      openingStock: parseInt(openingStock, 10) || 0,
      currentStock: parseInt(openingStock, 10) || 0,
      lowStockLevel: parseInt(lowStockLevel, 10) || 5,
      location: location.trim(),
    };

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);

    Alert.alert(
      'Product Created',
      `"${newProduct.name}" (SKU: ${newProduct.sku}) has been successfully added to your inventory.`,
      [
        {
          text: 'View Product',
          onPress: () => {
            navigation.navigate('ProductInfoMaster', {
              product: newProduct,
              user,
            });
          },
        },
        {
          text: 'All Products',
          onPress: () => {
            navigation.navigate('ProductMaster', {user});
          },
        },
        {
          text: 'Add Another',
          onPress: () => {
            setName('');
            setSku('');
            setHsnCode('');
            setDescription('');
            setPurchasePrice('');
            setSellingPrice('');
            setOpeningStock('');
            setLocation('');
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}>
            <View style={styles.backArrow}>
              <View style={styles.backArrowLine} />
              <View style={styles.backArrowHead} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Add New Product</Text>
            <Text style={styles.headerSubtitle}>
              Fill in item details to add to inventory
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* SUCCESS BANNER */}
          {savedSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✓ Product created successfully!
              </Text>
            </View>
          )}

          {/* ===================================================== */}
          {/* SECTION 1: BASIC INFORMATION */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.sectionNumberBadge}>
                <Text style={styles.sectionNumberText}>1</Text>
              </View>
              <Text style={styles.sectionHeading}>Basic Information</Text>
            </View>

            {/* PRODUCT NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* SKU & GENERATE BUTTON */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SKU / Item Code</Text>
              <View style={styles.inputWithActionRow}>
                <TextInput
                  style={[styles.input, {flex: 1, marginRight: 10}]}
                  placeholder="Enter SKU code"
                  placeholderTextColor="#94a3b8"
                  value={sku}
                  onChangeText={setSku}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.generateButton}
                  onPress={handleGenerateSKU}
                  activeOpacity={0.7}>
                  <Text style={styles.generateButtonText}>⚡ Auto</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* HSN CODE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>HSN / SAC Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter HSN/SAC code"
                placeholderTextColor="#94a3b8"
                value={hsnCode}
                onChangeText={setHsnCode}
                keyboardType="numeric"
                maxLength={8}
              />
            </View>

            {/* CATEGORY SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Category <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pillContainer}>
                {CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.pill,
                      category === cat && styles.activePill,
                    ]}
                    onPress={() => setCategory(cat)}>
                    <Text
                      style={[
                        styles.pillText,
                        category === cat && styles.activePillText,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* BRAND SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Brand</Text>
              <View style={styles.pillContainer}>
                {BRANDS.map(b => (
                  <TouchableOpacity
                    key={b}
                    style={[
                      styles.pill,
                      brand === b && styles.activePillSecondary,
                    ]}
                    onPress={() => setBrand(b)}>
                    <Text
                      style={[
                        styles.pillText,
                        brand === b && styles.activePillText,
                      ]}>
                      {b}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* UNIT SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Unit of Measurement <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pillContainer}>
                {UNITS.map(u => (
                  <TouchableOpacity
                    key={u}
                    style={[
                      styles.pill,
                      unit === u && styles.activePillTertiary,
                    ]}
                    onPress={() => setUnit(u)}>
                    <Text
                      style={[
                        styles.pillText,
                        unit === u && styles.activePillText,
                      ]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter product description"
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ===================================================== */}
          {/* SECTION 2: PRICING & TAXATION */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.sectionNumberBadge}>
                <Text style={styles.sectionNumberText}>2</Text>
              </View>
              <Text style={styles.sectionHeading}>Pricing & Tax Details</Text>
            </View>

            {/* PURCHASE & SELLING PRICE ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Purchase Price (₹)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter purchase price"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                />
              </View>

              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>
                  Selling Price (₹) <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter selling price"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                />
              </View>
            </View>

            {/* PROFIT MARGIN BADGE */}
            {pPrice > 0 && sPrice > 0 && (
              <View style={[
                styles.marginCard,
                profit >= 0 ? styles.marginCardPositive : styles.marginCardNegative,
              ]}>
                <Text style={styles.marginLabel}>Estimated Profit / Margin:</Text>
                <Text style={[
                  styles.marginValue,
                  profit >= 0 ? styles.marginValuePositive : styles.marginValueNegative,
                ]}>
                  {profit >= 0 ? '+' : ''}₹{profit.toLocaleString()} ({marginPercent}%)
                </Text>
              </View>
            )}

            {/* GST RATE SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GST Tax Rate</Text>
              <View style={styles.pillContainer}>
                {GST_RATES.map(rate => (
                  <TouchableOpacity
                    key={rate}
                    style={[
                      styles.pill,
                      gstRate === rate && styles.activePill,
                    ]}
                    onPress={() => setGstRate(rate)}>
                    <Text
                      style={[
                        styles.pillText,
                        gstRate === rate && styles.activePillText,
                      ]}>
                      {rate}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* TAX INCLUDED SWITCH */}
            <View style={styles.switchRow}>
              <View style={{flex: 1, paddingRight: 10}}>
                <Text style={styles.switchLabel}>Price Includes Tax</Text>
                <Text style={styles.switchSubtitle}>
                  Enable if selling price already includes GST
                </Text>
              </View>
              <Switch
                value={isTaxIncluded}
                onValueChange={setIsTaxIncluded}
                trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
                thumbColor={isTaxIncluded ? '#2563eb' : '#f1f5f9'}
              />
            </View>
          </View>

          {/* ===================================================== */}
          {/* SECTION 3: INVENTORY & STOCK */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.sectionNumberBadge}>
                <Text style={styles.sectionNumberText}>3</Text>
              </View>
              <Text style={styles.sectionHeading}>Inventory & Stock</Text>
            </View>

            {/* OPENING STOCK & LOW STOCK ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Opening Quantity</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter opening stock"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={openingStock}
                  onChangeText={setOpeningStock}
                />
              </View>

              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>Low Stock Alert</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter min stock"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  value={lowStockLevel}
                  onChangeText={setLowStockLevel}
                />
              </View>
            </View>

            {/* LOCATION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Storage / Rack Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter shelf or rack location (e.g. Rack A-1)"
                placeholderTextColor="#94a3b8"
                value={location}
                onChangeText={setLocation}
              />
            </View>
          </View>

          {/* SAVE BUTTONS */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveProduct}
              activeOpacity={0.8}>
              <Text style={styles.saveButtonText}>+ Save Product</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddProductScreen;

// =========================================================
// STYLES
// =========================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // HEADER
  header: {
    backgroundColor: '#2563eb',
    paddingTop: 42,
    paddingBottom: 18,
    paddingHorizontal: 18,
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

  backArrow: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrowLine: {
    width: 14,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },

  backArrowHead: {
    position: 'absolute',
    left: 0,
    width: 7,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ffffff',
    transform: [{rotate: '45deg'}],
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#dbeafe',
    marginTop: 2,
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 40,
  },

  successBanner: {
    backgroundColor: '#dcfce7',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  successBannerText: {
    color: '#15803d',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },

  // FORM CARD
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionNumberBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },

  sectionHeading: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
  },

  // INPUTS
  inputGroup: {
    marginBottom: 14,
  },

  rowInputs: {
    flexDirection: 'row',
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },

  required: {
    color: '#ef4444',
  },

  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },

  textArea: {
    minHeight: 70,
  },

  inputWithActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  generateButton: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  generateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563eb',
  },

  // PILLS
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },

  pill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
  },

  activePill: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  activePillSecondary: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },

  activePillTertiary: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },

  pillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  activePillText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // MARGIN BADGE
  marginCard: {
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
  },

  marginCardPositive: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },

  marginCardNegative: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },

  marginLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },

  marginValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  marginValuePositive: {
    color: '#16a34a',
  },

  marginValueNegative: {
    color: '#dc2626',
  },

  // SWITCH ROW
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    marginTop: 4,
  },

  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },

  switchSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // ACTION BUTTONS
  actionButtonsContainer: {
    marginTop: 6,
    marginBottom: 20,
  },

  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 10,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  cancelButtonText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '600',
  },
});
