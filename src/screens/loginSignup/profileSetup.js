
import React, { useEffect, useRef } from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import { firebaseAuth, firebaseDB } from '../../firebaseUtil/config';
import * as Location from 'expo-location';
import Checkbox from 'expo-checkbox';
import { updateProfile } from 'firebase/auth';
import { set, ref, update } from 'firebase/database';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileSetup = ({ route, navigation }) => {

    const {userType} = route.params
    const [errorMsg, setErrorMsg] = React.useState(null);

    const [name, setName] = React.useState('')
    const [phone, setPhone] = React.useState('')
    const [bloodGroup, setBloodGroup] = React.useState('')
    const [city, setCity] = React.useState('')
    
    const [error, setError] = React.useState('')
    const [isChecked, setChecked] = React.useState(true)

    const updateToken = async () => {
        const token = await AsyncStorage.getItem("pushToken");
        await AsyncStorage.setItem("userType", userType);
        await AsyncStorage.setItem("userName", name);
        await AsyncStorage.setItem("userPhone", phone);
        await AsyncStorage.setItem("userEmail", firebaseAuth.currentUser.email);
        await AsyncStorage.setItem("userCity", city);
        await updateDoc(doc(firebaseDB, "users", firebaseAuth.currentUser.uid), {
        pushToken: token,
        });
      };

    const updateUserProfile = () => {
        if (name == '' || phone == '' || bloodGroup == '' || city == '') setError('Please fill all the fields')
        else {
        const user = firebaseAuth.currentUser
        updateProfile(firebaseAuth.currentUser,{displayName: name})
        setDoc(doc(firebaseDB, "users", user.uid), {
            userType: userType,
            name: name,
            email: firebaseAuth.currentUser.email,
            phone: phone,
            bloodGroup: bloodGroup,
            city: city,
            donor: isChecked,
            uid: user.uid
        }).then(() => {
            updateToken();
            navigation.navigate("Home", { routeName: "Dashboard" });
        }).catch((error) => {
            console.log(error.message)
            setError(error.message)
        })}
    }

    const updateResponderProfile = () => {
        if (name == '' || phone == '' || city == '') setError('Please fill all the fields')
        else {
        const user = firebaseAuth.currentUser
        updateProfile(firebaseAuth.currentUser,{displayName: name})
        setDoc(doc(firebaseDB, "users", user.uid), {
            userType: userType,
            name: name,
            email: firebaseAuth.currentUser.email,
            phone: phone,
            city: city,
            availableResources: [{name:"None", type:"None"}],
            uid: user.uid
        }).then(() => {
            updateToken();
            navigation.navigate('Home')})
        .catch((error) => {
            console.log(error.message)
            setError(error.message)
        })}
    }

    useEffect(() => {
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
                setCity(response[0].city)
            }
        })();
        }, []);
    
    if(userType == 'user') {
    return (
        <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.textField}>
                <TextInput value={name} onChangeText={(text) => {setName(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='name' placeholder="Full Name"/>
            </View>
            <View style={styles.textField}>
                <TextInput value={phone} onChangeText={(text) => {setPhone(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='telephoneNumber' placeholder="Phone Number (without +91)"/>
            </View>
            <View style={styles.textField}>
                <TextInput value={bloodGroup} onChangeText={(text) => {setBloodGroup(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='none' placeholder="Blood Group"/>
            </View>
            <View style={[styles.textField]}>
                <TextInput value={city} onChangeText={(text) => {setCity(text)}} style={{ opacity: 0.4, fontWeight: 'bold',width:'100%'}} placeholderTextColor='#4A4A4A' textContentType='addressCity' placeholder="City"/>
            </View>
          <View style={styles.section}>
            <Checkbox style={styles.checkbox} value={isChecked} onValueChange={setChecked} color={isChecked ? '#ff1616' : undefined}/>
            <Text>Are you willing to donate blood if contacted?</Text>
          </View>
          <View style={styles.button}>
                    <TouchableOpacity onPress = {updateUserProfile}>
                        <Text style={{color:'white', fontWeight: 'bold', fontSize: 20}}>Save Profile</Text>
                    </TouchableOpacity>
            </View>
            <Text style={{color: 'red'}}>{error}</Text>
        </KeyboardAvoidingView>
      );
    }
    else if(userType == 'responder') {
        return (
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
            <View style={styles.textField}>
                <TextInput value={name} onChangeText={(text) => {setName(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='name' placeholder="Organisation Name"/>
            </View>
            <View style={styles.textField}>
                <TextInput value={phone} onChangeText={(text) => {setPhone(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='telephoneNumber' placeholder="Phone Number (without +91)"/>
            </View>
            <View style={[styles.textField]}>
                <TextInput value={city} onChangeText={(text) => {setCity(text)}} style={{ opacity: 0.4, fontWeight: 'bold',width:'100%'}} placeholderTextColor='#4A4A4A' textContentType='addressCity' placeholder="City"/>
            </View>
          <View style={styles.button}>
                    <TouchableOpacity onPress = {updateResponderProfile}>
                        <Text style={{fontWeight: 'bold', fontSize: 20}}>Save Profile</Text>
                    </TouchableOpacity>
            </View>
            <Text style={{color: 'red'}}>{error}</Text>
        </KeyboardAvoidingView>
        )
    }
} 
    const styles = StyleSheet.create({
        container: {
            color: 'black',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            flex: 1,
            backgroundColor: '#D8D9D0',
        },
        textField: {
            marginBottom: 10,
            borderRadius: 25,
            width: '80%',
            backgroundColor: '#fff',
            height: 50,
            paddingHorizontal: 20,
            justifyContent: 'center',
            textAlign: 'left',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
        },
      section: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      checkbox: {
        margin: 8,
      },
      button: {
        borderRadius: 20,
        height: 50,
        margin : 10,
        marginBottom: 50,
        width: 180,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff1616',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
    });

export default ProfileSetup