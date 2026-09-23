with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace("fontWeight: 'bold'}}>?</Text></TouchableOpacity>", "fontWeight: 'bold'}}>\u2715</Text></TouchableOpacity>")

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
