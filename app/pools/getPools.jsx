import { StrKey } from "stellar-sdk";
import Yield from "./Yield";
import NormYield from "./NormYield";
import { getAssetId, getAssetLogo, getPoolName } from "../helpers/dataParsing";
import Image from "next/image";
import Placeholder from "/public/currency-xycloans.png"

const toHex = (b64) => {
    const buffer = Buffer.from(b64, 'base64');
    return buffer.toString('hex')
}



export function filterAndSortSupplies(supplies) {
    // Create an object to store unique contracts and their corresponding objects
    const contractMap = {};
  
    // Iterate through the supplies array
    supplies.forEach((item) => {
      const contract = item.contract;
      const timestampHex = toHex(item.timestamp); // Remove '\x'
      const timestamp = parseInt(timestampHex, 16);
  
      // Check if the contract is already in the map
      if (contractMap.hasOwnProperty(contract)) {
        // If the current object has a higher timestamp, update it
        if (timestamp > contractMap[contract].timestamp) {
          contractMap[contract] = {
            contract: item.contract,
            timestamp: timestamp,
            supply: parseInt(toHex(item.supply), 16)
          };
        }
      } else {
        // If the contract is not in the map, add it
        contractMap[contract] = {
            contract: item.contract,
          timestamp: timestamp,
          supply: parseInt(toHex(item.supply), 16)
        };
      }
    });
  
    // Convert the values of the contractMap back to an array
    const result = Object.values(contractMap);
  
    return result;
  }

//this returns the corresponding XLM amount with the correstonding decimals from integer stroops

  export function stroopsToXLM(num, decPlaces=7) {
    return (num/10000000).toFixed(decPlaces)
}

//this returns just a float with the specified decimals

export function intToFloat(num, decPlaces) {
    return num.toFixed(decPlaces); 
}

export default async function GetPools(props) {
        
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
   
   const data = props.data

   //get the data about the balance for each pool
   const contracts_supplies = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
   const contracts = filterAndSortSupplies(contracts_supplies);

   //get the data about all the new yields for each borrow for each pool
   const yieldData = data.allZephyr28439Ed255B6Ccbb589A4635958Eec88S.nodes

    return (
                <div>
                    <div className="relative overflow-x-auto rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-500 bg-white border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Asset
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Pool
                                    </th>
                                    
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Supply
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Weighted Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            {contracts.map((node) => (
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50 text-gray-700 text-sm lg:text-base font-medium">
                                        <td className="px-6 py-4">
                                        <div className="flex">
                                            {getAssetLogo(fromStringToKey(toHex(node.contract))) &&
                                                <Image
                                                    src={getAssetLogo(fromStringToKey(toHex(node.contract)))}
                                                    width="30"
                                                    height="100"
                                                    className=""
                                                    alt="globe"
                                                />}
                                            {!getAssetLogo(fromStringToKey(toHex(node.contract))) &&
                                                <Image
                                                    src={Placeholder}
                                                    width="30"
                                                    height="100"
                                                    className=""
                                                    alt="globe"
                                                />}
                                            <p className="my-auto ml-2">{getAssetId(fromStringToKey(toHex(node.contract)))}</p>
                                        </div>
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                            {/*fromStringToKey(toHex(node.contract)).substring(0, 10) + "..."*/}
                                            {getPoolName(fromStringToKey(toHex(node.contract)))}
                                        </th>
                                        <td className="px-6 py-4">
                                            {stroopsToXLM(node.supply, 2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Yield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} />
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <NormYield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} /> %
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={`/pools/${fromStringToKey(toHex(node.contract))}`} className="flex justify-end">
                                                <button className="bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out text-gray-800 rounded-lg font-medium shadow-md">
                                                    Details
                                                </button>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
    )
}