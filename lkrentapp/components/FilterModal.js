import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { height } = Dimensions.get("window");

const FilterModal = ({ visible, onClose }) => {
  const [modalVisible, setModalVisible] = useState(visible);
  const [expanded, setExpanded] = useState(false);
  const modalHeight = useState(new Animated.Value(height * 0.5))[0];
  const slideAnim = useState(new Animated.Value(height))[0]; // Initial position off screen
  const dragY = useState(new Animated.Value(0))[0];
  const initialScrollY = useRef(0);
  const [collapse, setCollapse] = useState(false);

  useEffect(() => {
    if (visible) {
      setModalVisible(true);
      setExpanded(false);
      setCollapse(true);
      modalHeight.setValue(height * 0.5); // Reset modal height to initial value
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setModalVisible(false);
      });
    }
  }, [visible, slideAnim, modalHeight]);

  const handleGesture = Animated.event(
    [{ nativeEvent: { translationY: dragY } }],
    { useNativeDriver: false }
  );

  const handleGestureEnd = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      const { translationY } = nativeEvent;
      const threshold = 100; // Adjust threshold as needed

      if (translationY > threshold) {
        handleOverlayPress();
      } else if (translationY > 50) {
        Animated.timing(modalHeight, {
          toValue: height * 0.5,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setExpanded(false);
        setCollapse(true);
      } else if (translationY < -50 && !expanded && initialScrollY.current === 0) {
        Animated.timing(modalHeight, {
          toValue: height * 0.83,
          duration: 300,
          useNativeDriver: false,
        }).start();
        setExpanded(true);
        setCollapse(false);
      }
      dragY.setValue(0);
    }
  };

  const handleOverlayPress = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleScroll = (event) => {
    const scrollY = event.nativeEvent.contentOffset.y;
  
  
  

  
  
    // Check if we need to expand the modal when scrolling up
    if (scrollY > 50 && !expanded) {
      // Expand modal only if not already expanded and scrolled up
      Animated.timing(modalHeight, {
        toValue: height * 0.83,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpanded(true);
        setCollapse(false);
        // Update initial scroll position after handling scroll
        initialScrollY.current = scrollY;
       
      });
    } 
    // Check if we need to collapse the modal when scrolling down
    else if (scrollY < -60 && expanded) {
      // Collapse modal only if already expanded and user scrolled down by threshold
      Animated.timing(modalHeight, {
        toValue: height * 0.5,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setExpanded(false);
        setTimeout(()=>{
          setCollapse(true);
        },1000)
       
        // Update initial scroll position after handling scroll
        initialScrollY.current = scrollY;
        console.log('Collapsed');
      });
    } else if (collapse && scrollY < -50 ){
      onClose();
    }

    
  
    // Update initial scroll position after calculations
    initialScrollY.current = scrollY;
  };
  
  
  const modalContainerStyle = useMemo(
    () => [styles.modalContent, { height: modalHeight }],
    [modalHeight]
  );

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleOverlayPress}
        />
        <PanGestureHandler
          onGestureEvent={handleGesture}
          onHandlerStateChange={handleGestureEnd}
        >
          <Animated.View
            style={[
              styles.modalWrapper,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <Animated.View style={modalContainerStyle}>
              <TouchableOpacity
                onPress={onClose}
                style={styles.closeIconButton}
              >
                <Ionicons name="close" size={24} color="#03a9f4" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Bộ lọc</Text>
              <TouchableOpacity onPress={null} style={styles.resetButton}>
                <Text style={styles.resetButtonText}>Đặt lại</Text>
              </TouchableOpacity>
              <Animated.ScrollView
                style={styles.scrollView}
                scrollEventThrottle={30}
                onScroll={handleScroll}
              >
                <View style={styles.scrollableContent}>
                  <Text style={styles.modalItem}>Xếp xếp theo: Tối ưu</Text>
                  <Text style={styles.modalItem}>
                    Mức giá: Bất kì - 3000k
                  </Text>
                  <Text style={styles.modalItem}>Truyền động</Text>
                  <Text style={styles.modalItem}>Giới hạn số km</Text>
                  <Text style={styles.modalItem}>Phí vượt giới hạn</Text>
                  <Text style={styles.modalItem}>Xếp xếp theo: Tối ưu</Text>
                  <Text style={styles.modalItem}>
                    Mức giá: Bất kì - 3000k
                  </Text>
                  <Text style={styles.modalItem}>Truyền động</Text>
                  <Text style={styles.modalItem}>Giới hạn số km</Text>
                  <Text style={styles.modalItem}>Phí vượt giới hạn</Text>
                  <Text style={styles.modalItem}>Xếp xếp theo: Tối ưu</Text>
                  <Text style={styles.modalItem}>
                    Mức giá: Bất kì - 3000k
                  </Text>
                  <Text style={styles.modalItem}>Truyền động</Text>
                  <Text style={styles.modalItem}>Giới hạn số km</Text>
                  <Text style={styles.modalItem}>Phí vượt giới hạn</Text>
                  <Text style={styles.modalItem}>Xếp xếp theo: Tối ưu</Text>
                  
                 
                </View>
              </Animated.ScrollView>
            </Animated.View>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalWrapper: {
    width: "100%",
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    bottom: 0,
  },
  modalContent: {
    width: "100%",
    marginTop: 8,
    backgroundColor: "white",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    overflow: "hidden",
    flex: 1,
  },
  closeIconButton: {
    position: "absolute",
    top: 4,
    left: 10,
    zIndex: 1,
    padding: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
    textAlign: "center",
  },
  modalItem: {
    fontSize: 16,
    padding: 16,
  },
  scrollableContent: {
    marginTop: 16,
    paddingBottom: 50, // Adjust this value as needed
  },
  resetButton: {
    position: "absolute",
    top: 4,
    right: 10,
    padding: 7,
    backgroundColor: "red",
    borderRadius: 10,
  },
  resetButtonText: {
    color: "white",
    fontSize: 14,
  },
});

export default FilterModal;
