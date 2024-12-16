import { getAssetDetails } from "@/utils/get-asset-details";
import { useEffect, useState } from "react"

export default function AssetInfo(props: { assetID?: number }) {
    let [name, setName] = useState<string>("");
    let [unit, setUnit] = useState<string>("")
    useEffect(() => {
        (async () => {
            if (props.assetID !== undefined && props.assetID !== 0) {
                let details = await getAssetDetails(props.assetID);
                setName(details.name);
                setUnit(details.unit);
            }
        })();
    }, []);

    return <div>
        {props.assetID === 0 || props.assetID === undefined
            ? <div></div>
            : <div>
                <p>{name}({unit})</p>
            </div>}
    </div>
}