import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { firebaseAuth, firebaseDB, firebaseStorage } from '../../firebaseUtil/config';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import * as store from 'firebase/storage'

const UserRequestDetails = ({ route, navigation }) => {
    const { name, type, quantity, description, status, imageURL, imageStorageRef, contactDetails, index, currentRequests, fulfilledBy, location, city} = route.params;
    let fulfilledByName = null;
    if (fulfilledBy) {fulfilledByName = fulfilledBy;} else if(contactDetails){fulfilledByName = contactDetails.name;} else {fulfilledByName = ""}
    const isFocused = useIsFocused();
    React.useEffect(() => {
        navigation.setOptions({
            title: 'Request Details', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
    }, [isFocused]);

    const statusHandler = () => {
        if(status === 'Pending') {
            return (
                <View key={index} style={styles.textField}>
                <Text style={styles.fieldDesc}>Status: </Text>
                <Text style={styles.textDesc}>Pending</Text>
                </View>
            )
        }
        else if(status === 'Fulfilled') {
            let renderArray = [(<View key={index} style={styles.textField}>
                <Text style={styles.fieldDesc}>Status: </Text>
                <Text style={styles.textDesc}>Fulfilled</Text>
                </View>)];
            if(fulfilledByName){
                renderArray.push((<View key={index} style={styles.textField}>
                    <Text style={styles.fieldDesc}>Fulfilled By: </Text>
                    <Text style={styles.textDesc}>{fulfilledByName}</Text>
                    </View>));
            }
            return renderArray;
        }
        else if(status === 'Available') {
            if(contactDetails) {
            return ([
                (<View key={index} style={styles.textField}>
                <Text style={styles.fieldDesc}>Status: </Text>
                <Text style={styles.textDesc}>Available</Text>
                </View>),
                (<View key={index+1} style={styles.textField}>
                    <Text style={[styles.fieldDesc, {width: '50%', paddingLeft: 10}]}>Responder Name: </Text>
                    <Text style={styles.textDesc}>{contactDetails.name}</Text>
                </View>),
                (<View key={index+2} style={styles.contactDetails}>
                <Text style={styles.contactText}>Contact Responder: </Text>
                <TouchableOpacity style={styles.contactButton} onPress={() => {Linking.openURL(`tel:+91${contactDetails.phone}`)}}>
                    <Ionicons color="#ff1616" name="call" style={{alignSelf:'center', fontSize: 28, fontWeight:'bold'}}/>
                    <Text style={{color:'#ff1616', fontWeight: 'bold', textAlign: 'center', marginTop: 2}}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.contactButton} onPress={() => {Linking.openURL(`mailto:${contactDetails.email}`)}}>
                    <Ionicons color="#ff1616" name="mail" style={{alignSelf:'center', fontSize: 28, fontWeight:'bold'}}/>
                    <Text style={{color:'#ff1616', fontWeight: 'bold', textAlign: 'center', marginTop: 2}}>Mail</Text>
                </TouchableOpacity>
                </View>)
            ]
            )}
        }
    }

    const markAsFulfilled = () => {
        const oldRequest = currentRequests[index];
        const request = {
            name: name,
            type: type,
            quantity: quantity,
            description: description,
            location: location,
            city: city,
            status: "Fulfilled",
            user: firebaseAuth.currentUser.uid,
            fulfilledBy: fulfilledByName,
        }
        updateDoc(doc(firebaseDB, "requests", city, name, type), {requests: arrayRemove(oldRequest)});
        currentRequests[index] = request;
        updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), {requests: currentRequests});
        store.deleteObject(store.ref(firebaseStorage, imageStorageRef)).then(() => {
            navigation.goBack();
            console.log("Marked as fulfilled");
          }).catch((error) => {console.log(error)});
    }
    return (
        <SafeAreaView style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0", }}>
        <View style={{ flex: 1, alignItems: "center", justifyContent: "flex-start"}}>
        </View>
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Name: </Text>
                <Text style={styles.textDesc}>{name}</Text>
        </View>
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Type: </Text>
                <Text style={styles.textDesc}>{type}</Text>
        </View>
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Quantity: </Text>
                <Text style={styles.textDesc}>{quantity}</Text>
        </View>
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Location: </Text>
                <Text style={styles.textDesc}>{location}</Text>
        </View>
        <View style={styles.descriptionContainer}>
            <Text style={[{width: '40%', fontSize: 16, fontWeight: 'bold', flexWrap: 'wrap', alignItems: 'flex-start'}]}>Additional Info: </Text>
            <ScrollView style={{width: '100%'}}>
                    <Text style={styles.descriptionText}>{description}</Text>
            </ScrollView>
        </View>
        {(status != "Fulfilled") ? <TouchableOpacity onPress={() => {navigation.navigate("WebViewPage", {url: imageURL})}}>
            <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Show Prescription</Text>
                <Ionicons color="#ff1616" name="open" style={{alignSelf:'center', fontSize: 28, fontWeight:'bold'}}/>
            </View>
        </TouchableOpacity> : null}
        {statusHandler()}
        {(status != "Fulfilled") ? <TouchableOpacity onPress={() => {markAsFulfilled()}}
        style={{marginVertical: 30, height: 40, alignContent: 'center', backgroundColor: '#ff1616', borderRadius: 25, width: "60%",padding: 10}}>
            <View>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#fff'}}>Mark as Fulfilled</Text>
            </View>
        </TouchableOpacity> : null}
        </SafeAreaView>
    );
}
export default UserRequestDetails;

const styles = StyleSheet.create({
    textDesc: {
        fontSize: 16,
        fontWeight: "regular",
        alignContent: 'center',
        paddingEnd: 10,
        width: '50%'
    },
    descriptionText: {
        fontSize: 16,
        textAlign: 'left',
        width: '100%',
    },
    textField: {
        marginTop: 10,
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
        marginTop: 10,
        borderRadius: 25,
        width: '80%',
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
        width: 70,
        padding: 10,
        marginHorizontal: 10,
        flexDirection: 'column',
    },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '50%',
        marginTop: 10,
        padding: 5,
        backgroundColor: '#fff',
        borderRadius: 25,
    },
    linkText: {
        fontSize: 16,
        alignSelf: 'center',
        fontWeight: 'bold',
        
    },
})