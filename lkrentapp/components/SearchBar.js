import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { setLocation } from '../store/locationSlice';
import { setTime } from '../store/timeSlice';

export default function SearchBar({ navigation }) {
  const location = useSelector((state) => state.location.location);
  const time = useSelector((state) => state.time.time);
  const dispatch = useDispatch();
  const locationInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const isFocused = useIsFocused();

  const handleLocationFocus = () => {
    locationInputRef.current.blur();
    navigation.navigate('LocationPicker', { showBackButton: true });
  };

  const handleTimeFocus = () => {
    timeInputRef.current.blur();
    navigation.navigate('TimePicker', { showBackButton: true });
  };

  useEffect(() => {
    if (!isFocused) {
      if (locationInputRef.current) {
        locationInputRef.current.blur();
      }
      if (timeInputRef.current) {
        timeInputRef.current.blur();
      }
    }
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <Text style={styles.containerLabel}>Tìm kiếm xe theo nhu cầu của bạn</Text>
      <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.card}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Địa điểm</Text>
          <TextInput
            ref={locationInputRef}
            style={styles.input}
            onChangeText={(text) => dispatch(setLocation(text))}
            value={location}
            onFocus={handleLocationFocus}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian thuê</Text>
          <TextInput
            ref={timeInputRef}
            style={styles.input}
            onChangeText={(text) => dispatch(setTime(text))}
            value={time}
            onFocus={handleTimeFocus}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>Tìm xe</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  containerLabel: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
    textAlign: 'start',
    color: '#333',
  },
  card: {
    borderRadius: 10,
    padding: 15,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputContainer: {
    marginBottom: 12,
  },
  label: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    fontSize: 15,
    color: '#000',
    backgroundColor: '#d0eaff',
    padding: 9,
    borderRadius: 10,
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: "60%",
    backgroundColor: '#03a9f4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});
