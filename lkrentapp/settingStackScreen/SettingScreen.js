import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
} from "react-native";
import React, { useCallback } from "react";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../store/loginSlice";

const SettingScreen = () => {
  const dispatch = useDispatch();

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

  const handleLogoutPress = async () => {
    await dispatch(logout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Khám phá' }],
      })
    );
  };

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity style={styles.menuItem}>
      <Ionicons name={item.icon} size={23} padding={5} />
      <Text style={styles.menuText}>{item.name}</Text>
      <View style={styles.flexSpacer} />
      <Ionicons name="arrow-forward-outline" size={20} color="black" />
    </TouchableOpacity>
  ), []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{uri:"https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg"}}
            style={styles.image}
            resizeMode="auto"
          />
          <Text style={styles.headerText}>LKRENTAL</Text>
        </View>
      </View>
      <View style={styles.menu}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={profileMenu}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={6}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
        />
        <Pressable style={styles.button} onPress={handleLogoutPress}>
          <Ionicons
            name="exit-outline"
            size={24}
            color="white"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Thoát</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    flexDirection: "column",
    backgroundColor: "#03a9f4",
    borderBottomWidth: 1,
  },
  headerContent: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  headerText: {
    fontSize: 25,
    marginTop: 4,
    color: "#000000",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 150,
  },
  menu: {
    flex: 1,
    padding: 10,
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
    fontSize: 16,
  },
  flexSpacer: {
    flex: 1,
  },
  button: {
    flexDirection: "row",
    alignSelf: "center",
    width: 200,
    backgroundColor: "#DA2020",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    paddingRight: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
