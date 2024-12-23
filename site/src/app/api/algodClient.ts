import algosdk from "algosdk";

const algodToken = "";
const algodServer = process.env.ALGORAND_SERVER!;
const algodPort = process.env.ALGORAND_SERVER_PORT!;

const algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);
export default algodClient;