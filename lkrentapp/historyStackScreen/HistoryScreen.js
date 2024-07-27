import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import HistoryListItem from '../components/HistoryListItem';
import { registerFunction, unregisterFunction } from '../store/functionRegistry';
import api from '../api';
import { getToken } from '../utils/tokenStorage';
import useInterval from '../utils/interval';

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export default function HistoryScreen() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.loggedIn.user);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    navigation.setParams({
      showIcon: true,
      iconName: 'calendar',
      functionName: 'calendarPress',
    });
  }, [navigation]);

  useEffect(() => {
    const key = 'calendarPress';
    const onPress = () => {
      navigation.navigate('FilterHistory');
    };

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const cancelOrder = async (orderId) => {
    const token = await getToken();
    try {
      await api.patch(
        `/order/${orderId}/orderState`,
        { orderState: 'CANCELED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await api.patch(
        `/order/${orderId}/paymentState`,
        { paymentState: 'FAILED' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to cancel order', error);
    }
  };

  const fetchOrderHistory = useCallback(async () => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    const token = await getToken();
    try {
      const response = await api.get(`/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderHistory = response.data;

      // Filter orders based on the criteria
      const now = moment();
      const validOrders = orderHistory.filter(order => {
        const createdAt = moment(order.createdAt);
        const timeDiff = now.diff(createdAt, 'hours');
        return timeDiff <= 2 || order.orderState === 'CONFIRMED' || order.orderState === 'PENDING';
      });

      const carDetailsMap = {};
      const carIds = [...new Set(validOrders.map((order) => order.carId))];
      const carDetailsPromises = carIds.map((carId) =>
        api.get(`/car/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const carDetailsResponses = await Promise.all(carDetailsPromises);
      carDetailsResponses.forEach((response) => {
        carDetailsMap[response.data.id] = response.data;
      });

      const combinedHistory = validOrders.map((order) => ({
        ...order,
        carInfo: carDetailsMap[order.carId],
      }));

      const completedOrderPromises = carIds.map((carId) =>
        api.get(`/order/car/${carId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
      );

      const completedOrderResponses = await Promise.all(completedOrderPromises);
      completedOrderResponses.forEach((response, index) => {
        const completedOrder = response.data.find(
          order => order.paymentState === 'COMPLETED' && order.userId !== user.id
        );
        if (completedOrder) {
          const currentOrder = combinedHistory.find(order => order.carId === carIds[index]);
          if (moment(completedOrder.updatedAt).isAfter(moment(currentOrder.updatedAt))) {
            currentOrder.autoCanceled = true;
            cancelOrder(currentOrder.id);
          }
        }
      });

      setHistory(combinedHistory);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHistory([]);
      } else {
        console.error('Failed to fetch order history and car details', error);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  const debouncedFetchOrderHistory = useCallback(debounce(fetchOrderHistory, 1000), [fetchOrderHistory]);

  useEffect(() => {
    fetchOrderHistory();
  }, [fetchOrderHistory]);

  useInterval(() => {
    fetchOrderHistory();
  }, 5000);

  const onRefresh = () => {
    setRefreshing(true);
    debouncedFetchOrderHistory();
  };

  const formatDate = (dateString) => {
    return moment(dateString).format('HH:mm, DD/MM');
  };

  const handlePress = (carInfo, time, orderId, totalPrice) => {
    navigation.navigate('CarRentalOrder', {
      totalPrice,
      carInfo,
      time,
      orderId,
      animationType: 'slide_from_bottom',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyMessage}>Chưa có đơn thuê</Text>
      ) : (
        <FlatList
          initialNumToRender={3}
          data={history}
          style={styles.list}
          renderItem={({ item }) => (
            <HistoryListItem
              history={item}
              onPress={() =>
                handlePress(item.carInfo, `${formatDate(item.startRentDate)} - ${formatDate(item.endRentDate)}`, item.id, item.totalPrice)
              }
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#03A9F4']} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  list: {
    width: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
