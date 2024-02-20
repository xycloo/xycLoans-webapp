
'use client';

import { Dropdown } from 'flowbite-react';
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from 'react-icons/hi';
import { useCookies } from 'next-client-cookies';
import { useRouter } from 'next/navigation'

export default function DropdownButton(props) {

  const cookiesStore = useCookies()
  const router = useRouter()

  function handleLogout() {
    cookiesStore.remove('publicAddress')
    router.push('/')
    router.refresh()
  }

  return (
    <Dropdown color="green" label={props._publicKey}>
      {/*<Dropdown.Header>
        <span className="block text-sm">Bonnie Green</span>
        <span className="block truncate text-sm font-medium">bonnie@flowbite.com</span>
      </Dropdown.Header>
      <Dropdown.Item icon={HiViewGrid}>Dashboard</Dropdown.Item>
      <Dropdown.Item icon={HiCog}>Settings</Dropdown.Item>
      <Dropdown.Item icon={HiCurrencyDollar}>Earnings</Dropdown.Item>
  <Dropdown.Divider />*/}
      <Dropdown.Item icon={HiLogout} onClick={handleLogout} >Sign out</Dropdown.Item>
    </Dropdown>
  );
}
