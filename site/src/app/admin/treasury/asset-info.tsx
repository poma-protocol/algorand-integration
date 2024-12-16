import { getAssetDetails } from "../../../utils/get-asset-details";

export default async function AssetInfo(props: {assetID?: number}) {
    if (props.assetID !== undefined && props.assetID !== 0) {
        return <div></div>
    } else {
        // get info on asset
        let info = await getAssetDetails(props.assetID!);
        
        return <div>
            <p>{info.name} ({info.unit})</p>
        </div>
    }
}