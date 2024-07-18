import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  StyleSheet,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { setDocuments } from '../store/registrationSlice';
import { unregisterFunction } from '../store/functionRegistry';

const DocumentUploadScreen = ({ route }) => {
  const [documents, setLocalDocuments] = useState({ registration: null });
  
  const navigation = useNavigation();
  const { functionName } = route.params;
  const key = functionName;

  const dispatch = useDispatch();
  const registrationDocuments = useSelector((state) => state.registration.documents);

  useEffect(() => {
    if (registrationDocuments) {
      setLocalDocuments(registrationDocuments);
    }

    return () => {
      unregisterFunction(key);
    };
  }, [navigation, registrationDocuments]);

  const handlePickDocument = async (position, source) => {
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
      const newDocument = { [position]: result.assets[0].uri };
      setLocalDocuments({ ...documents, ...newDocument });
      dispatch(setDocuments(newDocument));
    }
  };

  const handleSelectDocumentSource = (position) => {
    Alert.alert(
      'Chọn nguồn ảnh',
      'Chọn ảnh từ thư viện hoặc chụp ảnh mới?',
      [
        {
          text: 'Thư viện',
          onPress: () => handlePickDocument(position, 'library'),
        },
        {
          text: 'Máy ảnh',
          onPress: () => handlePickDocument(position, 'camera'),
        },
        {
          text: 'Hủy',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteDocument = (position) => {
    const updatedDocuments = { ...documents, [position]: null };
    setLocalDocuments(updatedDocuments);
    dispatch(setDocuments({ [position]: null }));
  };

  const handleContinue = () => {
    if (!documents.registration) {
      Alert.alert('Vui lòng chọn giấy tờ xe.');
      return;
    }
    navigation.navigate('RentalPriceScreen', {
      showHeader: true,
      showTitle: true,
      showBackButton: true,
      screenTitle: "Hình ảnh giấy tờ",
      showIcon: true,
      iconName: "close-circle-outline",
      iconType: "ionicons",
      functionName: "closeRegister"
    });
  };

  const renderDocumentBox = (label, position) => (
    <Pressable style={styles.documentBox} onPress={() => handleSelectDocumentSource(position)}>
      {documents[position] ? (
        <>
          <Image source={{ uri: documents[position] }} style={styles.image} resizeMode="contain" />
          <Pressable style={styles.deleteButton} onPress={() => handleDeleteDocument(position)}>
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
      <Text style={styles.title}>Giấy tờ xe</Text>
      <Text style={styles.instructions}>
        Bạn vui lòng cung cấp Giấy đăng ký xe (cà vẹt) để xe được uy tín hơn trong quá trình cho thuê.
      </Text>
      <View style={styles.documentsContainer}>
        {renderDocumentBox('Cà vẹt/ Giấy đăng ký xe', 'registration')}
      </View>
      <Pressable style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Tiếp tục</Text>
      </Pressable>
      <Pressable style={styles.skipButton} onPress={() => navigation.navigate('RentalPriceScreen', {
        showHeader: true,
        showTitle: true,
        showBackButton: true,
        screenTitle: "Hình ảnh giấy tờ",
        showIcon: true,
        iconName: "close-circle-outline",
        iconType: "ionicons",
        functionName: "closeRegister"
      })}>
        <Text style={styles.skipButtonText}>Bỏ qua</Text>
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
  documentsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  documentBox: {
    width: 300,
    height: 400,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
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
  skipButton: {
    marginTop: 10,
    padding: 15,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#03a9f4',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DocumentUploadScreen;
