import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,

  Image,
  ScrollView,
  SafeAreaView,
  Dimensions,
  TextInput,
  Animated,
  Easing,
  TouchableWithoutFeedback,
  Alert,
  StatusBar,
  Platform,
} from 'react-native';
import {setAuthToken} from '../api/tokenManager';

type Props = {
  navigation: any;
  route?: any;
  onClose?: () => void;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const SIDEBAR_WIDTH = Math.min(SCREEN_WIDTH * 0.82, 330);

// =====================================================
// COLOR PALETTE (Clean, Modern Warm ERP Theme)
// =====================================================
const COLORS = {
  primary: '#ea7e30',
  primaryLight: '#fff7ed',
  primaryBorder: '#fed7aa',
  darkSlate: '#1e293b',
  textSecondary: '#64748b',
  muted: '#94a3b8',
  bgLight: '#f8fafc',
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  white: '#ffffff',
  danger: '#ef4444',
  dangerLight: '#fef2f2',
  overlay: 'rgba(15, 23, 42, 0.45)',
};

// =====================================================
// MENU MODULES CONFIGURATION (All fields & subfields preserved)
// =====================================================
const MENU_MODULES = [
  {
    id: 'master',
    type: 'master',
    title: 'Master',
    bg: '#eff6ff',
    color: '#3b82f6',
    subfields: [
      {title: 'Products Master', target: 'ProductMaster'},
      {title: 'Product Category Master', target: 'ProductCategoryMaster'},
      {title: 'Unit Master', target: 'UnitMaster'},
      {title: 'Customer Master', target: 'CustomerMaster'},
      {title: 'Supplier Master', target: 'SupplierMaster'},
      {title: 'Financial Year', target: 'FinancialYear'},
    ],
  },
  {
    id: 'pos',
    type: 'pos',
    title: 'POS',
    bg: '#faf5ff',
    color: '#a855f7',
    subfields: [
      {title: 'New Bill', target: 'AddSale'},
      {title: 'Billing History', target: 'AllSales'},
      {title: 'Invoice Details', target: 'InvoiceDetails'},
    ],
  },
  {
    id: 'products',
    type: 'products',
    title: 'Products',
    bg: '#fffbeb',
    color: '#f59e0b',
    subfields: [
      {title: 'All Products', target: 'ProductMaster'},
      {title: 'Categories', target: 'ProductCategoryMaster'},
      {title: 'Stock', target: 'ProductMaster'},
      {title: 'Low Stock', target: 'ProductMaster'},
    ],
  },
  {
    id: 'sales',
    type: 'sales',
    title: 'Invoices',
    bg: '#fff7ed',
    color: '#ea7e30',
    subfields: [
      {title: 'All Invoices', target: 'AllSales'},
      {title: 'Add Invoice', target: 'AddSale'},
      {title: 'Credit Note', target: 'CreditNote'},
      {title:'Credit Note History', target:'CreditNoteHistory'}
    ],
  },
  {
    id: 'purchases',
    type: 'purchases',
    title: 'Purchases',
    bg: '#ecfdf5',
    color: '#059669',
    subfields: [
      {title: 'Purchase Order', target: 'PurchaseOrder'},
      {title: 'Purchase Order History', target: 'PurchaseOrderHistory'},
      {title: 'Add Purchase', target: 'AddPurchase'},
      {title: 'All Purchases', target: 'AllPurchases'},
      {title: 'Debit Note', target: 'DebitNote'},
      {title: 'Debit Note History', target: 'DebitNoteHistory'},
      {title: 'Payment Paid', target: 'PaymentPaid'},
      {title: 'Payment Paid History', target: 'PaymentPaidHistory'},
    ],
  },
  {
    id: 'expenses',
    type: 'expenses',
    title: 'Expenses',
    bg: '#fef2f2',
    color: '#ef4444',
    subfields: [
      {title: 'Expense Categories', target: 'ExpenseCategories'},
      {title: 'All Expenses', target: 'AllExpenses'},
      {title: 'Add Expense', target: 'AddExpense'},
    ],
  },
  {
    id: 'payments',
    type: 'payments',
    title: 'Payments',
    bg: '#ecfdf5',
    color: '#10b981',
    subfields: [
      {title: 'Payment History', target: 'PaymentHistory'},
      {title: 'Receive Payment', target: 'ReceivePayment'},
      {title: 'Record Payment', target: 'RecordPayment'},
    ],
  },
  {
    id: 'reports',
    type: 'reports',
    title: 'Reports',
    bg: '#f5f3ff',
    color: '#8b5cf6',
    subfields: [
      {title: 'Sales Report', target: 'SalesReport'},
      {title: 'Inventory Valuation', target: 'InventoryValuation'},
      {title: 'Party Ledger Report', target: 'PartyLedgerReport'},
      {title: 'GSTR-1 Report', target: 'GSTR1Report'},
      {title: 'Profit & Loss', target: 'ProfitLoss'},
    ],
  },
  {
    id: 'settings',
    type: 'settings',
    title: 'Settings',
    bg: '#f1f5f9',
    color: '#475569',
    subfields: [
      {title: 'Add Company', target: 'AddCompany'},
      {title: 'General Setting', target: 'GeneralSetting'},
      {title: 'Theme Setting', target: 'ThemeSetting'},
      {title: 'Invoice Prefix Setting', target: 'InvoicePrefixSetting'},
      {title: 'Invoice No Setting', target: 'InvoiceNoSetting'},
    ],
  },
];

// =====================================================
// VECTOR ICON COMPONENT FOR MODULES
// =====================================================
const ModuleIcon = ({type, color}: {type: string; color: string}) => {
  switch (type) {
    case 'master':
      return (
        <View style={{width: 20, height: 20, justifyContent: 'space-around', alignItems: 'center'}}>
          <View style={{width: 18, height: 3, backgroundColor: color, borderRadius: 1.5}} />
          <View style={{width: 14, height: 3, backgroundColor: color, borderRadius: 1.5}} />
          <View style={{width: 18, height: 3, backgroundColor: color, borderRadius: 1.5}} />
        </View>
      );
    case 'pos':
      return (
        <View style={{width: 20, height: 18, borderWidth: 2, borderColor: color, borderRadius: 4, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', gap: 2}}>
            <View style={{width: 3, height: 3, backgroundColor: color, borderRadius: 1.5}} />
            <View style={{width: 3, height: 3, backgroundColor: color, borderRadius: 1.5}} />
            <View style={{width: 3, height: 3, backgroundColor: color, borderRadius: 1.5}} />
          </View>
        </View>
      );
    case 'products':
      return (
        <View style={{width: 20, height: 18, borderWidth: 2, borderColor: color, borderRadius: 3, padding: 2, justifyContent: 'center', alignItems: 'center'}}>
          <View style={{width: 10, height: 2, backgroundColor: color, borderRadius: 1}} />
        </View>
      );
    case 'sales':
      return (
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 2.5, width: 20, height: 18, justifyContent: 'center'}}>
          <View style={{width: 4, height: 6, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 4, height: 12, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 4, height: 17, backgroundColor: color, borderRadius: 1}} />
        </View>
      );
    case 'purchases':
      return (
        <View style={{width: 20, height: 18, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 8, height: 5, borderTopLeftRadius: 4, borderTopRightRadius: 4, borderWidth: 1.8, borderColor: color, borderBottomWidth: 0}} />
          <View style={{width: 16, height: 11, borderRadius: 3, borderWidth: 1.8, borderColor: color}} />
        </View>
      );
    case 'expenses':
      return (
        <View style={{width: 20, height: 16, borderRadius: 3.5, borderWidth: 1.8, borderColor: color, justifyContent: 'center', paddingLeft: 2}}>
          <View style={{width: 5, height: 4, backgroundColor: color, borderRadius: 1.5}} />
        </View>
      );
    case 'payments':
      return (
        <View style={{width: 20, height: 20, borderRadius: 10, borderWidth: 1.8, borderColor: color, alignItems: 'center', justifyContent: 'center'}}>
          <Text style={{fontSize: 11, fontWeight: '800', color: color}}>₹</Text>
        </View>
      );
    case 'reports':
      return (
        <View style={{width: 18, height: 20, borderRadius: 3, borderWidth: 1.8, borderColor: color, padding: 2.5, justifyContent: 'space-around'}}>
          <View style={{width: 9, height: 2, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 6, height: 2, backgroundColor: color, borderRadius: 1}} />
          <View style={{width: 8, height: 2, backgroundColor: color, borderRadius: 1}} />
        </View>
      );
    case 'settings':
      return (
        <Text style={{fontSize: 16, color: color, fontWeight: '700'}}>⚙</Text>
      );
    default:
      return <View style={{width: 14, height: 14, backgroundColor: color, borderRadius: 7}} />;
  }
};

// =====================================================
// EXPANDABLE MODULE ITEM ACCORDION
// =====================================================
const ModuleAccordionItem = ({
  module,
  isExpanded,
  onToggle,
  onSelectField,
}: {
  module: any;
  isExpanded: boolean;
  onToggle: () => void;
  onSelectField: (target: string, title: string) => void;
}) => {
  const rotation = useRef(new Animated.Value(isExpanded ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(rotation, {
      toValue: isExpanded ? 1 : 0,
      friction: 6,
      tension: 60,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotation]);

  const rotateInterpolate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={styles.moduleItemWrapper}>
      {/* Module Title Row */}
      <Pressable style={({pressed}) => [styles.moduleRow, pressed && {backgroundColor: '#fff7ed'}]} onPress={onToggle}>
        {/* Module Icon Container */}
        <View style={[styles.moduleIconContainer, {backgroundColor: module.bg}]}>
          <ModuleIcon type={module.type} color={module.color} />
        </View>

        {/* Module Title */}
        <Text style={styles.moduleTitleText}>{module.title}</Text>

        {/* Circular Downward Chevron Pill */}
        <View style={styles.chevronPill}>
          <Animated.Text
            style={[
              styles.chevronText,
              {transform: [{rotate: rotateInterpolate}]},
            ]}>
            ⌄
          </Animated.Text>
        </View>
      </Pressable>

      {/* Expanded Subfields List */}
      {isExpanded && (
        <View style={styles.subfieldContainer}>
          {module.subfields.map((sub: any, idx: number) => (
            <TouchableOpacity
              key={`${module.id}-${sub.target}-${idx}`}
              style={styles.subfieldRow}
              activeOpacity={0.7}
              onPress={() => onSelectField(sub.target, sub.title)}>
              <View style={styles.subfieldDot} />
              <Text style={styles.subfieldTitle} numberOfLines={1}>
                {sub.title}
              </Text>
              <Text style={styles.subfieldChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// =====================================================
// MAIN SIDEBAR / MENU SCREEN
// =====================================================
const MenuScreen = ({navigation, route, onClose}: Props) => {
  const user = route?.params?.user;
  const userName = user?.name || 'Sakshi Mankar';
  const businessName = user?.businessName || 'Sharma Traders';

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);

  // Smooth slide-in animation from left
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start();
  }, [slideAnim, fadeAnim]);

  const closeMenu = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SIDEBAR_WIDTH,
        duration: 220,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onClose) {
        onClose();
      } else if (navigation?.canGoBack && navigation.canGoBack()) {
        navigation.goBack();
      } else if (navigation?.goBack) {
        navigation.goBack();
      }
    });
  };

  const openPage = (screenName: string, fieldTitle?: string) => {
    if (screenName === 'Logout') {
      Alert.alert(
        'Confirm Logout',
        'Are you sure you want to logout from your account?',
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Logout',
            style: 'destructive',
            onPress: async () => {
              await setAuthToken(null);
              navigation.reset({
                index: 0,
                routes: [{name: 'Login'}],
              });
            },
          },
        ],
      );
      return;
    }

    if (onClose) {
      onClose();
      navigation.navigate(screenName, {user});
    } else {
      if (navigation.replace) {
        navigation.replace(screenName, {user});
      } else {
        navigation.navigate(screenName, {user});
      }
    }
  };

  const toggleModule = (moduleId: string) => {
    setExpandedModuleId(prev => (prev === moduleId ? null : moduleId));
  };

  const filteredModules = MENU_MODULES.filter(module => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    return (
      module.title.toLowerCase().includes(query) ||
      module.subfields.some((sub: any) =>
        sub.title.toLowerCase().includes(query),
      )
    );
  });

  return (
    <View style={styles.absoluteContainer}>
      <StatusBar barStyle="dark-content" />

      {/* OUTSIDE BACKDROP TAP TO DISMISS */}
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[styles.backdrop, {opacity: fadeAnim}]} />
      </TouchableWithoutFeedback>

      {/* SLIDING SIDEBAR DRAWER */}
      <Animated.View
        style={[
          styles.sidebar,
          {transform: [{translateX: slideAnim}]},
        ]}>
        <SafeAreaView style={{flex: 1, backgroundColor: COLORS.white}}>
          
          {/* 1. TOP HEADER: LOGO & CLOSE BUTTON */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/images/mirabooks_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeMenu}
              activeOpacity={0.7}
              hitSlop={{top: 14, bottom: 14, left: 14, right: 14}}>
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 2. USER PROFILE INFO SECTION */}
          <View style={styles.userProfileSection}>
            <View style={styles.userAvatar}>
              <View style={styles.avatarHead} />
              <View style={styles.avatarBody} />
            </View>
            <View style={styles.userInfoText}>
              <Text style={styles.userNameText} numberOfLines={1}>
                {userName}
              </Text>
              <Text style={styles.userBusinessText} numberOfLines={1}>
                {businessName} · Owner
              </Text>
            </View>
          </View>

          {/* 3. SEARCH BAR */}
          <View style={styles.searchWrapper}>
            <View style={styles.searchContainer}>
              <Text style={styles.searchGlassIcon}>🔍</Text>
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search modules..."
                placeholderTextColor={COLORS.textSecondary}
                style={styles.searchInput}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery('')}
                  style={styles.clearSearchBtn}>
                  <Text style={styles.clearSearchText}>✕</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 4. SCROLLABLE MODULES LIST */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.menuScrollContent}>
            
            {filteredModules.map(module => {
              const isExpanded = searchQuery.trim()
                ? true
                : expandedModuleId === module.id;

              return (
                <ModuleAccordionItem
                  key={module.id}
                  module={module}
                  isExpanded={isExpanded}
                  onToggle={() => toggleModule(module.id)}
                  onSelectField={(target, title) => openPage(target, title)}
                />
              );
            })}

            {/* 5. ACCOUNT SECTION */}
            <View style={styles.accountSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>ACCOUNT</Text>
                <View style={styles.sectionDivider} />
              </View>

              {/* MY PROFILE */}
              <Pressable style={({pressed}) => [styles.accountRow, pressed && {backgroundColor: '#fff7ed'}]} onPress={() => openPage('BusinessProfile')}>
                <View style={[styles.accountIconBox, {backgroundColor: '#fff7ed'}]}>
                  <Text style={{fontSize: 16, color: '#ea7e30'}}>👤</Text>
                </View>
                <Text style={styles.accountLabel}>My Profile</Text>
                <Text style={styles.accountChevron}>›</Text>
              </Pressable>

              {/* HELP & SUPPORT */}
              <Pressable style={({pressed}) => [styles.accountRow, pressed && {backgroundColor: '#fff7ed'}]} onPress={() => openPage('AccountSettings')}>
                <View style={[styles.accountIconBox, {backgroundColor: '#f1f5f9'}]}>
                  <Text style={{fontSize: 16, color: '#475569', fontWeight: '800'}}>?</Text>
                </View>
                <Text style={styles.accountLabel}>Help & Support</Text>
                <Text style={styles.accountChevron}>›</Text>
              </Pressable>

              {/* LOGOUT */}
              <Pressable style={({pressed}) => [styles.accountRow, pressed && {backgroundColor: '#fff7ed'}]} onPress={() => openPage('Logout')}>
                <View style={[styles.accountIconBox, {backgroundColor: '#fef2f2'}]}>
                  <Text style={{fontSize: 16, color: '#ef4444'}}>↪</Text>
                </View>
                <Text style={[styles.accountLabel, {color: '#ef4444'}]}>Logout</Text>
                <Text style={[styles.accountChevron, {color: '#ef4444'}]}>›</Text>
              </Pressable>
            </View>
          </ScrollView>

          {/* 6. SIDEBAR FOOTER BRANDING */}
          <View style={styles.footer}>
            <View style={styles.footerLogoRow}>
              <Image
                source={require('../assets/images/mirabooks_logo.png')}
                style={styles.footerLogo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.footerSubtitle}>
              Business & Billing Solution
            </Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
};

