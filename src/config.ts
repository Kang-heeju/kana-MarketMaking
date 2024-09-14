import { AptosAccount } from "@kanalabs/trade/node_modules/aptos";
import * as dotenv from "dotenv";

dotenv.config();

export const account0 = AptosAccount.fromAptosAccountObject({
  address: process.env.APTOS_ADDRESS || "",
  privateKeyHex: process.env.APTOS_PRIVATEKEY || "",
});

export const account1 = AptosAccount.fromAptosAccountObject({
  address: process.env.APTOS_ADDRESS1 || "",
  privateKeyHex: process.env.APTOS_PRIVATEKEY1 || "",
});

export const account2 = AptosAccount.fromAptosAccountObject({
  address: process.env.APTOS_ADDRESS2 || "",
  // publicKeyHex: process.env.APTOS_PUBLICKEY2 || "",
  privateKeyHex: process.env.APTOS_PRIVATEKEY2 || "",
});

// export const account3 = AptosAccount.fromAptosAccountObject({
//   address: process.env.APTOS_ADDRESS3 || "",
//   // publicKeyHex: process.env.APTOS_PUBLICKEY3 || "",
//   privateKeyHex: process.env.APTOS_PRIVATEKEY3 || "",
// });

// export const account4 = AptosAccount.fromAptosAccountObject({
//   address: process.env.APTOS_ADDRESS4 || "",
//   // publicKeyHex: process.env.APTOS_PUBLICKEY4 || "",
//   privateKeyHex: process.env.APTOS_PRIVATEKEY4 || "",
// });

// export const account5 = AptosAccount.fromAptosAccountObject({
//   address: process.env.APTOS_ADDRESS5 || "",
//   // publicKeyHex: process.env.APTOS_PUBLICKEY5 || "",
//   privateKeyHex: process.env.APTOS_PRIVATEKEY5 || "",
// });
