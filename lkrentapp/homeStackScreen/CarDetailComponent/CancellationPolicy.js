import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CancellationPolicy = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.policyContainer}>
        <Text style={styles.header}>Chính sách hủy chuyến</Text>
        <Text style={styles.description}>
          An tâm thuê xe, không lo bị hủy chuyến với chính sách hủy chuyến của
          LKRental
        </Text>
        <TouchableOpacity style={styles.moreButton} onPress={openModal}>
          <Text style={styles.moreText}>Xem thêm</Text>
          <Ionicons name="chevron-forward-outline" size={16} color="#03A9F4" />
        </TouchableOpacity>
      </View>
     

      <Modal
        visible={modalVisible}
        animationType="none"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
              <Ionicons name="close" size={30} color="#000" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Text style={styles.modalHeader}>Chính sách hủy chuyến</Text>
              <View style={styles.tableContainer}>
                <View style={styles.tableRowHeader}>
                  <Text style={styles.tableHeader}>Thời Điểm Hủy Chuyến</Text>
                  <View style={styles.separatorColumn} />
                  <Text style={styles.tableHeader}>Khách Thuê Hủy Chuyến</Text>
                  <View style={styles.separatorColumn} />
                  <Text style={styles.tableHeader}>Chủ Xe Hủy Chuyến</Text>
                </View>
                <View style={styles.separatorRow} />
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>Trong Vòng 1h Sau Giữ Chỗ</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="green"
                    />
                    <Text>Hoàn tiền giữ chỗ 100%</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="green"
                    />
                    <Text>Không tốn phí (Đánh giá hệ thống 3*)</Text>
                  </View>
                </View>
                <View style={styles.separatorRow} />
                <View style={styles.tableRow}>
                  <View style={styles.tableCell}>
                    <Text>Trước Chuyến Đi {">"} 7 Ngày</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="green"
                    />
                    <Text>Hoàn tiền giữ chỗ 70%</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={20}
                      color="green"
                    />
                    <Text>Đền tiền 30% (Đánh giá hệ thống 3*)</Text>
                  </View>
                </View>
                <View style={styles.separatorRow} />
                <View style={styles.tableRow}>
                    <View style={styles.tableCell}>
                    <Text>Trong Vòng 7 Ngày Trước Chuyến Đi</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="red"
                    />
                    <Text>Không hoàn tiền</Text>
                  </View>
                  <View style={styles.separatorColumn} />
                  <View style={styles.tableCell}>
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color="red"
                    />
                    <Text>Đền tiền 100% (Đánh giá hệ thống 2*)</Text>
                  </View>
                </View>
              </View>
              <View style={styles.noteContainer}>
                <Text style={styles.noteHeader}>Lưu ý</Text>
                <Text style={styles.noteText}>
                  * Khách thuê không nhận xe sẽ không được hoàn tiền giữ chỗ
                </Text>
                <Text style={styles.noteText}>
                  * Chủ xe không giao xe sẽ hoàn và đến 100% tiền giữ chỗ cho
                  bạn
                </Text>
                <Text style={styles.noteText}>
                  * Tiền giữ chỗ và tiền bồi thường do chủ xe hủy chuyến (nếu
                  có) sẽ được Mioto hoàn trả đến bạn bằng chuyển khoản ngân hàng
                  trong vòng 1-3 ngày làm việc.
                  <Text style={styles.noteLink}>
                    {" "}
                    Xem thêm Thủ tục hoàn tiền & đền cọc
                  </Text>
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
  },
  policyContainer: {
    marginBottom: 16,
  },
  header: {
    color: "#03A9F4",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  moreButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  moreText: {
    fontSize: 14,
    color: "#03A9F4",
    fontWeight: "bold",
    marginRight: 4,
  },
  separator: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 8,
  },
  reportButton: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  reportText: {
    fontSize: 18,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginLeft: 8,
    color: "#03A9F4",
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    alignSelf: "flex-start",
  },
  modalContent: {
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 18,
    color: "#03A9F4",
    fontWeight: "bold",
    marginBottom: 16,
  },
  tableContainer: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    overflow: "hidden",
  },
  tableRowHeader: {
    height:55,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:7,
  },
  tableRow: {
    height:100,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:7,
  },
  tableHeader: {
    flex: 1,
    alignSelf:"center",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  separatorRow: {
    height: 1,
    backgroundColor: "#E0E0E0",
    width: "100%",
  },
  separatorColumn: {
    height: "100%",
    marginHorizontal:3.9,
    backgroundColor: "#E0E0E0",
    width: 1,
  },
  noteContainer: {
    marginTop: 10,
    width: "100%",
  },
  noteHeader: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  noteLink: {
    color: "#03A9F4",
    textDecorationLine: "underline",
  },
});

export default CancellationPolicy;
