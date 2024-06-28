import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import getCoordinates from '../fetchData/Position';

const LocationComponent = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await getCoordinates(address, 'VN', 'pk.eyJ1Ijoia2lhc2xvbmciLCJhIjoiY2x4eWhvNjdnMDBzZTJqcHdwYTNleXdvZCJ9.UWYiYGrIbAo-apVq-djg-Q');
      if (coords && coords.latitude && coords.longitude) {
        setLocation(coords);
      }
    };

    fetchCoordinates();
  }, []);

  if (!location) {
    return <Text>Loading...</Text>;
  }

  const region = {
    latitude: location.latitude,
    longitude: location.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#03A9F4" />
        <Text style={styles.locationText}>{address}</Text>
      </View>
      <MapView
        style={styles.map}
        initialRegion={region}
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        
      >
       
        <Circle
          center={{ latitude: location.latitude, longitude: location.longitude }}
          radius={300}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.1)"
        />
      </MapView>
      <TouchableOpacity style={styles.fullscreenButton} onPress={toggleFullscreen}>
        <Ionicons name="expand-outline" size={24} color="black" />
      </TouchableOpacity>
      {isFullscreen && (
        <Modal visible={isFullscreen} animationType="slide" onRequestClose={toggleFullscreen}>
          <MapView
            style={styles.fullscreenMap}
            initialRegion={region}
          >
            
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={300}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.1)"
            />
          </MapView>
          <TouchableOpacity style={styles.closeFullscreenButton} onPress={toggleFullscreen}>
            <Ionicons name="close-outline" size={24} color="#03A9F4" />
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    backgroundColor: '#fff',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
   fontWeight:"400",
    marginLeft: 8,
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius:16,
  },
  fullscreenMap: {
    flex: 1,
  },
  fullscreenButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 5,
  },
  closeFullscreenButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
});

export default LocationComponent;
