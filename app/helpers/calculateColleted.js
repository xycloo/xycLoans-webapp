import { StrKey, xdr } from "stellar-sdk";
import { stroopsToXLM } from "../pools/getPools";


export default function CalculateCollected(publicKey, allEvents, id) {
    const toHex = (b64) => {
        const buffer = Buffer.from(b64, 'base64');
        return buffer.toString('hex')
    }
    
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${toHex(key)}`))
    )
    
    const topic_scval = xdr.ScVal.scvSymbol("collect").toXDR('base64');
    const address_scval = xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(xdr.PublicKey.publicKeyTypeEd25519(StrKey.decodeEd25519PublicKey(publicKey)))).toXDR("base64")

    let total_collected = 0.0;
    for (let event of allEvents) {
        let contractStrkey = fromStringToKey(event.contract)
        if (contractStrkey === id && event.topic1 === topic_scval && event.topic2 === address_scval) {
            const i128 = xdr.ScVal.fromXDR(event.data, "base64").i128();
            //console.log(i128)
            total_collected += parseInt((BigInt(i128._attributes.hi._value.toString()) << BigInt(64)) + BigInt(i128._attributes.lo._value.toString()));
        }
    }
    const float_tot_collected = stroopsToXLM(total_collected, 4)

    return (
        float_tot_collected
    )
}