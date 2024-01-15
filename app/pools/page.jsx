import { StrKey } from "stellar-sdk";

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

export default async function Pools() {
        
    const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
    const fromStringToKey = (key) => (
        StrKey.encodeContract(fromHexString(`${key}`))
    )
    /*
    console.log(contract)
    */
   const nodes = await fetchPools()
   // console.log(nodes)

    return (
        <main>
            <div>
                <h2 className="text-black text-opacity-80 text-4xl py-8">Active Pools</h2>
            </div>
            {nodes &&
                <div>
                    <div className="relative overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                            <thead className="text-xs text-gray-500 bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3">
                                        Pool Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Asset Id
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Total Supplied
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Historical APY
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Historical Total Borrowed
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            {nodes.map((node) => (
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                            {fromStringToKey(node.contract.slice(2)).substring(0, 10) + "..."}
                                        </th>
                                        <td className="px-6 py-4">
                                            {fromStringToKey(node.asset.slice(2)).substring(0, 10) + "..."}
                                        </td>
                                        <td className="px-6 py-4">

                                        </td>
                                        <td className="px-6 py-4">

                                        </td>
                                        <td className="px-6 py-4">

                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={`/pools/${fromStringToKey(node.contract.slice(2))}`} className="font-medium text-[#0fd7a9] hover:underline">Details</a>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>}
        </main>
    )
}