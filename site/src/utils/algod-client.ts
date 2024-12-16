import 'server-only';
import algosdk from "algosdk";
import fs from "fs";

// Creating a client
const algodToken = ''; // free service does not require tokens
const algodServer = process.env.NEXT_PUBLIC_ALGORAND_SERVER ?? "https://testnet-api.4160.nodely.dev";
const algodPort = process.env.NEXT_PUBLIC_ALGORAND_SERVER_PORT ?? "443";

// Create an instance of the algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

const abi = JSON.parse(
    fs.readFileSync("./contractAbi.json", 'utf8')
);

// Seems that our JSON has alot more details than necessary and we only need the contract part of it
export const contract = new algosdk.ABIContract(abi.contract);
