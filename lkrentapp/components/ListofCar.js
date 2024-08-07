import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  Animated,
  FlatList,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicon from "react-native-vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { getPromotions } from "../store/promotionSlice";
import { fetchSearchingCars } from "../store/carListSlice";
import { setCarIds } from "../store/carIdSlice";
import { getToken } from "../utils/tokenStorage";
import api from "../api";
import CarCard from "../components/CarCard";
import FilterBottomSheet from "./FilterModal";

const iconData = [
  { id: "1", name: "repeat", label: "", iconType: "MaterialCommunityIcons" },
  { id: "2", name: "car-sports", label: "Loại xe", iconType: "MaterialCommunityIcons" },
  { id: "3", name: "globe-outline", label: "Hãng xe", iconType: "Ionicons" },
  { id: "4", name: "medal-outline", label: "Chủ xe 5 sao", iconType: "MaterialCommunityIcons" },
  { id: "5", name: "lightning-bolt-outline", label: "Đặt xe nhanh", iconType: "MaterialCommunityIcons" },
  { id: "6", name: "location-outline", label: "Giao xe tận nơi", iconType: "Ionicons" },
  { id: "7", name: "sale", label: "Giảm giá", iconType: "MaterialCommunityIcons" },
  { id: "8", name: "credit-card-off-outline", label: "Miễn thế chấp", iconType: "MaterialCommunityIcons" },
  { id: "9", name: "car-electric-outline", label: "Xe điện", iconType: "MaterialCommunityIcons" },
];

const ListOfCar = ({ navigation }) => {
  const user = useSelector((state) => state.loggedIn.user);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const promotions = useSelector((state) => state.promotions.promotions);
  const dispatch = useDispatch();
  const carList = useSelector((state) => state.carsList.searching);

  const fetchOrderHistory = useCallback(async () => {
    if (!user || !user.id) {
      return [];
    }
    const token = await getToken();
    try {
      const response = await api.get(`/order/user/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const orderHistory = response.data;
      const validOrders = orderHistory.filter(order => order.orderState !== 'CANCELED' && order.orderState !== 'COMPLETED');
      const carIds = [...new Set(validOrders.map((order) => order.carId))];
      dispatch(setCarIds(carIds));
      return carIds;
    } catch {
      return [];
    }
  }, [user, dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fetchedCarIds = await fetchOrderHistory();
      dispatch(getPromotions());
      dispatch(fetchSearchingCars({ userId: user ? user.id : null, carIds: fetchedCarIds }));
      setLoading(false);
    };
    fetchData();
  }, [user, dispatch, fetchOrderHistory]);

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
      <CarCard carInfo={item} promotions={promotions} navigation={navigation} />
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
      <Animated.View key={item.id} style={[styles.iconWrapper, { opacity: headerScale }]}>
        <TouchableOpacity style={styles.touchable} onPress={() => handleIconPress(item.label)}>
          <IconComponent name={item.name} size={18} color="black" />
          {item.label ? <Text style={styles.label}>{item.label}</Text> : null}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03A9F4" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.header, { transform: [{ scaleY: headerScale }] }]}>
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
        data={carList}
        initialNumToRender={4}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      />
      <Animated.View style={[styles.footer, { transform: [{ translateY: footerTranslate }] }]}>
        <View style={styles.footerContent}>
          <TouchableOpacity style={styles.footerButton} onPress={() => handleIconPress("Bộ lọc")}>
            <Icon name="tune" size={24} color="black" />
            <Text style={styles.footerText}>Bộ lọc</Text>
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.footerButton} onPress={() => handleIconPress("Bản đồ")}>
            <Icon name="earth" size={24} color="black" />
            <Text style={styles.footerText}>Bản đồ</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      <FilterBottomSheet visible={visible} onClose={() => setVisible(false)} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ListOfCar;
