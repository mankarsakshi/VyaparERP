import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

type Props = {
  navigation: any;
};

const ExploreScreen = ({navigation}: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Explore Vyapar ERP</Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* Introduction */}
        <View style={styles.intro}>
          <Text style={styles.title}>
            Everything You Need
          </Text>

          <Text style={styles.subtitle}>
            Manage your business easily from one place.
          </Text>
        </View>

        {/* Modules */}
        <View style={styles.modules}>

          <Module
            icon="₹"
            title="POS & Billing"
            description="Create invoices and manage customer payments."
          />

          <Module
            icon="📦"
            title="Inventory"
            description="Manage products and keep track of your stock."
          />

          <Module
            icon="🛒"
            title="Sales & Purchases"
            description="Track sales, purchases and business transactions."
          />

          <Module
            icon="👥"
            title="Customers & Suppliers"
            description="Manage customer and supplier information."
          />

          <Module
            icon="💰"
            title="Expenses"
            description="Record and manage your business expenses."
          />

          <Module
            icon="📊"
            title="Reports"
            description="View sales, inventory and business performance reports."
          />

        </View>

        {/* Get Started */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Signup')}>

          <Text style={styles.buttonText}>
            Get Started
          </Text>

        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

type ModuleProps = {
  icon: string;
  title: string;
  description: string;
};

const Module = ({
  icon,
  title,
  description,
}: ModuleProps) => {
  return (
    <View style={styles.moduleCard}>

      <View style={styles.iconContainer}>
        <Text style={styles.icon}>
          {icon}
        </Text>
      </View>

      <View style={styles.moduleContent}>
        <Text style={styles.moduleTitle}>
          {title}
        </Text>

        <Text style={styles.moduleDescription}>
          {description}
        </Text>
      </View>

    </View>
  );
};

export default ExploreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  backText: {
    fontSize: 25,
    color: '#1E293B',
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },

  placeholder: {
    width: 40,
  },

  intro: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 25,
  },

  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
  },

  modules: {
    gap: 12,
  },

  moduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  icon: {
    fontSize: 20,
  },

  moduleContent: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },

  moduleDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: '#64748B',
  },

  button: {
    height: 52,
    backgroundColor: '#2563EB',
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: 'bold',
  },
});