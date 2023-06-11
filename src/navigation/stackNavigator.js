import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigationContainerRef } from "@react-navigation/native";

import Login from "../screens/loginSignup/login";
import Register from "../screens/loginSignup/register";
import SplashScreen from "../screens/splashScreen";
import ProfileSetup from "../screens/loginSignup/profileSetup";
import MainContainer from "./MainContainer";
import Profile from "../screens/profileScreen";
import EditResource from "../screens/availableResources/editResource";
import NewResource from "../screens/availableResources/newResource";
import NewRequest from "../screens/userRequestHandler/newRequest";
import UserRequestDetails from "../screens/userRequestHandler/userRequestDetails";
import WebViewPage from "../screens/assets/utils/webView";
import ResponderRequestDetails from "../screens/responderRequestHandler/responderRequestDetails";
import FindNearbyPage from "../screens/findNearby/findNearby";
import FindNearbyDetails from "../screens/findNearby/findNearbyDetails";

const Stack = createStackNavigator();

const MainStackNavigator = () => {
  const navigation = useNavigationContainerRef()
  return (
    <Stack.Navigator>
      <Stack.Screen options={{ headerShown: false }} name="SplashScreen" component={SplashScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="Register" component={Register} />
      <Stack.Screen options={{ headerShown: false }} name="ProfileSetup" component={ProfileSetup} />
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }}name="Home" component={MainContainer}/>
      <Stack.Screen options={{ headerShown: false }}name="Profile" component={Profile}/>
      <Stack.Screen name="EditResource" component={EditResource}/>
      <Stack.Screen name="NewResource" component={NewResource}/>
      <Stack.Screen name="NewRequest" component={NewRequest}/>
      <Stack.Screen name="UserRequestDetails" component={UserRequestDetails}/>
      <Stack.Screen name="ResponderRequestDetails" component={ResponderRequestDetails}/>
      <Stack.Screen name="WebViewPage" component={WebViewPage}/>
      <Stack.Screen name="FindNearbyPage" component={FindNearbyPage}/>
      <Stack.Screen name="FindNearbyDetails" component={FindNearbyDetails}/>
    </Stack.Navigator>
  );
};

export { MainStackNavigator };