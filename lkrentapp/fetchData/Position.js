import axios from 'axios';

const getCoordinates = async (address, country, apiKey) => {
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)},${encodeURIComponent(country)}.json?access_token=${apiKey}`;

  
  try {
    const response = await axios.get(url);
    if (response.data.features.length > 0) {
      const { place_name, center } = response.data.features[0];
      const [longitude, latitude] = center;
      return { name: place_name, latitude, longitude };
    } else {
      throw new Error('Location not found');
    }
  } catch (error) {
    console.error('Error fetching coordinates:', error);
    return null;
  }
};

export default getCoordinates;
