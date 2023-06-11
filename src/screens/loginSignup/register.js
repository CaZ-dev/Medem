import React, {useEffect} from 'react'
import { StyleSheet, Text, View, KeyboardAvoidingView, TextInput, TouchableOpacity, Image } from 'react-native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, updatePhoneNumber, updateProfile } from 'firebase/auth';
import { ref, set } from "firebase/database";
import { firebaseAuth, firebaseDB } from '../../firebaseUtil/config';
import SwitchSelector from 'react-native-switch-selector';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register = ({navigation}) => {
    const switchoptions = [
        { label: "User", value: "user" },
        { label: "Responder", value: "responder" },
    ]; 

    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [userType, setUserType] = React.useState('user')
    const [error, setError] = React.useState('')

    const [visible, setVisible] = React.useState(true)
    const [eye, setEye] = React.useState('eye')
    
    const changeVisibility = () => {
        setVisible(!visible)
        if (visible) setEye('eye-off')
        else setEye('eye')
    }

    const updateUser = async (userType) => {await AsyncStorage.setItem('userType', userType)}

    const submitForm = () => {
        if (email == '' || password == '') setError('Please fill all the fields')
        else {
                createUserWithEmailAndPassword(firebaseAuth ,email, password).then((userCredential) => {
                updateUser(userType)
                navigation.navigate('ProfileSetup', {userType: userType})
        }).catch((error) => {
            if (error.code == 'auth/email-already-in-use') setError('Email already in use')
            else if (error.code == 'auth/invalid-email') setError('Invalid Email')
            else if (error.code == 'auth/weak-password') setError('Weak Password')
            else setError(error.message)
            console.log(error.message)
        })
        console.log(firebaseAuth.currentUser)
    }
}

    return (
        <KeyboardAvoidingView style={styles.container}  behavior="padding" >
            <Image source={require('../assets/logo.png')} style={{margin: 20, maxWidth: 250, resizeMode: 'contain'}}/>
        <View style={styles.emailField}>
                <TextInput autoCapitalize='none' onChangeText={(text) => {setEmail(text)}} style={{ opacity: 0.4, fontWeight: 'bold', color: 'black'}} placeholderTextColor='#4A4A4A' textContentType='emailAddress' placeholder="Email Address"/>
        </View>
        <View style={styles.passField}>
            <TextInput autoCapitalize='none' onChangeText={(text) => {setPassword(text)}} style={{ opacity: 0.4, fontWeight: 'bold',width:'100%'}} placeholderTextColor='#4A4A4A' secureTextEntry={visible} textContentType='password' placeholder="Password"/>
            <TouchableOpacity onPress={changeVisibility}>
                <MaterialCommunityIcons name={eye} style={{right: '100%'}} size={24} color="#4A4A4A" />
            </TouchableOpacity>
        </View>
        <View style={{width:280}}>
        <SwitchSelector options={switchoptions} initial={0} hasPadding bold height={40} buttonColor='#8A8A8A' backgroundColor='#D8D9D0' textColor='#4A4A4A' borderWidth={2}
        onPress={(value) => setUserType(value)}/></View>
        <View style={styles.loginBar}>
            <View style={styles.button}>
                    <TouchableOpacity onPress = {submitForm}>
                        <Text style={{color:'white',fontWeight: 'bold', fontSize: 20}}>Register</Text>
                    </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity onPress = {() => {navigation.navigate('Login')}}>
                    <Text style={{fontWeight: 'bold', fontSize: 14}}>Already have an account? Log in.</Text>
                </TouchableOpacity>
            </View>
            <Text style={{fontWeight: 'bold', fontSize: 14, color: 'red', textAlign: 'center'}}>{error}</Text>
        </View>
        </KeyboardAvoidingView>
    )

}

export default Register

const styles = StyleSheet.create({
    container: {
        color: 'black',
        alignItems: 'center',
        justifyContent: 'flex-end',
        flexDirection: 'column',
        flex: 1,
        backgroundColor: '#D8D9D0',
    },
    loginBar: {
        paddingHorizontal: 20,
        marginBottom: 50,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameField: {
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
    phoneField: {
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
    bloodField: {
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
    emailField: {
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
    passField: {
        marginBottom: 10,
        borderRadius: 25,
        width: '80%',
        backgroundColor: '#fff',
        height: 50,
        paddingHorizontal: 20,
        textAlign: 'left',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        flexDirection: 'row',
        
    },
    button: {
        borderRadius: 20,
        height: 50,
        margin : 10,
        width: 150,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff1616',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
    },
})
