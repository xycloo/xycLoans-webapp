import { cookies } from "next/headers";
import { fetchPools } from "../pools/fetchPools"
import { StrKey, xdr } from "stellar-sdk";
import { stroopsToXLM } from "../pools/getPools";
import Yield from "../pools/Yield";
import NormYield from "../pools/NormYield";
import { AccountAggregatedMetrics } from "../pools/aggregatedMetrics";
import UpdateRewardsButton from "../components/updateRewardsButton";
import UpdateRewards from "../soroban/updateRewards";

const toHex = (b64) => {
    const buffer = Buffer.from(b64, 'base64');
    return buffer.toString('hex')
}

export function filterAndSortAccountSupplies(supplies) {
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
                    balance: parseInt(toHex(item.balance), 16)
                };
            }
        } else {
            // If the contract is not in the map, add it
            contractMap[contract] = {
                contract: item.contract,
                timestamp: timestamp,
                balance: parseInt(toHex(item.balance), 16)
            };
        }
    });

    // Convert the values of the contractMap back to an array
    const result = Object.values(contractMap);

    return result;
}

export function parseAddress(address) {
    const parsedAddress = xdr.ScAddress.fromXDR(toHex(address), "hex");
    let strkey_addr;
    if (parsedAddress.switch().name === "scAddressTypeAccount") {
        strkey_addr = StrKey.encodeEd25519PublicKey(parsedAddress.accountId().value())
    } else {
        strkey_addr = StrKey.encodeContract(parsedAddress.contractId())
    }
    return (strkey_addr)
}

export default async function Home() {

    const data = await fetchPools()
    const cookiesStore = cookies()
    
    //the objects that represent the change in balance for every account for each pool every time the balance changes
    const allAccountData = data.allZephyr189C96D767479F9619F1C034467D7231S.nodes

    //all the objects that represent the yield for each account for each contract for each borrow
    const allYieldAccountData = data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes

    const _publicAddress = cookiesStore.get('publicAddress')
    const publicAddress = _publicAddress.value

    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )

    //all the entries in the allAccountsData array that belong to the account that shared its public key (that is logged in)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicAddress)
    
    //the most recent object of the account data array (the one with the current balance)
    const lastObjectXPool = filterAndSortAccountSupplies(accountData)

    const YieldAccountData = allYieldAccountData.filter(obj => parseAddress(obj.address) === publicAddress)



    return (
        <main>
            <div>
                <div>
                    <h2 className="text-[#14b780] font-bold text-4xl pt-8 pb-4">Your positions</h2>
                    <div className="w-max">
                        <div className="pb-16 text-center">
                            <p className="text-sm">Total invested balance</p>
                            <AccountAggregatedMetrics data={lastObjectXPool} />
                        </div>
                    </div>
                </div>
                {lastObjectXPool.length ===0 &&
                    <div className="h-screen">
                    <div className="flex items-center justify-center h-2/5 bg-white border border-gray-100 rounded-md">
                    <p>You have no positions</p>
                  </div>
                  </div>}
                {lastObjectXPool.length !==0 && <div className="relative overflow-x-auto sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                        <thead className="text-xs text-gray-500 bg-white border-b border-gray-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Pool
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Asset
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Position
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Tot Yield
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Total Norm Yield %
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    Matured
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    <span className="sr-only">Details</span>
                                </th>
                                <th scope="col" className="px-6 py-3 font-light">
                                    <span className="sr-only">Mature</span>
                                </th>
                            </tr>
                        </thead>
                        {lastObjectXPool.map((node) => (
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50 text-black font-bold">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        {fromStringToKey(toHex(node.contract)).substring(0, 10) + "..."}
                                    </th>
                                    <td className="px-6 py-4">
                                        {/*fromStringToKey(node.asset.slice(2)).substring(0, 10) + "..."*/}
                                    </td>
                                    <td className="px-6 py-4">
                                        {stroopsToXLM(node.balance, 2)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {<Yield contractId={fromStringToKey(toHex(node.contract))} yieldData={YieldAccountData} radix={16} />}
                                    </td>
                                    <td className="px-6 py-4">
                                        {<NormYield contractId={fromStringToKey(toHex(node.contract))} yieldData={YieldAccountData} radix={8} />} %
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                    {<a href={`/pools/${fromStringToKey(toHex(node.contract))}`} className="font-medium text-[#0fd7a9] hover:underline">Details</a>}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                     <UpdateRewards contractId={fromStringToKey(toHex(node.contract))} publicKey={publicAddress} />
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>}
            </div>
        </main>
    )
}