// Convert Uint8Array to Base64 string
export const uint8ArrayToBase64 = (uint8Array: Uint8Array) => {
  return btoa(String.fromCharCode.apply(null, Array.from(uint8Array)));
};

export const uint8ArrayToString = (uint8Array: Uint8Array): string => {
  try {
    let utf8String = '';
    for (let i = 0; i < uint8Array.length; i++) {
      utf8String += String.fromCharCode(uint8Array[i]);
    }
    return decodeURIComponent(escape(utf8String));
  } catch (e) {
    console.log('Error uint8ArrayToString', e);
    return undefined;
  }
};

// Convert Base64 string to Uint8Array
export const base64ToUint8Array = (base64: string) => {
  try {
    return new Uint8Array(
      atob(base64)
        .split('')
        .map((char) => char.charCodeAt(0)),
    );
  } catch (e) {
    console.log('Error base64ToUint8Array', e);
  }
};
// Convert UTF-8 string to Uint8Array

export const utf8StringToUint8Array = (utf8String: string, length = 32): Uint8Array => {
  try {
    const encoder = new TextEncoder();
    let encodedArray = encoder.encode(utf8String);

    if (encodedArray.length > length) {
      // Truncate the array if it's longer than the desired length
      encodedArray = encodedArray.slice(0, length);
    } else {
      // Pad the array with zeros if it's shorter than the desired length
      const padding = new Uint8Array(length - encodedArray.length);
      encodedArray = new Uint8Array([...encodedArray, ...padding]);
    }

    const keypair = encodedArray;
    return keypair;
  } catch (e) {
    console.log('Error utf8StringToUint8Array', e);
    return undefined;
  }
};

export const uint8ArrayToHex = (uint8Array: Uint8Array): string | undefined => {
  try {
    return Array.from(uint8Array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  } catch (e) {
    return undefined;
  }
};
