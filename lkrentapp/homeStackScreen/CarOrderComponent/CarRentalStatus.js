import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CarRentalStatus = ({ carInfo, time, navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Icon name="document-text-outline" size={24} color="#34C759" />
          <Text style={styles.statusText}>Gửi yêu cầu</Text>
        </View>
        <Icon name="remove" size={24} color="#34C759" />
        <View style={styles.statusItem}>
          <Icon name="checkmark-circle-outline" size={24} color="#34C759" />
          <Text style={styles.statusText}>Duyệt yêu cầu</Text>
        </View>
        <Icon name="remove" size={24} color="#34C759" />
        <View style={styles.statusItem}>
          <Icon name="cash-outline" size={24} color="#34C759" />
          <Text style={styles.statusText}>Thanh toán cọc</Text>
        </View>
        <Icon name="remove" size={24} color="#34C759" />
        <View style={styles.statusItem}>
          <Icon name="car-outline" size={24} color="#34C759" />
          <Text style={styles.statusText}>Khởi hành</Text>
        </View>
        <Icon name="remove" size={24} color="#34C759" />
        <View style={styles.statusItem}>
          <Icon name="checkmark-done-outline" size={24} color="#34C759" />
          <Text style={styles.statusText}>Kết thúc</Text>
        </View>
      </View>

      <View style={styles.countdownContainer}>
        <Icon name="time-outline" size={24} color="#FFA500" />
        <Text style={styles.countdownText}>Thời gian thanh toán cọc còn 59 phút 41 giây</Text>
      </View>

      <View style={styles.insuranceContainer}>
        <Icon name="shield-checkmark-outline" size={24} color="#A0A0A0" />
        <Text style={styles.insuranceText}>
          Bảo hiểm thuê xe VNI sẽ được tự động kích hoạt khi khởi hành
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewMoreText}>Xem thêm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 16,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusText: {
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
  insuranceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  insuranceText: {
    flex: 1,
    fontSize: 14,
    color: '#A0A0A0',
    marginLeft: 8,
  },
  viewMoreText: {
    fontSize: 14,
    color: '#34C759',
    textDecorationLine: 'underline',
  },
});

export default CarRentalStatus;
