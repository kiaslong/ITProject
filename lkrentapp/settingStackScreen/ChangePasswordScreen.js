import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { encryptPassword } from "../utils/cryptoUtil";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/loginSlice";
import { getToken, removeToken } from "../utils/tokenStorage"; // Import your utility to remove the token
import api from "../api";
import { useNavigation } from "@react-navigation/native";

const ChangePasswordScreen = () => {
  const user = useSelector((state) => state.loggedIn.user);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [visibility, setVisibility] = useState({
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });
  const [errors, setErrors] = useState({
    oldPasswordError: "",
    newPasswordError: "",
    confirmPasswordError: "",
  });

  const toggleVisibility = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const clearErrorMessages = () => {
    setErrors({
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
    });
  };

  const validateInputs = () => {
    let valid = true;
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newErrors = {
      oldPasswordError: "",
      newPasswordError: "",
      confirmPasswordError: "",
    };

    if (!oldPassword) {
      newErrors.oldPasswordError = "Old password is required.";
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPasswordError = "New password is required.";
      valid = false;
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPasswordError =
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPasswordError = "Confirm password is required.";
      valid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPasswordError = "Passwords do not match.";
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };

  const handleChangePasswordPress = async () => {
    const token = await getToken();
    if (validateInputs()) {
      try {
        const encryptedOldPassword = await encryptPassword(oldPassword.trim());
        const encryptedNewPassword = await encryptPassword(newPassword.trim());

        // Call your API to change the password
        await api.put(
          `/auth/${user.id}/change-password`,
          {
            currentPassword: encryptedOldPassword,
            newPassword: encryptedNewPassword,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        Alert.alert("Đổi mật khẩu thành công", "Vui lòng đăng nhập lại.", [
          {
            text: "OK",
            onPress: async () => {
              await removeToken();
              await dispatch(logout());

              navigation.reset({
                index: 0,
                routes: [{ name: "Đăng nhập" }],
              });
            },
          },
        ]);
      } catch (error) {
        Alert.alert(
          "Change Password Failed",
          error.response?.data?.message || "Something went wrong"
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      {[
        {
          label: "Nhập mật khẩu cũ",
          value: oldPassword,
          setValue: setOldPassword,
          error: errors.oldPasswordError,
          placeholder: "Nhập mật khẩu cũ",
          secure: !visibility.oldPasswordVisible,
          toggleVisibility: () => toggleVisibility("oldPasswordVisible"),
        },
        {
          label: "Nhập mật khẩu mới",
          value: newPassword,
          setValue: setNewPassword,
          error: errors.newPasswordError,
          placeholder: "Nhập mật khẩu mới",
          secure: !visibility.newPasswordVisible,
          toggleVisibility: () => toggleVisibility("newPasswordVisible"),
        },
        {
          label: "Xác nhận mật khẩu mới",
          value: confirmPassword,
          setValue: setConfirmPassword,
          error: errors.confirmPasswordError,
          placeholder: "Xác nhận mật khẩu mới",
          secure: !visibility.confirmPasswordVisible,
          toggleVisibility: () => toggleVisibility("confirmPasswordVisible"),
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
              onChangeText={input.setValue}
              autoCorrect={false}
              autoCapitalize="none"
              secureTextEntry={input.secure}
              returnKeyType="next"
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
      <TouchableOpacity
        style={styles.button}
        onPress={handleChangePasswordPress}
      >
        <Text style={styles.buttonText}>Đổi mật khẩu</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "flex-start",
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: "red",
  },
  eyeIcon: {
    paddingHorizontal: 10,
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
  button: {
    backgroundColor: "#03a9f4",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
