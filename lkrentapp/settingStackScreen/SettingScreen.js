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
  const navigation = useNavigation();



  const profileMenu = [
    {
      id: 1,
      name: "Tài khoản của tôi",
      icon: "person-circle-outline",
      screen: "UserInfoScreen",
      title: "Tài khoản của tôi",
      iconName:"pencil-alt"
    },
    {
      id: 2,
      name: "Đăng ký cho thuê xe",
      icon: "car-sport-outline",
      screen: "UserRegisterCarScreen",
      title: "Danh Sách Xe",
      iconName:"car",
      functionName:"registerCar"
    },
    {
      id: 3,
      name: "Xe yêu thích",
      icon: "heart-outline",
      screen: "FavoriteCarsScreen",
    },
    {
      id: 4,
      name: "Địa chỉ của tôi",
      icon: "document-text-outline",
      screen: "MyAddressesScreen",
    },
    {
      id: 5,
      name: "Giấy phép lái xe",
      icon: "newspaper-outline",
      screen: "DrivingLicenseScreen",
    },
    {
      id: 6,
      name: "Quà tặng",
      icon: "gift-outline",
      screen: "GiftsScreen",
    },
    {
      id: 7,
      name: "Giới thiệu bạn mới",
      icon: "people-outline",
      screen: "ReferFriendScreen",
    },
    {
      id: 8,
      name: "Đổi mật khẩu",
      icon: "lock-closed-outline",
      screen: "ChangePasswordScreen",
    },
    {
      id: 9,
      name: "Xoá tài khoản",
      icon: "trash-outline",
      screen: "DeleteAccountScreen",
    },
  ];

  const handleMenuPress = (screen, title, iconName , functionName) => {
    navigation.navigate(screen, { showHeader:true, showTitle:true, showBackButton: true , screenTitle: title, showIcon:true , iconName: iconName , functionName: functionName } );
  };

  const handleLogoutPress = async () => {
    await dispatch(logout());
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Khám phá" }],
      })
    );
  };

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => handleMenuPress(item.screen, item.title, item.iconName , item.functionName)}
      >
        <Ionicons name={item.icon} size={23} padding={5} />
        <Text style={styles.menuText}>{item.name}</Text>
        <View style={styles.flexSpacer} />
        <Ionicons name="arrow-forward-outline" size={20} color="black" />
      </TouchableOpacity>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image
            source={{
              uri: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>PHAN PHI LONG</Text>
            <Text style={styles.headerSubText}>Welcome back!</Text>
          </View>
        </View>
      </View>
      <View style={styles.menu}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={profileMenu}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
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
    paddingBottom: 20,
    backgroundColor: "#03a9f4",
    borderBottomWidth: 1,
    borderBottomColor: "#dcdcdc",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 22,
    color: "#01579b",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },
  headerSubText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  image: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: "#01579b",
    marginRight: 15,
  },
  menu: {
    flex: 1,
    padding: 10,
  },
  menuItem: {
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
