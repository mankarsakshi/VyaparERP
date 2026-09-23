with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(\"\"\"? 'CGST + SGST\n(Intra-state)' : 'IGST\n(Inter-state)'}\"\"\", \"\"\"? 'CGST + SGST\\n(Intra-state)' : 'IGST\\n(Inter-state)'}\"\"\")

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
