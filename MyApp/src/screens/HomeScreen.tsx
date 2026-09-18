import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import MenuScreen from './MenuScreen';

type Props = {
  navigation: any;
  route: any;
};

const {width: SCREEN_WIDTH} = Dimensions.get('window');

// ======================================================
// ICON COMPONENTS (Pure View-based, no external deps)
// ======================================================

// Hamburger menu icon
const MenuIcon = () => (
  <View style={{width: 22, height: 16, justifyContent: 'space-between'}}>
    <View style={{width: 22, height: 2.4, backgroundColor: '#334155', borderRadius: 1.2}} />
    <View style={{width: 16, height: 2.4, backgroundColor: '#334155', borderRadius: 1.2}} />
    <View style={{width: 22, height: 2.4, backgroundColor: '#334155', borderRadius: 1.2}} />
  </View>
);

// Notification bell icon
const BellIcon = () => (
  <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
    {/* Notification dot indicator */}
    <View style={{position: 'absolute', top: 1, right: 2, width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#ef4444', zIndex: 2, borderWidth: 1.2, borderColor: '#ffffff'}} />
    <View style={{width: 4.5, height: 3, borderTopLeftRadius: 2.2, borderTopRightRadius: 2.2, backgroundColor: '#ea7e30'}} />
    <View style={{width: 14, height: 10, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: '#ea7e30'}} />
    <View style={{width: 18, height: 2.6, borderRadius: 1.3, backgroundColor: '#ea7e30'}} />
    <View style={{width: 5.5, height: 2.6, borderBottomLeftRadius: 2.6, borderBottomRightRadius: 2.6, backgroundColor: '#ea7e30', marginTop: 0.5}} />
  </View>
);

// Profile/User avatar icon
const ProfileIcon = () => (
  <View style={{width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff0e6', borderWidth: 2, borderColor: '#ea7e30', alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: 11, height: 11, borderRadius: 5.5, backgroundColor: '#ea7e30', marginBottom: 1.5}} />
    <View style={{width: 17, height: 9, borderTopLeftRadius: 8.5, borderTopRightRadius: 8.5, backgroundColor: '#ea7e30'}} />
  </View>
);

// Growth plant illustration for the greeting banner
const GrowthIllustration = () => (
  <View style={{width: 95, height: 95, alignItems: 'center', justifyContent: 'flex-end'}}>
    {/* Arrow going up */}
    <View style={{position: 'absolute', bottom: 18, left: 8, width: 75, height: 48}}>
      {/* Rising curve represented by steps */}
      <View style={{position: 'absolute', bottom: 0, left: 0, width: 18, height: 13, backgroundColor: '#f97316', borderRadius: 4}} />
      <View style={{position: 'absolute', bottom: 7, left: 22, width: 18, height: 24, backgroundColor: '#f97316', borderRadius: 4}} />
      <View style={{position: 'absolute', bottom: 14, left: 44, width: 18, height: 36, backgroundColor: '#22c55e', borderRadius: 4}} />
    </View>
    {/* Leaf / plant on top */}
    <View style={{position: 'absolute', top: 0, right: 6}}>
      <View style={{width: 20, height: 20, borderTopRightRadius: 15, borderBottomLeftRadius: 15, backgroundColor: '#22c55e', transform: [{rotate: '15deg'}]}} />
      <View style={{width: 15, height: 15, borderTopRightRadius: 12, borderBottomLeftRadius: 12, backgroundColor: '#16a34a', transform: [{rotate: '-20deg'}], marginTop: -8, marginLeft: 8}} />
    </View>
    {/* Stem */}
    <View style={{position: 'absolute', top: 16, right: 15, width: 2.8, height: 30, backgroundColor: '#16a34a'}} />
  </View>
);

// Sales bar chart icon
const SalesIcon = () => (
  <View style={{width: 32, height: 32, alignItems: 'center', justifyContent: 'flex-end'}}>
    <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 4}}>
      <View style={{width: 6, height: 10, backgroundColor: '#ea7e30', borderRadius: 2}} />
      <View style={{width: 6, height: 17, backgroundColor: '#ea7e30', borderRadius: 2}} />
      <View style={{width: 6, height: 25, backgroundColor: '#ea7e30', borderRadius: 2}} />
    </View>
  </View>
);

// Shopping cart icon for purchases
const PurchaseIcon = () => (
  <View style={{width: 32, height: 32, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: 12, height: 8, borderTopLeftRadius: 6, borderTopRightRadius: 6, borderWidth: 2.4, borderColor: '#059669', borderBottomWidth: 0}} />
    <View style={{width: 24, height: 16, borderRadius: 5, borderWidth: 2.4, borderColor: '#059669', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: 10, height: 2.4, backgroundColor: '#059669', borderRadius: 1.2}} />
    </View>
  </View>
);

// Wallet icon for expenses
const ExpenseIcon = () => (
  <View style={{width: 32, height: 32, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: 26, height: 19, borderRadius: 5, borderWidth: 2.4, borderColor: '#ef4444', backgroundColor: 'transparent', justifyContent: 'center', paddingLeft: 4}}>
      <View style={{width: 7.5, height: 6, backgroundColor: '#ef4444', borderRadius: 2}} />
    </View>
  </View>
);

// Circle with rupee icon for profit
const ProfitIcon = () => (
  <View style={{width: 32, height: 32, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{width: 26, height: 26, borderRadius: 13, borderWidth: 2.4, borderColor: '#7c3aed', alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 13, fontWeight: '800', color: '#7c3aed'}}>₹</Text>
    </View>
  </View>
);

// Arrow up indicator
const ArrowUp = ({color = '#16a34a'}: {color?: string}) => (
  <View style={{width: 0, height: 0, borderLeftWidth: 4.5, borderRightWidth: 4.5, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color}} />
);

// Arrow down indicator
const ArrowDown = ({color = '#ef4444'}: {color?: string}) => (
  <View style={{width: 0, height: 0, borderLeftWidth: 4.5, borderRightWidth: 4.5, borderTopWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: color}} />
);

// Chevron right arrow for cards
const ChevronRight = ({color = '#94a3b8'}: {color?: string}) => (
  <View style={{width: 9, height: 9, borderTopWidth: 2.2, borderRightWidth: 2.2, borderColor: color, transform: [{rotate: '45deg'}]}} />
);

// ======================================================
// BOTTOM NAV ICONS (ENLARGED & SHARP)
// ======================================================
const HomeNavIcon = ({active}: {active: boolean}) => {
  const color = active ? '#ea7e30' : '#64748b';
  return (
    <View style={{width: 28, height: 28, alignItems: 'center', justifyContent: 'flex-end'}}>
      <View style={{width: 0, height: 0, borderLeftWidth: 12, borderRightWidth: 12, borderBottomWidth: 10, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color}} />
      <View style={{width: 19, height: 12, backgroundColor: color, borderBottomLeftRadius: 3.5, borderBottomRightRadius: 3.5, alignItems: 'center'}}>
        <View style={{width: 6, height: 7, backgroundColor: '#ffffff', position: 'absolute', bottom: 0, borderTopLeftRadius: 1.5, borderTopRightRadius: 1.5}} />
      </View>
    </View>
  );
};

const SalesNavIcon = ({active}: {active: boolean}) => {
  const color = active ? '#ea7e30' : '#64748b';
  return (
    <View style={{width: 28, height: 28, alignItems: 'center', justifyContent: 'flex-end'}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 2.5}}>
        <View style={{width: 5, height: 7, backgroundColor: color, borderRadius: 1.5}} />
        <View style={{width: 5, height: 13, backgroundColor: color, borderRadius: 1.5}} />
        <View style={{width: 5, height: 19, backgroundColor: color, borderRadius: 1.5}} />
      </View>
    </View>
  );
};

const PurchaseNavIcon = ({active}: {active: boolean}) => {
  const color = active ? '#ea7e30' : '#64748b';
  return (
    <View style={{width: 28, height: 28, alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: 10, height: 6, borderTopLeftRadius: 5, borderTopRightRadius: 5, borderWidth: 2.2, borderColor: color, borderBottomWidth: 0}} />
      <View style={{width: 19, height: 13, borderRadius: 3.5, borderWidth: 2.2, borderColor: color}} />
    </View>
  );
};

const MoreNavIcon = ({active}: {active: boolean}) => {
  const color = active ? '#ea7e30' : '#64748b';
  return (
    <View style={{width: 24, height: 19, justifyContent: 'space-between'}}>
      <View style={{width: 24, height: 3, backgroundColor: color, borderRadius: 1.5}} />
      <View style={{width: 24, height: 3, backgroundColor: color, borderRadius: 1.5}} />
      <View style={{width: 24, height: 3, backgroundColor: color, borderRadius: 1.5}} />
    </View>
  );
};

// ======================================================
// MAIN HOME SCREEN
// ======================================================
const HomeScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;
  const userName = user?.name || user?.businessName || 'Sakshi';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openPage = (screenName: string) => {
    navigation.navigate(screenName, {
      user: user,
    });
  };

  // Determine greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 17) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <View style={{flex: 1, backgroundColor: '#f8f9fb'}}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />

        {/* ================================================= */}
        {/* ENLARGED HEADER WITH TRANSPARENT LOGO */}
        {/* ================================================= */}
        <View style={styles.header}>
          {/* Menu Button */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setIsMenuOpen(true)}
            activeOpacity={0.7}
            hitSlop={{top: 14, bottom: 14, left: 14, right: 14}}>
            <MenuIcon />
          </TouchableOpacity>

          {/* Large Transparent Logo Image */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/mirabooks_logo.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>

          {/* Notification Bell */}
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => setIsMenuOpen(true)}
            activeOpacity={0.7}>
            <BellIcon />
          </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity
          style={[styles.headerBtn, {marginLeft: 6}]}
          onPress={() => openPage('BusinessProfile')}
          activeOpacity={0.7}>
          <ProfileIcon />
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* SCROLLABLE CONTENT */}
      {/* ================================================= */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* ============================================= */}
        {/* GREETING BANNER */}
        {/* ============================================= */}
        <View style={styles.greetingBanner}>
          <View style={styles.greetingTextArea}>
            <Text style={styles.greetingLabel}>{getGreeting()}</Text>
            <Text style={styles.greetingName}>{userName} 🌻</Text>
            <Text style={styles.greetingSubtext}>
              Manage your business,{'\n'}track your growth.
            </Text>
          </View>
          <GrowthIllustration />
        </View>

        {/* ============================================= */}
        {/* METRIC CARDS — 2×2 GRID */}
        {/* ============================================= */}
        <View style={styles.cardGrid}>

          {/* TOTAL SALES */}
          <TouchableOpacity
            style={[styles.metricCard, styles.salesCard]}
            activeOpacity={0.7}
            onPress={() => openPage('Sales')}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, {backgroundColor: '#fff7ed'}]}>
                <SalesIcon />
              </View>
              <ChevronRight color="#c4956e" />
            </View>
            <Text style={styles.cardLabel}>Total Sales</Text>
            <Text style={[styles.cardValue, {color: '#ea7e30'}]}>₹48,750</Text>
            <View style={styles.trendRow}>
              <ArrowUp color="#16a34a" />
              <Text style={[styles.trendText, {color: '#16a34a'}]}> 12%</Text>
              <Text style={styles.trendMeta}>  vs last week</Text>
            </View>
          </TouchableOpacity>

          {/* TOTAL PURCHASE */}
          <TouchableOpacity
            style={[styles.metricCard, styles.purchaseCard]}
            activeOpacity={0.7}
            onPress={() => openPage('AllPurchases')}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, {backgroundColor: '#ecfdf5'}]}>
                <PurchaseIcon />
              </View>
              <ChevronRight color="#7ebfa8" />
            </View>
            <Text style={styles.cardLabel}>Total Purchase</Text>
            <Text style={[styles.cardValue, {color: '#059669'}]}>₹32,400</Text>
            <View style={styles.trendRow}>
              <ArrowUp color="#16a34a" />
              <Text style={[styles.trendText, {color: '#16a34a'}]}> 8%</Text>
              <Text style={styles.trendMeta}>  vs last week</Text>
            </View>
          </TouchableOpacity>

          {/* TOTAL EXPENSES */}
          <TouchableOpacity
            style={[styles.metricCard, styles.expenseCard]}
            activeOpacity={0.7}
            onPress={() => openPage('Menu')}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, {backgroundColor: '#fef2f2'}]}>
                <ExpenseIcon />
              </View>
              <ChevronRight color="#d4a0a0" />
            </View>
            <Text style={styles.cardLabel}>Total Expenses</Text>
            <Text style={[styles.cardValue, {color: '#ef4444'}]}>₹6,820</Text>
            <View style={styles.trendRow}>
              <ArrowDown color="#ef4444" />
              <Text style={[styles.trendText, {color: '#ef4444'}]}> 5%</Text>
              <Text style={styles.trendMeta}>  vs last week</Text>
            </View>
          </TouchableOpacity>

          {/* TOTAL PROFIT */}
          <TouchableOpacity
            style={[styles.metricCard, styles.profitCard]}
            activeOpacity={0.7}
            onPress={() => openPage('Menu')}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, {backgroundColor: '#f3e8ff'}]}>
                <ProfitIcon />
              </View>
              <ChevronRight color="#b8a0d4" />
            </View>
            <Text style={styles.cardLabel}>Total Profit</Text>
            <Text style={[styles.cardValue, {color: '#7c3aed'}]}>₹9,530</Text>
            <View style={styles.trendRow}>
              <ArrowUp color="#16a34a" />
              <Text style={[styles.trendText, {color: '#16a34a'}]}> 15%</Text>
              <Text style={styles.trendMeta}>  vs last week</Text>
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>

      {/* ================================================= */}
      {/* ENLARGED BOTTOM NAVIGATION BAR */}
      {/* ================================================= */}
      <View style={styles.bottomNav}>
        {/* Home */}
        <TouchableOpacity style={styles.navItem} onPress={() => {}}>
          <HomeNavIcon active={true} />
          <Text style={[styles.navLabel, styles.navLabelActive]}>Home</Text>
        </TouchableOpacity>

        {/* Sales */}
        <TouchableOpacity style={styles.navItem} onPress={() => openPage('Sales')}>
          <SalesNavIcon active={false} />
          <Text style={styles.navLabel}>Sales</Text>
        </TouchableOpacity>

        {/* Center Floating Add Button */}
        <View style={styles.navCenterWrap}>
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => openPage('AddSale')}>
            <View style={styles.addIconH} />
            <View style={styles.addIconV} />
          </TouchableOpacity>
        </View>

        {/* Purchase */}
        <TouchableOpacity style={styles.navItem} onPress={() => openPage('AllPurchases')}>
          <PurchaseNavIcon active={false} />
          <Text style={styles.navLabel}>Purchase</Text>
        </TouchableOpacity>

        {/* More */}
        <TouchableOpacity style={styles.navItem} onPress={() => setIsMenuOpen(true)}>
          <MoreNavIcon active={false} />
          <Text style={styles.navLabel}>More</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>

    {/* SLIDING SIDEBAR DRAWER OVERLAY */}
    {isMenuOpen && (
      <MenuScreen
        navigation={navigation}
        route={route}
        onClose={() => setIsMenuOpen(false)}
      />
    )}
  </View>
);
};

