// import React from 'react';
// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   SafeAreaView,
// } from 'react-native';
// // 
// type Props = {
//   navigation: any;
//   route: any;
// };

// const ProductInfoMasterScreen = ({navigation, route}: Props) => {
//   const product = route?.params?.product || {
//     name: 'Product Details',
//     sku: '-',
//     category: '-',
//     brand: '-',
//     unit: 'Unit',
//     purchasePrice: 0,
//     sellingPrice: 0,
//     gstRate: '-',
//     hsnCode: '-',
//     openingStock: 0,
//     currentStock: 0,
//     lowStockLevel: 0,
//     description: '',
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* HEADER */}
//       <View style={styles.header}>
//         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
//           <Text style={styles.backText}>â†</Text>
//         </TouchableOpacity>
//         <View style={styles.headerTitleBox}>
//           <Text style={styles.headerTitle}>Product Information</Text>
//           <Text style={styles.headerSubtitle}>Detailed master view of selected item</Text>
//         </View>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         {/* HERO TITLE CARD */}
//         <View style={styles.heroCard}>
//           <View style={styles.heroTopRow}>
//             <View style={styles.heroIconCircle}>
//               <Text style={styles.heroIconText}></Text>
//             </View>
//             <View style={styles.heroTitleBox}>
//               <Text style={styles.heroProductName}>{product.name}</Text>
//               <Text style={styles.heroSku}>SKU: {product.sku}</Text>
//             </View>
//           </View>
//         </View>

//         {/* 1. BASIC INFORMATION */}
//         <Text style={styles.sectionHeader}>Basic Information</Text>
//         <View style={styles.card}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Product Name</Text>
//             <Text style={styles.infoValBold}>{product.name}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>SKU Code</Text>
//             <Text style={styles.infoVal}>{product.sku}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Category</Text>
//             <Text style={styles.infoValBadge}>{product.category}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Brand</Text>
//             <Text style={styles.infoValBadge}>{product.brand}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Unit of Measurement</Text>
//             <Text style={styles.infoVal}>{product.unit}</Text>
//           </View>
//         </View>

//         {/* 2. PRICING */}
//         <Text style={styles.sectionHeader}>Pricing Details</Text>
//         <View style={styles.card}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Purchase Price (Cost)</Text>
//             <Text style={styles.infoVal}>â‚¹{product.purchasePrice?.toLocaleString()}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Selling Price (Sales)</Text>
//             <Text style={styles.infoValGreen}>â‚¹{product.sellingPrice?.toLocaleString()}</Text>
//           </View>
//         </View>

//         {/* 3. TAX */}
//         <Text style={styles.sectionHeader}>Tax Information</Text>
//         <View style={styles.card}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>GST Rate</Text>
//             <Text style={styles.infoVal}>{product.gstRate || '-'}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>HSN / SAC Code</Text>
//             <Text style={styles.infoVal}>{product.hsnCode || '-'}</Text>
//           </View>
//         </View>

//         {/* 4. INVENTORY */}
//         <Text style={styles.sectionHeader}>Inventory Status</Text>
//         <View style={styles.card}>
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Opening Stock</Text>
//             <Text style={styles.infoVal}>{product.openingStock ?? 0} {product.unit}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Current Stock</Text>
//             <Text style={styles.infoValGreenBold}>{product.currentStock ?? 0} {product.unit}</Text>
//           </View>
//           <View style={styles.divider} />
//           <View style={styles.infoRow}>
//             <Text style={styles.infoLabel}>Low Stock Alert Level</Text>
//             <Text style={styles.infoValRed}>{product.lowStockLevel ?? 0} {product.unit}</Text>
//           </View>
//         </View>

//         {/* 5. OTHER / DESCRIPTION */}
//         {product.description ? (
//           <>
//             <Text style={styles.sectionHeader}>Other Details</Text>
//             <View style={styles.card}>
//               <Text style={styles.infoLabel}>Description</Text>
//               <Text style={styles.descVal}>{product.description}</Text>
//             </View>
//           </>
//         ) : null}
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default ProductInfoMasterScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8fafc',
//   },
//   header: {
//     backgroundColor: '#4338ca',
//     paddingTop: 42,
//     paddingBottom: 16,
//     paddingHorizontal: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backBtn: {
//     paddingRight: 12,
//   },
//   backText: {
//     fontSize: 22,
//     color: '#ffffff',
//     fontWeight: 'bold',
//   },
//   headerTitleBox: {
//     flex: 1,
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: '700',
//     color: '#ffffff',
//   },
//   headerSubtitle: {
//     fontSize: 12,
//     color: '#c7d2fe',
//   },
//   content: {
//     padding: 16,
//   },
//   heroCard: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16,
//     borderWidth: 1,
//     borderColor: '#c7d2fe',
//   },
//   heroTopRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   heroIconCircle: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: '#e0e7ff',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 12,
//   },
//   heroIconText: {
//     fontSize: 22,
//   },
//   heroTitleBox: {
//     flex: 1,
//   },
//   heroProductName: {
//     fontSize: 17,
//     fontWeight: '700',
//     color: '#0f172a',
//   },
//   heroSku: {
//     fontSize: 12,
//     color: '#4338ca',
//     fontWeight: '600',
//     marginTop: 2,
//   },
//   sectionHeader: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#334155',
//     marginBottom: 8,
//     marginTop: 6,
//   },
//   card: {
//     backgroundColor: '#ffffff',
//     borderRadius: 12,
//     padding: 14,
//     marginBottom: 14,
//     borderWidth: 1,
//     borderColor: '#e2e8f0',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 4,
//   },
//   infoLabel: {
//     fontSize: 13,
//     color: '#64748b',
//   },
//   infoVal: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#0f172a',
//   },
//   infoValBold: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#0f172a',
//   },
//   infoValGreen: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#16a34a',
//   },
//   infoValGreenBold: {
//     fontSize: 14,
//     fontWeight: '700',
//     color: '#15803d',
//   },
//   infoValRed: {
//     fontSize: 13,
//     fontWeight: '600',
//     color: '#dc2626',
//   },
//   infoValBadge: {
//     fontSize: 12,
//     fontWeight: '600',
//     color: '#4338ca',
//     backgroundColor: '#e0e7ff',
//     paddingHorizontal: 8,
//     paddingVertical: 2,
//     borderRadius: 6,
//   },
//   descVal: {
//     fontSize: 13,
//     color: '#334155',
//     marginTop: 6,
//     lineHeight: 18,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#f1f5f9',
//     marginVertical: 6,
//   },
// });
