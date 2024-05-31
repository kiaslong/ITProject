import { View, Text, Image, StyleSheet } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function HistoryListItem({ history }) {
  return (
    <View style={styles.outerContainer}>
      <Text style={styles.maThue}>Mã thuê: {history.id}</Text>
      <View style={styles.container}>
        <Image 
          source={require('../assets/lkrentlogo.png')}
          style={styles.image}
        />
        <View style={styles.subContainer}>
          <Text style={styles.carName}>{history.carName}</Text>
          <Text style={styles.timeText}>
            <Ionicons name="calendar" size={20} color="black" /> {history.timeStart} - {history.timeEnd}
          </Text>
          <Text style={styles.remainingTime}>
            Thanh toán: <Text style={styles.status} >{history.status}</Text>
          </Text>
          <Text style={styles.remainingTime}>
            Thời gian còn lại <Text style={styles.remainingTimeText}>{history.timeRemain}</Text>
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>Thông tin chi tiết đặt xe</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    marginBottom: 15,
  },
  maThue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  container: {
    padding: 10,
    backgroundColor: '#F6F6F6',
    borderRadius: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
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
    marginBottom: 10,
    textAlign: 'left',
  },
  remainingTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
  },
  remainingTimeText: {
    color: 'black', // Set the color to black
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align to the end
  },
  details: {
    fontSize: 14,
    color: '#03a9f4',
    marginTop: 5,
  },
});
