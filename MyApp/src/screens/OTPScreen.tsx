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
  route: any;
};

const OTPScreen = ({navigation, route}: Props) => {
  const {email, demoOtp} = route.params || {};

  const [otp, setOtp] = useState(demoOtp || '');
  const [loading, setLoading] = useState(false);

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter OTP');
      return;
    }

    try {
      setLoading(true);
      await authService.verifyOTP(email, otp.trim());
      navigation.navigate('ResetPassword', {
        email: email,
        otp: otp.trim(),
      });
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      setLoading(true);
      const res = await authService.forgotPassword(email);
      if (res.demoOtp) {
        setOtp(res.demoOtp);
      }
      Alert.alert('OTP Sent', res.message || 'A new OTP has been sent to your email');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify OTP</Text>

      <Text style={styles.subtitle}>
        Enter the 6-digit OTP sent to
      </Text>

      <Text style={styles.email}>{email}</Text>

      <TextInput
        style={styles.otpInput}
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.button, loading && {opacity: 0.6}]}
        onPress={handleVerifyOTP}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Verify OTP</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResendOTP}
        disabled={loading}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        disabled={loading}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OTPScreen;

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
    marginBottom: 10,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748b',
  },

  email: {
    textAlign: 'center',
    color: '#1e293b',
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 30,
  },

  otpInput: {
    height: 55,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: 22,
    letterSpacing: 8,
    marginBottom: 20,
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

  resendButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  resendText: {
    color: '#2563eb',
    fontWeight: 'bold',
  },

  backButton: {
    alignItems: 'center',
    marginTop: 20,
  },

  backText: {
    color: '#64748b',
  },
});