import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
  } from "react-native";
  import { Ionicons } from "@expo/vector-icons";
  import HistoryListItem from "../components/HistoryListItem";
  
  export default function HistoryScreen() {
    const history = [
      {
        id: "LK1",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7KjZI8Jy7VCoVeRp-aOpaIe9T9lzQPUW2zQ&s",
        carName: "BMW",
        timeEnd: "1/2/2024",
        timeStart: "2/2/2024",
        status: "Thành công",
        timeRemain: "1 ngày",
      },
      {
        id: "LK2",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqf-xMwqSf5SMFyMrqx49oqz9UrUe2fNmfg&s",
        carName: "Lamborghini",
        timeEnd: "1/1/2024",
        timeStart: "2/1/2024",
        status: "Thành công",
        timeRemain: "1 ngày",
      },
      {
        id: "LK3",
        image: "https://hondaotobinhdinh.com.vn/wp-content/uploads/2023/10/576995-un-honda-cr-v-hybride-moins-cher-s-ajoute-a-la-gamme.jpg",
        carName: "Honda",
        timeEnd: "1/1/2024",
        timeStart: "2/1/2024",
        status: "Thành công",
        timeRemain: "1 ngày",
      },
    ];
  
    return (
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Chuyến của tôi</Text>
          <Ionicons name="calendar-outline" size={40} color="black" style={styles.icon} />
        </View>
        <FlatList
          initialNumToRender={3}
          data={history}
          style={styles.list}
          renderItem={({ item }) => <HistoryListItem history={item} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
  
  const deviceHeight = Dimensions.get("window").height;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      paddingTop: deviceHeight < 1000 ? 80 : 100,
      paddingHorizontal : 10,
    },
    titleContainer: {
      width: "100%",
      position: "relative",
      alignItems: "center",
      paddingVertical: deviceHeight < 1000 ? 10 : 20 ,
    },
    title: {
      fontSize: 25,
      fontWeight: "bold",
      textTransform: "uppercase",
      color: "#03a9f4",
    },
    icon: {
      position: "absolute",
      right: 0,
    },
    list: {
      
      width: "100%",
    },
  });
  