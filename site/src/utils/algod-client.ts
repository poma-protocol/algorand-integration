import algosdk from "algosdk";

// Creating a client
const algodToken = ''; // free service does not require tokens
const algodServer = process.env.NEXT_PUBLIC_ALGORAND_SERVER!;
const algodPort = process.env.NEXT_PUBLIC_ALGORAND_SERVER_PORT!;

console.log(algodServer, algodPort);

// Create an instance of the algod client
export const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);