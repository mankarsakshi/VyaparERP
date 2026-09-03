import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

type Props = {
  navigation: any;
};

const LandingScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container}>

      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>V</Text>
        </View>

        <Text style={styles.appName}>Vyapar ERP</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>

        <Text style={styles.title}>
          Manage Your Business
        </Text>

        <Text style={styles.titleBlue}>
          In One Place
        </Text>

        <Text style={styles.description}>
          Vyapar ERP is a simple business management
          solution for billing, inventory, sales and
          business management.
        </Text>

        {/* Explore More */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Explore')}
          style={styles.exploreButton}>

          <Text style={styles.exploreText}>
            Explore More →
          </Text>

        </TouchableOpacity>

      </View>

      {/* Bottom Authentication */}
      <View style={styles.bottomSection}>

        {/* Sign In */}
        <TouchableOpacity
          style={styles.signInButton}
          onPress={() => navigation.navigate('Login')}>

          <Text style={styles.signInText}>
            Sign In
          </Text>

        </TouchableOpacity>

        {/* Sign Up */}
        <View style={styles.signupContainer}>

          <Text style={styles.accountText}>
            Don't have an account?
          </Text>

          <TouchableOpacity
            onPress={() => navigation.navigate('Signup')}>

            <Text style={styles.signupText}>
              Sign Up
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
};

export default LandingScreen;

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 25,
  },

  /* Logo */

  logoContainer: {
    alignItems: 'center',
    marginTop: 55,
  },

  logo: {
    width: 55,
    height: 55,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  appName: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  /* Main Content */

  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 30,
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },

  titleBlue: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#2563EB',
    textAlign: 'center',
    marginTop: 4,
  },

  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 20,
    maxWidth: 340,
  },

  /* Explore */

  exploreButton: {
    marginTop: 28,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  exploreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Bottom */

  bottomSection: {
    paddingBottom: 30,
  },

  signInButton: {
    height: 52,
    borderRadius: 9,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  signInText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },

  accountText: {
    color: '#64748B',
    fontSize: 14,
  },

  signupText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },

});