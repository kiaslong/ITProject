import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const HistoryListItem = ({ history, onPress }) => {
  return (
    <TouchableOpacity style={styles.outerContainer} onPress={() => onPress(history.id)}>
      <Text style={styles.maThue}>Mã thuê: {history.id}</Text>
      <View style={styles.container}>
        <Image 
          source={{ uri: history.image }}
          style={styles.image}
          resizeMode="auto"
        />
        <View style={styles.subContainer}>
          <Text style={styles.carName}>{history.carName}</Text>
          <Text style={styles.timeText}>
            <Ionicons name="calendar" size={20} color="black" /> {history.timeStart} - {history.timeEnd}
          </Text>
          <Text style={styles.remainingTime}>
            Thanh toán: <Text style={styles.status}>{history.status}</Text>
          </Text>
          <Text style={styles.remainingTime}>
            Thời gian còn lại <Text style={styles.remainingTimeText}>{history.timeRemain}</Text>
          </Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.details}>Thông tin chi tiết đặt xe</Text>
          </View>
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
  image: {
    width: 130,
    height: 130,
    marginRight: 10,
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
    textAlign: 'left',
  },
  remainingTime: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'left',
  },
  remainingTimeText: {
    color: 'black',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  details: {
    fontSize: 14,
    color: '#03a9f4',
  },
});
