import { SafeAreaView, TouchableOpacity, Share, View, Text, StyleSheet, ScrollView, Linking } from "react-native";
import React from "react";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const FindNearbyDetails = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const placeID = route.params.placeID;
    const name = route.params.name;
    const latitude = route.params.latitude;
    const longitude = route.params.longitude;
    const [dataObj, setData] = React.useState({});

    function renderButton() {
      let renderArray = [];
      if (dataObj.phone != 0) {
        renderArray.push(<TouchableOpacity style={styles.contactButton} onPress={() => {Linking.openURL(`tel:+91${dataObj.phone}`)}}>
                    <Ionicons color="#ff1616" name="call" style={{alignSelf:'center', fontSize: 48, fontWeight:'bold'}}/>
                    <Text style={{color:'#ff1616', fontWeight: 'bold', textAlign: 'center', marginTop: 2, fontSize: 24}}>Call</Text>
        </TouchableOpacity>)
      }
      if (dataObj.website != "No Website found.") {
        renderArray.push(<TouchableOpacity style={styles.contactButton} onPress={() => {Linking.openURL(dataObj.website)}}>
                    <Ionicons color="#ff1616" name="globe" style={{alignSelf:'center', fontSize: 48, fontWeight:'bold'}}/>
                    <Text style={{color:'#ff1616', fontWeight: 'bold', textAlign: 'center', marginTop: 2, fontSize: 20}}>Website</Text>
        </TouchableOpacity>)
      }
      return renderArray
    }

    React.useEffect(() => {
        navigation.setOptions({
            title: 'Place Details', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeID}&fields=url%2Cformatted_address%2Cformatted_phone_number%2Cwebsite&key=AIzaSyBUat154CDBV-eu2yMLbYayo7JkqZ_cvAs`
        fetch(url, {method: 'GET',}).then((response) => response.json()).then(async (resJson) => {
            resJson = resJson['result'];
            let address = "No address found.";
            let url = "No Maps URL found.";
            let phone = 0;
            let website = "No Website found.";
            if (resJson['formatted_address']) { address = resJson['formatted_address'] }
            if (resJson['url']) { url = resJson['url'] } 
            if (resJson['formatted_phone_number']) { phone = resJson['formatted_phone_number'] }
            if (resJson['website']) { const website = resJson['website'] }
            let data = {
              address: address,
              url: url,
              website: website,
              phone: phone
            }
            await setData(data);
        }).catch((error) => console.log(error))
    }, [isFocused]);

    return (
    <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0"}}>
        <View>
                <Text style={styles.textDesc}>{name}</Text>
        </View>
        <View style={styles.descriptionContainer}>
            <Text style={[{width: '35%', fontSize: 20, fontWeight: 'bold', flexWrap: 'wrap', alignItems: 'flex-start', paddingLeft: 20, paddingTop: 20}]}>Address: </Text>
            <ScrollView style={{width: '100%'}}>
                    <Text style={styles.descriptionText}>{dataObj.address}</Text>
            </ScrollView>
        </View>
        <TouchableOpacity onPress={() => {Linking.openURL(dataObj.url)}}>
        <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Show in Maps</Text>
                <Ionicons color="#ff1616" name="navigate-circle" style={{alignSelf:'center', fontSize: 40, fontWeight:'bold'}}/>
            </View>
        </TouchableOpacity>
        <View style={styles.contactDetails}>
          {renderButton()}
        </View>
    </SafeAreaView>
    );
    }

export default FindNearbyDetails;



const styles = StyleSheet.create({
  textDesc: {
      fontSize: 28,
      textTransform: 'uppercase',
      fontWeight: "bold",
      alignContent: 'center',
      textAlign: 'center',
      marginTop: '20%',
      flexShrink: 1,
  },
  descriptionText: {
      fontSize: 18,
      textAlign: 'left',
      width: '100%',
  },
  textField: {
      marginVertical: 10,
      borderRadius: 25,
      width: '80%',
      backgroundColor: '#fff',
      height: 50,
      fontSize: 26,
      justifyContent: 'space-evenly',
      flexDirection: 'row', 
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
  },
  fieldDesc: {
      fontSize: 16,
      paddingTop: '5%',
      width: '40%',
      fontWeight: 'bold',
      color: 'black',
      height: 50,
  },
  descriptionContainer: {
      marginTop: '50%',
      marginBottom: 20,
      borderRadius: 25,
      width: '90%',
      backgroundColor: '#fff',
      height: 100,
      paddingRight: 20,
      flexDirection: 'row', 
      textAlign: 'left',
      padding: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
  },
  contactDetails: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '80%',
      marginVertical: 10,
      paddingHorizontal: 20,
  },
  contactText: {
      fontSize: 16,
      alignSelf: 'center',
      fontWeight: 'bold',
      height: 50,
      width: '40%',
  },
  contactButton: {
      borderRadius: 100,
      backgroundColor: '#fff',
      width: 110,
      height: 110,
      padding: 10,
      marginHorizontal: 10,
      flexDirection: 'column',
  },
  linkContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '60%',
      marginBottom: 10,
      padding: 5,
      backgroundColor: '#fff',
      borderRadius: 25,
  },
  linkText: {
      fontSize: 24,
      alignSelf: 'center',
      fontWeight: 'bold',
      
  },
})