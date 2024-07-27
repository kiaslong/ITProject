import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import debounce from 'lodash.debounce';
import { autoComplete, getGeocodeByAddress } from '../../fetchData/Position'; // Adjust the import path

const AddressPickerModal = ({ visible, onClose, onSelect, items, title, initialAddress }) => {
  const [step, setStep] = useState(0);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedWard, setSelectedWard] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);

  const flatListRef = useRef(null);
  const apiKey = process.env.GOONG_KEY_3; // Replace with your actual API key
  const apiKey_2 = process.env.GOONG_KEY_2;

  const findItemByNameWithType = (nameWithType, items) => {
    return items.find(item => item.name_with_type === nameWithType);
  };

  useEffect(() => {
    if (visible && initialAddress) {
      const city = findItemByNameWithType(initialAddress.city, items.cities);
      if (city) {
        setSelectedCity(city);
        if (initialAddress.district) {
          const district = findItemByNameWithType(initialAddress.district, Object.values(city['quan-huyen']));
          if (district) {
            setSelectedDistrict(district);
            if (initialAddress.ward) {
              const ward = findItemByNameWithType(initialAddress.ward, Object.values(district['xa-phuong']));
              if (ward) {
                setSelectedWard(ward);
                setStep(3);
              } else {
                setStep(2);
              }
            } else {
              setStep(2);
            }
          } else {
            setStep(1);
          }
        } else {
          setStep(1);
        }
      } else {
        setStep(0);
      }
      const street = initialAddress.street || '';
      const firstPartOfStreet = street.split(',')[0].trim();
      setSearch(firstPartOfStreet);
    } else {
      resetState();
    }
  }, [visible, initialAddress]);

  const resetState = () => {
    setStep(0);
    setSelectedCity(null);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSearch('');
    setFilteredItems([]);
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setSearch('');
    setStep(1);
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setSearch('');
    setStep(2);
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  const handleWardSelect = (ward) => {
    setSelectedWard(ward);
    setSearch('');
    setStep(3);
    flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
  };

  const handleStreetSelect = (suggestion) => {
    const street = suggestion.structured_formatting?.main_text || suggestion.description;
    onSelect({ street, city: selectedCity, district: selectedDistrict, ward: selectedWard });
    onClose();
    resetState();
  };

  const debouncedAutoComplete = useMemo(
    () =>
      debounce(async (input) => {
        if (input.length > 0) {
          setLoading(true);
          try {
            const location = `${selectedWard?.name_with_type || ''}, ${selectedDistrict?.name_with_type || ''}, ${selectedCity?.name_with_type || ''}`;
            const geocodeResult = await getGeocodeByAddress(location, apiKey_2);

            if (geocodeResult && geocodeResult.latitude && geocodeResult.longitude) {
              const suggestions = await autoComplete(input, apiKey, `${geocodeResult.latitude},${geocodeResult.longitude}`);

              const sortedSuggestions = suggestions.sort((a, b) => {
                const aMatch = a.description.includes(location);
                const bMatch = b.description.includes(location);
                if (aMatch && !bMatch) return -1;
                if (!aMatch && bMatch) return 1;
                return 0;
              });

              setSuggestions(sortedSuggestions);
            } else {
              setSuggestions([]);
            }
          } catch (error) {
            console.error(error);
            setSuggestions([]);
          } finally {
            setLoading(false);
          }
        } else {
          setSuggestions([]);
        }
      }, 500),
    [apiKey, apiKey_2, selectedCity, selectedDistrict, selectedWard]
  );

  useEffect(() => {
    if (step === 3) {
      debouncedAutoComplete(search);
    }
    return () => debouncedAutoComplete.cancel();
  }, [search, debouncedAutoComplete, step]);

  useEffect(() => {
    switch (step) {
      case 0:
        setFilteredItems(items.cities.filter(city => city.name_with_type.toLowerCase().includes(search.toLowerCase())));
        break;
      case 1:
        setFilteredItems(Object.values(selectedCity['quan-huyen']).filter(district => district.name_with_type.toLowerCase().includes(search.toLowerCase())));
        break;
      case 2:
        setFilteredItems(Object.values(selectedDistrict['xa-phuong']).filter(ward => ward.name_with_type.toLowerCase().includes(search.toLowerCase())));
        break;
      default:
        setFilteredItems([]);
        break;
    }
  }, [search, step, items, selectedCity, selectedDistrict]);

  const renderItems = () => {
    if (step === 3) {
      return suggestions.map(suggestion => ({ ...suggestion, type: 'street' }));
    } else {
      return filteredItems.map(item => ({ ...item, type: step === 0 ? 'city' : step === 1 ? 'district' : 'ward' }));
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.touchableItem}
      onPress={() => {
        if (item.type === 'city') handleCitySelect(item);
        else if (item.type === 'district') handleDistrictSelect(item);
        else if (item.type === 'ward') handleWardSelect(item);
        else if (item.type === 'street') handleStreetSelect(item);
      }}
    >
      <Text style={styles.itemText}>{item.name_with_type || item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{title}</Text>
          {step > 0 && (
            <View style={styles.navigationContainer}>
              {step > 0 && (
                <TouchableOpacity onPress={() => {setStep(0); setSearch('')}} style={styles.navigationButton}>
                  <Text style={styles.navigationButtonText}>{selectedCity.name_with_type}</Text>
                </TouchableOpacity>
              )}
              {step > 1 && (
                <TouchableOpacity onPress={() => {setStep(1); setSearch('')}} style={styles.navigationButton}>
                  <Text style={styles.navigationButtonText}>{selectedDistrict.name_with_type}</Text>
                </TouchableOpacity>
              )}
              {step > 2 && (
                <TouchableOpacity onPress={() => {setStep(2); setSearch('')}} style={styles.navigationButton}>
                  <Text style={styles.navigationButtonText}>{selectedWard.name_with_type}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          {(step === 0 || step === 1 || step === 2) && (
            <View style={styles.searchContainer}>
              <Ionicons name="search-outline" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder={step === 0 ? "Tìm thành phố" : step === 1 ? "Tìm quận/huyện" : "Tìm xã/phường"}
                style={styles.input}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          )}
          {step === 3 && (
            <View style={styles.searchContainer}>
              <Ionicons name="location-outline" size={24} color="black" style={styles.icon} />
              <TextInput
                placeholder="Nhập địa chỉ đường phố"
                style={styles.input}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          )}
          {loading ? (
            <ActivityIndicator style={styles.loading} size="large" color="#03a9f4" />
          ) : (
            <FlatList
              ref={flatListRef}
              data={renderItems()}
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              style={styles.list}
              onScrollBeginDrag={Keyboard.dismiss}
            />
          )}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#03a9f4',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  navigationContainer: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    marginBottom: 10,
  },
  navigationButton: {
    backgroundColor: '#03a9f4',
    paddingVertical: 5,
    marginBottom:10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  list: {
    maxHeight: '76%',
  },
  touchableItem: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 14,
    marginBottom: 25,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  loading: {
    marginTop: 30,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#03a9f4',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddressPickerModal;
