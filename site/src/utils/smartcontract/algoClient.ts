import algosdk from "algosdk";
import "dotenv/config";
import fs from "fs";

// Creating a client
const algodToken = ''; // free service does not require tokens
const algodServer = process.env.ALGORAND_SERVER;
const algodPort = process.env.ALGORAND_SERVER_PORT;

// Create an instance of the algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const abi = JSON.parse(
    fs.readFileSync("./contract.json", 'utf8')
);

// Seems that our JSON has alot more details than necessary and we only need the contract part of it
export const contract = new algosdk.ABIContract(abi.contract);
export const pomaAccount = algosdk.mnemonicToSecretKey(process.env.MNEMONIC);
export const pomaAccountSigner = algosdk.makeBasicAccountTransactionSigner(pomaAccount)