import React, { useEffect} from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import CarCard from '../components/CarCard';
import { useNavigation } from '@react-navigation/native';
import { useSelector ,useDispatch } from "react-redux";
import { getPromotions } from "../store/promotionSlice";
import { fetchSearchingCars } from "../store/carListSlice";




const FavoriteCarsScreen = () => {
  const navigation = useNavigation();
  const user = useSelector(state => state.loggedIn.user);
  const promotions = useSelector((state) => state.promotions.promotions);
  console.log(promotions)
  const dispatch = useDispatch()


  const favoriteCars = useSelector((state) => state.carsList.searching);

  useEffect(() => {
    dispatch(getPromotions());
    dispatch(fetchSearchingCars(user ? user.id : null));
  }, [user, dispatch]);



  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <CarCard carInfo={item} promotions={promotions} navigation={navigation}  />
    </View>
  );

  return (
    <View style={styles.container}>
      {favoriteCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="heart-o" size={48} color="#03a9f4" />
          <Text style={styles.emptyText}>Bạn không có xe yêu thích</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteCars}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

export default FavoriteCarsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContainer: {
    paddingTop: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#757575',
  },
});
