with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add states
old_states = '''  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);'''

new_states = '''  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);
  const [showCustomers, setShowCustomers] = useState(false);

  const [productsList, setProductsList] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);'''

content = content.replace(old_states, new_states)

# 2. Add loadProductsFromDB and modify useEffect
old_useeffect = '''  useEffect(() => {
    loadCustomersFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadCustomersFromDB();
    });
    return unsubscribe;
  }, [navigation]);'''

new_useeffect = '''  const loadProductsFromDB = async () => {
    try {
      setLoadingProducts(true);
      const response = await fetch(${API_BASE_URL}/api/products);
      const data = await response.json();
      const productData = Array.isArray(data) ? data : data?.products || data?.data || [];
      setProductsList(productData);
    } catch (error) {
      console.log('Load products error:', error);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadCustomersFromDB();
    loadProductsFromDB();
    const unsubscribe = navigation?.addListener?.('focus', () => {
      loadCustomersFromDB();
      loadProductsFromDB();
    });
    return unsubscribe;
  }, [navigation]);'''

content = content.replace(old_useeffect, new_useeffect)

# 3. Replace mProduct UI in Modal
old_mproduct = '''              <View style={[styles.dropdownContainer, { zIndex: 50 }]}>
                <TextInput style={[styles.formInput, { paddingRight: 30 }]} value={mProduct} onChangeText={setMProduct} placeholder="Select product" />
                <Text style={[styles.arrow, { position: 'absolute', right: 12, top: 14 }]}>\\u25BC</Text>
              </View>'''

new_mproduct = '''              <View style={[styles.dropdownContainer, { zIndex: 50 }]}>
                <TextInput 
                  style={[styles.formInput, { paddingRight: 30 }]} 
                  value={mProduct} 
                  onChangeText={(text) => {
                    setMProduct(text);
                    setShowProductsDropdown(true);
                  }} 
                  onFocus={() => setShowProductsDropdown(true)}
                  placeholder="Select product" 
                />
                <TouchableOpacity 
                  style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 40, justifyContent: 'center', alignItems: 'center' }}
                  onPress={() => setShowProductsDropdown(!showProductsDropdown)}
                >
                  <Text style={[styles.arrow]}>{showProductsDropdown ? '\\u25B2' : '\\u25BC'}</Text>
                </TouchableOpacity>

                {showProductsDropdown && (
                  <View style={[styles.dropdownMenu, { top: 46 }]}>
                    {loadingProducts ? (
                      <View style={styles.loaderContainer}>
                        <ActivityIndicator size="small" color="#ea7e30" />
                      </View>
                    ) : (
                      (() => {
                        const filtered = productsList.filter((p: any) => 
                          (p.product_name || '').toLowerCase().includes(mProduct.toLowerCase())
                        );
                        if (filtered.length === 0) {
                          return <Text style={styles.emptyText}>No products found</Text>;
                        }
                        return (
                          <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 200}}>
                            {filtered.map((p: any, idx: number) => (
                              <TouchableOpacity
                                key={p.id || p.product_id || idx}
                                style={styles.dropdownMenuItem}
                                onPress={() => {
                                  setMProduct(p.product_name || '');
                                  setMHsn(p.hsn_code || '');
                                  if (p.gst_rate) setMGst(p.gst_rate.toString());
                                  if (p.sales_price) setMRate(p.sales_price.toString());
                                  setShowProductsDropdown(false);
                                }}>
                                <Text style={styles.dropdownMainText}>{p.product_name}</Text>
                                <Text style={styles.dropdownSubText}>HSN: {p.hsn_code || '-'} | Rate: \\u20B9{p.sales_price || 0}</Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        );
                      })()
                    )}
                  </View>
                )}
              </View>'''

content = content.replace(old_mproduct, new_mproduct)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated products dropdown")
