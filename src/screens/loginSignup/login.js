import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { firebaseAuth, firebaseDB } from "../../firebaseUtil/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { get, ref, update } from "firebase/database";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = ({ navigation }) => {
  const pwdRef = useRef();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [visible, setVisible] = React.useState(true);
  const [eye, setEye] = React.useState("eye");

  const changeVisibility = () => {
    setVisible(!visible);
    if (visible) setEye("eye-off");
    else setEye("eye");
  };

  const updateToken = async (userType, userName, userPhone, userEmail, city) => {
    const token = await AsyncStorage.getItem("pushToken");
    await AsyncStorage.setItem("userType", userType);
    await AsyncStorage.setItem("userName", userName);
    await AsyncStorage.setItem("userPhone", userPhone);
    await AsyncStorage.setItem("userEmail", userEmail);
    await AsyncStorage.setItem("userCity", city);
    await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), {
      pushToken: token,
    });
  };

  const submitForm = () => {
    //console.log(email, password)
    if (email == "" || password == "") setError("Please fill all the fields");
    else {
      signInWithEmailAndPassword(firebaseAuth, email, password)
        .then(async (userCredential) => {
          await getDoc(doc(firebaseDB, "users", userCredential.user.uid)).then((snapshot) => {
              if (snapshot.exists()) {
                const userType = snapshot.data().userType;
                const userName = snapshot.data().name;
                const userPhone = snapshot.data().phone;
                const userEmail = snapshot.data().email;
                const city = snapshot.data().city;
                updateToken(userType, userName, userPhone, userEmail, city);
                navigation.navigate("Home", { routeName: "Dashboard" });
              } else console.log("No data available");
            });
        })
        .catch((error) => {
          if (error.code == "auth/user-not-found") setError("User not found");
          if (
            error.code == "auth/invalid-email" ||
            error.code == "auth/wrong-password"
          )
            setError("Invalid Email/Password");
          else setError(error.message);
          console.log(error.message);
        });
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <Image
        source={require("../assets/logo.png")}
        style={{ margin: 20, maxWidth: 250, resizeMode: "contain" }}
      />
      <View style={styles.emailField}>
        <TextInput
          autoCapitalize="none"
          returnKeyType="next"
          onChangeText={(text) => {
            setEmail(text);
          }}
          onSubmitEditing={() => {
            pwdRef.current.focus();
          }}
          style={{ opacity: 0.4, fontWeight: "bold", color: "black" }}
          placeholderTextColor="#4A4A4A"
          textContentType="emailAddress"
          placeholder="Email Address"
        />
      </View>
      <View style={styles.passField}>
        <TextInput
          autoCapitalize="none"
          onChangeText={(text) => {
            setPassword(text);
          }}
          ref={pwdRef}
          style={{ opacity: 0.4, fontWeight: "bold", width: "100%" }}
          placeholderTextColor="#4A4A4A"
          secureTextEntry={visible}
          textContentType="text"
          placeholder="Password"
        />
        <TouchableOpacity onPress={changeVisibility}>
          <MaterialCommunityIcons
            name={eye}
            style={{ right: "100%" }}
            size={24}
            color="#4A4A4A"
          />
        </TouchableOpacity>
      </View>
      <View style={styles.loginBar}>
        <View style={styles.button}>
          <TouchableOpacity style={styles.button} onPress={submitForm}>
            <Text style={{color:'white', fontWeight: "bold", fontSize: 20 }}>Login</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Register");
            }}
          >
            <Text style={{ fontWeight: "bold", fontSize: 14 }}>
              Don't have an account? Register now.
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={{
              fontWeight: "bold",
              fontSize: 14,
              color: "red",
              textAlign: "center",
            }}
          >
            {error}
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    color: "black",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#D8D9D0",
  },
  loginBar: {
    marginBottom: 50,
    paddingHorizontal: 20,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  emailField: {
    marginBottom: 10,
    borderRadius: 25,
    width: "80%",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 20,
    justifyContent: "center",
    textAlign: "left",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  passField: {
    borderRadius: 25,
    width: "80%",
    backgroundColor: "#fff",
    height: 50,
    paddingHorizontal: 20,
    textAlign: "left",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    flexDirection: "row",
  },
  button: {
    borderRadius: 20,
    height: 50,
    margin: 10,
    width: 150,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff1616",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});

export default Login;
