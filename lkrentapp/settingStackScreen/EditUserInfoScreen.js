import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, Dimensions, ScrollView, Platform, Button, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width, height } = Dimensions.get('window');

const EditUserInfoScreen = () => {
  const [username, setUsername] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [gender, setGender] = useState('Nam'); // Default gender
  const [imageUri, setImageUri] = useState('https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg');

  const handleSave = () => {
    // Handle save logic here
    alert('Thông tin đã được lưu');
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
    }
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);  // Ensure the correct URI is used
    }
  };

  const handleConfirm = () => {
    setShowDatePicker(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.iconContainer} onPress={pickImage}>
          <FontAwesome5 name="user-edit" size={24} color="#666" />
        </TouchableOpacity>
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
            resizeMode="cover"
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
              {Platform.OS === 'ios' && (
                <View style={styles.confirmButtonContainer}>
                  <Button title="Xác nhận" onPress={handleConfirm} />
                </View>
              )}
              {Platform.OS === 'android' && (
                <View style={styles.confirmButtonContainer}>
                  <Button title="Xác nhận" onPress={handleConfirm} />
                </View>
              )}
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
    </ScrollView>
  );
};

export default EditUserInfoScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
});
