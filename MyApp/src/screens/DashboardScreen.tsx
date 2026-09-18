// import React from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';

// type Props = {
//   navigation: any;
//   route: any;
// };


// const MetricCardIcon = ({type}: {type: string}) => {
//   switch (type) {
//     case 'sales':
//       return (
//         <View style={{width: 22, height: 22, justifyContent: 'flex-end', alignItems: 'center'}}>
//           <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', width: 18, height: 16}}>
//             <View style={{width: 4, height: 6, backgroundColor: '#ea6c08', borderRadius: 1.5}} />
//             <View style={{width: 4, height: 11, backgroundColor: '#ea6c08', borderRadius: 1.5}} />
//             <View style={{width: 4, height: 16, backgroundColor: '#ea6c08', borderRadius: 1.5}} />
//           </View>
//         </View>
//       );
//     case 'purchases':
//       return (
//         <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 8, height: 5, borderTopLeftRadius: 4, borderTopRightRadius: 4, borderWidth: 1.8, borderColor: '#059669', borderBottomWidth: 0}} />
//           <View style={{width: 17, height: 12, borderRadius: 3, borderWidth: 1.8, borderColor: '#059669', alignItems: 'center', justifyContent: 'center'}}>
//             <View style={{width: 7, height: 1.5, backgroundColor: '#059669', borderRadius: 1}} />
//           </View>
//         </View>
//       );
//     case 'expenses':
//       return (
//         <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 18, height: 13, borderRadius: 3, borderWidth: 1.8, borderColor: '#d97706', paddingHorizontal: 3, justifyContent: 'center'}}>
//             <View style={{width: 5, height: 4, backgroundColor: '#d97706', borderRadius: 1}} />
//           </View>
//         </View>
//       );
//     case 'profit':
//       return (
//         <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 18, height: 18, borderRadius: 9, borderWidth: 1.8, borderColor: '#7c3aed', alignItems: 'center', justifyContent: 'center'}}>
//             <View style={{width: 0, height: 0, borderLeftWidth: 3.5, borderRightWidth: 3.5, borderBottomWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: '#7c3aed'}} />
//           </View>
//         </View>
//       );
//     default:
//       return null;
//   }
// };



// const BottomNavIcon = ({
//   type,
//   isActive = false,
// }: {
//   type: string;
//   isActive?: boolean;
// }) => {
//   const color = isActive ? '#ea6c08' : '#64748b';

//   return (
//     <View style={{width: 24, height: 24, alignItems: 'center', justifyContent: 'center'}}>
//       {type === 'home' && (
//         <View style={{width: 18, height: 18, alignItems: 'center', justifyContent: 'flex-end'}}>
//           <View style={{width: 0, height: 0, borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 7, borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: color}} />
//           <View style={{width: 14, height: 8, backgroundColor: color, borderBottomLeftRadius: 2, borderBottomRightRadius: 2, alignItems: 'center'}}>
//             <View style={{width: 4, height: 5, backgroundColor: '#ffffff', position: 'absolute', bottom: 0}} />
//           </View>
//         </View>
//       )}

//       {type === 'add_sale' && (
//         <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
//           <View
//             style={{
//               width: 22,
//               height: 22,
//               borderRadius: 11,
//               backgroundColor: isActive ? '#ea6c08' : '#f9fafb',
//               borderWidth: 1.5,
//               borderColor: color,
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}>
//             <View
//               style={{
//                 width: 10,
//                 height: 2,
//                 backgroundColor: isActive ? '#ffffff' : color,
//                 borderRadius: 1,
//               }}
//             />
//             <View
//               style={{
//                 position: 'absolute',
//                 width: 2,
//                 height: 10,
//                 backgroundColor: isActive ? '#ffffff' : color,
//                 borderRadius: 1,
//               }}
//             />
//           </View>
//         </View>
//       )}

//       {type === 'menu' && (
//         <View style={{width: 18, height: 14, justifyContent: 'space-between', alignItems: 'center'}}>
//           <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
//           <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
//           <View style={{width: 18, height: 2, backgroundColor: color, borderRadius: 1}} />
//         </View>
//       )}

//       {type === 'profile' && (
//         <View style={{width: 18, height: 18, alignItems: 'center', justifyContent: 'center'}}>
//           <View style={{width: 7, height: 7, borderRadius: 3.5, backgroundColor: color, marginBottom: 1}} />
//           <View style={{width: 14, height: 7, borderTopLeftRadius: 7, borderTopRightRadius: 7, backgroundColor: color}} />
//         </View>
//       )}
//     </View>
//   );
// };


// const HeaderSettingsIcon = () => (
//   <View style={{width: 22, height: 22, alignItems: 'center', justifyContent: 'center'}}>
//     {/* 8 Gear Teeth */}
//     <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#ea6c08', borderRadius: 1.5}} />
//     <View style={{position: 'absolute', width: 20, height: 3, backgroundColor: '#ea6c08', borderRadius: 1.5}} />
//     <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#ea6c08', borderRadius: 1.5, transform: [{rotate: '45deg'}]}} />
//     <View style={{position: 'absolute', width: 3, height: 20, backgroundColor: '#ea6c08', borderRadius: 1.5, transform: [{rotate: '-45deg'}]}} />
//     {/* Central Gear Body */}
//     <View style={{width: 14, height: 14, borderRadius: 7, backgroundColor: '#ea6c08', alignItems: 'center', justifyContent: 'center'}}>
//       {/* Inner Center Hole */}
//       <View style={{width: 6, height: 6, borderRadius: 3, backgroundColor: '#ffffff'}} />
//     </View>
//   </View>
// );

