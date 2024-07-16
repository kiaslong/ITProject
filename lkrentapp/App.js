import React, { useEffect, useCallback, useMemo,useState } from "react";
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./store/store";
import SupportScreen from "./supportStackScreen/SupportScreen";
import CompanyInformationScreen from "./supportStackScreen/CompanyInformationScreen";
import FAQScreen from "./supportStackScreen/FAQScreen";
import PolicyScreen from "./supportStackScreen/PolicyScreen";
import LoginScreen from "./authStackScreen/LoginScreen";
import RegisterScreen from "./authStackScreen/RegisterScreen";
import HistoryScreen from "./historyStackScreen/HistoryScreen";
import { enableScreens } from 'react-native-screens';
import HomeScreen from "./homeStackScreen/HomeScreen";
import NotiScreen from "./notiStackScreen/NotificationScreen";
import LocationPickerScreen from "./homeStackScreen/LocationPickerScreen";
import TimePickerScreen from "./homeStackScreen/TimePickerScreen";
import SettingScreen from "./settingStackScreen/SettingScreen";
import UserInfoScreen from "./settingStackScreen/UserInfoScreen";
import RegisterCarScreen from "./settingStackScreen/RegisterCarScreen";
import UserRegisterCarScreen from "./settingStackScreen/UserRegisterCarScreen";
import ChangePasswordScreen from "./settingStackScreen/ChangePasswordScreen";
import ReferFriendScreen from "./settingStackScreen/ReferFriendScreen";
import GiftScreen from "./settingStackScreen/GiftScreen";
import DetailGift from "./settingStackScreen/DetailGift";
import DrivingLicenseScreen from "./settingStackScreen/DrivingLicenseScreen";
import MyAddressesScreen from "./settingStackScreen/MyAddressesScreen";
import DetailMyAddressesScreen from "./settingStackScreen/DetailMyAddressesScreen";
import FavoriteCarsScreen from "./settingStackScreen/FavoriteCarsScreen";
import EditUserInfoScreen from "./settingStackScreen/EditUserInfoScreen";
import SearchScreen from "./homeStackScreen/SearchingScreen";
import CarRentalInfoScreen from "./homeStackScreen/CarRentalInfoScreen";
import CarRentalOrderScreen from "./homeStackScreen/CarRentalOrderScreen";
import Header from "./components/Header";
import { StatusBar } from 'expo-status-bar';
import ChangeLocationTimeScreen from "./homeStackScreen/ChangeLocationTimeScreen";
import CarDetailScreen from './homeStackScreen/CarDetailScreen';
import ConfirmationScreen from "./homeStackScreen/CarOrderComponent/PlaceHolderComponent";
import FullscreenMapComponent from "./homeStackScreen/CarConfirmComponent/FullScreenLocationComponent";
import PaymentMethodScreen from "./homeStackScreen/PaymentMethodScreen";
import PhoneVerificationScreen from "./settingStackScreen/VerifyingScreen/PhoneVerificationScreen";
import { fetchInitialLocation } from './store/locationSlice';
import { getToken, removeToken } from './utils/tokenStorage';
import { loginSuccess, logout } from './store/loginSlice'; 
import api from "./api";
import OtpEntryScreen from "./settingStackScreen/VerifyingScreen/OtpEntryScreen";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

enableScreens();

const App = () => {

  const [loading, setLoading] = useState(true);

 
  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      let timeoutId;

      if (token) {
        try {
          timeoutId = setTimeout(async () => {
            alert('Phiên đăng nhập đã hết hạn');
            await removeToken();
            setLoading(false);
          }, 2000); // Set your desired timeout duration in milliseconds

          const response = await api.get('/auth/info', {
            headers: {
              Authorization: token,
            },
          });

          clearTimeout(timeoutId); // Clear the timeout if the request completes within the time limit
          store.dispatch(loginSuccess({ user: response.data }));
        } catch (error) {
          clearTimeout(timeoutId);
          console.error('Token validation failed:', error);
          store.dispatch(logout()); // Dispatch logout if there's an error in validation
        }
      }

      setLoading(false);
    };

    checkToken();
  }, [store.dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#03a9f4" />
      </View>
    ); // Show loading spinner while checking token
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <NavigationContainer>
          <RootStack />
          <StatusBar style="dark" />
        </NavigationContainer>
      </Provider>
    </GestureHandlerRootView>
  );
};

const RootStack = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchInitialLocation());
  }, [dispatch]);

  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },

  }), []);

  return (
    <Stack.Navigator initialRouteName="Main" screenOptions={commonScreenOptions }>
      <Stack.Screen name="Main" component={HomeTabs}  />
      <Stack.Screen name="Searching" component={SearchScreen} />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="CarRentalOrder" component={CarRentalOrderScreen} options={{gestureEnabled:false}}/>
      <Stack.Screen name="ConfirmationScreen" component={ConfirmationScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="Payment" component={PaymentMethodScreen} options={{gestureEnabled:false}} />


      <Stack.Screen name="ChangeTimeLocation" component={ChangeLocationTimeScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen}  />
      <Stack.Screen name="RegisterCarScreen" component={RegisterCarScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="UserRegisterCarScreen" component={UserRegisterCarScreen} />
      <Stack.Screen name="PhoneVerificationScreen" component={PhoneVerificationScreen}  options={{gestureEnabled:false}} />
      <Stack.Screen name="OtpEntry" component={OtpEntryScreen}  options={{gestureEnabled:false}} />
      
      <Stack.Screen name="TimePicker" component={TimePickerScreen} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="DrivingLicenseScreen" component={DrivingLicenseScreen}  />
      <Stack.Screen name="CarRentalInfoScreen" component={CarRentalInfoScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="FullMapScreen" component={FullscreenMapComponent} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="Home" screenOptions={commonScreenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} />
     
     
    </Stack.Navigator>
  );
};

const NotiStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="NotiHome" screenOptions={commonScreenOptions}>
      <Stack.Screen name="NotiHome" component={NotiScreen} initialParams={{ showHeader: true, showBackButton: false, showTitle: true, showSearchBar: false, screenTitle: "Thông báo" }} />
    </Stack.Navigator>
  );
};

const HistoryStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="HistoryHome" screenOptions={commonScreenOptions}>
      <Stack.Screen name="HistoryHome" component={HistoryScreen} initialParams={{ showHeader: true, showBackButton: false, showTitle: true, showSearchBar: false, screenTitle: "Chuyến của tôi" }} />
    </Stack.Navigator>
  );
};

const SupportStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="SupportHome" screenOptions={commonScreenOptions}>
    <Stack.Screen name="SupportHome" component={SupportScreen} initialParams={{ showHeader: true, showBackButton: false, showTitle: true, showSearchBar: false, screenTitle: "Trung tâm hỗ trợ" }} />
    <Stack.Screen name="CompanyInformationScreen" component={CompanyInformationScreen} />
    <Stack.Screen name="FAQScreen" component={FAQScreen} />
    <Stack.Screen name="PolicyScreen" component={PolicyScreen} />
    </Stack.Navigator>
  );
};

const SettingStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="SettingHome" screenOptions={commonScreenOptions}>
      <Stack.Screen name="SettingHome" component={SettingScreen} />
      <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
      <Stack.Screen  name="EditUserInfoScreen" component={EditUserInfoScreen} options={{gestureEnabled:false}} />
      <Stack.Screen name="ChangePasswordScreen" component={ChangePasswordScreen} />
      <Stack.Screen name="ReferFriendScreen" component={ReferFriendScreen} />
      <Stack.Screen name="GiftScreen" component={GiftScreen} />
      <Stack.Screen name="DetailGift" component={DetailGift} />
      <Stack.Screen name="MyAddressesScreen" component={MyAddressesScreen} />
      <Stack.Screen name="DetailMyAddressesScreen" component={DetailMyAddressesScreen} />
      <Stack.Screen name="FavoriteCarsScreen" component={FavoriteCarsScreen} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  const commonScreenOptions = useCallback(({ route }) => ({
    header: () => (
      <Header
        showTitle={route.params?.showTitle}
        showBackButton={route.params?.showBackButton}
        showSearchBar={route.params?.showSearchBar}
        showCloseButton={route.params?.showCloseButton}
        showIcon={route.params?.showIcon}
        iconName={route.params?.iconName}
        screenTitle={route.params?.screenTitle}
        functionName={route.params?.functionName}
        customGoBackRoute={route.params?.customGoBackRoute}
        customData1={route.params?.customData1}
        customData2={route.params?.customData2}
        customData3={route.params?.customData3}
      />
    ),
    headerStyle: { backgroundColor: "#fff" },
    headerShown: route.params?.showHeader ? true : false,
    contentStyle: { flex: 1, backgroundColor: "#fff" },
    animation: route.params?.animationType,
    transitionSpec: {
      open: { animation: "timing", config: { duration: 100 } },
      close: { animation: "timing", config: { duration: 100 } },
    },
  }), []);

  return (
    <Stack.Navigator initialRouteName="LoginScreen" screenOptions={commonScreenOptions}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} initialParams={{ showHeader: true, showBackButton: false, showTitle: true, showSearchBar: false, screenTitle: "Đăng nhập" }} />
    </Stack.Navigator>
  );
};

const HomeTabs = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn.isLoggedIn);

  const getTabBarIcon = useCallback((routeName, focused, color, size) => {
    let iconName;

    switch (routeName) {
      case "Đăng nhập":
      case "Cá nhân":
        iconName = "person-circle-sharp";
        break;
      case "Hỗ trợ":
        iconName = "chatbubble-ellipses-outline";
        break;
      case "Chuyến":
        iconName = "car-sport-outline";
        break;
      case "Khám phá":
        iconName = "home-outline";
        break;
      case "Thông báo":
        iconName = "notifications-outline";
        break;
      default:
        iconName = "circle";
    }

    return <Ionicons name={iconName} size={size} color={color} />;
  }, []);

  const screenOptions = useMemo(
    () => ({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route.name, focused, color, size),
      tabBarActiveTintColor: "#03a9f4",
      tabBarInactiveTintColor: "gray",
      tabBarHideOnKeyboard: true,
      headerShown: false,
    }),
    [getTabBarIcon]
  );

  return (
    <Tab.Navigator screenOptions={screenOptions} >
      <Tab.Screen name="Khám phá" component={HomeStack} options={{detachInactiveScreens:true}}/>
      <Tab.Screen name="Thông báo" component={NotiStack} options={{detachInactiveScreens:true}}/>
      <Tab.Screen name="Chuyến" component={HistoryStack} options={{detachInactiveScreens:true}}/>
      <Tab.Screen name="Hỗ trợ" component={SupportStack} options={{detachInactiveScreens:true}}/>
      <Tab.Screen name={isLoggedIn ? "Cá nhân" : "Đăng nhập"} component={isLoggedIn ? SettingStack : AuthStack} options={{detachInactiveScreens:true}} />
    </Tab.Navigator>
  );
};

export default App;
