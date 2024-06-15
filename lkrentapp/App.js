import React from "react";
import { Image, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Provider, useSelector } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import store from "./store/store";
import SupportScreen from "./supportStackScreen/SupportScreen";
import LoginScreen from "./authStackScreen/LoginScreen";
import RegisterScreen from "./authStackScreen/RegisterScreen";
import HistoryScreen from "./historyStackScreen/HistoryScreen";

import HomeScreen from "./homeStackScreen/HomeScreen";
import NotiScreen from "./notiStackScreen/NotificationScreen";
import LocationPickerScreen from "./homeStackScreen/LocationPickerScreen";
import TimePickerScreen from "./homeStackScreen/TimePickerScreen";

import SettingScreen from "./settingStackScreen/SettingScreen";
import UserInfoScreen from "./settingStackScreen/UserInfoScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <HomeTabs />
      </NavigationContainer>
    </Provider>
  );
}

const commonScreenOptions = ({ route }) => ({
  headerStyle: { backgroundColor: "#fff" },
  headerShown: route.params?.showBackButton ? true : false,
  headerShadowVisible: false,
  headerBackTitle: "Back",
  title: null,
  contentStyle: { flex: 1, backgroundColor: "#fff" },
  transitionSpec: {
    open: { animation: "timing", config: { duration: 300 } },
    close: { animation: "timing", config: { duration: 300 } },
  },
});

const HomeStack = () => (
  <Stack.Navigator initialRouteName="Home" screenOptions={commonScreenOptions}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
    <Stack.Screen name="TimePicker" component={TimePickerScreen} />
  </Stack.Navigator>
);

const NotiStack = () => (
  <Stack.Navigator
    initialRouteName="NotiHome"
    screenOptions={commonScreenOptions}
  >
    <Stack.Screen name="NotiHome" component={NotiScreen} />
  </Stack.Navigator>
);

const HistoryStack = () => (
  <Stack.Navigator
    initialRouteName="HistoryHome"
    screenOptions={commonScreenOptions}
  >
    <Stack.Screen name="HistoryHome" component={HistoryScreen} />
  </Stack.Navigator>
);

const SupportStack = () => (
  <Stack.Navigator
    initialRouteName="SupportHome"
    screenOptions={commonScreenOptions}
  >
    <Stack.Screen name="SupportHome" component={SupportScreen} />
  </Stack.Navigator>
);

const SettingStack = () => (
  <Stack.Navigator
    initialRouteName="SettingHome"
    screenOptions={commonScreenOptions}
  >
    <Stack.Screen name="SettingHome" component={SettingScreen} />
    <Stack.Screen name="UserInfoScreen" component={UserInfoScreen} />
  </Stack.Navigator>
);

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="LoginScreen"
    screenOptions={commonScreenOptions}
  >
    <Stack.Screen name="LoginScreen" component={LoginScreen} />
    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
  </Stack.Navigator>
);

const HomeTabs = () => {
  const isLoggedIn = useSelector((state) => state.loggedIn.isLoggedIn);

  const getTabBarIcon = (routeName, focused, color, size) => {
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
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) =>
          getTabBarIcon(route.name, focused, color, size),
        tabBarActiveTintColor: "#03a9f4",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Khám phá" component={HomeStack} />
      <Tab.Screen name="Thông báo" component={NotiStack} />
      <Tab.Screen name="Chuyến" component={HistoryStack} />
      <Tab.Screen name="Hỗ trợ" component={SupportStack} />
      <Tab.Screen
        name={isLoggedIn ? "Cá nhân" : "Đăng nhập"}
        component={isLoggedIn ? SettingStack : AuthStack}
      />
    </Tab.Navigator>
  );
};
