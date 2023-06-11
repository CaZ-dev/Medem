import { SafeAreaView, TouchableOpacity, Share, View, Text, StyleSheet, ScrollView } from "react-native";
import React from "react";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FindNearbyPage = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const name = route.params.name;
    const latitude = route.params.latitude;
    const longitude = route.params.longitude;
    const [dataArray, setData] = React.useState([]);
    let data = undefined;
    React.useEffect(() => {
        navigation.setOptions({
            title: 'Nearby Locations', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
        const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude}%2C${longitude}&radius=10000&opennow=true&rankby=prominence&keyword=${name}&key=AIzaSyBUat154CDBV-eu2yMLbYayo7JkqZ_cvAs`
        fetch(url, {method: 'GET',}).then((response) => response.json()).then(async (resJson) => {
            data = resJson['results'].map((element) => {
                return {
                    latitude: element['geometry']['location']['lat'],
                    longitude: element['geometry']['location']['lng'],
                    name: element['name'],
                    address: element['vicinity'],
                    placeID: element['place_id'],
                }
            })
            await setData(data);
        }).catch((error) => console.log(error))
    }, [isFocused]);

    function renderNearby() {
        let renderArray = [];
        dataArray.map((item, index) => {
            renderArray.push(
            <View style={styles.itemView} key={index}>
              <View style={styles.firstRow}>
                  <Text style={styles.nameText}>{item.name}</Text>
            </View>
                <View style={{ flexWrap: "wrap", flexDirection: "row", justifyContent: "space-between", }} >
                  <View style={styles.secondRow}>
                    <Text style={[styles.nameText]}>{item.address.length > 40 ? item.address.substring(0, 40): item.address}</Text>
                  </View>
                  <View style={styles.button}>
                    <TouchableOpacity
                      onPress={() => {navigation.navigate('FindNearbyDetails', {placeID: item.placeID, latitude: item.latitude, longitude: item.longitude, name: item.name})}}
                      style={styles.button}
                    >
                      <Ionicons name="arrow-forward" size={28} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
            </View>
          )});
        return renderArray;
    }

    return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0"}}>
      <ScrollView style={{ flexDirection: "column", }} >
        {renderNearby()}
      </ScrollView>
    </SafeAreaView>
    );
    }

export default FindNearbyPage;




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
      minWidth: 300,
      maxWidth: '100%',
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
      maxWidth: '90%',
    },
    secondRow: {
      paddingLeft: 10,
      maxWidth: '90%',
      paddingTop: 15,
      paddingBottom: 5,
      flexDirection: "row",
    },
    nameText: {
      fontSize: 14,
      fontWeight: "bold",
      paddingTop: 2,
      paddingRight: 0,
    },
    button: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingLeft: 0,
      paddingBottom: 10,
    },
    noResource: {
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
  });