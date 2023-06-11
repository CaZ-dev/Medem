import * as React from "react";
import { SafeAreaView, ScrollView, View, Text, StyleSheet, TouchableOpacity} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { firebaseAuth, firebaseDB, firebaseStorage } from "../../firebaseUtil/config";
import * as store from 'firebase/storage';
import { Button } from "react-native-paper";
import { deleteObject } from "firebase/storage";
import { arrayRemove, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const UserRequests = ({ navigation }) => {
  const [currentRequests, setCurrentRequests] = React.useState([]);
  const [donorRequests, setDonorRequests] = React.useState([]);
  const isFocused = useIsFocused();
  const [isDonor, setIsDonor] = React.useState(false);
  const [visibleOwn, setVisibleOwn] = React.useState(["flex", "arrow-down-drop-circle-outline"]);
  const [visibleDonor, setVisibleDonor] = React.useState(["flex", "arrow-down-drop-circle-outline"]);
  React.useEffect(() => {
      const user = firebaseAuth.currentUser;
      if (isFocused) {
        if (user) {
          getDoc(doc(firebaseDB, "users", user.uid))
            .then(async (snapshot) => {
              if (snapshot.exists()) {
                await setIsDonor(snapshot.data().donor);
                let fetchData = [];
                fetchData.push(snapshot.data());
                if (fetchData[0].requests != null) {
                  await setCurrentRequests(fetchData[0].requests);
                  navigation.setOptions({headerRight: () => (
                    <Button onPress={() => {
                      navigation.navigate('NewRequest', {currentRequests: fetchData[0].requests})
                    }}>
                      <Ionicons color="#FFF" name="add" style={{fontSize: 32, fontWeight:'bold', paddingRight: 10}}/></Button>)});
                } else {
                navigation.setOptions({headerRight: () => (
                  <Button onPress={() => {
                    navigation.navigate('NewRequest', {currentRequests: []})
                  }}>
                    <Ionicons color="#FFF" name="add" style={{fontSize: 32, fontWeight:'bold', paddingRight: 10}}/></Button>)});
              }
              const city = fetchData[0].city;
              await getDoc(doc(firebaseDB, "requests", city, "Blood", fetchData[0].bloodGroup))
              .then(async (snapshot) => {
                if (snapshot.exists()) {
                  let donorData = [];
                  let requestArray = snapshot.data().requests;
                  for (let i = 0; i < requestArray.length; i++) {
                    let request = requestArray[i];
                    if(request.status == "Pending" && request.user != user.uid) { donorData.push(request); }
                  }
                  await setDonorRequests(donorData);
                }
              })
              .catch((error) => {console.log(error)});
            }
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
  }, [isFocused, currentRequests, firebaseAuth.currentUser]);

  function deleteRequest(index) {
    const storageRef = currentRequests[index].imageStorageRef;
    const rtbd = currentRequests[index];
    setCurrentRequests(currentRequests.splice(index, 1));
    const user = firebaseAuth.currentUser;
    if (user) {
      updateDoc(doc(firebaseDB, "requests", rtbd.city, rtbd.name, rtbd.type), {requests: arrayRemove(rtbd)});
      updateDoc(doc(firebaseDB, "users", user.uid), {requests: currentRequests});
      if(rtbd.status != "Fulfilled"){
        deleteObject(store.ref(firebaseStorage, storageRef)).then(() => {
        console.log("Deleted");
      }).catch((error) => {console.log(error)});}
    }
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
                  key={index}
                  onPress={() => {
                    navigation.navigate("UserRequestDetails", {
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
                      contactDetails: item.contactDetails,
                      currentRequests: currentRequests,
                      fulfilledBy: item.fulfilledBy,
                    });
                  }}
                  style={styles.button}
                >
                  <Ionicons name="arrow-forward" size={28} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => { deleteRequest(index); }}
                  style={styles.button}
                >
                  <Ionicons name="close" size={28} color="#ff1616" />
                </TouchableOpacity>
              </View>
            </View>
        </View>
      )
    });
    return renderArray;
  }

  function renderDonorRequests() {
    let renderArray = [];
    if (donorRequests.length == 0) {
      return (
        <View style={styles.noResource}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            No requests available.
          </Text>
        </View>
      );
    }
    donorRequests.map((item, index) => {
      renderArray.push(
        <View style={styles.itemView} key={index}>
          <View style={styles.firstRow}>
              <Text style={styles.nameText}>Name: {item.name}</Text>
              <Text style={styles.nameText}>Type: {item.type}</Text>
            </View>
            <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", }} >
              <View style={styles.secondRow}>
                <Text style={[styles.nameText]}>Quantity: {item.quantity}</Text>
                <Text style={styles.nameText}>Status: {item.status}</Text>
              </View>
              <View style={styles.button}>
                <TouchableOpacity
                  key={index}
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
                      currentRequests: donorRequests,
                    });
                  }}
                  style={styles.button}
                ><Text style={{paddingLeft: 20,paddingTop: 5}}>View</Text>
                  <Ionicons name="arrow-forward" size={28} color="black" />
                </TouchableOpacity>
              </View>
            </View>
        </View>
      )
    });
    return renderArray;
  }

  function changeVisibleOwn() {
    if (visibleOwn[0] == "flex") {
      setVisibleOwn(["none", "arrow-right-drop-circle-outline"]);
    } else {
      setVisibleOwn(["flex", "arrow-down-drop-circle-outline"]);
    }
  }
  function changeVisibleDonor() {
    if (visibleDonor[0] == "flex") {
      setVisibleDonor(["none", "arrow-right-drop-circle-outline"]);
    } else {
      setVisibleDonor(["flex", "arrow-down-drop-circle-outline"]);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0"}}>
      <View style={{width: '100%'}}>
      <TouchableOpacity onPress={() => {changeVisibleOwn()}} activeOpacity={1} shadowOpacity={1}>
        <View style={{flexDirection: 'row', borderBottomWidth: 0.8}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10}}>My Requests</Text>
          <MaterialCommunityIcons name={visibleOwn[1]} style={{alignSelf: 'center', position: 'absolute', right: 20}} size={24} color="black"/>
        </View>
      </TouchableOpacity>
      <View style={{ alignSelf: 'center', flexDirection: "row", height: "45%", display: `${visibleOwn[0]}` }}>
        <ScrollView >
          {renderResource()}
        </ScrollView>
      </View>
      { isDonor ? <View style={{ height:'50%'}}><TouchableOpacity onPress={() => {changeVisibleDonor()}} activeOpacity={1} shadowOpacity={1}>
        <View style={{flexDirection: 'row', borderTopWidth: 0.8, borderBottomWidth: 0.8}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', paddingHorizontal: 20, paddingVertical: 10}}>Donor Requests</Text>
          <MaterialCommunityIcons name={visibleDonor[1]} style={{alignSelf: 'center', position: 'absolute', right: 20}} size={24} color="black"/>
        </View>
      </TouchableOpacity>
      <View style={{ alignSelf: 'center', flexDirection: "row", display: `${visibleDonor[0]}` }}><ScrollView>
        {renderDonorRequests()}
      </ScrollView></View></View>: null}
      </View>
    </SafeAreaView>
  );
}

export default UserRequests;

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
    paddingRight: 5,
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