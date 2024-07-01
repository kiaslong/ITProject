import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CarCard from '../components/CarCard';
import { useNavigation } from '@react-navigation/native';

// const favoriteCars = []; // Empty array to simulate no favorite cars data
const favoriteCars = [
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

const FavoriteCarsScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CarCard carsInfo={item} navigation={navigation} initialFavorite={true} />
    </View>
  );

  return (
    <View style={styles.container}>
      {favoriteCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-o" size={48} color="#03a9f4" />
          <Text style={styles.emptyText}>Bạn không có xe yêu thích</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteCars}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default FavoriteCarsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#757575',
  },
});
