import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {authService} from '../api/authService';

type Props = {
  navigation: any;
};

const ForgotPasswordScreen = ({navigation}: Props) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);
      const res = await authService.forgotPassword(email.trim().toLowerCase());
      
      Alert.alert(
        'OTP Sent Successfully', 
        res.message || `An OTP has been generated for ${email}. Check server logs or use the code provided.`, 
        [
          {
            text: 'Proceed to Verify',
            onPress: () => {
              navigation.navigate('OTP', {
                email: email.trim().toLowerCase(),
                demoOtp: res.demoOtp,
              });
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Account Not Found', error.message || 'Unable to process forgot password request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password?</Text>

      <Text style={styles.subtitle}>
        Enter your registered email address and we will
        send you an OTP to reset your password.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && {opacity: 0.6}]}
        onPress={handleSendOTP}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Send OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ForgotPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
    backgroundColor: '#f8fafc',
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 12,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 30,
  },

  input: {
    height: 52,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },

  button: {
    height: 52,
    backgroundColor: '#2563eb',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: 'bold',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 25,
  },

  backText: {
    color: '#2563eb',
    fontSize: 15,
    fontWeight: 'bold',
  },
});