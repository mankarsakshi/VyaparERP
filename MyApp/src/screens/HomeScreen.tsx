import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

// ======================================================
// METRIC CARD ICON COMPONENT
// ======================================================
const MetricCardIcon = ({type}: {type: string}) => {
  switch (type) {
    case 'sales':
      return (
        <View style={{width: 22, height: 22, justifyContent: 'flex-end', alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: 18, height: 16}}>
            <View style={{width: 4, height: 6, backgroundColor: '#2563eb', borderRadius: 1.5}} />
            <View style={{width: 4, height: 11, backgroundColor: '#2563eb', borderRadius: 1.5}} />
            <View style={{width: 4, height: 16, backgroundColor: '#2563eb', borderRadius: 1.5}} />
          </View>
        </View>
      );
    case 'purchases':
      return (
        <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 8, height: 5, borderTopLeftRadius: 4, borderTopRightRadius: 4, borderWidth: 1.8, borderColor: '#059669', borderBottomWidth: 0}} />
          <View style={{width: 17, height: 12, borderRadius: 3, borderWidth: 1.8, borderColor: '#059669', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 7, height: 1.5, backgroundColor: '#059669', borderRadius: 1}} />
          </View>
        </View>
      );
    case 'expenses':
      return (
        <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 18, height: 13, borderRadius: 3, borderWidth: 1.8, borderColor: '#d97706', paddingHorizontal: 3, justifyContent: 'center'}}>
            <View style={{width: 5, height: 4, backgroundColor: '#d97706', borderRadius: 1}} />
          </View>
        </View>
      );
    case 'profit':
      return (
        <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{width: 18, height: 18, borderRadius: 9, borderWidth: 1.8, borderColor: '#7c3aed', alignItems: 'center', justifyContent: 'center'}}>
            <View style={{width: 0, height: 0, borderLeftWidth: 3.5, borderRightWidth: 3.5, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7c3aed'}} />
          </View>
        </View>
      );
    default:
      return null;
  }
};

// ======================================================
// BOTTOM NAV ICON COMPONENT
// ======================================================
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

// ======================================================
// SETTINGS GEAR ICON
// ======================================================
const HeaderSettingsIcon = () => (
  <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
    <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#2563eb', borderRadius: 1.5}} />
    <View style={{position: 'absolute', width: 20, height: 3, backgroundColor: '#2563eb', borderRadius: 1.5}} />
    <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#2563eb', borderRadius: 1.5, transform: [{rotate: '45deg'}]}} />
    <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#2563eb', borderRadius: 1.5, transform: [{rotate: '-45deg'}]}} />
    <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center'}}>
      <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffffff'}} />
    </View>
  </View>
);

const HomeScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;
  const businessName = user?.businessName || 'My Business';

  const openPage = (screenName: string) => {
    navigation.navigate(screenName, {
      user: user,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}
      
      <View style={styles.header}>
        {/* THREE LINE MENU ICON */}
        <TouchableOpacity
          style={styles.headerMenuButton}
          onPress={() => openPage('Menu')}
          activeOpacity={0.7}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          <View style={styles.menuIconWrapper}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>

        {/* BUSINESS NAME */}
        <View style={styles.headerContent}>
          <Text style={styles.welcome}>Welcome 👋</Text>
          <Text style={styles.businessName} numberOfLines={1}>
            {businessName}
          </Text>
        </View>

        {/* NOTIFICATION */}
        <TouchableOpacity
          style={styles.notificationButton}
          onPress={() => openPage('Notifications')}>
          <View style={styles.notificationCircle}>
            <View style={styles.bellWrapper}>
              <View style={styles.bellHandle} />
              <View style={styles.bellDome} />
              <View style={styles.bellBase} />
              <View style={styles.bellClapper} />
            </View>
          </View>
        </TouchableOpacity>

        {/* SETTINGS */}
        <TouchableOpacity
          style={styles.headerSettingsButton}
          onPress={() => openPage('BusinessSettings')}>
          <View style={styles.headerSettingsCircle}>
            <HeaderSettingsIcon />
          </View>
        </TouchableOpacity>
      </View>

      {/* ================================================= */}
      {/* HOME / DASHBOARD CONTENT */}
      {/* ================================================= */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        
        {/* METRIC CARDS GRID */}
        <View style={styles.cardGrid}>
          {/* SALES */}
          <View style={styles.dashboardCard}>
            <View
              style={[
                styles.cardIconContainer,
                {backgroundColor: '#eff6ff'},
              ]}>
              <MetricCardIcon type="sales" />
            </View>

            <Text style={styles.cardTitle}>Total Sales</Text>
            <Text style={styles.cardDescription}>View and manage sales</Text>
          </View>

          {/* PURCHASES */}
          <View style={styles.dashboardCard}>
            <View
              style={[
                styles.cardIconContainer,
                {backgroundColor: '#ecfdf5'},
              ]}>
              <MetricCardIcon type="purchases" />
            </View>

            <Text style={styles.cardTitle}>Total Purchases</Text>
            <Text style={styles.cardDescription}>View and manage purchases</Text>
          </View>

          {/* EXPENSES */}
          <View style={styles.dashboardCard}>
            <View
              style={[
                styles.cardIconContainer,
                {backgroundColor: '#fff7ed'},
              ]}>
              <MetricCardIcon type="expenses" />
            </View>

            <Text style={styles.cardTitle}>Total Expenses</Text>
            <Text style={styles.cardDescription}>Track your expenses</Text>
          </View>

          {/* PROFIT */}
          <View style={styles.dashboardCard}>
            <View
              style={[
                styles.cardIconContainer,
                {backgroundColor: '#f3e8ff'},
              ]}>
              <MetricCardIcon type="profit" />
            </View>

            <Text style={styles.cardTitle}>Net Profit</Text>
            <Text style={styles.cardDescription}>Check your business profit</Text>
          </View>
        </View>

      </ScrollView>

      {/* ================================================= */}
      {/* BOTTOM NAVBAR */}
      {/* ================================================= */}
      <View style={styles.bottomNavbar}>
        {/* HOME (ACTIVE) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}>
          <BottomNavIcon type="home" isActive={true} />
          <Text style={[styles.navLabel, styles.activeNavLabel]}>Home</Text>
        </TouchableOpacity>

        {/* ADD SALE (REPLACES DASHBOARD) */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('AddSale')}>
          <BottomNavIcon type="add_sale" isActive={false} />
          <Text style={styles.navLabel}>Add Sale</Text>
        </TouchableOpacity>

        {/* MENU */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('Menu')}>
          <BottomNavIcon type="menu" isActive={false} />
          <Text style={styles.navLabel}>Menu</Text>
        </TouchableOpacity>

        {/* PROFILE */}
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

export default HomeScreen;

// ======================================================
// STYLES
// ======================================================
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

  headerMenuButton: {
    paddingRight: 14,
    paddingVertical: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIconWrapper: {
    width: 22,
    height: 16,
    justifyContent: 'space-between',
  },

  menuLine: {
    width: 22,
    height: 2.5,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },

  headerContent: {
    flex: 1,
  },

  welcome: {
    color: '#dbeafe',
    fontSize: 13,
  },

  businessName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
  },

  notificationButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },

  notificationCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  bellWrapper: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  bellHandle: {
    width: 4,
    height: 3,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
    backgroundColor: '#2563eb',
  },

  bellDome: {
    width: 13,
    height: 9,
    borderTopLeftRadius: 6.5,
    borderTopRightRadius: 6.5,
    backgroundColor: '#2563eb',
  },

  bellBase: {
    width: 17,
    height: 2.5,
    borderRadius: 1.25,
    backgroundColor: '#2563eb',
  },

  bellClapper: {
    width: 4.5,
    height: 2.5,
    borderBottomLeftRadius: 2.25,
    borderBottomRightRadius: 2.25,
    backgroundColor: '#2563eb',
    marginTop: 0.5,
  },

  headerSettingsButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerSettingsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // SCROLL CONTENT
  scrollContent: {
    paddingHorizontal: 18,
    paddingTop: 20,
    paddingBottom: 85,
  },

  // CARDS GRID
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  dashboardCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  cardIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
  },

  cardDescription: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 5,
    lineHeight: 16,
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
