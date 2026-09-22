import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {authService} from '../api/authService';
import {setAuthToken, getAuthToken} from '../api/tokenManager';
import RNFS from 'react-native-fs';

const COMPANIES_FILE_PATH = `${RNFS.DocumentDirectoryPath}/companies.json`;

type Props = {
  navigation: any;
  route?: any;
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

const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    let output = '';
    for (
      let block = 0, charCode, i = 0, map = chars;
      base64.charAt(i | 0) || (map = '=', i % 1);
      output += i % 1 ? String.fromCharCode(255 & (block >> (-2 * i & 6))) : 0
    ) {
      charCode = map.indexOf(base64.charAt(i | 0));
      if (~charCode) {
        block = (block << 6) | charCode;
        i += 0.75;
      }
    }
    return JSON.parse(output);
  } catch (e) {
    console.log('JWT Decode error', e);
    return null;
  }
};

const AddCompanyScreen = ({navigation}: Props) => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form state
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    loadCompanies();
     
  }, []);

  const loadCompanies = async () => {
    try {
      let loadedCompanies: any[] = [];
      const exists = await RNFS.exists(COMPANIES_FILE_PATH);
      if (exists) {
        const data = await RNFS.readFile(COMPANIES_FILE_PATH, 'utf8');
        loadedCompanies = JSON.parse(data);
      }

      const currentToken = getAuthToken();
      if (currentToken) {
        // Find if current token is in our list
        let found = loadedCompanies.find(c => c.token === currentToken);
        
        // If not found, decode JWT to reconstruct the user object
        if (!found) {
          const decodedPayload = decodeJWT(currentToken);
          const activeUser = decodedPayload || {
            email: 'active@user',
            businessName: 'Active Business',
          };
          const currentCompany = { user: activeUser, token: currentToken };
          loadedCompanies.push(currentCompany);
          await RNFS.writeFile(COMPANIES_FILE_PATH, JSON.stringify(loadedCompanies), 'utf8');
        }
      }
      setCompanies(loadedCompanies);
    } catch (err) {
      console.log('Error loading companies', err);
    }
  };

  const saveCompany = async (user: any, token: string) => {
    try {
      const newCompany = { user, token };
      const updatedCompanies = [...companies];
      const index = updatedCompanies.findIndex(c => c.user?.email === user.email);
      if (index >= 0) {
        updatedCompanies[index] = newCompany;
      } else {
        updatedCompanies.push(newCompany);
      }
      setCompanies(updatedCompanies);
      await RNFS.writeFile(COMPANIES_FILE_PATH, JSON.stringify(updatedCompanies), 'utf8');
    } catch (err) {
      console.log('Error saving company', err);
    }
  };

  const handleSwitchCompany = (company: any) => {
    if (company.token === getAuthToken()) {
      Alert.alert('Already Active', 'This company is currently active.');
      return;
    }

    Alert.alert(
      'Switch Company',
      `Are you sure you want to switch to ${company.user?.business_name || company.user?.businessName || company.user?.email}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Switch',
          onPress: async () => {
            await setAuthToken(company.token);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { user: company.user } }],
            });
          }
        }
      ]
    );
  };

  const handleSignup = async () => {
    if (!businessName.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Email must contain "@"');
      return;
    }

    try {
      setLoading(true);
      const signupResult = await authService.signup({
        businessName: businessName.trim(),
        email: email.trim().toLowerCase(),
        password: password.trim(),
      });

      if (signupResult.success || signupResult.userId) {
        // Auto-login to get the token and user object
        const loginResult = await authService.login({
          email: email.trim().toLowerCase(),
          password: password.trim(),
        });

        if (loginResult.token) {
          await saveCompany(loginResult.user, loginResult.token);
          
          Alert.alert('Success', 'Company added successfully', [
            {
              text: 'OK',
              onPress: () => {
                // Go back to the list to show the newly added company
                setIsAddingNew(false);
                // Clear the form
                setBusinessName('');
                setEmail('');
                setPassword('');
              }
            }
          ]);
        } else {
          Alert.alert('Warning', 'Company created, but could not auto-login.');
          setIsAddingNew(false);
        }
      } else {
        Alert.alert('Error', signupResult.message || 'Failed to create company');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fb" />
      
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
          <Text style={styles.headerTitle}>Companies</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          {!isAddingNew ? (
            <View style={styles.container}>
              <Text style={styles.sectionTitle}>Saved Companies</Text>
              
              {companies.map((company, index) => {
                const isActive = company.token === getAuthToken();
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.companyCard, isActive && styles.activeCompanyCard]}
                    onPress={() => handleSwitchCompany(company)}>
                    <View style={styles.companyInfo}>
                      <Text style={styles.companyName}>
                        {company.user?.business_name || company.user?.businessName || 'Unnamed Business'}
                      </Text>
                      <Text style={styles.companyEmail}>{company.user?.email}</Text>
                    </View>
                    {isActive && (
                      <View style={styles.activeBadge}>
                        <Text style={styles.activeBadgeText}>Active</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsAddingNew(true)}>
                <Text style={styles.addButtonText}>+ Add New Company</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.container}>
              <Text style={styles.title}>Create New Company</Text>
              <Text style={styles.subtitle}>Register another business to switch easily</Text>

              <Text style={styles.label}>Business Name*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter business name"
                placeholderTextColor="#d1d5db"
                value={businessName}
                onChangeText={setBusinessName}
                autoCapitalize="words"
              />

              <Text style={styles.label}>Email Address*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email address"
                placeholderTextColor="#d1d5db"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              <Text style={styles.label}>Password*</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                placeholderTextColor="#d1d5db"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <TouchableOpacity
                style={[styles.button, loading && styles.disabledButton]}
                onPress={handleSignup}
                disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Create Company</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsAddingNew(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddCompanyScreen;

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  safeArea: {
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
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 20,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  activeCompanyCard: {
    borderColor: '#ea7e30',
    backgroundColor: '#fff7ed',
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  companyEmail: {
    fontSize: 13,
    color: '#64748b',
  },
  activeBadge: {
    backgroundColor: '#ea7e30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ea7e30',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea7e30',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 25,
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },
  button: {
    height: 52,
    backgroundColor: '#ea6c08',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  disabledButton: {
    backgroundColor: '#fca5a5',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  cancelButton: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
});
