import React, { useState } from "react";
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Image, } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { firebaseAuth, firebaseDB } from "../firebaseUtil/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";

import { Card } from "react-native-paper";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Checkbox from 'expo-checkbox';

const Profile = ({ navigation }) => {
  const [userType, setUserType] = useState("");
  const checkUserType = async () => { setUserType(await AsyncStorage.getItem("userType")); };
  const [det, setDet] = React.useState({});
  const [isChecked, setChecked] = React.useState(null);
  const [heightOfBox, setHeightOfBox] = React.useState(60);

  const isFocused = useIsFocused();
  React.useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (isFocused) {
      if (user) {
      getDoc(doc(firebaseDB, "users", user.uid)).then(async (snapshot) => {
        if (snapshot.exists()) {
          await setDet(snapshot.data());
          if(snapshot.data().userType == 'user'){
            await setChecked(snapshot.data().donor);
            await setHeightOfBox(70);
          } else { await setHeightOfBox(60);}
        } else {
          console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });
    }
  }
  }, [isFocused, firebaseAuth.currentUser]);

  const logOut = () => {
    if (firebaseAuth.currentUser) {
      signOut(firebaseAuth)
        .then(() => {
          navigation.navigate("Login");
        })
        .catch((error) => {
          alert(error);
        });
    } else navigation.navigate("Login");
  };

  async function changeChecked() {
    const oppositeChecked = !isChecked;
    await setChecked(oppositeChecked);
    await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), {
      donor: oppositeChecked,
    }); 
  }

  function details() {
      checkUserType();
      return (
        <View>
          <Card style={[styles.box, {height: `${heightOfBox}%`}]}>
            <Text style={styles.text}>Name: {det.name}</Text>
            <Text style={styles.text}>Email: {det.email}</Text>
            <Text style={styles.text}>Phone: {det.phone}</Text>
            <Text style={styles.text}>City: {det.city}</Text>
            {userType == "user" ? <Text style={styles.text}>{userType == "user" ? `Blood Group: ${det.bloodGroup}` : null}</Text>: null}
            <Text style={styles.text}>User Type: {(det.userType == 'user') ? 'User' : 'Responder'}</Text>
            {userType == "user" ? <View style={{flexDirection: 'row'}}>
              <Text style={[styles.text, {marginTop: 30}]}>Blood Donor: </Text>
              <Checkbox style={styles.checkbox} value={isChecked} onValueChange={() => {changeChecked()}} color={isChecked ? '#ff1616' : undefined}/>
            </View>: null}
          </Card>
        </View>
      );
  }
  return (
      <SafeAreaView style={styles.container}>
      <Image
        source={require("./assets/logo.png")}
        style={{
          position: "relative",
          margin: 40,
          width: 100,
          height: 100,
          resizeMode: 'contain',
        }}
      />
      {details()}
      <View style={styles.button}>
        <Text
          style={{
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
            textAlign: "left",
          }}
          onPress={logOut}
        >
          LOGOUT
        </Text>
      </View>
    </SafeAreaView>)
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#D8D9D0",
  },
  text: {
    color: "black",
    fontFamily: "Raleway",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "left",
    marginTop: 20,
  },
  button: {
    position: "absolute",
    borderRadius: 20,
    height: 50,
    bottom: 50,
    width: 150,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff1616",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  box: {
    borderRadius: 20,
    elevation: 3,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: "black",
    shadowOpacity: 0.3,
  },
  checkbox: {
    marginTop: 30,
    marginLeft: 10,
    height: 30,
    width: 30,
  },
});
