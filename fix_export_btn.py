import re

with open('MyApp/src/screens/CreditNoteHistoryScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_btn = '''  exportBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },'''

new_btn = '''  exportBtn: {
    width: 44,
    height: 44,
    backgroundColor: '#ea7e30',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },'''

content = content.replace(old_btn, new_btn)

with open('MyApp/src/screens/CreditNoteHistoryScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added orange background to export button")
