import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";

const MessageComponent = () => {
  return (
    <View style={styles.container}>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Lời nhắn cho chủ xe</Text>
        <TouchableOpacity>
          <Text style={styles.suggestText}>Gợi ý lời nhắn</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập nội dung lời nhắn cho chủ xe"
        multiline
      />
      <View style={styles.note}>
        <Icon
          name="lock-closed-outline"
          size={20}
          color="grey"
          style={styles.icon}
        />
        <Text style={styles.noteText}>
          Giao dịch qua LKRental để chúng tôi bảo vệ bạn tốt nhất trong trường
          hợp bị hủy chuyến ngoài ý muốn & phát sinh sự cố bảo hiểm.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  labelContainer:{
    flexDirection:"row",
    justifyContent:"space-between",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#03A9F4",
  },
  textArea: {
    height: 100,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    textAlignVertical: "top",
    fontSize: 14,
  },
  suggestText: {
    color: "#03A9F4",
    alignSelf:"flex-end",
    textDecorationLine: "underline",
  },
  note: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    marginRight: 5,
  },
  noteText: {
    fontSize: 12,
    color: "grey",
    flex: 1,
    flexWrap: "wrap",
  },
});

export default MessageComponent;
