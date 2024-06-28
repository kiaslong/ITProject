// ChangePasswordScreen.js
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ChangePasswordScreen = () => {
  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [visibility, setVisibility] = useState({
    oldPasswordVisible: false,
    newPasswordVisible: false,
    confirmPasswordVisible: false,
  });
  const [errors, setErrors] = useState({
    oldPasswordError: '',
    newPasswordError: '',
    confirmPasswordError: '',
  });

  const handleInputChange = (name, value) => {
    if (name === 'oldPassword') {
      oldPasswordRef.current = value;
    } else if (name === 'newPassword') {
      newPasswordRef.current = value;
    } else if (name === 'confirmPassword') {
      confirmPasswordRef.current = value;
    }
  };

  const toggleVisibility = (field) => {
    setVisibility({ ...visibility, [field]: !visibility[field] });
  };

  const clearErrorMessages = () => {
    setErrors({
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
    });
  };

  const validateInputs = () => {
    let valid = true;
    const oldPassword = oldPasswordRef.current?.trim();
    const newPassword = newPasswordRef.current?.trim();
    const confirmPassword = confirmPasswordRef.current?.trim();

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const newErrors = {
      oldPasswordError: '',
      newPasswordError: '',
      confirmPasswordError: '',
    };

    if (!oldPassword) {
      newErrors.oldPasswordError = 'Old password is required.';
      valid = false;
    }

    if (!newPassword) {
      newErrors.newPasswordError = 'New password is required.';
      valid = false;
    } else if (!passwordRegex.test(newPassword)) {
      newErrors.newPasswordError =
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.';
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPasswordError = 'Confirm password is required.';
      valid = false;
    } else if (confirmPassword !== newPassword) {
      newErrors.confirmPasswordError = 'Passwords do not match.';
      valid = false;
    }

    setErrors(newErrors);

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };

  const handleChangePasswordPress = () => {
    if (validateInputs()) {
      // Add your password change logic here
      Alert.alert('Success', 'Your password has been changed.');
    }
  };

  return (
    <View style={styles.container}>
      {[
        {
          label: 'Nhập mật khẩu cũ',
          value: oldPasswordRef,
          error: errors.oldPasswordError,
          placeholder: 'Nhập mật khẩu cũ',
          nextRef: newPasswordRef,
          name: 'oldPassword',
          secure: !visibility.oldPasswordVisible,
          toggleVisibility: () => toggleVisibility('oldPasswordVisible'),
        },
        {
          label: 'Nhập mật khẩu mới',
          value: newPasswordRef,
          error: errors.newPasswordError,
          placeholder: 'Nhập mật khẩu mới',
          nextRef: confirmPasswordRef,
          name: 'newPassword',
          secure: !visibility.newPasswordVisible,
          toggleVisibility: () => toggleVisibility('newPasswordVisible'),
        },
        {
          label: 'Xác nhận mật khẩu mới',
          value: confirmPasswordRef,
          error: errors.confirmPasswordError,
          placeholder: 'Xác nhận mật khẩu mới',
          nextRef: null,
          name: 'confirmPassword',
          secure: !visibility.confirmPasswordVisible,
          toggleVisibility: () => toggleVisibility('confirmPasswordVisible'),
        },
      ].map((input, index) => (
        <View key={index} style={styles.inputGroup}>
          <Text style={styles.label}>{input.label}</Text>
          <View style={[styles.inputContainer, input.error ? styles.inputError : null]}>
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
              <Pressable onPress={input.toggleVisibility} style={styles.eyeIcon}>
                <MaterialCommunityIcons
                  name={input.secure ? 'eye-off' : 'eye'}
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
      <TouchableOpacity style={styles.button} onPress={handleChangePasswordPress}>
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
    justifyContent: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  eyeIcon: {
    paddingHorizontal: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#03a9f4',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
