import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import HomeScreen from "../screens/homeScreen";
import UserRequests from "../screens/userRequestHandler/userRequests";
import ResponderRequests from "../screens/responderRequestHandler/responderRequests";
import ProfileScreen from "../screens/profileScreen";
import AvailableResources from "../screens/availableResources/availableResources";
import AsyncStorage from "@react-native-async-storage/async-storage";

const homeName = "Dashboard";
const requestName = "Requests";
const profilesName = "Profile";
const availableResources = "Available Resources";

const Tab = createBottomTabNavigator();

function MainContainer({ route, navigation }) {
  const [userType, setUserType] = React.useState("");
  const checkUserType = async () => {
    setUserType(await AsyncStorage.getItem("userType"));
  };
  const { routeName } = route.params;
  const isResponder = () => {
    checkUserType();
    if (userType == "responder")
      return (
        <Tab.Screen
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#ff1616" },
            headerTintColor: "white",
            headerTitle: { fontSize: 20, fontWeight: "bold" },
          }}
          name={availableResources}
          component={AvailableResources}
        />
      );
    else return null;
  };

  const requestPage = () => {
    checkUserType();
    if (userType == "user") {
      return (
        <Tab.Screen
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#ff1616" },
            headerTintColor: "white",
            headerTitle: { fontSize: 20, fontWeight: "bold" },
          }}
          name={requestName}
          component={UserRequests}
        />
      );
    } else if (userType == "responder") {
      return (
        <Tab.Screen
          options={{
            headerShown: true,
            headerStyle: { backgroundColor: "#ff1616" },
            headerTintColor: "white",
            headerTitle: { fontSize: 20, fontWeight: "bold" },
            headerRight: () => {},
          }}
          name={requestName}
          component={ResponderRequests}
        />
      );
    }
  };

  return (
    <Tab.Navigator
      initialRouteName={routeName}
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#520000",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: { fontSize: 10 },
        tabBarStyle: [
          {
            display: "flex",
            paddingTop: 10,
            backgroundColor: "#ff1616",
          },
          null,
        ],
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;

          if (rn === homeName) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === requestName) {
            iconName = focused
              ? "checkmark-circle"
              : "checkmark-circle-outline";
          } else if (rn === profilesName) {
            iconName = focused ? "person" : "person-outline";
          } else if (rn === availableResources) {
            iconName = focused ? "list" : "list-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        options={{
          headerShown: false,
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          gestureEnabled: false
        }}
        name={homeName}
        component={HomeScreen}
      />
      {requestPage()}
      {isResponder()}
      <Tab.Screen
        options={{ headerShown: false }}
        name={profilesName}
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
}

export default MainContainer;
