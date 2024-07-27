import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import api from '../../api';
import { getToken } from '../../utils/tokenStorage';

const ConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.loggedIn.user);
  const { carInfo, time, orderState, totalPrice } = route.params;
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrderId = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await api.get(`/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderHistory = response.data;
      const matchingOrder = orderHistory.find(order => order.carId === carInfo.id && order.orderState === 'CONFIRMED');

      if (matchingOrder) {
        setOrderId(matchingOrder.id);
      }
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  }, [carInfo.id, user.id]);

  useEffect(() => {
    fetchOrderId();
  }, [fetchOrderId]);

  const handlePayPress = () => {
    navigation.navigate("Payment", {
      totalPrice,
      animationType: "slide_from_bottom",
      showHeader: true,
      showTitle: true,
      screenTitle: "Thanh toán",
      showCloseButton: true,
      showBackButton: true,
      customGoBackRoute: "CarRentalOrder",
      customData1: carInfo,
      customData2: time,
      customData3: orderId,
      customData4: totalPrice,
    });
  };

  const handleAddAnotherCarPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
    navigation.navigate("Main");
  };

  const handleManagePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
    navigation.navigate("Chuyến");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark-circle" size={80} color="#03A9F4" />
      </View>
      <Text style={styles.message}>
        {orderState === "CONFIRMED"
          ? "Yêu cầu thuê xe đã được duyệt tự động. Bạn vui lòng đặt cọc ngay để hoàn tất việc đặt xe"
          : "Yêu cầu thuê xe của bạn đang chờ duyệt. Bạn vui lòng chờ để hoàn tất việc đặt xe"}
      </Text>
      {orderState === "CONFIRMED" ? (
        <TouchableOpacity style={styles.primaryButton} onPress={handlePayPress}>
          <Text style={styles.primaryButtonText}>Đặt cọc ngay</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddAnotherCarPress}>
          <Text style={styles.primaryButtonText}>Đặt thêm xe khác</Text>
        </TouchableOpacity>
      )}

      {orderState === "PENDING" ? (
        <TouchableOpacity onPress={handleManagePress}>
          <Text style={styles.secondaryButtonText}>Quản lý chuyến</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={handleAddAnotherCarPress}>
          <Text style={styles.secondaryButtonText}>Đặt thêm xe khác</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#03A9F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
