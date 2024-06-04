import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";




export default function NotiScreen() {

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Thông báo</Text>
      </View>
     
    </View>
     
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: deviceHeight < 1000 ? 80 : 100,
    backgroundColor: "#fff",
  },
  titleContainer: {
    width: "100%",
    position: "relative",
    alignItems: "center",
    paddingVertical: deviceHeight < 1000 ? 10 : 20,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    textTransform: "uppercase",
    color: "#03a9f4",
  },
 
});
