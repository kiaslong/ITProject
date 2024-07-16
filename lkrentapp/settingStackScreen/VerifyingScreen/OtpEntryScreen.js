import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import axios from 'axios';

const OtpEntryScreen = ({ route }) => {
  const { phoneNumber } = route.params;
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      const response = await axios.post('http://localhost:3000/sms-otp/verify', { phoneNumber, otp });
      console.log('Response:', response.data);
      Alert.alert('Success', 'OTP verified successfully!');
      // Navigate to the next screen or handle successful verification here
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to verify OTP.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Nhập mã OTP</Text>
          <Text style={styles.subtitle}>Mã OTP đã được gửi đến số điện thoại của bạn</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Mã OTP</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
            />
          </View>
          
          <TouchableOpacity style={styles.button} onPress={handleVerify}>
            <Text style={styles.buttonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OtpEntryScreen;
