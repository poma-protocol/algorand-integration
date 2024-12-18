import algosdk from "algosdk";
import "dotenv/config";
import { algodClient, contract, pomaAccount, pomaAccountSigner } from "./algoClient";
import { isLowFundsErr } from "./helpers";
interface sendRewardArgs {
    amount: number,
    receiver: string,
    assetId: number
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
                    assetId
                ],
                sender: pomaAccount.addr,
                signer: pomaAccountSigner,
                suggestedParams,
                appForeignAssets: [assetId]
            })
            const txn = await atc.execute(this.algoClient, 4)

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
                    args.amount,
                    args.receiver,
                    args.assetId
                ],
                sender: pomaAccount.addr,
                signer: pomaAccountSigner,
                suggestedParams,
                appForeignAssets: [args.assetId]
            })
            const txn = await atc.execute(this.algoClient, 4)
        }
        catch (error) {
            if (isLowFundsErr(error)) {
                throw new Error("Low funds in the account")
            }
            throw new Error(`Error while sending reward: ${error}`)
        }
    }
    async sendAlgoReward(amount: number, receiver: string) {
        try {
            const suggestedParams = await this.algoClient.getTransactionParams().do();
            const atc = new algosdk.AtomicTransactionComposer();
            atc.addMethodCall({
                appID: Number.parseInt(process.env.APP_ID),
                method: contract.getMethodByName("send_algo_reward"),
                methodArgs: [
                    amount,
                    receiver
                ],
                sender: pomaAccount.addr,
                signer: pomaAccountSigner,
                suggestedParams
            })
            const txn = await atc.execute(this.algoClient, 4)

        }
        catch (error) {
            throw new Error(`Error while sending ALGO reward: ${error}`)
        }
    }

}
const smartContract = new SmartContract(algodClient);
export default smartContract;