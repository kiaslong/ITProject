import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import SearchBarWrapper from "./SearchBarWrapper";

const Header = ({
  showBackButton,
  showTitle,
  showSearchBar,
  showCloseButton,
  screenTitle,
}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            ios="arrow-back"
            name={
              showCloseButton
                ? "close-circle-outline"
                : "chevron-back-circle-outline"
            }
            size={40}
            color="#03a9f4"
          />
        </TouchableOpacity>
      )}
      {showTitle && (
        <View style={[styles.titleContainer, showBackButton && styles.withBackButton]}>
          <Text style={styles.title}>{screenTitle}</Text>
        </View>
      )}
      {showSearchBar && (
        <View style={styles.searchBarContainer}>
          <SearchBarWrapper />
        </View>
      )}
    </View>
  );
};

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  headerContainer: {
    height: deviceHeight * 0.13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    paddingHorizontal: deviceWidth * 0.035,
  },
  backButton: {
    marginTop: deviceHeight * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 1,
    marginTop: deviceHeight * 0.075,
    justifyContent: "center",
    alignItems: "center",
  },
  withBackButton: {
    marginRight:deviceWidth * 0.1
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#03a9f4",
    textAlign: "center",
    textTransform: "uppercase",
  },
  searchBarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Header;
