import React, { useRef } from 'react';
import { Animated, FlatList, Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicon from 'react-native-vector-icons/Ionicons';
import CarCard from '../components/CarCard';

const carForYou = [
  {
    id: '1',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s',
    transmission: 'Số tự động',
    delivery: 'Giao xe tận nơi',
    title: 'KIA MORNING 2020',
    location: 'Quận Hai Bà Trưng, Hà Nội',
    rating: '5.0',
    trips: '97',
    oldPrice: '574K',
    newPrice: '474K',
    discount: '30%',
  },
  {
    id: '2',
    image: 'https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1',
    transmission: 'Số sàn',
    delivery: 'Giao xe tận nơi',
    title: 'HYUNDAI I10 2019',
    location: 'Quận Đống Đa, Hà Nội',
    rating: '4.8',
    trips: '120',
    oldPrice: '600K',
    newPrice: '500K',
    discount: '20%',
  },
];

const iconData = [
  { id: '1', name: 'repeat', label: '', iconType: 'MaterialCommunityIcons' },
  { id: '2', name: 'car-sports', label: 'Loại xe', iconType: 'MaterialCommunityIcons' },
  { id: '3', name: 'globe-outline', label: 'Hãng xe', iconType: 'Ionicons' },
  { id: '4', name: 'medal-outline', label: 'Chủ xe 5 sao', iconType: 'MaterialCommunityIcons' },
  { id: '5', name: 'lightning-bolt-outline', label: 'Đặt xe nhanh', iconType: 'MaterialCommunityIcons' },
  { id: '6', name: 'location-outline', label: 'Giao xe tận nơi', iconType: 'Ionicons' },
  { id: '7', name: 'sale', label: 'Giảm giá', iconType: 'MaterialCommunityIcons' },
  { id: '8', name: 'credit-card-off-outline', label: 'Miễn thế chấp', iconType: 'MaterialCommunityIcons' },
  { id: '9', name: 'car-electric-outline', label: 'Xe điện', iconType: 'MaterialCommunityIcons' },
];

const ListOfCar = () => {
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerScale = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const footerTranslate = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 100],
    extrapolate: 'clamp',
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <CarCard carsInfo={item} />
    </View>
  );

  const handleIconPress = (label) => {
    Alert.alert(`Clicked on ${label}`);
  };

  const renderIconItem = ({ item }) => {
    const IconComponent = item.iconType === 'Ionicons' ? Ionicon : Icon;
    return (
      <Animated.View key={item.id} style={[styles.iconWrapper, { opacity: headerScale }]}>
        <TouchableOpacity style={styles.touchable} onPress={() => handleIconPress(item.label)}>
          <IconComponent name={item.name} size={18} color="black" />
          {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ scaleY: headerScale }] }]}>
        <View style={styles.iconContainer}>
          <FlatList
            data={iconData}
            renderItem={renderIconItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Animated.View>
      <Animated.FlatList
        data={carForYou}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Animated.View style={[styles.footer, { transform: [{ translateY: footerTranslate }] }]}>
        <View style={styles.footerContent}>
          <TouchableOpacity style={styles.footerButton} onPress={() => handleIconPress('Bộ lọc')}>
            <Icon name="tune" size={24} color="black" />
            <Text style={styles.footerText}>Bộ lọc</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.footerButton} onPress={() => handleIconPress('Bản đồ')}>
            <Icon name="earth" size={24} color="black" />
            <Text style={styles.footerText}>Bản đồ</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  iconWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    padding: 7,
    marginHorizontal: 5,
  },
  touchable: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 6,
    fontWeight: '700',
  },
  listContent: {
    paddingTop: 45, 
  },
  item: {
    padding: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: '22%',
    right: '22%',
    backgroundColor: '#fff',
    paddingVertical: 10,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 26,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  footerText: {
    marginLeft: 6,
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 8,
  },
});

export default ListOfCar;
