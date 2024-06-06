import React from "react";
import { View, Text, StyleSheet, Dimensions, Alert, FlatList } from "react-native";
import NotificationBox from "../components/NotificationBox";

const sampleData = [
  {
    id: '1',
    icon: "notifications-outline",
    title: "Welcome to LKRental",
    message: "Chào mừng bạn tham gia ứng dụng của chúng tôi !",
    time: "2 phút trước",
  },
  {
    id: '2',
    icon: "checkmark-circle-outline",
    title: "Thanh toán thành công",
    message: "Bạn đã thanh toán thành công cho đơn hàng thuê xe",
    time: "1 giờ trước",
  },
];

export default function NotiScreen() {
  const handlePress = (title) => {
    Alert.alert('Notification Pressed', `You pressed the notification: ${title}`);
  };

  const renderItem = ({ item }) => (
    <NotificationBox
      icon={item.icon}
      title={item.title}
      message={item.message}
      time={item.time}
      onPress={() => handlePress(item.title)}
    />
  );

  return (
    <FlatList
      data={sampleData}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListHeaderComponent={() => (
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Thông báo</Text>
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    paddingTop: deviceHeight < 1000 ? 80 : 100,
    backgroundColor: "#fff",
    flexGrow: 1, 
    marginHorizontal:10,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: deviceHeight < 1000 ? 10 : 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#03a9f4",
  },
  notiContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    padding: 15,
    backgroundColor: '#fff',
  },
});