export default HomeScreen;

// ======================================================
// STYLES
// ======================================================
const CARD_GAP = 14;
const CARD_WIDTH = (SCREEN_WIDTH - 16 * 2 - CARD_GAP) / 2;

const styles = StyleSheet.create({
  // ---- LAYOUT ----
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  // ---- HEADER ----
  header: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 30 : 24,
    paddingBottom: 22,
    paddingHorizontal: 16,
    minHeight: 96,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f4',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.04,
    shadowRadius: 3,
  },
  headerBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    flex: 1,
    height: 48,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 8,
  },
  headerLogo: {
    width: 170,
    height: 46,
  },

  // ---- SCROLL ----
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 115,
  },

  // ---- GREETING BANNER ----
  greetingBanner: {
    backgroundColor: '#f0faf4',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d4edda',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  greetingTextArea: {
    flex: 1,
    marginRight: 10,
  },
  greetingLabel: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  greetingName: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1e293b',
    marginTop: 3,
    marginBottom: 8,
  },
  greetingSubtext: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    fontWeight: '400',
  },

  // ---- METRIC CARDS GRID ----
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  metricCard: {
    width: CARD_WIDTH,
    borderRadius: 18,
    padding: 18,
    minHeight: 166,
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  // Card color variants — soft tinted backgrounds
  salesCard: {
    backgroundColor: '#fef9f5',
    borderColor: '#fce8d5',
  },
  purchaseCard: {
    backgroundColor: '#f2fdf7',
    borderColor: '#c6f0d9',
  },
  expenseCard: {
    backgroundColor: '#fff5f5',
    borderColor: '#fddcdc',
  },
  profitCard: {
    backgroundColor: '#f9f5ff',
    borderColor: '#e4d5f7',
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 13,
    fontWeight: '700',
  },
  trendMeta: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '400',
  },

  // ---- BOTTOM NAVIGATION (ENLARGED) ----
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f1f1f4',
    elevation: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -4},
    shadowOpacity: 0.07,
    shadowRadius: 10,
    paddingBottom: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 6,
  },
  navLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#ea7e30',
    fontWeight: '700',
  },

  // ---- CENTER ADD BUTTON ----
  navCenterWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ea7e30',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  addIconH: {
    position: 'absolute',
    width: 24,
    height: 3.5,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  addIconV: {
    position: 'absolute',
    width: 3.5,
    height: 24,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});
