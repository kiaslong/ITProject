import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import api from '../../api';

const PhoneVerificationScreen = ({ navigation ,route}) => {
  const { initPhoneNumber } = route.params;
  const [phoneNumber, setPhoneNumber] = useState(initPhoneNumber);
  const [loading, setLoading] = useState(false);

  const validatePhoneNumber = (number) => {
    const phoneRegex = /^\d{10}$/; // Adjust this regex to match your phone number format
    return phoneRegex.test(number);
  };

  const handleContinue = async () => {
    const formattedPhoneNumber = phoneNumber.startsWith('+84') ? phoneNumber : `+84${phoneNumber}`;
    
    if (!validatePhoneNumber(phoneNumber)) {
      Alert.alert('Error', 'Please enter a valid phone number.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('sms-otp/request', { phoneNumber: formattedPhoneNumber });
      if (response.data.success) {
        const { pinId, createdTime } = response.data;
        Alert.alert('Success', 'OTP sent successfully!', [
          {
            text: 'OK', onPress: () => {
              setTimeout(() => {
                navigation.navigate('OtpEntry', { 
                  phoneNumber: formattedPhoneNumber, 
                  pinId, 
                  createdTime, 
                  showBackButton: true,
                  showCloseButton: true,
                  showHeader: true,
                  showTitle: true,
                  screenTitle: "Nhập OTP"
                });
              }, 1000);
            }
          }
        ]);
      } else {
        Alert.alert('Error', response.data.message, [
          {
            text: 'OK', onPress: () => {
              setTimeout(() => {
                navigation.goBack();
              }, 1000);
            }
          }
        ]);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Xác thực số điện thoại</Text>
          <Text style={styles.subtitle}>Xác thực số điện thoại của bạn</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số điện thoại của bạn"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
          </View>
          
          {loading ? (
            <ActivityIndicator size="large" color="#03a9f4" />
          ) : (
            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Tiếp theo</Text>
            </TouchableOpacity>
          )}
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

export default PhoneVerificationScreen;
