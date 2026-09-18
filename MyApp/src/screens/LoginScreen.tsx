
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {authService} from '../api/authService';
import {setAuthToken} from '../api/tokenManager';

type Props = {
  navigation: any;
  route?: any;
};

const LoginScreen = ({navigation, route}: Props) => {
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (route?.params?.email) {
      setEmail(route.params.email);
    }
  }, [route?.params?.email]);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert(
        'Validation Error',
        'Please enter both your email address and password.',
      );
      return;
    }

    try {
      setLoading(true);

      const result = await authService.login({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      if (result.token) {
        setAuthToken(result.token);
      }

      navigation.reset({
        index: 0,
        routes: [{name: 'Home', params: {user: result.user}}],
      });
    } catch (error: any) {
      const errorMsg =
        error?.message || 'Unable to connect to server';

      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">

          {/* TOP LOGO & BRANDING */}
          <View style={styles.brandingHeader}>
            <View style={styles.logoWrapper}>
              <Image
                source={require('../assets/images/mirabooks_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>

            <Text style={styles.subtitle}>
              Sign in to manage your business & invoices
            </Text>
          </View>

          {/* MAIN LOGIN CARD */}
          <View style={styles.card}>

            {/* Email Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email Address</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>✉</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#94a3b8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Password</Text>

              <View style={styles.inputContainer}>
                <Text style={styles.inputIcon}>⌕</Text>

                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!loading}
                />

                {/* Simple Eye Icon */}
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                  activeOpacity={0.7}
                  hitSlop={{
                    top: 10,
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}>
                  <Text style={styles.eyeIcon}>
                    {showPassword ? '◉' : '◌'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Forgot Password */}
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.button,
                loading && styles.disabledButton,
              ]}
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.85}>

              {loading ? (
                <ActivityIndicator
                  color="#ffffff"
                  size="small"
                />
              ) : (
                <Text style={styles.buttonText}>
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.bottomRow}>
              <Text style={styles.bottomText}>
                Don't have an account?
              </Text>

              <TouchableOpacity
                onPress={() => navigation.navigate('Signup')}
                activeOpacity={0.7}>
                <Text style={styles.linkText}>
                  {' '}Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* FOOTER BADGE */}
          <View style={styles.footerBrand}>
            <Text style={styles.footerBrandText}>
              MiraBooks • Smart Business Suite
            </Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fb',
  },

  keyboardView: {
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 24,
  },

  // ---- BRANDING HEADER ----
  brandingHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },

  logoWrapper: {
    height: 70,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  logoImage: {
    width: 220,
    height: 65,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: -0.4,
    marginBottom: 6,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
  },

  // ---- MAIN LOGIN CARD ----
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#64748b',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  fieldGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 7,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
  },

  inputIcon: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 10,
    width: 20,
    textAlign: 'center',
  },

  input: {
    flex: 1,
    fontSize: 14.5,
    color: '#0f172a',
    fontWeight: '500',
    paddingVertical: 0,
  },

  // ---- SIMPLE EYE ICON ----
  eyeBtn: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },

  eyeIcon: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
    paddingVertical: 4,
  },

  forgotPasswordText: {
    color: '#ea7e30',
    fontWeight: '700',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#ea7e30',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  bottomText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },

  linkText: {
    color: '#ea7e30',
    fontWeight: '800',
    fontSize: 14,
  },

  // ---- FOOTER ----
  footerBrand: {
    marginTop: 24,
    alignItems: 'center',
  },

  footerBrandText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

