import React, { useState, useRef } from 'react'
import { Alert, Button, Image, Pressable, SafeAreaView, StyleSheet, Switch, Text, TextInput, View , Dimensions, ScrollView } from 'react-native'

export default function RegisterScreen() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [retypePassword, setRetypePassword] = useState("");

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const retypePasswordRef = useRef(null);

    return (
        <ScrollView automaticallyAdjustKeyboardInsets>
            <View style={styles.container}>
                <Text style={styles.title}>Đăng ký</Text>
                <View style={styles.inputView}>
                    <Text style={styles.label}> Số điện thoại </Text>
                    <TextInput
                        style={styles.input}
                        placeholder='0123456789'
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        autoCorrect={false}
                        autoFocus={true}
                        autoCapitalize='none'
                        returnKeyType="next"
                        onSubmitEditing={() => emailRef.current.focus()}
                    />
                    <Text style={styles.label}> Email </Text>
                    <TextInput
                        ref={emailRef}
                        style={styles.input}
                        placeholder='philong@gmail.com'
                        value={email}
                        onChangeText={setEmail}
                        autoCorrect={false}
                        autoCapitalize='none'
                        returnKeyType="next"
                        onSubmitEditing={() => passwordRef.current.focus()}
                    />
                    <Text style={styles.label}> Mật khẩu </Text>
                    <TextInput
                        ref={passwordRef}
                        style={styles.input}
                        placeholder='mật khẩu'
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        autoCorrect={false}
                        autoCapitalize='none'
                        returnKeyType="next"
                        onSubmitEditing={() => retypePasswordRef.current.focus()}
                    />
                    <Text style={styles.label}> Xác nhận mật khẩu </Text>
                    <TextInput
                        ref={retypePasswordRef}
                        style={styles.input}
                        placeholder='nhập lại mật khẩu'
                        secureTextEntry
                        value={retypePassword}
                        onChangeText={setRetypePassword}
                        autoCorrect={false}
                        autoCapitalize='none'
                        returnKeyType="done"
                    />
                </View>
                <View style={styles.buttonView}>
                    <Pressable style={styles.button} onPress={() => Alert.alert("Đăng ký thành công")}>
                        <Text style={styles.buttonText}>Đăng ký</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    title: {
        fontSize: 25,
        fontWeight: "bold",
        textTransform: "uppercase",
        textAlign: "left",
        paddingVertical: 40,
        color: "#03a9f4"
    },
    inputView: {
        gap: 15,
        width: "100%",
        paddingHorizontal: 25,
        marginBottom: 5
    },
    input: {
        height: 50,
        paddingHorizontal: 20,
        borderColor: "#03a9f4",
        borderWidth: 1,
        borderRadius: 7
    },
    label: {
        fontSize: deviceHeight < 1000 ? 14 : 16,
        fontWeight: "400",
    },
    forgetView: {
        width: "100%",
        paddingHorizontal: 45,
        alignItems: "center",
        flexDirection: "row",
        marginTop: 16,
        marginBottom: 16
    },
    switch: {
        flexDirection: "row",
        gap: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    forgetText: {
        fontSize: 13,
        color: "#03a9f4"
    },
    button: {
        backgroundColor: "#03a9f4",
        height: 45,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center"
    },
    buttonText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold"
    },
    buttonView: {
        width: "100%",
        paddingTop: deviceHeight < 1000 ? 20 : 30,
        paddingHorizontal: deviceHeight < 1000 ? 50 : 70,
    },
    optionsText: {
        textAlign: "center",
        paddingVertical: 10,
        color: "gray",
        fontSize: 13,
        marginBottom: 6
    },
    mediaIcons: {
        flexDirection: "row",
        gap: 15,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 23
    },
    icons: {
        width: 40,
        height: 40,
    },
    footerText: {
        textAlign: "center",
        color: "gray",
    },
    signup: {
        color: "#ffd31a",
        fontSize: 13
    },
})
