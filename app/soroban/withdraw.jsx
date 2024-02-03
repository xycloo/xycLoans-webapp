"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { useRouter } from 'next/navigation'
import {publishTx} from "./tx"


export default function Withdraw(params) {

    const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey;
    const router = useRouter()

    async function handleWithdraw(e) {

        e.preventDefault()

        const contractAddress = contractId
        const contract = new Contract(contractAddress)

        const amount = xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString((Number(BigInt(quantity) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
            hi: xdr.Int64.fromString((Number((BigInt(quantity) >> BigInt(64)) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
        }));

        const contract_call = contract.call("withdraw", new Address(publicKey).toScVal(), amount);
        try {
            await publishTx(publicKey, contract_call);
            router.refresh()
        } catch (e) {
            // Error dialog
        }
    }
    return (
        <form className="bg-white pl-0 ml-0 py-0 mt-2 mb-4" onSubmit={handleWithdraw}>
            <label className="flex">
                <input
                    className="bg-gray-50 border p-auto border-gray-200 focus:outline-none focus:border-yellow-100 text-xs text-gray-900 text-sm rounded-l-lg transition duration-300 block w-full"
                    required
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => setQuantity(e.target.value)}
                    value={quantity}>
                </input>
                <button className="text-sm rounded-r-lg m-auto bg-gradient-to-r from-yellow-500 to-red-500 hover:opacity-80 transition duration-300 text-white">
                    <span className="text-xs">
                        Withdraw
                    </span>
                </button>
            </label>
        </form>
    )
}