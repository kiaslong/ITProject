// ReferFriendScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ReferFriendScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Mã giới thiệu</Text>
        <Text style={styles.cardSubtitle}>Áp dụng cho thành viên đã xác thực ứng dụng LKRental</Text>
      </View>
      <Text style={styles.trackingTitle}>Theo dõi mã giới thiệu</Text>
      <View style={styles.trackingRow}>
        <Text style={styles.trackingText}>Số điểm đã nhận</Text>
        <Text style={styles.trackingNumber}>0</Text>
      </View>
      <View style={styles.trackingRow}>
        <Text style={styles.trackingText}>Số chuyến đã hoàn thành</Text>
        <Text style={styles.trackingNumber}>0</Text>
      </View>
    </View>
  );
};

export default ReferFriendScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#757575',
  },
  trackingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  trackingText: {
    fontSize: 16,
  },
  trackingNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
