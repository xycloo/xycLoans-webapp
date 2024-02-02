
'use client';

import { Dropdown } from 'flowbite-react';
import { HiCog, HiCurrencyDollar, HiLogout, HiViewGrid } from 'react-icons/hi';

export default function DropdownButton(props) {
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
      <Dropdown.Item icon={HiLogout} as="a" href="../logout">Sign out</Dropdown.Item>
    </Dropdown>
  );
}
