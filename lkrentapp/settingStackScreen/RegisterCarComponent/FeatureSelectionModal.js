// FeatureSelectionModal.js
import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const features = [
  { id: '1', name: 'Bản đồ', icon: 'map-outline' },
  { id: '2', name: 'Bluetooth', icon: 'bluetooth-outline' },
  { id: '3', name: 'Camera 360', icon: 'camera-reverse-outline' },
  { id: '4', name: 'Camera cập lề', icon: 'camera-reverse-outline' },
  { id: '5', name: 'Camera hành trình', icon: 'videocam-outline' },
  { id: '6', name: 'Camera lùi', icon: 'camera-reverse-outline' },
  { id: '7', name: 'Cảm biến lốp', icon: 'speedometer-outline' },
  { id: '8', name: 'Cảm biến va chạm', icon: 'alert-circle-outline' },
  { id: '9', name: 'Cảnh báo tốc độ', icon: 'speedometer-outline' },
  { id: '10', name: 'Cửa sổ trời', icon: 'car-outline' },
  { id: '11', name: 'Định vị GPS', icon: 'navigate-outline' },
  { id: '12', name: 'Ghế trẻ em', icon: 'person-outline' },
  { id: '13', name: 'Khe cắm USB', icon: 'pint-outline' },
  { id: '14', name: 'Lốp dự phòng', icon: 'car-outline' },
  { id: '15', name: 'Màn hình DVD', icon: 'tv-outline' },
  { id: '16', name: 'Nắp thùng xe bán tải', icon: 'car-outline' },
  { id: '17', name: 'ETC', icon: 'card-outline' },
  { id: '18', name: 'Túi khí an toàn', icon: 'airplane-outline' },
];

const FeatureSelectionModal = ({ visible, onClose, onSelect }) => {
  const slideAnim = useRef(new Animated.Value(300)).current;

  const [selectedFeatures, setSelectedFeatures] = useState([]);

  const toggleFeature = (feature) => {
    setSelectedFeatures((prevSelected) =>
      prevSelected.includes(feature)
        ? prevSelected.filter((f) => f !== feature)
        : [...prevSelected, feature]
    );
  };

  const handleConfirm = () => {
    onSelect(selectedFeatures);
    onClose();
  };

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  return (
    <Modal transparent={true} visible={visible} animationType="none">
      <View style={styles.overlay}>
        <Pressable style={styles.overlay} onPress={onClose} />
        <Animated.View style={[styles.modal, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content}>
            {features.map((feature) => (
              <Pressable
                key={feature.id}
                style={[
                  styles.feature,
                  selectedFeatures.includes(feature) ? styles.selectedFeature : null,
                ]}
                onPress={() => toggleFeature(feature)}
              >
                <Ionicons
                  name={feature.icon}
                  size={22}
                  color={selectedFeatures.includes(feature) ? '#03a9f4' : 'black'}
                />
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  style={[
                    styles.featureText,
                    selectedFeatures.includes(feature) ? styles.selectedFeatureText : null,
                  ]}
                >
                  {feature.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    margin: 4,
    flexBasis: '47%',
  },
  selectedFeature: {
    borderColor: '#03a9f4',
  },
  featureText: {
    marginLeft: 6,
    fontSize: 12,
    flexShrink: 1,
  },
  selectedFeatureText: {
    color: '#03a9f4',
  },
  confirmButton: {
    backgroundColor: '#03a9f4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default FeatureSelectionModal;
