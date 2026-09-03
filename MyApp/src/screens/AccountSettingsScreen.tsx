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

// =====================================================
// SECURITY VECTOR ICONS
// =====================================================

const ChangePasswordIcon = () => (
  <View style={[styles.securityIconBox, {backgroundColor: '#eff6ff'}]}>
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      {/* Lock Shackle */}
      <View
        style={{
          width: 10,
          height: 7,
          borderTopLeftRadius: 5,
          borderTopRightRadius: 5,
          borderWidth: 1.8,
          borderColor: '#2563eb',
          borderBottomWidth: 0,
          marginBottom: -1,
        }}
      />
      {/* Lock Body */}
      <View
        style={{
          width: 15,
          height: 11,
          borderRadius: 2.5,
          backgroundColor: '#2563eb',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 3,
            height: 4,
            borderRadius: 1.5,
            backgroundColor: '#ffffff',
          }}
        />
      </View>
    </View>
  </View>
);

const ForgotPasswordIcon = () => (
  <View style={[styles.securityIconBox, {backgroundColor: '#fff7ed'}]}>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
      {/* Key Ring */}
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 5,
          borderWidth: 2,
          borderColor: '#d97706',
          marginRight: -2,
          zIndex: 2,
        }}
      />
      {/* Key Shaft & Teeth */}
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <View
          style={{
            width: 10,
            height: 2,
            backgroundColor: '#d97706',
            marginTop: 4,
          }}
        />
        <View style={{position: 'absolute', right: 4, top: 4, width: 2, height: 4, backgroundColor: '#d97706', borderRadius: 0.5}} />
        <View style={{position: 'absolute', right: 1, top: 4, width: 2, height: 3, backgroundColor: '#d97706', borderRadius: 0.5}} />
      </View>
    </View>
  </View>
);

const AccountSettingsScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  // Account Information State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || 'example@gmail.com');
  const [mobileNumber, setMobileNumber] = useState(user?.phone || '+91 98765 43210');

  // Preferences State
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // UI Banner state
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Change Password state/modal trigger
  const handleSaveAccountInfo = () => {
    if (!name.trim()) {
      Alert.alert('Required Field', 'Please enter your name.');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Required Field', 'Please enter your email address.');
      return;
    }

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 3000);

    Alert.alert('Success', 'Account details updated successfully!');
  };

  const handleChangePassword = () => {
    Alert.alert(
      'Change Password',
      'Would you like to reset your password via OTP or set a new password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Forgot / Reset via OTP',
          onPress: () => navigation.navigate('ForgotPassword'),
        },
        {
          text: 'Reset Directly',
          onPress: () => navigation.navigate('ResetPassword', {email}),
        },
      ],
    );
  };

  const handleForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout from your account?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Reset navigation back to Login screen
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            });
          },
        },
      ],
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'WARNING: This action is permanent and cannot be undone. All your business records and account data will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Account',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deleted',
              'Your account has been deleted successfully.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    navigation.reset({
                      index: 0,
                      routes: [{name: 'Login'}],
                    });
                  },
                },
              ],
            );
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
        
        {/* ===================================================== */}
        {/* TOP HEADER BAR */}
        {/* ===================================================== */}
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
            <Text style={styles.headerTitle}>Account Settings</Text>
            <Text style={styles.headerSubtitle}>Manage your account</Text>
          </View>
        </View>

        {/* SETTINGS TOP NAV TABS */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => navigation.navigate('BusinessSettings', {user})}>
            <Text style={styles.tabText}>🏢 Business Details</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tabButton, styles.activeTab]}>
            <Text style={[styles.tabText, styles.activeTabText]}>
              👤 Account Settings
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>

          {/* SUCCESS BANNER */}
          {savedSuccess && (
            <View style={styles.successBanner}>
              <Text style={styles.successBannerText}>
                ✓ Account settings updated successfully!
              </Text>
            </View>
          )}

          {/* ===================================================== */}
          {/* SECTION 1: ACCOUNT INFORMATION */}
          {/* ===================================================== */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Account Information</Text>

            {/* NAME */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor="#94a3b8"
              />
            </View>

            {/* EMAIL */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor="#94a3b8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* MOBILE NUMBER */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                value={mobileNumber}
                onChangeText={setMobileNumber}
                placeholder="Enter mobile number"
                placeholderTextColor="#94a3b8"
                keyboardType="phone-pad"
              />
            </View>

            {/* SAVE BUTTON */}
            <TouchableOpacity
              style={styles.saveInfoButton}
              onPress={handleSaveAccountInfo}
              activeOpacity={0.8}>
              <Text style={styles.saveInfoButtonText}>Save Changes</Text>
            </TouchableOpacity>
          </View>

          {/* ===================================================== */}
          {/* SECTION 2: SECURITY */}
          {/* ===================================================== */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Security</Text>

            {/* CHANGE PASSWORD */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleChangePassword}
              activeOpacity={0.7}>
              <View style={styles.actionRowLeft}>
                <ChangePasswordIcon />
                <Text style={styles.actionRowText}>Change Password</Text>
              </View>
              <View style={styles.chevronBox}>
                <View style={styles.chevronRight} />
              </View>
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* FORGOT PASSWORD */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleForgotPassword}
              activeOpacity={0.7}>
              <View style={styles.actionRowLeft}>
                <ForgotPasswordIcon />
                <Text style={styles.actionRowText}>Forgot Password</Text>
              </View>
              <View style={styles.chevronBox}>
                <View style={styles.chevronRight} />
              </View>
            </TouchableOpacity>
          </View>

          {/* ===================================================== */}
          {/* SECTION 3: PREFERENCES */}
          {/* ===================================================== */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Preferences</Text>

            {/* NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={() => setNotifications(!notifications)}
              activeOpacity={0.8}>
              <View style={styles.preferenceLeft}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    notifications && styles.checkboxChecked,
                  ]}
                  onPress={() => setNotifications(!notifications)}>
                  {notifications && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.preferenceLabel}>Notifications</Text>
              </View>

              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
                thumbColor={notifications ? '#2563eb' : '#f1f5f9'}
              />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* EMAIL NOTIFICATIONS */}
            <TouchableOpacity
              style={styles.preferenceRow}
              onPress={() => setEmailNotifications(!emailNotifications)}
              activeOpacity={0.8}>
              <View style={styles.preferenceLeft}>
                <TouchableOpacity
                  style={[
                    styles.checkbox,
                    emailNotifications && styles.checkboxChecked,
                  ]}
                  onPress={() => setEmailNotifications(!emailNotifications)}>
                  {emailNotifications && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
                <Text style={styles.preferenceLabel}>Email Notifications</Text>
              </View>

              <Switch
                value={emailNotifications}
                onValueChange={setEmailNotifications}
                trackColor={{false: '#cbd5e1', true: '#93c5fd'}}
                thumbColor={emailNotifications ? '#2563eb' : '#f1f5f9'}
              />
            </TouchableOpacity>
          </View>

          {/* ===================================================== */}
          {/* SECTION 4: SESSION */}
          {/* ===================================================== */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionHeaderTitle}>Session</Text>

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.8}>
              <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>

            {/* DELETE ACCOUNT BUTTON */}
            <TouchableOpacity
              style={styles.deleteAccountButton}
              onPress={handleDeleteAccount}
              activeOpacity={0.8}>
              <Text style={styles.deleteAccountText}>Delete Account</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AccountSettingsScreen;

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

  // TABS
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingHorizontal: 12,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 13,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },

  activeTab: {
    borderBottomColor: '#2563eb',
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },

  activeTabText: {
    color: '#2563eb',
    fontWeight: '700',
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

  // SECTION CARD
  sectionCard: {
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

  sectionHeaderTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 16,
  },

  // INPUT GROUPS
  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
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

  saveInfoButton: {
    backgroundColor: '#2563eb',
    borderRadius: 9,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },

  saveInfoButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // ACTION ROWS (SECURITY)
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },

  actionRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  securityIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  securityIconText: {
    fontSize: 14,
  },

  actionRowText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },

  chevronBox: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chevronRight: {
    width: 8,
    height: 8,
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderColor: '#64748b',
    transform: [{rotate: '45deg'}],
  },

  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginVertical: 4,
  },

  // PREFERENCES (CHECKBOX / SWITCH)
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },

  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  checkboxChecked: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },

  checkmark: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
    marginTop: -2,
  },

  preferenceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },

  // SESSION BUTTONS
  logoutButton: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    marginBottom: 12,
  },

  logoutButtonText: {
    color: '#334155',
    fontSize: 15,
    fontWeight: '700',
  },

  deleteAccountButton: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },

  deleteAccountText: {
    color: '#dc2626',
    fontSize: 15,
    fontWeight: '700',
  },
});
