"use client"

import Image from "next/image";
import PoolsImage from "/public/globe-xycloans.png"
import numberOfPools from "./aggregatedMetrics";
import * as React from 'react';
import { fetchPools } from "./fetchPools";
import GetPools from "./getPools";

export default async function PoolsDisplay({searchParams}) {
    const data = await fetchPools()
    const supplyData = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
    console.log(supplyData);
    
    return (
        <main>
            <div className="inline-block w-full py-5 mb-4 bg-[#12eab7] bg-opacity-40 bg-gradient-to-r from-[#6366f1] to-[#9333ea] bg-opacity-100 border rounded-md shadow-sm">
                <div className="flex my-2 w-full">
                <div className="py-3 w-2/3 md:w-1/2">
                    <div className="flex ml-4 sm:ml-8">
                        <Image
                            src={PoolsImage}
                            width="40"
                            height="100"
                            className="h-10 my-auto"
                            alt="globe"
                        />
                        <h2 className="text-gray-600 text-white font-bold text-3xl my-auto ml-2">Active Pools</h2>
                    </div>
                    </div>
                    <div className="flex justify-end items-center w-1/3 md:w-1/2">
                        <div className="text-center mr-4 sm:mr-10">
                            <p className="text-xs sm:text-sm text-gray-300">Number of pools</p>
                            <p className="text-white font-semibold text-base sm:text-lg">{numberOfPools(supplyData)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <GetPools data={data} />
        </main>
    )
}

export const dynamic = 'force-dynamic'
export const runtime = 'edge' // 'nodejs' (default) | 'edge'
