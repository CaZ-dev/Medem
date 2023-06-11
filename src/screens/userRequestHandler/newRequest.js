import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { firebaseAuth, firebaseDB, firebaseStorage } from '../../firebaseUtil/config';
import * as storage from 'firebase/storage';
import { doc, setDoc, updateDoc, arrayUnion, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker";
import * as Location from 'expo-location';
import { useIsFocused } from '@react-navigation/native';

const NewRequest = ({ route, navigation }) => {
    const [name, setName] = React.useState("");
    const [type, setType] = React.useState("");
    const [quantity, setQuantity] = React.useState("");
    const [desc, setDesc] = React.useState("");
    const {currentRequests} = route.params
    const [image, setImage] = React.useState(null)
    const [imageName, setImageName] = React.useState(null)
    const [imageSelected, setImageSelected] = React.useState(null)
    const [location, setLocation] = React.useState("")
    const [city, setCity] = React.useState("")
    const [progress, setProgress] = React.useState(null)
    const isFocused = useIsFocused()


    React.useEffect(() => {
        if(isFocused){
        navigation.setOptions({
            title: 'New Request', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
            (async () => {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
                }
                let {coords} = await Location.getCurrentPositionAsync();
                if (coords) {
                    const { latitude, longitude } = coords;
                    let response = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude
                    });
                    setLocation(response[0].name)
                    setCity(response[0].city)
                }
            })();
        }
    }, [isFocused]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 0.2,
        });
        if (!result.cancelled) {
            setImage(result.uri);
            setImageName(result.uri.split('/').pop())
            setImageSelected("checkmark-circle-sharp")
          }
    }

    async function sendPushNotifications(city, type) {
        let pushTokens = []
        const q = query(collection(firebaseDB, "users"),
        where("city", "==", city), where("userType", "==", "user"), where("donor", "==", true), where("bloodGroup", "==", type));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            if(doc.data().uid !== firebaseAuth.currentUser.uid){
            pushTokens.push(doc.data().pushToken);
            }
        });
        if(pushTokens.length > 0){
            await fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Accept-Encoding": "gzip, deflate",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    to: pushTokens,
                    title: "Request for Blood Donors",
                    body: "A request matching your blood type was just made, please help if you can!"
                })
            });
        };
    }

    async function createNewRequest() {
        if(image){
            const response = await fetch(image);
            const blob = await response.blob();
            const newFile = new File([blob], `${imageName}.jpeg`, {
                type: 'image/jpeg',
            });       
            var ref = storage.ref(firebaseStorage , "prescriptionImages/" + firebaseAuth.currentUser.uid+ "/" + imageName);
            const uploadTask = storage.uploadBytesResumable(ref, newFile);
            uploadTask.on('state_changed',(snapshot) => {
                setProgress((Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toString()) + "%");
            }, (error) => {console.log(error)}, () => {
                storage.getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    const newRequest = {
                        name: name,
                        type: type,
                        quantity: quantity,
                        description: desc,
                        imageURL: url,
                        status: "Pending",
                        location: location,
                        city: city,
                        user: firebaseAuth.currentUser.uid,
                        imageStorageRef: uploadTask.snapshot.ref.fullPath,
                    }
                    currentRequests.push(newRequest)
                    const userID = firebaseAuth.currentUser.uid
                    const userRef = doc(firebaseDB, "users", userID);
                    if (getDoc(doc(firebaseDB, "requests", city, name, type)).then((snapshot) => {
                        if(snapshot.exists()){
                            updateDoc(doc(firebaseDB, "requests", city, name, type), {requests: arrayUnion(newRequest)});
                        } else {
                            setDoc(doc(firebaseDB, "requests", city, name, type), {requests: arrayUnion(newRequest)});
                        }
                        }))
                    updateDoc(userRef, {requests: currentRequests});
                    navigation.goBack();
                    if(name == 'Blood'){sendPushNotifications(city, type);}
                }
            );
            });
            }
        else{
            alert("Please upload a prescription!")
        }
    }
    return (
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#D8D9D0", }}>
        <View style={styles.textField}>
                <Text style={styles.fieldDesc}>Name: </Text>
                <TextInput value={name} onChangeText={(text) => {setName(text)}} style={{ opacity: 1, fontWeight: 'bold', color: 'black', width: '60%'}} placeholderTextColor='#4A4A4A' textContentType='none' placeholder="Name of Resource"/>
        </View>
        <View style={styles.textField}>
            <Text style={styles.fieldDesc}>Type: </Text>
            <TextInput value={type} onChangeText={(text) => {setType(text)}} style={{ opacity: 1, fontWeight: 'bold', color: 'black', width: '60%'}} placeholderTextColor='#4A4A4A' placeholder="Type of Resource"/>
        </View>
        <View style={styles.textField}>
            <Text style={styles.fieldDesc}>Quantity: </Text>
            <TextInput value={quantity} onChangeText={(text) => {setQuantity(text)}} style={{ opacity: 1, fontWeight: 'bold', color: 'black', width: '60%'}} placeholderTextColor='#4A4A4A' placeholder="Quantity (Enter number)"/>
        </View>
        <View style={styles.textField}>
            <Text style={styles.fieldDesc}>Location: </Text>
            <TextInput value={location} onChangeText={(text) => {setLocation(text)}} style={{ opacity: 1, fontWeight: 'bold', color: 'black', width: '60%'}} placeholderTextColor='#4A4A4A' placeholder="Location"/>
        </View>
        <View style={styles.descField}>
            <Text style={styles.fieldDesc}>Additional Info: </Text>
            <TextInput multiline blurOnSubmit={true} value={desc} returnKeyType="done" onChangeText={(text) => {setDesc(text)}} style={{opacity: 1, fontWeight: 'bold', color: 'black', width: '60%'}} placeholderTextColor='#4A4A4A' placeholder="Enter additional information (Optional)"/>
        </View>
        <View style={[styles.button, {width: '95%'}]}>
            <TouchableOpacity style={[styles.button, {backgroundColor: '#FFFFFF'}]} onPress = {() => {pickImage()}}>
                <Ionicons color="#000" name="images" style={{fontSize: 20, fontWeight:'bold', paddingRight: 10}}/>
                <Text>Upload Prescription</Text>
            </TouchableOpacity>
            <Text value={progress} style={{fontSize: 20, fontWeight:'bold', paddingRight: 5}}>{progress}</Text>
            <Ionicons color="#42B500" name={imageSelected} style={{fontSize: 40, fontWeight:'bold', paddingRight: 10}}/>
        </View>
        <View style={styles.button}>
                    <TouchableOpacity style={[styles.button, {backgroundColor: '#ff1616'}]} onPress = {() => {createNewRequest()}}>
                        <Text style={{fontWeight: 'bold', fontSize: 20, color: 'white'}}>Raise Request</Text>
                    </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
    );
}

    export default NewRequest;

    const styles = StyleSheet.create({
        textField: {
            marginBottom: 10,
            borderRadius: 25,
            width: '80%',
            backgroundColor: '#fff',
            height: 50,
            paddingRight: 20,
            alignContent:'center',
            justifyContent: 'space-around',
            flexDirection: 'row', 
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
        },
        fieldDesc: {
            paddingLeft: 5,
            marginTop: 15,
            fontSize: 16,
            width: '30%',
            fontWeight: 'bold',
            color: 'black',
            height: 60,
        },
        descField: {
            marginBottom: 10,
            borderRadius: 25,
            width: '80%',
            backgroundColor: '#fff',
            height: 100,
            paddingRight: 20,
            paddingTop: 10,
            paddingLeft: 5,
            justifyContent: 'space-around',
            flexDirection: 'row', 
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
        },
        button: {
            borderRadius: 20,
            height: 50,
            margin : 10,
            paddingHorizontal: 20,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-around',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
        },
    })