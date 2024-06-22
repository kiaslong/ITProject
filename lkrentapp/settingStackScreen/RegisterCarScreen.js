import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Picker } from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';

const RegisterCarScreen = () => {

  const licensePlateRef = useRef(null);
  const companyRef = useRef(null);
  const modelRef = useRef(null);
  const descriptionRef = useRef(null);
  const priceRef = useRef(null);

  const [errors, setErrors] = useState({
    licensePlateError: '',
    companyError: '',
    modelError: '',
  });

  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSeats, setSelectedSeats] = useState('');
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSeatsPicker, setShowSeatsPicker] = useState(false);
  const [transmission, setTransmission] = useState('Automatic');
  const [fuel, setFuel] = useState('Gasoline');
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [promotion, setPromotion] = useState('Có');

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, []);

  const handleInputChange = (name, value) => {
    if (name === 'licensePlate') {
      licensePlateRef.current = value;
    } else if (name === 'company') {
      companyRef.current = value;
    } else if (name === 'model') {
      modelRef.current = value;
    }
  };

  const clearErrorMessages = () => {
    setErrors({
      licensePlateError: '',
      companyError: '',
      modelError: '',
    });
  };

  const validateInputs = () => {
    let valid = true;
    const licensePlate = licensePlateRef.current?.trim();
    const company = companyRef.current?.trim();
    const model = modelRef.current?.trim();

    if (!licensePlate) {
      setErrors((prevState) => ({
        ...prevState,
        licensePlateError: 'Biển số xe là bắt buộc.',
      }));
      valid = false;
    }

    if (!company) {
      setErrors((prevState) => ({
        ...prevState,
        companyError: 'Hãng xe là bắt buộc.',
      }));
      valid = false;
    }

    if (!model) {
      setErrors((prevState) => ({
        ...prevState,
        modelError: 'Mẫu xe là bắt buộc.',
      }));
      valid = false;
    }

    if (!selectedYear) {
      Alert.alert('Năm sản xuất là bắt buộc.');
      valid = false;
    }

    if (!selectedSeats) {
      Alert.alert('Số chỗ ngồi là bắt buộc.');
      valid = false;
    }

    if (!transmission) {
      Alert.alert('Hộp số là bắt buộc.');
      valid = false;
    }

    if (!fuel) {
      Alert.alert('Loại nhiên liệu là bắt buộc.');
      valid = false;
    }

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };

  const handleRegister = () => {
    if (validateInputs()) {
      const licensePlate = licensePlateRef.current?.trim();
      const company = companyRef.current?.trim();
      const model = modelRef.current?.trim();
      Alert.alert('Thành công', 'Đăng ký xe thành công');
      licensePlateRef.current = '';
      companyRef.current = '';
      modelRef.current = '';
      setSelectedYear('');
      setSelectedSeats('');
      setTransmission('Automatic');
      setFuel('Gasoline');
      setImages([]);
      setDocuments([]);
    }
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, ...result.assets]);
    }
  };

  const handlePickDocument = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      setDocuments([...documents, ...result.assets]);
    }
  };

  const handleDeleteImage = (uri) => {
    setImages(images.filter((image) => image.uri !== uri));
  };

  const handleDeleteDocument = (uri) => {
    setDocuments(documents.filter((document) => document.uri !== uri));
  };

  const years = Array.from(new Array(30), (_, index) => new Date().getFullYear() - index);
  const seats = Array.from({ length: 7 }, (_, i) => (i + 4).toString());

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}      >
        <View style={styles.inputView}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Biển số xe</Text>
            <View style={[styles.inputContainer, errors.licensePlateError ? styles.inputError : null]}>
              <TextInput
                ref={licensePlateRef}
                style={styles.input}
                placeholder="Biển số xe"
                onChangeText={(text) => handleInputChange('licensePlate', text)}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => companyRef.current.focus()}
              />
            </View>
            {errors.licensePlateError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.licensePlateError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hãng xe</Text>
            <View style={[styles.inputContainer, errors.companyError ? styles.inputError : null]}>
              <TextInput
                ref={companyRef}
                style={styles.input}
                placeholder="Hãng xe"
                onChangeText={(text) => handleInputChange('company', text)}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => modelRef.current.focus()}
              />
            </View>
            {errors.companyError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.companyError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mẫu xe</Text>
            <View style={[styles.inputContainer, errors.modelError ? styles.inputError : null]}>
              <TextInput
                ref={modelRef}
                style={styles.input}
                placeholder="Mẫu xe"
                onChangeText={(text) => handleInputChange('model', text)}
                autoCorrect={false}
                autoCapitalize="none"
                returnKeyType="next"
                onSubmitEditing={() => setShowYearPicker(true)}
              />
            </View>
            {errors.modelError ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errors.modelError}</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Năm sản xuất</Text>
              <Pressable
                style={[styles.inputContainer, errors.yearError ? styles.inputError : null]}
                onPress={() => setShowYearPicker(true)}
              >
                <Text style={styles.selectedText}>
                  {selectedYear ? selectedYear : 'Chọn năm'}
                </Text>
              </Pressable>
              {showYearPicker && (
                <Picker
                  selectedValue={selectedYear}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setSelectedYear(itemValue);
                    setShowYearPicker(false);
                  }}
                >
                  {years.map((year) => (
                    <Picker.Item key={year} label={year.toString()} value={year.toString()} />
                  ))}
                </Picker>
              )}
            </View>

            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Số chỗ ngồi</Text>
              <Pressable
                style={[styles.inputContainer, errors.seatsError ? styles.inputError : null]}
                onPress={() => setShowSeatsPicker(true)}
              >
                <Text style={styles.selectedText}>
                  {selectedSeats ? selectedSeats : 'Chọn số chỗ'}
                </Text>
              </Pressable>
              {showSeatsPicker && (
                <Picker
                  selectedValue={selectedSeats}
                  style={styles.picker}
                  onValueChange={(itemValue) => {
                    setSelectedSeats(itemValue);
                    setShowSeatsPicker(false);
                  }}
                >
                  {seats.map((seat) => (
                    <Picker.Item key={seat} label={seat} value={seat} />
                  ))}
                </Picker>
              )}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hộp số</Text>
            <View style={styles.rowContainer}>
              <Pressable
                style={[
                  styles.transmissionButton,
                  transmission === 'Automatic' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setTransmission('Automatic')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'Automatic' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Tự động
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  transmission === 'Manual' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setTransmission('Manual')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    transmission === 'Manual' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Số sàn
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nhiên liệu</Text>
            <View style={styles.rowContainer}>
              <Pressable
                style={[
                  styles.transmissionButton,
                  fuel === 'Gasoline' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setFuel('Gasoline')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    fuel === 'Gasoline' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Xăng
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  fuel === 'Diesel' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setFuel('Diesel')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    fuel === 'Diesel' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Dầu diesel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  fuel === 'Electric' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setFuel('Electric')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    fuel === 'Electric' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Điện
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.middleLine}></View>

          <Text style={styles.additionalInfoTitle}>Thông tin bổ sung</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Địa chỉ xe</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nhập địa chỉ xe"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Hình ảnh xe</Text>
            <Pressable style={styles.pickImageButton} onPress={handlePickImage}>
              <Text style={styles.pickImageButtonText}>Chọn hình ảnh</Text>
            </Pressable>
            <ScrollView horizontal style={styles.imagesContainer}>
              {images.map((image, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: image.uri }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(image.uri)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giấy tờ xe</Text>
            <Pressable style={styles.pickImageButton} onPress={handlePickDocument}>
              <Text style={styles.pickImageButtonText}>Chọn giấy tờ</Text>
            </Pressable>
            <ScrollView horizontal style={styles.imagesContainer}>
              {documents.map((document, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: document.uri }}
                    style={styles.image}
                  />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteDocument(document.uri)}
                  >
                    <Text style={styles.deleteButtonText}>X</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mô tả xe</Text>
            <View style={[styles.inputContainer, styles.descriptionContainer]}>
              <TextInput
                ref={descriptionRef}
                style={[styles.input, styles.descriptionInput]}
                placeholder="Nhập mô tả xe"
                autoCorrect={false}
                autoCapitalize="none"
                multiline={true}
                numberOfLines={4}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Giá cho thuê (VNĐ)</Text>
            <View style={styles.inputContainer}>
              <TextInput
                ref={priceRef}
                style={styles.input}
                placeholder="Nhập giá cho thuê"
                keyboardType="numeric"
                autoCorrect={false}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Áp dụng khuyến mãi</Text>
            <View style={styles.rowContainer}>
              <Pressable
                style={[
                  styles.transmissionButton,
                  promotion === 'Có' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setPromotion('Có')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    promotion === 'Có' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Có
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  promotion === 'Không' ? styles.transmissionButtonSelected : null,
                ]}
                onPress={() => setPromotion('Không')}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    promotion === 'Không' ? styles.transmissionButtonTextSelected : null,
                  ]}
                >
                  Không
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Đăng ký xe</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#03a9f4',
    textAlign: 'center',
  },
  icon: {
    position: 'absolute',
    right: 20,
    fontSize: 20,
    color: '#666',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputView: {
    marginVertical: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    width: '100%',
    height: 40,
  },
  descriptionContainer: {
    height: 100,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  descriptionInput: {
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: 'red',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 6,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  halfInputGroup: {
    flex: 1,
    marginRight: 10,
  },
  picker: {
    width: '100%',
    marginTop: 10,
  },
  selectedText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#000',
  },
  transmissionButton: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  transmissionButtonSelected: {
    backgroundColor: '#03a9f4',
  },
  transmissionButtonText: {
    fontSize: 16,
    color: '#000',
  },
  transmissionButtonTextSelected: {
    color: '#fff',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#03a9f4',
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  middleLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  pickImageButton: {
    backgroundColor: '#03a9f4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickImageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagesContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    width: 100,
    height: 100,
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
});

export default RegisterCarScreen;
