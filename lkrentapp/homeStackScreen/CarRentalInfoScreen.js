import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import CarRentalInfo from '../homeStackScreen/CarConfirmComponent/CarRentalInfo'; 
import MessageComponent from './CarConfirmComponent/MessageComponent';
import UserProfile from './CarDetailComponent/UserProfileDetail';
import PricingTable from './CarConfirmComponent/PricingTable';
import FooterComponent from './CarConfirmComponent/FooterComponent'; 
import { DocumentComponent } from './CarDetailScreen';
import CollateralComponent from './CarDetailComponent/CollateralComponent';
const CarRentalInfoScreen = ({ route, navigation }) => {
  const { carInfo, time } = route.params;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        <CarRentalInfo carInfo={carInfo} time={time} navigation={navigation} showCarDetail={true}/>
        <UserProfile carInfo={carInfo} showStats={false} />
        <MessageComponent />
        <PricingTable />
        <DocumentComponent />
        <CollateralComponent />
      </ScrollView>
      <FooterComponent carInfo={carInfo} time={time}  navigation={navigation}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollViewContent: {
    paddingBottom: 136, // make space for the footer
  },
});

export default CarRentalInfoScreen;
