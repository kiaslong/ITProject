// LocationPickerScreen.js

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  FlatList,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setLocation, setDeliveryLocation, addToHistory } from "../store/locationSlice";
import { Ionicons } from "@expo/vector-icons";
import { autoComplete, getGeocode } from "../fetchData/Position";
import debounce from "lodash.debounce";
import * as Location from "expo-location";

const LocationPickerScreen = ({ route, navigation }) => {
  const { isSetDelivery } = route.params;
  const dispatch = useDispatch();
  const currentLocation = useSelector((state) => state.location.location);
  const history = useSelector((state) => state.location.history);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [currentLocationText, setCurrentLocationText] = useState("Vị trí hiện tại");
  const [deviceLocation, setDeviceLocation] = useState(null);
  const apiKey = process.env.GOONG_KEY;
  const geoKey = process.env.GOONG_KEY_2;

  const getCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
        maximumAge: 10000,
        timeout: 5000,
      });

      setDeviceLocation(
        `${location.coords.latitude},${location.coords.longitude}`
      );
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const debouncedAutoComplete = useMemo(
    () =>
      debounce(async (input) => {
        if (input.length > 0 && deviceLocation) {
          setLoading(true);
          try {
            const suggestions = await autoComplete(input, apiKey, deviceLocation);
            setSuggestions(suggestions);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        } else {
          setSuggestions([]);
        }
      }, 500),
    [apiKey, deviceLocation]
  );

  useEffect(() => {
    debouncedAutoComplete(search);
    return () => debouncedAutoComplete.cancel();
  }, [search, debouncedAutoComplete]);

  const handleSelectLocation = useCallback(
    (location) => {
      setLoading(true);
      setTimeout(() => {
        if (isSetDelivery) {
          dispatch(setDeliveryLocation(location));
        } else {
          dispatch(setLocation(location));
        }
        dispatch(addToHistory(location));
        setLoading(false);
        navigation.goBack();
      }, 500);
    },
    [dispatch, navigation, isSetDelivery]
  );

  const handleSelectCurrentLocation = useCallback(async () => {
    setCurrentLocationText("Đang xác định vị trí...");
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Lowest,
        maximumAge: 10000,
        timeout: 5000,
      });

      const address = await getGeocode(
        location.coords.latitude,
        location.coords.longitude,
        geoKey
      );
      if (address) {
        if (isSetDelivery) {
          dispatch(setDeliveryLocation(address));
        } else {
          dispatch(setLocation(address));
        }
        navigation.goBack();
      } else {
        console.log("Could not fetch address");
      }
    } catch (error) {
      console.error("Error selecting current location:", error);
    } finally {
      setCurrentLocationText("Vị trí hiện tại");
    }
  }, [geoKey, dispatch, navigation, isSetDelivery]);

  const extractStreetName = useCallback((location) => {
    const parts = location.split(",");
    return parts[0] || location;
  }, []);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.item,
          item === currentLocation && styles.currentLocationHighlight,
        ]}
        onPress={() => handleSelectLocation(item)}
      >
        <View style={styles.itemContent}>
          <View style={styles.titleContainer}>
            <Ionicons name="location-outline" size={24} color="black" />
            <Text style={styles.itemTitleText}>{extractStreetName(item)}</Text>
          </View>
          <Text style={styles.itemText}>{item}</Text>
        </View>
      </TouchableOpacity>
    ),
    [currentLocation, extractStreetName, handleSelectLocation]
  );

  const keyExtractor = useCallback((item, index) => `${item}-${index}`, []);

  const listData = useMemo(
    () =>
      search.length === 0
        ? history.slice(0, 20)
        : suggestions.slice(0, 20).map((suggestion) => suggestion.description),
    [search.length, history, suggestions]
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="location-outline"
            size={24}
            color="black"
            style={styles.icon}
          />
          <TextInput
            placeholder="Nhập địa điểm"
            style={styles.input}
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity
          style={styles.currentLocationContainer}
          onPress={handleSelectCurrentLocation}
        >
          <Ionicons name="location-outline" size={24} color="#03a9f4" />
          <Text style={styles.currentLocationText}>{currentLocationText}</Text>
        </TouchableOpacity>
        <Text style={styles.fixedHeader}>
          {search.length === 0 ? "Tìm kiếm gần đây" : "Gợi ý tìm kiếm"}
        </Text>
        {loading ? (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color="#03a9f4"
          />
        ) : (
          <FlatList
            data={listData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            showsVerticalScrollIndicator={false}
            initialNumToRender={4}
            contentContainerStyle={styles.listContentContainer}
            onScrollBeginDrag={Keyboard.dismiss}
          />
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  loading: {
    marginTop: 30,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 25,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  currentLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  currentLocationText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#03a9f4",
    fontWeight: "bold",
  },
  fixedHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  item: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 8,
  },
  itemContent: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  itemTitleText: {
    marginLeft: 8,
    fontSize: 17,
    color: "#03a9f4",
    fontWeight: "bold",
  },
  itemText: {
    fontSize: 15,
    marginLeft: 10,
    color: "#333",
  },
  currentLocationHighlight: {
    borderColor: "#03a9f4",
    borderWidth: 2,
  },
  listContentContainer: {
    paddingBottom: 20,
  },
});

export default React.memo(LocationPickerScreen);
