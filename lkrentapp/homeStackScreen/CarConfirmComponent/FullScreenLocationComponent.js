import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { View, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from "react-native";
import MapView, { Circle } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCoordinates } from "../../fetchData/Position";

const FullMapScreen = ({ route, navigation }) => {
  const { address } = route.params;
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const coords = await getCoordinates(address, process.env.MAP_BOX_KEY);
        if (coords?.latitude && coords?.longitude) {
          setLocation(coords);
        }
      } catch (error) {
        console.error("Error fetching coordinates: ", error);
      }
    };

    fetchCoordinates();
  }, [address]);

  const selectedRegion = useMemo(() => {
    if (location) {
      return {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta:  Platform.OS !== 'ios' ? 0.04 : 0.01,
        longitudeDelta:  Platform.OS !== 'ios' ? 0.04 : 0.01,
      };
    }
    return null;
  }, [location]);

  const animateMapToRegion = useCallback((region) => {
    if (mapRef.current && region && Platform.OS !== 'ios') {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      animateMapToRegion(selectedRegion);
    }
  }, [selectedRegion, animateMapToRegion]);

  if (!location || !selectedRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.fullscreenMap}
        initialRegion={selectedRegion}
        toolbarEnabled={false}
        showsCompass={false}
        loadingEnabled
        scrollEnabled
        zoomEnabled
        pitchEnabled
        rotateEnabled
      >
        <Circle
          center={location}
          radius={ Platform.OS !== 'ios' ? 900 : 300}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.1)"
        />
      </MapView>
      <TouchableOpacity
        style={styles.closeFullscreenButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="close-outline" size={24} color="#03A9F4" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  fullscreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  closeFullscreenButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default FullMapScreen;
