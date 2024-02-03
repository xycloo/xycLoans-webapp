"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
//import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { useRouter } from 'next/navigation'
import {publishTx} from "./tx"



export default async function UpdateRewards(params) {

    //const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey
    const router = useRouter()

    async function handleUpdateRewards(e) {

        //e.preventDefault()
        console.log("updating")
        const contractAddress = contractId
        const contract = new Contract(contractAddress)
        const contract_call = contract.call("update_fee_rewards", new Address(publicKey).toScVal());
        
        try {
            await publishTx(publicKey, contract_call);
            router.refresh()
        } catch (e) {
            // Error dialog
        }
    } return (
        <button onClick={handleUpdateRewards} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
            <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Update rewards
            </span>
        </button>)
}