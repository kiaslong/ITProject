import React, { useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { registerFunction, unregisterFunction } from '../store/functionRegistry';
import CarCard from "../components/CarCard";
import { resetRegistration } from '../store/registrationSlice';

const carForYou = [
  {
    id: "1",
    thumbImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    images: [
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtnh7pgJUtpZWWtHn-eVA3n1DY6D6WpnGOdA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s"
    ],
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title:"KIA MORNING 2020",
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
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: true,
      sideCamera: true,
      reverseCamera: true,
      collisensor: true,
      gps: true,
      spareTire: true,
      dashCam: true,
      speedAlert: true,
      usbPort: true,
      dvdScreen: true,
      etc: true,
      airbag: true
    },
    owner: {
      name: "My",
      rating: "5.0",
      trips: "21 chuyến",
      avatar: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
      badgeText: "Chủ xe 5* có thời gian phản hồi nhanh chóng, tỉ lệ đồng ý cao, mức giá cạnh tranh & dịch vụ nhận được nhiều đánh giá tốt từ khách hàng.",
      stats: {
        responseRate: "100%",
        approvalRate: "87%",
        responseTime: "5 phút"
      }
    }
  },
  {
    id: "2",
    thumbImage:"https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    images: [
      "https://example.com/thumbnail2.jpg",
      "https://example.com/image2-2.jpg",
      "https://example.com/image2-3.jpg",
      "https://example.com/image2-4.jpg",
      "https://example.com/image2-5.jpg"
    ],
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
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
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
    },
    owner: {
      name: "Khoa",
      rating: "4.8",
      trips: "120 chuyến",
      avatar: "https://example.com/owner-avatar2.jpg",
      badgeText: "Chủ xe có tỉ lệ phản hồi cao, mức giá cạnh tranh & dịch vụ nhận được nhiều đánh giá tốt từ khách hàng.",
      stats: {
        responseRate: "95%",
        approvalRate: "85%",
        responseTime: "10 phút"
      }
    }
  }
];

const UserRegisterCarScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.loggedIn.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const key = 'resetRegistration';
    const onPress = () => {
      Alert.alert(
        "Thoát đăng ký",
        "Bạn chắc chắn muốn thoát?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "OK",
            onPress: () => {
              dispatch(resetRegistration());
              navigation.goBack(); 
            }
          }
        ]
      );
    };

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation, dispatch]);

  useEffect(() => {
    const key = 'registerCar';
    const onPress = () => {
      
      if (!user.phoneNumberVerified) {
        Alert.alert(
          "Yêu cầu xác thực số điện thoại",
          "Vui lòng xác thực trước khi có thể đăng ký xe.",
          [{ text: "OK" }]
        );
        return;
      }
      navigation.navigate('RegisterCarScreen', {
        showHeader: true,
        showTitle: true,
        showBackButton: true,
        screenTitle: "Thông tin xe",
        showCloseButton: true,
        animationType: "slide_from_bottom",
        backFunctionName:"resetRegistration"
      });
    };

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation, user.phoneNumberVerified]);

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
        onPress={() => {
          if (!user.phoneNumberVerified) {
            Alert.alert(
              "Yêu cầu xác thực số điện thoại",
              "Vui lòng xác thực trước khi có thể đăng ký xe.",
              [{ text: "OK" }]
            );
            return;
          }
          navigation.navigate('RegisterCarScreen', {
            showHeader: true,
            showTitle: true,
            showBackButton: true,
            screenTitle: "Thông tin xe",
            showCloseButton: true,
            animationType: "slide_from_bottom",
            backFunctionName:"resetRegistration"
          });
        }}
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
