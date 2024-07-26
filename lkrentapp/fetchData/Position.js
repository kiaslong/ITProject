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

export const getGeocode = async (latitude, longitude, apiKey) => {
  const url = `https://rsapi.goong.io/Geocode?latlng=${latitude},${longitude}&api_key=${apiKey}`;
  
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

export const getGeocodeByAddress = async (address, apiKey) => {
  const url = `https://rsapi.goong.io/geocode?address=${encodeURIComponent(address)}&api_key=${apiKey}`;
  
  try {
    const response = await axios.get(url);
    if (response.data.results && response.data.results.length > 0) {
      const { formatted_address, geometry } = response.data.results[0];
      const { lat, lng } = geometry.location;
      return { address: formatted_address, latitude: lat, longitude: lng };
    } else {
      throw new Error('No address found');
    }
  } catch (error) {
    console.error('Error fetching geocode by address:', error);
    return null;
  }
};


export const getRoute = async (origin, destination, apiKey) => {
  
  const url = `https://rsapi.goong.io/trip?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&vehicle=car&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data && response.data.trips && response.data.trips.length > 0) {
      const { distance, duration, geometry, legs } = response.data.trips[0];
      return { distance, duration, geometry, legs };
    } else {
      throw new Error('Route not found');
    }
  } catch (error) {
    console.error('Error fetching route:', error);
    return null;
  }
};


export const getDirection = async (origin, destination, apiKey) => {
  const url = `https://rsapi.goong.io/Direction?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&vehicle=car&api_key=${apiKey}`;

  try {
    const response = await axios.get(url);
    
    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const overview_polyline = response.data.routes[0].overview_polyline;
      return { geometry : overview_polyline.points };
    } else {
      throw new Error('Direction not found');
    }
  } catch (error) {
    console.error('Error fetching direction:', error);
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
