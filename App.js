import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer, useNavigationContainerRef, } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { MainStackNavigator } from "./src/navigation/stackNavigator";
import { LogBox } from 'react-native';

const Stack = createStackNavigator();

export default function App() {
  const navRef = useNavigationContainerRef();
  LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]);
  return (
    <>
      <NavigationContainer>
        <MainStackNavigator />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#BAFFFD",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    color: "#2F2F2F",
    fontSize: 40,
    fontWeight: "bold",
    padding: 40,
    textAlign: "center",
  },
});
