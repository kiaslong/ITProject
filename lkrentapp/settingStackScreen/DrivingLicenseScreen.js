import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, Dimensions, Platform, Modal, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button as PaperButton, Dialog, Portal, Provider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useNavigation } from '@react-navigation/native';
import api from '../api';
import { useSelector } from 'react-redux';
import { getToken } from '../utils/tokenStorage';
import { useDispatch } from 'react-redux';
import { updateUser } from '../store/loginSlice';

const { width } = Dimensions.get('window');

const DrivingLicenseScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.loggedIn.user);
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [image, setImage] = useState(null);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [expireDate, setExpireDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [cameraType, setCameraType] = useState('back');
  const [isVerified, setIsVerified] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const cameraRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }

    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      
      const token = await getToken();
      
      // Fetch driving license data
      const licenseResponse = await api.get(`auth/${user.id}/driving-licenses`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (licenseResponse.status === 200) {
        const { drivingLicenseUrl, drivingLicenseFullName, drivingLicenseDOB, drivingLicenseNumber, drivingLicenseVerified, drivingLicenseExpireDate } = licenseResponse.data;
        setImage(drivingLicenseUrl);
        setFullName(drivingLicenseFullName);
        setBirthDate(new Date(drivingLicenseDOB));
        setLicenseNumber(drivingLicenseNumber);
        setIsVerified(drivingLicenseVerified);
        setExpireDate(drivingLicenseExpireDate);
      } else {
        Alert.alert('Error', 'Failed to fetch driving license data');
      }

      // Fetch user info
      const userInfoResponse = await api.get("/auth/info", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (userInfoResponse.status === 200) {
        dispatch(updateUser(userInfoResponse.data));
      } else {
        Alert.alert('Error', 'Failed to fetch user info');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };


  const pickImageFromLibrary = async () => {
    setPromptVisible(false);
    setCameraVisible(false);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
      console.log(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    setPromptVisible(false);
    setCameraVisible(true);
  };

  const handleCapture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ quality: 1, base64: true });
      setImage(photo.uri);
      console.log(photo.uri);
      setCameraVisible(false);
    }
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: image,
        name: 'license.jpg',
        type: 'image/jpeg',
      });
      formData.append('drivingLicenseFullName', fullName);
      formData.append('drivingLicenseDOB', birthDate.toISOString());
      formData.append('drivingLicenseNumber', licenseNumber);

      const userId = user.id;
      const token = await getToken();

      const response = await api.put(`auth/${userId}/upload-driving-license`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        Alert.alert('Thành công', 'Giấy phép lái xe cập nhật thành công', [
          {
            text: "OK",
            onPress: () => {
              setTimeout(() => {
                navigation.goBack();
              }, 500);
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Failed to update driving license');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update driving license');
    } finally {
      setIsUpdating(false);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    setShowDatePicker(false);
  };

  const toggleCameraFacing = () => {
    setCameraType(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!hasPermission) {
    return <View />;
  }

  if (!hasPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <PaperButton mode="contained" onPress={requestPermission}>
          Grant Permission
        </PaperButton>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03a9f4" />
      </View>
    );
  }

  return (
    <Provider>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled={true}
      >
        <View style={styles.imageUploadContainer}>
          <TouchableOpacity style={styles.imageUploadButton} onPress={() => setPromptVisible(true)}>
            {image ? (
              <Image source={{ uri: image }} style={styles.uploadedImage} resizeMode="cover" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <MaterialCommunityIcons name="camera-plus" size={48} color="black" />
                <Text>Ảnh mặt trước GPLX</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        {image && !isVerified && (
          <Text style={styles.verificationText}>Đang chờ duyệt</Text>
        )}

          {expireDate && (
          <>
              <View style={styles.dateContainer}>
              <Text style={styles.label}>Ngày hết hạn:</Text>
              <Text style={styles.expireDateText}>{expireDate}</Text>
              </View>
          </>
        )}
        <Text style={styles.inputLabel}>Số giấy phép lái xe</Text>
        <TextInput
          style={styles.input}
          placeholder="Số giấy phép lái xe"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
        />
        <Text style={styles.inputLabel}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />
        <Text style={styles.inputLabel}>Ngày sinh</Text>
        <TouchableOpacity style={styles.dateInput} onPress={showDatePickerModal}>
          <Text style={styles.dateText}>{birthDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}</Text>
        </TouchableOpacity>
        
        {showDatePicker && (
          <Modal
            transparent={true}
            animationType="none"
            visible={showDatePicker}
            onRequestClose={() => setShowDatePicker(false)}
          >
            <View style={styles.modalBackground}>
              <View style={styles.datePickerContainer}>
                <DateTimePicker
                  value={birthDate}
                  mode="date"
                  display="spinner"
                  onChange={onDateChange}
                  style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
                />
                <View style={styles.confirmButtonContainer}>
                  <PaperButton mode="contained" onPress={handleConfirm}>
                    Xác nhận
                  </PaperButton>
                </View>
              </View>
            </View>
          </Modal>
        )}
        <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={isUpdating}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.buttonText}>Thay đổi</Text>
          )}
        </TouchableOpacity>

        <Portal>
          <Dialog style={styles.customModalContainer} visible={promptVisible} onDismiss={() => setPromptVisible(false)}>
            <Dialog.Title>Chọn phương thức</Dialog.Title>
            <Dialog.Actions>
              <PaperButton textColor='#03a9f4' labelStyle={styles.modalButton} onPress={pickImageFromLibrary}>Chọn từ thư viện</PaperButton>
            </Dialog.Actions>
            <Dialog.Actions>
              <PaperButton textColor='#03a9f4' onPress={openCamera}>Chụp ảnh</PaperButton>
            </Dialog.Actions>
            <Dialog.Actions>
              <PaperButton textColor='#03a9f4' onPress={() => setPromptVisible(false)}>Đóng</PaperButton>
            </Dialog.Actions>
          </Dialog>
        </Portal>

        {cameraVisible && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={cameraVisible}
            onRequestClose={() => {
              setCameraVisible(false);
            }}
          >
            <View style={styles.cameraContainer}>
              <CameraView style={styles.camera} type={cameraType} ref={cameraRef}>
                <View style={styles.cameraButtonContainer}>
                  <TouchableOpacity style={styles.cameraButton} onPress={handleCapture}>
                    <Text style={styles.cameraButtonText}>Chụp ảnh</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cameraButton} onPress={pickImageFromLibrary}>
                    <Text style={styles.cameraButtonText}>Chọn từ thư viện</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          </Modal>
        )}
      </KeyboardAwareScrollView>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  imageUploadContainer: {
    width: '100%',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageUploadButton: {
    width: '100%',
    height: width / 1.5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  verificationText: {
    color: 'red',
    marginVertical: 10,
    fontSize: 16,
  },
  inputLabel: {
    width: '100%',
    marginVertical: 5,
    fontSize: 16,
  },
  input: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
  },
  dateInput: {
    width: '100%',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 10,
    justifyContent: 'center',
  },
  dateText: {
    textAlign: 'left',
  },
  datePickerIOS: {
    width: '100%',
  },
  button: {
    backgroundColor: '#03a9f4',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  confirmButtonContainer: {
    marginTop: 10,
  },
  customModalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  cameraButtonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'center',
  },
  cameraButton: {
    alignSelf: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#03a9f4',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    marginHorizontal: 5,
  },
  cameraButtonText: {
    fontSize: 18,
    color: 'white',
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
    marginVertical: 10,
  },
  expireDateText: {
    color: '#03a9f4',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:10,
    marginBottom:10,
  },
  label:{
    fontSize:16,
    marginLeft:10,
    marginBottom:10,
  }
});

export default DrivingLicenseScreen;