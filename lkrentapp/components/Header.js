import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SearchBarWrapper from "./SearchBarWrapper";

const Header = ({ showSearchBar, showCloseButton }) => {
  const navigation = useNavigation();
  

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
          <Ionicons
            ios="arrow-back"
            name={showCloseButton ? "close-circle-outline" : "chevron-back-circle-outline"}
            size={40}
            color="#03a9f4"
          />
      </TouchableOpacity>
      {showSearchBar ? (
        <SearchBarWrapper />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    height:  110,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 50,
    marginLeft: 15,
    marginRight:2,
  },
 
});

export default Header;
