import { StrKey, xdr } from "stellar-sdk";
import { cookies } from 'next/headers'
import Deposit from "./deposit";
import Interact from "@/app/interact";
import { filterAndSortSupplies, stroopsToXLM } from "../getPools";
import { fetchPools } from "../fetchPools";
import sumYieldLastXDays, { Form } from "./yieldForPeriod";
import Yield from "../Yield";
import { filterAndSortAccountSupplies, parseAddress } from "@/app/home/page";
import NormYield from "../NormYield";


export default async function PoolDetails({ params }) {

    const cookiesStore = cookies()

    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )

    const publicKey = cookiesStore.get('publicAddress')

    const data = await fetchPools()
    const ContractSupplyNodes = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
    const ContractAccountYieldNodes = data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes
    const allAccountData = data.allZephyr189C96D767479F9619F1C034467D7231S.nodes

    //general pool variables
    const contracts_supplies = filterAndSortSupplies(ContractSupplyNodes)   
    const found = contracts_supplies.find(obj => {
        return fromStringToKey(obj.contract.slice(2)) === params.id
    })

    //specific account variables
    const YieldAccountData = ContractAccountYieldNodes.filter(obj => parseAddress(obj.address) === publicKey)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicKey)
    const account_supplies = filterAndSortAccountSupplies(accountData)
    console.log(account_supplies)
    const accountBalanceForPool = account_supplies.find(obj => {
        return fromStringToKey(obj.contract.slice(2)) === params.id
    })
    console.log(accountBalanceForPool)



    return (
        <main>
            <div className="flex">
                <div className="w-3/4 mr-4 bg-white border border-gray-100 rounded-md">
                    {found &&
                        <div className="my-12 mx-auto px-8">
                            <p>Pool Id: {fromStringToKey(found.contract.slice(2))}</p>
                            <p>Supply: {found.supply}</p>
                            {/*exYieldFor30Days*/}
                            {/*<Form />*/}
                        </div>}
                </div>
                <div className="w-1/4">
                    {publicKey &&
                        <div className="w-full mr-4 bg-white border border-gray-100 rounded-md">
                            <div className="my-5 mx-auto px-8">
                                <p className="text-lg text-primary font-bold text-primary">Personal dashboard</p>
                                <div>
                                    {accountBalanceForPool &&
                                        <div className="flex mt-6">
                                            <div>
                                                <p>Balance</p>
                                                <p>{stroopsToXLM(accountBalanceForPool.balance)}</p>
                                            </div>
                                            <div>
                                                <Yield contractId={params.id} yieldData={YieldAccountData} radix={16} />
                                            </div>
                                            <div>
                                                <NormYield contractId={params.id} yieldData={YieldAccountData} radix={8} />
                                            </div>
                                        </div>}
                                    {!accountBalanceForPool &&
                                    <div className="mt-6 mx-auto">
                                        <p className="text-sm">Balance</p>
                                        <p className="font-bold text-black">0</p>
                                    </div>}
                                </div>
                            </div>
                        </div>}
                    {!publicKey &&
                        <div className="w-full h-full mr-4 bg-white border border-gray-100 rounded-md">
                            <div className="my-5 mx-auto px-8">
                                <p className="text-lg text-primary font-bold">Personal dashboard</p>
                                <div className="my-7 text-sm">Connect your wallet</div>
                            </div>
                        </div>}
                    {publicKey &&
                        <div className="w-full mr-4 mt-4 bg-white border border-gray-100 rounded-md">
                            <div className="my-5 mx-auto px-8">
                            <p className="text-lg text-primary font-bold text-primary mb-3">Actions</p>
                            <Deposit contractId={params.id} publicKey={publicKey} />
                            {accountBalanceForPool && <UpdateRewards contractId={params.id} publicKey={publicKey} />}
                            </div>
                        </div>}
                </div>
            </div>
        </main>
    )
}