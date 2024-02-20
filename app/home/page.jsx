import { cookies } from "next/headers";
import { fetchPools } from "../pools/fetchPools"
import { StrKey, xdr } from "stellar-sdk";
import { stroopsToXLM } from "../pools/getPools";
import Yield from "../pools/Yield";
import NormYield from "../pools/NormYield";
import { AccountAggregatedMetrics } from "../pools/aggregatedMetrics";
import UpdateRewardsButton from "../components/updateRewardsButton";
import UpdateRewards from "../soroban/updateRewards";
import CalculateColleced from "../helpers/calculateColleted";
import CalculateMatured from "../helpers/calculateMatured";
import MaturedFees from "../components/maturedFees";
import Image from 'next/image'
import Explore from "/public/financial-growth-xycloans.png"
import Borrow from "/public/dividends-xycloans.png"
import { getTotAccountNormYield } from "../pools/getYield";
import Supplies from "/public/green-supplies.png"
import { getAssetId, getAssetLogo, getPoolName } from "../helpers/dataParsing";
import Placeholder from "/public/currency-xycloans.png"
import LoadingModal from "../components/loadingModal";
import SuccessModal from "../components/successModal";
import ErrorModal from "../components/errorModal";


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

export default async function Home({searchParams}) {

    const data = await fetchPools()
    const cookiesStore = cookies()
    
    //the objects that represent the change in balance for every account for each pool every time the balance changes
    const allAccountData = data.allZephyr189C96D767479F9619F1C034467D7231S.nodes

    //all the objects that represent the yield for each account for each contract for each borrow
    const allYieldAccountData = data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes

    //all events
    const allEvents = data.allZephyrC4B405471033E73Ec0083Ca915572228S.nodes

    const _publicAddress = cookiesStore.get('publicAddress')
    const publicAddress = _publicAddress.value

    //different than the fromStringToKey function in calculateCollected  
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )

    //all the entries in the allAccountsData array that belong to the account that shared its public key (that is logged in)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicAddress)
    
    //the most recent object of the account data array (the one with the current balance)
    const lastObjectXPool = filterAndSortAccountSupplies(accountData)

    const YieldAccountData = allYieldAccountData.filter(obj => parseAddress(obj.address) === publicAddress)

    let totAccountYield = undefined
    if (publicAddress) {totAccountYield = await getTotAccountNormYield(YieldAccountData)}

    const show = searchParams?.show
    const success = searchParams?.success
    const error = searchParams?.error
    
    let is_show = false
    let is_error = false;
    let is_success = false;

    if (show !== undefined) {
        is_show = true
    }

    if (success !== undefined) {
        is_success = true
    }

    if (error !== undefined) {
        is_error = true
    }

    return (
        <main>
            <div>
                <div className="inline-block w-full py-5 mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-opacity-100 rounded-md shadow-sm">
                    <div className="flex my-2 w-full">
                    <div className="py-3 w-2/3 md:w-1/2">
                        <div className="flex ml-4 sm:ml-8">
                            <Image
                                src={Supplies}
                                width="40"
                                height="100"
                                className="h-10 my-auto"
                                alt="globe"
                            />
                            <h2 className="text-white font-bold text-3xl my-auto ml-2">Your supplies</h2>
                        </div>
                        </div>
                        <div className="flex justify-end items-center w-1/3 md:w-1/2">
                        <div className="text-center mr-4 sm:mr-10">
                            <p className="text-xs sm:text-sm text-gray-300">Tot weighted yield</p>
                            <p className="text-white font-semibold text-base sm:text-lg">{totAccountYield.toFixed(4)} %</p>
                            {/*  //to calculate the tot balance of account  <AccountAggregatedMetrics data={lastObjectXPool} />*/}
                        </div>
                    </div>
                    </div>
                </div>
                {lastObjectXPool.length === 0 &&
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex items-center justify-center lg:w-1/2 h-96 bg-white border border-gray-100 rounded-md lg:rounded-l-md mb-4 lg:mb-0">
                            <p>You have no positions</p>
                        </div>
                        <div className="lg:w-1/2 lg:ml-4 h-96">
                            <div className="h-[183.5px] bg-white border border-gray-100 rounded-md mb-4">
                                <div className="my-5 mx-auto px-8 flex flex-col">
                                    <p className="text-lg text-gray-700 font-medium mb-4">Liquidity providers</p>
                                    <div className="flex items-center justify-start pt-3">
                                        <Image
                                            src={Explore}
                                            width="40"
                                            height="100"
                                            className="h-16 w-16 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                            alt="globe"
                                        />
                                        <div className="ml-3">
                                            <p className="text-gray-700 font-semibold">Explore markets</p>
                                            <p className="text-sm text-gray-500">Take a look at the <a href="/pools">existing pools</a>, or jump to the <a href="/liquidity-providers">liquidity providers</a> section to learn more.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[183.5px] bg-white border border-gray-100 rounded-md">
                                <div className="my-5 mx-auto px-8 flex flex-col">
                                    <p className="text-lg text-gray-700 font-medium mb-4">Borrowers</p>
                                    <div className="flex items-center justify-start pt-3">
                                        <Image
                                            src={Borrow}
                                            width="40"
                                            height="100"
                                            className="h-16 w-16 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                            alt="globe"
                                        />
                                        <div className="ml-3">
                                            <p className="text-gray-700 font-semibold">Use flash loans</p>
                                            <p className="text-sm text-gray-500">Go to the <a href="/borrowers">borrowers</a> section to learn how to request and use flash loans.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                {lastObjectXPool.length !==0 && <div className="relative overflow-x-auto rounded-md">
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
                                <th scope="col" className="px-6 py-3 font-light flex justify-end">
                                    <span className="sr-only">Mature</span>
                                </th>
                            </tr>
                        </thead>
                        {lastObjectXPool.map((node) => (
                            <tbody>
                                <tr className="bg-white border-b hover:bg-gray-50 text-gray-700 text-sm lg:text-base font-medium">
                                    <th scope="row" className="px-6 py-4 text-gray-700 text-sm lg:text-base font-medium whitespace-nowrap">
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
                                    </th>
                                    <td className="px-6 py-4">
                                        {getPoolName(fromStringToKey(toHex(node.contract)))}
                                        {/*fromStringToKey(toHex(node.contract)).substring(0, 10) + "..."*/}
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
                                    <td className="px-6 py-4">
                                        {/*CalculateColleced(publicAddress, allEvents, fromStringToKey(toHex(node.contract)))*/}
                                        {/*async () => {CalculateMatured(publicAddress, allEvents, fromStringToKey(toHex(node.contract)), allYieldAccountData)}*/}
                                        {/*<MaturedFees publicKey={publicAddress} events={allEvents} id={fromStringToKey(toHex(node.contract))} yieldData={allYieldAccountData} />*/}
                                        {CalculateMatured(publicAddress, allEvents, fromStringToKey(toHex(node.contract)), allYieldAccountData).toFixed(4)}
                                    </td>
                                    <td className="px-6 py-4">
                                    {<a href={`/pools/${fromStringToKey(toHex(node.contract))}`} className="flex justify-end">
                                        <button className="bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out text-gray-800 rounded-lg font-medium shadow-md">
                                            Details
                                        </button>
                                    </a>}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex justify-end">
                                     <UpdateRewards contractId={fromStringToKey(toHex(node.contract))} publicKey={publicAddress} fromHome={true} />
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        ))}
                    </table>
                </div>}
            </div>
            <>
                {is_show && <LoadingModal id={"home"} msg={show}/>}
                {is_success && <SuccessModal id={"home"} msg={success} />}
                {is_error && <ErrorModal id={"home"} error={error} />}
            </>
        </main>
    )
}