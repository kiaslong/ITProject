import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const policies = [
  {
    id: "1",
    title: "Chính sách đặt cọc",
    content: "Khách hàng cần đặt cọc một khoản tiền nhất định để đảm bảo việc thuê xe. Số tiền đặt cọc sẽ được hoàn lại sau khi trả xe và kiểm tra tình trạng xe.",
    icon: "cash-outline",
  },
  {
    id: "2",
    title: "Chính sách hủy thuê xe",
    content: "Nếu bạn hủy thuê xe trước 24 giờ, bạn sẽ được hoàn lại toàn bộ số tiền đặt cọc. Sau 24 giờ, bạn sẽ mất một phần hoặc toàn bộ số tiền đặt cọc tùy theo thời gian hủy.",
    icon: "close-circle-outline",
  },
  {
    id: "3",
    title: "Chính sách bảo hiểm",
    content: "Tất cả các xe cho thuê đều có bảo hiểm. Khách hàng nên kiểm tra các điều khoản bảo hiểm trước khi thuê xe để đảm bảo quyền lợi của mình.",
    icon: "shield-checkmark-outline",
  },
  {
    id: "4",
    title: "Chính sách thanh toán",
    content: "Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm chuyển khoản ngân hàng, thẻ tín dụng, và các nền tảng thanh toán trực tuyến. Vui lòng thanh toán đầy đủ trước khi nhận xe.",
    icon: "card-outline",
  },
  {
    id: "5",
    title: "Chính sách sử dụng xe",
    content: "Khách hàng phải tuân thủ các quy định về an toàn giao thông và sử dụng xe đúng mục đích đã thỏa thuận. Nếu phát hiện vi phạm, chúng tôi có quyền thu hồi xe bất kỳ lúc nào.",
    icon: "car-outline",
  },
];

const PolicyScreen = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {policies.map((policy) => (
        <View key={policy.id} style={styles.policyContainer}>
          <View style={styles.titleContainer}>
            <Ionicons name={policy.icon} size={24} color="#333" style={styles.icon} />
            <Text style={styles.title}>{policy.title}</Text>
          </View>
          <Text style={styles.content}>{policy.content}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    marginBottom:10,
  },
  policyContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  icon: {
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  content: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
});

export default PolicyScreen;
