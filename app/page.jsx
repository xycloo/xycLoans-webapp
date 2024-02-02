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
    <main className="h-screen">
      <div className="xl:mt-36">
      <div className="md:flex h-max">
        <div className="md:w-1/2 m-auto text-black text-opacity-80 2xl:mr-10">
          <h1 className="">The Soroban <span className="text-[#14b780]">Flash Loans</span> Protocol</h1>
          <h3 className="text-base text-grey-700 px-1 pt-10 pb-5 md:pb-0">Provide liquidity and borrow your flash loans on the <span className="text-[#0fd7a9] font-bold">Stellar-Soroban</span> ecosystem. With <span className="text-[#0fd7a9] font-bold">zero</span> protocol fees.</h3>
        </div>
        <div className="md:w-1/2 ml-20 flow-root 2xl:ml-10">
          <Image
            src={Lending_image}
            alt="Lending Imgage"
            width={350}
            quality={100}
            className="floating m-auto"
          />
        </div>
      </div>
      <div className="">
        <button type="button" className="mt-14 m-auto text-white bg-gradient-to-r from-green-400 to-blue-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-green-200 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Get Started</button>
      </div>
      </div>
    </main>
  )
}