// const DashboardScreen = ({navigation, route}: Props) => {
//   const user = route?.params?.user;
//   const businessName = user?.businessName || 'My Business';

//   const openPage = (screenName: string) => {
//     navigation.navigate(screenName, {
//       user: user,
//     });
//   };

//   return (
//     <SafeAreaView style={styles.container}>

     

//       <View style={styles.header}>

//         {/* THREE LINE MENU ICON */}
//         <TouchableOpacity
//           style={styles.headerMenuButton}
//           onPress={() => openPage('Menu')}
//           activeOpacity={0.7}
//           hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
//           <View style={styles.menuIconWrapper}>
//             <View style={styles.menuLine} />
//             <View style={styles.menuLine} />
//             <View style={styles.menuLine} />
//           </View>
//         </TouchableOpacity>

//         {/* BUSINESS NAME */}

//         <View style={styles.headerContent}>

//           <Text style={styles.welcome}>
//             Welcome 👋
//           </Text>

//           <Text
//             style={styles.businessName}
//             numberOfLines={1}>

//             {businessName}

//           </Text>

//         </View>

//         {/* NOTIFICATION */}

//         <TouchableOpacity
//           style={styles.notificationButton}
//           onPress={() => openPage('Notifications')}>

//           <View style={styles.notificationCircle}>
//             <View style={styles.bellWrapper}>
//               <View style={styles.bellHandle} />
//               <View style={styles.bellDome} />
//               <View style={styles.bellBase} />
//               <View style={styles.bellClapper} />
//             </View>
//           </View>

//         </TouchableOpacity>

//         {/* SETTINGS */}

//         <TouchableOpacity
//           style={styles.headerSettingsButton}
//           onPress={() => openPage('BusinessSettings')}>

//           <View style={styles.headerSettingsCircle}>
//             <HeaderSettingsIcon />
//           </View>

//         </TouchableOpacity>

//       </View>

//       {/* ================================================= */}
//       {/* DASHBOARD CARDS */}
//       {/* ================================================= */}

//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}>

//         <View style={styles.cardGrid}>

//           {/* SALES */}

//           <View style={styles.dashboardCard}>

//             <View
//               style={[
//                 styles.cardIconContainer,
//                 {backgroundColor: '#fff7ed'},
//               ]}>

//               <MetricCardIcon type="sales" />

//             </View>

//             <Text style={styles.cardTitle}>
//               Total Sales
//             </Text>

//             <Text style={styles.cardDescription}>
//               View and manage sales
//             </Text>

//           </View>

//           {/* PURCHASES */}

//           <View style={styles.dashboardCard}>

//             <View
//               style={[
//                 styles.cardIconContainer,
//                 {backgroundColor: '#ecfdf5'},
//               ]}>

//               <MetricCardIcon type="purchases" />

//             </View>

//             <Text style={styles.cardTitle}>
//               Total Purchases
//             </Text>

//             <Text style={styles.cardDescription}>
//               View and manage purchases
//             </Text>

//           </View>

//           {/* EXPENSES */}

//           <View style={styles.dashboardCard}>

//             <View
//               style={[
//                 styles.cardIconContainer,
//                 {backgroundColor: '#fff7ed'},
//               ]}>

//               <MetricCardIcon type="expenses" />

//             </View>

//             <Text style={styles.cardTitle}>
//               Total Expenses
//             </Text>

//             <Text style={styles.cardDescription}>
//               Track your expenses
//             </Text>

//           </View>

//           {/* PROFIT */}

//           <View style={styles.dashboardCard}>

//             <View
//               style={[
//                 styles.cardIconContainer,
//                 {backgroundColor: '#f3e8ff'},
//               ]}>

//               <MetricCardIcon type="profit" />

//             </View>

//             <Text style={styles.cardTitle}>
//               Net Profit
//             </Text>

//             <Text style={styles.cardDescription}>
//               Check your business profit
//             </Text>

//           </View>

//         </View>

//       </ScrollView>

//       {/* ================================================= */}
//       {/* BOTTOM NAVBAR */}
//       {/* ================================================= */}

//       <View style={styles.bottomNavbar}>
//         {/* HOME */}
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => {}}>
//           <BottomNavIcon type="home" isActive={true} />
//           <Text style={[styles.navLabel, styles.activeNavLabel]}>
//             Home
//           </Text>
//         </TouchableOpacity>

//         {/* ADD SALE (INSTEAD OF DASHBOARD) */}
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => openPage('AddSale')}>
//           <BottomNavIcon type="add_sale" isActive={false} />
//           <Text style={styles.navLabel}>
//             Add Sale
//           </Text>
//         </TouchableOpacity>

//         {/* MENU */}
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => openPage('Menu')}>
//           <BottomNavIcon type="menu" isActive={false} />
//           <Text style={styles.navLabel}>
//             Menu
//           </Text>
//         </TouchableOpacity>

//         {/* PROFILE */}
//         <TouchableOpacity
//           style={styles.navItem}
//           onPress={() => openPage('BusinessProfile')}>
//           <BottomNavIcon type="profile" isActive={false} />
//           <Text style={styles.navLabel}>
//             Profile
//           </Text>
//         </TouchableOpacity>
//       </View>

//     </SafeAreaView>
//   );
// };

// export default DashboardScreen;

