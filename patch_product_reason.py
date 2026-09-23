with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update ProductItem type
content = content.replace(
    "type ProductItem = { product: string; hsn: string; sold: string; returnQty: string; rate: string; disc: string; gst: string; amt: string };",
    "type ProductItem = { product: string; hsn: string; sold: string; returnQty: string; rate: string; disc: string; gst: string; amt: string; reason?: string };"
)

# 2. Update emptyItem
content = content.replace(
    "const emptyItem = (): ProductItem => ({ product: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00' });",
    "const emptyItem = (): ProductItem => ({ product: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00', reason: '' });"
)

# 3. Add states
old_states = '''  const [mGst, setMGst] = useState('18');
  const [showModalGst, setShowModalGst] = useState(false);'''
new_states = '''  const [mGst, setMGst] = useState('18');
  const [showModalGst, setShowModalGst] = useState(false);
  const [mReason, setMReason] = useState('');
  const [showModalReason, setShowModalReason] = useState(false);'''
content = content.replace(old_states, new_states)

# 4. handleRowPress
old_row_press = '''    setMDisc(itm.disc);
    setMGst(itm.gst);
    setModalVisible(true);'''
new_row_press = '''    setMDisc(itm.disc);
    setMGst(itm.gst);
    setMReason(itm.reason || '');
    setModalVisible(true);'''
content = content.replace(old_row_press, new_row_press)

# 5. handleSaveModalItem
old_save = '''        disc: mDisc,
        gst: mGst,
        amt
      };'''
new_save = '''        disc: mDisc,
        gst: mGst,
        amt,
        reason: mReason
      };'''
content = content.replace(old_save, new_save)

# 6. Add button clear state
old_add_btn = '''                setMDisc('0');
                setMGst('18');
                setModalVisible(true);'''
new_add_btn = '''                setMDisc('0');
                setMGst('18');
                setMReason('');
                setModalVisible(true);'''
content = content.replace(old_add_btn, new_add_btn)

# 7. Add UI inside modal
old_hsn_row = '''                    </View>
                  );
                })()}
              </View>'''
new_hsn_row = '''                    </View>
                  );
                })()}
              </View>

              <View style={[styles.dropdownContainer, {zIndex: 35, marginTop: 10}]}>
                <Text style={styles.inputLabel}>Reason</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowModalReason(!showModalReason)}>
                  <Text style={[styles.dropdownText, !mReason && styles.placeholderText]}>{mReason || 'Select reason'}</Text>
                  <Text style={styles.arrow}>{showModalReason ? '\\u25B2' : '\\u25BC'}</Text>
                </TouchableOpacity>
                {showModalReason && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 120}}>
                      {REASONS.map((r, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownMenuItem}
                          onPress={() => {
                            setMReason(r);
                            setShowModalReason(false);
                          }}>
                          <Text style={styles.dropdownMainText}>{r}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>'''
content = content.replace(old_hsn_row, new_hsn_row)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully.")
