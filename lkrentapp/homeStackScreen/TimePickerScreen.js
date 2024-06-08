import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setTime } from '../store/timeSlice';
import { Ionicons } from '@expo/vector-icons';

const times = [
  '21h00, 07/06 - 20h00, 08/06',
  '09h00, 08/06 - 18h00, 08/06',
  '10h00, 08/06 - 12h00, 08/06',
  '14h00, 08/06 - 16h00, 08/06',
];

export default function TimePicker({ navigation }) {
  const dispatch = useDispatch();
  const currentTime = useSelector((state) => state.time.time);

  const handleSelectTime = (time) => {
    dispatch(setTime(time));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn thời gian thuê</Text>
      <View style={styles.currentTimeContainer}>
        <Ionicons name="time-outline" size={24} color="#555" />
        <View style={styles.currentTimeTextContainer}>
          <Text style={styles.currentTimeLabel}>Thời gian hiện tại:</Text>
          <Text style={styles.currentTime}>{currentTime}</Text>
        </View>
      </View>
      <FlatList
        data={times}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectTime(item)}>
            <View style={styles.itemContent}>
              <Ionicons name="time-outline" size={24} color="#03a9f4" />
              <Text style={styles.itemText}>{item}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  currentTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  currentTimeTextContainer: {
    marginLeft: 10,
  },
  currentTimeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentTime: {
    fontSize: 16,
    color: '#555',
  },
  item: {
    padding: 15,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  separator: {
    height: 10,
  },
});


