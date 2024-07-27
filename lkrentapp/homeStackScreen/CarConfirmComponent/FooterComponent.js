import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Modal } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import api from "../../api";
import { getToken } from "../../utils/tokenStorage";
import { setDeliveryPrice, setIsConfirmed } from '../../store/locationSlice';
import { setSelectedPromo } from "../../store/priceSlice";

const FooterComponent = ({ carInfo, navigation, time }) => {
  const [isChecked, setIsChecked] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const user = useSelector((state) => state.loggedIn.user);
  const selectedPromo = useSelector((state) => state.price.selectedPromo);
  const promotions = useSelector((state) => state.promotions.promotions);
  const message = useSelector((state) => state.message.content);
  const deliveryPrice = useSelector((state) => state.location.deliveryPrice);
  const pickupMethod = useSelector((state) => state.location.pickupMethod); // Add this line to get pickupMethod from Redux
  const dispatch = useDispatch();

  const parseTimeString = (timeString) => {
    const [start, end] = timeString.split(' - ');
    const parseDate = (dateString) => {
      const [time, day, date] = dateString.split(' ');
      const [hours, minutes] = time.split(':').map(Number);
      const [dayPart, dayMonth] = date.split('/');
      return new Date(2024, parseInt(dayMonth, 10) - 1, parseInt(dayPart, 10), hours, minutes);
    };
    return {
      start: parseDate(start),
      end: parseDate(end),
    };
  };

  const parsedTime = parseTimeString(time);

  const calculateRentalDurationInDays = (start, end) => {
    const durationInMillis = end - start;
    const durationInDays = durationInMillis / (1000 * 60 * 60 * 24);
    return Math.ceil(durationInDays);
  };

  const calculateDiscountedPrice = (basePrice, promoCode, promotions) => {
    const promo = promotions.find((promotion) => promotion.promoCode === promoCode);
    let discount = 0;
    let totalPrice = basePrice;

    if (promo) {
      if (promo.discount.includes('%')) {
        const discountPercentage = parseInt(promo.discount, 10);
        discount = (basePrice * discountPercentage) / 100;
      } else {
        discount = parseInt(promo.discount, 10) * 1000;
      }
    }

    totalPrice -= discount;

    if (pickupMethod === 'delivery' && deliveryPrice) {
      totalPrice += deliveryPrice;
    }

    return totalPrice;
  };

  const handleSendPress = async () => {
    setModalVisible(true);
  };

  const handleConfirmRental = async () => {
    setModalVisible(false);
    setIsLoading(true);
    const token = await getToken();
    const rentalDurationInDays = calculateRentalDurationInDays(parsedTime.start, parsedTime.end);
    const basePrice = parseFloat(carInfo.price) * rentalDurationInDays * 1000;
    const discountedPrice = calculateDiscountedPrice(basePrice, selectedPromo, promotions);

    const createOrderDto = {
      userId: user.id,
      carId: carInfo.id,
      startRentDate: parsedTime.start.toISOString(),
      endRentDate: parsedTime.end.toISOString(),
      totalPrice: discountedPrice.toString(),
      paymentState: "PENDING",
      orderState: carInfo.fastAcceptBooking ? "CONFIRMED" : "PENDING",
      messageFromUser: message,
    };

    try {
      const response = await api.post("/order", createOrderDto, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.statusCode === 201) {

        dispatch(setDeliveryPrice(0));
        dispatch(setIsConfirmed(false));
        dispatch(setSelectedPromo(null));
        
        setTimeout(() => {
          setIsLoading(false);
          navigation.navigate("ConfirmationScreen", {
            carInfo,
            time: time,
            orderState: carInfo.fastAcceptBooking ? "CONFIRMED" : "PENDING",
            totalPrice:discountedPrice,
            animationType: "slide_from_bottom",
          });
        }, 800);
      } else {
        setIsLoading(false);
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data.statusCode === 400) {
        Alert.alert("Bad Request", error.response.data.message);
      } else {
        Alert.alert("Error", "Failed to create order. Please try again.");
      }
    }
  };

  return (
    <View style={styles.footerContainer}>
      <View style={styles.footerRow}>
        <TouchableOpacity
          onPress={() => setIsChecked(!isChecked)}
          style={styles.checkbox}
        >
          <Icon
            name={isChecked ? "checkmark-circle" : "ellipse-outline"}
            size={24}
            color={isChecked ? "#03A9F4" : "#D1D1D6"}
          />
        </TouchableOpacity>
        <Text style={styles.footerText}>Tôi đồng ý với </Text>
        <Text style={styles.footerLink}>
          Chính sách hủy chuyến của LKRental
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.footerButton, isLoading && styles.disabledButton]}
        onPress={handleSendPress}
        disabled={!isChecked || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.footerButtonText}>Gửi yêu cầu thuê xe</Text>
        )}
      </TouchableOpacity>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Lưu ý</Text>
            <Text style={styles.modalText}>
              [+] Giấy tờ thuê xe:{"\n"}
              GPLX (đối chiếu) & CCCD (đối chiếu VNeID){"\n"}hoặc{"\n"}
              GPLX (đối chiếu) & Passport (giữ lại)
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirmRental}
            >
              <Text style={styles.confirmButtonText}>Gửi yêu cầu thuê xe</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Hủy thuê</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    width: "100%",
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 40,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    position: "absolute",
    bottom: 0,
  },
  footerRow: {
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  checkbox: {
    marginRight: 6,
  },
  footerText: {
    fontSize: 13,
  },
  footerLink: {
    fontSize: 12.5,
    color: "#03A9F4",
    textDecorationLine: "underline",
  },
  footerButton: {
    backgroundColor: "#03A9F4",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#B0B0B0",
  },
  footerButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
  },
  confirmButton: {
    backgroundColor: "#03A9F4",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 10,
  },
  confirmButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#B0B0B0",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default FooterComponent;
