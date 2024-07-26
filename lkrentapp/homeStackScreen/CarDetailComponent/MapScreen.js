import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Polyline, Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import polyline from '@mapbox/polyline';
import { useNavigation } from '@react-navigation/native';
import { getDirection } from '../../fetchData/Position'; // Adjust the import path as necessary

const MapScreen = () => {
  const route = useRoute();
  const { carLocation, userLocation } = route.params;
  const navigation = useNavigation();
  

  const [coordinates, setCoordinates] = useState([]);
  const [region, setRegion] = useState({
    latitude: (carLocation.latitude + userLocation.latitude) / 2,
    longitude: (carLocation.longitude + userLocation.longitude) / 2,
    latitudeDelta: Math.abs(carLocation.latitude - userLocation.latitude) * 1.5,
    longitudeDelta: Math.abs(carLocation.longitude - userLocation.longitude) * 1.5,
  });

  useEffect(() => {
    const fetchDirection = async () => {
      try {
        const directionData = await getDirection(carLocation, userLocation, process.env.GOONG_KEY);
       
        if (directionData && directionData.geometry) {
          const decodedCoords = polyline.decode(directionData.geometry).map(coord => ({
            latitude: coord[0],
            longitude: coord[1],
          }));
          setCoordinates(decodedCoords);
        }
      } catch (error) {
        console.error('Error fetching direction:', error);
      }
    };

    fetchDirection();
  }, [carLocation, userLocation]);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={region}
      >
        <Marker coordinate={{ latitude: carLocation.latitude, longitude: carLocation.longitude }} title="Vị trí xe" />
        <Marker coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }} title="Điểm giao nhận xe" />
        {coordinates.length > 0 && (
          <Polyline
            coordinates={coordinates}
            strokeColor="#007BFF"
            strokeWidth={4}
            lineJoin="round"
          />
        )}
      </MapView>
      <TouchableOpacity
        style={styles.closeFullscreenButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-outline" size={24} color="#03A9F4" />
      </TouchableOpacity>
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Vị trí xe</Text>
        <Text style={styles.addressText}>{carLocation.address}</Text>
        <Text style={styles.infoText}>Điểm giao nhận xe</Text>
        <Text style={styles.addressText}>{userLocation.address}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    flex: 0.3,
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  addressText: {
    fontSize: 16,
    marginBottom: 8,
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

export default MapScreen;
