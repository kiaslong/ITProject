import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MapView, { Circle } from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getCoordinates} from '../fetchData/Position';

const LocationComponent = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const mapRef = useRef(null);
  const fullscreenMapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      const coords = await getCoordinates(address, process.env.MAP_BOX_KEY);
      if (coords && coords.latitude && coords.longitude) {
        setLocation(coords);
        setSelectedRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.04,
          longitudeDelta: 0.04,
        });
      }
    };

    fetchCoordinates();
  }, [address]);

  useEffect(() => {
    if (mapRef.current && selectedRegion) {
      mapRef.current.animateToRegion(selectedRegion, 1000);
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (fullscreenMapRef.current && selectedRegion) {
      fullscreenMapRef.current.animateToRegion(selectedRegion, 1000);
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!location || !selectedRegion) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={20} color="#03A9F4" />
        <Text style={styles.locationText}>{address}</Text>
      </View>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={selectedRegion}
        region={selectedRegion}
        liteMode={true} // Use liteMode for non-fullscreen map
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        toolbarEnabled={false}
        loadingEnabled={true}
      >
        <Circle
          center={{ latitude: location.latitude, longitude: location.longitude }}
          radius={900}
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
            ref={fullscreenMapRef}
            style={styles.fullscreenMap}
            initialRegion={selectedRegion}
            region={selectedRegion}
            toolbarEnabled={false}
            showsCompass={false}
            loadingEnabled={true}
            scrollEnabled={true} // Enable scrolling in fullscreen mode
            zoomEnabled={true}
            pitchEnabled={true}
            rotateEnabled={true}
          >
            <Circle
              center={{ latitude: location.latitude, longitude: location.longitude }}
              radius={900}
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
    marginBottom: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    marginBottom: 12,
  },
  locationText: {
    fontSize: 15,
    fontWeight: '400',
    marginLeft: 8,
  },
  map: {
    width: '100%',
    height: 240,
    borderRadius: 16,
  },
  fullscreenMap: {
    ...StyleSheet.absoluteFillObject,
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
