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
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../store/loginSlice';

const googleLogo = require("../assets/gglogo.png");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const passwordInputRef = useRef(null);

  
  //initialize dispatch
  const dispatch = useDispatch();
  

  const handleRegisterPress = () => {
    navigation.navigate("RegisterForm", { showBackButton: true });
  };

  const handleEmailChange = () => {
    passwordInputRef.current.focus();
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLoginPress = async () => {
    await dispatch(loginSuccess()); 
    navigation.navigate("Cá nhân");
  };
  
  return (
    <ScrollView automaticallyAdjustKeyboardInsets>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.inputView}>
          <Text style={styles.label}> Email/Số điện thoại </Text>
          <TextInput
            style={styles.input}
            placeholder="Email hoặc số điện thoại"
            value={username}
            onChangeText={setUsername}
            onSubmitEditing={handleEmailChange}
            returnKeyType="next"
            autoCorrect={false}
            autoFocus={true}
            autoCapitalize="none"
          />
          <Text style={styles.label}> Mật khẩu </Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Mật khẩu"
              secureTextEntry={!passwordVisible}
              value={password}
              onChangeText={setPassword}
              autoCorrect={false}
              ref={passwordInputRef}
              autoCapitalize="none"
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
        </View>
        <View style={styles.forgetView}>
          <View>
            <Pressable onPress={() => Alert.alert("Quên mật khẩu !")}>
              <Text style={styles.forgetText}>Quên mật khẩu ?</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress= {handleLoginPress}
          >
            <Text style={styles.buttonText}>Đăng nhập</Text>
          </Pressable>
          <Text style={styles.optionsText}>Hoặc Đăng nhập với</Text>
        </View>

        <View style={styles.mediaIcons}>
          <Image source={googleLogo} style={styles.icons} />
        </View>

        <Text style={styles.footerText}>
          Chưa có tài khoản?
          <Pressable onPress={handleRegisterPress}>
            <Text style={styles.signup}> Đăng ký ngay</Text>
          </Pressable>
        </Text>
      </View>
    </ScrollView>
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: deviceHeight < 1000 ? 80 : 100,
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
  forgetView: {
    width: "100%",
    paddingHorizontal: 45,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
  },
  switch: {
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  forgetText: {
    fontSize: 13,
    color: "#03a9f4",
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
    paddingHorizontal: 50,
  },
  optionsText: {
    textAlign: "center",
    paddingVertical: 10,
    color: "gray",
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    color: "gray",
    flexDirection: "row",
  },
  signup: {
    color: "#ffd31a",
    paddingTop: 1,
    fontSize: 13,
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
