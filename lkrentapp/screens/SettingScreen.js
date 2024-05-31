import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";

export default function SettingScreen() {
  const profileMenu = [
    {
      id: 1,
      name: "Tài khoản của tôi",
      icon: "person-circle-outline",
    },
    {
      id: 2,
      name: "Đăng ký cho thuê xe",
      icon: "car-sport-outline",
    },
    {
      id: 3,
      name: "Xe yêu thích",
      icon: "heart-outline",
    },
    {
      id: 4,
      name: "Địa chỉ của tôi",
      icon: "document-text-outline",
    },
    {
      id: 5,
      name: "Giấy phép lái xe",
      icon: "newspaper-outline",
    },
    {
      id: 6,
      name: "Quà tặng",
      icon: "gift-outline",
    },
    {
      id: 7,
      name: "Giới thiệu bạn mới",
      icon: "people-outline",
    },
    {
      id: 8,
      name: "Đổi mật khẩu",
      icon: "lock-closed-outline",
    },
    {
      id: 9,
      name: "Xoá tài khoản",
      icon: "trash-outline",
    },
  ];

  const navigation = useNavigation();

  
  const handleLogoutPress = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginForm" }],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="person-circle-outline" size={100} color="black" />
          <Text style={styles.headerText}>LKRENTAL</Text>
        </View>
      </View>
      <View style={styles.menu}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={profileMenu}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name={item.icon} size={35} padding={5} />
              <Text style={styles.menuText}>{item.name}</Text>
              <View style={styles.flexSpacer} />
              <Ionicons name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
      <View style={styles.buttonView}>
        <Pressable style={styles.button} onPress={handleLogoutPress}>
          <Text style={styles.buttonText}>Thoát</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#03a9f4",
  },
  headerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    marginTop: 8,
    fontFamily: "outfit-medium",
    color: "#000000",
  },
  menu: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F6F6F6",
    padding: 10,
    borderRadius: 10,
  },
  menuText: {
    fontFamily: "outfit",
    fontSize: 20,
  },
  flexSpacer: {
    flex: 1,
  },
  buttonView: {
    padding: 10,
  },
  button: {
    backgroundColor: "#DA2020",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
