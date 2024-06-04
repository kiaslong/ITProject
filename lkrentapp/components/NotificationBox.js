import React from "react";
import { View, StyleSheet ,Text,Pressable} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default NotificationBox = ({ icon, title, message, time , onPress  }) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
    <Ionicons name={icon} size={30} style={styles.icon} />
    <View style={styles.textContainer}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
    <Text style={styles.time}>{time}</Text>
  </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    margin:2,
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  time: {
    fontSize: 12,
    color: "#aaa",
  },
});
