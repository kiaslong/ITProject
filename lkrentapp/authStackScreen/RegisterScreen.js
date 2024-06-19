import React, { useState, useRef } from "react";
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
import api from "../api"; // Import the Axios instance

const RegisterScreen = () => {
  const phoneNumberRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const retypePasswordRef = useRef(null);

  const [visibility, setVisibility] = useState({
    passwordVisible: false,
    retypePasswordVisible: false,
  });
  const [errors, setErrors] = useState({
    phoneNumberError: "",
    emailError: "",
    passwordError: "",
    retypePasswordError: "",
  });

  const [agree, setAgree] = useState(false);

  const handleInputChange = (name, value) => {
    if (name === "phoneNumber") {
      phoneNumberRef.current = value;
    } else if (name === "email") {
      emailRef.current = value;
    } else if (name === "password") {
      passwordRef.current = value;
    } else if (name === "retypePassword") {
      retypePasswordRef.current = value;
    }
  };

  const toggleVisibility = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const clearErrorMessages = () => {
    setErrors({
      phoneNumberError: "",
      emailError: "",
      passwordError: "",
      retypePasswordError: "",
    });
  };

  const validateInputs = () => {
    let valid = true;
    const phoneNumber = phoneNumberRef.current?.trim();
    const email = emailRef.current?.trim();
    const password = passwordRef.current?.trim();
    const retypePassword = retypePasswordRef.current?.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newErrors = {
      phoneNumberError: "",
      emailError: "",
      passwordError: "",
      retypePasswordError: "",
    };

    if (!phoneNumber) {
      newErrors.phoneNumberError = "Phone number is required.";
      valid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      newErrors.phoneNumberError = "Phone number is not valid.";
      valid = false;
    }

    if (!email) {
      newErrors.emailError = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.emailError = "Email is not valid.";
      valid = false;
    }

    if (!password) {
      newErrors.passwordError = "Password is required.";
      valid = false;
    } else if (password.length < 8) {
      newErrors.passwordError = "Password must contain at least 8 characters.";
      valid = false;
    } else if (!passwordRegex.test(password)) {
      newErrors.passwordError =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (!retypePassword) {
      newErrors.retypePasswordError = "Retype password is required.";
      valid = false;
    } else if (retypePassword !== password) {
      newErrors.retypePasswordError = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };

  const handleRegisterPress = async () => {
    if (validateInputs()) {
      const email = emailRef.current?.trim();
      const phoneNumber = phoneNumberRef.current?.trim();
      const password = passwordRef.current?.trim();
      console.log("Registering with", { email, phoneNumber, password });
      try {
        const response = await api.post("/auth/register", {
          email,
          phoneNumber,
          password,
        });

        console.log("Registration response:", response.data);
        Alert.alert("Registration Successful", "You can now log in.");
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
                value: phoneNumberRef,
                error: errors.phoneNumberError,
                placeholder: "0123456789",
                nextRef: emailRef,
                name: "phoneNumber",
              },
              {
                label: "Email",
                value: emailRef,
                error: errors.emailError,
                placeholder: "philong@gmail.com",
                nextRef: passwordRef,
                name: "email",
              },
              {
                label: "Mật khẩu",
                value: passwordRef,
                error: errors.passwordError,
                placeholder: "Mật khẩu",
                nextRef: retypePasswordRef,
                name: "password",
                secure: !visibility.passwordVisible,
                toggleVisibility: () => toggleVisibility("passwordVisible"),
              },
              {
                label: "Xác nhận mật khẩu",
                value: retypePasswordRef,
                error: errors.retypePasswordError,
                placeholder: "Nhập lại mật khẩu",
                nextRef: null,
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
                    ref={input.value}
                    style={styles.input}
                    placeholder={input.placeholder}
                    defaultValue={input.value.current}
                    onChangeText={(text) => handleInputChange(input.name, text)}
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
