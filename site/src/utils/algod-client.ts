import algosdk from "algosdk";
import {contract as raw} from "../../contractAbi.json";
export const contract = new algosdk.ABIContract(raw);
