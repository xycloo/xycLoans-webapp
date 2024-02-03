import { StrKey } from "stellar-sdk";
import Yield from "./Yield";
import NormYield from "./NormYield";


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
                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-500 bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Pool Id
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Asset Id
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Supply
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Normalized Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            {contracts.map((node) => (
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50 text-black font-bold">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {/*node.node.contract*/}
                                            {fromStringToKey(toHex(node.contract)).substring(0, 10) + "..."}
                                        </th>
                                        <td className="px-6 py-4">
                                            {/*fromStringToKey(node.asset.slice(2)).substring(0, 10) + "..."*/}
                                        </td>
                                        <td className="px-6 py-4">
                                            {stroopsToXLM(node.supply, 2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Yield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <NormYield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} /> %
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={`/pools/${fromStringToKey(toHex(node.contract))}`} className="font-medium text-[#0fd7a9] hover:underline">Details</a>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
    )
}