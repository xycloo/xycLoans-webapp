'use client'

import Interact from "./interact"
import Lending_image from "/public/image3_xycloans_webapp.png"
import Image from 'next/image'

export default function Home() {
  
  return (
    <main className="">
      <div className="mb-24">
      <div className="md:flex h-max">
        <div className="md:w-1/2 m-auto text-black text-opacity-80 2xl:mr-10">
          <h1 className="">The Soroban <span className="text-[#0fd7a9]">Flash Loans</span> Protocol</h1>
          <h3 className="text-base text-grey-700 px-1 pt-5 pb-5 md:pb-0">Provide liquidity and borrow your flash loans on the <span className="text-[#0fd7a9] font-bold">Stellar-Soroban</span> ecosystem. With <span className="text-[#0fd7a9] font-bold">zero</span> protocol fees.</h3>
        </div>
        <div className="md:w-1/2 m-auto flow-root 2xl:ml-10">
          <Image
            src={Lending_image}
            alt="Lending Imgage"
            width={600}
            quality={100}
          />
        </div>
      </div>
      <div className="">
        <button type="button" className="mt-8 m-auto text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</button>
      </div>
      </div>
    </main>
  )
}
