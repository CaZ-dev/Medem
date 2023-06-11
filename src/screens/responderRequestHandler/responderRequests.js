import * as React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { firebaseAuth, firebaseDB, firebaseStorage } from "../../firebaseUtil/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import { get } from "firebase/database";

const ResponderRequests = ({ navigation }) => {

const isFocused = useIsFocused();
const [currentRequests, setCurrentRequests] = React.useState([]);
// const [availableResources, setAvailableResources] = React.useState([]);
// const [city, setCity] = React.useState("");

React.useEffect(() => {
  if(isFocused) {
    console.log("Entered first function block");
    getDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid)).then(async (snap) => {
      if (snap.exists()) {
        let data = snap.data();
        console.log("data set")
        // await setAvailableResources(data.availableResources);
        // await setCity(data.city);
        await setPendingRequests(data.availableResources, data.city);
      };
    
    });
}}, [isFocused]);

async function setPendingRequests(availableResources, city) {
  let pendingRequests = [];
  for (let i = 0; i < availableResources.length; i++) {
    const resource = availableResources[i];
    await getDoc(doc(firebaseDB, "requests", city, resource.name, resource.type)).then(async (snap) => {
      if (snap.exists()) {
        let data = snap.data().requests;
        updateArray(data);
      }
    });
  }
  if(pendingRequests.length > 0 || currentRequests.length > 0) {
    await setCurrentRequests(pendingRequests);
  }
  function updateArray(data) {
    for (let i = 0; i < data.length; i++) {
      if(data[i].status === "Pending") {
        pendingRequests.push(data[i]);
    }
  }}
}

function renderResource() {
    let renderArray = [];
    if (currentRequests.length == 0) {
      return (
        <View style={styles.noResource}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            No requests available.
          </Text>
        </View>
      );
    }
    currentRequests.map((item, index) => {
      renderArray.push(
        <View style={styles.itemView} key={index}>
          <View style={styles.firstRow}>
              <Text style={styles.nameText}>Name: {item.name}</Text>
              <Text style={styles.nameText}>Type: {item.type}</Text>
            </View>
            <View
              style={{
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={styles.secondRow}>
                <Text style={[styles.nameText]}>Quantity: {item.quantity}</Text>
                <Text style={styles.nameText}>Status: {item.status}</Text>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("ResponderRequestDetails", {
                      index: index,
                      name: item.name,
                      type: item.type,
                      quantity: item.quantity,
                      status: item.status,
                      description: item.description,
                      imageURL: item.imageURL,
                      imageStorageRef: item.imageStorageRef,
                      location: item.location,
                      city: item.city,
                      uid: item.user,
                      currentRequests: currentRequests,
                    });
                  }}
                  style={styles.button}
                >
                  <Text style={{paddingTop: 5}}>View</Text>
                  <Ionicons name="arrow-forward" size={28} color="black" />
                </TouchableOpacity>
              </View>
            </View>
        </View>
      )
    });
    return renderArray;
  }


  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0"}}>
      <ScrollView style={{ flexDirection: "row", }} >
        {renderResource()}
      </ScrollView>
    </SafeAreaView>
  );
}

export default ResponderRequests;

const styles = StyleSheet.create({
  container: {
    color: "black",
    justifyContent: "center",
    alignContent: "center",
    flexDirection: "column",
    flex: 1,
    backgroundColor: "#D8D9D0",
  },
  itemView: {
    margin: 10,
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  firstRow: {
    paddingTop: 5,
    paddingLeft: 10,
    flexDirection: "row",
  },
  secondRow: {
    paddingLeft: 10,
    paddingTop: 15,
    paddingBottom: 5,
    flexDirection: "row",
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 2,
    paddingRight: 10,
  },
  button: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingBottom: 10,
  },
  noResource: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});