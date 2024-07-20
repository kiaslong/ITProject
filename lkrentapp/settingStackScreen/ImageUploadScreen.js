import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { resetRegistration, setImages } from '../store/registrationSlice';
import { registerFunction} from '../store/functionRegistry';

const ImageUploadScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const images = useSelector((state) => state.registration.images);



  useEffect(() => {
    const key = 'closeRegister';
    const onPress = () => {
      Alert.alert(
        "Thoát đăng ký",
        "Bạn chắc chắn muốn thoát?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "OK", onPress: () => {
              dispatch(resetRegistration())
              navigation.navigate('UserRegisterCarScreen', {
                showHeader: true,
                showTitle: true,
                showBackButton: true,
                screenTitle: "Đăng ký xe",
                showCloseButton: true,
                animationType: "slide_from_bottom",
                functionName:"registerCar",
                showIcon:true,
                iconName:"car"
              });
            } 
          }
        ]
      );
    };

    registerFunction(key, onPress);

    
  }, [navigation]);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
        if (mediaStatus !== 'granted' || cameraStatus !== 'granted') {
          alert('Sorry, we need camera roll and camera permissions to make this work!');
        }
      }
    })();
  }, []);

  const handlePickImage = async (position, source) => {
    let result;
    if (source === 'library') {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });
    }

    if (!result.canceled) {
      dispatch(setImages({ [position]: result.assets[0].uri }));
    }
  };

  const handleSelectImageSource = (position) => {
    Alert.alert(
      'Chọn nguồn ảnh',
      'Chọn ảnh từ thư viện hoặc chụp ảnh mới?',
      [
        {
          text: 'Thư viện',
          onPress: () => handlePickImage(position, 'library'),
        },
        {
          text: 'Máy ảnh',
          onPress: () => handlePickImage(position, 'camera'),
        },
        {
          text: 'Hủy',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteImage = (position) => {
    dispatch(setImages({ [position]: null }));
  };

  const handleContinue = () => {
    const requiredImages = ['avatar', 'front', 'back', 'left', 'right'];
    for (let image of requiredImages) {
      if (!images[image]) {
        Alert.alert('Vui lòng chọn tất cả các hình ảnh yêu cầu.');
        return;
      }
    }
    navigation.navigate('DocumentUploadScreen', {
      showHeader: true,
      showTitle: true,
      showBackButton: true,
      screenTitle: 'Hình ảnh giấy tờ',
      showIcon: true,
      iconName: 'close-circle-outline',
      iconType: 'ionicons',
      functionName: 'closeRegister',
    });
  };

  const renderImageBox = (label, position) => (
    <Pressable style={styles.imageBox} onPress={() => handleSelectImageSource(position)}>
      {images[position] ? (
        <>
          <Image source={{ uri: images[position] }} style={styles.image} />
          <Pressable style={styles.deleteButton} onPress={() => handleDeleteImage(position)}>
            <Text style={styles.deleteButtonText}>X</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.placeholderText}>{label}</Text>
      )}
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ảnh xe</Text>
      <Text style={styles.instructions}>
        Bạn vui lòng đăng ít nhất 4 ảnh (Trước - sau - trái - phải) để tăng hiệu quả cho thuê
      </Text>
      <View style={styles.imagesContainer}>
        {renderImageBox('Ảnh đại diện', 'avatar')}
        <View style={styles.row}>
          {renderImageBox('Ảnh trước', 'front')}
          {renderImageBox('Ảnh sau', 'back')}
        </View>
        <View style={styles.row}>
          {renderImageBox('Ảnh trái', 'left')}
          {renderImageBox('Ảnh phải', 'right')}
        </View>
      </View>
      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Tiếp tục</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
  },
  imagesContainer: {
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  imageBox: {
    width: 130,
    height: 130,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
  },
  placeholderText: {
    color: '#ccc',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#03a9f4',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ImageUploadScreen;