export default MenuScreen;

// =====================================================
// STYLESHEET
// =====================================================
const styles = StyleSheet.create({
  absoluteContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    elevation: 9999,
  },

  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
  },

  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    height: '100%',
    backgroundColor: COLORS.white,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {width: 6, height: 0},
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 25,
    zIndex: 10000,
    overflow: 'hidden',
  },

  // ---- HEADER ----
  header: {
    backgroundColor: '#fffaf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f8ece3',
  },

  logoContainer: {
    flex: 1,
    height: 44,
    justifyContent: 'center',
  },

  logoImage: {
    width: 155,
    height: 42,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  closeIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },

  // ---- USER PROFILE SECTION ----
  userProfileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },

  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ffedd5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  avatarHead: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#ea7e30',
    marginBottom: 2,
  },

  avatarBody: {
    width: 22,
    height: 11,
    borderTopLeftRadius: 11,
    borderTopRightRadius: 11,
    backgroundColor: '#ea7e30',
  },

  userInfoText: {
    flex: 1,
  },

  userNameText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 3,
  },

  userBusinessText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  // ---- SEARCH BAR ----
  searchWrapper: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 22,
    paddingHorizontal: 14,
    height: 44,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  searchGlassIcon: {
    fontSize: 14,
    marginRight: 8,
    color: '#ea7e30',
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    paddingVertical: 0,
  },

  clearSearchBtn: {
    padding: 4,
  },

  clearSearchText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },

  // ---- MENU CONTENT SCROLL ----
  menuScrollContent: {
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 24,
  },

  // ---- MODULE ROW ----
  moduleItemWrapper: {
    marginBottom: 8,
  },

  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
  },

  moduleIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  moduleTitleText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },

  chevronPill: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chevronText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#64748b',
    marginTop: -2,
  },

  // ---- SUBFIELDS ----
  subfieldContainer: {
    paddingLeft: 46,
    paddingRight: 8,
    paddingVertical: 4,
  },

  subfieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    marginBottom: 5,
  },

  subfieldDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ea7e30',
    marginRight: 10,
  },

  subfieldTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#334155',
  },

  subfieldChevron: {
    fontSize: 16,
    color: '#94a3b8',
    fontWeight: '700',
  },

  // ---- ACCOUNT SECTION ----
  accountSection: {
    marginTop: 16,
    paddingTop: 8,
  },

  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingHorizontal: 8,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    marginRight: 10,
  },

  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: '#f1f5f9',
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 14,
    marginBottom: 4,
  },

  accountIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  accountLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },

  accountChevron: {
    fontSize: 18,
    color: '#cbd5e1',
    fontWeight: '700',
  },

  // ---- FOOTER ----
  footer: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    backgroundColor: COLORS.white,
  },

  footerLogoRow: {
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },

  footerLogo: {
    width: 110,
    height: 24,
  },

  footerSubtitle: {
    fontSize: 11,
    color: '#ea7e30',
    fontWeight: '700',
  },
});