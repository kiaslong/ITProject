import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import CarCard from "../components/CarCard";
import FilterBottomSheet from "./FilterModal";

const carForYou = [
  {
    id: "1",
    thumbImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7Ow-jdSFfiCijZRPsQz6GQcoF61ahECtZMA&s",
    images: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
      "https://example.com/image3.jpg",
      "https://example.com/image4.jpg",
      "https://example.com/image5.jpg"
    ],
    transmission: "Số tự động",
    delivery: "Giao xe tận nơi",
    title: "KIA MORNING 2020",
    location: "Quận Phú Nhuận, Thành Phố Hồ Chí Minh",
    rating: "5.0",
    trips: "97",
    oldPrice: "574K",
    newPrice: "474K",
    discount: "30%",
    supportsDelivery: true,
    specs: {
      transmission: "Số tự động",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: true,
      sideCamera: true,
      reverseCamera: true,
      collisensor: true,
      gps: true,
      spareTire: true,
      dashCam: true,
      speedAlert: true,
      usbPort: true,
      dvdScreen: true,
      etc: true,
      airbag: true
    }
  },
  {
    id: "2",
    thumbImage:"https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/BMW-2-Series-Gran-Coupe-271220221147.jpg&w=872&h=578&q=75&c=1",
    images: [
      "https://example.com/thumbnail2.jpg",
      "https://example.com/image2-2.jpg",
      "https://example.com/image2-3.jpg",
      "https://example.com/image2-4.jpg",
      "https://example.com/image2-5.jpg"
    ],
    transmission: "Số sàn",
    delivery: "Giao xe tận nơi",
    title: "HYUNDAI I10 2019",
    location: "Quận Đống Đa, Hà Nội",
    rating: "4.8",
    trips: "120",
    oldPrice: "600K",
    newPrice: "500K",
    discount: "20%",
    supportsDelivery: false,
    specs: {
      transmission: "Số sàn",
      seats: "8 chỗ",
      fuel: "Xăng",
      fuelConsumption: "10l/100km"
    },
    description: "Xe thơm tho, được bảo dưỡng định kỳ, bản đồ vietmap live, cảnh báo tốc độ, cảnh báo camera phạt nguội, có kích bình, bơm hơi, vá vỏ xe, đồ nghề thay vỏ, camera cập lề...",
    features: {
      map: true,
      bluetooth: false,
      sideCamera: true,
      reverseCamera: true,
      gps: true,
      spareTire: true,
      dashCam: false,
      speedAlert: true,
      usbPort: false,
      dvdScreen: true,
      etc: false,
      airbag: true
    }
  }
];

const iconData = [
  { id: "1", name: "repeat", label: "", iconType: "MaterialCommunityIcons" },
  {
    id: "2",
    name: "car-sports",
    label: "Loại xe",
    iconType: "MaterialCommunityIcons",
  },
  { id: "3", name: "globe-outline", label: "Hãng xe", iconType: "Ionicons" },
  {
    id: "4",
    name: "medal-outline",
    label: "Chủ xe 5 sao",
    iconType: "MaterialCommunityIcons",
  },
  {
    id: "5",
    name: "lightning-bolt-outline",
    label: "Đặt xe nhanh",
    iconType: "MaterialCommunityIcons",
  },
  {
    id: "6",
    name: "location-outline",
    label: "Giao xe tận nơi",
    iconType: "Ionicons",
  },
  {
    id: "7",
    name: "sale",
    label: "Giảm giá",
    iconType: "MaterialCommunityIcons",
  },
  {
    id: "8",
    name: "credit-card-off-outline",
    label: "Miễn thế chấp",
    iconType: "MaterialCommunityIcons",
  },
  {
    id: "9",
    name: "car-electric-outline",
    label: "Xe điện",
    iconType: "MaterialCommunityIcons",
  },
];

const ListOfCar = ({ navigation }) => {
  const [visible, setVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const headerScale = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const footerTranslate = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, 100],
    extrapolate: "clamp",
  });

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <CarCard carsInfo={item} navigation={navigation} />
    </View>
  );

  const handleIconPress = (label) => {
    if (label === "Bộ lọc") {
      setVisible(true);
    }
  };

  const renderIconItem = ({ item }) => {
    const IconComponent = item.iconType === "Ionicons" ? Ionicon : Icon;
    return (
      <Animated.View
        key={item.id}
        style={[styles.iconWrapper, { opacity: headerScale }]}
      >
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => handleIconPress(item.label)}
        >
          <IconComponent name={item.name} size={18} color="black" />
          {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.header, { transform: [{ scaleY: headerScale }] }]}
      >
        <View style={styles.iconContainer}>
          <FlatList
            data={iconData}
            renderItem={renderIconItem}
            keyExtractor={(item) => item.id}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </Animated.View>
      <Animated.FlatList
        data={carForYou}
        initialNumToRender={4}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Animated.View
        style={[
          styles.footer,
          { transform: [{ translateY: footerTranslate }] },
        ]}
      >
        <View style={styles.footerContent}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => handleIconPress("Bộ lọc")}
          >
            <Icon name="tune" size={24} color="black" />
            <Text style={styles.footerText}>Bộ lọc</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => handleIconPress("Bản đồ")}
          >
            <Icon name="earth" size={24} color="black" />
            <Text style={styles.footerText}>Bản đồ</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <FilterBottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  iconWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 24,
    padding: 7,
    marginHorizontal: 5,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    marginLeft: 6,
    fontWeight: "700",
  },
  listContent: {
    paddingTop: 45,
  },
  item: {
    padding: 16,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: "22%",
    right: "22%",
    backgroundColor: "#fff",
    paddingVertical: 10,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 26,
  },
  footerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  footerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  footerText: {
    marginLeft: 6,
  },
  divider: {
    height: 16,
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
  },
});

export default ListOfCar;
