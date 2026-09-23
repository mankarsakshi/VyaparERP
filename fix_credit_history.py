import re

with open('MyApp/src/screens/CreditNoteHistoryScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Search Icon
content = content.replace(r'<Text style={styles.searchIcon}>\uD83D\uDD0D</Text>', '<Text style={styles.searchIcon}>{"\\uD83D\\uDD0D"}</Text>')
# If they are already literal backslashes:
content = content.replace(r'<Text style={styles.searchIcon}>\\uD83D\\uDD0D</Text>', '<Text style={styles.searchIcon}>{"\\uD83D\\uDD0D"}</Text>')

# 2. Swipe Hint
content = content.replace(r'<Text style={styles.swipeHint}>\u2190 Horizontally Scrollable \u2192</Text>', '<Text style={styles.swipeHint}>{"\\u2190"} Horizontally Scrollable {"\\u2192"}</Text>')
content = content.replace(r'<Text style={styles.swipeHint}>\\u2190 Horizontally Scrollable \\u2192</Text>', '<Text style={styles.swipeHint}>{"\\u2190"} Horizontally Scrollable {"\\u2192"}</Text>')

# 3. Amount rendering
content = content.replace(r'<Text style={styles.cellAmountText}>\u20B9{item.amount.toFixed(2)}</Text>', '<Text style={styles.cellAmountText}>{"\\u20B9"}{item.amount.toFixed(2)}</Text>')
content = content.replace(r'<Text style={styles.cellAmountText}>\\u20B9{item.amount.toFixed(2)}</Text>', '<Text style={styles.cellAmountText}>{"\\u20B9"}{item.amount.toFixed(2)}</Text>')

# 4. Top Row: Replace Create New with Export Button
old_top_row = '''          <TouchableOpacity 
            style={styles.addBtn}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('CreditNote')}>
            <Text style={styles.addBtnText}>+ Create New</Text>
          </TouchableOpacity>'''

new_top_row = '''          <TouchableOpacity style={styles.exportBtn}>
            <Text style={styles.exportIcon}>{"\\uD83D\\uDCC4"}</Text>
          </TouchableOpacity>'''

content = content.replace(old_top_row, new_top_row)

# 5. Add Export Styles and Floating Add Button Styles
old_styles_end = '''  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
});'''

new_styles_end = '''  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  exportBtn: {
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
  },
  exportIcon: {
    fontSize: 20,
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 99,
  },
  addIconH: {
    position: 'absolute',
    width: 22,
    height: 3.2,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  addIconV: {
    position: 'absolute',
    width: 3.2,
    height: 22,
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
});'''

content = content.replace(old_styles_end, new_styles_end)

# 6. Add Floating Add Button to JSX
old_jsx_end = '''      </View>
    </SafeAreaView>
  );
};'''

new_jsx_end = '''      </View>

      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={() => navigation.navigate('CreditNote')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};'''

content = content.replace(old_jsx_end, new_jsx_end)

with open('MyApp/src/screens/CreditNoteHistoryScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed CreditNoteHistoryScreen.tsx")
