'use client';

import { useCookies } from 'next-client-cookies'
import Logo from "/public/xycloans_logo-removebg-preview.png"
import Image from 'next/image'
import { StellarWalletsKit, WalletNetwork, allowAllModules } from '@creit.tech/stellar-wallets-kit';
import { Button, Navbar } from 'flowbite-react';
import DropdownButton from './dropdownButton';
import { useRouter } from 'next/navigation'

export default function AppNavbar() {
    const cookies = useCookies();
    const router = useRouter()

    console.log(WalletNetwork)

    let publicKey = cookies.get('publicAddress')
    
    async function ConnectWallet() {       
        const FREIGHTER_ID = 'freighter'; 
        const kit = new StellarWalletsKit({
            network: WalletNetwork.TESTNET,
            selectedWalletId: FREIGHTER_ID,
            modules: allowAllModules(),
          });
        
        publicKey = await kit.getPublicKey();
        //console.log(publicKey)
    
        cookies.set('publicAddress', publicKey)
        router.refresh()

    }

    return (
      <Navbar fluid className="py-3 ">
      <Navbar.Brand href="/">
          <Image
            src={Logo}
            width="170"
            className="h-[30px] sm:h-[32px] w-[150px] sm:w-[160px] mb-1"
            alt="xycloans Logo"
          />
        </Navbar.Brand>
      <div className="flex md:order-2">
        {!publicKey && <Button onClick={ConnectWallet} className="mr-2 bg-[#12eab7] enabled:hover:bg-primary font-semibold text-black">Connect Wallet</Button>}
        {publicKey && <DropdownButton _publicKey={publicKey.substring(0, 4) + "..." + publicKey.slice(-4)}></DropdownButton>}
        {/*<p>{publicKey.substring(0, 10) + "..."}</p>*/}
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link href="/" className="md:hover:text-[#14b780]">
          Home
        </Navbar.Link>
        <Navbar.Link href="/pools" className="md:hover:text-[#14b780]">Pools</Navbar.Link>
        <Navbar.Link href="/ecosystem" className="md:hover:text-[#14b780]">Explorer</Navbar.Link>
        <Navbar.Link href="https://docs.xycloans.app" className="md:hover:text-[#14b780]">Documentation</Navbar.Link>
      </Navbar.Collapse>
    </Navbar>

    )
}

