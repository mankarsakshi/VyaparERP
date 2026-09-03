import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

interface Brand {
  id: string;
  name: string;
  description: string;
}

interface Unit {
  id: string;
  name: string;
  shortName: string;
}

const DEFAULT_BRANDS: Brand[] = [
  {id: '1', name: 'Dell', description: 'Computer hardware & laptop manufacturer'},
  {id: '2', name: 'HP', description: 'Printers, PCs and peripheral devices'},
  {id: '3', name: 'Lenovo', description: 'Laptops, tablets and smart devices'},
  {id: '4', name: 'Samsung', description: 'Consumer electronics, displays and smartphones'},
  {id: '5', name: 'Logitech', description: 'Computer peripherals and gaming accessories'},
  {id: '6', name: 'Apple', description: 'Premium personal electronics & hardware'},
];

const DEFAULT_UNITS: Unit[] = [
  {id: '1', name: 'Piece', shortName: 'pcs'},
  {id: '2', name: 'Kilogram', shortName: 'kg'},
  {id: '3', name: 'Gram', shortName: 'g'},
  {id: '4', name: 'Litre', shortName: 'ltr'},
  {id: '5', name: 'Meter', shortName: 'm'},
  {id: '6', name: 'Box', shortName: 'box'},
  {id: '7', name: 'Dozen', shortName: 'doz'},
  {id: '8', name: 'Packet', shortName: 'pkt'},
];

const UnitBrandMasterScreen = ({navigation}: Props) => {
  const [activeTab, setActiveTab] = useState<'brands' | 'units'>('brands');
  const [brands, setBrands] = useState<Brand[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [brandModalVisible, setBrandModalVisible] = useState(false);
  const [unitModalVisible, setUnitModalVisible] = useState(false);

  // Form states
  const [brandName, setBrandName] = useState('');
  const [brandDesc, setBrandDesc] = useState('');

  const [unitName, setUnitName] = useState('');
  const [unitShortName, setUnitShortName] = useState('');

  const handleAddBrand = () => {
    if (!brandName.trim()) {
      Alert.alert('Validation Error', 'Brand Name is required');
      return;
    }
    const newB: Brand = {
      id: Date.now().toString(),
      name: brandName.trim(),
      description: brandDesc.trim() || 'No description',
    };
    setBrands([newB, ...brands]);
    setBrandName('');
    setBrandDesc('');
    setBrandModalVisible(false);
    Alert.alert('Success', `Brand "${newB.name}" added to Brand Master!`);
  };

  const handleAddUnit = () => {
    if (!unitName.trim() || !unitShortName.trim()) {
      Alert.alert('Validation Error', 'Unit Name and Short Name are required');
      return;
    }
    const newU: Unit = {
      id: Date.now().toString(),
      name: unitName.trim(),
      shortName: unitShortName.trim(),
    };
    setUnits([newU, ...units]);
    setUnitName('');
    setUnitShortName('');
    setUnitModalVisible(false);
    Alert.alert('Success', `Unit "${newU.name} (${newU.shortName})" added to Unit Master!`);
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUnits = units.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.shortName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>Brands & Units Master</Text>
          <Text style={styles.headerSubtitle}>Supporting product master data</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            if (activeTab === 'brands') setBrandModalVisible(true);
            else setUnitModalVisible(true);
          }}>
          <Text style={styles.addBtnText}>
            + Add {activeTab === 'brands' ? 'Brand' : 'Unit'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* TABS */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'brands' && styles.activeTabItem]}
          onPress={() => setActiveTab('brands')}>
          <Text style={[styles.tabText, activeTab === 'brands' && styles.activeTabText]}>
             Brands ({brands.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'units' && styles.activeTabItem]}
          onPress={() => setActiveTab('units')}>
          <Text style={[styles.tabText, activeTab === 'units' && styles.activeTabText]}>
             Units ({units.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder={
              activeTab === 'brands' ? 'Search brand name...' : 'Search unit name or symbol...'
            }
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* BRANDS TAB VIEW */}
        {activeTab === 'brands' && (
          <View>
            {filteredBrands.map(b => (
              <View key={b.id} style={styles.card}>
                <View style={styles.brandIconCircle}>
                  <Text style={styles.brandIconText}>🏷️</Text>
                </View>
                <View style={styles.cardBody}>
                  <Text style={styles.titleText}>{b.name}</Text>
                  <Text style={styles.descText}>{b.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* UNITS TAB VIEW */}
        {activeTab === 'units' && (
          <View>
            <View style={styles.unitGrid}>
              {filteredUnits.map(u => (
                <View key={u.id} style={styles.unitCard}>
                  <View style={styles.unitSymbolBadge}>
                    <Text style={styles.unitSymbolText}>{u.shortName}</Text>
                  </View>
                  <Text style={styles.unitTitleText}>{u.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ADD BRAND MODAL */}
      <Modal visible={brandModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Brand Master</Text>
              <TouchableOpacity onPress={() => setBrandModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Brand Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter brand name"
                placeholderTextColor="#94a3b8"
                value={brandName}
                onChangeText={setBrandName}
              />
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter brand description"
                placeholderTextColor="#94a3b8"
                value={brandDesc}
                onChangeText={setBrandDesc}
                multiline={true}
                numberOfLines={3}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setBrandModalVisible(false)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleAddBrand}>
                <Text style={styles.saveModalBtnText}>Save Brand</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ADD UNIT MODAL */}
      <Modal visible={unitModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Unit Master</Text>
              <TouchableOpacity onPress={() => setUnitModalVisible(false)}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Unit Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter unit name"
                placeholderTextColor="#94a3b8"
                value={unitName}
                onChangeText={setUnitName}
              />
              <Text style={styles.inputLabel}>Short Name / Symbol *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter short name / symbol"
                placeholderTextColor="#94a3b8"
                value={unitShortName}
                onChangeText={setUnitShortName}
              />
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelModalBtn}
                onPress={() => setUnitModalVisible(false)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveModalBtn} onPress={handleAddUnit}>
                <Text style={styles.saveModalBtnText}>Save Unit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UnitBrandMasterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#4338ca',
    paddingTop: 42,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    paddingRight: 12,
  },
  backText: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  headerTitleBox: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#c7d2fe',
  },
  addBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 12,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTabItem: {
    borderBottomColor: '#4338ca',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  activeTabText: {
    color: '#4338ca',
    fontWeight: '700',
  },
  content: {
    padding: 16,
  },
  searchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  brandIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandIconText: {
    fontSize: 18,
  },
  cardBody: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
  },
  descText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  unitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  unitCard: {
    width: '48.5%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  unitSymbolBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 10,
  },
  unitSymbolText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4338ca',
  },
  unitTitleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    overflow: 'hidden',
  },
  modalHeader: {
    backgroundColor: '#4338ca',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  modalCloseText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0f172a',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  cancelModalBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  cancelModalBtnText: {
    color: '#64748b',
    fontWeight: '600',
  },
  saveModalBtn: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveModalBtnText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
