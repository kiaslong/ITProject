import React, { useState, useRef, useEffect } from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import InputField from './RegisterCarComponent/InputField';
import ModalPicker from './RegisterCarComponent/ModalPicker';

const RegisterCarScreen = () => {
  const licensePlateRef = useRef(null);
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
  const [showMakePicker, setShowMakePicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [transmission, setTransmission] = useState('Automatic');
  const [fuel, setFuel] = useState('Gasoline');
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [promotion, setPromotion] = useState('Có');
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');

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

    if (!licensePlate) {
      setErrors((prevState) => ({
        ...prevState,
        licensePlateError: 'Biển số xe là bắt buộc.',
      }));
      valid = false;
    }

    if (!selectedMake) {
      setErrors((prevState) => ({
        ...prevState,
        companyError: 'Hãng xe là bắt buộc.',
      }));
      valid = false;
    }

    if (!selectedModel) {
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
      Alert.alert('Thành công', 'Đăng ký xe thành công');
      licensePlateRef.current = '';
      setSelectedMake('');
      setSelectedModel('');
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


  const handleYearSelect = (item) => {
    setSelectedYear(item)
    setShowYearPicker(false);
  };

  const handleSeatSelect = (item) => {
      setSelectedSeats(item)
      setShowSeatsPicker(false);
  };


  const handleMakeSelect = (make) => {
    setSelectedMake(make);
    setSelectedModel('');
    setShowMakePicker(false);
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    setShowModelPicker(false);
  };

  const years = Array.from(new Array(10), (_, index) => new Date().getFullYear() - index);
  const seats = Array.from({ length: 6 }, (_, i) => (i + 4).toString());

  const carBrandsAndModels = {
    Audi: ["A3", "A4", "A6", "Q3", "Q5", "Q7"],
    Baic: ["X25", "X35", "X55", "D20"],
    Bentley: ["Continental", "Bentayga", "Flying Spur"],
    BMW: ["3 Series", "5 Series", "X3", "X5", "7 Series"],
    Brilliance: ["V5", "H230", "H330", "H530"],
    Buick: ["Encore", "Envision", "Enclave", "LaCrosse"],
    Chevrolet: ["Spark", "Cruze", "Malibu", "Equinox", "Traverse"],
    Daewoo: ["Matiz", "Gentra", "Nexia", "Lacetti"],
    Daihatsu: ["Terios", "Sirion", "Xenia", "Ayla"],
    Dongben: ["X30", "V29", "T30"],
    Dongfeng: ["AX7", "S30", "H30 Cross"],
    Fairy: ["F6", "SUP"],
    Fiat: ["500", "Panda", "Tipo", "500X"],
    Ford: ["Fiesta", "Focus", "Mustang", "Explorer", "F-150"],
    Geely: ["Coolray", "Azkarra", "Okavango"],
    Haima: ["S5", "M3", "M6"],
    Honda: ["Civic", "Accord", "CR-V", "HR-V", "Pilot"],
    Hyundai: ["Accent", "Elantra", "Sonata", "Tucson", "Santa Fe"],
    Isuzu: ["D-Max", "MU-X", "NPR"],
    Jaguar: ["XE", "XF", "F-PACE", "I-PACE"],
    Kenbo: ["S2", "S3", "S7"],
    Kia: ["Rio", "Cerato", "Sportage", "Sorento"],
    "Land Rover": ["Range Rover", "Discovery", "Defender"],
    Lexus: ["IS", "ES", "RX", "NX", "LX"],
    Luxgen: ["U5", "U6", "S3", "S5"],
    Mazda: ["Mazda3", "Mazda6", "CX-5", "CX-9"],
    Mercedes: ["A-Class", "C-Class", "E-Class", "GLC", "S-Class"],
    Mitsubishi: ["Mirage", "Outlander", "Pajero", "Xpander"],
    "Morris Garages": ["ZS", "HS", "RX5"],
    Nissan: ["Altima", "Sentra", "Rogue", "X-Trail", "Patrol"],
    Peugeot: ["208", "308", "3008", "5008"],
    Porsche: ["911", "Cayenne", "Panamera", "Macan"],
    Renault: ["Clio", "Megane", "Captur", "Koleos"],
    Riich: ["G5", "M1"],
    Samsung: ["SM3", "SM5", "SM6", "QM6"],
    SsangYong: ["Tivoli", "Korando", "Rexton"],
    Subaru: ["Impreza", "Forester", "Outback", "XV"],
    Suzuki: ["Swift", "Vitara", "Ertiga", "Jimny"],
    Tobe: ["M'car", "W'car"],
    Toyota: ["Corolla", "Camry", "RAV4", "Fortuner", "Land Cruiser"],
    UAZ: ["Patriot", "Hunter", "Pickup"],
    Vinfast: ["Fadil", "Lux A2.0", "Lux SA2.0"],
    Volkswagen: ["Golf", "Passat", "Tiguan", "Atlas"],
    Volvo: ["S60", "XC40", "XC60", "XC90"],
    Wuling: ["Hongguang", "Confero", "Cortez", "Almaz"],
    Zotye: ["T600", "Z300", "SR9"]
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.inputView}>
          <InputField
            label="Biển số xe"
            error={errors.licensePlateError}
            placeholder="Biển số xe"
            onChangeText={(text) => handleInputChange('licensePlate', text)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
          />

          <Text style={styles.label}>Hãng xe</Text>
          <Pressable
            style={[styles.inputContainer, errors.companyError ? styles.inputError : null]}
            onPress={() => setShowMakePicker(true)}
          >
            <Text style={styles.selectedText}>
              {selectedMake ? selectedMake : 'Chọn hãng xe'}
            </Text>
          </Pressable>
          {errors.companyError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.companyError}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Mẫu xe</Text>
          <Pressable
            style={[styles.inputContainer, errors.modelError ? styles.inputError : null]}
            onPress={() => setShowModelPicker(true)}
            disabled={!selectedMake}
          >
            <Text style={styles.selectedText}>
              {selectedModel ? selectedModel : 'Chọn mẫu xe'}
            </Text>
          </Pressable>
          {errors.modelError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.modelError}</Text>
            </View>
          ) : null}

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
            </View>
          </View>

          <View style={[styles.inputGroup, styles.transmissionContainer]}>
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
            <Text style={styles.fuelLabel}>Nhiên liệu</Text>
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
          <InputField
            label="Địa chỉ xe"
            placeholder="Nhập địa chỉ xe"
            autoCorrect={false}
            autoCapitalize="none"
          />

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

          <InputField
            label="Mô tả xe"
            ref={descriptionRef}
            placeholder="Nhập mô tả xe"
            autoCorrect={false}
            autoCapitalize="none"
            multiline={true}
            numberOfLines={4}
          />

          <InputField
            label="Giá cho thuê (VNĐ)"
            ref={priceRef}
            placeholder="Nhập giá cho thuê"
            keyboardType="numeric"
            autoCorrect={false}
            autoCapitalize="none"
          />

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

      <ModalPicker
        visible={showYearPicker}
        items={years.map((year) => year.toString())}
        onSelect={ (item)=> handleYearSelect(item)}
        label="Năm sản xuất"
        onClose={() => setShowYearPicker(false)}
      />

      <ModalPicker
        visible={showSeatsPicker}
        items={seats}
        onSelect={(item)=>handleSeatSelect(item)}
        label="Số chỗ"
        onClose={() => setShowSeatsPicker(false)}
      />

      <ModalPicker
        visible={showMakePicker}
        items={Object.keys(carBrandsAndModels)}
        onSelect={handleMakeSelect}
        label="Nhà sản xuất"
        onClose={() => setShowMakePicker(false)}
      />

      <ModalPicker
        visible={showModelPicker}
        items={carBrandsAndModels[selectedMake] || []}
        onSelect={handleModelSelect}
        label="Mẫu xe"
        onClose={() => setShowModelPicker(false)}
      />
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    width: '100%',
    height: 40,
    marginVertical: 5,
  },
  selectedText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    color: '#000',
  },
  transmissionContainer: {
    marginBottom: 20,
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
    marginVertical: 20,
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
    marginVertical: 10,
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
    marginVertical: 10,
    width: '100%',
  },
  halfInputGroup: {
    flex: 1,
    marginRight: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  fuelLabel: {
    fontSize: 16,
    fontWeight: '400',
  },
  label: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 5,
    marginTop: 10,
  },
});

export default RegisterCarScreen;
