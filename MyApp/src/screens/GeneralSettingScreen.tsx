import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Animated,
  LayoutAnimation,
  UIManager,
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = {
  navigation: any;
  route: any;
};

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

const AccordionSection = ({title, children}: {title: string; children: React.ReactNode}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.formCard}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={toggleExpand}
        activeOpacity={0.7}>
        <Text style={styles.cardHeaderTitle}>{title}</Text>
        <Text style={[styles.accordionChevron, {transform: [{rotate: expanded ? '180deg' : '0deg'}]}]}>
          ⌄
        </Text>
      </TouchableOpacity>
      {expanded && <View style={styles.accordionBody}>{children}</View>}
    </View>
  );
};

const GeneralSettingScreen = ({navigation, route}: Props) => {
  // 1. Business Profile
  const [businessName, setBusinessName] = useState('My Business');
  const [address, setAddress] = useState('123 Market Street');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('contact@mybusiness.com');
  const [gstin, setGstin] = useState('27AADCB2230M1Z2');

  // 2. Notification Settings
  const [lowStock, setLowStock] = useState(true);
  const [paymentDue, setPaymentDue] = useState(true);
  const [invoiceAlerts, setInvoiceAlerts] = useState(false);

  // 4. Security
  const [appLock, setAppLock] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState('30 Mins');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{flex: 1}}>
        
        {/* HEADER BAR */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
            <BackArrowIcon />
          </TouchableOpacity>

          <View style={styles.headerTitleArea}>
            <Text style={styles.headerTitle}>General Settings</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">

          {/* 1. Business Profile */}
          <AccordionSection title="1. Business Profile">
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Business Name</Text>
              <TextInput style={styles.input} value={businessName} onChangeText={setBusinessName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Logo</Text>
              <TouchableOpacity style={styles.uploadBtn}>
                <Text style={styles.uploadBtnText}>Upload Logo</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Address</Text>
              <TextInput style={[styles.input, styles.textArea]} value={address} onChangeText={setAddress} multiline />
            </View>
            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, {flex: 1, marginRight: 8}]}>
                <Text style={styles.label}>Phone</Text>
                <TextInput style={styles.input} value={phone} onChangeText={setPhone} />
              </View>
              <View style={[styles.inputGroup, {flex: 1, marginLeft: 8}]}>
                <Text style={styles.label}>Email</Text>
                <TextInput style={styles.input} value={email} onChangeText={setEmail} />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>GSTIN</Text>
              <TextInput style={styles.input} value={gstin} onChangeText={setGstin} />
            </View>
          </AccordionSection>

          {/* 2. Notification Settings */}
          <AccordionSection title="2. Notification Settings">
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Low Stock Alerts</Text>
              <Switch value={lowStock} onValueChange={setLowStock} trackColor={{true: '#ea7e30'}} />
            </View>
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Payment Due Alerts</Text>
              <Switch value={paymentDue} onValueChange={setPaymentDue} trackColor={{true: '#ea7e30'}} />
            </View>
            <View style={styles.switchGroup}>
              <Text style={styles.label}>Invoice Creation Alerts</Text>
              <Switch value={invoiceAlerts} onValueChange={setInvoiceAlerts} trackColor={{true: '#ea7e30'}} />
            </View>
          </AccordionSection>

          {/* 3. Backup & Data */}
          <AccordionSection title="3. Backup & Data">
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Backup Data Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#f1f5f9'}]}>
              <Text style={[styles.actionBtnText, {color: '#334155'}]}>Restore Data</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, {backgroundColor: '#f1f5f9'}]}>
              <Text style={[styles.actionBtnText, {color: '#334155'}]}>Export Data</Text>
            </TouchableOpacity>
          </AccordionSection>

          {/* 4. Security */}
          <AccordionSection title="4. Security">
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Change Password</Text>
            </TouchableOpacity>
            <View style={styles.switchGroup}>
              <Text style={styles.label}>App Lock</Text>
              <Switch value={appLock} onValueChange={setAppLock} trackColor={{true: '#ea7e30'}} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Session Timeout</Text>
              <TextInput style={styles.input} value={sessionTimeout} onChangeText={setSessionTimeout} />
            </View>
          </AccordionSection>
          
          <View style={{height: 40}} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GeneralSettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    marginBottom: 16,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#ffffff',
  },
  accordionBody: {
    paddingHorizontal: 18,
    paddingBottom: 18,
    paddingTop: 0,
  },
  cardHeaderTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  accordionChevron: {
    fontSize: 20,
    color: '#64748b',
    fontWeight: '300',
  },
  inputGroup: {
    marginBottom: 14,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
    fontWeight: '500',
  },
  textArea: {
    height: 72,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  uploadBtn: {
    height: 48,
    backgroundColor: '#fff7ed',
    borderWidth: 1.5,
    borderColor: '#ea7e30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  uploadBtnText: {
    color: '#ea7e30',
    fontWeight: '700',
    fontSize: 14,
  },
  actionBtn: {
    backgroundColor: '#ea7e30',
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  actionBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  }
});
