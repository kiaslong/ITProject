import React, { useState, useEffect, useRef } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Switch,
  TextInput,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as ImagePicker from "expo-image-picker";
import InputField from "./RegisterCarComponent/InputField";
import ModalPicker from "./RegisterCarComponent/ModalPicker";
import FeatureSelectionModal from "./RegisterCarComponent/FeatureSelectionModal";
import AddressPickerModal from "./RegisterCarComponent/AddressPickerModal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setField } from "../store/registrationSlice";
import Slider from '@react-native-community/slider';

import addresses from './json/treeminify.json';
import carBrandsAndModels from './json/carBrandsAndModels.json';

const RegisterCarScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.loggedIn.user);
  const registrationData = useSelector((state) => state.registration);

  const [errors, setErrors] = useState({
    licensePlateError: "",
    companyError: "",
    modelError: "",
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showSeatsPicker, setShowSeatsPicker] = useState(false);
  const [showMakePicker, setShowMakePicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);
  const [fastBooking, setFastBooking] = useState(registrationData.fastAcceptBooking);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [initialAddress,setInitAddress]=useState(null);

  const inputRefs = useRef({});

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const clearErrorMessages = () => {
    setErrors({
      licensePlateError: "",
      companyError: "",
      modelError: "",
    });
  };

  const validateInputs = () => {
    let valid = true;

    if (!registrationData.licensePlate.trim()) {
      setErrors((prevState) => ({
        ...prevState,
        licensePlateError: "Biển số xe là bắt buộc.",
      }));
      valid = false;
    }

    if (!registrationData.selectedMake) {
      setErrors((prevState) => ({
        ...prevState,
        companyError: "Hãng xe là bắt buộc.",
      }));
      valid = false;
    }

    if (!registrationData.selectedModel) {
      setErrors((prevState) => ({
        ...prevState,
        modelError: "Mẫu xe là bắt buộc.",
      }));
      valid = false;
    }

    if (!registrationData.selectedYear) {
      Alert.alert("Năm sản xuất là bắt buộc.");
      valid = false;
    }

    if (!registrationData.location) {
      Alert.alert("Vị trí xe");
      valid = false;
    }

    if (!registrationData.selectedSeats) {
      Alert.alert("Số chỗ ngồi là bắt buộc.");
      valid = false;
    }

    if (!registrationData.transmission) {
      Alert.alert("Hộp số là bắt buộc.");
      valid = false;
    }

    if (!registrationData.fuelType) {
      Alert.alert("Loại nhiên liệu là bắt buộc.");
      valid = false;
    }

    if (!valid) {
      setTimeout(clearErrorMessages, 3000);
    }

    return valid;
  };

  const handleRegister = () => {
    if (validateInputs()) {
      handleSelect("ownerId", user.id);
      navigation.navigate("ImageUploadScreen", {
        showBackButton: true,
        showTitle: true,
        showHeader: true,
        screenTitle: "Chọn hình ảnh",
        showIcon: true,
        iconType: "ionicons",
        iconName: "close-circle-outline",
        functionName: "closeRegister",
      });
    }
  };

  const handleSelect = (field, value) => {
    dispatch(setField({ field, value }));
  };

  const handleAddressSelect = (address) => {

    
    
    setInitAddress({
      street: address.street,
      city: address.city.name_with_type,
      district: address.district.name_with_type,
      ward: address.ward.name_with_type,
    });    
    handleSelect(
      "location",
      `${address.street}`
    );
    setShowAddressPicker(false);
  };

  const blurAllInputs = () => {
    Object.values(inputRefs.current).forEach(input => input && input.blur());
  };

  const years = Array.from(
    new Array(10),
    (_, index) => new Date().getFullYear() - index
  );
  const seats = Array.from({ length: 6 }, (_, i) => (i + 4).toString());

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
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
            onChangeText={(text) => handleSelect("licensePlate", text)}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="next"
            value={registrationData.licensePlate}
            ref={(input) => (inputRefs.current.licensePlate = input)}
          />

          <Text style={styles.label}>Hãng xe</Text>
          <Pressable
            style={[
              styles.inputContainer,
              errors.companyError ? styles.inputError : null,
            ]}
            onPress={() => {
              blurAllInputs();
              setShowMakePicker(true);
            }}
          >
            <Text style={styles.selectedText}>
              {registrationData.selectedMake
                ? registrationData.selectedMake
                : "Chọn hãng xe"}
            </Text>
          </Pressable>
          {errors.companyError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.companyError}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Mẫu xe</Text>
          <Pressable
            style={[
              styles.inputContainer,
              errors.modelError ? styles.inputError : null,
            ]}
            onPress={() => {
              blurAllInputs();
              setShowModelPicker(true);
            }}
            disabled={!registrationData.selectedMake}
          >
            <Text style={styles.selectedText}>
              {registrationData.selectedModel
                ? registrationData.selectedModel
                : "Chọn mẫu xe"}
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
                style={[
                  styles.inputContainer,
                  errors.yearError ? styles.inputError : null,
                ]}
                onPress={() => {
                  blurAllInputs();
                  setShowYearPicker(true);
                }}
              >
                <Text style={styles.selectedText}>
                  {registrationData.selectedYear
                    ? registrationData.selectedYear
                    : "Chọn năm"}
                </Text>
              </Pressable>
            </View>

            <View style={styles.halfInputGroup}>
              <Text style={styles.label}>Số chỗ ngồi</Text>
              <Pressable
                style={[
                  styles.inputContainer,
                  errors.seatsError ? styles.inputError : null,
                ]}
                onPress={() => {
                  blurAllInputs();
                  setShowSeatsPicker(true);
                }}
              >
                <Text style={styles.selectedText}>
                  {registrationData.selectedSeats
                    ? registrationData.selectedSeats
                    : "Chọn số chỗ"}
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
                  registrationData.transmission === "Automatic"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("transmission", "Automatic")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.transmission === "Automatic"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Tự động
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  registrationData.transmission === "Manual"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("transmission", "Manual")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.transmission === "Manual"
                      ? styles.transmissionButtonTextSelected
                      : null,
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
                  registrationData.fuelType === "Gasoline"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("fuelType", "Gasoline")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.fuelType === "Gasoline"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Xăng
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  registrationData.fuelType === "Diesel"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("fuelType", "Diesel")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.fuelType === "Diesel"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Dầu diesel
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  registrationData.fuelType === "Electric"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("fuelType", "Electric")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.fuelType === "Electric"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Điện
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Fuel Consumption Slider */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Tiêu thụ nhiên liệu</Text>
            <View style={styles.rowContainer}>
              <Slider
                style={{ width: '100%', height: 40 }}
                minimumValue={5}
                maximumValue={30}
                step={1}
                value={registrationData.fuelConsumption}
                onValueChange={value => handleSelect("fuelConsumption", value)}
                minimumTrackTintColor="#03a9f4"
                maximumTrackTintColor="#000000"
              />
            </View>
            <Text style={styles.selectedText}>{`${registrationData.fuelConsumption.toFixed(1)}l/100km`}</Text>
          </View>

          <View style={styles.middleLine}></View>

          <Text style={styles.additionalInfoTitle}>Thông tin bổ sung</Text>
          <Text style={styles.label}>Địa chỉ xe</Text>
          <Pressable
            style={styles.inputContainer}
            onPress={() => {
              blurAllInputs();
              setShowAddressPicker(true);
            }}
          >
            <Text style={styles.selectedText} numberOfLines={1}>
              {registrationData.location ? registrationData.location : "Nhập địa chỉ xe"}
            </Text>
          </Pressable>

          <InputField
            label="Mô tả xe"
            autoCorrect={false}
            autoCapitalize="none"
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => handleSelect("description", text)}
            value={registrationData.description}
            ref={(input) => (inputRefs.current.description = input)}
          />

          <View style={styles.featureContainer}>
            <Text style={styles.featureLabel}>Các tính năng trên xe</Text>
            {registrationData.selectedFeatures.length > 0 && (
              <View style={styles.selectedFeaturesContainer}>
                {registrationData.selectedFeatures.map((feature) => (
                  <View key={feature.id} style={styles.selectedFeature}>
                    <Ionicons name={feature.icon} size={16} color="#03a9f4" />
                    <Text style={styles.selectedFeatureText}>
                      {feature.name}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            <Pressable
              onPress={() => {
                blurAllInputs();
                setModalVisible(true);
              }}
            >
              <Text style={styles.featureSelectText}>
                Chọn tính năng <Ionicons name="chevron-forward" size={16} />
              </Text>
            </Pressable>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Áp dụng khuyến mãi</Text>
            <View style={styles.rowContainer}>
              <Pressable
                style={[
                  styles.transmissionButton,
                  registrationData.promotion === "Có"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("promotion", "Có")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.promotion === "Có"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Có
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.transmissionButton,
                  registrationData.promotion === "Không"
                    ? styles.transmissionButtonSelected
                    : null,
                ]}
                onPress={() => handleSelect("promotion", "Không")}
              >
                <Text
                  style={[
                    styles.transmissionButtonText,
                    registrationData.promotion === "Không"
                      ? styles.transmissionButtonTextSelected
                      : null,
                  ]}
                >
                  Không
                </Text>
              </Pressable>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <View style={styles.rowContainer}>
              <Text style={styles.label}>Đặt xe nhanh</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#03a9f4" }}
                thumbColor={fastBooking ? "#ffffff" : "#ffffff"}
                onValueChange={(value) => {
                  setFastBooking(value);
                  handleSelect("fastAcceptBooking", value);
                }}
                value={fastBooking}
                style={styles.switch}
              />
            </View>
            {fastBooking && (
              <View style={styles.fastBookingExplanation}>
                <Text style={styles.explanationText}>
                  Yêu cầu thuê xe từ khách thuê sẽ được tự động đồng ý trong
                  khoảng thời gian bạn cài đặt. Bạn cần đảm bảo việc cập nhật
                  lịch bạn cho xe thường xuyên. Bạn có thể sẽ bị mất phí nếu hủy
                  chuyến sau khi khách thuê đặt cọc.
                </Text>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => {
                    blurAllInputs();
                    setShowStartPicker(true);
                  }}
                >
                  <Text style={styles.selectedText}>
                    {registrationData.startDateFastBooking
                      ? registrationData.startDateFastBooking
                      : "Giới hạn từ"}
                  </Text>
                </Pressable>
                <Pressable
                  style={styles.inputContainer}
                  onPress={() => {
                    blurAllInputs();
                    setShowEndPicker(true);
                  }}
                >
                  <Text style={styles.selectedText}>
                    {registrationData.endDateFastBooking
                      ? registrationData.endDateFastBooking
                      : "Cho đến"}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Tiếp tục</Text>
          </Pressable>
        </View>
      </KeyboardAwareScrollView>

      <ModalPicker
        visible={showYearPicker}
        items={years.map((year) => year.toString())}
        onSelect={(item) => {
          handleSelect("selectedYear", item);
          setShowYearPicker(false);
        }}
        label="Năm sản xuất"
        onClose={() => setShowYearPicker(false)}
      />

      <ModalPicker
        visible={showSeatsPicker}
        items={seats}
        onSelect={(item) => {
          handleSelect("selectedSeats", item);
          setShowSeatsPicker(false);
        }}
        label="Số chỗ"
        onClose={() => setShowSeatsPicker(false)}
      />

      <ModalPicker
        visible={showMakePicker}
        items={Object.keys(carBrandsAndModels)}
        onSelect={(make) => {
          handleSelect("selectedMake", make);
          handleSelect("selectedModel", "");
          setShowMakePicker(false);
        }}
        label="Nhà sản xuất"
        onClose={() => setShowMakePicker(false)}
      />

      <ModalPicker
        visible={showModelPicker}
        items={carBrandsAndModels[registrationData.selectedMake] || []}
        onSelect={(model) => {
          handleSelect("selectedModel", model);
          setShowModelPicker(false);
        }}
        label="Mẫu xe"
        onClose={() => setShowModelPicker(false)}
      />

      <ModalPicker
        visible={showStartPicker}
        items={["6 giờ tới", "12 giờ tới", "24 giờ tới"]}
        onSelect={(item) => {
          handleSelect("startDateFastBooking", item);
          setShowStartPicker(false);
        }}
        label="Giới hạn từ"
        onClose={() => setShowStartPicker(false)}
      />

      <ModalPicker
        visible={showEndPicker}
        items={["1 tuần tới", "2 tuần tới (khuyến nghị)", "3 tuần tới", "4 tuần tới"]}
        onSelect={(item) => {
          handleSelect("endDateFastBooking", item);
          setShowEndPicker(false);
        }}
        label="Cho đến"
        onClose={() => setShowEndPicker(false)}
      />

      <FeatureSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelect={(features) => handleSelect("selectedFeatures", features)}
      />

    <AddressPickerModal
        visible={showAddressPicker}
        items={{ cities: Object.values(addresses) }}
        title="Chọn địa chỉ"
        onSelect={handleAddressSelect}
        onClose={() => setShowAddressPicker(false)}
        initialAddress={initialAddress}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#03a9f4",
    textAlign: "center",
  },
  icon: {
    position: "absolute",
    right: 20,
    fontSize: 20,
    color: "#666",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputView: {
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#03a9f4",
    borderWidth: 1,
    borderRadius: 7,
    padding: 10,
    width: "100%",
    height: 40,
    marginVertical: 5,
  },
  selectedText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 15,
    color: "#000",
  },
  transmissionContainer: {
    marginBottom: 20,
  },
  transmissionButton: {
    flex: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#03a9f4",
    borderWidth: 1,
    borderRadius: 7,
    marginHorizontal: 5,
  },
  transmissionButtonSelected: {
    backgroundColor: "#03a9f4",
  },
  transmissionButtonText: {
    fontSize: 16,
    color: "#000",
  },
  transmissionButtonTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 50,
  },
  button: {
    backgroundColor: "#03a9f4",
    height: 45,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  middleLine: {
    width: "100%",
    height: 1,
    backgroundColor: "#ccc",
    marginVertical: 20,
  },
  additionalInfoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
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
    fontWeight: "400",
  },
  label: {
    fontSize: 16,
    fontWeight: "400",
    marginBottom: 5,
    marginTop: 10,
  },
  featureContainer: {
    marginVertical: 20,
  },
  featureLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#666",
  },
  featureSelectText: {
    fontSize: 16,
    color: "#03a9f4",
  },
  selectedFeaturesContainer: {
    marginVertical: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  selectedFeature: {
    flexDirection: "row",
    alignItems: "center",
    margin: 4,
    padding: 4,
    borderWidth: 1,
    borderColor: "#03a9f4",
    borderRadius: 8,
  },
  selectedFeatureText: {
    marginLeft: 4,
    color: "#03a9f4",
  },
  fastBookingExplanation: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderColor: "#eee",
    borderWidth: 1,
  },
  explanationText: {
    fontSize: 14,
    color: "#333",
  },
  linkText: {
    color: "#03a9f4",
    textDecorationLine: "underline",
  },
});

export default RegisterCarScreen;
