import React from "react";
import { View, Text, StyleSheet, Dimensions,Alert, ScrollView,FlatList } from "react-native";

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
    <ScrollView>
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thông báo</Text>
      </View>
      <View style={styles.notiContainer}>
      <FlatList
        data={sampleData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      </View>
    </View>
    </ScrollView>
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: deviceHeight < 1000 ? 80 : 100,
    backgroundColor: "#fff",
  },
  titleContainer: {
    width: "100%",
    position: "relative",
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
    flex:1,
    width:"100%",
    flexDirection:"column",
    padding:15,
    backgroundColor: '#fff',
  },
});
