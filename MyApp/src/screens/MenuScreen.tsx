import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

// =====================================================
// VECTOR ICON COMPONENT
// =====================================================

const ModuleIcon = ({type}: {type: string}) => {
  const getColors = () => {
    switch (type) {
      case 'master':
        return {bg: '#e0e7ff', icon: '#4338ca'};
      case 'pos':
        return {bg: '#e0e7ff', icon: '#4f46e5'};
      case 'products':
        return {bg: '#e0e7ff', icon: '#6366f1'};
      case 'sales':
        return {bg: '#ecfdf5', icon: '#10b981'};
      case 'purchases':
        return {bg: '#fffbeb', icon: '#f59e0b'};
      case 'customers':
        return {bg: '#fce7f3', icon: '#ec4899'};
      case 'suppliers':
        return {bg: '#fef3c7', icon: '#d97706'};
      case 'expenses':
        return {bg: '#fef2f2', icon: '#ef4444'};
      case 'payments':
        return {bg: '#dcfce7', icon: '#16a34a'};
      case 'reports':
        return {bg: '#f0fdfa', icon: '#0d9488'};
      case 'settings':
        return {bg: '#f1f5f9', icon: '#64748b'};
      default:
        return {bg: '#f1f5f9', icon: '#2563eb'};
    }
  };

  const {bg, icon: color} = getColors();

  return (
    <View style={[styles.iconBox, {backgroundColor: bg}]}>

      {type === 'pos' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 13,
              height: 11,
              borderRadius: 2,
              borderWidth: 1.5,
              borderColor: color,
              padding: 1,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: 9,
                height: 3,
                backgroundColor: color,
                borderRadius: 0.5,
              }}
            />

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <View style={[styles.smallDot, {backgroundColor: color}]} />
              <View style={[styles.smallDot, {backgroundColor: color}]} />
              <View style={[styles.smallDot, {backgroundColor: color}]} />
            </View>
          </View>
        </View>
      )}

      {type === 'products' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 13,
              height: 12,
              borderRadius: 2,
              borderWidth: 1.5,
              borderColor: color,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 9,
                height: 1,
                backgroundColor: color,
                marginTop: 3,
              }}
            />
            <View
              style={{
                width: 1,
                height: 6,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      )}

      {type === 'sales' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              width: 14,
              height: 13,
            }}>
            <View style={[styles.bar, {height: 5, backgroundColor: color}]} />
            <View style={[styles.bar, {height: 9, backgroundColor: color}]} />
            <View
              style={[styles.bar, {height: 13, backgroundColor: color}]}
            />
          </View>
        </View>
      )}

      {type === 'purchases' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 7,
              height: 4,
              borderTopLeftRadius: 3.5,
              borderTopRightRadius: 3.5,
              borderWidth: 1.5,
              borderColor: color,
              borderBottomWidth: 0,
            }}
          />

          <View
            style={{
              width: 14,
              height: 9,
              borderRadius: 2,
              borderWidth: 1.5,
              borderColor: color,
            }}
          />
        </View>
      )}

      {type === 'customers' && (
        <View
          style={[
            styles.iconCenter,
            {flexDirection: 'row'},
          ]}>
          <View
            style={{
              alignItems: 'center',
              marginRight: -2,
              zIndex: 2,
            }}>
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: color,
              }}
            />

            <View
              style={{
                width: 9,
                height: 5,
                borderTopLeftRadius: 4.5,
                borderTopRightRadius: 4.5,
                backgroundColor: color,
                marginTop: 1,
              }}
            />
          </View>

          <View
            style={{
              alignItems: 'center',
              opacity: 0.7,
            }}>
            <View
              style={{
                width: 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: color,
              }}
            />

            <View
              style={{
                width: 7,
                height: 4,
                borderTopLeftRadius: 3.5,
                borderTopRightRadius: 3.5,
                backgroundColor: color,
                marginTop: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'suppliers' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 13,
              height: 10,
              borderRadius: 2,
              borderWidth: 1.5,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: color,
              }}
            />
          </View>
        </View>
      )}

      {type === 'expenses' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 14,
              height: 11,
              borderRadius: 2.5,
              borderWidth: 1.5,
              borderColor: color,
              paddingHorizontal: 2,
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 4,
                height: 3,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'payments' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 13,
              height: 13,
              borderRadius: 6.5,
              borderWidth: 1.5,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                borderWidth: 1,
                borderColor: color,
              }}
            />
          </View>
        </View>
      )}

      {type === 'reports' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 12,
              height: 14,
              borderRadius: 2,
              borderWidth: 1.5,
              borderColor: color,
              paddingHorizontal: 2,
              justifyContent: 'space-around',
              paddingVertical: 2,
            }}>
            <View
              style={{
                width: 6,
                height: 1.5,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />

            <View
              style={{
                width: 7,
                height: 1.5,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />

            <View
              style={{
                width: 5,
                height: 1.5,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'master' && (
        <View style={styles.iconCenter}>
          <View
            style={{
              width: 14,
              height: 14,
              borderRadius: 3,
              borderWidth: 1.5,
              borderColor: color,
              padding: 1.5,
              justifyContent: 'space-between',
            }}>
            <View
              style={{
                width: 8,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />

            <View
              style={{
                width: 5,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />

            <View
              style={{
                width: 7,
                height: 2,
                backgroundColor: color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'settings' && (
        <View style={styles.settingsIcon}>
          <View style={styles.settingsLine} />

          <View
            style={[
              styles.settingsLine,
              {transform: [{rotate: '45deg'}]},
            ]}
          />

          <View
            style={[
              styles.settingsLine,
              {transform: [{rotate: '-45deg'}]},
            ]}
          />

          <View style={styles.settingsCircle}>
            <View style={styles.settingsInner} />
          </View>
        </View>
      )}
    </View>
  );
};

// =====================================================
// BOTTOM NAV ICON
// =====================================================

const BottomNavIcon = ({
  type,
  isActive = false,
}: {
  type: string;
  isActive?: boolean;
}) => {
  const color = isActive ? '#2563eb' : '#64748b';

  return (
    <View
      style={{
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
      }}>

      {type === 'home' && (
        <View
          style={{
            width: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderBottomWidth: 7,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: color,
            }}
          />

          <View
            style={{
              width: 14,
              height: 8,
              backgroundColor: color,
              borderBottomLeftRadius: 2,
              borderBottomRightRadius: 2,
              alignItems: 'center',
            }}>
            <View
              style={{
                width: 4,
                height: 5,
                backgroundColor: '#ffffff',
                position: 'absolute',
                bottom: 0,
              }}
            />
          </View>
        </View>
      )}

      {type === 'add_sale' && (
        <View
          style={{
            width: 22,
            height: 22,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: isActive ? '#2563eb' : '#f1f5f9',
              borderWidth: 1.5,
              borderColor: color,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View
              style={{
                width: 10,
                height: 2,
                backgroundColor: isActive ? '#ffffff' : color,
                borderRadius: 1,
              }}
            />

            <View
              style={{
                position: 'absolute',
                width: 2,
                height: 10,
                backgroundColor: isActive ? '#ffffff' : color,
                borderRadius: 1,
              }}
            />
          </View>
        </View>
      )}

      {type === 'menu' && (
        <View
          style={{
            width: 18,
            height: 14,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <View
            style={{
              width: 18,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />

          <View
            style={{
              width: 18,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />

          <View
            style={{
              width: 18,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
            }}
          />
        </View>
      )}

      {type === 'profile' && (
        <View
          style={{
            width: 18,
            height: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 3.5,
              backgroundColor: color,
              marginBottom: 1,
            }}
          />

          <View
            style={{
              width: 14,
              height: 7,
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
              backgroundColor: color,
            }}
          />
        </View>
      )}
    </View>
  );
};

// =====================================================
// MENU DATA
// =====================================================

const MENU_MODULES = [
  {
    id: 'master',
    type: 'master',
    title: 'Master',
    description: 'Products & supplier directory master',
    subfields: [
      {title: 'Products Master', target: 'ProductMaster'},
      {title: 'Supplier Master', target: 'SupplierMaster'},
      {title:'Customer Master', target:'CustomerMaster'},
      {title:'Product Category Master' , target:'ProductCategoryMaster'},
      {title:'Unit Master',target:'UnitMaster'}
    ],
  },

  {
    id: 'pos',
    type: 'pos',
    title: 'POS / Billing',
    description: 'Create bills & view transaction history',
    subfields: [
      {title: 'New Bill', target: 'AddSale'},
      {title: 'Billing History', target: 'Sales'},
      {title: 'Invoice Details', target: 'Invoices'},
    ],
  },

  {
    id: 'products',
    type: 'products',
    title: 'Products / Inventory',
    description: 'Manage items, stock & low stock alerts',
    subfields: [
      {title: 'All Products', target: 'Products'},
      {title: 'Categories', target: 'Categories'},
      {title: 'Stock', target: 'Stock'},
      {title: 'Low Stock', target: 'LowStock'},
    ],
  },

  {
    id: 'sales',
    type: 'sales',
    title: 'Sales',
    description: 'Track sales orders & customer invoices',
    subfields: [
      {title: 'All Sales', target: 'Sales'},
      {title: 'Sale Details', target: 'SalesDetails'},
      {title: 'Invoices', target: 'Invoices'},
    ],
  },

  // =====================================================
  // PURCHASES
  // =====================================================

  {
    id: 'purchases',
    type: 'purchases',
    title: 'Purchases',
    description: 'Manage purchase bills & supplier orders',
    subfields: [
      {
        title: 'Purchase Order',
        target: 'PurchaseOrder',
      },
      {
        title: 'Purchase Order History',
        target: 'AllPurchaseOrders',
      },
      
      {
        title: 'Add Purchase',
        target: 'AddPurchase',
      },
      {
        title: 'All Purchases',
        target: 'AllPurchases',
      },
      
      
    ],
  },

  {
    id: 'customers',
    type: 'customers',
    title: 'Customers',
    description: 'Customer directory & balance ledgers',
    subfields: [
      {title: 'All Customers', target: 'CustomerMaster'},
      {title: 'Customer Ledger', target: 'CustomerMaster'},
      {title: 'Customer Details', target: 'CustomerMaster'},
    ],
  },

  {
    id: 'suppliers',
    type: 'suppliers',
    title: 'Suppliers',
    description: 'Vendor details & payment ledgers',
    subfields: [
      {title: 'All Suppliers', target: 'Suppliers'},
      {title: 'Supplier Ledger', target: 'SupplierLedger'},
      {title: 'Supplier Details', target: 'SupplierDetails'},
    ],
  },

  {
    id: 'expenses',
    type: 'expenses',
    title: 'Expenses',
    description: 'Record operating & business expenses',
    subfields: [
      {title: 'Expense Categories', target: 'ExpenseCategories'},
      {title: 'All Expenses', target: 'Expenses'},
      {title: 'Add Expense', target: 'AddExpense'},
    ],
  },

  {
    id: 'payments',
    type: 'payments',
    title: 'Payments',
    description: 'Track incoming & outgoing payments',
    subfields: [
      {title: 'Payment History', target: 'PaymentHistory'},
      {title: 'Receive Payment', target: 'ReceivePayment'},
      {title: 'Record Payment', target: 'RecordPayment'},
    ],
  },

  {
    id: 'reports',
    type: 'reports',
    title: 'Reports',
    description: 'GST, Sales, Inventory & Profit analytics',
    subfields: [
      {title: 'Sales Report', target: 'SalesReport'},
      {title: 'Inventory Valuation', target: 'InventoryValuation'},
      {title: 'Party Ledger Report', target: 'PartyLedgerReport'},
      {title: 'GSTR-1 Report', target: 'GSTR1Report'},
      {title: 'Profit & Loss', target: 'Profit'},
    ],
  },

  {
    id: 'settings',
    type: 'settings',
    title: 'Settings',
    description: 'Business details & invoice preferences',
    subfields: [
      {title: 'Business Settings', target: 'BusinessSettings'},
      {title: 'Invoice Settings', target: 'InvoiceSettings'},
      {title: 'Account Settings', target: 'AccountSettings'},
    ],
  },
];

// =====================================================
// MENU SCREEN
// =====================================================

const MenuScreen = ({navigation, route}: Props) => {
  const user = route?.params?.user;

  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModuleId, setExpandedModuleId] =
    useState<string | null>(null);

  const openPage = (screenName: string) => {
    console.log('Opening screen:', screenName);

    navigation.navigate(screenName, {
      user,
    });
  };

  const toggleModule = (id: string) => {
    setExpandedModuleId(prev =>
      prev === id ? null : id,
    );
  };

  const filteredModules = MENU_MODULES.filter(module => {
    if (!searchQuery.trim()) {
      return true;
    }

    const query = searchQuery.toLowerCase();

    const titleMatch = module.title
      .toLowerCase()
      .includes(query);

    const descMatch = (module.description || '')
      .toLowerCase()
      .includes(query);

    const subMatch = (module.subfields || []).some(sub =>
      sub.title.toLowerCase().includes(query),
    );

    return titleMatch || descMatch || subMatch;
  });

  return (
    <SafeAreaView style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>

          <View style={styles.backArrow}>
            <View style={styles.backArrowLine} />
            <View style={styles.backArrowHead} />
          </View>

        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>

          <Text style={styles.headerTitle}>
            All Modules & Features
          </Text>

          <Text style={styles.headerSubtitle}>
            Select a module to view features
          </Text>

        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* SEARCH */}
        <View style={styles.searchBox}>

          <Text style={styles.searchIcon}>
            
          </Text>

          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search modules, reports, or fields..."
            placeholderTextColor="#94a3b8"
          />

        </View>

        {/* MODULES */}
        {filteredModules.map(module => {

          const isExpanded = searchQuery.trim()
            ? true
            : expandedModuleId === module.id;

          const hasSubfields =
            module.subfields && module.subfields.length > 0;

          return (
            <View
              key={module.id}
              style={styles.moduleCard}>

              <TouchableOpacity
                style={styles.moduleCardHeader}
                activeOpacity={0.7}
                onPress={() => {
                  if (module.id === 'customers') {
                    openPage('CustomerMaster');
                  } else if (hasSubfields) {
                    toggleModule(module.id);
                  }
                }}>

                <ModuleIcon type={module.type} />

                <View style={styles.moduleHeaderInfo}>

                  <Text style={styles.moduleTitle}>
                    {module.title}
                  </Text>

                  <Text style={styles.moduleDescription}>
                    {module.description}
                  </Text>

                </View>

                <View style={styles.accordionChevronBox}>

                  {hasSubfields ? (
                    <View
                      style={[
                        styles.accordionChevron,
                        isExpanded
                          ? styles.chevronUp
                          : styles.chevronDown,
                      ]}
                    />
                  ) : (
                    <Text
                      style={{
                        color: '#94a3b8',
                        fontSize: 16,
                        fontWeight: '600',
                      }}>
                      ›
                    </Text>
                  )}

                </View>

              </TouchableOpacity>

              {isExpanded && hasSubfields && (
                <View style={styles.subfieldContainer}>

                  {module.subfields.map((sub, idx) => (

                    <TouchableOpacity
                      key={`${module.id}-${sub.target}-${idx}`}
                      style={[
                        styles.subfieldRow,
                        idx ===
                          module.subfields.length - 1 &&
                          styles.subfieldRowLast,
                      ]}
                      activeOpacity={0.6}
                      onPress={() =>
                        openPage(sub.target)
                      }>

                      <Text style={styles.subfieldTitle}>
                        {sub.title}
                      </Text>

                      <View style={styles.subfieldChevron}>

                        <View
                          style={
                            styles.subfieldChevronLine
                          }
                        />

                      </View>

                    </TouchableOpacity>

                  ))}

                </View>
              )}

            </View>
          );
        })}

      </ScrollView>

      {/* BOTTOM NAVIGATION */}
      <View style={styles.bottomNavbar}>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('Home', {user})
          }>

          <BottomNavIcon type="home" />

          <Text style={styles.navLabel}>
            Home
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate('AddSale', {user})
          }>

          <BottomNavIcon type="add_sale" />

          <Text style={styles.navLabel}>
            Add Sale
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {}}>

          <BottomNavIcon
            type="menu"
            isActive={true}
          />

          <Text
            style={[
              styles.navLabel,
              styles.activeNavLabel,
            ]}>
            Menu
          </Text>

        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() =>
            navigation.navigate(
              'BusinessProfile',
              {user},
            )
          }>

          <BottomNavIcon type="profile" />

          <Text style={styles.navLabel}>
            Profile
          </Text>

        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default MenuScreen;

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  header: {
    backgroundColor: '#2563eb',
    paddingTop: 42,
    paddingBottom: 18,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  backArrow: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  backArrowLine: {
    width: 14,
    height: 2,
    backgroundColor: '#ffffff',
    borderRadius: 1,
  },

  backArrowHead: {
    position: 'absolute',
    left: 0,
    width: 7,
    height: 7,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#ffffff',
    transform: [{rotate: '45deg'}],
  },

  headerTitleContainer: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },

  headerSubtitle: {
    fontSize: 12,
    color: '#dbeafe',
    marginTop: 2,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 85,
  },

  searchBox: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 16,
  },

  searchIcon: {
    fontSize: 15,
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0f172a',
  },

  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  iconCenter: {
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  smallDot: {
    width: 2,
    height: 2,
    borderRadius: 0.5,
  },

  bar: {
    width: 3.5,
    borderRadius: 1,
  },

  settingsIcon: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsLine: {
    position: 'absolute',
    width: 2.5,
    height: 16,
    backgroundColor: '#64748b',
    borderRadius: 1.25,
  },

  settingsCircle: {
    width: 11,
    height: 11,
    borderRadius: 5.5,
    backgroundColor: '#64748b',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingsInner: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#ffffff',
  },

  moduleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },

  moduleCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  moduleHeaderInfo: {
    flex: 1,
  },

  moduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  moduleDescription: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  accordionChevronBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  accordionChevron: {
    width: 7,
    height: 7,
    borderRightWidth: 1.8,
    borderBottomWidth: 1.8,
    borderColor: '#64748b',
  },

  chevronDown: {
    transform: [{rotate: '45deg'}],
    marginTop: -2,
  },

  chevronUp: {
    transform: [{rotate: '-135deg'}],
    marginTop: 2,
  },

  subfieldContainer: {
    marginTop: 12,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  subfieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },

  subfieldRowLast: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },

  subfieldTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#334155',
  },

  subfieldChevron: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  subfieldChevronLine: {
    width: 6,
    height: 6,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderColor: '#94a3b8',
    transform: [{rotate: '45deg'}],
  },

  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 64,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    zIndex: 10,
  },

  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },

  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
    fontWeight: '500',
  },

  activeNavLabel: {
    color: '#2563eb',
    fontWeight: '700',
  },
});