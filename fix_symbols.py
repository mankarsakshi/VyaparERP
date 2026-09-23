import re

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(\"fontWeight: 'bold'}>?</Text></TouchableOpacity>\", \"fontWeight: 'bold'}>\u2715</Text></TouchableOpacity>\")
content = content.replace(\"right: 12, top: 14 }]}>?</Text>\", \"right: 12, top: 14 }]}>\u25BC</Text>\")
content = content.replace(\"Rate (?) *\", \"Rate (\u20B9) *\")
content = content.replace(\"{showModalGst ? '?' : '?'}\", \"{showModalGst ? '\u25B2' : '\u25BC'}\")
content = content.replace(\"?{sub.toFixed(2)}\", \"\u20B9{sub.toFixed(2)}\")
content = content.replace(\"- ?{discAmt.toFixed(2)}\", \"- \u20B9{discAmt.toFixed(2)}\")
content = content.replace(\"?{taxAmt.toFixed(2)}\", \"\u20B9{taxAmt.toFixed(2)}\")
content = content.replace(\"?{gstAmt.toFixed(2)}\", \"\u20B9{gstAmt.toFixed(2)}\")
content = content.replace(\"?{total.toFixed(2)}\", \"\u20B9{total.toFixed(2)}\")

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
