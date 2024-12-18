import algosdk from "algosdk";
import "dotenv/config";
import { contract as raw } from "./contract.json";
// Creating a client
const algodToken = ''; // free service does not require tokens
const algodServer = process.env.NEXT_PUBLIC_ALGORAND_SERVER;
const algodPort = process.env.NEXT_PUBLIC_ALGORAND_SERVER_PORT;

// Create an instance of the algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);



// Seems that our JSON has alot more details than necessary and we only need the contract part of it
export const contract = new algosdk.ABIContract(raw);
export const pomaAccount = algosdk.mnemonicToSecretKey(process.env.MNEMONIC);
export const pomaAccountSigner = algosdk.makeBasicAccountTransactionSigner(pomaAccount)