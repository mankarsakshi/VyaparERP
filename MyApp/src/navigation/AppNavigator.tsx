import React from 'react';
import {
  NavigationContainer,
} from '@react-navigation/native';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

// Landing
import LandingScreen from '../screens/Landing/LandingScreen';
import ExploreScreen from '../screens/Landing/ExploreScreen';

// Authentication
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import OTPScreen from '../screens/OTPScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import PasswordResetSuccessScreen from '../screens/PasswordResetSuccessScreen';

// Main
import HomeScreen from '../screens/HomeScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddSaleScreen from '../screens/AddSaleScreen';
import BusinessProfileScreen from '../screens/BusinessProfileScreen';
import MenuScreen from '../screens/MenuScreen';

// Settings
import AccountSettingsScreen from '../screens/AccountSettingsScreen';
import BusinessSettingsScreen from '../screens/BusinessSettingsScreen';

// Product Masters
//import ProductCategoryMasterScreen from '../screens/ProductCategoryMasterScreen';
import ProductMasterScreen from '../screens/ProductMasterScreen';
//import ProductInfoMasterScreen from '../screens/ProductInfoMasterScreen';
import AddProductScreen from '../screens/AddProductScreen';
import UnitBrandMasterScreen from '../screens/UnitBrandMasterScreen';
import UnitMasterScreen from '../screens/UnitMasterScreen';

// Customer & Supplier
import CustomerMasterScreen from '../screens/CustomerMasterScreen';
import SupplierMasterScreen from '../screens/SupplierMasterScreen';

// Purchase
import PurchaseOrderScreen from '../screens/PurchaseOrder';
import AddPurchaseScreen from '../screens/AddPurchase';
import AllPurchasesScreen from '../screens/AllPurchases';
import PurchaseOrderHistoryScreen from '../screens/PurchaseOrderHistory';
import ViewPurchaseScreen from '../screens/ViewPurchase';
import ViewPurchaseOrderScreen from '../screens/ViewPurchaseOrder';
import ProductCategoryMasterScreen from '../screens/ProductCategoryMasterScreen';

const Stack =
  createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
        }}
      >

        {/* ===================================== */}
        {/* LANDING */}
        {/* ===================================== */}

        <Stack.Screen
          name="Landing"
          component={LandingScreen}
        />

        <Stack.Screen
          name="Explore"
          component={ExploreScreen}
        />

        {/* ===================================== */}
        {/* AUTHENTICATION */}
        {/* ===================================== */}

        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />

        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />

        <Stack.Screen
          name="OTP"
          component={OTPScreen}
        />

        <Stack.Screen
          name="ResetPassword"
          component={ResetPasswordScreen}
        />

        <Stack.Screen
          name="PasswordResetSuccess"
          component={PasswordResetSuccessScreen}
        />

        {/* ===================================== */}
        {/* HOME / DASHBOARD */}
        {/* ===================================== */}

        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
        />

        {/* ===================================== */}
        {/* SALES */}
        {/* ===================================== */}

        {/* <Stack.Screen
          name="AddSale"
          component={AddSaleScreen}
        />

        <Stack.Screen
          name="Sales"
          component={AddSaleScreen}
        /> */}

        {/* ===================================== */}
        {/* BUSINESS */}
        {/* ===================================== */}

        <Stack.Screen
          name="BusinessProfile"
          component={BusinessProfileScreen}
        />

        <Stack.Screen
          name="AccountSettings"
          component={AccountSettingsScreen}
        />

        <Stack.Screen
          name="BusinessSettings"
          component={BusinessSettingsScreen}
        />

        {/* ===================================== */}
        {/* MENU */}
        {/* ===================================== */}

        <Stack.Screen
          name="Menu"
          component={MenuScreen}
        />

        {/* ===================================== */}
        {/* PRODUCT MASTERS */}
        {/* ===================================== */}

        <Stack.Screen
          name="ProductCategoryMaster"
          component={
            ProductCategoryMasterScreen
          }
        />

        <Stack.Screen
          name="Categories"
          component={
            ProductCategoryMasterScreen
          }
        />

        <Stack.Screen
          name="ProductMaster"
          component={ProductMasterScreen}
        />

        <Stack.Screen
          name="Products"
          component={ProductMasterScreen}
        />

        <Stack.Screen
          name="Stock"
          component={ProductMasterScreen}
        />

        <Stack.Screen
          name="LowStock"
          component={ProductMasterScreen}
        />

        <Stack.Screen
          name="AddProduct"
          component={AddProductScreen}
        />

        {/* <Stack.Screen
          name="ProductInfoMaster"
          component={
            ProductInfoMasterScreen
          }
        /> */}

        {/* <Stack.Screen
          name="UnitBrandMaster"
          component={
            UnitBrandMasterScreen
          }
        /> */}

        <Stack.Screen
          name="UnitMaster"
          component={UnitMasterScreen}
        />

        {/* ===================================== */}
        {/* CUSTOMER & SUPPLIER */}
        {/* ===================================== */}

        <Stack.Screen
          name="CustomerMaster"
          component={CustomerMasterScreen}
        />
        <Stack.Screen
          name="Customers"
          component={CustomerMasterScreen}
        />
        <Stack.Screen
          name="Customer"
          component={CustomerMasterScreen}
        />
        <Stack.Screen
          name="AllCustomers"
          component={CustomerMasterScreen}
        />
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerMasterScreen}
        />
        <Stack.Screen
          name="CustomerLedger"
          component={CustomerMasterScreen}
        />

        <Stack.Screen
          name="SupplierMaster"
          component={SupplierMasterScreen}
        />
        <Stack.Screen
          name="Suppliers"
          component={SupplierMasterScreen}
        />
        <Stack.Screen
          name="Supplier"
          component={SupplierMasterScreen}
        />
        <Stack.Screen
          name="AllSuppliers"
          component={SupplierMasterScreen}
        />
        <Stack.Screen
          name="SupplierDetails"
          component={SupplierMasterScreen}
        />
        <Stack.Screen
          name="SupplierLedger"
          component={SupplierMasterScreen}
        /> 
        {/* ===================================== */}
        {/* PURCHASE */}
        {/* ===================================== */}

        <Stack.Screen
          name="PurchaseOrder"
          component={PurchaseOrderScreen}
        />

        <Stack.Screen
          name="AddPurchase"
          component={AddPurchaseScreen}
        />

        <Stack.Screen
          name="AllPurchases"
          component={AllPurchasesScreen}
        />

        <Stack.Screen
          name="PurchaseOrderHistory"
          component={PurchaseOrderHistoryScreen}
        />

        <Stack.Screen
          name="AllPurchaseOrders"
          component={PurchaseOrderHistoryScreen}
        />
        <Stack.Screen
          name="ViewPurchase"
          component={ViewPurchaseScreen}
        />
        <Stack.Screen
          name="View"
          component={ViewPurchaseScreen}
        />
        <Stack.Screen
          name="ViewPurchaseOrder"
          component={ViewPurchaseOrderScreen}
        />
        <Stack.Screen
          name="ViewPO"
          component={ViewPurchaseOrderScreen}
        />
      </Stack.Navigator>
    

    </NavigationContainer>
  );
};

export default AppNavigator;