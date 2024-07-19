import React, { useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CheckBox } from "@rneui/themed";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useDispatch } from "react-redux";
import api from "../api"; // Import the Axios instance
import { loginSuccess } from "../store/loginSlice";
import { useNavigation ,CommonActions} from "@react-navigation/native";
import { saveToken } from "../utils/tokenStorage";

const RegisterScreen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [visibility, setVisibility] = useState({
    passwordVisible: false,
    retypePasswordVisible: false,
  });
  const [errors, setErrors] = useState({
    phoneNumberError: "",
    fullNameError: "",
    passwordError: "",
    retypePasswordError: "",
  });
  const [agree, setAgree] = useState(false);

  const dispatch = useDispatch();

  
 
  

  const toggleVisibility = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const clearErrorMessages = () => {
    setErrors({
      phoneNumberError: "",
      fullNameError: "",
      passwordError: "",
      retypePasswordError: "",
    });
  };

  const validateInputs = () => {
    let valid = true;
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedFullName = fullName.trim();
    const trimmedPassword = password.trim();
    const trimmedRetypePassword = retypePassword.trim();

    const phoneRegex = /^\d{10,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newErrors = {
      phoneNumberError: "",
      fullNameError: "",
      passwordError: "",
      retypePasswordError: "",
    };

    if (!trimmedPhoneNumber) {
      newErrors.phoneNumberError = "Phone number is required.";
      valid = false;
    } else if (!phoneRegex.test(trimmedPhoneNumber)) {
      newErrors.phoneNumberError = "Phone number is not valid.";
      valid = false;
    }

    if (!trimmedFullName) {
      newErrors.fullNameError = "Full name is required.";
      valid = false;
    }

    if (!trimmedPassword) {
      newErrors.passwordError = "Password is required.";
      valid = false;
    } else if (trimmedPassword.length < 8) {
      newErrors.passwordError = "Password must contain at least 8 characters.";
      valid = false;
    } else if (!passwordRegex.test(trimmedPassword)) {
      newErrors.passwordError =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (!trimmedRetypePassword) {
      newErrors.retypePasswordError = "Retype password is required.";
      valid = false;
    } else if (trimmedRetypePassword !== trimmedPassword) {
      newErrors.retypePasswordError = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };


  const navigation = useNavigation();

  const handleRegisterPress = async () => {
    if (validateInputs()) {
      try {
        const registerResponse = await api.post("/auth/register", {
          phoneNumber: phoneNumber.trim(),
          fullName: fullName.trim(),
          password: password.trim(),
        });

        

        // Automatically log in the user after successful registration
        const loginResponse = await api.post("/auth/login", {
          phoneNumber: phoneNumber.trim(),
          password: password.trim(),
        });

        const { token } = loginResponse.data;
        

        await saveToken(token.access_token);

        // Use the token to fetch user info
        const userInfoResponse = await api.get("/auth/info", {
          headers: {
            Authorization:token.access_token,
          },
        });

       

        const user = userInfoResponse.data;
        dispatch(loginSuccess({ user}));
        Alert.alert(
          "Registration Successful",
          "You have been registered and logged in successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                setTimeout(() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: "Main" }],
                    })
                  );
                  navigation.navigate("Main");
                }, 500); // Navigate to the main screen after 500ms
              },
            },
          ]
        );
      } catch (error) {
        console.error("Registration error:", error);
        Alert.alert(
          "Registration Failed",
          error.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <View style={styles.inputView}>
            {[
              {
                label: "Số điện thoại",
                value: phoneNumber,
                onChange: setPhoneNumber,
                error: errors.phoneNumberError,
                placeholder: "0123456789",
                name: "phoneNumber",
              },
              {
                label: "Họ và tên",
                value: fullName,
                onChange: setFullName,
                error: errors.fullNameError,
                placeholder: "Nguyễn Văn A",
                name: "fullName",
              },
              {
                label: "Mật khẩu",
                value: password,
                onChange: setPassword,
                error: errors.passwordError,
                placeholder: "Mật khẩu",
                name: "password",
                secure: !visibility.passwordVisible,
                toggleVisibility: () => toggleVisibility("passwordVisible"),
              },
              {
                label: "Xác nhận mật khẩu",
                value: retypePassword,
                onChange: setRetypePassword,
                error: errors.retypePasswordError,
                placeholder: "Nhập lại mật khẩu",
                name: "retypePassword",
                secure: !visibility.retypePasswordVisible,
                toggleVisibility: () =>
                  toggleVisibility("retypePasswordVisible"),
              },
            ].map((input, index) => (
              <View key={index} style={styles.inputGroup}>
                <Text style={styles.label}>{input.label}</Text>
                <View
                  style={[
                    styles.inputContainer,
                    input.error ? styles.inputError : null,
                  ]}
                >
                  <TextInput
                    style={styles.input}
                    placeholder={input.placeholder}
                    value={input.value}
                    onChangeText={input.onChange}
                    autoCorrect={false}
                    autoCapitalize="none"
                    secureTextEntry={input.secure}
                    returnKeyType="next"
                    onSubmitEditing={() => {
                      if (input.nextRef && input.nextRef.current) {
                        input.nextRef.current.focus();
                      }
                    }}
                  />
                  {input.toggleVisibility && (
                    <Pressable
                      onPress={input.toggleVisibility}
                      style={styles.eyeIcon}
                    >
                      <MaterialCommunityIcons
                        name={input.secure ? "eye-off" : "eye"}
                        size={24}
                        color="gray"
                      />
                    </Pressable>
                  )}
                </View>
                {input.error ? (
                  <View style={styles.errorContainer}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color="red"
                    />
                    <Text style={styles.errorText}>{input.error}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
          <View style={styles.buttonContainer}>
            <CheckBox
              title="Tôi đã đọc và đồng ý chính sách và quy định"
              checked={agree}
              onPress={() => setAgree(!agree)}
              containerStyle={styles.checkboxContainer}
              textStyle={{ fontWeight: "normal" }}
            />
            <Pressable
              style={[styles.button, !agree && styles.buttonDisabled]}
              onPress={handleRegisterPress}
              disabled={!agree}
            >
              <Text style={styles.buttonText}>Đăng ký</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  inputView: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  inputGroup: {
    marginBottom: 20,
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
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
  checkboxContainer: {
    marginLeft: 0,
    backgroundColor: "transparent",
    borderWidth: 0,
    marginBottom: 20,
  },
  buttonContainer: {
    marginHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#03a9f4",
    height: 45,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#dcdcdc",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
