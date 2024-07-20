import RNFS from 'react-native-fs';
import pako from 'pako';

const readCompressedJson = async (filePath) => {
  try {
    // Read the compressed file
    const compressedData = await RNFS.readFile(filePath, 'base64');

    // Convert base64 string to binary string
    const binaryString = Buffer.from(compressedData, 'base64').toString('binary');

    // Convert binary string to Uint8Array
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    // Decompress the binary data using pako
    const decompressedData = pako.inflate(binaryData, { to: 'string' });

    // Parse the JSON string
    const jsonData = JSON.parse(decompressedData);

    return jsonData;
  } catch (error) {
    console.error('Error reading compressed JSON:', error);
    return null;
  }
};

export default readCompressedJson;
