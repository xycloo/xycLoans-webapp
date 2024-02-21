"use client"

import { Transaction, Keypair, xdr, Contract, TransactionBuilder, Networks, BASE_FEE, SorobanRpc, Address } from 'stellar-sdk'
//import { useState } from "react";
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';
import { useRouter } from 'next/navigation'
import {publishTx} from "./tx"



export default async function WithdrawMatured(params) {

    //const [quantity, setQuantity] = useState('')
    const contractId = params.contractId
    const publicKey = params.publicKey
    const router = useRouter()

    async function handleWithdrawMatured(e) {
        const contractAddress = contractId
        const contract = new Contract(contractAddress)
        const contract_call = contract.call("withdraw_matured", new Address(publicKey).toScVal())

        const loadingMessage = "Withdrawing matured fee rewards"
        const message = "Withdrawn matured fee rewards"
        
        router.push(`${params.contractId}/?show=${loadingMessage}`)
    
        try {
            await publishTx(publicKey, contract_call);
            router.push(`${params.contractId}/?success=${message}`)
            router.refresh()
        } catch (e) {
            router.push(`${params.contractId}/?error=${e}`)
            router.refresh()
        }
    } return (
        <button onClick={handleWithdrawMatured} className="rounded-lg w-40 m-auto bg-gradient-to-r from-[#6366f1] to-[#9333ea] hover:bg-gradient-to-r hover:from-[#4f46e5] hover:to-[#7e22ce] transition duration-900 ease-in-out text-white font-normal mx-1 shadow-md">
        <span className="text-sm w-max mx-auto">
            Withdraw rewards
        </span>
    </button>)
}