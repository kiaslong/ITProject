// RegisterCarComponent/ModalPicker.js
import React from 'react';
import { Modal, View, Pressable, Text, StyleSheet, FlatList } from 'react-native';

const ModalPicker = ({ visible, items, onSelect, onClose, label }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalLabel}>{label}</Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={items}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.modalItem} onPress={() => onSelect(item)}>
                <Text style={styles.modalItemText}>{item}</Text>
              </Pressable>
            )}
            style={styles.flatList}
            contentContainerStyle={styles.flatListContent}
          />
          <Pressable style={styles.modalButton} onPress={onClose}>
            <Text style={styles.modalButtonText}>Hủy</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  flatList: {
    width: '100%',
  },
  flatListContent: {
    paddingBottom: 20,
  },
  modalItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
  },
  modalItemText: {
    fontSize: 18,
    color: '#333',
  },
  modalButton: {
    marginTop: 20,
    backgroundColor: '#03a9f4',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ModalPicker;
