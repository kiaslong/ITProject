import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import api from '../../api';

const OTP_VALIDITY_DURATION = 3 * 60 * 1000; // 3 minutes in milliseconds

const OtpEntryScreen = ({ route, navigation }) => {
  const { pinId, createdTime } = route.params;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date().getTime();
    const created = new Date(createdTime).getTime();
    const initialTimeLeft = Math.max(0, Math.floor((created + OTP_VALIDITY_DURATION - now) / 1000));
    return initialTimeLeft;
  });
  const inputs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    try {
      const response = await api.post('/sms-otp/verify', { pinId, code: otpCode });
      Alert.alert('Success', 'Your phone number has been verified successfully!', [
        {
          text: 'OK', onPress: () => {
            setTimeout(() => {
              navigation.navigate('UserInfoScreen',{ showHeader: true,
                showTitle: true,
                showBackButton: true,
                screenTitle: "Tài khoản của tôi",
                });
            }, 1000);
          }
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to verify OTP.');
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Nhập mã OTP</Text>
          <Text style={styles.subtitle}>Mã OTP đã được gửi đến số điện thoại của bạn</Text>
          
          <View style={styles.inputContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.input}
                value={digit}
                onChangeText={(text) => handleChange(text, index)}
                keyboardType="number-pad"
                maxLength={1}
                ref={(el) => (inputs.current[index] = el)}
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === 'Backspace' && !digit && index > 0) {
                    inputs.current[index - 1].focus();
                  }
                }}
              />
            ))}
          </View>

          <Text style={styles.timer}>Thời gian còn lại: {formatTime(timeLeft)}</Text>
          
          <TouchableOpacity 
            style={[styles.button, timeLeft === 0 && styles.disabledButton]} 
            onPress={handleVerify} 
            disabled={timeLeft === 0}
          >
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
    alignItems: 'center', // Center the content horizontally
  },
  disabledButton: {
    backgroundColor: '#cccccc',
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
    textAlign: 'center', // Center the subtitle text
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Space out the input boxes evenly
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    textAlign: 'center', // Center the text inside the input box
    width: 50, // Width of each input box
    marginHorizontal: 5, // Space between input boxes
  },
  timer: {
    fontSize: 16,
    color: '#f00',
    marginBottom: 20,
    textAlign: 'center',
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
