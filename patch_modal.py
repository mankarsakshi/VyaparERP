import re

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add showModalGst state
old_states = '''  const [mDisc, setMDisc] = useState('0');
  const [mGst, setMGst] = useState('0');'''
new_states = '''  const [mDisc, setMDisc] = useState('0');
  const [mGst, setMGst] = useState('0');
  const [showModalGst, setShowModalGst] = useState(false);'''

content = content.replace(old_states, new_states)

# 2. Replace Modal
modal_regex = r'<Modal visible=\{modalVisible\}(.|\n)*?<\/Modal>'

new_modal = '''<Modal visible={modalVisible} transparent animationType="fade" onRequestClose={() => setModalVisible(false)}>
        <View style={{flex: 1, backgroundColor: 'rgba(15,23,42,0.45)', justifyContent: 'center', padding: 20}}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={{backgroundColor: '#fff', borderRadius: 20, padding: 20}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', paddingBottom: 10}}>
                <Text style={{fontSize: 17, fontWeight: '800', color: '#0f172a'}}>
                  {editingIndex !== null && items[editingIndex]?.product ? 'Edit Product' : 'Add Product'}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={{fontSize: 16, color: '#94a3b8', fontWeight: 'bold'}}>?</Text></TouchableOpacity>
              </View>

              <Text style={styles.inputLabel}>Product *</Text>
              <View style={[styles.dropdownContainer, { zIndex: 50 }]}>
                <TextInput style={[styles.formInput, { paddingRight: 30 }]} value={mProduct} onChangeText={setMProduct} placeholder="Select product" />
                <Text style={[styles.arrow, { position: 'absolute', right: 12, top: 14 }]}>?</Text>
              </View>
              
              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Quantity *</Text>
                  <TextInput style={styles.formInput} value={mReturnQty} onChangeText={setMReturnQty} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Rate (?) *</Text>
                  <TextInput style={styles.formInput} value={mRate} onChangeText={setMRate} keyboardType="decimal-pad" />
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Discount (%)</Text>
                  <TextInput style={styles.formInput} value={mDisc} onChangeText={setMDisc} keyboardType="decimal-pad" />
                </View>
                <View style={[styles.dropdownContainer, {flex: 1, zIndex: 40}]}>
                  <Text style={styles.inputLabel}>GST (%)</Text>
                  <TouchableOpacity style={styles.dropdown} onPress={() => setShowModalGst(!showModalGst)}>
                    <Text style={styles.dropdownText}>{mGst}{mGst.includes('%') ? '' : '%'}</Text>
                    <Text style={styles.arrow}>{showModalGst ? '?' : '?'}</Text>
                  </TouchableOpacity>
                  {showModalGst && (
                    <View style={styles.dropdownMenu}>
                      <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 120}}>
                        {['0', '5', '12', '18', '28'].map((rate, index) => (
                          <TouchableOpacity
                            key={index}
                            style={styles.dropdownMenuItem}
                            onPress={() => {
                              setMGst(rate);
                              setShowModalGst(false);
                            }}>
                            <Text style={styles.dropdownMainText}>{rate}%</Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
              </View>

              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1.5}}>
                  <Text style={styles.inputLabel}>HSN Code</Text>
                  <TextInput style={styles.formInput} value={mHsn} onChangeText={setMHsn} placeholder="Enter HSN" />
                </View>
                
                {(() => {
                  const isInter = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
                  const gVal = Number(mGst.replace('%', '')) || 0;
                  const cPercent = isInter ? 0 : gVal / 2;
                  const sPercent = isInter ? 0 : gVal / 2;
                  const iPercent = isInter ? gVal : 0;
                  
                  return (
                    <View style={{flex: 2, flexDirection: 'row', gap: 6}}>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>CGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{cPercent}%</Text>
                        </View>
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>SGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{sPercent}%</Text>
                        </View>
                      </View>
                      <View style={{flex: 1, alignItems: 'center'}}>
                        <Text style={[styles.inputLabel, {fontSize: 10, marginBottom: 4}]}>IGST</Text>
                        <View style={{backgroundColor: '#f1f5f9', borderRadius: 8, height: 44, width: '100%', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0'}}>
                          <Text style={{fontWeight: '700', color: '#1e293b'}}>{iPercent}%</Text>
                        </View>
                      </View>
                    </View>
                  );
                })()}
              </View>

              {(() => {
                const qty = Number(mReturnQty) || 0;
                const rate = Number(mRate) || 0;
                const disc = Number(mDisc) || 0;
                const gVal = Number(mGst.replace('%', '')) || 0;
                
                const sub = qty * rate;
                const discAmt = (sub * disc) / 100;
                const taxAmt = sub - discAmt;
                const gstAmt = (taxAmt * gVal) / 100;
                const total = taxAmt + gstAmt;
                
                return (
                  <View style={{marginTop: 20, backgroundColor: '#f8fafc', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#f1f5f9'}}>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Subtotal:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>?{sub.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Discount ({disc}%):</Text>
                      <Text style={{fontSize: 13, color: '#22c55e', fontWeight: '700'}}>- ?{discAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>Taxable Amount:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>?{taxAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12}}>
                      <Text style={{fontSize: 13, color: '#64748b', fontWeight: '600'}}>GST Amount:</Text>
                      <Text style={{fontSize: 13, color: '#1e293b', fontWeight: '700'}}>?{gstAmt.toFixed(2)}</Text>
                    </View>
                    <View style={{height: 1, backgroundColor: '#e2e8f0', marginBottom: 12}} />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                      <Text style={{fontSize: 15, color: '#0f172a', fontWeight: '800'}}>Item Total:</Text>
                      <Text style={{fontSize: 15, color: '#ea580c', fontWeight: '800'}}>?{total.toFixed(2)}</Text>
                    </View>
                  </View>
                );
              })()}

              <View style={{flexDirection: 'row', gap: 10, marginTop: 20}}>
                <TouchableOpacity style={{flex: 1, backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10, alignItems: 'center'}} onPress={() => setModalVisible(false)}>
                  <Text style={{fontWeight: '700', color: '#64748b'}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{flex: 1.5, backgroundColor: '#ea7e30', padding: 12, borderRadius: 10, alignItems: 'center'}} onPress={handleSaveModalItem}>
                  <Text style={{fontWeight: '800', color: '#fff'}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>'''

content = re.sub(modal_regex, new_modal, content)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Modal patched.")
