import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { registerFunction, unregisterFunction } from '../store/functionRegistry';
import CarCard from "../components/CarCard";
import { resetRegistration } from '../store/registrationSlice';
import { getToken } from '../utils/tokenStorage';
import api from '../api';
import OwnerCarCard from '../components/OwnerCarCard';

const UserRegisterCarScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.loggedIn.user);
  const dispatch = useDispatch();
  const [cars, setCars] = useState([]);

  

  useEffect(() => {
    const fetchCars = async () => {
      const token = await getToken();
      try {
        const response = await api.get('/car/info-include-user', {
          params: {
            userId: user.id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCars(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCars();
  }, [user]);

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
      {/* <CarCard carInfo={item} navigation={navigation} /> */}
      <OwnerCarCard carInfo={item} navigation={navigation} />
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={cars}
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