// // ======================================================
// // STYLES
// // ======================================================

// const styles = StyleSheet.create({

//   // ================= MAIN =================

//   container: {
//     flex: 1,
//     backgroundColor: '#ffffff',
//   },

//   // ================= HEADER =================

  
//   header: {
//     backgroundColor: '#C86A34',
//     paddingTop: 38,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// //     shadowOpacity: 0.05,
// //     shadowRadius: 3,
// //     paddingTop: 42,
// //     paddingBottom: 18,
// //     paddingHorizontal: 18,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },

//   headerMenuButton: {
//     paddingRight: 14,
//     paddingVertical: 6,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   menuIconWrapper: {
//     width: 22,
//     height: 16,
//     justifyContent: 'space-between',
//   },

//   menuLine: {
//     width: 22,
//     height: 2.5,
//     backgroundColor: '#ffffff',
//     borderRadius: 1.5,
//   },

//   headerContent: {
//     flex: 1,
//   },

//   welcome: {
//     color: '#fff7ed',
//     fontSize: 13,
//   },

//   businessName: {
//     color: '#ffffff',
//     fontSize: 20,
//     fontWeight: '700',
//     marginTop: 2,
//   },

//   // ================= NOTIFICATION =================

//   notificationButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 6,
//   },

//   notificationCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   bellWrapper: {
//     width: 22,
//     height: 22,
//     alignItems: 'center',
//     justifyContent: 'center',
//     position: 'relative',
//   },

//   bellHandle: {
//     width: 4,
//     height: 3,
//     borderTopLeftRadius: 2,
//     borderTopRightRadius: 2,
//     backgroundColor: '#ea6c08',
//   },

//   bellDome: {
//     width: 13,
//     height: 9,
//     borderTopLeftRadius: 6.5,
//     borderTopRightRadius: 6.5,
//     backgroundColor: '#ea6c08',
//   },

//   bellBase: {
//     width: 17,
//     height: 2.5,
//     borderRadius: 1.25,
//     backgroundColor: '#ea6c08',
//   },

//   bellClapper: {
//     width: 4.5,
//     height: 2.5,
//     borderBottomLeftRadius: 2.25,
//     borderBottomRightRadius: 2.25,
//     backgroundColor: '#ea6c08',
//     marginTop: 0.5,
//   },

//   // ================= SETTINGS HEADER BUTTON =================

//   headerSettingsButton: {
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   headerSettingsCircle: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: '#ffffff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },

//   // ================= DASHBOARD =================

//   scrollContent: {
//     paddingHorizontal: 18,
//     paddingTop: 24,
//     paddingBottom: 85,
//   },

//   dashboardTitle: {
//     fontSize: 26,
//     fontWeight: '700',
//     color: '#0f172a',
//   },

//   subtitle: {
//     fontSize: 14,
//     color: '#64748b',
//     marginTop: 5,
//     marginBottom: 22,
//   },

//   // ================= CARDS =================

//   cardGrid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },

//   dashboardCard: {
//     width: '48%',
//     backgroundColor: '#ffffff',
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//     elevation: 2,
//   },

//   cardIconContainer: {
//     width: 42,
//     height: 42,
//     borderRadius: 11,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginBottom: 13,
//   },

//   cardTitle: {
//     fontSize: 15,
//     fontWeight: '700',
//     color: '#1e293b',
//   },

//   cardDescription: {
//     fontSize: 11,
//     color: '#64748b',
//     marginTop: 5,
//     lineHeight: 16,
//   },

//   // ================= BOTTOM NAVBAR =================

//   bottomNavbar: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 64,
//     backgroundColor: '#ffffff',
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-around',
//     borderTopWidth: 1,
//     borderTopColor: '#e2e8f0',
//     elevation: 12,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: -3},
//     shadowOpacity: 0.08,
//     shadowRadius: 6,
//     zIndex: 10,
//   },

//   navItem: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 6,
//   },

//   navLabel: {
//     fontSize: 11,
//     color: '#64748b',
//     marginTop: 3,
//     fontWeight: '500',
//   },

//   activeNavLabel: {
//     color: '#ea6c08',
//     fontWeight: '700',
//   },

// });


import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
  Pressable,
} from 'react-native';

type Props = {
  navigation: any;
  route: any;
};

const {width} = Dimensions.get('window');

const ORANGE = '#EA6C08';
const DARK = '#142B49';
const GRAY = '#64748B';
const LIGHT_BG = '#FFFDFC';

