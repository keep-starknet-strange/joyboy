import {Platform} from 'react-native';

import {
  ARGENT_APP_STORE_URL,
  ARGENT_APP_STORE_URL_FALLBACK,
  ARGENT_GOOGLE_PLAY_URL,
  ARGENT_GOOGLE_PLAY_URL_FALLBACK,
} from '../constants/urls';

export const getOperatingSystem = (): Platform['OS'] => {
  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  if (/windows phone/i.test(userAgent)) {
    return 'windows';
  }

  if (/android/i.test(userAgent)) {
    return 'android';
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return 'ios';
  }

  return 'web';
};

export const getArgentAppStoreURL = () => {
  const mobilePlatform = Platform.OS;
  if (mobilePlatform === 'ios') return ARGENT_APP_STORE_URL;
  if (mobilePlatform === 'android') return ARGENT_GOOGLE_PLAY_URL;

  const webPlatform = getOperatingSystem();
  if (webPlatform === 'ios') return ARGENT_APP_STORE_URL_FALLBACK;
  if (webPlatform === 'android') return ARGENT_GOOGLE_PLAY_URL_FALLBACK;

  // Fallback to Google Play URL
  return ARGENT_GOOGLE_PLAY_URL_FALLBACK;
};

export const decimalsScale = (decimals: number) => `1${Array(decimals).fill('0').join('')}`;

export const shortenPubkey = (pubkey?: string, length = 6) =>
  pubkey ? `${pubkey.slice(0, length)}...${pubkey.slice(-length)}` : undefined;

export const dataURLToBlob = (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], {type: mimeString});
};

export const getImageRatio = (width: number, height: number, minRatio = 0.75, maxRatio = 1.5) => {
  return Math.max(minRatio, Math.min(maxRatio, width / height));
};
