import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Platform, Button, Modal, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "../api";
import { useDispatch } from "react-redux";
import { updateUser } from "../store/loginSlice";
import { useNavigation } from '@react-navigation/native';
import { getToken } from '../utils/tokenStorage';
import { useSelector } from 'react-redux';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const EditUserInfoScreen = ({ route }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const placeholderImage = require("../assets/placeholder.png")
  const user = useSelector(state => state.loggedIn.user);
  const userId = user.id;
  const [username, setUsername] = useState(user.fullName);
  const [birthDate, setBirthDate] = useState(new Date(user.dateOfBirth));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState(user.gender);
  const [imageUri, setImageUri] = useState(user?.avatarUrl || placeholderImage);
  const [loading, setLoading] = useState(false);
  const [showImageSourceModal, setShowImageSourceModal] = useState(false);
  const blurhash =
    '|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[';

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', username);
      formData.append('dateOfBirth', birthDate.toISOString());
      formData.append('gender', gender);
      if (imageUri && !imageUri.startsWith('http')) {
        formData.append('avatar', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      }
      const token = await getToken();

      await api.put(`/auth/${userId}/profile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: token
        },
      });

      const userInfoResponse = await api.get("/auth/info", {
        headers: {
          Authorization: token,
        },
      });

      dispatch(updateUser(userInfoResponse.data));

      Alert.alert('Thông tin đã được lưu', '', [
        {
          text: "OK",
          onPress: () => {
            setTimeout(() => {
              navigation.goBack();
            }, 500);
          },
        },
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  const openImageSourceModal = () => {
    setShowImageSourceModal(true);
  };

  const pickImage = async (useCamera = false) => {
    try {
      let permissionResult;
      if (useCamera) {
        permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      } else {
        permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (permissionResult.granted === false) {
        Alert.alert("Permission Denied", useCamera ? 
          "You've refused to allow this app to access your camera!" :
          "You've refused to allow this app to access your photos!");
        return;
      }

      const result = await (useCamera ? 
        ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }) :
        ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        }));

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', useCamera ? 'Error capturing image' : 'Error picking image');
    } finally {
      setShowImageSourceModal(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const handleConfirm = () => {
    setShowDatePicker(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#03a9f4" />
        </View>
      )}
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={openImageSourceModal}>
          <FontAwesome5 name="user-edit" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={openImageSourceModal}>
          <Image
            source={ imageUri }
            style={styles.image}
            contentFit='cover'
            cachePolicy="disk"
            placeholder={blurhash}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.inputLabel}>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên người dùng"
        value={username}
        onChangeText={setUsername}
      />
      <Text style={styles.inputLabel}>Ngày sinh</Text>
      <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateText}>
          {birthDate.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <Modal
          transparent={true}
          animationType="slide"
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
                <Button title="Xác nhận" onPress={handleConfirm} />
              </View>
            </View>
          </View>
        </Modal>
      )}
      <Text style={styles.inputLabel}>Giới tính</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'Nam' && styles.genderOptionSelected]}
          onPress={() => setGender('Nam')}
        >
          <Text style={styles.genderText}>Nam</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderOption, gender === 'Nữ' && styles.genderOptionSelected]}
          onPress={() => setGender('Nữ')}
        >
          <Text style={styles.genderText}>Nữ</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Lưu</Text>
      </TouchableOpacity>

      <Modal
        transparent={true}
        animationType="slide"
        visible={showImageSourceModal}
        onRequestClose={() => setShowImageSourceModal(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.imageSourceContainer}>
            <TouchableOpacity style={styles.imageSourceOption} onPress={() => pickImage(false)}>
              <FontAwesome5 name="images" size={24} color="#03a9f4" />
              <Text style={styles.imageSourceText}>Chọn từ thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageSourceOption} onPress={() => pickImage(true)}>
              <FontAwesome5 name="camera" size={24} color="#03a9f4" />
              <Text style={styles.imageSourceText}>Chụp ảnh mới</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowImageSourceModal(false)}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
    zIndex: 1,
  },
  image: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.15,
    borderWidth: 2,
    borderColor: '#01579b',
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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  genderOptionSelected: {
    borderColor: '#03a9f4',
    backgroundColor: 'rgba(3, 169, 244, 0.2)',
  },
  genderText: {
    fontSize: 16,
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
  imageSourceContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  imageSourceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    width: '100%',
  },
  imageSourceText: {
    marginLeft: 15,
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
  },
  cancelButtonText: {
    color: '#03a9f4',
    fontSize: 16,
  },
});

export default EditUserInfoScreen;