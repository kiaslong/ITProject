import React, { useState, useRef } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function RegisterScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [retypePasswordVisible, setRetypePasswordVisible] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const retypePasswordRef = useRef(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleRetypePasswordVisibility = () => {
    setRetypePasswordVisible(!retypePasswordVisible);
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>
        <View style={styles.inputView}>
          <Text style={styles.label}> Số điện thoại </Text>
          <TextInput
            style={styles.input}
            placeholder="0123456789"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            autoCorrect={false}
            autoFocus={true}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
          />
          <Text style={styles.label}> Email </Text>
          <TextInput
            ref={emailRef}
            style={styles.input}
            placeholder="philong@gmail.com"
            value={email}
            onChangeText={setEmail}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
          />
          <Text style={styles.label}> Mật khẩu </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={passwordRef}
              style={styles.passwordInput}
              placeholder="Mật khẩu"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => retypePasswordRef.current.focus()}
            />
            <Pressable
              onPress={togglePasswordVisibility}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={passwordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
          <Text style={styles.label}> Xác nhận mật khẩu </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={retypePasswordRef}
              style={styles.passwordInput}
              placeholder="Nhập lại mật khẩu"
              secureTextEntry={!retypePasswordVisible}
              value={retypePassword}
              onChangeText={setRetypePassword}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="done"
            />
            <Pressable
              onPress={toggleRetypePasswordVisibility}
              style={styles.eyeIcon}
            >
              <MaterialCommunityIcons
                name={retypePasswordVisible ? "eye-off" : "eye"}
                size={24}
                color="gray"
              />
            </Pressable>
          </View>
        </View>
        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress={() => Alert.alert("Đăng ký thành công")}
          >
            <Text style={styles.buttonText}>Đăng ký</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const deviceHeight = Dimensions.get("window").height;

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
    color: "#03a9f4",
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 25,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: "#03a9f4",
    borderWidth: 1,
    borderRadius: 7,
  },
  label: {
    fontSize: deviceHeight < 1000 ? 14 : 16,
    fontWeight: "400",
  },
  button: {
    backgroundColor: "#03a9f4",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingTop: deviceHeight < 1000 ? 20 : 30,
    paddingHorizontal: deviceHeight < 1000 ? 50 : 70,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#03a9f4",
    borderWidth: 1,
    borderRadius: 7,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});
