import re

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_calc = '''      return {
        rate: gVal,
        taxable: taxVal,
        cgst: cAmt,
        sgst: sAmt,
        igst: iAmt
      };'''

new_calc = '''      return {
        rate: gVal,
        taxable: taxVal,
        cgst: cAmt,
        sgst: sAmt,
        igst: iAmt,
        totalGst: gstVal
      };'''

content = content.replace(old_calc, new_calc)

old_ui = '''              <View style={{flexDirection: 'row', backgroundColor: '#fff7ed', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#fed7aa'}}>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>GST RATE</Text>
                <Text style={{flex: 1.5, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TAXABLE AMOUNT</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>CGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>SGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>IGST</Text>
              </View>

              {summary.breakdown.length === 0 ? (
                <View style={{paddingVertical: 24, alignItems: 'center'}}>
                  <Text style={{color: '#94a3b8', fontSize: 14, fontWeight: '600'}}>No GST applicable</Text>
                </View>
              ) : (
                summary.breakdown.map((b, i) => (
                  <View key={i} style={{flexDirection: 'row', paddingVertical: 14, borderBottomWidth: i === summary.breakdown.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9'}}>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '600'}}>{b.rate}%</Text>
                    <Text style={{flex: 1.5, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.taxable.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.cgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.sgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.igst.toFixed(2)}</Text>
                  </View>
                ))
              )}'''

new_ui = '''              <View style={{flexDirection: 'row', backgroundColor: '#fff7ed', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#fed7aa'}}>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>GST RATE</Text>
                <Text style={{flex: 1.5, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TAXABLE</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>CGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>SGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>IGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TOTAL GST</Text>
              </View>

              {summary.breakdown.length === 0 ? (
                <View style={{paddingVertical: 24, alignItems: 'center'}}>
                  <Text style={{color: '#94a3b8', fontSize: 14, fontWeight: '600'}}>No GST applicable</Text>
                </View>
              ) : (
                summary.breakdown.map((b, i) => (
                  <View key={i} style={{flexDirection: 'row', paddingVertical: 14, borderBottomWidth: i === summary.breakdown.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9'}}>
                    <Text style={{flex: 1, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '600'}}>{b.rate}%</Text>
                    <Text style={{flex: 1.5, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.taxable.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.cgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.sgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.igst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 11, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.totalGst.toFixed(2)}</Text>
                  </View>
                ))
              )}'''

content = content.replace(old_ui, new_ui)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added Total GST")
