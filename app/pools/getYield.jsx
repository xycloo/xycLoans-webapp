import { StrKey } from "stellar-sdk";


const toHex = (b64) => {
  const buffer = Buffer.from(b64, 'base64');
  return buffer.toString('hex')
}


function parseFloat(str, radix)
{
    var parts = str.split(".");
    if ( parts.length > 1 )
    {
        return parseInt(parts[0], radix) + parseInt(parts[1], radix) / Math.pow(radix, parts[1].length);
    }
    return parseInt(parts[0], radix);
}


//get the tot yield for the specified pool for the specified set of data (either for the whole pool or for a specific account)
export default async function getTotYield(pool, yieldData, radix) {
    
    function calculateYieldSum(data) {
        // Initialize the sum
        let sum = 0;
      
        // Loop through each object in the array
        for (let i = 0; i < data.length; i++) {
          let yieldValue;
          if (radix == 8) {
            yieldValue = hexToFloat64(toHex(data[i].yield), radix);
          } else {
            yieldValue = parseInt(toHex(data[i].yield), radix);
          }

          // Add the integer value to the sum
          sum += yieldValue;
        }
      
        // Return the total sum
        return sum;
      }  

    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    
    const yieldDataForContract = yieldData.filter(obj => {
        return fromStringToKey(toHex(obj.contract)) === pool
    })

    const totYield = calculateYieldSum(yieldDataForContract)

    return (
        totYield
    )
}

function hexToFloat64(hexString) {
  const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
  const dataView = new DataView(byteArray.buffer);
  const floatValue = dataView.getFloat64(0, false);
  
    return floatValue;
  }

//gets the tot norm yield for the specified pool for the the specified set of data (either for the whole pool or for a specific account)
export async function getTotNormYield(pool, yieldData, radix) {
    function calculateYieldSum(data) {
        
        // Initialize the sum
        let sum = 0.0;
      
        // Loop through each object in the array
        for (let i = 0; i < data.length; i++) {
          // Decode the hexadecimal "yield" value to an integer
          const yieldValue = hexToFloat64(toHex(data[i].yieldnorm));

          // Add the integer value to the sum
          if (!isNaN(yieldValue)) {
            sum += yieldValue;
          }
        }
        // Return the total sum
        return sum;
      }  

    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    
    const yieldDataForContract = yieldData.filter(obj => {
        return fromStringToKey(toHex(obj.contract)) === pool
    })
    
    const totNormYield = calculateYieldSum(yieldDataForContract)

    return (
        totNormYield
    )


}
