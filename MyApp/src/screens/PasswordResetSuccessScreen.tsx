import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  navigation: any;
};

const PasswordResetSuccessScreen = ({navigation}: Props) => {
  const handleLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>
        Password Reset Successful
      </Text>

      <Text style={styles.subtitle}>
        Your password has been successfully reset.
        You can now login with your new password.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Go to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PasswordResetSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#f8fafc',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  icon: {
    color: '#ffffff',
    fontSize: 45,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    marginBottom: 15,
  },

  subtitle: {
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 21,
    marginBottom: 30,
  },

  button: {
    width: '100%',
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
});