import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator, RefreshControl, Modal, TouchableOpacity, Text } from 'react-native';
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

export default function FilteredHistoryScreen() {
  const navigation = useNavigation();
  const user = useSelector((state) => state.loggedIn.user);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterTime, setFilterTime] = useState(null); // State to manage filter time in hours
  const [filterDays, setFilterDays] = useState(null); // State to manage filter time in days
  const [filterOrderStatus, setFilterOrderStatus] = useState(''); // State to manage filter by order status
  const [filterModalVisible, setFilterModalVisible] = useState(false); // State to manage modal visibility
  const [currentFilterType, setCurrentFilterType] = useState('time'); // State to manage current filter type

  useEffect(() => {
    navigation.setParams({
      showIcon: true,
      iconName: 'calendar',
      functionName: 'calendarHistory',
    });
  }, [navigation]);

  useEffect(() => {
    const key = 'calendarHistory';
    const onPress = () => {
      setFilterModalVisible(true);
    };

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const fetchFilteredOrderHistory = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await api.get(`/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orderHistory = response.data;

      // Apply filter criteria if filterTime or filterDays is set
      const now = moment();
      const validOrders = orderHistory.filter(order => {
        const createdAt = moment(order.createdAt);
        const timeDiffHours = now.diff(createdAt, 'hours');
        const timeDiffDays = now.diff(createdAt, 'days');

        let isValid = true;

        if (filterTime) {
          isValid = isValid && timeDiffHours <= filterTime;
        }

        if (filterDays) {
          isValid = isValid && timeDiffDays <= filterDays;
        }

        if (filterOrderStatus) {
          isValid = isValid && order.orderState === filterOrderStatus;
        }

        return isValid;
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

      setHistory(combinedHistory);
      
    } catch (error) {
      console.error('Không thể tải lịch sử đơn hàng và thông tin xe', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.id, filterTime, filterDays, filterOrderStatus]);

  const debouncedFetchFilteredOrderHistory = useCallback(debounce(fetchFilteredOrderHistory, 1000), [fetchFilteredOrderHistory]);

  useEffect(() => {
    fetchFilteredOrderHistory();
  }, [fetchFilteredOrderHistory]);

  useInterval(() => {
    if (history.some((order) => order.orderState === 'CONFIRMED')) {
      fetchFilteredOrderHistory();
    }
  }, 5000);

  const onRefresh = () => {
    setRefreshing(true);
    debouncedFetchFilteredOrderHistory();
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

  const renderFilterContent = () => {
    switch (currentFilterType) {
      case 'time':
        return (
          <>
            <Text style={styles.modalTitle}>Chọn thời gian lọc</Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterTime(null); setFilterDays(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>Không lọc</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterTime(1); setFilterDays(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>1 giờ qua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterTime(3); setFilterDays(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>3 giờ qua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterTime(8); setFilterDays(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>8 giờ qua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterDays(1); setFilterTime(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>24 giờ qua</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterDays(30); setFilterTime(null); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>30 ngày qua</Text>
            </TouchableOpacity>
          </>
        );
      case 'orderStatus':
        return (
          <>
            <Text style={styles.modalTitle}>Lọc theo trạng thái đơn hàng</Text>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterOrderStatus('COMPLETED'); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>Hoàn thành</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterButton} onPress={() => { setFilterOrderStatus('CANCELED'); setFilterModalVisible(false); fetchFilteredOrderHistory(); }}>
              <Text style={styles.filterButtonText}>Đơn hủy</Text>
            </TouchableOpacity>
          </>
        );
      default:
        return null;
    }
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
      <FlatList
        initialNumToRender={3}
        showsVerticalScrollIndicator={false}
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

      <Modal
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setFilterModalVisible(false)}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setFilterModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tabButton, currentFilterType === 'time' && styles.activeTabButton]} onPress={() => setCurrentFilterType('time')}>
                <Text style={styles.tabButtonText}>Thời gian</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.tabButton, currentFilterType === 'orderStatus' && styles.activeTabButton]} onPress={() => setCurrentFilterType('orderStatus')}>
                <Text style={styles.tabButtonText}>Trạng thái</Text>
              </TouchableOpacity>
            </View>
            {renderFilterContent()}
          </View>
        </TouchableOpacity>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 320,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    left: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#000',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 20,
  },
  filterButton: {
    width: '100%',
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#03A9F4',
    borderRadius: 5,
    alignItems: 'center',
  },
  filterButtonText: {
    color: 'white',
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    padding: 10,
    marginTop:35,
    backgroundColor: '#03A9F4',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#0288D1',
  },
  tabButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
