import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import moment from 'moment';
import api from '../../api';
import { getToken } from '../../utils/tokenStorage';
import useInterval from '../../utils/interval';

const orderStateTranslations = {
  PENDING: 'Đang chờ',
  CONFIRMED: 'Đã xác nhận',
  CANCELED: 'Đã hủy',
  COMPLETED: 'Đã hoàn thành',
};

const paymentStateTranslations = {
  PENDING: 'Đang chờ thanh toán',
  COMPLETED: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại hoặc có người đặt cọc trước',
  REFUNDED: 'Đã hoàn tiền',
};

const CarRentalStatus = ({ carInfo, orderId }) => {
  const user = useSelector((state) => state.loggedIn.user);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState('');
  const [countdownExpired, setCountdownExpired] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);

  const fetchOrderStatus = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await api.get(`/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(response.data);
      setCountdownExpired(false); // Reset the flag when new data is fetched
    } catch (error) {
      console.error('Failed to fetch order status', error);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrderStatus();
  }, [fetchOrderStatus]);

  useInterval(fetchOrderStatus, 5000);

  const updateCountdown = useCallback(() => {
    if (!order) return;
    if (order.orderState === 'CONFIRMED' && order.paymentState === 'PENDING') {
      const endTime = moment(order.updatedAt).add(59, 'minutes').add(59, 'seconds');
      const now = moment();
      const duration = moment.duration(endTime.diff(now));
      if (duration.asSeconds() <= 0) {
        setCountdown('Bạn đã hết thời gian thanh toán cọc');
        setCountdownExpired(true); // Set the flag to true
      } else {
        setCountdown(`${duration.minutes()}p ${duration.seconds()}s`);
      }
    }
  }, [order]);

  useEffect(() => {
    if (order && order.orderState === 'CONFIRMED' && !timerStarted) {
      setTimerStarted(true);
      updateCountdown();
    }
  }, [order, timerStarted, updateCountdown]);

  useInterval(updateCountdown, order && order.orderState === 'CONFIRMED' ? 1000 : null);

  useEffect(() => {
    if (countdownExpired) {
      const timer = setTimeout(() => {
        fetchOrderStatus();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [countdownExpired, fetchOrderStatus]);

  if (loading) {
    return <ActivityIndicator size="large" color="#03A9F4" />;
  }

  if (!order) {
    return <Text>No order status available for this car</Text>;
  }

  const { paymentState, orderState } = order;

  const getStepStyle = (step) => {
    switch (step) {
      case 'Gửi yêu cầu':
        return orderState === 'PENDING' || orderState === 'CONFIRMED' || orderState === 'COMPLETED' ? styles.statusItemCompleted : styles.statusItemPending;
      case 'Duyệt yêu cầu':
        return orderState === 'CONFIRMED' || orderState === 'COMPLETED'
          ? styles.statusItemCompleted 
          : styles.statusItemPending;
      case 'Thanh toán cọc':
        return (paymentState === 'PENDING' || paymentState === 'COMPLETED') && (orderState === 'CONFIRMED' || orderState === 'COMPLETED')
          ? styles.statusItemCompleted 
          : styles.statusItemPending;
      case 'Khởi hành':
        return paymentState === 'COMPLETED' && (orderState === 'CONFIRMED' || orderState === 'COMPLETED')
          ? styles.statusItemCompleted 
          : styles.statusItemPending;
      case 'Kết thúc':
        return orderState === 'COMPLETED' 
          ? styles.statusItemCompleted 
          : styles.statusItemPending;
      default:
        return styles.statusItemPending;
    }
  };

  const getIconColor = (step) => {
    switch (step) {
      case 'Gửi yêu cầu':
        return orderState === 'PENDING' || orderState === 'CONFIRMED' || orderState === 'COMPLETED' ? "#03A9F4" : "#B0BEC5";
      case 'Duyệt yêu cầu':
        return orderState === 'CONFIRMED' || orderState === 'COMPLETED' 
          ? "#03A9F4" 
          : "#B0BEC5";
      case 'Thanh toán cọc':
        return (paymentState === 'PENDING' || paymentState === 'COMPLETED') && (orderState === 'CONFIRMED' || orderState === 'COMPLETED')
          ? "#03A9F4" 
          : "#B0BEC5";
      case 'Khởi hành':
        return paymentState === 'COMPLETED' && (orderState === 'CONFIRMED' || orderState === 'COMPLETED')
          ? "#03A9F4" 
          : "#B0BEC5";
      case 'Kết thúc':
        return orderState === 'COMPLETED' 
          ? "#03A9F4" 
          : "#B0BEC5";
      default:
        return "#B0BEC5";
    }
  };

  const getRemoveIconColor = (currentStep, nextStep) => {
    if (getIconColor(currentStep) === "#03A9F4" && getIconColor(nextStep) === "#03A9F4") {
      return "#03A9F4";
    }
    return "#B0BEC5";
  };

  return (
    <View style={styles.container}>
      {orderState === 'CANCELED' ? (
        <View style={styles.canceledContainer}>
          <Text style={styles.canceledText}>Đơn hàng đã hủy tự động</Text>
        </View>
      ) : (
        <>
          <View style={styles.statusContainer}>
            <View style={getStepStyle('Gửi yêu cầu')}>
              <Icon name="document-text-outline" size={22} color={getIconColor('Gửi yêu cầu')} />
              <Text style={styles.statusText}>Gửi yêu cầu</Text>
            </View>
            <Icon style={styles.removeIcon} name="remove" size={22} color={getRemoveIconColor('Gửi yêu cầu', 'Duyệt yêu cầu')} />
            <View style={getStepStyle('Duyệt yêu cầu')}>
              <Icon name="checkmark-circle-outline" size={22} color={getIconColor('Duyệt yêu cầu')} />
              <Text style={styles.statusText}>Duyệt yêu cầu</Text>
            </View>
            <Icon style={styles.removeIcon} name="remove" size={22} color={getRemoveIconColor('Duyệt yêu cầu', 'Thanh toán cọc')} />
            <View style={getStepStyle('Thanh toán cọc')}>
              <Icon name="cash-outline" size={22} color={getIconColor('Thanh toán cọc')} />
              <Text style={styles.statusText}>Thanh toán cọc</Text>
            </View>
            <Icon style={styles.removeIcon} name="remove" size={22} color={getRemoveIconColor('Thanh toán cọc', 'Khởi hành')} />
            <View style={getStepStyle('Khởi hành')}>
              <Icon name="car-outline" size={22} color={getIconColor('Khởi hành')} />
              <Text style={styles.statusText}>Khởi hành</Text>
            </View>
            <Icon style={styles.removeIcon} name="remove" size={22} color={getRemoveIconColor('Khởi hành', 'Kết thúc')} />
            <View style={getStepStyle('Kết thúc')}>
              <Icon name="checkmark-done-outline" size={22} color={getIconColor('Kết thúc')} />
              <Text style={styles.statusText}>Kết thúc</Text>
            </View>
          </View>

          {orderState === 'COMPLETED' ? (
            <View style={styles.completedContainer}>
              <Text style={styles.completedText}>Chuyến của bạn đã kết thúc</Text>
            </View>
          ) : countdownExpired ? (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>Bạn đã hết thời gian thanh toán cọc</Text>
            </View>
          ) : (
            (orderState !== 'CANCELED' && orderState !== 'COMPLETED') && paymentState === 'PENDING' && orderState === 'CONFIRMED' ? (
              <View style={styles.countdownContainer}>
                <Icon name="time-outline" size={22} color="#FFA500" />
                <Text style={styles.countdownText}>Thời gian thanh toán cọc còn {countdown}</Text>
              </View>
            ) : null
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  removeIcon: {
    marginBottom: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginVertical: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusItemCompleted: {
    alignItems: 'center',
  },
  statusItemPending: {
    alignItems: 'center',
    opacity: 0.5, // Dim the color for pending steps
  },
  statusText: {
    marginTop: 10,
    fontSize: 12,
    color: '#000',
  },
  countdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEFD5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  countdownText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#FF4500',
  },
  completedContainer: {
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  completedText: {
    fontSize: 16,
    color: '#00796B',
  },
  canceledContainer: {
    alignItems: 'center',
    backgroundColor: '#FDECEA',
    padding: 10,
    borderRadius: 10,
    marginBottom: 16,
  },
  canceledText: {
    fontSize: 16,
    color: '#D32F2F',
  },
});

export default CarRentalStatus;
