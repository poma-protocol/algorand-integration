import algosdk from "algosdk";

interface AssetInfo {
    name: string,
    unit: string,
    decimals: number
}

export async function hasContractOptedIn(algodClient: algosdk.Algodv2, address: string, assetID: number): Promise<boolean> {
    try {
        const contractInfo = await algodClient.accountAssetInformation(address, assetID).do();
        return true;
    } catch(err) {
        if (err instanceof Error) {
            if (err.message.includes("asset info not found")) {
                return false;
            }
        }
        throw new Error("Could Not Check If Contract Has Opted In");
    }
}

export async function getAssetDetails(algodClient: algosdk.Algodv2, assetID: number): Promise<AssetInfo> {
    try {
        const assetInfo = await algodClient.getAssetByID(assetID).do();
        return {
            name: assetInfo.params.name,
            unit: assetInfo.params['unit-name'],
            decimals: assetInfo.params.decimals
        }
    } catch(err) {
        console.log("Error Getting Asset Details =>", err);
        throw new Error("Could Not Get Asset Details")
    }
}