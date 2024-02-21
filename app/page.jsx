'use client'

import Interact from "./interact"
import Lending_image from "/public/image3_xycloans_webapp.png"
import Image from 'next/image'
import { useCookies } from 'next-client-cookies'
import { useRouter } from 'next/navigation'
import { redirect } from 'next/navigation'



export default function Home() {
  
  const cookies = useCookies();
  const router = useRouter()

  let publicKey = cookies.get('publicAddress')

  if (publicKey) {
    //router.push('/home')
    //router.refresh()ù
    redirect('/home')
  }

  return (
    <main className="text-center grid place-items-center h-[80vh]">
      <div className="">
        <div className="">
          <div className="text-black text-opacity-80">
            <h1 className="">Powering <span className="text-[#14b780]">Flash Loans</span> On Soroban.</h1>
            <h3 className="text-base text-grey-700 px-1 pt-10 pb-5 md:pb-0">Provide liquidity and borrow your flash loans on the <span className="text-[#0fd7a9] font-bold">Stellar-Soroban</span> ecosystem. Audited,
             efficient and with <span className="text-[#0fd7a9] font-bold">zero</span> protocol fees.</h3>
          </div>
        </div>
        <div className="flex mt-10 m-auto max-w-[450px]">
        <div className="my-4">
            <a href="https://docs.xycloans.app/" target="_blank" className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</a>
          </div>
          <div className="my-4">
            <a href="https://github.com/xycloo/xycloans/" target="_blank" className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Github</a>
          </div>
          <div className="my-4">
            <a href="/pools"  className="mx-4 text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Explore Pools</a>
          </div>
        </div>
      </div>
    </main>
  )
}
