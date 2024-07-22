import React, { useMemo } from "react";
import { View, Text, StyleSheet,TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import { Image } from "expo-image";

const { width, height } = Dimensions.get("window");
const scaleWidth = width / 375; // 375 is the width of a standard iPhone screen
const scaleHeight = height / 667; // 667 is the height of a standard iPhone screen

const CarRentalInfo = ({ carInfo, time, navigation, showCarDetail }) => {
  const handleMapPress = () => {
    navigation.navigate("FullMapScreen", {
      address: carInfo.location,
    });
  };

  const currentYear = moment().year();
  const [start, end] = useMemo(
    () => time.split(" - ").map((t) => moment(t, "HH:mm, DD/MM")),
    [time]
  );


  const trimLocation = (location) => {
    const parts = location.split(',');
    if (parts.length > 2) {
      let part2 = parts[2].trim();
      let part3 = parts[3].trim();
      if (!part2.startsWith('Quận')) {
        part2 = 'Quận ' + part2;
      }
      if (part3 && !(part3.startsWith('Thành phố'))) {
        part3 = 'Thành phố ' + part3;
      }
      
      
      return [part2,part3].join(', ').trim();
    }
    return location.trim();
  };


  return (
    <View style={styles.container}>
      {showCarDetail && (
        <>
          <View style={styles.header}>
          <Image
              source={carInfo.thumbImage}
              style={styles.carImage}
              contentFit="contain"
              transition={1000}
            />
            <View style={styles.carInfo}>
              <Text style={styles.carName}>{carInfo.title}</Text>
              <Text style={styles.carId}>Mã số xe: {carInfo.id}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16 * scaleWidth} color="#FFD700" />
                <Text style={styles.ratingText}>{carInfo.rating}</Text>
                <Ionicons name="car" size={16 * scaleWidth} color="#4CAF50" />
                <Text style={styles.tripsText}>{carInfo.trips} chuyến</Text>
              </View>
            </View>
          </View>
          <View style={styles.separator} />
        </>
      )}
      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Thông tin thuê xe</Text>
        <View style={styles.row}>
          <View style={styles.dateContainer}>
            <View style={styles.headerDateContainer}>
              <Ionicons name="calendar-outline" size={18 * scaleWidth} color="#000" />
              <Text style={styles.dateLabel}>Nhận xe</Text>
            </View>
            <Text style={styles.dateText}>
              {start
                ? `${start.format("HH:mm")} ${start.format("ddd")}, ${start.format(
                    "DD/MM"
                  )}/${currentYear}`
                : ""}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <View style={styles.headerDateContainer}>
              <Ionicons name="calendar-outline" size={18 * scaleWidth} color="#000" />
              <Text style={styles.dateLabel}>Trả xe</Text>
            </View>
            <Text style={styles.dateText}>
              {end
                ? `${end.format("HH:mm")} ${end.format("ddd")}, ${end.format(
                    "DD/MM"
                  )}/${currentYear}`
                : ""}
            </Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.locationContainer}>
            <View style={styles.headerDateContainer}>
              <Ionicons name="location-outline" size={20 * scaleWidth} color="#000" />
              <Text style={styles.locationText}>Nhận xe tại địa chỉ của xe</Text>
            </View>
            <Text style={styles.locationAddress}>{trimLocation(carInfo.location)}</Text>
            <TouchableOpacity onPress={handleMapPress}>
              <Text style={styles.mapLink}>Xem bản đồ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginTop: 10,
    paddingLeft: 16 * scaleWidth,
    paddingRight: 16 * scaleWidth,
  },
  header: {
    flexDirection: "row",
    marginBottom: 16,
  },
  carImage: {
    width: 135 * scaleWidth,
    height: 75 * scaleHeight,
    borderRadius: 16 * scaleWidth,
  },
  carInfo: {
    alignSelf: "flex-start",
    marginLeft: 10 * scaleWidth,
    justifyContent: "center",
  },
  carName: {
    fontSize: 16 * scaleWidth,
    fontWeight: "bold",
  },
  carId: {
    fontSize: 15 * scaleWidth,
    color: "#888",
    marginTop: 10 * scaleHeight,
    marginBottom: 10 * scaleHeight,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 15 * scaleWidth,
    marginLeft: 4 * scaleWidth,
    marginRight: 16 * scaleWidth,
  },
  tripsText: {
    fontSize: 15 * scaleWidth,
    marginLeft: 4 * scaleWidth,
  },
  separator: {
    height: 1 * scaleHeight,
    backgroundColor: "#E0E0E0",
    marginBottom: 16 * scaleHeight,
  },
  infoContainer: {
    marginBottom: 16 * scaleHeight,
  },
  sectionTitle: {
    fontSize: 16 * scaleWidth,
    fontWeight: "bold",
    marginBottom: 8 * scaleHeight,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8 * scaleHeight,
  },
  headerDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateContainer: {
    width: "48%",
    alignItems: "flex-start",
  },
  dateLabel: {
    marginLeft: 8 * scaleWidth,
    fontSize: 14 * scaleWidth,
    color: "#888",
  },
  dateText: {
    fontSize: 14 * scaleWidth,
    fontWeight: "bold",
    marginTop: 4 * scaleHeight,
  },
  locationContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  locationText: {
    fontSize: 14 * scaleWidth,
    color: "#888",
  },
  locationAddress: {
    fontSize: 14 * scaleWidth,
    fontWeight: "bold",
    marginTop: 4 * scaleHeight,
  },
  mapLink: {
    fontSize: 14 * scaleWidth,
    color: "#03A9F4",
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginTop: 4 * scaleHeight,
  },
});

export default CarRentalInfo;
