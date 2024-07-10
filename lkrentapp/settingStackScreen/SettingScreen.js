import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, CommonActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { logout } from "../store/loginSlice";
import { removeToken } from "../utils/tokenStorage"; // Import removeToken
import CustomAlert from "../components/CustomAlert"; // Adjust the import path as needed

const SettingScreen = () => {
  const [alertVisible, setAlertVisible] = useState(false);
  const [logoutPromptVisible, setLogoutPromptVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const profileMenu = [
    {
      title: "Account",
      data: [
        { id: 1, name: "Tài khoản của tôi", icon: "person-circle-outline", screen: "UserInfoScreen", title: "Tài khoản của tôi", iconName: "pencil-alt", functionName: "editUserInfo" },
        { id: 2, name: "Đăng ký cho thuê xe", icon: "car-sport-outline", screen: "UserRegisterCarScreen", title: "Danh Sách Xe", iconName: "car", functionName: "registerCar" },
        { id: 3, name: "Xe yêu thích", icon: "heart-outline", screen: "FavoriteCarsScreen", title: "Xe yêu thích" },
        { id: 4, name: "Địa chỉ của tôi", icon: "document-text-outline", screen: "MyAddressesScreen", title: "Địa chỉ của tôi", iconName: "pencil-alt" },
        { id: 5, name: "Giấy phép lái xe", icon: "newspaper-outline", screen: "DrivingLicenseScreen", title: "Giấy tờ xe", animationType: "slide_from_bottom", showCloseButton: true },
      ]
    },
    {
      title: "Others",
      data: [
        { id: 6, name: "Quà tặng", icon: "gift-outline", screen: "GiftScreen", title: "Quà tặng" },
        { id: 7, name: "Giới thiệu bạn mới", icon: "people-outline", screen: "ReferFriendScreen", title: "Giới thiệu bạn mới" },
      ]
    },
    {
      title: "Security",
      data: [
        { id: 8, name: "Đổi mật khẩu", icon: "lock-closed-outline", screen: "ChangePasswordScreen", title: "Thay đổi mật khẩu" },
        { id: 9, name: "Xoá tài khoản", icon: "trash-outline", screen: "DeleteAccountScreen", title: "Xoá tài khoản" },
      ]
    }
  ];

  const handleMenuPress = (screen, title, iconName, functionName, animationType, showCloseButton) => {
    if (screen === "DeleteAccountScreen") {
      setAlertVisible(true);
    } else {
      navigation.navigate(screen, {
        animationType: animationType,
        showHeader: true,
        showTitle: true,
        showBackButton: true,
        screenTitle: title,
        showCloseButton: showCloseButton,
        showIcon: true,
        iconName: iconName,
        functionName: functionName,
      });
    }
  };

  const handleCancel = () => {
    setAlertVisible(false);
    setLogoutPromptVisible(false);
  };

  const handleOk = async () => {
    setAlertVisible(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Khám phá" }],
      })
    );
  };

  const handleLogoutPress = () => {
    setLogoutPromptVisible(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutPromptVisible(false);
    await removeToken(); // Remove the token
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
        onPress={() => handleMenuPress(item.screen, item.title, item.iconName, item.functionName, item.animationType, item.showCloseButton)}
        key={item.id.toString()}
      >
        <Ionicons name={item.icon} size={23} padding={5} />
        <Text style={styles.menuText}>{item.name}</Text>
        <View style={styles.flexSpacer} />
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      </TouchableOpacity>
    ),
    []
  );

  const renderGroup = ({ item }) => (
    <View key={item.title}>
      <Text style={styles.sectionHeader}>{item.title}</Text>
      {item.data.map((menuItem) => renderItem({ item: menuItem }))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerBackground} />
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://cdn.idntimes.com/content-images/community/2022/03/1714382190-93512ef73cc9128141b72669a922c6ee-f48b234e3eecffd2d897cd799c3043de.jpg",
            }}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.headerText}>Long Phan</Text>
        </View>
      </View>
      <FlatList
        contentContainerStyle={styles.flatListContentContainer}
        showsVerticalScrollIndicator={false}
        data={profileMenu}
        keyExtractor={(item) => item.title}
        renderItem={renderGroup}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={() => (
          <View style={styles.logoutContainer}>
            <Pressable style={styles.logoutButton} onPress={handleLogoutPress}>
              <Ionicons
                name="exit-outline"
                size={24}
                color="red"
                style={styles.logoutIcon}
              />
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </Pressable>
          </View>
        )}
      />
      <CustomAlert
        visible={alertVisible}
        onCancel={handleCancel}
        onOk={handleOk}
        title="Cảnh cáo"
        message="Bạn có chắc chắn muốn xóa tài khoản của mình không?"
      />
      <CustomAlert
        visible={logoutPromptVisible}
        onCancel={handleCancel}
        onOk={handleLogoutConfirm}
        title="Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất không?"
      />
    </View>
  );
};

export default SettingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  headerBackground: {
    backgroundColor: "#e0f7fa",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 150,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 70,
  },
  textContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  headerText: {
    fontSize: 22,
    color: "#03a9f4",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  headerSubText: {
    fontSize: 16,
    color: "#757575",
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#03a9f4",
  },
  menu: { flex: 1, paddingHorizontal: 20 },
  sectionHeader: {
    fontSize: 18,
    color: "#03a9f4",
    fontWeight: "bold",
    backgroundColor: "#f8f8f8",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuGroup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 20,
    paddingVertical: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  menuText: { fontSize: 16, marginLeft: 15 },
  flexSpacer: { flex: 1 },
  separator: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
  logoutContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignSelf: "center",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoutIcon: { marginRight: 10 },
  logoutText: { fontSize: 16, color: "red", fontWeight: "bold" },
  flatListContentContainer: {
    paddingBottom: 20, // Add padding to the bottom to ensure the last item is fully visible
  },
});
