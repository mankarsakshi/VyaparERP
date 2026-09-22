const fs = require('fs');
let code = fs.readFileSync('MyApp/src/screens/AddPurchase.tsx', 'utf8');

code = code.replace(/import\s*\{\s*SafeAreaView\s*,\s*Picker\s*\}\s*from\s*['\x22]@react-native-picker\/picker['\x22];/, 'import {Picker} from \'@react-native-picker/picker\';');

if (!code.match(/import\s*\{[^}]*SafeAreaView[^}]*\}\s*from\s*['\x22]react-native['\x22]/)) {
    code = code.replace(/import\s*\{/, 'import { SafeAreaView, ');
}

if (!code.includes('backButton: {')) {
    code = code.replace('headerTitleArea: {', 'backButton: { padding: 4 }, headerTitleArea: {');
}

fs.writeFileSync('MyApp/src/screens/AddPurchase.tsx', code);
