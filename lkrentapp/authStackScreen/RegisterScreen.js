import React, { useState, useRef } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../api'; // Import the Axios instance

const deviceHeight = Dimensions.get("window").height;

const RegisterScreen = () => {
  const phoneNumberRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const retypePasswordRef = useRef("");

  const [visibility, setVisibility] = useState({
    passwordVisible: false,
    retypePasswordVisible: false,
  });
  const [errors, setErrors] = useState({
    phoneNumberError: "",
    emailError: "",
    passwordError: "",
    retypePasswordError: ""
  });

  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const retypePasswordInputRef = useRef(null);

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
      retypePasswordError: ""
    });
  };

  const validateInputs = () => {
    let valid = true;
    const phoneNumber = phoneNumberRef.current.trim();
    const email = emailRef.current.trim();
    const password = passwordRef.current.trim();
    const retypePassword = retypePasswordRef.current.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{10,15}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newErrors = {
      phoneNumberError: "",
      emailError: "",
      passwordError: "",
      retypePasswordError: ""
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
      newErrors.passwordError = "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
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
      const email = emailRef.current.trim();
      const phoneNumber = phoneNumberRef.current.trim();
      const password = passwordRef.current.trim();
      console.log('Registering with', { email, phoneNumber, password });
      try {
        const response = await api.post('/auth/register', {
          email,
          phoneNumber,
          password,
        });

        console.log('Registration response:', response.data);
        Alert.alert('Registration Successful', 'You can now log in.');
      } catch (error) {
        console.error('Registration error:', error);
        Alert.alert('Registration Failed', error.response?.data?.message || 'Something went wrong');
      }
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>
        <View style={styles.inputView}>
          {[
            { label: "Số điện thoại", value: phoneNumberRef, error: errors.phoneNumberError, placeholder: "0123456789", ref: null, nextRef: emailInputRef, name: "phoneNumber" },
            { label: "Email", value: emailRef, error: errors.emailError, placeholder: "philong@gmail.com", ref: emailInputRef, nextRef: passwordInputRef, name: "email" },
            { label: "Mật khẩu", value: passwordRef, error: errors.passwordError, placeholder: "Mật khẩu", ref: passwordInputRef, nextRef: retypePasswordInputRef, name: "password", secure: !visibility.passwordVisible, toggleVisibility: () => toggleVisibility('passwordVisible') },
            { label: "Xác nhận mật khẩu", value: retypePasswordRef, error: errors.retypePasswordError, placeholder: "Nhập lại mật khẩu", ref: retypePasswordInputRef, nextRef: null, name: "retypePassword", secure: !visibility.retypePasswordVisible, toggleVisibility: () => toggleVisibility('retypePasswordVisible') }
          ].map((input, index) => (
            <View key={index}>
              <Text style={styles.label}>{input.label}</Text>
              <View style={[styles.inputContainer, input.error ? styles.inputError : null]}>
                <TextInput
                  ref={input.ref}
                  style={styles.input}
                  placeholder={input.placeholder}
                  defaultValue={input.value.current}
                  onChange={(e) => handleInputChange(input.name, e.nativeEvent.text)}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={input.secure}
                  returnKeyType="next"
                  onSubmitEditing={() => input.nextRef && input.nextRef.current.focus()}
                />
                {input.toggleVisibility && (
                  <Pressable onPress={input.toggleVisibility} style={styles.eyeIcon}>
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
                  <MaterialCommunityIcons name="alert-circle" size={16} color="red" />
                  <Text style={styles.errorText}>{input.error}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
        <View style={styles.buttonView}>
          <Pressable
            style={styles.button}
            onPress={handleRegisterPress}
          >
            <Text style={styles.buttonText}>Đăng ký</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

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
  eyeIcon: {
    paddingHorizontal: 10,
  },
});

export default RegisterScreen;
