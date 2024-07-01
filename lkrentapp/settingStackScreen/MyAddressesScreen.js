import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons";

const MyAddressesScreen = () => {
  const navigation = useNavigation(); // Initialize navigation

  const [addresses, setAddresses] = useState([
    { id: "1", name: "Nhà", province: "Thành phố Hồ Chí Minh", district: "Quận 4", ward: "Phường 02", detailedAddress: "123 Nguyễn Huệ" },
    // Add more addresses here if needed
  ]);

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.addressItem}
      onPress={() => navigation.navigate("DetailMyAddressesScreen", { 
        address: item,
        showHeader: true,
        showTitle: true,
        showBackButton: true,
        screenTitle: "Chi tiết địa chỉ",
        showCloseButton: true,
        animationType: "slide_from_bottom",
      })}
    >
      <Ionicons name="person-outline" size={24} color="black" style={styles.icon} />
      <Text style={styles.addressText}>{item.name}</Text>
      <View style={styles.flexSpacer} />
      <Ionicons name="arrow-forward-outline" size={24} color="black" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={addresses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() =>
          navigation.navigate("DetailMyAddressesScreen", {
            showHeader: true,
            showTitle: true,
            showBackButton: true,
            screenTitle: "Chi tiết địa chỉ",
            showCloseButton: true,
            animationType: "slide_from_bottom",
          })
        }
      >
        <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
      </TouchableOpacity>
    </View>
  );
};

export default MyAddressesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#f6f6f6",
    borderRadius: 8,
  },
  icon: {
    marginRight: 16,
  },
  addressText: {
    fontSize: 16,
  },
  flexSpacer: {
    flex: 1,
  },
  addButton: {
    backgroundColor: "#03a9f4",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
