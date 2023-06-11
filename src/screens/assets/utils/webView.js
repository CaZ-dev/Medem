import { SafeAreaView, TouchableOpacity, Share, View, Text } from "react-native";
import WebView from "react-native-webview";
import React from "react";
import { useIsFocused } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

const WebViewPage = ({ route, navigation }) => {
    const isFocused = useIsFocused();
    const url = route.params.url;

    React.useEffect(() => {
        navigation.setOptions({
            title: 'Prescription', headerStyle: {backgroundColor: '#ff1616'}, headerTintColor: "white", headerTitle: { fontSize: 20, fontWeight:'bold'},
            headerLeft: () => (
            <TouchableOpacity onPress={() => {
              navigation.goBack();
            }}><Ionicons color="#FFF" name="arrow-back" style={{fontSize: 32, fontWeight:'bold', paddingLeft: 10}}/></TouchableOpacity>)});
    }, [isFocused]);

    return (
        <View style={{ flex: 1 }}>
        <WebView useWebKit scalesPageToFit source={{ uri: url }} />
        <View style={{backgroundColor: '#ff1616', width: '100%', height: 50}}></View>
        </View>
    );
    }

export default WebViewPage;