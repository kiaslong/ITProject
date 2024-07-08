import React, { useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import CarRentalStatus from '../homeStackScreen/CarOrderComponent/CarRentalStatus';
import HeaderOrder from './CarOrderComponent/HeaderOrder';
import UserProfile from './CarDetailComponent/UserProfileDetail';
import CarRentalInfo from './CarConfirmComponent/CarRentalInfo';
import PricingSummary from './CarOrderComponent/PricingSummary';

const HEADER_MAX_HEIGHT = 155;
const HEADER_MIN_HEIGHT = 130;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const CarRentalOrderScreen = ({ route, navigation }) => {
  const { carInfo, time } = route.params;
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
        <HeaderOrder navigation={navigation} imageScale={imageScale} />
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
          <CarRentalStatus carInfo={carInfo} time={time} />
          <UserProfile carInfo={carInfo} />
          <CarRentalInfo carInfo={carInfo} time={time} navigation={navigation} />
          <PricingSummary />
        </View>
      </Animated.ScrollView>
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
  },
});
export default CarRentalOrderScreen;