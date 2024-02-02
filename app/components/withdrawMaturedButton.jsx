"use client"
import { useState } from "react";
import WithdrawMatured from "../soroban/withdrawMatured";

export default function WithdrawMaturedButton(params) {
    const contractId = params.contractId
    const publicKey = params.publicKey.value
    async function handleWithdrawMatured() {
        WithdrawMatured(contractId, publicKey)
    }
    return (
        <button onClick={handleWithdrawMatured} className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300">
            <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                Withdraw Rewards
            </span>
        </button>)
}