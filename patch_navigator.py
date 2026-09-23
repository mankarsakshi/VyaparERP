import re

with open('MyApp/src/navigation/AppNavigator.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
old_import = "import CreditNoteScreen from '../screens/CreditNoteScreen';"
new_import = "import CreditNoteScreen from '../screens/CreditNoteScreen';\nimport CreditNoteHistoryScreen from '../screens/CreditNoteHistoryScreen';"
content = content.replace(old_import, new_import)

# Add route
old_route = '''        <Stack.Screen
          name="CreditNote"
          component={CreditNoteScreen}
        />'''
new_route = '''        <Stack.Screen
          name="CreditNote"
          component={CreditNoteScreen}
        />
        <Stack.Screen
          name="CreditNoteHistory"
          component={CreditNoteHistoryScreen}
        />'''
content = content.replace(old_route, new_route)

with open('MyApp/src/navigation/AppNavigator.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated AppNavigator.tsx")
