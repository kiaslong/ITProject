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
import { useDispatch } from "react-redux";
import { loginRequest, loginSuccess, loginFailure } from "../store/loginSlice";
import api from "../api";
import { saveToken } from "../utils/tokenStorage";
import { encryptPassword } from "../utils/cryptoUtil";


const deviceHeight = Dimensions.get("window").height;

const TextInputField = React.memo(
  ({
    label,
    valueRef,
    error,
    placeholder,
    onChange,
    secureTextEntry,
    refInput,
    onSubmitEditing,
    toggleVisibility,
  }) => (
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
  )
);



export default function LoginScreen() {
  const phoneNumberRef = useRef("");
  const passwordRef = useRef("");

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({
    phoneNumberError: "",
    passwordError: "",
  });

  const navigation = useNavigation();
  const passwordInputRef = useRef(null);

  const dispatch = useDispatch();

  const handleInputChange = useCallback((name, text) => {
    if (name === "phoneNumber") {
      phoneNumberRef.current = text;
    } else if (name === "password") {
      passwordRef.current = text;
    }
  }, []);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const clearErrorMessages = useCallback(() => {
    setErrors({
      phoneNumberError: "",
      passwordError: "",
    });
  }, []);

  const validateInputs = useCallback(() => {
    let valid = true;
    const phoneNumber = phoneNumberRef.current.trim();
    const password = passwordRef.current.trim();

    const phoneRegex = /^\d{10,15}$/;

    const newErrors = {
      phoneNumberError: "",
      passwordError: "",
    };

    if (phoneNumber === "") {
      newErrors.phoneNumberError = "Phone number is required.";
      valid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumberError = "Phone number is not valid.";
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
        const phoneNumber = phoneNumberRef.current.trim();
        const password = passwordRef.current.trim();

        const encryptedPassword = await encryptPassword(password);

        const response = await api.post("/auth/login", {
          phoneNumber,
          password: encryptedPassword,
        });


        const { token } = response.data;

        await saveToken(token.access_token); // Save the token

        const userInfoResponse = await api.get("/auth/info", {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        });

        const user = userInfoResponse.data;
        dispatch(loginSuccess({ user }));
        navigation.navigate("Cá nhân");
      } catch (error) {
        dispatch(loginFailure());
        Alert.alert(
          "Login Failed",
          error.response?.data?.message ==="Invalid credentials" ? "Sai SĐT hay mật khẩu" : error.response?.data?.message  || "Something went wrong"
        );
      }
    }
  }, [validateInputs, dispatch, navigation]);

  const handleRegisterPress = useCallback(() => {
    navigation.navigate("RegisterScreen", {
      screenTitle: "Đăng ký",
      showTitle: true,
      showHeader: true,
      showBackButton: true,
      showCloseButton: true,
      animationType: "slide_from_bottom",
    });
  }, [navigation]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.outerContainer}>
        <View style={styles.container}>
          <View style={styles.inputView}>
            <TextInputField
              label="Số điện thoại"
              valueRef={phoneNumberRef}
              error={errors.phoneNumberError}
              placeholder="Số điện thoại"
              onChange={(e) =>
                handleInputChange("phoneNumber", e.nativeEvent.text)
              }
              refInput={null}
              onSubmitEditing={() => passwordInputRef.current.focus()}
            />
            <TextInputField
              label="Mật khẩu"
              valueRef={passwordRef}
              error={errors.passwordError}
              placeholder="Mật khẩu"
              onChange={(e) =>
                handleInputChange("password", e.nativeEvent.text)
              }
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
            <Pressable style={styles.button} onPress={handleLoginPress}>
              <Text style={styles.buttonText}>Đăng nhập</Text>
            </Pressable>
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
    paddingTop: 30,
    fontSize: 13,
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});
