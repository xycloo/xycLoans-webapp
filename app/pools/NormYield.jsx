import { StrKey } from "stellar-sdk";
import { getTotNormYield } from "./getYield";

export default async function NormYield(props) {
    /*
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    */
    
    //const contract = fromStringToKey(props.contractId.slice(2))
    
    const normYield = await getTotNormYield(props.contractId, props.yieldData, props.radix)
    
    //if norm yield is 0, it return 0 and not NaN
    let printedNormYield
    if (isNaN(normYield)) {
        printedNormYield = 0
    } else {printedNormYield = normYield}    

   return ( printedNormYield.toFixed(4) )
}