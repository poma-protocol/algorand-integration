import { algodClient } from "./algod-client";

interface AssetInfo {
    name: string,
    unit: string
}

export async function getAssetDetails(assetID: number): Promise<AssetInfo> {
    try {
        const assetInfo = await algodClient.getAssetByID(assetID).do();
        return {
            name: assetInfo.params.name,
            unit: assetInfo.params['unit-name']
        }
    } catch(err) {
        console.log("Error Getting Asset Details =>", err);
        throw Error("Could Not Get Asset Details")
    }
}