const DashboardScreen = ({navigation, route}: Props) => {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const user = route?.params?.user;

  const userName =
    user?.name ||
    user?.fullName ||
    'Sakshi';

  const businessName =
    user?.businessName ||
    'My Business';

  const openPage = (screenName: string) => {
    navigation.navigate(screenName, {
      user: user,
    });
  };

  return (
    <SafeAreaView style={styles.container}>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <View style={styles.header}>

        {/* LARGE LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/vyaparerp-logo.png.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* HEADER ACTIONS */}
        <View style={styles.headerActions}>

          {/* Notification */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => openPage('Notifications')}
            activeOpacity={0.7}>

            <View style={styles.bellIcon}>
              <View style={styles.bellTop} />
              <View style={styles.bellBody} />
              <View style={styles.bellBottom} />

              <View style={styles.notificationDot} />
            </View>

          </TouchableOpacity>

          {/* Profile */}
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => openPage('BusinessProfile')}
            activeOpacity={0.7}>

            <View style={styles.profileHead} />
            <View style={styles.profileBody} />

          </TouchableOpacity>

        </View>

      </View>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>

        {/* =================================================
            WELCOME CARD
        ================================================= */}

        <View style={styles.welcomeCard}>

          <View style={styles.welcomeTextContainer}>

            <Text style={styles.goodMorning}>
              Good Morning,
            </Text>

            <Text style={styles.userName}>
              {userName} 👋
            </Text>

            <Text style={styles.welcomeSubtitle}>
              Let's manage your business{'\n'}
              efficiently today.
            </Text>

          </View>


          {/* Illustration */}
          <View style={styles.chartIllustration}>

            <View style={styles.chartBox}>

              <View style={styles.chartLineOne} />
              <View style={styles.chartLineTwo} />
              <View style={styles.chartLineThree} />

              <View style={styles.barContainer}>

                <View
                  style={[
                    styles.bar,
                    {
                      height: 20,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.bar,
                    {
                      height: 34,
                    },
                  ]}
                />

                <View
                  style={[
                    styles.bar,
                    {
                      height: 48,
                    },
                  ]}
                />

              </View>

            </View>

            <View style={styles.arrowLine} />

            <View style={styles.leafOne} />
            <View style={styles.leafTwo} />
            <View style={styles.stem} />

          </View>

        </View>


        {/* =================================================
            QUICK ACTION CARDS
        ================================================= */}

        <View style={styles.quickGrid}>

          {/* ADD SALE */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              styles.saleCard,
            ]}
            onPress={() => openPage('AddSale')}
            activeOpacity={0.8}>

            <View
              style={[
                styles.quickIcon,
                styles.saleIcon,
              ]}>

              <View style={styles.cartIcon}>

                <View style={styles.cartHandle} />

                <View style={styles.cartBody} />

                <View style={styles.cartWheelOne} />

                <View style={styles.cartWheelTwo} />

              </View>

            </View>

            <Text style={styles.quickTitle}>
              Add Sale
            </Text>

            <Text style={styles.quickSubtitle}>
              Create a new sale
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>


          {/* PURCHASE */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              styles.purchaseCard,
            ]}
            onPress={() => openPage('Purchase')}
            activeOpacity={0.8}>

            <View
              style={[
                styles.quickIcon,
                styles.purchaseIcon,
              ]}>

              <View style={styles.bagIcon}>

                <View style={styles.bagHandle} />

                <View style={styles.bagBody} />

              </View>

            </View>

            <Text style={styles.quickTitle}>
              Purchase
            </Text>

            <Text style={styles.quickSubtitle}>
              Record new purchase
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>


          {/* PRODUCTS */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              styles.productCard,
            ]}
            onPress={() => openPage('ProductMaster')}
            activeOpacity={0.8}>

            <View
              style={[
                styles.quickIcon,
                styles.productIcon,
              ]}>

              <View style={styles.cubeIcon}>

                <View style={styles.cubeTop} />
                <View style={styles.cubeLeft} />
                <View style={styles.cubeRight} />

              </View>

            </View>

            <Text style={styles.quickTitle}>
              Products
            </Text>

            <Text style={styles.quickSubtitle}>
              Manage products
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>


          {/* REPORTS */}
          <TouchableOpacity
            style={[
              styles.quickCard,
              styles.reportCard,
            ]}
            onPress={() => openPage('Reports')}
            activeOpacity={0.8}>

            <View
              style={[
                styles.quickIcon,
                styles.reportIcon,
              ]}>

              <View style={styles.reportIconShape}>

                <View style={styles.reportLine} />
                <View style={styles.reportLine} />
                <View style={styles.reportLineShort} />

              </View>

            </View>

            <Text style={styles.quickTitle}>
              Reports
            </Text>

            <Text style={styles.quickSubtitle}>
              View business reports
            </Text>

            <Text style={styles.arrow}>
              ›
            </Text>

          </TouchableOpacity>

        </View>


        {/* =================================================
            RECENT ACTIVITY
        ================================================= */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Recent Activity
          </Text>

          <TouchableOpacity
            onPress={() => openPage('Notifications')}>

            <Text style={styles.viewAll}>
              View All ›
            </Text>

          </TouchableOpacity>

        </View>


        <View style={styles.activityCard}>

          {/* SALE */}
          <TouchableOpacity
            style={styles.activityRow}
            activeOpacity={0.7}>

            <View
              style={[
                styles.activityIcon,
                styles.activityGreen,
              ]}>

              <View style={styles.smallCart} />

            </View>

            <View style={styles.activityContent}>

              <Text style={styles.activityTitle}>
                Sale Created
              </Text>

              <Text style={styles.activitySubtitle}>
                A new sale has been added
              </Text>

            </View>

            <View style={styles.activityRight}>

              <Text style={styles.activityDate}>
                Today
              </Text>

              <Text style={styles.activityArrow}>
                ›
              </Text>

            </View>

          </TouchableOpacity>


          <View style={styles.separator} />


          {/* PURCHASE */}
          <TouchableOpacity
            style={styles.activityRow}
            activeOpacity={0.7}>

            <View
              style={[
                styles.activityIcon,
                styles.activityOrange,
              ]}>

              <View style={styles.smallBag} />

            </View>

            <View style={styles.activityContent}>

              <Text style={styles.activityTitle}>
                Purchase Created
              </Text>

              <Text style={styles.activitySubtitle}>
                A new purchase has been added
              </Text>

            </View>

            <View style={styles.activityRight}>

              <Text style={styles.activityDate}>
                Yesterday
              </Text>

              <Text style={styles.activityArrow}>
                ›
              </Text>

            </View>

          </TouchableOpacity>


          <View style={styles.separator} />


          {/* PRODUCT */}
          <TouchableOpacity
            style={styles.activityRow}
            activeOpacity={0.7}>

            <View
              style={[
                styles.activityIcon,
                styles.activityPurple,
              ]}>

              <View style={styles.smallCube} />

            </View>

            <View style={styles.activityContent}>

              <Text style={styles.activityTitle}>
                Product Added
              </Text>

              <Text style={styles.activitySubtitle}>
                New product has been added
              </Text>

            </View>

            <View style={styles.activityRight}>

              <Text style={styles.activityDate}>
                Recently
              </Text>

              <Text style={styles.activityArrow}>
                ›
              </Text>

            </View>

          </TouchableOpacity>


          <View style={styles.separator} />


          {/* REPORT */}
          <TouchableOpacity
            style={styles.activityRow}
            activeOpacity={0.7}>

            <View
              style={[
                styles.activityIcon,
                styles.activityBlue,
              ]}>

              <View style={styles.smallReport}>

                <View style={styles.smallReportLine} />
                <View style={styles.smallReportLine} />
                <View style={styles.smallReportLineShort} />

              </View>

            </View>

            <View style={styles.activityContent}>

              <Text style={styles.activityTitle}>
                Report Viewed
              </Text>

              <Text style={styles.activitySubtitle}>
                You viewed a report
              </Text>

            </View>

            <View style={styles.activityRight}>

              <Text style={styles.activityDate}>
                Recently
              </Text>

              <Text style={styles.activityArrow}>
                ›
              </Text>

            </View>

          </TouchableOpacity>

        </View>

      </ScrollView>


      {/* =====================================================
          BOTTOM NAVIGATION
      ===================================================== */}

      <View style={styles.bottomNavbar}>

        {/* HOME */}
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}>

          <View style={styles.homeIcon}>

            <View style={styles.homeRoof} />

            <View style={styles.homeBody}>
              <View style={styles.homeDoor} />
            </View>

          </View>

          <Text
            style={[
              styles.navLabel,
              styles.activeLabel,
            ]}>
            Home
          </Text>

          <View style={styles.activeLine} />

        </TouchableOpacity>


        {/* PRODUCTS */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('ProductMaster')}
          activeOpacity={0.7}>

          <View style={styles.navCube}>

            <View style={styles.navCubeTop} />
            <View style={styles.navCubeLeft} />
            <View style={styles.navCubeRight} />

          </View>

          <Text style={styles.navLabel}>
            Products
          </Text>

        </TouchableOpacity>


        {/* SALES */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => openPage('Sales')}
          activeOpacity={0.7}>

          <View style={styles.navSaleIcon}>

            <View style={styles.navSaleBody} />
            <View style={styles.navSaleHandle} />

            <View style={styles.navSaleWheelOne} />
            <View style={styles.navSaleWheelTwo} />

          </View>

          <Text style={styles.navLabel}>
            Sales
          </Text>

        </TouchableOpacity>


        {/* MENU */}
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setSidebarVisible(true)}
          activeOpacity={0.7}>

          <View style={styles.menuIcon}>

            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />

          </View>

          <Text style={styles.navLabel}>
            Menu
          </Text>

        </TouchableOpacity>

      </View>


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Modal
        visible={sidebarVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setSidebarVisible(false)
        }>

        <View style={styles.sidebarOverlay}>

          {/* Outside */}
          <Pressable
            style={styles.sidebarOutside}
            onPress={() =>
              setSidebarVisible(false)
            }
          />

          {/* Sidebar */}
          <View style={styles.sidebar}>

            {/* Sidebar Header */}
            <View style={styles.sidebarHeader}>

              <Image
                source={require('../../assets/vyaparerp-logo.png.png')}
                style={styles.sidebarLogo}
                resizeMode="contain"
              />

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() =>
                  setSidebarVisible(false)
                }>

                <Text style={styles.closeText}>
                  ×
                </Text>

              </TouchableOpacity>

            </View>


            <View style={styles.sidebarDivider} />


            {/* BUSINESS */}
            <View style={styles.businessBox}>

              <View style={styles.businessIcon}>

                <Text style={styles.businessIconText}>
                  M
                </Text>

              </View>

              <View style={styles.businessInfo}>

                <Text style={styles.businessName}>
                  {businessName}
                </Text>

                <Text style={styles.businessSubtitle}>
                  Business Account
                </Text>

              </View>

            </View>


            <Text style={styles.menuTitle}>
              MAIN MENU
            </Text>


            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                styles.sidebarMenu
              }>

              {/* HOME */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() =>
                  setSidebarVisible(false)
                }>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.orangeIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ⌂
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Home
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* SALES */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('Sales');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.greenIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ₹
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Sales
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* PURCHASE */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('Purchase');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.orangeLightIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    🛒
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Purchase
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* PRODUCTS */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('ProductMaster');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.purpleIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ▣
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Products
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* CUSTOMERS */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('CustomerMaster');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.blueIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ♙
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Customers
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* SUPPLIERS */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('SupplierMaster');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.tealIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ♙
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Suppliers
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              {/* REPORTS */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('Reports');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.blueLightIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ▤
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Reports
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>


              <View style={styles.sidebarDivider} />


              <Text style={styles.menuTitle}>
                SETTINGS
              </Text>


              {/* SETTINGS */}
              <TouchableOpacity
                style={styles.sidebarItem}
                onPress={() => {
                  setSidebarVisible(false);
                  openPage('Settings');
                }}>

                <View
                  style={[
                    styles.sidebarIcon,
                    styles.grayIcon,
                  ]}>

                  <Text style={styles.sidebarIconText}>
                    ⚙
                  </Text>

                </View>

                <Text style={styles.sidebarItemText}>
                  Settings
                </Text>

                <Text style={styles.sidebarArrow}>
                  ›
                </Text>

              </TouchableOpacity>

            </ScrollView>


            {/* FOOTER */}
            <View style={styles.sidebarFooter}>

              <Text style={styles.sidebarFooterText}>
                MiraBooks
              </Text>

              <Text style={styles.sidebarVersion}>
                Business & Billing Solution
              </Text>

            </View>

          </View>

        </View>

      </Modal>

    </SafeAreaView>
  );
};

