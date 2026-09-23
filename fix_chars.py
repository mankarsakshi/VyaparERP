with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

with open('output.txt', 'w', encoding='utf-8') as out:
    for i, line in enumerate(lines):
        if 'Rate (' in line:
            out.write(f"{i}: {repr(line)}\n")
        if 'showReasons ?' in line:
            out.write(f"{i}: {repr(line)}\n")
        if '{sub.toFixed' in line:
            out.write(f"{i}: {repr(line)}\n")
        if 'showModalGst ?' in line:
            out.write(f"{i}: {repr(line)}\n")
        if 'setModalVisible(false)}><Text' in line:
            out.write(f"{i}: {repr(line)}\n")
        if 'right: 12, top: 14' in line:
            out.write(f"{i}: {repr(line)}\n")
        if '{summary.subtotal}' in line:
            out.write(f"{i}: {repr(line)}\n")
