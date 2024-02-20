import { StrKey } from "stellar-sdk";
import List from "../../xycloans-list.json";

export const getAssetLogo = (contract) => {
    const object = List.verified.find(o => o.contract === contract);
    console.log("get asset id logo", object)
    if (object !== undefined) {
       return object.asset.logo
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.asset.logo
        } else {
            return undefined
        }
    }
  };

export const getAssetId = (contract) => {
    const object = List.verified.find(o => o.contract === contract);
    //console.log("get asset id object", object)
    if (object !== undefined) {
       return object.asset.code
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.asset.code
        } else {
            return "Unknown"
        }
    }
  };

export const getPoolName = (contract) => {
const object = List.verified.find(o => o.contract === contract);
//console.log("contract pool name", object)
if (object !== undefined) {
    console.log("pool name", object.name)
    return object.name
} else {
    const fromStrkey = List.verified.find(o => o.contract === contract);
    if (fromStrkey !== undefined) {
        return fromStrkey.name
    } else {
        return "Unknown"
    }
}
};

//not using it right now
export const getPoolPublisher = (contract) => {
    const object = List.verified.find(o => o.contract === fromStringToKey(toHex(contract)));
    //console.log(contract)
    if (object !== undefined) {
        return object.publisher
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.publisher
        } else {
            return "Unknown"
        }
    }
    };

export const toHex = (b64) => {
    const buffer = Buffer.from(b64, 'base64');
    return buffer.toString('hex')
}


const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
export const fromStringToKey = (key) => (
    StrKey.encodeContract(fromHexString(`${toHex(key)}`))
)


export function parseBase64Yield(_yield, radix) {
    let yieldValue;
    if (radix == 8) {
        yieldValue = hexToFloat64(toHex(_yield), radix);
    } else {
        yieldValue = parseInt(toHex(_yield), radix);
    }

    return (yieldValue)
}


export function hexToFloat64(hexString) {
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const dataView = new DataView(byteArray.buffer);
    const floatValue = dataView.getFloat64(0, false);

    return floatValue;
}


export function parseTimestamp(timestamp) {
    const timestampHex = toHex(timestamp)
    const parsedTimestamp = parseInt(timestampHex, 16)
    const milliseconds = parsedTimestamp * 1000

    return milliseconds
}

/*
export function timestampsToDates(timestamps) {
    return timestamps.map(timestamp => new Date(timestamp))
  }
*/

export function timestampsToDates(timestamps, includePrior = true) {
    const dates = timestamps.map(timestamp => new Date(timestamp))
  
    if (includePrior) {
        const firstTimestamp = timestamps[0]
        const firstDate = new Date(firstTimestamp)
        const oneMinutePrior = new Date(firstDate.getTime() - 60000)
        dates.unshift(oneMinutePrior)
    }
  
    return dates;
}
  