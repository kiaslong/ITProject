import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedAddressType, setDeliveryPrice, setIsConfirmed, setDeliveryLocation ,setCarLocation,setUserLocation } from '../../store/locationSlice';
import { getGeocodeByAddress, getRoute } from '../../fetchData/Position';

const DeliveryLocationScreen = ({ route }) => {
  const { carInfo } = route.params;
  const deliveryLocation = useSelector((state) => state.location.deliveryLocation);
  const selectedAddressType = useSelector((state) => state.location.selectedAddressType);
  const isConfirmed = useSelector((state) => state.location.isConfirmed);

  const [selectedAddress, setSelectedAddress] = useState(selectedAddressType);
  const [routeInfo, setRouteInfo] = useState(null);
  const [totalDistance, setTotalDistance] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [allowConfirm, setAllowConfirm] = useState(false);
  const [initialResetDone, setInitialResetDone] = useState(false);

  const carLocation = useSelector((state) => state.location.carLocation);
  const userLocation = useSelector((state) => state.location.userLocation);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const formatPrice = (price) => {
    return `${Math.ceil(price/1000)}`;
  };

  useEffect(() => {
    if (!isConfirmed) {
      dispatch(setDeliveryLocation(null));
      dispatch(setDeliveryPrice(0));
      setTotalPrice(0);
      dispatch(setCarLocation(null));
      dispatch(setUserLocation(null));
      setTotalDistance(0);
      setInitialResetDone(true); // Mark the initial reset as done
    } else {
      setInitialResetDone(true); // Skip reset if already confirmed
    }
  }, [dispatch, isConfirmed]);

  useEffect(() => {
    if (!initialResetDone) return; // Wait for initial reset to be done

    const fetchRouteInfo = async () => {
      try {
        const carLocationData = await getGeocodeByAddress(carInfo.location, process.env.GOONG_KEY_2);
        const userLocationData = deliveryLocation ? await getGeocodeByAddress(deliveryLocation, process.env.GOONG_KEY_3) : null;

        if (carLocationData && userLocationData) {
          dispatch(setCarLocation(carLocationData));
          dispatch(setUserLocation(userLocationData));

          const routeData = await getRoute(
            { latitude: carLocationData.latitude, longitude: carLocationData.longitude },
            { latitude: userLocationData.latitude, longitude: userLocationData.longitude },
            process.env.GOONG_KEY
          );

          if (routeData) {
      
            if (routeData.legs) {
              const distance = routeData.legs.reduce((sum, leg) => sum + leg.distance, 0);
              setTotalDistance(distance);
              const price = Math.round((distance / 1000) * 20000);
              setTotalPrice(price);

              if (distance > 20000) {
                setShowAlert(true);
                setAllowConfirm(false);
              } else {
                setShowAlert(false);
                setAllowConfirm(true);
              }
            } else {
              console.error('Invalid route data structure:', routeData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching route information:', error);
      }
    };

    fetchRouteInfo();
  }, [carInfo.location, deliveryLocation, dispatch, initialResetDone]);

  const handleConfirm = () => {
    dispatch(setDeliveryPrice(formatPrice(totalPrice)*1000));
    dispatch(setIsConfirmed(true));

    navigation.goBack();
  };

  const handleCustomAddressPress = () => {
    navigation.navigate('LocationPicker', {
      isSetDelivery: true,
      showHeader: true,
      showBackButton: true,
      showTitle: true,
      screenTitle: "Địa điểm"
    });
  };

  const handleAddressSelect = (type) => {
    setSelectedAddress(type);
    dispatch(setSelectedAddressType(type));
    if (type === 'custom') {
      handleCustomAddressPress();
    }
  };

  const handleMapPress = () => {
    if (carLocation && userLocation) {
      navigation.navigate('MapScreen', {
        carLocation: {
          latitude: carLocation.latitude,
          longitude: carLocation.longitude,
          address: carLocation.address
        },
        userLocation: {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          address: userLocation.address
        },
      });
    }
  };

  return (
    <View style={styles.container}>
      {showAlert && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>Khoảng cách vượt quá 20km. Vui lòng chọn địa chỉ khác.</Text>
          <TouchableOpacity style={styles.closeButtonContainer} onPress={() => setShowAlert(false)}>
            <Text style={styles.closeButton}>Đóng</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Dịch vụ giao nhận xe tận nơi</Text>
        <Text style={styles.infoText}>trong vòng 20km</Text>
        <Text style={styles.infoText}>Phí giao nhận xe (2 chiều): 20,000 đ/km</Text>
      </View>
      <Text style={styles.sectionTitle}>Địa chỉ tùy chỉnh</Text>
      <View style={[styles.section, styles.box]}>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioCircle}
            onPress={() => handleAddressSelect('custom')}
          >
            {selectedAddress === 'custom' && <View style={styles.selectedRb} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.myAddressContainer} onPress={() => handleAddressSelect('custom')}>
            <Text numberOfLines={1} style={styles.myAddressText}>{deliveryLocation || "Nhập địa chỉ tùy chỉnh"}</Text>
            <Text style={styles.changeText}>Thay đổi</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Địa chỉ của tôi</Text>
      <View style={[styles.section, styles.box]}>
        <View style={styles.radioContainer}>
          <TouchableOpacity
            style={styles.radioCircle}
            onPress={() => handleAddressSelect('myAddress')}
          >
            {selectedAddress === 'myAddress' && <View style={styles.selectedRb} />}
          </TouchableOpacity>
          <View style={styles.myAddressContainer}>
            <Text style={styles.myAddressText} numberOfLines={1}>{'Nhà riêng - 389 QL13'}</Text>
            <Text style={styles.changeText}>Thay đổi</Text>
          </View>
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <TouchableOpacity onPress={handleMapPress} style={styles.mapButton}>
            <Text style={styles.mapText}>Xem bản đồ</Text>
            <MaterialIcons name="chevron-right" size={24} color="#007BFF" />
          </TouchableOpacity>
          <Text style={styles.feeText}>Tổng phí: {formatPrice(totalPrice)}K ({(totalDistance / 1000).toFixed(1)} km)</Text>
        </View>
        <View style={[styles.confirmButtonContainer, allowConfirm ? null : styles.confirmButtonDisabled]}>
          <TouchableOpacity
            style={[styles.confirmButton, allowConfirm ? null : styles.confirmButtonDisabled]}
            onPress={handleConfirm}
            disabled={showAlert}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  alertContainer: {
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertText: {
    color: '#ff0000',
    fontSize: 14,
  },
  closeButton: {
    color: '#fff',
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  section: {
    marginBottom: 20,
  },
  box: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#03a9f4',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#03a9f4',
  },
  customAddressText: {
    flex: 1,
    color: '#aaa',
    marginRight: 10,
  },
  myAddressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  myAddressText: {
    flex: 1,
    fontSize: 14,
    marginRight: 10,
  },
  changeText: {
    fontSize: 14,
    color: '#03a9f4',
    flexShrink: 0,
  },
  footer: {
    marginBottom: 16,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerContent: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapText: {
    color: '#03a9f4',
    marginRight: 5,
  },
  feeText: {
    fontSize: 15,
    color: '#333',
  },
  confirmButtonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#03a9f4',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  confirmButton: {
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#ccc',
  },
  confirmButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtonContainer: {
    padding: 8,
    backgroundColor: "#03a9f4",
    borderRadius: 10,
  },
  confirmedMessageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#d4edda',
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmedMessage: {
    color: '#155724',
    fontSize: 16,
  }
});

export default DeliveryLocationScreen;
