'use client';

import { useCookies } from 'next-client-cookies'
import Logo from "/public/xycloans_logo-removebg-preview.png"
import Image from 'next/image'
import { StellarWalletsKit, WalletNetwork, WalletType } from 'stellar-wallets-kit';

export default function Navbar() {
    const cookies = useCookies();

    async function ConnectWallet() {        
        const kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWallet: WalletType.FREIGHTER
          });
        
        const publicKey = await kit.getPublicKey();
        console.log(publicKey)
    
        cookies.set('publicAddress', publicKey)
    }

    return (
        <nav className="border-gray-200 bg-white rounded-xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Image
                        src={Logo} 
                        width="160"
                        height="100"
                        className="h-8" 
                        alt="xycloans Logo" 
                    />
                </a>
                <button data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-solid-bg" aria-expanded="false">
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15" />
                    </svg>
                </button>
                <div className="hidden w-full md:block md:w-auto" id="navbar-solid-bg">
                    <ul className="flex flex-col font-medium mt-4 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-transparent dark:bg-gray-800 md:dark:bg-transparent dark:border-gray-700">
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-white bg-blue-700 rounded md:bg-transparent md:text-[#0fd7a9]" aria-current="page">Home</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700">Provide liquidity</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700">Borrow</a>
                        </li>
                        <li>
                            <a href="#" className="block py-2 px-3 md:p-0 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700">Pools</a>
                        </li>

                        <button onClick={ConnectWallet}>Connect Wallet</button>
                    </ul>
                </div>
            </div>
        </nav>

    )
}