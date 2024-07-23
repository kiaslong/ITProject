import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Alert, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Animated } from 'react-native';
import { useDispatch } from 'react-redux';
import api from '../../api';
import { getToken } from '../../utils/tokenStorage';
import { updateUser } from '../../store/loginSlice'; // Import the updateUser action

const EmailVerificationScreen = ({ navigation, route }) => {
  const { initEmail } = route.params;
  const dispatch = useDispatch(); // Use useDispatch hook to get the dispatch function
  const [email, setEmail] = useState(initEmail);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpRequested, setOtpRequested] = useState(false);
  const inputs = useRef([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleRequestOtp = async () => {
    setLoading(true);
    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing.');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('auth/request-otp', { email }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { expiresAt } = response.data;

      const expiryTime = new Date(expiresAt).getTime();
      const currentTime = new Date().getTime();
      setTimeLeft(Math.floor((expiryTime - currentTime) / 1000));
      setOtpRequested(true);

      navigation.setParams({ screenTitle: "Xác thực OTP" });

      // Fade out the email input
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();

      Alert.alert('Thành công', 'Gửi otp thành công!');
    } catch (error) {
      if (error.response && error.response.status === 400 && error.response.data.message === 'Email is already verified') {
        Alert.alert('Error', error.response.data.message, [
          {
            text: 'OK', onPress: () => {
              setTimeout(() => {
                navigation.goBack();
              }, 600);
            }
          }
        ]);
      } else {
        console.error('Error:', error);
        Alert.alert('Error', 'Failed to send OTP.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleVerifyOtp = async () => {
    const otpCode = otp.join('');

    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'Authentication token is missing.');
      return;
    }

    try {
      await api.post('auth/verify-otp', { email, otp: otpCode }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Make a request to get the updated user info
      const userInfoResponse = await api.get('/auth/info', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const userData = userInfoResponse.data;
      dispatch(updateUser(userData)); // Dispatch the updateUser action to update the user data in the Redux store

      Alert.alert('Success', 'Email verified successfully!', [
        {
          text: 'OK', onPress: () => {
            navigation.navigate('UserInfoScreen', {
              showHeader: true,
              showTitle: true,
              showBackButton: true,
              screenTitle: "Tài khoản của tôi",
            });
          }
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to verify OTP.');
    }
  };

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

  const handleAutoReplace = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text.charAt(text.length - 1) || ''; // Ensure the new character replaces the old one
    setOtp(newOtp);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    } else if (!text && index > 0) {
      inputs.current[index - 1].focus();
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
          <Text style={styles.title}>{otpRequested ? 'Xác thực OTP' : 'Xác thực email'}</Text>
          <Text style={styles.subtitle}>{otpRequested ? 'Nhập mã OTP đã được gửi đến email của bạn' : 'Xác thực email của bạn'}</Text>
          {!otpRequested && (
            <Animated.View style={{ opacity: fadeAnim, width: '90%' }}>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </Animated.View>
          )}

          {loading ? (
            <ActivityIndicator size="large" color="#03a9f4" />
          ) : (
            !otpRequested && (
              <TouchableOpacity style={styles.requestButton} onPress={handleRequestOtp}>
                <Text style={styles.buttonText}>Tiếp theo</Text>
              </TouchableOpacity>
            )
          )}

          {otpRequested && (
            <>
              <View style={styles.inputContainer}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    style={styles.otpInput}
                    value={digit}
                    onChangeText={(text) => handleAutoReplace(text, index)}
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
                onPress={handleVerifyOtp} 
                disabled={timeLeft === 0}
              >
                <Text style={styles.buttonText}>Xác nhận OTP</Text>
              </TouchableOpacity>
            </>
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
    paddingTop: 40,
  },
  title: {
    marginLeft: 18,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    marginLeft: 18,
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginLeft: 16,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    width: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 15,
    fontSize: 15,
    textAlign: 'center',
    width: 50,
    marginHorizontal: 6,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    marginHorizontal: 20,
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timer: {
    alignSelf: 'center',
    fontSize: 16,
    color: '#f00',
    marginBottom: 20,
  },
  requestButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    width: '90%',
    backgroundColor: '#03a9f4',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default EmailVerificationScreen;
