import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Switch,
  TextInput,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  Dimensions,
  TouchableWithoutFeedback,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Slider from "@react-native-community/slider";
import { Ionicons } from "@expo/vector-icons";
import { unregisterFunction } from "../store/functionRegistry";
import { useDispatch, useSelector } from 'react-redux';
import { setField, resetRegistration } from '../store/registrationSlice';
import api from "../api";
import { getToken } from "../utils/tokenStorage";

const { height } = Dimensions.get('window');

const RentalPriceScreen = ({ route }) => {

  const navigation = useNavigation();
  const { functionName } = route.params;
  const key = functionName;

  const dispatch = useDispatch();
  const registrationData = useSelector((state) => state.registration);

  useEffect(() => {
    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const [price, setPrice] = useState(registrationData.price);
  const [editingPrice, setEditingPrice] = useState(registrationData.price.toString());
  const [discount, setDiscount] = useState(registrationData.discount);
  const [discountPercentage, setDiscountPercentage] = useState(registrationData.discountPercentage);
  const [isEditing, setIsEditing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [discountModalVisible, setDiscountModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const modalSlideAnim = useRef(new Animated.Value(height)).current;
  const helpModalSlideAnim = useRef(new Animated.Value(height)).current;
  const discountModalSlideAnim = useRef(new Animated.Value(height)).current;

  const animateModal = (modalAnim, toValue, duration, callback) => {
    Animated.timing(modalAnim, {
      toValue,
      duration,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  };

  const openModal = () => {
    setModalVisible(true);
    animateModal(modalSlideAnim, 0, 200);
  };

  const closeModal = (callback) => {
    animateModal(modalSlideAnim, height, 200, () => {
      setModalVisible(false);
      if (callback) callback();
    });
  };

  const openHelpModal = () => {
    setHelpModalVisible(true);
    animateModal(helpModalSlideAnim, 0, 200);
  };

  const closeHelpModal = () => {
    animateModal(helpModalSlideAnim, height, 200, () => {
      setHelpModalVisible(false);
    });
  };

  const openDiscountModal = () => {
    setDiscountModalVisible(true);
    animateModal(discountModalSlideAnim, 0, 200);
  };

  const closeDiscountModal = () => {
    animateModal(discountModalSlideAnim, height, 200, () => {
      setDiscountModalVisible(false);
    });
  };

  const renderModal = (visible, content, closeModal, modalAnim) => (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.modalContent,
                { transform: [{ translateY: modalAnim }] },
              ]}
            >
              <TouchableOpacity
                style={[styles.buttonClose]}
                onPress={closeModal}
              >
                <Text style={styles.textStyle}>X</Text>
              </TouchableOpacity>
              {content}
              <View style={styles.paddingBottom}></View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const handlePriceChange = (value) => {
    setEditingPrice(value);
  };

  const handleConfirmEdit = () => {
    let numValue = parseInt(editingPrice);
    if (isNaN(numValue)) {
      numValue = 400;
    } else if (numValue < 400) {
      numValue = 400;
    } else if (numValue > 2000) {
      numValue = 2000;
    }
    setPrice(numValue);
    setEditingPrice(numValue.toString());
    setIsEditing(false);
    dispatch(setField({ field: 'price', value: numValue }));
  };

  const handleCancelEdit = () => {
    setEditingPrice(price.toString());
    setIsEditing(false);
  };

  const handleSliderChange = (value) => {
    setPrice(value);
    setEditingPrice(value.toString());
    dispatch(setField({ field: 'price', value }));
  };

  const handleDiscountChange = (value) => {
    setDiscount(value);
    dispatch(setField({ field: 'discount', value }));
  };

  const handleDiscountPercentageChange = (value) => {
    setDiscountPercentage(value);
    dispatch(setField({ field: 'discountPercentage', value }));
  };

  const handleContinue = async () => {
    setLoading(true); // Show loading indicator
    try {
      const formData = new FormData();
      
      // Append registration data to formData
      for (const key in registrationData) {
        if (registrationData.hasOwnProperty(key) && key !== 'images' && key !== 'documents') {
          const value = (key === 'selectedFeatures') ? JSON.stringify(registrationData[key]) : registrationData[key];
          formData.append(key, value);
         
        }
      }
  
      // Helper function to determine the file type
      const getFileType = (uri) => {
        const extension = uri.split('.').pop();
        switch (extension) {
          case 'jpg':
          case 'jpeg':
            return 'image/jpeg';
          case 'png':
            return 'image/png';
          default:
            return 'application/octet-stream'; // Default to binary stream if type is unknown
        }
      };
  
      // Append images to formData
      Object.keys(registrationData.images).forEach((key) => {
        if (registrationData.images[key]) {
          const file = {
            uri: registrationData.images[key],
            name: `${key}.${registrationData.images[key].split('.').pop()}`,
            type: getFileType(registrationData.images[key]),
          };
          formData.append('files', file);
          
        }
      });
  
      // Append documents to formData
      Object.keys(registrationData.documents).forEach((key) => {
        if (registrationData.documents[key]) {
          const file = {
            uri: registrationData.documents[key],
            name: `${key}.${registrationData.documents[key].split('.').pop()}`,
            type: getFileType(registrationData.documents[key]),
          };
          formData.append('files', file);
          
        }
      });
  
      const token = await getToken(); 
      const response = await api.post('/car/register', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setMessage('Car registered successfully.');
        setTimeout(() => {
          dispatch(resetRegistration());
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
        }, 2000); // Display the message for 2 seconds before navigating
      }

      return response.data;
    } catch (error) {
      console.error('Error uploading images and data:', error);
      Alert.alert('Upload failed', 'Failed to upload images and data');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  const helpModalContent = (
    <View style={styles.textContainer}>
      <Ionicons name="bulb-outline" size={26} color="#03A9F4" style={styles.modalIcon} />
      <Text style={styles.modalText}>
        Thêm ưu đãi dành cho khách hàng thuê xe nhiều ngày sẽ giúp gia tăng tỉ lệ nhận đơn và giá trị trên mỗi đơn hàng.
      </Text>
    </View>
  );

  const discountModalContent = (
    <View>
      <Text style={styles.modalTitle}>Chỉnh sửa phần trăm ưu đãi</Text>
      <Slider
        style={{ width: '100%', height: 40 }}
        minimumValue={0}
        maximumValue={100}
        step={1}
        value={discountPercentage}
        onValueChange={handleDiscountPercentageChange}
        minimumTrackTintColor="#03a9f4"
        maximumTrackTintColor="#d3d3d3"
        thumbTintColor="#03a9f4"
      />
      <View style={styles.rangeContainer}>
        <Text style={styles.rangeText}>0%</Text>
        <Text style={styles.rangeText}>100%</Text>
      </View>
      <TouchableOpacity
        style={styles.confirmButton}
        onPress={closeDiscountModal}
      >
        <Text style={styles.confirmButtonText}>Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giá cho thuê tự lái</Text>
      <View style={styles.priceContainer}>
        {isEditing ? (
          <View style={styles.editingContainer}>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              value={editingPrice}
              onChangeText={handlePriceChange}
              autoFocus
            />
            <View style={styles.editButtonsContainer}>
              <TouchableOpacity style={styles.editButton} onPress={handleConfirmEdit}>
                <Ionicons name="checkmark" size={24} color="green" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.editButton} onPress={handleCancelEdit}>
                <Ionicons name="close" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.priceView}>
            <Text style={styles.price}>{price}K</Text>
            <TouchableOpacity onPress={() => {
              setIsEditing(true);
              setEditingPrice(price.toString());
            }}>
              <Ionicons name="pencil" size={24} color="gray" />
            </TouchableOpacity>
          </View>
        )}
        <Slider
          style={{ width: '100%', height: 40 }}
          minimumValue={400}
          maximumValue={2000}
          step={10}
          value={price}
          onValueChange={handleSliderChange}
          minimumTrackTintColor="#03a9f4"
          maximumTrackTintColor="#d3d3d3"
          thumbTintColor="#03a9f4"
        />
        <View style={styles.rangeContainer}>
          <Text style={styles.rangeText}>400K</Text>
          <Text style={styles.rangeText}>2000K</Text>
        </View>
      </View>
      <View style={styles.discountContainer}>
        <View style={styles.discountTitleContainer}>
          <Text style={styles.discountTitle}>Giảm giá</Text>
          <TouchableOpacity onPress={openHelpModal}>
            <Ionicons name="help-circle-outline" size={24} color="gray" />
          </TouchableOpacity>
        </View>
        <Switch
          value={discount}
          onValueChange={handleDiscountChange}
          trackColor={{ false: '#767577', true: '#03a9f4' }}
          thumbColor={discount ? '#ffffff' : '#ffffff'}
        />
      </View>
      {discount ? (
        <TouchableOpacity style={styles.weeklyDiscountContainer} onPress={openDiscountModal}>
          <Text style={styles.weeklyDiscountText}>Ưu đãi thuê xe 1 tuần</Text>
          <View style={styles.weeklyDiscountPercentContainer}>
            <Text style={styles.weeklyDiscountPercent}>{discountPercentage}%</Text>
            <Ionicons name="chevron-forward" size={24} color="gray" />
          </View>
        </TouchableOpacity>
      ) : null}
      <Pressable style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Hoàn Tất Đăng Ký</Text>
      </Pressable>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#03a9f4" />
        </View>
      )}

      {message && (
        <View style={styles.messageOverlay}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

      {renderModal(modalVisible, helpModalContent, closeModal, modalSlideAnim)}
      {renderModal(helpModalVisible, helpModalContent, closeHelpModal, helpModalSlideAnim)}
      {renderModal(discountModalVisible, discountModalContent, closeDiscountModal, discountModalSlideAnim)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#03a9f4",
    textAlign: "center",
    marginBottom: 20,
  },
  priceContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  priceView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  price: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#03a9f4",
    marginRight: 10,
  },
  rangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  rangeText: {
    fontSize: 16,
    color: "#666",
  },
  editingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  editButton: {
    padding: 5,
    marginHorizontal: 5,
  },
  textInput: {
    height: 40,
    borderColor: '#03a9f4',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    textAlign: 'center',
    width: '50%',
  },
  button: {
    position:"absolute",
    bottom:50,
    alignSelf:"center",
    backgroundColor: "#03a9f4",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  discountTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discountTitle: {
    fontSize: 18,
    marginRight: 10,
  },
  weeklyDiscountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  weeklyDiscountText: {
    fontSize: 16,
  },
  weeklyDiscountPercentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weeklyDiscountPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: height * 0.9,
  },
  buttonClose: {
    alignSelf: 'flex-start',
    backgroundColor: "#03A9F4",
    borderRadius: 28,
    padding: 5,
    width: 28,
    height: 28,
    marginBottom: 16,
    marginTop: 16,
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  textContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  modalIcon: {
    alignSelf: 'start',
  },
  modalText: {
    fontSize: 15,
    marginHorizontal: 10,
    textAlign: 'start',
  },
  paddingBottom: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  confirmButton: {
    backgroundColor: "#03a9f4",
    padding: 15,
    borderRadius: 10,
    alignSelf:"center",
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  messageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  messageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
    backgroundColor: '#03a9f4',
    borderRadius: 10,
  },
});

export default RentalPriceScreen;
