import algosdk from "algosdk";
import "dotenv/config";
import { algodClient, contract, pomaAccount, pomaAccountSigner } from "./algoClient";
import { isLowFundsErr } from "./helpers";
interface sendRewardArgs {
    amount: number,
    receiver: string,
    assetId: string
}
export class SmartContract {
    algoClient: algosdk.Algodv2

    constructor(client: algosdk.Algodv2) {
        this.algoClient = client;
    }
    async optIn(assetId: number) {
        try {
            const suggestedParams = await this.algoClient.getTransactionParams().do();
            const atc = new algosdk.AtomicTransactionComposer();
            atc.addMethodCall({
                appID: Number.parseInt(process.env.APP_ID),
                method: contract.getMethodByName("opt_in"),
                methodArgs: [
                    algosdk.encodeUint64(assetId)
                ],
                sender: pomaAccount.addr,
                signer: pomaAccountSigner,
                suggestedParams
            })
        }
        catch (error) {
            throw new Error(`Error while opting in: ${error}`)
        }
    }
    async sendReward(args: sendRewardArgs) {
        try {
            const suggestedParams = await this.algoClient.getTransactionParams().do();
            const atc = new algosdk.AtomicTransactionComposer();
            atc.addMethodCall({
                appID: Number.parseInt(process.env.APP_ID),
                method: contract.getMethodByName("send_reward"),
                methodArgs: [
                    algosdk.encodeUint64(args.amount)
                ],
                sender: pomaAccount.addr,
                signer: pomaAccountSigner,
                suggestedParams
            })
        }
        catch (error) {
            if (isLowFundsErr(error)) {
                throw new Error("Low funds in the account")
            }
            throw new Error(`Error while sending reward: ${error}`)
        }
    }

}