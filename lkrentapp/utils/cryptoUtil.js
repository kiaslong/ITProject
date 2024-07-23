import * as Crypto from 'expo-crypto';

const PASSWORD_SECRET = process.env.PASSWORD_SECRET || 'default_secret';

export const encryptPassword = async (password) => {
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password + PASSWORD_SECRET,
    { encoding: Crypto.CryptoEncoding.HEX }
  );
  return hash;
};
