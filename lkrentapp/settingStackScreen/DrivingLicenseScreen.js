import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Alert, FlatList, ScrollView, Dimensions, Platform } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const { width } = Dimensions.get('window');

const DrivingLicenseScreen = () => {
  const [images, setImages] = useState([]);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [birthDate, setBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsMultipleSelection: true,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets.map(asset => asset.uri)]);
    }
  };

  const handleDeleteImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleUpdate = () => {
    Alert.alert('Thay đổi', 'Thông tin đã được cập nhật thành công');
  };

  const renderImageItem = ({ item, index }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(index)}>
        <MaterialCommunityIcons name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const onDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setBirthDate(selectedDate);
      setTimeout(() => {
        setShowDatePicker(false);
      }, 3000); // Close the picker after 3 seconds
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={[styles.imageListContainer, images.length === 0 && styles.centeredContainer]}>
        <FlatList
          data={images}
          renderItem={renderImageItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.imageList}
          ListFooterComponent={() => (
            <View style={styles.middleAddButtonContainer}>
              <TouchableOpacity style={styles.middleAddButton} onPress={pickImage}>
                <MaterialCommunityIcons name="camera-plus" size={48} color="black" />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
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
        <DateTimePicker
          value={birthDate}
          mode="date"
          display="spinner"
          onChange={onDateChange}
          style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Thay đổi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DrivingLicenseScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  imageListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  imageList: {
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: width / 2,
    height: width / 2,
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 5,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width / 4,
    height: width / 4,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  middleAddButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  middleAddButton: {
    justifyContent: 'center',
    alignItems: 'center',
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
});
