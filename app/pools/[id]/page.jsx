'use client'

import { StrKey } from "stellar-sdk";
import { useCookies } from 'next-client-cookies'
import Deposit from "./deposit";


async function fetchPools() {
    const res = await fetch('http://172.232.157.194:5000/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: `query MyQuery {
  allZephyr89Cec70B6D142Ff7Ff5E78A6171730Ccs {
    nodes {
      contract
      asset
    }
  }
}`})
    })

    const json_res = await res.json();
    const nodes = json_res.data.allZephyr89Cec70B6D142Ff7Ff5E78A6171730Ccs.nodes;

    return(
        nodes
    )
}

export default async function PoolDetails({ params }) {

    const cookies = useCookies()
    
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    const nodes = await fetchPools()

    const found = nodes.find(obj => {
        return fromStringToKey(obj.contract.slice(2)) === params.id;
      });

    const publicKey = cookies.get('publicAddress')
    console.log(publicKey)
    
    

    return (
        <div>
            {found &&
                <div>
                    <p>Pool Id: {fromStringToKey(found.contract.slice(2))}</p>
                    <p>Asset: {fromStringToKey(found.asset.slice(2))}</p>
                    <Deposit contractId={params.id} publicKey={publicKey} />
                </div>}
        </div>
    )
}