import { Uint256, uint256 } from "starknet";

export function pubkeyToUint256(pubkey: string): Uint8Array {
  // Ensure the public key is 64 hexadecimal characters (32 bytes)
  if (pubkey.length !== 64) {
    throw new Error("Invalid public key length");
  }

  // Convert the hex string to a Uint8Array
  const uint256 = new Uint8Array(Buffer.from(pubkey, "hex"));

  return uint256;
}

// Convert a Nostr public key (hex string) into a Uint256 for Cairo
export function nostrPubkeyToUint256(pubkey: string): Uint256 {
  // Ensure the public key is 64 hexadecimal characters (32 bytes)
  if (pubkey.length !== 64) {
    throw new Error("Invalid public key length");
  }

  // Convert the hex string to a Uint8Array
  const uint8Array = new Uint8Array(Buffer.from(pubkey, "hex"));

  // Split the Uint8Array into two 128-bit segments
  const lowBytes = uint8Array.slice(16); // Last 16 bytes
  const highBytes = uint8Array.slice(0, 16); // First 16 bytes

  // Convert the 128-bit segments into BigInt
  const low = BigInt("0x" + Buffer.from(lowBytes).toString("hex"));
  const high = BigInt("0x" + Buffer.from(highBytes).toString("hex"));

  return { low, high };
}



// // Define the function to convert a hex string to Uint256
export function hexStringToUint256(hexString: string) {
  // Remove the leading '0x' if present
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }

  // // Ensure the hex string is 64 characters (32 bytes) long
  // if (hexString.length !== 64) {
  //   throw new Error('Invalid hex string length');
  // }

  // Split the string into two 128-bit parts (16 bytes each)
  const highHex = hexString.slice(0, 32);
  const lowHex = hexString.slice(32);

  // Convert the hex parts to BigInt
  const high = BigInt('0x' + highHex);
  const low = BigInt('0x' + lowHex);

  // Create the Uint256 object
  const uint256Value = uint256.bnToUint256(low + (high << BigInt(128)));

  return uint256Value;
}

export function stringToUint8Array(str: string): Uint8Array {
  // Create a Uint8Array with a length of 32
  const uint8Array = new Uint8Array(32);
  
  // Fill the array with the string characters converted to their corresponding ASCII values
  for (let i = 0; i < str.length; i++) {
    uint8Array[i] = str.charCodeAt(i);
  }
  
  // Return the filled Uint8Array
  return uint8Array;
}


// /**
//  * Converts a string to a Uint256 format suitable for Cairo contracts.
//  * If the string is shorter than 64 hex characters, it will be padded with leading zeros.
//  *
//  * @param {string} str - The input string.
//  * @returns {{ low: string, high: string }} - The Uint256 representation.
//  */
// export function stringToUint256(str: string): Uint256{
//   // Convert the string to a hexadecimal representation
//   let hexString = Buffer.from(str, 'utf8').toString('hex');

//   // Ensure the hex string is 64 characters long (32 bytes)
//   hexString = hexString.padStart(64, '0');

//   // Split the string into two 128-bit parts (16 bytes each)
//   const highHex = hexString.slice(0, 32);
//   const lowHex = hexString.slice(32);

//   // Convert the hex parts to BigInt
//   const high = BigInt('0x' + highHex);
//   const low = BigInt('0x' + lowHex);

//   // Create the Uint256 object
//   const uint256Value = uint256.bnToUint256(low + (high << BigInt(128)));

//   return uint256Value;
// }
