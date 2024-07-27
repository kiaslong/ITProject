import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import useInterval from '../utils/interval';
import api from '../api';
import { getToken } from '../utils/tokenStorage';

const orderStateTranslations = {
  PENDING: 'Đang chờ',
  CONFIRMED: 'Đã xác nhận',
  CANCELED: 'Đã hủy',
  COMPLETED: 'Đã hoàn thành'
};

const paymentStateTranslations = {
  PENDING: 'Đang chờ thanh toán',
  COMPLETED: 'Đã thanh toán',
  FAILED: 'Thanh toán thất bại',
  REFUNDED: 'Đã hoàn tiền'
};

const HistoryListItem = ({ history, onPress }) => {
  const [remainingTime, setRemainingTime] = useState('');
  const [timerStarted, setTimerStarted] = useState(false);

  const formatDate = useCallback((dateString) => {
    return moment(dateString).format('HH:mm, DD/MM');
  }, []);

  const endTime = useMemo(() => {
    return moment(history.createdAt).add(1, 'hour');
  }, [history.createdAt]);

  const updateRemainingTime = useCallback(() => {
    if (history.orderState === 'CONFIRMED' && history.paymentState === 'PENDING') {
      const now = moment();
      const duration = moment.duration(endTime.diff(now));
      if (duration.asSeconds() <= 0) {
        setRemainingTime('Hết hạn');
        updateOrderStateToCanceled(history.id); // Update order state to CANCELED and payment state to FAILED when time is up
      } else {
        setRemainingTime(`${duration.minutes()}p ${duration.seconds()}s`);
      }
    }
  }, [endTime, history.orderState, history.paymentState, history.id]);

  const updateOrderStateToCanceled = async (orderId) => {
    const token = await getToken();
    try {
      await api.patch(`/order/${orderId}/orderState`, {
        orderState: 'CANCELED',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await api.patch(`/order/${orderId}/paymentState`, {
        paymentState: 'FAILED',
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error('Failed to update order state to CANCELED and payment state to FAILED', error);
    }
  };

  useEffect(() => {
    if (history.orderState === 'CONFIRMED' && !timerStarted) {
      setTimerStarted(true);
      updateRemainingTime();
    }
  }, [history.orderState, timerStarted, updateRemainingTime]);

  useInterval(updateRemainingTime, history.orderState === 'CONFIRMED' ? 1000 : null);

  const memoizedOrderState = useMemo(() => orderStateTranslations[history.orderState], [history.orderState]);
  const memoizedPaymentState = useMemo(() => paymentStateTranslations[history.paymentState], [history.paymentState]);

  return (
    <TouchableOpacity style={styles.outerContainer} onPress={() => onPress(history.id)}>
      <Text style={styles.maThue}>Mã thuê: LKO{history.id}</Text>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Text style={[styles.status, history.orderState === 'CANCELED' && styles.statusCanceled]}>
            {memoizedOrderState}
          </Text>
          <Image 
            source={{ uri: history.carInfo.thumbImage }}
            style={styles.image}
            resizeMode="auto"
          />
        </View>
        <View style={styles.subContainer}>
          <Text style={styles.carName}>{history.carInfo.title}</Text>
          <Text style={styles.timeText}>
            <Ionicons name="calendar" size={18} color="black" /> Bắt đầu: {formatDate(history.startRentDate)}
          </Text>
          <Text style={styles.timeText}>
            <Ionicons name="calendar" size={18} color="black" /> Kết thúc: {formatDate(history.endRentDate)}
          </Text>
          {history.orderState !== 'COMPLETED' && (
            <>
              <Text style={styles.remainingTime}>
                Thanh toán: <Text style={[styles.status, history.paymentState === 'FAILED' && styles.statusFailed]}>
                  {history.orderState === 'PENDING' ? 'Đang chờ duyệt' : memoizedPaymentState}
                </Text>
              </Text>
              {history.paymentState === 'PENDING' && history.orderState === 'CONFIRMED' ? (
                <Text style={styles.remainingTime}>
                  Thời gian còn lại: <Text style={styles.remainingTimeText}>{remainingTime}</Text>
                </Text>
              ) : remainingTime === 'Hết hạn' && (
                <Text style={styles.expiredText}>
                  Bạn đã hết thời gian thanh toán cọc
                </Text>
              )}
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(HistoryListItem);

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 15,
    paddingHorizontal: 6,
  },
  maThue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginLeft: 10,
  },
  container: {
    padding: 8,
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  image: {
    width: 130,
    height: 130,
    borderRadius: 10,
  },
  subContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  carName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    textAlign: 'left',
  },
  status: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
  },
  statusCanceled: {
    color: 'red',
  },
  statusFailed: {
    color: 'red',
  },
  remainingTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'left',
  },
  remainingTimeText: {
    color: 'black',
  },
  expiredText: {
    fontSize: 14,
    color: 'red',
    marginTop: 5,
    textAlign: 'left',
  },
});
