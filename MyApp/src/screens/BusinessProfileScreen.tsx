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

const BUSINESS_TYPES = [
  'Retail',
  'Wholesale',
  'Services',
  'Manufacturing',
  'Distributor',
  'E-Commerce',
];

const BUSINESS_CATEGORIES = [
  'Electronics & Electricals',
  'Grocery & Supermarket',
  'Apparel & Fashion',
  'Medical & Pharmacy',
  'Hardware & Construction',
  'FMCG & General Store',
  'Other',
];

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
              backgroundColor: isActive ? '#2563eb' : '#f1f5f9',
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

const BusinessProfileScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  // Form State
  const [businessName, setBusinessName] = useState(
    user?.businessName || 'My Business',
  );
  const [businessType, setBusinessType] = useState(
    user?.businessType || 'Retail',
  );
  const [businessCategory, setBusinessCategory] = useState(
    user?.businessCategory || 'Grocery & Supermarket',
  );
  const [businessAddress, setBusinessAddress] = useState(
    user?.businessAddress || '',
  );
  const [city, setCity] = useState(user?.city || '');
  const [stateName, setStateName] = useState(user?.state || '');
  const [pincode, setPincode] = useState(user?.pincode || '');
  const [businessDescription, setBusinessDescription] = useState(
    user?.businessDescription || '',
  );

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    if (!businessName.trim()) {
      Alert.alert('Required Field', 'Please enter your Business Name.');
      return;
    }
    if (!businessAddress.trim()) {
      Alert.alert('Required Field', 'Please enter your Business Address.');
      return;
    }
    if (!city.trim()) {
      Alert.alert('Required Field', 'Please enter your City.');
      return;
    }
    if (!pincode.trim() || pincode.trim().length !== 6) {
      Alert.alert('Invalid Pincode', 'Please enter a valid 6-digit Pincode.');
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);

    Alert.alert('Success', 'Business Profile details updated successfully!');
  };

  const initial = businessName ? businessName.charAt(0).toUpperCase() : 'B';

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        
        {/* ===================================================== */}
        {/* TOP HEADER BAR */}
        {/* ===================================================== */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <View style={styles.backArrow}>
              <View style={styles.backArrowLine} />
              <View style={styles.backArrowHead} />
            </View>
          </TouchableOpacity>

          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Business Profile</Text>
            <Text style={styles.headerSubtitle}>Manage Business Details</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* SUCCESS BANNER */}
          {savedSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✓ Business Profile updated successfully!
              </Text>
            </View>
          )}

          {/* ===================================================== */}
          {/* PROFILE BADGE CARD */}
          {/* ===================================================== */}
          <View style={styles.profileBadgeCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>

            <View style={styles.profileBadgeInfo}>
              <Text style={styles.badgeBusinessName} numberOfLines={1}>
                {businessName || 'Your Business'}
              </Text>
              <Text style={styles.badgeTypeTag}>
                {businessType} • {businessCategory}
              </Text>
            </View>
          </View>

          {/* ===================================================== */}
          {/* FORM CARD */}
          {/* ===================================================== */}
          <View style={styles.formCard}>
            <Text style={styles.sectionHeading}>Business Details</Text>
            <Text style={styles.sectionSubheading}>
              Non-sensitive business information
            </Text>

            {/* BUSINESS NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Business Name <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="e.g. Acme Enterprises"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* BUSINESS TYPE SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Business Type <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pillContainer}>
                {BUSINESS_TYPES.map(type => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typePill,
                      businessType === type && styles.activeTypePill,
                    ]}
                    onPress={() => setBusinessType(type)}>
                    <Text
                      style={[
                        styles.typePillText,
                        businessType === type && styles.activeTypePillText,
                      ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* BUSINESS CATEGORY SELECTOR */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Business Category <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.pillContainer}>
                {BUSINESS_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryPill,
                      businessCategory === cat && styles.activeCategoryPill,
                    ]}
                    onPress={() => setBusinessCategory(cat)}>
                    <Text
                      style={[
                        styles.categoryPillText,
                        businessCategory === cat && styles.activeCategoryPillText,
                      ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* BUSINESS ADDRESS */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Business Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={businessAddress}
                onChangeText={setBusinessAddress}
                placeholder="Enter shop/office street address"
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* CITY & STATE (ROW) */}
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>
                  City <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={city}
                  onChangeText={setCity}
                  placeholder="City"
                  placeholderTextColor="#94a3b8"
                />
              </View>

              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={styles.input}
                  value={stateName}
                  onChangeText={setStateName}
                  placeholder="State"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            {/* PINCODE */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                Pincode <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={styles.input}
                value={pincode}
                onChangeText={setPincode}
                placeholder="6-digit PIN code"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            {/* BUSINESS DESCRIPTION */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Description</Text>
              <TextInput
                style={[styles.input, styles.textAreaLarge]}
                value={businessDescription}
                onChangeText={setBusinessDescription}
                placeholder="Write a brief overview of your business products or services..."
                placeholderTextColor="#94a3b8"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Profile Details</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* BOTTOM NAVBAR */}
      <View style={styles.bottomNavbar}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Home', {user})}>
          <BottomNavIcon type="home" isActive={false} />
          <Text style={styles.navLabel}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('AddSale', {user})}>
          <BottomNavIcon type="add_sale" isActive={false} />
          <Text style={styles.navLabel}>Add Sale</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate('Menu', {user})}>
          <BottomNavIcon type="menu" isActive={false} />
          <Text style={styles.navLabel}>Menu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}>
          <BottomNavIcon type="profile" isActive={true} />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default BusinessProfileScreen;

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
    paddingBottom: 85,
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

  // BADGE CARD
  profileBadgeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  avatarCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eff6ff',
    borderWidth: 2,
    borderColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2563eb',
  },

  profileBadgeInfo: {
    flex: 1,
  },

  badgeBusinessName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  badgeTypeTag: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
  },

  // FORM CARD
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  sectionHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
  },

  sectionSubheading: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 3,
    marginBottom: 18,
  },

  inputGroup: {
    marginBottom: 16,
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

  textAreaLarge: {
    minHeight: 95,
  },

  // PILLS
  pillContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },

  typePill: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
  },

  activeTypePill: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  typePillText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },

  activeTypePillText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  categoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    marginBottom: 8,
  },

  activeCategoryPill: {
    backgroundColor: '#0d9488',
    borderColor: '#0d9488',
  },

  categoryPillText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },

  activeCategoryPillText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // BUTTON
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#2563eb',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
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
