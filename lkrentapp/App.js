import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SupportScreen from "./supportStackScreen/SupportScreen";
import LoginScreen from "./authStackScreen/LoginScreen";
import RegisterScreen from "./authStackScreen/RegisterScreen";
import HistoryScreen from "./historyStackScreen/HistoryScreen";
import SettingScreen from "./settingStackScreen/SettingScreen";
import HomeScreen from "./homeStackScreen/HomeScreen";
import NotiScreen from "./notiStackScreen/NotificationScreen";
import LocationPickerScreen from "./homeStackScreen/LocationPickerScreen";
import TimePickerScreen from "./homeStackScreen/TimePickerScreen";

import { useSelector } from "react-redux";
import store from "./store/store";

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


function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="LocationPicker" component={LocationPickerScreen} />
      <Stack.Screen name="TimePicker" component={TimePickerScreen} />
    </Stack.Navigator>
  );
}

function NotiStack() {
  return (
    <Stack.Navigator
      initialRouteName="NotiHome"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="NotiHome" component={NotiScreen} />
    </Stack.Navigator>
  );
}



function HistoryStack() {
  return (
    <Stack.Navigator
      initialRouteName="HistoryHome"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="HistoryHome" component={HistoryScreen} />
    </Stack.Navigator>
  );
}


function SupportStack() {
  return (
    <Stack.Navigator
      initialRouteName="SupportHome"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="SupportHome" component={SupportScreen} />
    </Stack.Navigator>
  );
}



function SettingStack() {
  return (
    <Stack.Navigator
      initialRouteName="SettingHome"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="SettingHome" component={SettingScreen} />
    </Stack.Navigator>
  );
}



function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: "#fff" },
        headerShown: route.params?.showBackButton ? true : false,
        headerShadowVisible: false,
        title: null,
        contentStyle: { flex: 1, backgroundColor: "#fff" },
        transitionSpec: { open: { animation: "none" } },
      })}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
    </Stack.Navigator>
  );
}



function HomeTabs() {
  const isLoggedIn = useSelector((state) => state.loggedIn.isLoggedIn);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Đăng nhập") {
            iconName = focused ? "person-circle-sharp" : "person-circle-sharp";
          } else if (route.name === "Cá nhân") {
            iconName = focused ? "person-circle-sharp" : "person-circle-sharp";
          } else if (route.name === "Hỗ trợ") {
            iconName = focused
              ? "chatbubble-ellipses-outline"
              : "chatbubble-ellipses-outline";
          } else if (route.name === "Chuyến") {
            iconName = focused ? "car-sport-outline" : "car-sport-outline";
          } else if (route.name === "Khám phá"){
            iconName = focused ? "home-outline" : "home-outline"
          } else if (route.name === "Thông báo"){
            iconName = focused ? "notifications-outline" : "notifications-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
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
}
