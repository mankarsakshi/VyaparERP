with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add mOtherReason state
content = content.replace(
    "const [mReason, setMReason] = useState('');",
    "const [mReason, setMReason] = useState('');\n  const [mOtherReason, setMOtherReason] = useState('');"
)

# 2. handleRowPress
old_row_press = '''    setMGst(itm.gst);
    setMReason(itm.reason || '');
    setModalVisible(true);'''
new_row_press = '''    setMGst(itm.gst);
    const isCustom = itm.reason && !REASONS.includes(itm.reason);
    setMReason(isCustom ? 'Other' : (itm.reason || ''));
    setMOtherReason(isCustom ? (itm.reason || '') : '');
    setModalVisible(true);'''
content = content.replace(old_row_press, new_row_press)

# 3. handleSaveModalItem
old_save = '''        disc: mDisc,
        gst: mGst,
        amt,
        reason: mReason
      };'''
new_save = '''        disc: mDisc,
        gst: mGst,
        amt,
        reason: mReason === 'Other' ? mOtherReason : mReason
      };'''
content = content.replace(old_save, new_save)

# 4. Add button logic
old_add_btn = '''                setMGst('18');
                setMReason('');
                setModalVisible(true);'''
new_add_btn = '''                setMGst('18');
                setMReason('');
                setMOtherReason('');
                setModalVisible(true);'''
content = content.replace(old_add_btn, new_add_btn)

# 5. UI logic
old_ui = '''                  </View>
                )}
              </View>

              {(() => {'''
new_ui = '''                  </View>
                )}
              </View>

              {mReason === 'Other' && (
                <TextInput
                  style={[styles.formInput, { marginTop: 10 }]}
                  placeholder="Type your reason here..."
                  value={mOtherReason}
                  onChangeText={setMOtherReason}
                />
              )}

              {(() => {'''
content = content.replace(old_ui, new_ui)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully.")
