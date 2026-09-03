
import React, {useState} from 'react';
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
} from 'react-native';
import {authService} from '../api/authService';
import {Picker} from '@react-native-picker/picker';

type Props = {
  navigation: any;
};

const SignupScreen = ({navigation}: Props) => {
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [subscriptionPlan, setSubscriptionPlan] = useState('free');
  const [loading, setLoading] = useState(false);

  // ======================================================
  // SIGNUP
  // ======================================================

  const handleSignup = async () => {
    // Validate required fields
    if (!businessName.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Password validation
    if (password.length < 6) {
      Alert.alert(
        'Error',
        'Password must contain at least 6 characters',
      );
      return;
    }

    // Signup payload
    const normalizedEmail = email.trim().toLowerCase();
    const signupPayload = {
      businessName: businessName.trim(),
      email: normalizedEmail,
      password,
      subscriptionPlan,
    };

    try {
      setLoading(true);

      const result = await authService.signup(signupPayload);

      Alert.alert(
        'Account Created',
        result.message || 'Business account created successfully! Please log in.',
        [
          {
            text: 'Login Now',
            onPress: () => navigation.navigate('Login', { email: normalizedEmail }),
          },
        ],
      );
    } catch (error: any) {
      const errorMsg = error?.message || 'Unable to register account';
      if (errorMsg.toLowerCase().includes('already registered')) {
        Alert.alert(
          'Account Exists',
          'This email is already registered. Would you like to log in?',
          [
            {
              text: 'Stay Here',
              style: 'cancel',
            },
            {
              text: 'Go to Login',
              onPress: () => navigation.navigate('Login', { email: normalizedEmail }),
            },
          ]
        );
      } else {
        Alert.alert(
          'Signup Failed',
          errorMsg,
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">

        <View style={styles.container}>

          {/* Title */}

          <Text style={styles.title}>
            Create Business Account
          </Text>

          <Text style={styles.subtitle}>
            Register your business to get started
          </Text>


          {/* Business Name */}

          <Text style={styles.label}>
            Business Name*
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter business name"
            placeholderTextColor="#94a3b8"
            value={businessName}
            onChangeText={setBusinessName}
            autoCapitalize="words"
          />


          {/* Email */}

          <Text style={styles.label}>
            Email Address*
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter email address"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />


          {/* Password */}

          <Text style={styles.label}>
            Password*
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter password"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />


          {/* Subscription Plan */}

          <Text style={styles.label}>
            Subscription Plan
          </Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={subscriptionPlan}
              onValueChange={itemValue =>
                setSubscriptionPlan(itemValue)
              }
              style={styles.picker}>

              <Picker.Item
                label="Free"
                value="free"
              />

              <Picker.Item
                label="Basic"
                value="basic"
              />

              <Picker.Item
                label="Premium"
                value="premium"
              />

            </Picker>
          </View>


          {/* Signup Button */}

          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleSignup}
            disabled={loading}>

            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.buttonText}>
                Create Account
              </Text>
            )}

          </TouchableOpacity>


          {/* Login */}

          <View style={styles.bottom}>

            <Text style={styles.bottomText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() => navigation.navigate('Login')}>

              <Text style={styles.link}>
                Login
              </Text>

            </TouchableOpacity>

          </View>

        </View>

      </ScrollView>

    </KeyboardAvoidingView>
  );
};

export default SignupScreen;


// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({

  keyboardView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flex: 1,
    padding: 25,
    paddingTop: 45,
    backgroundColor: '#f8fafc',
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
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
  },

  pickerContainer: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  picker: {
    height: 52,
    width: '100%',
    color: '#1e293b',
  },

  button: {
    height: 52,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },

  bottomText: {
    color: '#475569',
  },

  link: {
    color: '#2563eb',
    fontWeight: 'bold',
    marginLeft: 5,
  },

});



