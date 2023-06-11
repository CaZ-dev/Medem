import React from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { firebaseAuth, firebaseDB } from "../../firebaseUtil/config";
import { TouchableWithoutFeedback, Keyboard } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const EditResource = ({ route, navigation }) => {
  const { index, name, type, availableResources } = route.params;
  const [dataArray, setDataArray] = React.useState({name: name,type: type});
  const [nameField, setNameField] = React.useState(name);
  const [typeField, setTypeField] = React.useState(type);

  function saveResource() {
    let newObj = {name: nameField, type: typeField};
    setDataArray(newObj);
    availableResources[index] = newObj;
    const user = firebaseAuth.currentUser;
    if (user) {
      console.log(availableResources);
      updateDoc(doc(firebaseDB, "users", user.uid), {
        availableResources: availableResources,
      }).catch((error) => {
        console.log(error);
      });
      navigation.navigate("Available Resources");
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        backgroundColor: "#D8D9D0",
      }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAwareScrollView
          style={{ backgroundColor: "#D8D9D0" }}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
          scrollEnabled={false}
        >
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Text style={styles.text}>Edit Resource</Text>
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.textField}>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.fieldDesc}>Name: </Text>
                <TextInput
                  value={nameField}
                  onChangeText={(text) => {
                    setNameField(text);
                  }}
                  style={{
                    opacity: 1,
                    fontWeight: "bold",
                    color: "black",
                  }}
                  placeholderTextColor="#4A4A4A"
                  textContentType="none"
                  placeholder="Name of Resource"
                />
              </View>
            </View>
            <View style={styles.textField}>
              <View
                style={{
                  flexWrap: "wrap",
                  flexDirection: "row",
                }}
              >
                <Text style={styles.fieldDesc}>Type: </Text>
                <TextInput
                  value={typeField}
                  onChangeText={(text) => {
                    setTypeField(text);
                  }}
                  style={{
                    opacity: 1,
                    fontWeight: "bold",
                    color: "black",
                  }}
                  placeholderTextColor="#4A4A4A"
                  placeholder="Type of Resource"
                />
              </View>
            </View>
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#8F8F8F" }]}
              onPress={() => {
                navigation.navigate("Available Resources");
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: "#ff1616" }]}
              onPress={() => {
                saveResource();
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 20 }}>
                Save Changes
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default EditResource;

const styles = StyleSheet.create({
  text: {
    top: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  container: {
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#D8D9D0",
  },
  textField: {
    flexWrap: "wrap",
    marginBottom: 20,
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#fff",
    paddingRight: 20,
    justifyContent: "space-between",
    textAlign: "left",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  fieldDesc: {
    paddingLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  button: {
    borderRadius: 20,
    height: 50,
    margin: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
});
