import 'server-only'
import { algodClient, contract } from "@/utils/algod-client";
import { hasContractOptedIn } from "@/utils/get-asset-details";
import algosdk from "algosdk";

export async function signSendTransactions(assetID: number, amount: number, signerAddress: string, signTransactions: Function, sendTransactions: Function, signer: algosdk.TransactionSigner) {
    try {
        // Check if smart contract has opted in
        let optedIn = await hasContractOptedIn(process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!, assetID);

        // If not opt in
        if (!optedIn) {
            // Send funds
            const suggestedParams = await algodClient.getTransactionParams().do();
            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                amount: amount,
                from: signerAddress,
                to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                assetIndex: assetID
            });

            let signedTransactions = await signTransactions([txn.toByte()]);
            await sendTransactions(signedTransactions, 4);
            console.log("Done!");
        } else {
            const suggestedParams = await algodClient.getTransactionParams().do();
            const atc = new algosdk.AtomicTransactionComposer();
            atc.addMethodCall({
                appID: Number.parseInt(process.env.NEXT_PUBLIC_APP_ID!),
                method: contract.getMethodByName("opt_in"),
                appForeignAssets: [assetID],
                methodArgs: [
                    assetID
                ],
                sender: signerAddress,
                signer: signer,
                suggestedParams
            });

            const txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
                suggestedParams,
                amount: amount,
                from: signerAddress,
                to: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
                assetIndex: assetID
            });
            atc.addTransaction({txn, signer});
            await atc.execute(algodClient, 4);
            console.log("Done!");
        }
    } catch(err) {
        console.log("Error Signing =>", err);
        throw new Error("Could Not Sign");
    }
}