import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, Dimensions, FlatList, } from "react-native";
import React, { useState } from "react";
import { get, update, ref } from "firebase/database";
import { useIsFocused } from "@react-navigation/native";
import { firebaseAuth, firebaseDB } from "../firebaseUtil/config";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import apps from "../screens/assets/consts/apps";
import * as Location from 'expo-location';
import AsyncStorage from "@react-native-async-storage/async-storage";


const Home = ({ navigation }) => {
  const Card = ({ app }) => {
    return (
    <TouchableOpacity onPress={() => {navigation.navigate('FindNearbyPage', {name: app.keyword, latitude: latitude, longitude: longitude})}}>
      <View style={styles.card}>
        <View style={{ height: 50, flex: 1, alignItems: "center", }} >
          <Image source={app.img} style={{ flex: 1, resizeMode: "contain" }} />
          <Text style={{ marginTop: 5 }}>{app.about}</Text>
        </View>
      </View>
    </TouchableOpacity>
    );
  };
  
  const userType = AsyncStorage.getItem("userType"); //userType is 'user' or 'responder'
  const [det, setDet] = React.useState({});
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (isFocused) {
      if (user) {
        getDoc(doc(firebaseDB, "users", user.uid))
          .then(async (snapshot) => {
            if (snapshot.exists()) {
              await setDet(snapshot.data());
            } else {
              console.log("No data available");
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status == 'granted') {
            let {coords} = await Location.getCurrentPositionAsync();
                if (coords) {
                  const { latitude, longitude } = coords;
                  await setLatitude(latitude);
                  await setLongitude(longitude);
                }
              }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
  }, [isFocused, firebaseAuth.currentUser]);

  return (
    <View
      style={{
        backgroundColor: "#D8D9D0",
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: "red",
          height: "20%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 35,
            width: "100%",
          }}
        >
          <View style={{ width: "70%", paddingTop: 20 }}>
            <Text
              style={{
                fontSize: 20,
                color: "#FFF",
                fontWeight: "400",
              }}
            >
              Hello,
            </Text>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
              }}
            >
              {det.name} 👋
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.cardContainer}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Text
            style={{
              flex: 1,
              marginTop: 40,
              marginLeft: 10,
              fontWeight: "300",
            }}
          >
            Schedule an e-visit and discuss the plan with the doctor
          </Text>
          <Image
            style={styles.imageStyle}
            source={require("../screens/assets/3568984.jpg")}
          />
        </View>
      </View>
      <Text style={{ margin: 15, fontSize: 24, fontWeight: "500", }} >
        What do you need?
      </Text>
      <FlatList
        columnWrapperStyle={{ justifyContent: "space-between" }}
        scrollEnabled={false}
        contentContainerStyle={{
          marginTop: 10,
          paddingBottom: 50,
        }}
        numColumns={3}
        data={apps}
        renderItem={({ item }) => {
          return <Card app={item} />;
        }}
      />
    </View>
  );
};

export default Home;
const deviceWidth = Math.round(Dimensions.get("window").width);
const styles = StyleSheet.create({
  text: {
    color: "black",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 20,
  },
  cardContainer: {
    width: deviceWidth - 40,
    marginTop: 20,
    marginLeft: 20,
    backgroundColor: "#FFF",
    height: 150,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.75,
    elevation: 3,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  imageStyle: {
    marginTop: 15,
    alignContent: "flex-end",
    height: 100,
    width: deviceWidth - 70,
    borderTopRightRadius: 20,
    flex: 1,
  },
  card: {
    flex: 1,
    height: 140,
    backgroundColor: "#FFF",
    width: deviceWidth / 3 - 20,
    marginHorizontal: 10,
    borderRadius: 10,
    marginBottom: 20,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.35,
    elevation: 1,
    shadowOffset: {
      width: 1,
      height: 1,
    },
  },
});
