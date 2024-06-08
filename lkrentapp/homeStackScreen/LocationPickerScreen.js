import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setLocation } from '../store/locationSlice';
import { Ionicons } from '@expo/vector-icons';

const locations = [
  'Đường Phan Đình Phùng, Phường 15, Q...',
  'Đường Lê Lợi, Quận 1, Q...',
  'Đường Nguyễn Huệ, Quận 1, Q...',
  'Đường Hai Bà Trưng, Quận 3, Q...',
];

export default function LocationPicker({ navigation }) {
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.location.location);

  const handleSelectLocation = (location) => {
    dispatch(setLocation(location));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn địa điểm</Text>
      <View style={styles.currentLocationContainer}>
        <Ionicons name="location-sharp" size={24} color="#555" />
        <View style={styles.currentLocationTextContainer}>
          <Text style={styles.currentLocationLabel}>Địa điểm hiện tại:</Text>
          <Text style={styles.currentLocation}>{currentLocation}</Text>
        </View>
      </View>
      <FlatList
        data={locations}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleSelectLocation(item)}>
            <View style={styles.itemContent}>
              <Ionicons name="location-outline" size={24} color="#03a9f4" />
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
  currentLocationContainer: {
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
  currentLocationTextContainer: {
    marginLeft: 10,
  },
  currentLocationLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  currentLocation: {
    fontSize: 16,
    color: '#555',
  },
  item: {
    padding: 15,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
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
