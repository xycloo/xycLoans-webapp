import AggregatedMetrics from "./aggregatedMetrics";
import { fetchPools } from "./fetchPools";
import GetPools from "./getPools";

export default async function Pools() {

    const data = await fetchPools()

    return (
        <main>
            <div>
                <h2 className="text-[#14b780] font-bold text-4xl pt-8 pb-4">Active Pools</h2>
                <div className="w-max">
                <div className="pb-16 text-center">
                    <p className="text-sm">Total market size</p>
                    <AggregatedMetrics data={data}/>
                </div>
                </div>
            </div>
            <GetPools data={data}/>
        </main>
    )
}