import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import moment from 'moment';

const calculateRentalDays = (start, end) => {
  const startDate = moment(start, 'HH:mm, DD/MM');
  const endDate = moment(end, 'HH:mm, DD/MM');
  return endDate.diff(startDate, 'days');
};

const ChangeLocationTimeScreen = ({ navigation }) => {
  


    const locationFromRedux = useSelector((state) => state.location.location);
    const timeFromRedux = useSelector((state) => state.time.time);
  
    const [location, setLocationState] = useState(locationFromRedux);
    const [rentalTime, setRentalTimeState] = useState(timeFromRedux);
    const [rentalDays, setRentalDays] = useState(0);

  useEffect(() => {
    const [start, end] = rentalTime.split(' - ');
    setRentalDays(calculateRentalDays(start, end));
  }, [rentalTime]);

  useEffect(() => {
    if (locationFromRedux !== location) {
      setLocationState(locationFromRedux);
    }
  }, [locationFromRedux]);

  useEffect(() => {
    if (timeFromRedux !== rentalTime) {
      setRentalTimeState(timeFromRedux);
    }
  }, [timeFromRedux]);

  const handleLocationPress = () => {
    navigation.navigate('LocationPicker', { showBackButton: true });
  };

  const handleTimePress = () => {
    navigation.navigate('TimePicker', { showBackButton: true });
  };

  const handleConfirmPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa điểm</Text>
          <TouchableOpacity style={styles.row} onPress={handleLocationPress}>
            <Ionicons name="location-outline" size={24} color="#000" />
            <Text style={styles.inputText} numberOfLines={1}
            ellipsizeMode="tail">
              {location || 'Nhập địa điểm'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian thuê</Text>
          <TouchableOpacity style={styles.row} onPress={handleTimePress}>
            <Ionicons name="calendar-outline" size={24} color="#000" />
            <Text style={styles.inputText}>
              {rentalTime || 'Nhập thời gian thuê'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Số ngày thuê: {rentalDays} ngày</Text>
        <TouchableOpacity style={styles.button} onPress={handleConfirmPress}>
          <Text style={styles.buttonText}>Tìm xe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 55,
    marginBottom: 10,
  },
  inputText: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    fontSize: 17,
    paddingVertical: 5,
    color: '#000',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  footerText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#03a9f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
  },
});

export default ChangeLocationTimeScreen;
