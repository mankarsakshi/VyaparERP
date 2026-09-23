import re

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

table_regex = r'<ScrollView horizontal showsHorizontalScrollIndicator=\{false\} style=\{\{borderWidth: 1, borderColor: \'#e2e8f0\', borderRadius: 8\}\}>(.|\n)*?<\/ScrollView>'

new_table = '''<ScrollView horizontal showsHorizontalScrollIndicator={false} style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 8}}>
              <View>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.th, {width: 40}]}>#</Text>
                  <Text style={[styles.th, {width: 120}]}>Product</Text>
                  <Text style={[styles.th, {width: 70}]}>HSN</Text>
                  <Text style={[styles.th, {width: 100}]}>Reason</Text>
                  <Text style={[styles.th, {width: 60}]}>Sold</Text>
                  <Text style={[styles.th, {width: 60}]}>Return</Text>
                  <Text style={[styles.th, {width: 70}]}>Rate</Text>
                  <Text style={[styles.th, {width: 60}]}>Disc</Text>
                  <Text style={[styles.th, {width: 60}]}>GST</Text>
                  <Text style={[styles.th, {width: 70}]}>Taxable</Text>
                  <Text style={[styles.th, {width: 60}]}>CGST</Text>
                  <Text style={[styles.th, {width: 60}]}>SGST</Text>
                  <Text style={[styles.th, {width: 60}]}>IGST</Text>
                  <Text style={[styles.th, {width: 80}]}>Amt</Text>
                  <View style={{width: 40, alignItems: 'center'}}><TrashIcon /></View>
                </View>

                {items.map((item, index) => {
                  const isFilled = !!item.product;
                  const color = isFilled ? '#0f172a' : '#94a3b8';
                  const fontWeight = isFilled ? '700' : '400';
                  
                  const qty = Number(item.returnQty) || 0;
                  const rate = Number(item.rate) || 0;
                  const disc = Number(item.disc) || 0;
                  const gVal = Number((item.gst || '').replace('%', '')) || 0;
                  
                  const sub = qty * rate;
                  const discAmt = (sub * disc) / 100;
                  const taxAmt = sub - discAmt;
                  const gstAmt = (taxAmt * gVal) / 100;
                  const total = taxAmt + gstAmt;
                  
                  const isInter = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
                  const cAmt = isInter ? 0 : gstAmt / 2;
                  const sAmt = isInter ? 0 : gstAmt / 2;
                  const iAmt = isInter ? gstAmt : 0;
                  
                  return (
                    <TouchableOpacity key={index} style={styles.tableDataRow} onPress={() => handleRowPress(index)}>
                      <Text style={[styles.td, {width: 40, color, fontWeight}]}>{index + 1}</Text>
                      <Text style={[styles.td, {width: 120, color, fontWeight}]}>{item.product || 'Select Product'}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.hsn}</Text>
                      <Text style={[styles.td, {width: 100, color, fontWeight}]}>{item.reason || ''}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.sold}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.returnQty}</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{item.rate}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.disc}%</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{item.gst}%</Text>
                      <Text style={[styles.td, {width: 70, color, fontWeight}]}>{isFilled ? taxAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? cAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? sAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 60, color, fontWeight}]}>{isFilled ? iAmt.toFixed(2) : '0.00'}</Text>
                      <Text style={[styles.td, {width: 80, color, fontWeight}]}>{isFilled ? total.toFixed(2) : '0.00'}</Text>
                      <TouchableOpacity style={{width: 40, alignItems: 'center'}} onPress={() => handleRemoveItem(index)}>
                        <TrashIcon />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>'''

content = re.sub(table_regex, new_table, content)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Table patched.")