export default DashboardScreen;


/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({

  /* ================= MAIN ================= */

  container: {
    flex: 1,
    backgroundColor: LIGHT_BG,
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 105,
  },


  /* ================= HEADER ================= */

  header: {
    height: 100,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  logoContainer: {
    flex: 1,
    height: 90,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  /*
   * Larger logo.
   * The logo itself contains the MiraBooks text,
   * so no separate MiraBooks text is required.
   */
  logo: {
    width: 265,
    height: 88,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  headerIconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },


  /* ================= BELL ================= */

  bellIcon: {
    width: 27,
    height: 29,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },

  bellTop: {
    width: 6,
    height: 4,
    backgroundColor: DARK,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  bellBody: {
    width: 18,
    height: 17,
    backgroundColor: DARK,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginTop: -1,
  },

  bellBottom: {
    width: 22,
    height: 2,
    backgroundColor: DARK,
    borderRadius: 2,
  },

  notificationDot: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: ORANGE,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },


  /* ================= PROFILE ================= */

  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF0E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileHead: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: '#C86A34',
    marginBottom: 2,
  },

  profileBody: {
    width: 22,
    height: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    backgroundColor: '#C86A34',
  },


  /* ================= WELCOME ================= */

  welcomeCard: {
    minHeight: 185,
    borderRadius: 22,
    backgroundColor: '#FFF2E8',
    borderWidth: 1,
    borderColor: '#FBE0CD',
    marginBottom: 20,
    overflow: 'hidden',
    flexDirection: 'row',
  },

  welcomeTextContainer: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 24,
    justifyContent: 'center',
    zIndex: 2,
  },

  goodMorning: {
    fontSize: 19,
    color: '#60758F',
    fontWeight: '500',
  },

  userName: {
    fontSize: 31,
    fontWeight: '800',
    color: DARK,
    marginTop: 5,
  },

  welcomeSubtitle: {
    fontSize: 15,
    color: '#70839A',
    lineHeight: 22,
    marginTop: 7,
  },


  /* ================= CHART ================= */

  chartIllustration: {
    width: width * 0.39,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  chartBox: {
    width: 108,
    height: 88,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 13,
    position: 'relative',
    padding: 13,
    marginRight: -10,
  },

  chartLineOne: {
    width: 52,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#F8D6BE',
    marginBottom: 7,
  },

  chartLineTwo: {
    width: 42,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#F8D6BE',
    marginBottom: 7,
  },

  chartLineThree: {
    width: 31,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#F8D6BE',
  },

  barContainer: {
    position: 'absolute',
    right: 13,
    bottom: 13,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },

  bar: {
    width: 7,
    backgroundColor: ORANGE,
    borderRadius: 3,
  },

  arrowLine: {
    position: 'absolute',
    width: 58,
    height: 4,
    backgroundColor: ORANGE,
    right: 18,
    top: 39,
    transform: [{rotate: '-25deg'}],
    borderRadius: 4,
  },

  stem: {
    position: 'absolute',
    width: 3,
    height: 58,
    backgroundColor: '#8E9B91',
    right: 5,
    bottom: 0,
    transform: [{rotate: '15deg'}],
  },

  leafOne: {
    position: 'absolute',
    width: 19,
    height: 31,
    borderRadius: 18,
    backgroundColor: '#7DA98B',
    right: 0,
    bottom: 43,
    transform: [{rotate: '35deg'}],
  },

  leafTwo: {
    position: 'absolute',
    width: 16,
    height: 26,
    borderRadius: 15,
    backgroundColor: '#9AB9A3',
    right: 20,
    bottom: 22,
    transform: [{rotate: '-35deg'}],
  },


  /* ================= QUICK GRID ================= */

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  quickCard: {
    width: '48.8%',
    minHeight: 170,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    position: 'relative',
  },

  saleCard: {
    backgroundColor: '#FFF7F1',
    borderColor: '#FCE4D3',
  },

  purchaseCard: {
    backgroundColor: '#F1FAF5',
    borderColor: '#DCEFE4',
  },

  productCard: {
    backgroundColor: '#F7F3FF',
    borderColor: '#E9DFFF',
  },

  reportCard: {
    backgroundColor: '#F1F8FF',
    borderColor: '#DCEBFA',
  },

  quickIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 13,
  },

  saleIcon: {
    backgroundColor: '#FFE2CF',
  },

  purchaseIcon: {
    backgroundColor: '#DDF4E7',
  },

  productIcon: {
    backgroundColor: '#E8DDFB',
  },

  reportIcon: {
    backgroundColor: '#DDEEFF',
  },

  quickTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DARK,
  },

  quickSubtitle: {
    fontSize: 13,
    color: '#6E829B',
    marginTop: 5,
  },

  arrow: {
    position: 'absolute',
    right: 17,
    top: '50%',
    fontSize: 30,
    color: '#71849A',
    fontWeight: '300',
  },


  /* ================= CART ================= */

  cartIcon: {
    width: 29,
    height: 29,
    position: 'relative',
  },

  cartHandle: {
    position: 'absolute',
    left: 1,
    top: 2,
    width: 7,
    height: 3,
    backgroundColor: ORANGE,
    borderRadius: 2,
  },

  cartBody: {
    position: 'absolute',
    left: 6,
    top: 5,
    width: 20,
    height: 13,
    borderWidth: 2,
    borderColor: ORANGE,
    borderTopWidth: 0,
    transform: [{skewX: '-8deg'}],
  },

  cartWheelOne: {
    position: 'absolute',
    left: 8,
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },

  cartWheelTwo: {
    position: 'absolute',
    right: 2,
    bottom: 3,
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },


  /* ================= BAG ================= */

  bagIcon: {
    width: 27,
    height: 29,
    alignItems: 'center',
  },

  bagHandle: {
    width: 11,
    height: 8,
    borderWidth: 2,
    borderBottomWidth: 0,
    borderColor: '#059669',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },

  bagBody: {
    width: 24,
    height: 19,
    borderWidth: 2,
    borderColor: '#059669',
    borderRadius: 4,
  },


  /* ================= CUBE ================= */

  cubeIcon: {
    width: 29,
    height: 29,
    position: 'relative',
  },

  cubeTop: {
    position: 'absolute',
    top: 2,
    left: 7,
    width: 16,
    height: 12,
    borderWidth: 2,
    borderColor: '#6437C7',
    transform: [{rotate: '30deg'}],
  },

  cubeLeft: {
    position: 'absolute',
    left: 3,
    top: 8,
    width: 13,
    height: 15,
    borderWidth: 2,
    borderColor: '#6437C7',
    transform: [{skewY: '-25deg'}],
  },

  cubeRight: {
    position: 'absolute',
    right: 3,
    top: 8,
    width: 13,
    height: 15,
    borderWidth: 2,
    borderColor: '#6437C7',
    transform: [{skewY: '25deg'}],
  },


  /* ================= REPORT ================= */

  reportIconShape: {
    width: 24,
    height: 29,
    borderWidth: 2,
    borderColor: '#2878C7',
    borderRadius: 4,
    padding: 5,
    justifyContent: 'center',
  },

  reportLine: {
    height: 2,
    width: 11,
    backgroundColor: '#2878C7',
    marginBottom: 4,
    borderRadius: 2,
  },

  reportLineShort: {
    height: 2,
    width: 8,
    backgroundColor: '#2878C7',
    borderRadius: 2,
  },


  /* ================= SECTION ================= */

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
    marginBottom: 11,
    paddingHorizontal: 2,
  },

  sectionTitle: {
    fontSize: 23,
    fontWeight: '800',
    color: DARK,
  },

  viewAll: {
    fontSize: 15,
    color: ORANGE,
    fontWeight: '600',
  },


  /* ================= ACTIVITY ================= */

  activityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E8EDF2',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 12,
  },

  activityRow: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 13,
  },

  activityGreen: {
    backgroundColor: '#E0F7EB',
  },

  activityOrange: {
    backgroundColor: '#FFF0E3',
  },

  activityPurple: {
    backgroundColor: '#EEE5FF',
  },

  activityBlue: {
    backgroundColor: '#E3F0FF',
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK,
  },

  activitySubtitle: {
    fontSize: 12.5,
    color: '#71849A',
    marginTop: 4,
  },

  activityRight: {
    alignItems: 'flex-end',
    flexDirection: 'row',
  },

  activityDate: {
    fontSize: 11,
    color: '#7890AA',
    marginRight: 8,
  },

  activityArrow: {
    fontSize: 25,
    color: '#8193A7',
  },

  separator: {
    height: 1,
    backgroundColor: '#EDF1F5',
    marginLeft: 65,
  },


  /* ================= SMALL ICONS ================= */

  smallCart: {
    width: 22,
    height: 13,
    borderWidth: 2,
    borderColor: '#059669',
    borderTopWidth: 0,
    transform: [{skewX: '-8deg'}],
  },

  smallBag: {
    width: 20,
    height: 21,
    borderWidth: 2,
    borderColor: ORANGE,
    borderRadius: 4,
  },

  smallCube: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: '#6437C7',
    transform: [{rotate: '45deg'}],
  },

  smallReport: {
    width: 20,
    height: 24,
    borderWidth: 2,
    borderColor: '#2878C7',
    borderRadius: 3,
    padding: 4,
  },

  smallReportLine: {
    height: 2,
    width: 9,
    backgroundColor: '#2878C7',
    marginBottom: 3,
  },

  smallReportLineShort: {
    height: 2,
    width: 6,
    backgroundColor: '#2878C7',
  },


  /* =====================================================
     BOTTOM NAVIGATION
  ===================================================== */

  bottomNavbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 78,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8EDF2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    zIndex: 10,
  },

  navItem: {
    flex: 1,
    height: 78,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  navLabel: {
    fontSize: 11,
    color: '#70839A',
    marginTop: 5,
    fontWeight: '500',
  },

  activeLabel: {
    color: ORANGE,
    fontWeight: '700',
  },

  activeLine: {
    position: 'absolute',
    bottom: 0,
    width: 54,
    height: 3,
    borderRadius: 3,
    backgroundColor: ORANGE,
  },


  /* ================= HOME ================= */

  homeIcon: {
    width: 26,
    height: 26,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },

  homeRoof: {
    position: 'absolute',
    top: 1,
    width: 0,
    height: 0,
    borderLeftWidth: 13,
    borderRightWidth: 13,
    borderBottomWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: ORANGE,
  },

  homeBody: {
    width: 20,
    height: 15,
    backgroundColor: ORANGE,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  homeDoor: {
    position: 'absolute',
    bottom: 0,
    left: 7,
    width: 6,
    height: 8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },


  /* ================= NAV CUBE ================= */

  navCube: {
    width: 24,
    height: 24,
    position: 'relative',
  },

  navCubeTop: {
    position: 'absolute',
    top: 2,
    left: 5,
    width: 15,
    height: 10,
    borderWidth: 2,
    borderColor: '#70839A',
    transform: [{rotate: '30deg'}],
  },

  navCubeLeft: {
    position: 'absolute',
    left: 2,
    top: 8,
    width: 12,
    height: 14,
    borderWidth: 2,
    borderColor: '#70839A',
    transform: [{skewY: '-25deg'}],
  },

  navCubeRight: {
    position: 'absolute',
    right: 2,
    top: 8,
    width: 12,
    height: 14,
    borderWidth: 2,
    borderColor: '#70839A',
    transform: [{skewY: '25deg'}],
  },


  /* ================= NAV SALES ================= */

  navSaleIcon: {
    width: 26,
    height: 25,
    position: 'relative',
  },

  navSaleBody: {
    position: 'absolute',
    left: 5,
    top: 6,
    width: 18,
    height: 12,
    borderWidth: 2,
    borderColor: '#70839A',
    borderTopWidth: 0,
    transform: [{skewX: '-8deg'}],
  },

  navSaleHandle: {
    position: 'absolute',
    left: 1,
    top: 3,
    width: 7,
    height: 2,
    backgroundColor: '#70839A',
  },

  navSaleWheelOne: {
    position: 'absolute',
    left: 7,
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#70839A',
  },

  navSaleWheelTwo: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#70839A',
  },


  /* ================= MENU ================= */

  menuIcon: {
    width: 25,
    height: 20,
    justifyContent: 'space-between',
  },

  menuLine: {
    width: 25,
    height: 2.5,
    backgroundColor: '#70839A',
    borderRadius: 2,
  },


  /* =====================================================
     SIDEBAR
  ===================================================== */

  sidebarOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
  },

  sidebarOutside: {
    flex: 1,
  },

  sidebar: {
    width: width * 0.78,
    maxWidth: 330,
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingTop: 45,
    paddingHorizontal: 18,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },

  sidebarHeader: {
    height: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  sidebarLogo: {
    width: 190,
    height: 70,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFF2E8',
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeText: {
    fontSize: 28,
    color: ORANGE,
    fontWeight: '400',
    marginTop: -3,
  },

  sidebarDivider: {
    height: 1,
    backgroundColor: '#EEF1F4',
    marginVertical: 12,
  },

  businessBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF7F1',
    borderRadius: 14,
    padding: 12,
    marginBottom: 20,
  },

  businessIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#FFE0CB',
    alignItems: 'center',
    justifyContent: 'center',
  },

  businessIconText: {
    fontSize: 18,
    fontWeight: '800',
    color: ORANGE,
  },

  businessInfo: {
    marginLeft: 11,
    flex: 1,
  },

  businessName: {
    fontSize: 15,
    fontWeight: '700',
    color: DARK,
  },

  businessSubtitle: {
    fontSize: 11,
    color: GRAY,
    marginTop: 3,
  },

  menuTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 8,
    marginTop: 4,
  },

  sidebarMenu: {
    paddingBottom: 20,
  },

  sidebarItem: {
    height: 57,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    borderRadius: 12,
    marginBottom: 4,
  },

  sidebarItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: DARK,
    marginLeft: 12,
  },

  sidebarArrow: {
    fontSize: 23,
    color: '#94A3B8',
    fontWeight: '300',
  },

  sidebarIcon: {
    width: 39,
    height: 39,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  sidebarIconText: {
    fontSize: 17,
    fontWeight: '700',
  },

  orangeIcon: {
    backgroundColor: '#FFF0E4',
  },

  orangeLightIcon: {
    backgroundColor: '#FFF4E9',
  },

  greenIcon: {
    backgroundColor: '#E8F8EF',
  },

  purpleIcon: {
    backgroundColor: '#F0E9FF',
  },

  blueIcon: {
    backgroundColor: '#E8F2FF',
  },

  tealIcon: {
    backgroundColor: '#E6F7F5',
  },

  blueLightIcon: {
    backgroundColor: '#EAF5FF',
  },

  grayIcon: {
    backgroundColor: '#F1F5F9',
  },

  sidebarFooter: {
    borderTopWidth: 1,
    borderTopColor: '#EEF1F4',
    paddingVertical: 16,
  },

  sidebarFooterText: {
    fontSize: 13,
    fontWeight: '700',
    color: ORANGE,
  },

  sidebarVersion: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 3,
  },

});