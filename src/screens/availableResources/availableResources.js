import * as React from "react";
import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, } from "react-native";
import { get, update, ref } from "firebase/database";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseAuth, firebaseDB } from "../../firebaseUtil/config";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";

const AvailableResources = ({ navigation }) => {
  const [data, setData] = React.useState([]);
  const isFocused = useIsFocused();
  React.useEffect(() => {
    if (isFocused) {
    const user = firebaseAuth.currentUser;
      if (user) {
        getDoc(doc(firebaseDB, "users", user.uid))
          .then((snapshot) => {
            if (snapshot.exists()) {
              let fetchData = [];
              fetchData.push(snapshot.data());
              if (fetchData[0].availableResources.length > 0) {
                console.log(fetchData[0].availableResources)
                if (fetchData[0].availableResources[0]["name"] != "None") {
                  setData(fetchData[0].availableResources);
                }
            }
              navigation.setOptions({
                headerRight: () => (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("NewResource", {
                        availableResources: data,
                      });
                    }}
                  >
                    <Ionicons
                      color="#FFF"
                      name="add"
                      style={{ fontSize: 32, fontWeight: "bold", paddingRight: 10 }}
                    />
                  </TouchableOpacity>
                ),
              });
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [isFocused]);

  function deleteResource(index) {
    setData(data.splice(index, 1));
    const user = firebaseAuth.currentUser;
    if (user) {
      updateDoc(doc(firebaseDB, "users", user.uid), {
        availableResources: data,
      }).catch((error) => {
        console.log(error);
      });
    }
  }

  function renderResource() {
    if (data.length == 0) {
      return (
        <View style={styles.noResource}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>
            No resources available.
          </Text>
        </View>
      );
    }
    let renderArray = [];
    for (let i = 0; i < data.length; i++) {
      let info = data[i];
      renderArray.push(
        <View style={styles.card} key={i}>
          <View style={{ flexWrap: "wrap", }} >
            <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", }} >
              <View style={styles.firstRow}>
                <View style={{ flex: 1, flexDirection: 'column'}}>
                  <Text style={styles.nameText}>Name: {info["name"]}</Text>
                  <Text style={styles.nameText}>Type: {info["type"]}</Text>
                  {/* <Text style={styles.nameText}>Quantity: {info[2]}</Text> */}
                </View>
                <View style={styles.button}>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("EditResource", {
                        index: i,
                        name: info["name"],
                        type: info["type"],
                        availableResources: data,
                      });
                    }}
                    style={styles.button}
                  >
                    <Ionicons name="create" size={28} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => { deleteResource(i); }} style={styles.button} >
                    <Ionicons name="close" size={28} color="#ff1616" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return renderArray;
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
      <ScrollView
        style={{
          width: "100%",
        }}
      >
        {renderResource()}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AvailableResources;

const styles = StyleSheet.create({
  card: {
    maxWidth: "100%",
    margin: 10,
    justifyContent: "space-between",
    paddingRight: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  firstRow: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 10,
    flexDirection: "row",
  },
  nameText: {
    fontSize: 14,
    fontWeight: "bold",
    paddingTop: 5,
    paddingRight: 10,
    paddingBottom: 4,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
  },
  noResource: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
});
