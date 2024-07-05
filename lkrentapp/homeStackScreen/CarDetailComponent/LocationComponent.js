import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator, Platform } from "react-native";
import MapView, { Circle } from "react-native-maps";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getCoordinates } from "../../fetchData/Position";

// Simple LRU cache implementation
class LRUCache {
  constructor(limit) {
    this.limit = limit;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return null;
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size === this.limit) {
      this.cache.delete(this.cache.keys().next().value);
    }
    this.cache.set(key, value);
  }

  sizeInBytes() {
    let totalBytes = 0;
    this.cache.forEach((value, key) => {
      // Assuming each coordinate pair (latitude and longitude) is a 64-bit floating-point number (8 bytes each)
      // Key length in bytes + 16 bytes for the coordinates (2 * 8 bytes)
      totalBytes += key.length + 16;
    });
    return totalBytes;
  }
}

const coordinateCache = new LRUCache(30); // Limit cache size to 30 items

const LocationComponent = ({ address }) => {
  const [location, setLocation] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapRef = useRef(null);
  const fullscreenMapRef = useRef(null);

  useEffect(() => {
    const fetchCoordinates = async () => {
      try {
        const cachedCoords = coordinateCache.get(address);
        if (cachedCoords) {
          setLocation(cachedCoords);
        } else {
          const coords = await getCoordinates(address, process.env.MAP_BOX_KEY);
          if (coords?.latitude && coords?.longitude) {
            setLocation(coords);
            coordinateCache.set(address, coords);
          }
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
        longitudeDelta: Platform.OS !== 'ios' ? 0.04 : 0.01,
      };
    }
    return null;
  }, [location]);

  const animateMapToRegion = useCallback((mapRef, region) => {
    if (mapRef.current && region && Platform.OS !== 'ios') {
      mapRef.current.animateToRegion(region, 1000);
    }
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      animateMapToRegion(mapRef, selectedRegion);
      animateMapToRegion(fullscreenMapRef, selectedRegion);
    }
  }, [selectedRegion, animateMapToRegion]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prevState => !prevState);
  }, []);

  if (!location || !selectedRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
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
        liteMode
        scrollEnabled={false}
        zoomEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        showsCompass={false}
        toolbarEnabled={false}
        loadingEnabled
      >
        <Circle
          center={location}
          radius={Platform.OS !== 'ios' ? 900 :200}
          strokeColor="rgba(0, 0, 255, 0.5)"
          fillColor="rgba(0, 0, 255, 0.1)"
        />
      </MapView>
      <TouchableOpacity
        style={styles.fullscreenButton}
        onPress={toggleFullscreen}
      >
        <Ionicons name="expand-outline" size={24} color="black" />
      </TouchableOpacity>
      {isFullscreen && (
        <Modal
          visible={isFullscreen}
          animationType="fade"
          onRequestClose={toggleFullscreen}
        >
          <MapView
            ref={fullscreenMapRef}
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
              radius={Platform.OS !== 'ios' ? 900 :200}
              strokeColor="rgba(0, 0, 255, 0.5)"
              fillColor="rgba(0, 0, 255, 0.1)"
            />
          </MapView>
          <TouchableOpacity
            style={styles.closeFullscreenButton}
            onPress={toggleFullscreen}
          >
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
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: 'hidden',
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  locationText: {
    fontSize: 15,
    fontWeight: "400",
    marginLeft: 8,
  },
  map: {
    width: "100%",
    height: 240,
  },
  fullscreenMap: {
    ...StyleSheet.absoluteFillObject,
  },
  fullscreenButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 20,
    padding: 5,
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

export default LocationComponent;
