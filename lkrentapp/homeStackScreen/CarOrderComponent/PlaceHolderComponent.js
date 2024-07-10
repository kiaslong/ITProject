import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation ,CommonActions } from "@react-navigation/native";




const ConfirmationScreen = ({ route }) => {

    const navigation = useNavigation();

    const { carInfo, time } = route.params;
   

    const handlePayPress = () => {
      navigation.navigate("Payment", {
        carInfo,
        time,
        animationType: "slide_from_bottom",
        showHeader:true,
        showTitle:true,
        screenTitle:"Thanh toán",
        showCloseButton:true,
        showBackButton:true,
        customGoBackRoute:"CarRentalOrder",
        customData1:carInfo,
        customData2:time,
      });
    };
    
      const handleAddAnotherCarPress = () => {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" }], // Ensure this is the correct screen name
          })
        );
        navigation.navigate("Main");
      };
      
    
    
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark-circle" size={80} color="#03A9F4" />
      </View>
      <Text style={styles.message}>
        Yêu cầu thuê xe đã được duyệt tự động. Bạn vui lòng đặt cọc ngay để hoàn tất việc đặt xe
      </Text>
      <TouchableOpacity style={styles.primaryButton} onPress={handlePayPress}>
        <Text style={styles.primaryButtonText}>Đặt cọc ngay</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={handleAddAnotherCarPress}>
        <Text style={styles.secondaryButtonText}>Đặt thêm xe khác</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    color: '#000',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#03A9F4',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#03A9F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ConfirmationScreen;
