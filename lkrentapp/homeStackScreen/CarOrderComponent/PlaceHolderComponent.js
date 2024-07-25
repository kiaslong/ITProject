import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, CommonActions } from "@react-navigation/native";

const ConfirmationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { carInfo, time, orderState } = route.params;

  const handlePayPress = () => {
    navigation.navigate("Payment", {
      carInfo,
      time,
      animationType: "slide_from_bottom",
      showHeader: true,
      showTitle: true,
      screenTitle: "Thanh toán",
      showCloseButton: true,
      showBackButton: true,
      customGoBackRoute: "CarRentalOrder",
      customData1: carInfo,
      customData2: time,
    });
  };

  const handleAddAnotherCarPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
    navigation.navigate("Main");
  };

  const handleManagePress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Main" }],
      })
    );
    navigation.navigate("Chuyến");
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="checkmark-circle" size={80} color="#03A9F4" />
      </View>
      <Text style={styles.message}>
        {orderState === "CONFIRMED"
          ? "Yêu cầu thuê xe đã được duyệt tự động. Bạn vui lòng đặt cọc ngay để hoàn tất việc đặt xe"
          : "Yêu cầu thuê xe của bạn đang chờ duyệt. Bạn vui lòng chờ để hoàn tất việc đặt xe"}
      </Text>
      {orderState === "CONFIRMED" ? (
        <TouchableOpacity style={styles.primaryButton} onPress={handlePayPress}>
          <Text style={styles.primaryButtonText}>Đặt cọc ngay</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.primaryButton} onPress={handleAddAnotherCarPress}>
          <Text style={styles.primaryButtonText}>Đặt thêm xe khác</Text>
        </TouchableOpacity>
      )}

      {
        orderState ==="PENDING" ? ( 
          <TouchableOpacity
          onPress={handleManagePress}
        >
          <Text style={ styles.secondaryButtonText}>
            Quản lý chuyến
          </Text>
        </TouchableOpacity>
        ): (
          <TouchableOpacity onPress={handleAddAnotherCarPress}>
            <Text style={styles.secondaryButtonText}>Đặt thêm xe khác</Text>
          </TouchableOpacity>
        )
      }
    
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
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
    alignSelf: 'stretch',
    alignItems: 'center',
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
    alignSelf: 'stretch',
    alignItems: 'center',
    borderColor: '#03A9F4',
    borderWidth: 1,
    marginBottom: 15,
  },
  secondaryButtonText: {
    color: '#03A9F4',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manageButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
});

export default ConfirmationScreen;
