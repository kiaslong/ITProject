import { Pressable, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginForm from './screens/LoginScreen'; // Assuming LoginForm is in screens/LoginScreen.js
import RegisterForm from './screens/RegisterScreen'; // Assuming RegisterForm is in screens/RegisterScreen.js
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SupportScreen from './screens/SupportScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
        <HomeTabs/>
    </NavigationContainer>
  );
}
function AuthStack() {
  return (
    <Stack.Navigator
    initialRouteName="LoginForm"
    screenOptions={({ route }) => ({ 
      headerStyle: { backgroundColor: "#fff" },
      headerShown: route.params?.showBackButton ? true : false, 
      headerShadowVisible:false,
      title: null, 
      contentStyle: { flex: 1, backgroundColor: "#fff" },
      transitionSpec: { open: { animation: 'none' } }, 
      
    
    })}
  >
    <Stack.Screen
      name="LoginForm"
      component={LoginScreen}
      
    />
    <Stack.Screen
      name="RegisterForm"
      component={RegisterScreen}
      
    />
  </Stack.Navigator>
  );
}


function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Login') {
            iconName = focused ? 'person-circle-sharp' : 'person-circle-sharp';
          } else if (route.name === 'Support') {
            iconName = focused ? 'chatbubble-ellipses-outline' : 'chatbubble-ellipses-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#03a9f4',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, 
      })}
    >
      <Tab.Screen name="Home" component={SupportScreen} />
      <Tab.Screen name="Support" component={SupportScreen} />
      <Tab.Screen name="Login" component={AuthStack} />
      
    </Tab.Navigator>
  );
}