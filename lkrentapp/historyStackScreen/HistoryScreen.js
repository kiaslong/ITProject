import React, { useEffect } from 'react';
import { StyleSheet, View, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import HistoryListItem from "../components/HistoryListItem";
import { registerFunction, unregisterFunction } from '../store/functionRegistry';

export default function HistoryScreen() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setParams({
      showIcon: true,
      iconName: "calendar",
      functionName: "calendarPress"
    });
  }, [navigation]);

  useEffect(() => {
    const key = 'calendarPress';
    const onPress = () => { console.log("Chao cac ban") };

    registerFunction(key, onPress);

    return () => {
      unregisterFunction(key);
    };
  }, [navigation]);

  const history = [
    {
      id: "LK1",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7KjZI8Jy7VCoVeRp-aOpaIe9T9lzQPUW2zQ&s",
      carName: "BMW",
      timeEnd: "1/2/2024",
      timeStart: "2/2/2024",
      status: "Thành công",
      timeRemain: "1 ngày",
    },
  ];

  // const handlePress = () => {
  //   navigation.navigate("CarRentalOrder", {
  //     carInfo,
  //     time,
  //     animationType: "slide_from_bottom",
  //   });
  // };


  

  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={3}
        data={history}
        style={styles.list}
        renderItem={({ item }) => <HistoryListItem history={item} onPress={ () => { console.log("Chao cac ban") }} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  list: {
    width: "100%",
  },
});
