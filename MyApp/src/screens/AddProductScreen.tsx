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
  KeyboardAvoidingView,
  Platform,
  Switch,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {API_BASE_URL} from '../api/config';

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

const getCandidateUrls = (path: string): string[] => {
  const list = [`${API_BASE_URL}${path}`];

  if (Platform.OS === 'android') {
    const emu = `http://10.0.2.2:8080${path}`;
    const ip = `http://10.85.57.27:8080${path}`;
    const loc = `http://localhost:8080${path}`;

    if (!list.includes(emu)) list.push(emu);
    if (!list.includes(ip)) list.push(ip);
    if (!list.includes(loc)) list.push(loc);
  } else {
    const loc = `http://localhost:8080${path}`;
    if (!list.includes(loc)) list.push(loc);
  }

  return list;
};

const fetchWithFallback = async (
  path: string,
  options?: RequestInit,
): Promise<Response> => {
  const urls = getCandidateUrls(path);
  let lastErr: any = null;

  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);

      const res = await fetch(url, {
        ...(options || {}),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok || res.status < 500) {
        return res;
      }
    } catch (err) {
      lastErr = err;
    }
  }

  throw lastErr || new Error(`Unable to reach backend for ${path}`);
};

const AddProductScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  const [categories, setCategoriesList] = useState<string[]>(CATEGORIES);
  const [units, setUnitsList] = useState<string[]>(UNITS);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showGstDropdown, setShowGstDropdown] = useState(false);
  
  // Basic Info States
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await fetchWithFallback('/api/categories');
        if (catRes.ok) {
          const result = await catRes.json();
          const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
          const dbCatNames: string[] = data.map((c: any) => c.category_name || c.name).filter(Boolean);
          if (dbCatNames.length > 0) {
            setCategoriesList(Array.from(new Set([...CATEGORIES, ...dbCatNames])));
          }
        }
        
        const unitRes = await fetchWithFallback('/api/units');
        if (unitRes.ok) {
          const result = await unitRes.json();
          const data = Array.isArray(result?.data) ? result.data : (Array.isArray(result) ? result : []);
          const dbUnitNames: string[] = data.map((u: any) => u.unit_name || u.name).filter(Boolean);
          if (dbUnitNames.length > 0) {
            setUnitsList(Array.from(new Set([...UNITS, ...dbUnitNames])));
          }
        }
      } catch (e) {
        console.log('Error fetching categories/units:', e);
      }
    };
    fetchData();
  }, []);

  // Pricing & Tax States
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [gstRate, setGstRate] = useState('0%');
  const [cgst, setCgst] = useState('0');
  const [sgst, setSgst] = useState('0');
  const [igst, setIgst] = useState('0');

  // Stock States
  const [openingStock, setOpeningStock] = useState('');

  // Success State
  const [savedSuccess, setSavedSuccess] = useState(false);

  const pPrice = parseFloat(purchasePrice) || 0;
  const sPrice = parseFloat(sellingPrice) || 0;

  const handleSaveProduct = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter the Product Name.');
      return;
    }

    const finalSku = sku.trim();

    const newProduct = {
      id: Date.now().toString(),
      name: name.trim(),
      sku: finalSku,
      category,
      unit,
      purchasePrice: pPrice,
      sellingPrice: sPrice,
      gstRate,
      cgst: parseFloat(cgst) || 0,
      sgst: parseFloat(sgst) || 0,
      igst: parseFloat(igst) || 0,
      openingStock: parseInt(openingStock, 10) || 0,
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
            setPurchasePrice('');
            setSellingPrice('');
            setCgst('0');
            setSgst('0');
            setIgst('0');
            setOpeningStock('');
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

          {/* FORM FIELDS */}
          <View style={styles.formCard}>
            {/* PRODUCT NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Product Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter product name"
                placeholderTextColor="#d1d5db"
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* PRODUCT CODE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Product Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter SKU / product code"
                placeholderTextColor="#d1d5db"
                value={sku}
                onChangeText={setSku}
                autoCapitalize="characters"
              />
            </View>

            {/* CATEGORY SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category</Text>
              <View style={styles.dropdownContainer}>
                <TouchableOpacity
                  style={styles.selectBtn}
                  onPress={() => {
                    setShowCategoryDropdown(!showCategoryDropdown);
                    setShowUnitDropdown(false);
                    setShowGstDropdown(false);
                  }}
                  activeOpacity={0.8}>
                  <Text style={[styles.selectBtnText, !category && styles.placeholderText]}>
                    {category || 'Select category'}
                  </Text>
                  <Text style={styles.arrowIcon}>{showCategoryDropdown ? '▲' : '▼'}</Text>
                </TouchableOpacity>

                {showCategoryDropdown && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                      {categories.length === 0 ? (
                        <Text style={[styles.emptyText, {padding: 10}]}>No categories found</Text>
                      ) : (
                        categories.map((c) => (
                          <TouchableOpacity
                            key={c}
                            style={styles.dropdownMenuItem}
                            onPress={() => {
                              setCategory(c);
                              setShowCategoryDropdown(false);
                            }}>
                            <Text style={styles.dropdownMainText}>{c}</Text>
                          </TouchableOpacity>
                        ))
                      )}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            {/* UNIT & GST RATE ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Unit</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => {
                      setShowUnitDropdown(!showUnitDropdown);
                      setShowCategoryDropdown(false);
                      setShowGstDropdown(false);
                    }}
                    activeOpacity={0.8}>
                    <Text style={[styles.selectBtnText, !unit && styles.placeholderText]}>
                      {unit || 'Select unit'}
                    </Text>
                    <Text style={styles.arrowIcon}>{showUnitDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {showUnitDropdown && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                        {units.length === 0 ? (
                          <Text style={[styles.emptyText, {padding: 10}]}>No units found</Text>
                        ) : (
                          units.map((u) => (
                            <TouchableOpacity
                              key={u}
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                setUnit(u);
                                setShowUnitDropdown(false);
                              }}>
                              <Text style={styles.dropdownMainText}>{u}</Text>
                            </TouchableOpacity>
                          ))
                        )}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>GST Rate</Text>
                <View style={styles.dropdownContainer}>
                  <TouchableOpacity
                    style={styles.selectBtn}
                    onPress={() => {
                      setShowGstDropdown(!showGstDropdown);
                      setShowCategoryDropdown(false);
                      setShowUnitDropdown(false);
                    }}
                    activeOpacity={0.8}>
                    <Text style={[styles.selectBtnText, !gstRate && styles.placeholderText]}>
                      {gstRate || 'Select GST'}
                    </Text>
                    <Text style={styles.arrowIcon}>{showGstDropdown ? '▲' : '▼'}</Text>
                  </TouchableOpacity>

                  {showGstDropdown && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                        {GST_RATES.map((rate) => (
                          <TouchableOpacity
                            key={rate}
                            style={styles.dropdownMenuItem}
                            onPress={() => {
                              setGstRate(rate);
                              setShowGstDropdown(false);
                            }}>
                            <Text style={styles.dropdownMainText}>{rate}</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* PURCHASE & SELLING PRICE ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Purchase Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter purchase price"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={purchasePrice}
                  onChangeText={setPurchasePrice}
                />
              </View>

              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>Selling Price</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter selling price"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={sellingPrice}
                  onChangeText={setSellingPrice}
                />
              </View>
            </View>

            {/* CGST, SGST, IGST ROW */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 4}]}>
                <Text style={styles.label}>CGST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={cgst}
                  onChangeText={setCgst}
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginHorizontal: 4}]}>
                <Text style={styles.label}>SGST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={sgst}
                  onChangeText={setSgst}
                />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginLeft: 4}]}>
                <Text style={styles.label}>IGST</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#d1d5db"
                  keyboardType="numeric"
                  value={igst}
                  onChangeText={setIgst}
                />
              </View>
            </View>

            {/* OPENING STOCK QUANTITY */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Opening Stock Quantity</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter opening stock"
                placeholderTextColor="#d1d5db"
                keyboardType="numeric"
                value={openingStock}
                onChangeText={setOpeningStock}
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
    backgroundColor: '#ffffff',
  },

  // HEADER
  
  header: {
    backgroundColor: '#C86A34',
    paddingTop: 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     paddingTop: 42,
//     paddingBottom: 18,
//     paddingHorizontal: 18,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },

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
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },

  
  headerSubtitle: {
    color: '#FCE0D0',
    fontSize: 12,
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
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#ea6c08',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  sectionNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ea6c08',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0f172a',
  },

  dropdownContainer: {
    position: 'relative',
    zIndex: 9999,
  },
  selectBtn: {
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectBtnText: {
    fontSize: 14,
    color: '#0f172a',
    flex: 1,
  },
  placeholderText: {
    color: '#94a3b8',
  },
  arrowIcon: {
    fontSize: 10,
    color: '#64748b',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
    zIndex: 9999,
    overflow: 'hidden',
    maxHeight: 150,
  },
  dropdownMenuItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dropdownMainText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '500',
  },

  textArea: {
    minHeight: 70,
  },

  inputWithActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  generateButton: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 9,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  generateButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#ea6c08',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
  },

  activePill: {
    backgroundColor: '#ea6c08',
    borderColor: '#ea6c08',
  },

  activePillSecondary: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },

  activePillTertiary: {
    backgroundColor: '#C86A34',
    borderColor: '#C86A34',
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
    backgroundColor: '#ea6c08',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#ea6c08',
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
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
