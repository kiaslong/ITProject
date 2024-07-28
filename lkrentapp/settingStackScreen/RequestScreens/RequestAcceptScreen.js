import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import api from '../../api';
import { getToken } from '../../utils/tokenStorage';

const RequestAcceptScreen = ({ route, navigation }) => {
  const { carId } = route.params;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const token = await getToken();
        const response = await api.get(`/order/car/${carId}/pending-requests`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const requestsData = response.data;

          const detailedRequests = await Promise.all(
            requestsData.map(async (request) => {
              const userInfo = await fetchUserInfo(request.userId, token);
              return { ...request, userInfo };
            })
            
          );
          
          setRequests(detailedRequests);
          
        }
      } catch (error) {
        console.error('Không thể tải các yêu cầu chờ', error);
        Alert.alert('Lỗi', 'Không thể tải các yêu cầu chờ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, [carId]);

  const fetchUserInfo = async (userId, token) => {
    try {
      const response = await api.get(`/auth/${userId}/info`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error(`Không thể tải thông tin người dùng với ID: ${userId}`, error);
    }
    return {};
  };

  const renderItem = ({ item }) => (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <Text style={styles.requestText}>Người dùng: {item.userInfo.fullName || item.userId}</Text>
        <Text style={styles.requestText}>Số điện thoại: {item.userInfo.phoneNumber || 'Không có số điện thoại'}</Text>
        <Text style={styles.requestText}>Ngày đặt: {formatDate(item.createdAt)}</Text>
      </View>
      <TouchableOpacity
        style={styles.acceptButton}
        onPress={() => handleAccept(item.id)}
      >
        <Text style={styles.acceptButtonText}>Chấp nhận</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAccept = async (requestId) => {
    console.log(requestId)
    try {
      const token = await getToken();
      const response = await api.patch(`/order/${requestId}/orderState`, 
        { orderState: 'CONFIRMED' }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        Alert.alert('Thành công', 'Yêu cầu đã được chấp nhận thành công');
        setRequests(requests.filter((request) => request.id !== requestId));
      }
    } catch (error) {
      console.error('Không thể chấp nhận yêu cầu', error);
      Alert.alert('Lỗi', 'Không thể chấp nhận yêu cầu. Vui lòng thử lại.');
    }
  };

  const formatDate = (dateString) => {
    const options = { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleString('vi-VN', options);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Đang tải...</Text>
      ) : (
        <FlatList
          data={requests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginHorizontal:3,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  requestInfo: {
    flex: 1,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
  },
  acceptButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RequestAcceptScreen;
