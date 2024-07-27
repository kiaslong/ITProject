import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import SearchBarWrapper from "./SearchBarWrapper";
import { getFunction } from '../store/functionRegistry';

const Header = ({
  showBackButton,
  showTitle,
  showSearchBar,
  showCloseButton,
  screenTitle,
  showIcon,
  iconName,
  functionName,
  customGoBackRoute,
  backFunctionName,
  customData1,
  customData2,
  customData3,
  customData4,
  iconType, 
}) => {
  const navigation = useNavigation();
  const onPress = getFunction(functionName);
  const backFunc = getFunction(backFunctionName);

  const handleBackPress = () => {
    if (customGoBackRoute) {
      navigation.navigate(customGoBackRoute, { carInfo: customData1, time: customData2 , orderId:customData3 , totalPrice:customData4 });
    }
      else if(backFunctionName){
        backFunc()
    } else {
      navigation.goBack();
    }
  };

  const renderIcon = () => {
    if (iconType === 'ionicons') {
      return <Ionicons name={iconName} size={40} color="#03a9f4" style={[styles.icon, showBackButton && styles.iconWithBackButton]} onPress={onPress} />;
    } else {
      return <FontAwesome5 name={iconName} size={30} color="#03a9f4" style={[styles.icon, showBackButton && styles.iconWithBackButton]} onPress={onPress} />;
    }
  };

  return (
    <View style={styles.headerContainer}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
        >
          <Ionicons
            name={showCloseButton ? "close-circle-outline" : "chevron-back-circle-outline"}
            size={40}
            color="#03a9f4"
          />
        </TouchableOpacity>
      )}
      {showTitle && (
        <View
          style={[
            styles.titleContainer,
            showBackButton && styles.withBackButton,
          ]}
        >
          <Text style={styles.title}>{screenTitle}</Text>
          {showIcon && renderIcon()}
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
    flexDirection: "row",
    marginTop: deviceHeight * 0.075,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  withBackButton: {
    marginRight: deviceWidth * 0.1,
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
  icon: {
    position: "absolute",
    right: 10,
  },
  iconWithBackButton: {
    right: -(deviceWidth * 0.06 + 8),
  },
});

export default Header;
