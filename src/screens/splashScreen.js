import React, { useState, useEffect } from "react";
import { SafeAreaView, ActivityIndicator,  Text,  View,  StyleSheet, Image } from "react-native";
import { firebaseAuth } from "../firebaseUtil/config";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from "expo-notifications";
import * as Device from 'expo-device';
import { useFonts, loadAsync} from "expo-font";

const pushToken = ""
 
const SplashScreen = ({ navigation }) => {
  const [animating, setAnimating] = useState(true);
  registerForPushNotificationsAsync = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
      await AsyncStorage.setItem('pushToken', `${token}`);
    } else {
      //alert('Must use physical device for Push Notifications');
    }
  
    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  };
    useEffect(() => {
     async function checkIfLoggedIn() {
        setAnimating(false);
        const userType = await AsyncStorage.getItem('userType')
        if(firebaseAuth.currentUser){
          Notifications.addNotificationResponseReceivedListener(navigation.navigate("Home", {routeName: "Requests"}));
          navigation.replace('Home', {userType: userType})
        }
        else{
          navigation.replace('Login')
        }
      }
      setTimeout(() => {
        registerForPushNotificationsAsync();
        checkIfLoggedIn();
        const loadFonts = async () => { loadAsync({
          "Raleway": require("./assets/fonts/Raleway-Regular.ttf"),
        }); };
        loadFonts();
      }, 3000);
      
  }, []);
 
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#D8D9D0" }}
    >
      <View style={styles.container}>
      <Image source={require('./assets/logo.png')} style={{position:'relative', margin: 20, maxWidth: 250, resizeMode: 'contain'}}/>
      <Text
        style={{
          fontSize: 36,
          textAlign: "center",
          color: "black",
          fontWeight: "bold",
        }}
      >
        MedEm
      </Text>
        <ActivityIndicator
          animating={animating}
          
          color="#ff1616"
          size="large"
          style={styles.activityIndicator}
        />
      </View>
      
    </SafeAreaView>
  );
};
 
export default SplashScreen;
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  activityIndicator: {
    alignItems: "center",
    height: 80,
  },
});