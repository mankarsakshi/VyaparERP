with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_str = "showModalReason && (\n                  <View style={styles.dropdownMenu}>\n                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps=\"handled\" style={{maxHeight: 120}}>"
new_str = "showModalReason && (\n                  <View style={styles.dropdownMenu}>\n                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps=\"handled\" style={{maxHeight: 200}}>"

content = content.replace(old_str, new_str)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated scroll view height")
