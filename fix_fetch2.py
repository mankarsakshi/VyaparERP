
with open("MyApp/src/screens/CreditNoteScreen.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace("fetch(${API_BASE_URL}/api/products);", "fetch(`" + "${API_BASE_URL}/api/products`);")

with open("MyApp/src/screens/CreditNoteScreen.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Fixed fetch correctly")

