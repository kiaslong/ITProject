import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";

const faqData = [
  {
    id: "1",
    question: "Làm thế nào để thuê xe?",
    answer: "Để thuê xe, bạn cần duyệt qua danh sách, chọn xe, và liên hệ với chủ xe để sắp xếp xem xe và hoàn tất các thủ tục cần thiết.",
  },
  {
    id: "2",
    question: "Quy trình đăng ký thuê xe như thế nào?",
    answer: "Quy trình đăng ký thuê xe bao gồm nộp đơn đăng ký, cung cấp các giấy tờ cần thiết, và trải qua kiểm tra lý lịch.",
  },
  {
    id: "3",
    question: "Các phương thức thanh toán là gì?",
    answer: "Chúng tôi chấp nhận nhiều phương thức thanh toán bao gồm chuyển khoản ngân hàng, thẻ tín dụng, và các nền tảng thanh toán trực tuyến.",
  },
  {
    id: "4",
    question: "Có cần đặt cọc không?",
    answer: "Có, bạn cần đặt cọc một khoản tiền nhất định để đảm bảo việc thuê xe.",
  },
  {
    id: "5",
    question: "Tôi có thể thuê xe trong bao lâu?",
    answer: "Thời gian thuê xe linh hoạt từ vài giờ đến vài tuần, tùy thuộc vào nhu cầu của bạn.",
  },
  {
    id: "6",
    question: "Chính sách hủy thuê xe như thế nào?",
    answer: "Nếu bạn hủy thuê xe trước 24 giờ, bạn sẽ được hoàn lại toàn bộ số tiền đặt cọc. Sau 24 giờ, bạn sẽ mất một phần hoặc toàn bộ số tiền đặt cọc tùy theo thời gian hủy.",
  },
  {
    id: "7",
    question: "Tôi có thể gia hạn thời gian thuê xe không?",
    answer: "Có, bạn có thể gia hạn thời gian thuê xe bằng cách liên hệ với chủ xe và thống nhất lại các điều khoản.",
  },
  {
    id: "8",
    question: "Tôi có cần giấy phép lái xe không?",
    answer: "Có, bạn cần có giấy phép lái xe hợp lệ để thuê và lái xe.",
  },
  {
    id: "9",
    question: "Có bảo hiểm cho xe thuê không?",
    answer: "Có, tất cả các xe cho thuê đều có bảo hiểm. Bạn nên kiểm tra các điều khoản bảo hiểm trước khi thuê xe.",
  },
  {
    id: "10",
    question: "Làm sao tôi biết xe còn sẵn sàng cho thuê?",
    answer: "Bạn có thể kiểm tra tình trạng sẵn sàng của xe thông qua ứng dụng hoặc liên hệ trực tiếp với chủ xe.",
  },
];

const FAQScreen = () => {
  const [expandedId, setExpandedId] = useState(null);

  const handlePress = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity onPress={() => handlePress(item.id)}>
        <Text style={styles.question}>{item.question}</Text>
      </TouchableOpacity>
      {expandedId === item.id && <Text style={styles.answer}>{item.answer}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={faqData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  itemContainer: {
    marginVertical: 8,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  answer: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
  },
});

export default FAQScreen;
