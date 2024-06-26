import axios from 'axios';

export const getCoordinates = async (address, apiKey) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?country=VN&language=vi&access_token=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.features.length > 0) {
      const { matching_place_name, text, place_type, center } = response.data.features[0];
      const [longitude, latitude] = center;
      return { name: matching_place_name, latitude, longitude, text: text, place_type: place_type };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};


export const autoComplete = async (input, apiKey, location) => {
  const url = `https://rsapi.goong.io/Place/AutoComplete?api_key=${apiKey}&location=${encodeURIComponent(location)}&more_compound=true&radius=50&input=${encodeURIComponent(input)}`;

  try {
    const response = await axios.get(url);
    if (response.data.predictions.length > 0) {
      return response.data.predictions.map(prediction => ({
        description: prediction.description,
        placeId: prediction.place_id,
        matchedSubstrings: prediction.matched_substrings,
        structuredFormatting: prediction.structured_formatting,
        terms: prediction.terms,
        types: prediction.types
      }));
    } else {
      throw new Error('No autocomplete suggestions found');
    }
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return [];
  }
};

export const getGeocode = async (latitude, longitude,api_key) => {
  const url = `https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=${api_key}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.results && response.data.results.length > 0) {
      const formattedAddress = response.data.results[0].formatted_address;
      return reformatAddress(formattedAddress);
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Error fetching geocode:', error);
    return null;
  }
};

const reformatAddress = (address) => {
  const regex = /^(\d+)\sHẻm\s(\d+)\s(.*)/;
  const match = address.match(regex);

  if (match) {
    const houseNumber = match[1];
    const alleyNumber = match[2];
    const streetName = match[3];
    return `${alleyNumber}/${houseNumber} ${streetName}`;
  }

  return address;
};
