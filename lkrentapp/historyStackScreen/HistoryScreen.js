import React , { useEffect } from 'react';
import { StyleSheet,  View, FlatList } from "react-native";
import { useNavigation } from '@react-navigation/native';
import HistoryListItem from "../components/HistoryListItem";
import { registerFunction , unregisterFunction  } from '../store/functionRegistry';


export default function HistoryScreen() {
  const navigation = useNavigation();
    
  useEffect(() => {
    navigation.setParams({
      showIcon:true,
      iconName:"calendar",
      functionName:"calendarPress"
    });
  }, [navigation]);


  useEffect(() => {
    const key = 'calendarPress';
    const onPress = () => {console.log("Chao cac ban ")} ;

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
    {
      id: "LK2",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcShqf-xMwqSf5SMFyMrqx49oqz9UrUe2fNmfg&s",
      carName: "Lamborghini",
      timeEnd: "1/1/2024",
      timeStart: "2/1/2024",
      status: "Thành công",
      timeRemain: "1 ngày",
    },
    {
      id: "LK3",
      image: "https://hondaotobinhdinh.com.vn/wp-content/uploads/2023/10/576995-un-honda-cr-v-hybride-moins-cher-s-ajoute-a-la-gamme.jpg",
      carName: "Honda",
      timeEnd: "1/1/2024",
      timeStart: "2/1/2024",
      status: "Thành công",
      timeRemain: "1 ngày",
    },
  ];

  return (
    <View style={styles.container}>
      <FlatList
        initialNumToRender={3}
        data={history}
        style={styles.list}
        renderItem={({ item }) => <HistoryListItem history={item} />}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop:10,
    paddingHorizontal: 10,
  },
  list: {
    width: "100%",
  },
});
