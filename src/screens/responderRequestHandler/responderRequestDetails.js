import React from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { firebaseAuth, firebaseDB, firebaseStorage } from '../../firebaseUtil/config';
import { doc, updateDoc, arrayRemove, getDoc } from 'firebase/firestore';
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResponderRequestDetails = ({ route, navigation }) => {
    const { name, type, quantity, description, status, imageURL, imageStorageRef, index, currentRequests, location, city, uid} = route.params;
    const isFocused = useIsFocused();
    React.useEffect(() => {
        navigation.setOptions({
            title: 'Request Details', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
    }, [isFocused]);

    
    const markAsAvailable = () => {
        const oldRequest = currentRequests[index];
        const contactDetailsHandler = async () => {
            const userName = await AsyncStorage.getItem("userName");
            const userPhone = await AsyncStorage.getItem("userPhone");
            const userEmail = await AsyncStorage.getItem("userEmail");
            return {
                name: userName,
                phone: userPhone,
                email: userEmail
            }
        }
        contactDetailsHandler().then((contactDetails) => {
        //console.log(name, type, quantity, description, status, imageURL, contactDetails, location, city, uid);
        const request = {
            name: name,
            type: type,
            quantity: quantity,
            description: description,
            location: location,
            city: city,
            imageURL: imageURL,
            imageStorageRef: imageStorageRef,
            status: "Available",
            user: uid,
            contactDetails: contactDetails,
        }
        currentRequests[index] = request;
        updateDoc(doc(firebaseDB, "users", uid), {requests: currentRequests}).then(
            () => {
                updateDoc(doc(firebaseDB, "requests", city, name, type), {requests: arrayRemove(oldRequest)})
                .then(() => {
                    getDoc(doc(firebaseDB, "users", uid)).then(async (snap) => { if(snap.exists()) {
                        const pushToken = snap.data().pushToken;
                        if(pushToken){
                            await fetch("https://exp.host/--/api/v2/push/send", {
                                method: "POST",
                                headers: {
                                    Accept: "application/json",
                                    "Accept-Encoding": "gzip, deflate",
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    to: pushToken,
                                    title: "Resource Available",
                                    body: "Request for "+ name + " " + type + " " + quantity + " is available."
                                })
                            });
                        };
                    };
                    navigation.goBack();
                    console.log("Marked as available");
                });})}
        );
    })
}

    return (
        <SafeAreaView key={index} style={{ flex: 1, alignItems: "center", justifyContent: "flex-start", backgroundColor: "#D8D9D0", }}>
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
        {(status == "Pending") ? <TouchableOpacity onPress={() => {navigation.navigate("WebViewPage", {url: imageURL})}}>
            <View style={styles.linkContainer}>
                <Text style={styles.linkText}>Show Prescription</Text>
                <Ionicons color="#ff1616" name="open" style={{alignSelf:'center', fontSize: 28, fontWeight:'bold'}}/>
            </View>
        </TouchableOpacity> : null}
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Status: </Text>
                <Text style={styles.textDesc}>{status}</Text>
                </View>
        {(status == "Pending") ? <TouchableOpacity onPress={() => {markAsAvailable()}}
        style={{marginVertical: 30, height: 40, alignContent: 'center', backgroundColor: '#ff1616', borderRadius: 25, width: "60%",padding: 10}}>
            <View>
                <Text style={{textAlign: 'center', fontWeight: 'bold', fontSize: 16, color: '#fff'}}>Mark as Available</Text>
            </View>
        </TouchableOpacity> : null}
        </SafeAreaView>
    );
}
export default ResponderRequestDetails;

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
        marginBottom: 10,
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
        marginBottom: 10,
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
        marginBottom: 10,
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