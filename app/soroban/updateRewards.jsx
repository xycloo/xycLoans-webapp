"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
//import { useState } from "react";
import { useRouter } from 'next/navigation'
import {publishTx} from "./tx"



export default async function UpdateRewards(params) {

    //const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey
    const router = useRouter()

    async function handleUpdateRewards(e) {

        //e.preventDefault()
        const contractAddress = contractId
        const contract = new Contract(contractAddress)
        const contract_call = contract.call("update_fee_rewards", new Address(publicKey).toScVal());
        
        const loadingMessage = "Updating matured fee rewards"
        const message = "Updated matured fee rewards"
        
        if (!params.fromHome) {
            router.push(`${params.contractId}/?show=${loadingMessage}`)

            try {
                await publishTx(publicKey, contract_call);
                router.push(`${params.contractId}/?success=${message}`)
                router.refresh()
            } catch (e) {
                router.push(`${params.contractId}/?error=${e}`)
                router.refresh()
            }
        } else if (params.fromHome) {
            router.push(`home/?show=${loadingMessage}`)

            try {
                await publishTx(publicKey, contract_call);
                router.push(`home/?success=${message}`)
                router.refresh()
            } catch (e) {
                router.push(`home/?error=${e}`)
                router.refresh()
            }
        }
    } return (
        <button onClick={handleUpdateRewards} className="rounded-lg w-40 m-auto bg-gradient-to-r from-[#6366f1] to-[#9333ea] hover:bg-gradient-to-r hover:from-[#4f46e5] hover:to-[#7e22ce] transition duration-900 ease-in-out text-white font-normal mx-1 shadow-md">
        <span className="text-sm w-max mx-auto">
            Update rewards
        </span>
    </button>)
}