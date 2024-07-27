import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import api from '../api';
import { getToken } from '../utils/tokenStorage';
import CarRentalStatus from '../homeStackScreen/CarOrderComponent/CarRentalStatus';
import HeaderOrder from './CarOrderComponent/HeaderOrder';
import UserProfile from './CarDetailComponent/UserProfileDetail';
import CarRentalInfo from './CarConfirmComponent/CarRentalInfo';
import PricingSummary from './CarOrderComponent/PricingSummary';
import RentingRequirement from './CarOrderComponent/RentingRequirement';
import AdditionalFees from './CarDetailComponent/AdditionalFees';
import CancellationPolicy from './CarDetailComponent/CancellationPolicy';

const HEADER_MAX_HEIGHT = 155;
const HEADER_MIN_HEIGHT = 130;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CarRentalOrderScreen = ({ route, navigation }) => {
  const { carInfo, time, orderId, totalPrice } = route.params;
  const [orderState, setOrderState] = useState(null);
  const [paymentState, setPaymentState] = useState(null);

  const isMounted = useRef(true);

  const fetchOrderDetails = useCallback(async () => {

    if (!orderId) return;

    const token = await getToken();
    try {
      const response = await api.get(`/order/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        
      });
      if (isMounted.current) {
        setOrderState(response.data.orderState);
        setPaymentState(response.data.paymentState);
      }
    } catch (error) {
        console.error('Failed to fetch order details', error);
    }
  }, [orderId]);

  useEffect(() => {
    isMounted.current = true;
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  const handlePayPress = () => {
    navigation.navigate("Payment", {
      totalPrice,
      animationType: "slide_from_bottom",
      showHeader: true,
      showTitle: true,
      screenTitle: "Thanh toán",
      showCloseButton: true,
      showBackButton: true
    });
  };

  const handleRepeatPress = () => {
    navigation.navigate('CarDetail', { carInfo: carInfo ,animationType:"slide_from_bottom"});
  };

  const handleCompleteTripPress = () => {
    console.log("Complete trip pressed");
  };

  const scrollY = useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [-HEADER_SCROLL_DISTANCE, 0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const imageScale = scrollY.interpolate({
    inputRange: [-HEADER_SCROLL_DISTANCE, 0, HEADER_SCROLL_DISTANCE],
    outputRange: [1.5, 1, 1],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.headerContainer,
          {
            height: headerHeight,
          }
        ]}
      >
        <HeaderOrder carInfo={carInfo} navigation={navigation} imageScale={imageScale} orderId={orderId} />
      </Animated.View>
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={{ paddingTop: HEADER_MAX_HEIGHT - 30 }}>
          <CarRentalStatus carInfo={carInfo} orderId={orderId} />
          <UserProfile carInfo={carInfo} orderId={orderId} />
          <CarRentalInfo carInfo={carInfo} time={time} navigation={navigation} />
          <PricingSummary totalPrice={totalPrice} />
          <RentingRequirement />
          <AdditionalFees />
          <CancellationPolicy />
        </View>
      </Animated.ScrollView>
      <View style={styles.footer}>
        {orderState === 'COMPLETED' || orderState ==='CANCELED' ? (
          <TouchableOpacity style={styles.footerButton} onPress={handleRepeatPress}>
            <Text style={styles.footerButtonText}>Đặt lại</Text>
          </TouchableOpacity>
        ) : orderState === 'CONFIRMED' && paymentState === 'PENDING' ? (
          <TouchableOpacity style={styles.footerButton} onPress={handlePayPress}>
            <Text style={styles.footerButtonText}>Đặt cọc</Text>
          </TouchableOpacity>
        ) : orderState === 'CONFIRMED' && paymentState === 'COMPLETED' ? (
          <TouchableOpacity style={styles.footerButton} onPress={handleCompleteTripPress}>
            <Text style={styles.footerButtonText}>Hoàn thành chuyến</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#000',
    overflow: 'hidden',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Ensure space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButton: {
    marginBottom: 50,
    marginTop: 30,
    width: '70%',
    height: '45%',
    backgroundColor: '#03A9F4',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CarRentalOrderScreen;
