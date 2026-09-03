import React, {useMemo, useState} from 'react';
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
  Platform,
} from 'react-native';

type Props = {
  navigation: any;
  route?: any;
};

export interface UnitItem {
  id: string;
  name: string;
  unit: string;
  description: string;
}

const UnitMasterScreen = ({navigation}: Props) => {
  const [units, setUnits] = useState<UnitItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUnitId, setEditingUnitId] = useState<string | null>(null);

  // Form States
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  const [description, setDescription] = useState('');

  const filteredUnits = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return units;
    }

    return units.filter(item => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.unit.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    });
  }, [units, searchQuery]);

  const resetForm = () => {
    setName('');
    setUnit('');
    setDescription('');
    setEditingUnitId(null);
  };

  const openAddModal = () => {
    resetForm();
    setModalVisible(true);
  };

  const openEditModal = (item: UnitItem) => {
    setEditingUnitId(item.id);
    setName(item.name);
    setUnit(item.unit);
    setDescription(item.description);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  const handleSaveUnit = () => {
    const trimmedName = name.trim();
    const trimmedUnit = unit.trim();

    if (!trimmedName) {
      Alert.alert('Validation Error', 'Unit Name is required.');
      return;
    }

    if (!trimmedUnit) {
      Alert.alert('Validation Error', 'Unit Symbol / Code is required.');
      return;
    }

    // Duplicate check
    const duplicate = units.find(
      u =>
        (u.name.toLowerCase() === trimmedName.toLowerCase() ||
          u.unit.toLowerCase() === trimmedUnit.toLowerCase()) &&
        u.id !== editingUnitId,
    );

    if (duplicate) {
      Alert.alert(
        'Duplicate Unit',
        'A unit with this name or symbol already exists.',
      );
      return;
    }

    if (editingUnitId !== null) {
      setUnits(prev =>
        prev.map(item =>
          item.id === editingUnitId
            ? {
                ...item,
                name: trimmedName,
                unit: trimmedUnit,
                description: description.trim(),
              }
            : item,
        ),
      );

      closeModal();
      Alert.alert('Success', `Unit "${trimmedName}" updated successfully.`);
      return;
    }

    const newUnit: UnitItem = {
      id: Date.now().toString(),
      name: trimmedName,
      unit: trimmedUnit,
      description: description.trim(),
    };

    setUnits(prev => [newUnit, ...prev]);
    closeModal();
    Alert.alert('Success', `Unit "${trimmedName}" added successfully.`);
  };

  const handleDeleteUnit = (item: UnitItem) => {
    Alert.alert(
      'Delete Unit',
      `Are you sure you want to delete unit "${item.name} (${item.unit})"?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setUnits(prev => prev.filter(u => u.id !== item.id));
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Unit Master
          </Text>
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            Manage measurement units & symbols
          </Text>
        </View>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search unit name, symbol or description..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}>
              <Text style={styles.clearText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Unit Directory</Text>
            <Text style={styles.totalText}>
              Total Units: {units.length}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={openAddModal}>
            <Text style={styles.addButtonPlus}>+</Text>
            <Text style={styles.addButtonText}>Add Unit</Text>
          </TouchableOpacity>
        </View>

        {/* TABLE */}
        <View style={styles.tableWrapper}>
          <View style={styles.tableContainer}>
            {/* TABLE HEADER */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.columnNumber]}>
                #
              </Text>
              <Text style={[styles.headerCell, styles.columnName]}>
                Name
              </Text>
              <Text style={[styles.headerCell, styles.columnUnit]}>
                Unit
              </Text>
              <Text style={[styles.headerCell, styles.columnDescription]}>
                Description
              </Text>
              <Text style={[styles.headerCell, styles.columnAction]}>
                Action
              </Text>
            </View>

            {/* TABLE BODY */}
            <ScrollView
              style={styles.tableBody}
              showsVerticalScrollIndicator={true}>
              {filteredUnits.length === 0 ? (
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>
                    {units.length === 0
                      ? 'No units added yet.'
                      : 'No units found matching search.'}
                  </Text>
                </View>
              ) : (
                filteredUnits.map((item, index) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.7}
                    style={[
                      styles.tableRow,
                      index % 2 === 1 && styles.alternateRow,
                    ]}
                    onPress={() => openEditModal(item)}>
                    {/* NUMBER */}
                    <Text style={[styles.bodyCell, styles.columnNumber]}>
                      {index + 1}
                    </Text>

                    {/* NAME */}
                    <View style={[styles.nameCell, styles.columnName]}>
                      <Text style={styles.nameText} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>

                    {/* UNIT */}
                    <View style={[styles.unitCell, styles.columnUnit]}>
                      <View style={styles.unitBadge}>
                        <Text style={styles.unitBadgeText} numberOfLines={1}>
                          {item.unit}
                        </Text>
                      </View>
                    </View>

                    {/* DESCRIPTION */}
                    <Text
                      style={[
                        styles.bodyCell,
                        styles.columnDescription,
                        styles.descriptionText,
                      ]}
                      numberOfLines={1}>
                      {item.description || '-'}
                    </Text>

                    {/* ACTION */}
                    <View style={[styles.actionCell, styles.columnAction]}>
                      {/* EDIT ICON BUTTON */}
                      <TouchableOpacity
                        style={styles.editButton}
                        activeOpacity={0.7}
                        onPress={event => {
                          event.stopPropagation();
                          openEditModal(item);
                        }}>
                        <Text style={styles.editIcon}>✎</Text>
                      </TouchableOpacity>

                      {/* DELETE ICON BUTTON */}
                      <TouchableOpacity
                        style={styles.deleteButton}
                        activeOpacity={0.7}
                        onPress={event => {
                          event.stopPropagation();
                          handleDeleteUnit(item);
                        }}>
                        <View style={styles.bin}>
                          <View style={styles.binTop}>
                            <View style={styles.binHandle} />
                          </View>
                          <View style={styles.binBody}>
                            <View style={styles.binLine} />
                            <View style={styles.binLine} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </View>
      </View>

      {/* ADD / EDIT MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* MODAL HEADER */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>
                  {editingUnitId ? 'Edit Unit' : 'Add Unit'}
                </Text>
                <Text style={styles.modalSubtitle}>
                  {editingUnitId
                    ? 'Update unit information'
                    : 'Enter new measurement unit details'}
                </Text>
              </View>

              <TouchableOpacity
                onPress={closeModal}
                style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* MODAL BODY */}
            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>Unit Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Kilogram"
                placeholderTextColor="#94a3b8"
                value={name}
                onChangeText={setName}
              />

              <Text style={styles.inputLabel}>Unit Symbol / Code *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. kg"
                placeholderTextColor="#94a3b8"
                value={unit}
                onChangeText={setUnit}
                autoCapitalize="none"
              />

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Brief description of this unit..."
                placeholderTextColor="#94a3b8"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              <View style={styles.modalBottomSpace} />
            </ScrollView>

            {/* MODAL FOOTER */}
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeModal}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveUnit}>
                <Text style={styles.saveButtonText}>
                  {editingUnitId ? 'Update Unit' : 'Save Unit'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UnitMasterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },

  // HEADER
  header: {
    backgroundColor: '#4338ca',
    paddingTop: Platform.OS === 'ios' ? 48 : 38,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 3,
  },

  backButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  backArrow: {
    color: '#ffffff',
    fontSize: 38,
    fontWeight: '300',
    lineHeight: 38,
    marginTop: -4,
  },

  headerTextContainer: {
    flex: 1,
  },

  headerTitle: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '700',
  },

  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 12,
    marginTop: 2,
  },

  // CONTENT
  content: {
    flex: 1,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 10,
  },

  // SEARCH
  searchContainer: {
    height: 42,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 14,
  },

  searchInput: {
    flex: 1,
    color: '#0f172a',
    fontSize: 13,
    paddingVertical: 0,
  },

  clearButton: {
    padding: 5,
  },

  clearText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 9,
  },

  sectionTitle: {
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '700',
  },

  totalText: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 3,
  },

  // ADD BUTTON
  addButton: {
    height: 38,
    paddingHorizontal: 14,
    backgroundColor: '#4338ca',
    borderRadius: 7,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addButtonPlus: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '500',
    marginRight: 6,
    lineHeight: 21,
  },

  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },

  // TABLE
  tableWrapper: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
  },

  tableContainer: {
    flex: 1,
    width: '100%',
  },

  tableHeader: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef2ff',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
  },

  headerCell: {
    color: '#334155',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  tableBody: {
    flex: 1,
  },

  tableRow: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },

  alternateRow: {
    backgroundColor: '#f8fafc',
  },

  bodyCell: {
    color: '#475569',
    fontSize: 11,
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  // COLUMNS
  columnNumber: {
    width: 36,
  },

  columnName: {
    flex: 1.1,
    paddingHorizontal: 8,
  },

  columnUnit: {
    width: 68,
    alignItems: 'center',
    justifyContent: 'center',
  },

  columnDescription: {
    flex: 1.4,
    paddingHorizontal: 8,
    textAlign: 'left',
  },

  columnAction: {
    width: 90,
  },

  // CELLS
  nameCell: {
    justifyContent: 'center',
  },

  nameText: {
    color: '#1e293b',
    fontSize: 12,
    fontWeight: '600',
  },

  unitCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  unitBadge: {
    backgroundColor: '#e0e7ff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  unitBadgeText: {
    color: '#4338ca',
    fontSize: 11,
    fontWeight: '700',
  },

  descriptionText: {
    color: '#64748b',
    fontSize: 11,
    textAlign: 'left',
  },

  // ACTION
  actionCell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  editButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  editIcon: {
    fontSize: 15,
    color: '#4338ca',
    fontWeight: '700',
  },

  deleteButton: {
    width: 30,
    height: 30,
    borderRadius: 6,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  bin: {
    width: 18,
    height: 20,
    alignItems: 'center',
  },

  binTop: {
    width: 16,
    height: 3,
    backgroundColor: '#dc2626',
    borderRadius: 1,
    marginBottom: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  binHandle: {
    position: 'absolute',
    top: -2,
    width: 6,
    height: 2,
    borderWidth: 1,
    borderColor: '#dc2626',
    borderBottomWidth: 0,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  binBody: {
    width: 13,
    height: 14,
    borderWidth: 1.5,
    borderColor: '#dc2626',
    borderTopWidth: 0,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },

  binLine: {
    width: 1,
    height: 8,
    backgroundColor: '#dc2626',
  },

  // EMPTY
  emptyContainer: {
    width: '100%',
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    color: '#64748b',
    fontSize: 13,
  },

  // MODAL
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },

  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    maxHeight: '75%',
    overflow: 'hidden',
  },

  modalHeader: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  modalTitle: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
  },

  modalSubtitle: {
    color: '#c7d2fe',
    fontSize: 11,
    marginTop: 2,
  },

  modalCloseButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalCloseText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },

  modalBody: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  inputLabel: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    height: 42,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 11,
    color: '#0f172a',
    fontSize: 13,
  },

  descriptionInput: {
    height: 90,
    paddingTop: 10,
    textAlignVertical: 'top',
  },

  modalBottomSpace: {
    height: 20,
  },

  // MODAL FOOTER
  modalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    marginRight: 8,
    borderRadius: 7,
  },

  cancelText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },

  saveButton: {
    backgroundColor: '#4338ca',
    paddingHorizontal: 17,
    paddingVertical: 9,
    borderRadius: 7,
  },

  saveButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
});
