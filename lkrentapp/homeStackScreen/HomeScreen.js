import React , {useState} from "react";
import { ScrollView, View, Image, StyleSheet, Text, Pressable, Alert } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import SearchBar from "../components/SearchBar"

function HeartIcon() {
 

  return (
    <Pressable
    onPress={() => Alert.alert('Heart icon pressed')}
    >
      <Ionicons
        name= {"heart-outline"}
        size={24}
        color={"black"}
        style={styles.icon}
      />
    </Pressable>
  );
}


export default function HomeScreen() {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentScrollView}
    >
      <View style={styles.headerHome}>
        <Image
          source={require("../assets/lkrentlogo.png")}
          style={styles.headerImage}
        />
        <Text style={styles.headerText}>
          Welcome,{"\n"}Phan Phi Long
        </Text>
        <View style={styles.iconContainer}>
         <HeartIcon/>
          <Pressable onPress={() => Alert.alert('Gift icon pressed')}>
            <Ionicons name="gift-outline" size={24} color="black" style={styles.icon} />
          </Pressable>
        </View>
      </View>
      <SearchBar />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentScrollView: {
    flex: 1,
  },
  headerHome: {
    paddingTop: 80,
    paddingLeft: 20,
    paddingRight: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerText: {
    fontSize: 18,
    fontWeight: "heavy",
    paddingLeft: 10,
    flex: 1,
  },
  headerImage: {
    height: 60,
    width: 60,
    borderRadius: 30,
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    marginLeft: 18,
  },
});
