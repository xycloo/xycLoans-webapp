import { StrKey, xdr } from "stellar-sdk";
import { cookies } from 'next/headers'
import Deposit from "../../soroban/deposit";
import Interact from "@/app/interact";
import { filterAndSortSupplies, stroopsToXLM } from "../getPools";
import { fetchPools } from "../fetchPools";
import sumYieldLastXDays, { Form } from "./yieldForPeriod";
import Yield from "../Yield";
import { filterAndSortAccountSupplies, parseAddress } from "@/app/home/page";
import NormYield from "../NormYield";
import UpdateRewards from "@/app/soroban/updateRewards";
import WithdrawMatured from "@/app/soroban/withdrawMatured";
import Withdraw from "@/app/soroban/withdraw";
import getTotYield from "../getYield";


const toHex = (b64) => {
    const buffer = Buffer.from(b64, 'base64');
    return buffer.toString('hex')
}


export default async function PoolDetails({ params }) {

    const cookiesStore = cookies()

    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${toHex(key)}`))
    )

    const _publicKey = cookiesStore.get('publicAddress')
    let publicKey
    if (_publicKey) {
        publicKey = _publicKey.value
    }

    const data = await fetchPools()
    const ContractSupplyNodes = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
    const ContractAccountYieldNodes = data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes
    const allAccountData = data.allZephyr189C96D767479F9619F1C034467D7231S.nodes
    const allEvents = data.allZephyrC4B405471033E73Ec0083Ca915572228S.nodes

    const topic_scval = xdr.ScVal.scvSymbol("collect").toXDR('base64');
    const address_scval = xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(xdr.PublicKey.publicKeyTypeEd25519(StrKey.decodeEd25519PublicKey(publicKey)))).toXDR("base64")
    
    let total_collected = 0.0;
    for (let event of allEvents) {
        let contractStrkey = fromStringToKey(event.contract)
        if (contractStrkey === params.id && event.topic1 === topic_scval && event.topic2 === address_scval) {
            const i128 = xdr.ScVal.fromXDR(event.data, "base64").i128();
            total_collected += parseInt((BigInt(i128._attributes.hi._value.toString()) << BigInt(64)) + BigInt(i128._attributes.lo._value.toString()));
        }
    }
    const float_tot_collected = stroopsToXLM(total_collected, 4)

    //general pool variables
    const contracts_supplies = filterAndSortSupplies(ContractSupplyNodes)   
    const found = contracts_supplies.find(obj => {
        return fromStringToKey(obj.contract) === params.id
    })

    //specific account variables
    const YieldAccountData = ContractAccountYieldNodes.filter(obj => parseAddress(obj.address) === publicKey)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicKey)
    const account_supplies = filterAndSortAccountSupplies(accountData)
    const accountBalanceForPool = account_supplies.find(obj => {
        return fromStringToKey(obj.contract) === params.id
    })

    const to_mature = stroopsToXLM(await getTotYield(params.id, YieldAccountData, 16), 4) - float_tot_collected;

    return (
        <main>
            <div className="flex">
                <div className="w-3/4 mr-4 bg-white border border-gray-100 rounded-md">
                    {found &&
                        <div className="my-12 mx-auto px-8">
                            <p>Pool Id: {fromStringToKey(found.contract)}</p>
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
                                            <div className="mr-3">
                                                <p className="text-sm">Balance</p>
                                                <p className="text-black font-bold">{stroopsToXLM(accountBalanceForPool.balance, 2)}</p>
                                            </div>
                                            <div className="mx-3">
                                                <p className="text-sm">Yield</p>
                                                <p className="text-black font-bold"><Yield contractId={params.id} yieldData={YieldAccountData} radix={16} /></p>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm">Norm<span className="invisible">_</span>Yield</p>
                                                <p className="text-black font-bold"><NormYield contractId={params.id} yieldData={YieldAccountData} radix={8} /> %</p>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm">Collected<span className="invisible">_</span></p>
                                                <p className="text-black font-bold">{total_collected}</p>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm">Matured</p>
                                                <p className="text-black font-bold">{to_mature}</p>
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
                            {accountBalanceForPool && <Withdraw contractId={params.id} publicKey={publicKey} />}
                            {accountBalanceForPool && <UpdateRewards contractId={params.id} publicKey={publicKey} />}
                            {accountBalanceForPool && <WithdrawMatured contractId={params.id} publicKey={publicKey} />}
                            </div>
                        </div>}
                </div>
            </div>
        </main>
    )
}