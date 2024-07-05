import React, { useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import CarRentalStatus from '../homeStackScreen/CarOrderComponent/CarRentalStatus'; // Adjust the import path as needed
import HeaderOrder from './CarOrderComponent/Header'; // Adjust the import path as needed

const { height: screenHeight } = Dimensions.get('window');

const CarRentalOrderScreen = ({ route, navigation }) => {
  const { carInfo, time } = route.params;
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerHeight = 130;

  const scale = scrollY.interpolate({
    inputRange: [-100, 0, headerHeight],
    outputRange: [2, 1, 1],
    extrapolate: 'clamp',
  });

  const translateY = scrollY.interpolate({
    inputRange: [-100, 0, headerHeight, headerHeight + 1],
    outputRange: [-30, 0, -headerHeight, -headerHeight],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <HeaderOrder scale={scale} translateY={translateY} />
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContainer}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        <View style={{ paddingTop: headerHeight }}>
          <CarRentalStatus carInfo={carInfo} time={time} navigation={navigation} />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
});

export default CarRentalOrderScreen;
