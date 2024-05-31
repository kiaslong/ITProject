import {
    Alert,
    Image,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
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
        image: "",
        carName: "BMW",
        timeEnd: "1/1/2024",
        timeStart: "2/1/2024",
        status: "Thành công",
        timeRemain: "1 ngày",
      },
      {
        id: "LK2",
        image: "",
        carName: "Lamborghini",
        timeEnd: "1/1/2024",
        timeStart: "2/1/2024",
        status: "Thành công",
        timeRemain: "1 ngày",
      },
      {
        id: "LK3",
        image: "",
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
      paddingHorizontal: 20,
    },
    titleContainer: {
      width: "100%",
      position: "relative",
      alignItems: "center",
      paddingVertical: 40,
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
  