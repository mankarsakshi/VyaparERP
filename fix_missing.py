with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_modal_row = '''              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Quantity *</Text>
                  <TextInput style={styles.formInput} value={mReturnQty} onChangeText={setMReturnQty} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Rate (\u20B9) *</Text>
                  <TextInput style={styles.formInput} value={mRate} onChangeText={setMRate} keyboardType="decimal-pad" />
                </View>
              </View>'''

new_modal_row = '''              <View style={{flexDirection: 'row', gap: 10, marginTop: 10}}>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Sold Qty</Text>
                  <TextInput style={styles.formInput} value={mSold} onChangeText={setMSold} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Return Qty *</Text>
                  <TextInput style={styles.formInput} value={mReturnQty} onChangeText={setMReturnQty} keyboardType="numeric" />
                </View>
                <View style={{flex: 1}}>
                  <Text style={styles.inputLabel}>Rate (\u20B9) *</Text>
                  <TextInput style={styles.formInput} value={mRate} onChangeText={setMRate} keyboardType="decimal-pad" />
                </View>
              </View>'''

content = content.replace(old_modal_row, new_modal_row)

old_table_header = '''                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.th, {width: 40}]}>#</Text>
                    <Text style={[styles.th, {width: 120}]}>Product</Text>
                    <Text style={[styles.th, {width: 70}]}>HSN</Text>
                    <Text style={[styles.th, {width: 60}]}>Sold</Text>'''

new_table_header = '''                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.th, {width: 40}]}>#</Text>
                    <Text style={[styles.th, {width: 120}]}>Product</Text>
                    <Text style={[styles.th, {width: 70}]}>HSN</Text>
                    <Text style={[styles.th, {width: 100}]}>Reason</Text>
                    <Text style={[styles.th, {width: 60}]}>Sold</Text>'''

content = content.replace(old_table_header, new_table_header)

old_table_row = '''                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 40, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 120, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.hsn}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.sold}</Text>'''

new_table_row = '''                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 40, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 120, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.hsn}</Text>
                      <Text style={[styles.td, {width: 100, color, fontWeight}]}>{item.reason || ''}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.sold}</Text>'''

content = content.replace(old_table_row, new_table_row)


with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated table and modal")
