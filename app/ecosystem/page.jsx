"use client"

import { xdr, StrKey } from "stellar-sdk";
import { fromStringToKey, getPoolName, parseBase64Yield, parseTimestamp } from "../helpers/dataParsing";
import { fetchAllEvents } from "../pools/fetchPools"
import * as React from 'react';

export default async function FlashLoanEcosystem({searchParams}) {
    function truncateMiddle(str, n) {
        const midIndex = Math.floor(str.length / 2);
        return str.slice(0, midIndex - Math.floor(n / 2)) + '...' + str.slice(midIndex + Math.ceil(n / 2));
    }
    
    function fromParts(hi, lo) {
        const result = (BigInt(hi) << BigInt(64)) + BigInt(lo);
        return result.toString();
    }
    
    let data = await fetchAllEvents();
    data = data.allZephyrC4B405471033E73Ec0083Ca915572228S;
    
    let allEcosystemEvents = data.nodes;

    for (let i = 0; i < allEcosystemEvents.length; i++) {
        allEcosystemEvents[i].sequence = parseBase64Yield(allEcosystemEvents[i].sequence, 16)
        allEcosystemEvents[i].timestamp = new Date(parseTimestamp(allEcosystemEvents[i].timestamp)).toLocaleString()
        allEcosystemEvents[i].contract = fromStringToKey(allEcosystemEvents[i].contract)
        allEcosystemEvents[i].topic1 = xdr.ScVal.fromXDR(allEcosystemEvents[i].topic1, "base64").sym().toString()
        
        const topic2 = xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64");
        
        if (topic2.address().switch().name === "scAddressTypeAccount") {
            allEcosystemEvents[i].topic2 =  StrKey.encodeEd25519PublicKey(xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64").address().accountId().value())
        } else {
            allEcosystemEvents[i].topic2 = StrKey.encodeContract(xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64").address().contractId())
        }
        
        const parts = xdr.ScVal.fromXDR(allEcosystemEvents[i].data, "base64").i128();
        allEcosystemEvents[i].data = fromParts(parts.hi(), parts.lo());
    }
    
    allEcosystemEvents.reverse()

    return (
        <main>
            <div>
                <div className="max-w-[1000px] m-auto">
                    <h2 className="text-2xl">Flash Loans Ecosystem Explorer</h2>
                    <p className="my-10">We believe that it's the protocol's job to display all the related activity given that there's prior knowledge of the indexed structures and endless 
                       potential customization. This is why we index all events of contracts linking a xycloans pool (an audited and soroban-optimized flash loan pool module) hash as their binary.
                       <br/><br/><span className="font-light italic">Search and xycLoans API docs coming soon!</span></p>
                    
                </div>
            </div>
            
            <div className="relative overflow-x-auto  ">
                        <table className="text-sm text-left rtl:text-right text-gray-500 w-full max-w-[1000px] m-auto">
                            <thead className="text-xs text-gray-500 bg-white border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Pool
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Sequence
                                    </th>
                                    
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Topic 2
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Data
                                    </th>
                                </tr>
                            </thead>
                            {allEcosystemEvents.map((node) => (
                                <tbody className="text-xs font-ligth">
                                    <tr className="bg-white border-b hover:bg-gray-50 text-xs text-gray-500">
                                        <th className="px-6 py-4">
                                            <a className="text-[#2ca56d]" href={`/pools/${node.contract}`}>{getPoolName(node.contract)}</a>
                                        </th>
                                        <td scope="row" className="px-6 py-4">
                                        {node.sequence}
                                        </td>
                                        <td className="px-6 py-4">
                                        {node.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                        {node.topic1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {truncateMiddle(node.topic2, 40)}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            {node.data}
                                        </td>
                                        
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
        </main>
    )
}