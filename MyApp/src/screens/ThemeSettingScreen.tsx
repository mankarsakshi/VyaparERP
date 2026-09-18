import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';

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

const RadioOption = ({label, selected, onSelect}: {label: string, selected: boolean, onSelect: () => void}) => (
  <TouchableOpacity style={styles.radioContainer} onPress={onSelect} activeOpacity={0.7}>
    <View style={[styles.outerCircle, selected && styles.outerCircleSelected]}>
      {selected && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

const ThemeSettingScreen = ({navigation}: {navigation: any}) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('orange');
  const [fontSize, setFontSize] = useState('medium');
  const [density, setDensity] = useState('comfortable');

  const resetToDefault = () => {
    setTheme('light');
    setPrimaryColor('orange');
    setFontSize('medium');
    setDensity('comfortable');
  };

  return (
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>Theme Settings</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled">

        {/* 1. Appearance */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <Text style={styles.sectionSubtitle}>Choose how MiraBooks looks</Text>
          
          <View style={styles.themeRow}>
            <TouchableOpacity 
              style={[styles.themeCard, theme === 'light' && styles.themeCardSelected]}
              onPress={() => setTheme('light')}
              activeOpacity={0.7}>
              <Text style={styles.themeIcon}>☀️</Text>
              <Text style={styles.themeCardText}>Light</Text>
              {theme === 'light' && (
                <View style={styles.checkmarkBadge}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.themeCard, theme === 'dark' && styles.themeCardSelected]}
              onPress={() => setTheme('dark')}
              activeOpacity={0.7}>
              <Text style={styles.themeIcon}>🌙</Text>
              <Text style={styles.themeCardText}>Dark</Text>
              {theme === 'dark' && (
                <View style={styles.checkmarkBadge}>
                  <Text style={styles.checkmarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* 2. Primary Color */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Primary Color</Text>
          <Text style={styles.sectionSubtitle}>Choose your app color</Text>
          
          <View style={styles.colorRow}>
            <TouchableOpacity 
              style={[styles.colorOption, primaryColor === 'orange' && styles.colorOptionSelected]}
              onPress={() => setPrimaryColor('orange')}>
              <View style={[styles.colorCircle, {backgroundColor: '#ea7e30'}]} />
              <Text style={styles.colorLabel}>Orange</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.colorOption, primaryColor === 'blue' && styles.colorOptionSelected]}
              onPress={() => setPrimaryColor('blue')}>
              <View style={[styles.colorCircle, {backgroundColor: '#3b82f6'}]} />
              <Text style={styles.colorLabel}>Blue</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.colorOption, primaryColor === 'green' && styles.colorOptionSelected]}
              onPress={() => setPrimaryColor('green')}>
              <View style={[styles.colorCircle, {backgroundColor: '#10b981'}]} />
              <Text style={styles.colorLabel}>Green</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. Font Size */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Font Size</Text>
          
          <View style={styles.radioGroupRow}>
            <RadioOption label="Small" selected={fontSize === 'small'} onSelect={() => setFontSize('small')} />
            <RadioOption label="Medium" selected={fontSize === 'medium'} onSelect={() => setFontSize('medium')} />
            <RadioOption label="Large" selected={fontSize === 'large'} onSelect={() => setFontSize('large')} />
          </View>
        </View>

        {/* 4. Display Density */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Display Density</Text>
          
          <View style={styles.radioGroupRow}>
            <RadioOption label="Compact" selected={density === 'compact'} onSelect={() => setDensity('compact')} />
            <RadioOption label="Comfortable" selected={density === 'comfortable'} onSelect={() => setDensity('comfortable')} />
          </View>
        </View>

        {/* Reset Button */}
        <TouchableOpacity style={styles.resetBtn} onPress={resetToDefault} activeOpacity={0.7}>
          <Text style={styles.resetBtnText}>Reset to Default</Text>
        </TouchableOpacity>
        
        <View style={{height: 40}} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ThemeSettingScreen;

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
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    padding: 18,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#64748b',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  sectionTitle: {
    fontSize: 16.5,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 16,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeCard: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    position: 'relative',
  },
  themeCardSelected: {
    borderColor: '#ea7e30',
    backgroundColor: '#fff7ed',
  },
  themeIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  themeCardText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
  },
  checkmarkBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#ea7e30',
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 4,
  },
  colorOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  colorLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  radioGroupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 12,
  },
  outerCircle: {
    height: 22,
    width: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  outerCircleSelected: {
    borderColor: '#ea7e30',
  },
  innerCircle: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#ea7e30',
  },
  radioLabel: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  resetBtn: {
    backgroundColor: '#f1f5f9',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  resetBtnText: {
    color: '#475569',
    fontWeight: '700',
    fontSize: 15,
  }
});
