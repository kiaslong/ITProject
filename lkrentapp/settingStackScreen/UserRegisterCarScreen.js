import React,{useEffect} from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { registerFunction , unregisterFunction  } from '../store/functionRegistry'; // Import useNavigation
import CarCard from "../components/CarCard";

const carForYou = [
    {
      id: "1",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      transmission: "Số tự động",
      delivery: "Giao xe tận nơi",
      title: "KIA MORNING 2020",
      location: "Quận Hai Bà Trưng, Hà Nội",
      rating: "5.0",
      trips: "97",
      oldPrice: "574K",
      newPrice: "474K",
      discount: "30%",
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
    },
  ];

const UserRegisterCarScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

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
      <CarCard carsInfo={item} />
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
        onPress={() => navigation.navigate('RegisterCarScreen', { showHeader: true, showTitle: true, showBackButton: true , screenTitle:"Thông tin xe", showIcon:true, iconName:"car",showCloseButton:true,animationType:"slide_from_bottom" })}
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03a9f4',
    textAlign: 'center',
    textTransform: 'uppercase', // Make title uppercase
  },
  icon: {
    position: 'absolute',
    right: 20,
    fontSize: 20,
    color: '#666',
  },
  itemContainer: {
    paddingTop: 20, // Add padding top to FlatList items
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
