import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';

export default function SearchBox({ navigation }) {
  const location = useSelector((state) => state.location.location);
  const time = useSelector((state) => state.time.time);
  const locationInputRef = useRef(null);
  const timeInputRef = useRef(null);
  const isFocused = useIsFocused();

  const handleLocationPress = () => {
    navigation.navigate('LocationPicker', { showHeader:true,showBackButton: true });
  };

  const handleTimePress = () => {
    navigation.navigate('TimePicker', { showHeader:true,showBackButton: true });
  };

  const handleSearchPress = () => {
    navigation.navigate('Searching', { showBackButton:true , showHeader:true, location, time, showSearchBar: true, showTitle: false});
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
          <Text style={styles.label}>Địa điểm:</Text>
          <TouchableOpacity style={styles.touchable} onPress={handleLocationPress}>
            <Text style={styles.placeholderBold} numberOfLines={1} ellipsizeMode="tail">
              {location || 'Chọn địa điểm'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Thời gian thuê:</Text>
          <TouchableOpacity style={styles.touchable} onPress={handleTimePress}>
            <Text style={styles.placeholderBold} numberOfLines={1} ellipsizeMode="tail">
              {time || 'Chọn thời gian'}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleSearchPress}>
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
    paddingLeft: 5,
    marginBottom: 15,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  card: {
    borderRadius: 15,
    padding: 20,
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
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  touchable: {
    fontSize: 18,
    color: '#000',
    backgroundColor: '#d0eaff',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    width: "88%",
    backgroundColor: '#03a9f4',
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: '#fff',
    fontWeight: 'bold',
  },
  placeholderBold: {
    fontWeight: '400',
    fontSize: 17,
  },
});

