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
} from 'react-native';
import {authService} from '../api/authService';

type Props = {
  navigation: any;
  route?: any;
};

const LoginScreen = ({navigation, route}: Props) => {
  const [email, setEmail] = useState(route?.params?.email || '');
  const [password, setPassword] = useState('');
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
      Alert.alert('Validation Error', 'Please enter both your email address and password.');
      return;
    }

    try {
      setLoading(true);
      const result = await authService.login({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      const goToHome = () => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Home', params: { user: result.user } }],
        });
      };

      Alert.alert('Success', result.message || 'Login successful', [
        {
          text: 'OK',
          onPress: goToHome,
        },
      ], {
        cancelable: true,
        onDismiss: goToHome,
      });
    } catch (error: any) {
      const errorMsg = error?.message || 'Unable to connect to server';
      Alert.alert('Login Failed', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        <View style={styles.container}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to your business account</Text>

          <Text style={styles.label}>Email Address</Text>
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

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}>
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up */}
          <View style={styles.bottom}>
            <Text style={styles.bottomText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  container: {
    padding: 25,
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 6,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginBottom: 26,
    fontSize: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
    marginTop: 4,
  },

  input: {
    height: 48,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 14,
    marginBottom: 12,
    fontSize: 14,
    color: '#0f172a',
  },

  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: 2,
  },

  forgotPasswordText: {
    color: '#4338ca',
    fontWeight: '600',
    fontSize: 13,
  },

  button: {
    backgroundColor: '#4338ca',
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#4338ca',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },

  bottomText: {
    color: '#64748b',
    fontSize: 14,
  },

  link: {
    color: '#4338ca',
    fontWeight: 'bold',
    fontSize: 14,
  },
});