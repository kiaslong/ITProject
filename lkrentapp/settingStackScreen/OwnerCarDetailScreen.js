import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import ModalPicker from './RegisterCarComponent/ModalPicker'; // Assuming ModalPicker is in RegisterCarComponent directory
import api from '../api';
import { getToken } from '../utils/tokenStorage';
import { useDispatch ,useSelector } from 'react-redux';
import { fetchOwnerCars } from '../store/carListSlice';

const OwnerCarDetailScreen = ({ route, navigation }) => {
  const { carInfo } = route.params;
  const dispatch = useDispatch()
  const user = useSelector((state) => state.loggedIn.user);
  const [allowApplyPromo, setAllowApplyPromo] = useState(carInfo.allowApplyPromo);
  const [supportsDelivery, setSupportsDelivery] = useState(carInfo.supportsDelivery);
  const [fastAcceptBooking, setFastAcceptBooking] = useState(carInfo.fastAcceptBooking);
  const [startDateFastBooking, setStartDateFastBooking] = useState(carInfo.startDateFastBooking);
  const [endDateFastBooking, setEndDateFastBooking] = useState(carInfo.endDateFastBooking);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const parseDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleString('vi-VN') : 'Chưa cài đặt';
  };

  const handleSave = async () => {
    try {
      const token = await getToken(); // Assume you have a utility function to get the token
      const response = await api.put(`/car/${carInfo.id}`, {
        allowApplyPromo,
        supportsDelivery,
        fastAcceptBooking,
        startDateFastBooking,
        endDateFastBooking,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        Alert.alert('Thành công', 'Chi tiết xe đã được cập nhật thành công');
        dispatch(fetchOwnerCars(user.id));
        navigation.goBack(); // Go back to the previous screen
      }
    } catch (error) {
      console.error('Không thể cập nhật chi tiết xe', error);
      Alert.alert('Lỗi', 'Không thể cập nhật chi tiết xe. Vui lòng thử lại.');
    }
  };

  const calculateDate = (timeString) => {
    const currentDate = new Date();
    if (timeString.includes('giờ tới')) {
      const hours = parseInt(timeString.split(' ')[0], 10);
      currentDate.setHours(currentDate.getHours() + hours);
    } else if (timeString.includes('tuần tới')) {
      const weeks = parseInt(timeString.split(' ')[0], 10);
      currentDate.setDate(currentDate.getDate() + weeks * 7);
    }
    return currentDate.toISOString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.label}>Cho phép áp dụng khuyến mãi</Text>
        <Switch
          value={allowApplyPromo}
          onValueChange={setAllowApplyPromo}
          trackColor={{ false: "#767577", true: "#03A9F4" }}
          thumbColor={allowApplyPromo ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Hỗ trợ giao xe</Text>
        <Switch
          value={supportsDelivery}
          onValueChange={setSupportsDelivery}
          trackColor={{ false: "#767577", true: "#03A9F4" }}
          thumbColor={supportsDelivery ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      <View style={styles.box}>
        <Text style={styles.label}>Chấp nhận đặt nhanh</Text>
        <Switch
          value={fastAcceptBooking}
          onValueChange={setFastAcceptBooking}
          trackColor={{ false: "#767577", true: "#03A9F4" }}
          thumbColor={fastAcceptBooking ? "#f4f3f4" : "#f4f3f4"}
        />
      </View>

      {fastAcceptBooking && (
        <>
          <View style={styles.box}>
            <Text style={styles.label}>Ngày bắt đầu cho đặt nhanh</Text>
            <TouchableOpacity onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateText}>{parseDate(startDateFastBooking)}</Text>
            </TouchableOpacity>
            <ModalPicker
              visible={showStartPicker}
              items={["6 giờ tới", "12 giờ tới", "24 giờ tới"]}
              onSelect={(item) => {
                setStartDateFastBooking(calculateDate(item));
                setShowStartPicker(false);
              }}
              label="Giới hạn từ"
              onClose={() => setShowStartPicker(false)}
            />
          </View>

          <View style={styles.box}>
            <Text style={styles.label}>Ngày kết thúc cho đặt nhanh</Text>
            <TouchableOpacity onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateText}>{parseDate(endDateFastBooking)}</Text>
            </TouchableOpacity>
            <ModalPicker
              visible={showEndPicker}
              items={["1 tuần tới", "2 tuần tới (khuyến nghị)", "3 tuần tới", "4 tuần tới"]}
              onSelect={(item) => {
                setEndDateFastBooking(calculateDate(item));
                setShowEndPicker(false);
              }}
              label="Cho đến"
              onClose={() => setShowEndPicker(false)}
            />
          </View>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  box: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 16,
    color: 'blue',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OwnerCarDetailScreen;
