import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { FontAwesome5, FontAwesome } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { DocumentComponent } from '../CarDetailScreen';
import CollateralComponent from '../CarDetailComponent/CollateralComponent';
import TermsComponent from '../CarDetailComponent/TermsComponent';

const RentingRequirement = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerWrapper}>
        <Text style={styles.titleText}>Thủ tục thuê xe</Text>
        <FontAwesome name="question-circle" size={20} color="#000" />
      </View>
      <Text style={styles.descriptionText}>Chọn 1 trong 2 hình thức:</Text>
      <View style={styles.optionList}>
        <TouchableOpacity style={styles.optionItem} disabled={true}>
          <FontAwesome5 name="passport" size={22} color="#000" />
          <Text style={styles.optionText}>
            GPLX (đối chiếu) & Passport (giữ lại)
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionItem} disabled={true}>
          <FontAwesome5 name="id-card" size={21} color="#000" />
          <Text style={styles.optionText}>
            GPLX (đối chiếu) & CCCD (đối chiếu VNeID)
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.moreButton} onPress={openModal}>
        <Text style={styles.moreText}>Xem thêm </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          
          <View style={styles.modalContent}>
            <ScrollView>
                <TouchableOpacity
                  style={[styles.button, styles.buttonClose]}
                  onPress={closeModal}
                >
                  <Text style={styles.textStyle}>X</Text>
                </TouchableOpacity>
              <DocumentComponent />
              <CollateralComponent />
              <TermsComponent />
              <View style={styles.paddingBottom} ></View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: "#fff",
    
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#03A9F4",
    marginRight: 8,
  },
  descriptionText: {
    fontSize: 15,
    color: "#666",
    marginBottom: 6,
  },
  optionList: {
    flexDirection: "column",
  },
  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  optionText: {
    fontSize: 14.2,
    marginLeft: 16,
    alignSelf: "center",
    color: "#333",
  },
  moreButton: {
    marginTop: 8,
  },
  moreText: {
    fontSize: 14.5,
    marginLeft: 0, // Align text to the left
    paddingLeft: 0, // Add padding if necessary
    alignSelf: "center",
    color: "#03A9F4",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end", // Align modal to the bottom
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding:4,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '100%',
    maxHeight: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#03A9F4",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
  },
  button: {
    alignSelf: "flex-start",
    borderRadius: 28,
    padding: 5,
    width: 28,
    height: 28,
    marginLeft:16,
    marginTop:16,
  },
  buttonClose: {
    backgroundColor: "#03A9F4",
  },
  textStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  paddingBottom:{
    paddingBottom:30,
  }


});

export default RentingRequirement;
