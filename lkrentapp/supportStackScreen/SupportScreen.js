import React from "react";
import { FontAwesome6, Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button } from "@rneui/themed";

const supportMenu = [
  {
    id: 1,
    name: "Thông tin công ty",
    icon: "business-outline",
  },
  {
    id: 2,
    name: "Hỏi và trả lời",
    icon: "help-outline",
  },
  {
    id: 3,
    name: "Chính sách quy định",
    icon: "newspaper-outline",
  },
];

export default function SupportScreen() {
  return (
    <View style={styles.container}>
        <FontAwesome6 name="headset" size={50} paddingTop={10} color="black" />
      <View style={styles.supportCard}>
        <Text style={styles.supportText}>
          {`Cần hỗ trợ nhanh vui lòng gọi 0123456789 (7:00-17:00) hoặc gửi tin nhắn vào LKFanpage`}
        </Text>
        <View style={styles.buttonGroup}>
          <Button
            title="Gọi"
            icon={{
              name: "phone",
              type: "font-awesome",
              size: 24,
              color: "white",
            }}
            iconContainerStyle={{ marginRight: 10 }}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={styles.buttonStyle}
            containerStyle={{
              width: 120,
              marginHorizontal: 10,
              marginVertical: 8,
            }}
          />
          <Button
            title="Gửi tin nhắn"
            icon={{
              name: "comment",
              type: "font-awesome",
              size: 24,
              color: "white",
            }}
            iconContainerStyle={{ marginRight: 10 }}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={styles.buttonStyle}
            containerStyle={{
              width: 150,
              marginHorizontal: 15,
              marginVertical: 8,
            }}
          />
        </View>
      </View>

      <View style={styles.menu}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={supportMenu}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name={item.icon} size={23} style={{ marginRight: 10 }} />
              <Text style={styles.menuText}>{item.name}</Text>
              <View style={styles.flexSpacer} />
              <Ionicons name="arrow-forward-outline" size={20} color="black" />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>
    </View>
  );
}

const deviceHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: deviceHeight < 1000 ? 10 : 20,
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
  supportCard: {
    width: "92%",
    height: 115,
    flexShrink: 0,
    borderRadius: 10,
    backgroundColor: "#F6F6F6",
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 4 },
    alignItems: "center",
    padding: 5,
    marginVertical: 20,
  },
  supportText: {
    flexShrink: 1,
    color: "rgba(0, 0, 0, 1)",
    fontSize: 16,
    fontWeight: "400",
  },
  buttonGroup: {
    flexDirection: "row",
  },
  buttonStyle: {
    backgroundColor: "#03a9f4",
    borderColor: "transparent",
    borderWidth: 0,
    borderRadius: 30,
  },
  menu: {
    flex: 1,
    padding: 10,
    width: "100%",
  },
  menuItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#F6F6F6",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    justifyContent: "space-between",
  },
  menuText: {
    fontSize: 16,
  },
  flexSpacer: {
    flex: 1,
  },
});
