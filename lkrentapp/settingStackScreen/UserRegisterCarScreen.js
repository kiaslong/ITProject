import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerFunction, unregisterFunction } from '../store/functionRegistry';
import CarCard from "../components/CarCard";

const carForYou = [
  {
    id: "1",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title: "KIA MORNING 2020",
    location: "Quận Phú Nhuận, Thành Phố Hồ Chí Minh",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
    supportsDelivery: true,
    specs: {
      transmission: "Số tự động",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live , cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi , vá vỏ xe , đồ nghề thay vỏ, camera cập lề... ",
    features: {
      map: true,
      bluetooth: true,
      sideCamera: true,
      reverseCamera: true,
      collisensor:true,
      gps: true,
      spareTire: true,
      dashCam: true,
      speedAlert: true,
      usbPort: true,
      dvdScreen: true,
      etc: true,
      airbag: true,
      
    }
  },
  {
    id: "2",
    image:
      "https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    transmission: "Số sàn",
    delivery: "Giao xe tận nơi",
    title: "HYUNDAI I10 2019",
    location: "Quận Đống Đa, Hà Nội",
    rating: "4.8",
    trips: "120",
    oldPrice: "600K",
    newPrice: "500K",
    discount: "20%",
    supportsDelivery: false,
    specs: {
      transmission: "Số sàn",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live , cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi , vá vỏ xe , đồ nghề thay vỏ, camera cập lề... ",
    features: {
      map: true,
      bluetooth: false,
      sideCamera: true,
      reverseCamera: true,
      gps: true,
      spareTire: true,
      dashCam: false,
      speedAlert: true,
      usbPort: false,
      dvdScreen: true,
      etc: false,
      airbag: true
    }
  }
];

const UserRegisterCarScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const key = 'registerCar';
    const onPress = () => navigation.navigate('RegisterCarScreen', {
      showHeader: true,
      showTitle: true,
      showBackButton: true,
      screenTitle: "Thông tin xe",
      showIcon: true,
      iconName: "car",
      showCloseButton: true,
      animationType: "slide_from_bottom"
    });

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CarCard carsInfo={item} navigation={navigation} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={carForYou}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterCarScreen', {
          showHeader: true,
          showTitle: true,
          showBackButton: true,
          screenTitle: "Thông tin xe",
          showIcon: true,
          iconName: "car",
          showCloseButton: true,
          animationType: "slide_from_bottom"
        })}
      >
        <Text style={styles.buttonText}>Đăng ký xe mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingTop: 20,
  },
  button: {
    backgroundColor: '#03a9f4',
    height: 45,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default UserRegisterCarScreen;
