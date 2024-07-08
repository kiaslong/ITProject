import React, { useState, useRef, useCallback } from "react";
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch } from 'react-redux';
import { loginRequest, loginSuccess, loginFailure } from '../store/loginSlice';
import api from '../api';

const googleLogo = require("../assets/gglogo.png");

const deviceHeight = Dimensions.get("window").height;

const TextInputField = React.memo(({ label, valueRef, error, placeholder, onChange, secureTextEntry, refInput, onSubmitEditing, toggleVisibility }) => (
  <View>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, error ? styles.inputError : null]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        defaultValue={valueRef.current}
        onChange={onChange}
        autoCorrect={false}
        autoCapitalize="none"
        secureTextEntry={secureTextEntry}
        returnKeyType="next"
        ref={refInput}
        onSubmitEditing={onSubmitEditing}
      />
      {toggleVisibility && (
        <Pressable onPress={toggleVisibility} style={styles.eyeIcon}>
          <MaterialCommunityIcons
            name={secureTextEntry ? "eye-off" : "eye"}
            size={24}
            color="gray"
          />
        </Pressable>
      )}
    </View>
    {error ? (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={16} color="red" />
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ) : null}
  </View>
));

export default function LoginScreen() {
  const usernameRef = useRef("");
  const passwordRef = useRef("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    usernameError: "",
    passwordError: "",
  });

  const navigation = useNavigation();
  const passwordInputRef = useRef(null);

  const dispatch = useDispatch();

  const handleInputChange = useCallback((name, text) => {
    if (name === "username") {
      usernameRef.current = text;
    } else if (name === "password") {
      passwordRef.current = text;
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const clearErrorMessages = useCallback(() => {
    setErrors({
      usernameError: "",
      passwordError: "",
    });
  }, []);

  const validateInputs = useCallback(() => {
    let valid = true;
    const username = usernameRef.current.trim();
    const password = passwordRef.current.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;

    const newErrors = {
      usernameError: "",
      passwordError: "",
    };

    if (username === "") {
      newErrors.usernameError = "Email or phone number is required.";
      valid = false;
    } else if (!emailRegex.test(username) && !phoneRegex.test(username)) {
      newErrors.usernameError = "Username must be a valid email or phone number.";
      valid = false;
    }

    if (password === "") {
      newErrors.passwordError = "Password is required.";
      valid = false;
    } else if (password.length < 6) {
      newErrors.passwordError = "Password must contain at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  }, [clearErrorMessages]);

  const handleLoginPress = useCallback(async () => {
    if (validateInputs()) {
      dispatch(loginRequest());

      try {
        const response = await api.post('/auth/login', {
          email: usernameRef.current.trim(),
          password: passwordRef.current.trim(),
        });

        const { access_token } = response.data;

        dispatch(loginSuccess({ token: access_token }));
        navigation.navigate("Cá nhân");
      } catch (error) {
        dispatch(loginFailure());
        Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
      }
    }
  }, [validateInputs, dispatch, navigation]);

  const handleRegisterPress = useCallback(() => {
    navigation.navigate("RegisterScreen", { screenTitle:"Đăng ký" ,showTitle:true , showHeader:true, showBackButton: true , showCloseButton:true, animationType:"slide_from_bottom"});
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInputField
              label="Email/Số điện thoại"
              valueRef={usernameRef}
              error={errors.usernameError}
              placeholder="Email hoặc số điện thoại"
              onChange={(e) => handleInputChange("username", e.nativeEvent.text)}
              refInput={null}
              onSubmitEditing={() => passwordInputRef.current.focus()}
            />
            <TextInputField
              label="Mật khẩu"
              valueRef={passwordRef}
              error={errors.passwordError}
              placeholder="Mật khẩu"
              onChange={(e) => handleInputChange("password", e.nativeEvent.text)}
              secureTextEntry={!passwordVisible}
              refInput={passwordInputRef}
              onSubmitEditing={handleLoginPress}
              toggleVisibility={togglePasswordVisibility}
            />
          </View>

          <View style={styles.forgetView}>
            <Pressable onPress={() => Alert.alert("Quên mật khẩu !")}>
              <Text style={styles.forgetText}>Quên mật khẩu ?</Text>
            </Pressable>
          </View>

          <View style={styles.buttonView}>
            <Pressable
              style={styles.button}
              onPress={handleLoginPress}
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
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
  },
  container: {
    alignItems: "center",
    paddingTop: deviceHeight < 1000 ? 30 : 40,
  },
  inputView: {
    gap: 15,
    width: "100%",
    paddingHorizontal: 25,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#03a9f4",
    borderWidth: 1,
    borderRadius: 7,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 20,
  },
  inputError: {
    borderColor: "red",
  },
  label: {
    fontSize: deviceHeight < 1000 ? 14 : 16,
    fontWeight: "400",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
  forgetView: {
    width: "100%",
    paddingHorizontal: 45,
    alignItems: "center",
    flexDirection: "row",
    marginTop: 16,
    marginBottom: 16,
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
  eyeIcon: {
    paddingHorizontal: 10,
  },
});
