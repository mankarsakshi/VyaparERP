import re

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

new_customer_section = '''          {/* CUSTOMER */}
          <View style={[styles.formCard, { zIndex: 999 }]}>
            <Text style={styles.cardHeaderTitle}>Customer Information</Text>
            
            <Text style={styles.inputLabel}>Select Customer</Text>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowCustomers(!showCustomers)}>
                <Text style={[styles.dropdownText, !customer && styles.placeholderText]}>{customer || 'Select customer'}</Text>
                <Text style={styles.arrow}>{showCustomers ? '?' : '?'}</Text>
              </TouchableOpacity>

              {showCustomers && (
                <View style={styles.dropdownMenu}>
                  {loadingCustomers ? (
                    <View style={styles.loaderContainer}>
                      <ActivityIndicator size="small" color="#ea7e30" />
                    </View>
                  ) : (
                    (() => {
                      const filteredCustomers = customers.filter((cust: Customer) =>
                        (cust.name || '').toLowerCase().includes((customer || '').toLowerCase()),
                      );
                      if (filteredCustomers.length === 0) {
                        return <Text style={styles.emptyText}>No customers found</Text>;
                      }
                      return (
                        <ScrollView
                          nestedScrollEnabled
                          keyboardShouldPersistTaps="handled"
                          style={{maxHeight: 180}}>
                          {filteredCustomers.map((cust: Customer) => (
                            <TouchableOpacity
                              key={cust.id}
                              style={styles.dropdownMenuItem}
                              onPress={() => {
                                setCustomer(cust.name);
                                setCustomerName(cust.name);
                                setPhone(cust.phone ?? '');
                                setGstin(cust.gstin ?? '');
                                setAddress(cust.address ?? '');
                                setState(cust.state ?? '');
                                setPincode(cust.pincode ?? '');
                                setShowCustomers(false);
                              }}>
                              <Text style={styles.dropdownMainText}>{cust.name}</Text>
                              {!!cust.phone && (
                                <Text style={styles.dropdownSubText}>{cust.phone}</Text>
                              )}
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      );
                    })()
                  )}
                </View>
              )}
            </View>

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Customer Name</Text>
                <TextInput style={styles.formInput} value={customerName} onChangeText={setCustomerName} placeholder="Enter customer name" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput style={styles.formInput} value={phone} onChangeText={setPhone} placeholder="Enter phone no" />
              </View>
            </View>

            <Text style={styles.inputLabel}>Address</Text>
            <TextInput style={[styles.formInput, {height: 60, textAlignVertical: 'top', paddingTop: 10}]} value={address} onChangeText={setAddress} placeholder="Enter customer address" multiline />

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput style={styles.formInput} value={state} onChangeText={setState} placeholder="Enter state" />
              </View>
              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Pincode</Text>
                <TextInput style={styles.formInput} value={pincode} onChangeText={setPincode} placeholder="Enter pincode" />
              </View>
            </View>

            <View style={{flexDirection: 'row', gap: 12, marginTop: 10}}>
              <View style={[styles.dropdownContainer, {flex: 1, zIndex: 11}]}>
                <Text style={styles.inputLabel}>Default GST Rate</Text>
                <TouchableOpacity style={styles.dropdown} onPress={() => setShowDefaultGstRates(!showDefaultGstRates)}>
                  <Text style={styles.dropdownText}>{defaultGstRate}</Text>
                  <Text style={styles.arrow}>{showDefaultGstRates ? '?' : '?'}</Text>
                </TouchableOpacity>
                {showDefaultGstRates && (
                  <View style={styles.dropdownMenu}>
                    <ScrollView nestedScrollEnabled keyboardShouldPersistTaps="handled" style={{maxHeight: 150}}>
                      {DEFAULT_GST_RATES.map((rate, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.dropdownMenuItem}
                          onPress={() => {
                            setDefaultGstRate(rate);
                            setShowDefaultGstRates(false);
                          }}>
                          <Text style={styles.dropdownMainText}>{rate}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>

              <View style={{flex: 1}}>
                <Text style={styles.inputLabel}>Tax Type</Text>
                <View style={{
                  backgroundColor: '#fff7ed', 
                  borderWidth: 1, 
                  borderColor: '#fed7aa',
                  borderRadius: 10,
                  minHeight: 44,
                  paddingVertical: 8,
                  justifyContent: 'center',
                  paddingHorizontal: 12
                }}>
                  <Text style={{color: '#c2410c', fontWeight: '700', fontSize: 13, lineHeight: 18}}>
                    {(!state || state.trim().toLowerCase() === 'maharashtra') ? 'CGST + SGST\\n(Intra-state)' : 'IGST\\n(Inter-state)'}
                  </Text>
                </View>
              </View>
            </View>
            
            <Text style={styles.inputLabel}>GSTIN</Text>
            <TextInput style={styles.formInput} value={gstin} onChangeText={setGstin} placeholder="Enter GSTIN" />
          </View>'''

content = re.sub(r'          \{\/\* CUSTOMER \*\/\}[\s\S]*?<\/View>', new_customer_section, content, count=1)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Customer section updated.")
