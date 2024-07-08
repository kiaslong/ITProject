import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const CarRentalStatus = ({ carInfo, time }) => {
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <View style={styles.statusItem}>
          <Icon name="document-text-outline" size={22} color="#03A9F4" />
          <Text style={styles.statusText}>Gửi yêu cầu</Text>
        </View>
        <Icon name="remove" size={22} color="#03A9F4" />
        <View style={styles.statusItem}>
          <Icon name="checkmark-circle-outline" size={22} color="#03A9F4" />
          <Text style={styles.statusText}>Duyệt yêu cầu</Text>
        </View>
        <Icon name="remove" size={22} color="#03A9F4" />
        <View style={styles.statusItem}>
          <Icon name="cash-outline" size={22} color="#03A9F4" />
          <Text style={styles.statusText}>Thanh toán cọc</Text>
        </View>
        <Icon name="remove" size={22} color="#03A9F4" />
        <View style={styles.statusItem}>
          <Icon name="car-outline" size={22} color="#03A9F4" />
          <Text style={styles.statusText}>Khởi hành</Text>
        </View>
        <Icon name="remove" size={22} color="#03A9F4" />
        <View style={styles.statusItem}>
          <Icon name="checkmark-done-outline" size={22} color="#03A9F4" />
          <Text style={styles.statusText}>Kết thúc</Text>
        </View>
      </View>

      <View style={styles.countdownContainer}>
        <Icon name="time-outline" size={22} color="#FFA500" />
        <Text style={styles.countdownText}>Thời gian thanh toán cọc còn 59 phút 41 giây</Text>
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
    justifyContent: 'space-evenly',
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
  viewMoreText: {
    fontSize: 14,
    color: '#03A9F4',
    textDecorationLine: 'underline',
  },
});

export default CarRentalStatus;
